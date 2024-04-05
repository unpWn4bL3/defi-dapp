import React, { useState, useEffect } from 'react';
import { MerchantService } from '../services/merchantService';

// 定义接口
interface MerchantDisplayProps {
    id: string;
    name: string;
    power: number;
}

// 定义组件
const MerchantDisplay: React.FC<{ merchant: MerchantDisplayProps }> = ({ merchant }) => {
    return (
        <div className="w-100 mx-auto bg-gradient-to-r from-yellow-300 to-red-300 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        ID: {merchant.id}
                    </div>
                    <div className="block mt-1 text-lg leading-tight font-medium text-black">
                        {merchant.name}
                    </div>
                    <p className="mt-2 text-pink-600">
                        Power: {merchant.power?.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

interface MerchantProps {
    id: string,
    service: MerchantService,
}

const Merchant: React.FC<MerchantProps> = ({ id, service }) => {
    const [merchantData, setMerchantData] = useState<MerchantDisplayProps | null>(null);

    useEffect(() => {
        service.QueryMerchant(id)
            .then((val) => {
                const fields = (val.data?.content! as any).fields;
                setMerchantData({
                    id: fields.id.id,
                    name: fields.name,
                    power: fields.power,
                });
            });
    }, [id, service]);

    if (!merchantData) {
        return <div>Loading...</div>;
    }

    return (
        <MerchantDisplay merchant={merchantData}></MerchantDisplay>
    );
}

export { Merchant };
