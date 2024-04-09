module suimarket::merchantmarket {
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::bag::{Self, Bag};
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};
    use sui::kiosk_extension::{Self as ke};
    use sui::transfer_policy::{Self as tp};
    use sui::package::{Self, Publisher};

    use suimarket::merchant::{Merchant};

    // Constants
    const E_COIN_VALUE_INCORRECT: u64 = 0;

    // Structs
    /// Represents a merchant listing event.
    public struct MerchantListed has copy, drop {
        order_id: u64,
        seller: address,
    }

    /// Represents a merchant purchase event.
    public struct MerchantBought has copy, drop {
        merchant_id: ID,
        buyer: address,
    }

    /// Represents the market for buying and selling merchants.
    public struct Market has key {
        id: UID,
        listings: Table<u64, Listing>,
        profits: Table<address, Coin<SUI>>,
        order_id: u64,
    }

    /// Represents a merchant listing.
    public struct Listing has key, store {
        id: UID,
        price: u64,
        merchant: Merchant,
        owner: address,
    }

     /// Publisher capability object
    public struct HousePublisher has key { id: UID, publisher: Publisher }

     // one time witness 
    public  struct MERCHANTMARKET has drop {}

    // kiosk_extension witness
    public struct HouseKioskExtWitness has drop {}

    // =================== Initializer ===================
    fun init(otw: MERCHANTMARKET, ctx: &mut TxContext) {
        // define the publisher
        let publisher_ = package::claim<MERCHANTMARKET>(otw, ctx);
        // wrap the publisher and share.
        transfer::share_object(HousePublisher {
            id: object::new(ctx),
            publisher: publisher_
        }); 
    }

    // === Public-Mutative Functions ===

    /// Users can create new kiosk for marketplace 
    public fun new(ctx: &mut TxContext) {
        let(mut kiosk, kiosk_cap) = kiosk::new(ctx);
        // share the kiosk
        let witness = HouseKioskExtWitness {};
        // create and extension for using bag
        ke::add<HouseKioskExtWitness>(witness, &mut kiosk, &kiosk_cap, 00, ctx);
        transfer::public_share_object(kiosk);
        // you can send the cap with ptb
        transfer::public_transfer(kiosk_cap, ctx.sender());
    }
    // create any transferpolicy for rules 
    public fun new_policy(publish: &HousePublisher, ctx: &mut TxContext ) {
        // set the publisher
        let publisher = get_publisher(publish);
        // create an transfer_policy and tp_cap
        let (transfer_policy, tp_cap) = tp::new<Merchant>(publisher, ctx);
        // transfer the objects 
        transfer::public_transfer(tp_cap, tx_context::sender(ctx));
        transfer::public_share_object(transfer_policy);
    }
    
    /// Lists a merchant for sale in the market.
    /// Returns the order ID of the listing.
    public entry fun sell_merchant(
        market: &mut Market,
        merchant: Merchant,
        price: u64,
        ctx: &mut TxContext,
    ) : u64 {
        let seller = tx_context::sender(ctx);
        let listing = Listing {
            id: object::new(ctx),
            price,
            merchant,
            owner: seller,
        };
        
        let sold_id = market.order_id;
        table::add(&mut market.listings, sold_id, listing);
        market.order_id = sold_id + 1;
        
        event::emit(MerchantListed {
            order_id: sold_id,
            seller,
        });
        sold_id
    }
    /// Buys a merchant from the market using the provided payment.
    public entry fun buy_merchant(
        market: &mut Market,
        order_id: u64,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        let Listing { id, price, merchant, owner } = table::remove(&mut market.listings, order_id);
        assert!(coin::value(&payment) == price, E_COIN_VALUE_INCORRECT);

        if (table::contains(&market.profits, owner)) {
            coin::join(
                table::borrow_mut(&mut market.profits, owner),
                payment,
            )
        } else {
            table::add(&mut market.profits, owner, payment)
        };
        
        object::delete(id);
        let buyer = tx_context::sender(ctx);
        event::emit(MerchantBought {
            merchant_id: object::id(&merchant),
            buyer,
        });

        transfer::public_transfer(merchant, buyer);
    }

    /// Retrieves the profits for the sender from the market.
    public entry fun get_profits(
        market: &mut Market,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let coin = table::remove(&mut market.profits, sender);
        transfer::public_transfer(coin, sender);
    }

    // return the publisher
    fun get_publisher(shared: &HousePublisher) : &Publisher {
        &shared.publisher
     }
}
