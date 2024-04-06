import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_CLIENT } from "./suiService";
import { AuthService } from "./authService";

export class MarketService {
    package_id: string;
    constructor(package_id: string) {
        this.package_id = package_id;
    }
    async sell_merchant(market_id: string, merchant_id: string, price: number, setOrderID: (id: number) => {}) {
        const market_data = await SUI_CLIENT.getObject({
            id: market_id,
            options: {
                showContent: true,
            }
        })
        const order_id = (market_data.data?.content! as any).fields.order_id;
        console.log("order id: ", order_id);
        setOrderID(order_id);
        const txb = new TransactionBlock();
        const txData = {
            target: `${this.package_id}::merchantmarket::sell_merchant`,
            arguments: [
                txb.object(market_id),
                txb.object(merchant_id),
                txb.pure(price),
            ]
        }
        return this.makeMoveCall(txData, txb);
    }

    async buy_merchant(market_id: string, order_id: number, coin_id: string) {
        const txb = new TransactionBlock();
        const txData = {
            target: `${this.package_id}::merchantmarket::buy_merchant`,
            arguments: [
                txb.object(market_id),
                txb.pure(order_id),
                txb.object(coin_id),
            ]
        }
        return this.makeMoveCall(txData, txb);
    }

    async get_profits(market_id: string) {
        const txb = new TransactionBlock();
        const txData = {
            target: `${this.package_id}::merchantmarket::get_profits`,
            arguments: [
                txb.object(market_id),
            ]
        }
        return this.makeMoveCall(txData, txb)
    }

    private async makeMoveCall(txData: any, txb: TransactionBlock) {
        const keypair = AuthService.getEd25519Keypair();
        const sender = AuthService.walletAddress();
        txb.setSender(sender);
        txb.moveCall(txData);
        const { bytes, signature: userSignature } = await txb.sign({
            client: SUI_CLIENT,
            signer: keypair,
        })
        console.log(userSignature);
        const zkLoginSignature = await AuthService.generateZkLoginSignature(userSignature);
        return SUI_CLIENT.executeTransactionBlock({
            transactionBlock: bytes,
            signature: zkLoginSignature,
        });
    }
}