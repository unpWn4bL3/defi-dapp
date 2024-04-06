// async sell_merchant(merchant_id: string, price: number, setOrderID: (id: number) => {}) 
// async buy_merchant(order_id: number, coin_id: string)
// async get_profits()

import React, { useState } from "react";
import { MarketService } from "../services/marketService"

interface MarketProps {
    service: MarketService;
}

const SellMerchant: React.FC<MarketProps> = ({ service }) => {
    const [merchantID, setMerchantID] = useState("");
    const [price, setPrice] = useState(0);
    const [orderID, setOrderID] = useState<number | null>(null);

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (merchantID !== "" && price > 0) {
            const price_in_mist = price * (10 ** 9)
            service.sell_merchant(merchantID, price_in_mist, setOrderID);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-indigo-400">
            <form className="m-4 w-full max-w-xs" onSubmit={onSubmit}>
                <input className="w-full p-2 mb-2 border border-gray-300 rounded" type="text" value={merchantID} onChange={(e) => setMerchantID(e.target.value)} placeholder="merchant to sell" />
                <input className="w-full p-2 mb-2 border border-gray-300 rounded" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="in how much price?" />
                <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" type="submit">Sell</button>
            </form>
            <p className="mt-4">Last sold orderID: {orderID}</p>
        </div>
    )
}

export { SellMerchant }