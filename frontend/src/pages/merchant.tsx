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
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        ID: {merchant.id}
                    </div>
                    <div className="block mt-1 text-lg leading-tight font-medium text-black">
                        {merchant.name}
                    </div>
                    <p className="mt-2 text-slate-500">
                        Power: {merchant.power.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export { MerchantCard };
