import { AuthService } from "./authService";
import { SUI_CLIENT } from "./suiService";

export class MerchantService {
    package_id: string;

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
        let ownedObjects = SUI_CLIENT.getOwnedObjects({
            owner: sender
        });
        let ownedObjectsDetails = await Promise.all(
            (await ownedObjects).data.map(async (obj) =>
                await this.QueryMerchant(obj.data?.objectId!)
            )
        );
        return ownedObjectsDetails
            .filter(obj => obj.data?.type === `${this.package_id}::merchant::Merchant`)
            .map(obj => obj.data?.objectId);
    }
}