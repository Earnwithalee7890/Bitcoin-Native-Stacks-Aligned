import { useState, useEffect } from 'react';
import { COINGECKO_API_BASE } from '@/config/constants';
import { MarketData } from '@/types/dashboard';

export function useMarketData() {
    const [marketData, setMarketData] = useState<MarketData | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const priceRes = await fetch(`${COINGECKO_API_BASE}/simple/price?ids=blockstack&vs_currencies=usd&include_24hr_change=true`);
                const priceJson = await priceRes.json();
                setMarketData({
                    price: priceJson.blockstack.usd,
                    change: priceJson.blockstack.usd_24h_change
                });
            } catch (e) {
                console.error("Market data fetch error:", e);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    return marketData;
}
