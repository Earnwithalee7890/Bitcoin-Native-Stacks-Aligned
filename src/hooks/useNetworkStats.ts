import { useState, useEffect } from 'react';
import { HIRO_API_BASE } from '@/config/constants';
import { NetworkStats } from '@/types/dashboard';

export function useNetworkStats() {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);

    useEffect(() => {
        const fetchNetwork = async () => {
            try {
                const { api } = await import("@earnwithalee/stacksrank-sdk");
                const height = await api.getBlockHeight();
                setBlockHeight(height);

                setNetworkStats({
                    tps: 0.45,
                    volume_24h: "1.2M STX"
                });
            } catch (e) {
                console.error("Network stats fetch error:", e);
            }
        };

        fetchNetwork();
        const interval = setInterval(fetchNetwork, 60000);
        return () => clearInterval(interval);
    }, []);


    return { blockHeight, networkStats };
}
