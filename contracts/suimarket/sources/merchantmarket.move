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
    
    /// Represents a merchant listing.
    public struct Listing has key, store {
        id: UID,
        merchant: Merchant,
        owner: address,
    }

     /// Publisher capability object
    public struct HousePublisher has key { id: UID, publisher: Publisher }

     // one time witness 
    public  struct MERCHANTMARKET has drop {}

    // kiosk_extension witness
    public struct MerchantKioskExtWitness has drop {}

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
        let witness = MerchantKioskExtWitness {};
        // create and extension for using bag
        ke::add<MerchantKioskExtWitness>(witness, &mut kiosk, &kiosk_cap, 00, ctx);
        transfer::public_share_object(kiosk);
        // you can send the cap with ptb
        transfer::public_transfer(kiosk_cap, ctx.sender());
    }
    // create any transferpolicy for rules 
    public fun new_policy(publish: &HousePublisher, ctx: &mut TxContext ) {
        // set the publisher
        let publisher = get_publisher(publish);
        // create an transfer_policy and tp_cap
        let (transfer_policy, tp_cap) = tp::new<Listing>(publisher, ctx);
        // transfer the objects 
        transfer::public_transfer(tp_cap, tx_context::sender(ctx));
        transfer::public_share_object(transfer_policy);
    }

    public fun wrap(item: Merchant, ctx: &mut TxContext) {
        let listing_ = Listing {
            id: object::new(ctx),
            merchant: item,
            owner: ctx.sender()
        };
        transfer::public_transfer(listing_, ctx.sender());
    }

    public fun unwrap(item: Listing, ctx: &mut TxContext) {
        let Listing {
            id,
            merchant,
            owner: _
        }  = item;
        object::delete(id);
        transfer::public_transfer(merchant, ctx.sender());
    }

    

    // return the publisher
    fun get_publisher(shared: &HousePublisher) : &Publisher {
        &shared.publisher
     }
}
