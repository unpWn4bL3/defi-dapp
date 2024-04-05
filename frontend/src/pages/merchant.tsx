import React from 'react';

// 定义接口
interface Merchant {
    id: string;
    name: string;
    power: number;
}

// 定义组件
const MerchantCard: React.FC<{ merchant: Merchant }> = ({ merchant }) => {
    return (
        <div className="w-96 mx-auto bg-gradient-to-r from-yellow-300 to-red-300 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        ID: {merchant.id}
                    </div>
                    <div className="block mt-1 text-lg leading-tight font-medium text-black">
                        {merchant.name}
                    </div>
                    <p className="mt-2 text-pink-600">
                        Power: {merchant.power.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export { MerchantCard };
