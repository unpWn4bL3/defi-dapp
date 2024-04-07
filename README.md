# A defi-dapp for merchant hiring & trading

## How to deploy

All following instruction is tested on **devnet**

1. Configure your Google OAuth, add `http://localhost:3000` to allowed JavaScript origin and redirect URL

2. Build `contracts/soldier` and publish it

3. Set address of `contracts/suimarket` of `soldier` in `[addresses]` section, build and publish it

4. Create a merchant market

5. In `frontend/`, use `npm`, `pnpm` or `yarn` to install dependency

6. Create a `.env` file in `frontend/`, fill the content

```
REACT_APP_CLIENT_ID="<YOUR-GOOGLE-OAUTH-CLIENTID>"
REACT_APP_PROVER_URL="https://prover-dev.mystenlabs.com/v1"
REACT_APP_REDIRECT_URL="http://localhost:3000"
REACT_APP_OPENID_PROVIDER_URL="https://accounts.google.com/.well-known/openid-configuration"
REACT_APP_FULLNODE_URL="https://fullnode.devnet.sui.io:443"
REACT_APP_SOLDIER_PACKAGE_ID="<SOLDIER-PACKAGE-ID>"
REACT_APP_MARKET_PACKAGE_ID="<MARKET-PACKAGE-ID>"
REACT_APP_MARKET_ID="<MARKET-ID>"
```

7. `npm run start` or `pnpm run start` to run the client