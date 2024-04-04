module suimarket::market {
    use sui::coin::{Self,Coin};
    use sui::bag::{Self,Bag};
    use sui::object::{Self,UID,ID};
    use sui::table::{Self,Table};
    use sui::tx_context::{Self,TxContext};
    use sui::transfer;
    use sui::dynamic_object_field as ofield;

    const ENotOwner:u64 = 0;
    const EAmountIncorrect:u64 = 1;

    public struct Marketplace<phantom COIN> has key {
        id: UID,
        items: Bag,
        payments: Table<address, Coin<COIN>>,
    }

    public struct Listing has key,store {
        id: UID,
        ask: u64,
        owner: address,
    }

    #[allow(unused_function)]
    public entry fun create<COIN>(ctx:&mut TxContext){
        transfer::share_object(Marketplace{
            id: object::new(ctx),
            items: bag::new(ctx),
            payments: table::new<address,Coin<COIN>>(ctx),
        })
    }

    public entry fun list<T:key + store, COIN>(
        marketplace: &mut Marketplace<COIN>,
        item: T,
        ask: u64,
        ctx: &mut TxContext,
    ) {
        let item_id = object::id(&item);
        let mut listing = Listing{
            id: object::new(ctx),
            ask:ask,
            owner: tx_context::sender(ctx),
        };
        ofield::add(&mut listing.id,true,item);
        bag::add(&mut marketplace.items,item_id,listing);
    }

    fun delist<T: key+ store, COIN>(
        marketplace:&mut Marketplace<COIN>,
        item_id:ID,
        ctx:&TxContext,
    ):T {
        let Listing{mut id,owner,ask:_} = bag::remove(&mut marketplace.items, item_id);
        assert!(tx_context::sender(ctx)==owner, ENotOwner);
        let item = ofield::remove(&mut id, true);
        object::delete(id);
        item
    }

    public entry fun delist_and_take<T: key+ store, COIN>(
        marketplace:&mut Marketplace<COIN>,
        item_id:ID,
        ctx:&mut TxContext,
    ) {
        let item = delist<T,COIN>(marketplace, item_id, ctx);
        transfer::public_transfer(item, tx_context::sender(ctx));
    }

    fun buy<T: key+ store, COIN>(
        marketplace:&mut Marketplace<COIN>,
        item_id:ID,
        paid: Coin<COIN>,
    ): T {
        let Listing{mut id,ask,owner} = bag::remove(&mut marketplace.items, item_id);
        assert!(ask == coin::value(&paid),EAmountIncorrect);
        if (table::contains<address,Coin<COIN>>(&mut marketplace.payments,owner)) {
            coin::join(
                table::borrow_mut<address, Coin<COIN>>(&mut marketplace.payments,owner),
                paid,
            );
        } else{
            table::add(&mut marketplace.payments,owner,paid);
        };
        let item = ofield::remove(&mut id, true);
        object::delete(id);
        item
    }

    public entry fun buy_and_take<T: key+ store, COIN>(
        marketplace:&mut Marketplace<COIN>,
        item_id:ID,
        paid: Coin<COIN>,
        ctx: &mut TxContext,
    ) {
        transfer::public_transfer(
            buy<T,COIN>(marketplace,item_id,paid), 
            tx_context::sender(ctx)
        );
    }

    fun take_profits<COIN>(
        marketplace:&mut Marketplace<COIN>,
        ctx: &mut TxContext,
    ): Coin<COIN> {
        table::remove<address, Coin<COIN>>(&mut marketplace.payments, tx_context::sender(ctx))
    }

    public entry fun take_profits_and_keep<COIN>(
        marketplace:&mut Marketplace<COIN>,
        ctx: &mut TxContext,
    ) {
        transfer::public_transfer(
            take_profits(marketplace, ctx),
            tx_context::sender(ctx),
        )
    }
}