RUST_LOG="off,sui_node=info" gg sui-test-validator &
curl --location --request POST 'http://127.0.0.1:9123/gas' --header 'Content-Type: application/json' \
    --data-raw '{
        "FixedAmountRequest": {
            "recipient": "0xe6cebcd19600dbbb43bca18ef925aed0b88a9f53d783b75786afa95aeb317103"
        }
    }'
sui client switch --env local
sui client faucet