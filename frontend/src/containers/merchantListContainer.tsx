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
        <MerchantList merchants={merchants} />
    )
}

export { MerchantListContainer }