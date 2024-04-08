module soldier::merchant {
    use std::string::{Self as String, String};
    use sui::clock::{Self as Clock, Clock};

    public struct Merchant has key, store {
        id: UID,
        name: String,
        power: u64,
    }

    const POWER_LIMIT_MAX: u64 = 0xdeadbeef;

    /// Creates a new merchant with the provided name and calculates its power based on the current time.
    /// The merchant is then transferred to the sender.
    pub entry fun new_merchant(name_vec: vector<u8>, clock: &Clock, ctx: &mut TxContext) {
        let id = object::new(ctx);
        let name = string::utf8(name_vec);
        let time = clock::timestamp_ms(clock);
        let power: u64 = time % POWER_LIMIT_MAX;
        transfer::public_transfer(
            Merchant {
                id,
                name,
                power,
            },
            tx_context::sender(ctx),
        );
    }
}
