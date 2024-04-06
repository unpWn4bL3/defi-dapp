import { TransactionBlock } from "@mysten/sui.js/transactions";
import { AuthService } from "./authService";
import { SUI_CLIENT } from "./suiService";

const SOLDIER_PACKAGE_ID = process.env.REACT_APP_SOLDIER_PACKAGE_ID!;

export class MerchantService {
    package_id: string;
    clock_id: string = "0x0000000000000000000000000000000000000000000000000000000000000006";
    constructor(package_id: string) {
        this.package_id = package_id;
    }

    async QueryMerchant(id: string) {
        const object = await SUI_CLIENT.getObject({
            id,
            options: {
                showType: true,
                showContent: true,
            }
        });
        return object;
    }

    async QueryAllMerchants() {
        const sender = AuthService.walletAddress();
        console.log(sender)
        let ownedObjects = SUI_CLIENT.getOwnedObjects({
            owner: sender
        });
        console.log(ownedObjects)
        let ownedObjectsDetails = await Promise.all(
            (await ownedObjects).data.map(async (obj) =>
                await this.QueryMerchant(obj.data?.objectId!)
            )
        );
        console.log(ownedObjectsDetails);
        return ownedObjectsDetails
            .filter(obj => obj.data?.type === `${this.package_id}::merchant::Merchant`)
            .map(obj => {
                const fields = (obj.data?.content! as any).fields;
                return {
                    id: fields.id.id,
                    name: fields.name,
                    power: fields.power,
                }
            });
    }

    async NewMerchant(name: string) {
        const txb = new TransactionBlock();
        const txData = {
            target: `${SOLDIER_PACKAGE_ID}::merchant::new_merchant`,
            arguments: [
                txb.pure.string(name),
                txb.pure.address(this.clock_id),
            ],
        }
        return this.makeMoveCall(txData, txb);
    }

    private async makeMoveCall(txData: any, txb: TransactionBlock) {
        const keypair = AuthService.getEd25519Keypair();
        const sender = AuthService.walletAddress();
        txb.setSender(sender);
        txb.moveCall(txData);
        const { bytes, signature } = await txb.sign({
            client: SUI_CLIENT,
            signer: keypair,
        })
        const zkLoginSignature = await AuthService.generateZkLoginSignature(signature);
        return SUI_CLIENT.executeTransactionBlock({
            transactionBlock: bytes,
            signature: zkLoginSignature,
        });
    }
}