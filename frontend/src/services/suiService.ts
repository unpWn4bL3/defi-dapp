import { SuiClient } from '@mysten/sui.js/client'
// node rpc
export const REACT_APP_FULLNODE_URL: string = process.env.REACT_APP_FULLNODE_URL!

// sui package id
export const REACT_APP_SOLDIER_PACKAGE_ID = process.env.REACT_APP_SOLDIER_PACKAGE_ID!
export const REACT_APP_MARKET_PACKAGE_ID = process.env.REACT_APP_MARKET_PACKAGE_ID!

export const SUI_CLIENT = new SuiClient({ url: REACT_APP_FULLNODE_URL })

export class SuiService {
  async getFormattedBalance(owner: string) {
    const res = await SUI_CLIENT.getBalance({
      owner
    })
    return Number(Number(res.totalBalance) / 1000_000_000).toFixed(2)
  }
}
