import { SUI_CLIENT } from "./suiService";

export async function TestMerchantService() {
    const data = await SUI_CLIENT.getObject({
        id: "0xf306cdc8137f82b42f8ca165526f47d49acbe945104a43a0f2004985a53d5fbc"
    });
    console.log(data);
}