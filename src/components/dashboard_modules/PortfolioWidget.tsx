"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, DollarSign, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useStacks } from "@/components/StacksProvider";
import { useMarketData } from "@/hooks/useMarketData";
import { HIRO_API_BASE } from "@/config/constants";

interface PortfolioWidgetProps {
    variants?: any;
}

export function PortfolioWidget({ variants }: PortfolioWidgetProps) {
    const { userData, isConnected } = useStacks();
    const marketData = useMarketData();
    const [stxBalance, setStxBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isConnected || !userData?.profile?.stxAddress?.mainnet) {
            setStxBalance(null);
            return;
        }

        const fetchBalance = async () => {
            setIsLoading(true);
            try {
                const address = userData.profile.stxAddress.mainnet;
                const response = await fetch(`${HIRO_API_BASE}/v2/accounts/${address}?proof=0`);
                const data = await response.json();
                // Balance is in microSTX, convert to STX
                const balance = parseInt(data.balance, 10) / 1_000_000;
                setStxBalance(balance);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
                setStxBalance(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [isConnected, userData]);

    const usdValue = stxBalance && marketData?.price ? stxBalance * marketData.price : null;
    const priceChange = marketData?.change || 0;

    if (!isConnected) {
        return (
            <motion.div variants={variants} className="glass-card p-8 border border-white/5">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-[#5546FF]/20 rounded-2xl flex items-center justify-center">
                        <Wallet className="w-7 h-7 text-[#5546FF]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Portfolio</h3>
                        <p className="text-xs text-gray-500 font-medium">Connect to view balance</p>
                    </div>
                </div>
                <div className="text-center py-8 opacity-50">
                    <p className="text-sm text-gray-500 font-medium">Wallet not connected</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={variants}
            className="glass-card p-8 border border-white/5 bg-gradient-to-br from-[#5546FF]/5 to-transparent relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#5546FF]/10 blur-3xl rounded-full -mr-20 -mt-20" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-[#5546FF]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="w-7 h-7 text-[#5546FF]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Portfolio</h3>
                        <p className="text-xs text-gray-500 font-medium">Your STX Holdings</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-[#5546FF]/30 border-t-[#5546FF] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* STX Balance */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-4 h-4 text-gray-500" />
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                    STX Balance
                                </p>
                            </div>
                            <p className="text-4xl font-black text-white">
                                {stxBalance !== null ? stxBalance.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }) : "---"}
                            </p>
                            <p className="text-sm text-gray-500 font-medium mt-1">STX</p>
                        </div>

                        {/* USD Value */}
                        {usdValue !== null && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                        Portfolio Value
                                    </p>
                                </div>
                                <p className="text-3xl font-black text-white">
                                    ${usdValue.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <p className="text-sm text-gray-500 font-medium">USD</p>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${priceChange >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                                        }`}>
                                        <TrendingUp className={`w-3 h-3 ${priceChange < 0 ? "rotate-180" : ""}`} />
                                        <span className="text-xs font-black">
                                            {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Market Price */}
                        {marketData?.price && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                                        STX Price
                                    </p>
                                    <p className="text-lg font-black text-white">
                                        ${marketData.price.toFixed(3)}
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                                        24h Change
                                    </p>
                                    <p className={`text-lg font-black ${priceChange >= 0 ? "text-green-500" : "text-red-500"
                                        }`}>
                                        {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 font-medium text-center">
                        Balance updates every 30 seconds
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
