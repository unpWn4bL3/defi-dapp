#[test_only]
module suimarket::test_market {
    use sui::test_scenario::{Self as ts, next_tx, Scenario};
    use sui::transfer;
    use sui::test_utils::{assert_eq};
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};
    use sui::transfer_policy::{Self as tp, TransferPolicy, TransferPolicyCap};
    use sui::object;
    use sui::sui::SUI;
    use sui::coin::{mint_for_testing};
    use sui::coin::{Self, Coin}; 
    use std::string::{Self};
    use std::vector;
    // use std::option::{Self};
    // use std::debug;

    use suimarket::merchantmarket::{Self as market, Listing, MarketPublisher};
    use suimarket::merchant::{Self, Merchant};
    use suimarket::floor_price_rule::{Self};
    use suimarket::royalty_rule::{Self};
    use suimarket::helpers::{init_test_helper};

    const ADMIN: address = @0xA;
    const TEST_ADDRESS1: address = @0xB;
    const TEST_ADDRESS2: address = @0xC;


    #[test]
    public fun test_create_kiosk() {
        let mut scenario_test = init_test_helper();
        let scenario = &mut scenario_test;
        // Create an kiosk for marketplace
        next_tx(scenario, TEST_ADDRESS1);
        {
           let cap =  market::new(ts::ctx(scenario));
           transfer::public_transfer(cap, TEST_ADDRESS1);
        };
        // Create an new policy 
        next_tx(scenario, TEST_ADDRESS1);
        {
            let publisher = ts::take_shared<MarketPublisher>(scenario);
            market::new_policy(&publisher, ts::ctx(scenario));

            ts::return_shared(publisher);
        };
        // Create royalty rule
        next_tx(scenario, TEST_ADDRESS1);
        {
           let mut policy = ts::take_shared<TransferPolicy<Listing>>(scenario);
           let policy_cap = ts::take_from_sender<TransferPolicyCap<Listing>>(scenario);

             // 1% royalty; min 0 MIST
            royalty_rule::add(&mut policy, &policy_cap, 100, 0);

            ts::return_shared(policy);
            ts::return_to_sender(scenario, policy_cap);
        };

        // create an Merchant NFT
        next_tx(scenario, TEST_ADDRESS1);
        {
            let name = string::utf8(b"asd");

            merchant::new(name, ts::ctx(scenario));
        };
        // WRAP the object to Listing
        next_tx(scenario, TEST_ADDRESS1);
        {
            let item_ = ts::take_from_sender<Merchant>(scenario);
            market::wrap(item_, ts::ctx(scenario));
        };

        let nft_data = next_tx(scenario, TEST_ADDRESS1);
        
        // Place the Merchant NFT to kiosk
        next_tx(scenario, TEST_ADDRESS1);
        {
            let market_ = ts::take_from_sender<Listing>(scenario);
            let kiosk_cap = ts::take_from_sender<KioskOwnerCap>(scenario);
            let mut kiosk =  ts::take_shared<Kiosk>(scenario);
            // get item id from effects
            let id_ = ts::created(&nft_data);
            let item_id = vector::borrow(&id_, 0);
        
            kiosk::place(&mut kiosk, &kiosk_cap, market_);

            assert_eq(kiosk::item_count(&kiosk), 1);

            assert_eq(kiosk::has_item(&kiosk, *item_id), true);
            assert_eq(kiosk::is_locked(&kiosk, *item_id), false);
            assert_eq(kiosk::is_listed(&kiosk, *item_id), false);

            ts::return_shared(kiosk);
            ts::return_to_sender(scenario, kiosk_cap);
        };

        // List the market NFT to kiosk
        next_tx(scenario, TEST_ADDRESS1);
        {
            let kiosk_cap = ts::take_from_sender<KioskOwnerCap>(scenario);
            let mut kiosk =  ts::take_shared<Kiosk>(scenario);
            let price : u64 = 1000_000_000_000;
            // get item id from effects
            let id_ = ts::created(&nft_data);
            let item_id = vector::borrow(&id_, 0);
        
            kiosk::list<Listing>(&mut kiosk, &kiosk_cap, *item_id, price);

            assert_eq(kiosk::item_count(&kiosk), 1);

            assert_eq(kiosk::has_item(&kiosk, *item_id), true);
            assert_eq(kiosk::is_locked(&kiosk, *item_id), false);
            assert_eq(kiosk::is_listed(&kiosk, *item_id), true);

            ts::return_shared(kiosk);
            ts::return_to_sender(scenario, kiosk_cap);
        };

        // purchase the item with %1 royalty rule. 
        next_tx(scenario, TEST_ADDRESS2);
        {
            let mut kiosk =  ts::take_shared<Kiosk>(scenario);
            let mut policy = ts::take_shared<TransferPolicy<Listing>>(scenario);
            let price  = mint_for_testing<SUI>(1000_000_000_000, ts::ctx(scenario));
            // get item id from effects
            let id_ = ts::created(&nft_data);
            let item_id = vector::borrow(&id_, 0);
        
            let (item, mut request) = kiosk::purchase<Listing>(&mut kiosk, *item_id, price);
            let price2  = mint_for_testing<SUI>(10_000_000_000, ts::ctx(scenario));
            royalty_rule::pay(&mut policy, &mut request, price2);

            // confirm the request. Destroye the hot potato
            let (item_id, paid, from ) = tp::confirm_request(&policy, request);

            assert_eq(kiosk::item_count(&kiosk), 0);
            assert_eq(kiosk::has_item(&kiosk, item_id), false);

            transfer::public_transfer(item, TEST_ADDRESS2);
         
            ts::return_shared(kiosk);
            ts::return_shared(policy);
        };
         ts::end(scenario_test);
    }
}