module suimarket::merchant {
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};

    public struct Merchant has key, store {
        id: UID,
        name: String,
    }

    /// Creates a new merchant with the provided name and calculates its power based on the current time.
    /// The merchant is then transferred to the sender.
    public entry fun new(name: String, ctx: &mut TxContext) {
        let id = object::new(ctx);
        transfer::public_transfer(
            Merchant {
                id,
                name,
            },
            tx_context::sender(ctx),
        );
    }
}
