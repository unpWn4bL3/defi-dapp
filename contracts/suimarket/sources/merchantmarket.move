module suimarket::merchantmarket {
    use sui::table::{Self as Table, Table};
    use sui::coin::{Self as Coin, Coin};
    use sui::sui::SUI;
    use sui::event;
    use soldier::merchant::Merchant;

    const E_COIN_VALUE_INCORRECT: u64 = 0;

    public struct MerchantListed has copy, drop {
        order_id: u64,
        seller: address,
    }

    public struct MerchantBought has copy, drop {
        merchant_id: ID,
        buyer: address,
    }

    public struct Market has key {
        id: UID,
        listings: Table<u64, Listing>,
        profits: Table<address, Coin<SUI>>,
        order_id: u64,
    }

    public struct Listing has key, store {
        id: UID,
        price: u64,
        merchant: Merchant,
        owner: address,
    }

    public entry fun create_marketplace(ctx: &mut TxContext) {
        let id = object::new(ctx);
        let listings = table::new<u64, Listing>(ctx);
        let profits = table::new<address, Coin<SUI>>(ctx);
        transfer::share_object(Market {
            id,
            listings,
            profits,
            order_id: 0,
        });
    }

    public entry fun sell_merchant(
        market: &mut Market,
        merchant: Merchant,
        price: u64,
        ctx: &mut TxContext,
    ) -> u64 {
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

    public entry fun buy_merchant(
        market: &mut Market,
        order_id: u64,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        let Listing { id, price, merchant, owner } = table::remove(&mut market.listings, order_id);
        assert!(coin::value(&payment) == price, E_COIN_VALUE_INCORRECT);

        if table::contains(&market.profits, owner) {
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

    public entry fun get_profits(
        market: &mut Market,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let coin = table::remove(&mut market.profits, sender);
        transfer::public_transfer(coin, sender);
    }
}
