// async buy_merchant(order_id: number, coin_id: string)

import React, { useState } from "react";
import { MarketService } from "../services/marketService"

interface MarketProps {
    service: MarketService;
}

const SellMerchant: React.FC<MarketProps> = ({ service }) => {
    const [merchantID, setMerchantID] = useState("");
    const [price, setPrice] = useState(0);
    const [orderID, setOrderID] = useState<number | null>(null);

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (merchantID !== "" && price > 0) {
            const price_in_mist = price * (10 ** 9)
            await service.sell_merchant(merchantID, price_in_mist, setOrderID);
            window.location.reload();
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-indigo-400">
            <form className="m-4 w-full max-w-xs" onSubmit={onSubmit}>
                <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    type="text"
                    value={merchantID}
                    onChange={(e) => setMerchantID(e.target.value)}
                    placeholder="merchant to sell" />
                <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="in how much price?" />
                <button
                    className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    type="submit">Sell
                </button>
            </form>
            <p className="mt-0 w-48 h-12">Last sold orderID: {orderID}</p>
        </div>
    )
}

// async buy_merchant(order_id: number, coin_id: string)
const BuyMerchant: React.FC<MarketProps> = ({ service }) => {
    const [orderID, setOrderID] = useState<number>();
    const [coinID, setCoinID] = useState<string>();

    const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (orderID && coinID) {
            await service.buy_merchant(orderID, coinID);
            window.location.reload();
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-indigo-400">
            <form className="m-4 w-full max-w-xs" onSubmit={onSubmit}>
                <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    type="number"
                    value={orderID}
                    onChange={(e) => setOrderID(Number(e.target.value))}
                    placeholder="order id to buy" />
                <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    type="text"
                    value={coinID}
                    onChange={(e) => setCoinID(e.target.value)}
                    placeholder="coin id to pay" />
                <button
                    className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    type="submit">Buy
                </button>
                <p className="mt-4 w-48 h-12">Which is powerful?</p>
            </form>
        </div>
    )
}

// async get_profits()

const GetProfits: React.FC<MarketProps> = ({ service }) => {
    const onClick = async () => {
        await service.get_profits();
        window.location.reload();
    }

    return (
        <div className="m-0 flex flex-col items-center justify-center bg-indigo-400">
            <button
                className="w-full max-w-xs p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                onClick={onClick}
            >
                Get Profits
            </button>
        </div>
    )
}

export { SellMerchant, BuyMerchant, GetProfits }