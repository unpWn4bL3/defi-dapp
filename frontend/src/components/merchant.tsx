// merchant.tsx
import React from 'react';

interface MerchantProps {
    id: string;
    name: string;
    power: number;
}

const Merchant: React.FC<MerchantProps> = ({ id, name, power }) => {
    return (
        <div className="w-100 mx-auto bg-gradient-to-r from-yellow-300 to-red-300 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        ID: {id}
                    </div>
                    <div className="block mt-1 text-lg leading-tight font-medium text-black">
                        {name}
                    </div>
                    <p className="mt-2 text-pink-600">
                        Power: {"0x" + Number(power).toString(16)}
                    </p>
                </div>
            </div>
        </div>
    );
};

interface MerchantListProps {
    merchants: MerchantProps[];
}

const MerchantList: React.FC<MerchantListProps> = ({ merchants }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Merchant List</h2>
            <ul className="flex flex-col items-center space-y-6">
                {
                    merchants.map((merchant) => {
                        return <Merchant key={merchant.id} {...merchant} />
                    })
                }
            </ul>
        </div>
    );
};

export { Merchant, MerchantList };