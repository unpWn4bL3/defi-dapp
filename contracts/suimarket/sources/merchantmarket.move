module suimarket::merchantmarket {
    // use sui::object::{UID};
    use sui::table::{Self,Table};
    use sui::coin::{Self,Coin};
    // use sui::tx_context::{TxContext};
    // use sui::transfer;
    use sui::sui::SUI;
    use sui::event;
    use soldier::merchant::Merchant;

    const ECoinValueIncorrect:u64 = 0;

    public struct MerchantListed has copy, drop {
        order_id: u64,
        seller: address,
    }

    public struct MerchantBought has copy, drop {
        merchant_id: ID,
        buyer: address,
    }

    public struct Market has key{
        id: UID,
        listings: Table<u64,Lisitng>,
        profits: Table<address,Coin<SUI>>,
        order_id: u64,
    }

    public struct Lisitng has key, store{
        id: UID,
        price: u64,
        merchant: Merchant,
        owner: address,
    }

    public entry fun create_marketplace(ctx:&mut TxContext){
        let id = object::new(ctx);
        let listings = table::new<u64,Lisitng>(ctx);
        let profits = table::new<address,Coin<SUI>>(ctx);
        transfer::share_object(Market{
            id,
            listings,
            profits,
            order_id: 0,
        });
    }

    public entry fun sell_merchant(
        market:&mut Market,
        merchant: Merchant,
        price: u64,
        ctx:&mut TxContext,
    ):u64 {
        let seller = tx_context::sender(ctx);
        let listing = Lisitng{
            id: object::new(ctx),
            price,
            merchant,
            owner: seller,
        };
        let saled_id = market.order_id;
        table::add(&mut market.listings, saled_id,listing);
        market.order_id = saled_id + 1;

        event::emit(MerchantListed{
            order_id: saled_id,
            seller,
        });
        saled_id
    }

    public entry fun buy_merchant(
        market:&mut Market,
        order_id: u64,
        payment: Coin<SUI>,
        ctx:&mut TxContext,
    ) {
        let Lisitng { id, price, merchant, owner} = table::remove(&mut market.listings, order_id);
        assert!(coin::value(&payment) == price, ECoinValueIncorrect);
        
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
        event::emit(MerchantBought{
            merchant_id: object::id(&merchant),
            buyer: buyer,
        });
        transfer::public_transfer(merchant, buyer);
    }

    public entry fun get_profits(
        market:&mut Market,
        ctx:&mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let coin = table::remove(&mut market.profits, sender);
        transfer::public_transfer(coin,sender);
    }
}