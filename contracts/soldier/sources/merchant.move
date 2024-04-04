module soldier::merchant {
    // use sui::object::{Self,UID};
    // use sui::tx_context::{Self,TxContext};
    // use sui::transfer::{Self};
    use std::string::{Self,String};
    use sui::clock::{Self,Clock};

    public struct Merchant has key, store{
        id: UID,
        name: String,
        power: u64,
    }

    const POWER_LIMIT:u64 = 0xdeadbeefcafebabe;

    public entry fun new_merchant(name_vec:vector<u8>, clock: &Clock, ctx:&mut TxContext){
        let id = object::new(ctx);
        let name = string::utf8(name_vec);
        let time = clock::timestamp_ms(clock);
        let power:u64 = time % POWER_LIMIT;
        transfer::public_transfer(
            Merchant{
                id,
                name,
                power,
            },
            tx_context::sender(ctx),
        )
    }
}