import React, { useEffect, useState } from "react"
import { MerchantService } from "../services/merchantService"
import { MerchantList } from "../components/merchant";

interface MerchantProps {
    id: string;
    name: string;
    power: number;
}

interface MerchantListContainerProps {
    merchantService: MerchantService;
}

const MerchantCreateContainer: React.FC<MerchantListContainerProps> = ({ merchantService }) => {
    const [newMerchantName, setNewMerchantName] = useState("");

    return (
        <div className="mx-auto w-40 mt-8">
            <form className="flex">
                <input
                    className="m-4 bg-gray-200 border rounded"
                    type="text"
                    placeholder="new merchant name"
                    onChange={(event) => setNewMerchantName(event.target.value)} />
                <button
                    type="button"
                    className="mt-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => {
                        if (newMerchantName === "") {
                            return;
                        }
                        merchantService.NewMerchant(newMerchantName);
                        setNewMerchantName("");
                    }}>
                    Get new merchant
                </button>
            </form>
        </div>
    )
}

const MerchantListContainer: React.FC<MerchantListContainerProps> = ({ merchantService }) => {
    const [merchants, setMerchants] = useState<MerchantProps[]>([]);
    useEffect(() => {
        const fetchMerchants = async () => {
            return await merchantService.QueryAllMerchants();
        }
        fetchMerchants()
            .then(merchantsData => setMerchants(merchantsData))
    }, [merchantService])

    return (
        <div className="w-3/4">
            <MerchantCreateContainer merchantService={merchantService} />
            <MerchantList merchants={merchants} />
        </div>
    )
}

export { MerchantListContainer }