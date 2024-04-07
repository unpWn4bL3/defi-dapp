import { SuiClient } from '@mysten/sui.js/client'
// node rpc
export const FULLNODE_URL: string = process.env.REACT_APP_FULLNODE_URL!

// sui package id
export const SOLDIER_PACKAGE_ID = process.env.REACT_APP_SOLDIER_PACKAGE_ID!
export const MARKET_PACKAGE_ID = process.env.REACT_APP_MARKET_PACKAGE_ID!

export const SUI_CLIENT = new SuiClient({ url: FULLNODE_URL })

export class SuiService {
  async getFormattedBalance(owner: string) {
    const res = await SUI_CLIENT.getBalance({
      owner
    })
    return Number(Number(res.totalBalance) / 1000_000_000).toFixed(2)
  }

}
