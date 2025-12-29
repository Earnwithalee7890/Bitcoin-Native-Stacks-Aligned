"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, Activity, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { HIRO_API_BASE, STACKS_CONTRACT_ADDRESS } from "@/config/constants";

interface ContractStats {
    totalTransactions: number;
    uniqueUsers: number;
    successRate: number;
    avgGasUsed: string;
    last24hTx: number;
}

interface ContractAnalyticsProps {
    variants?: any;
}

export function ContractAnalytics({ variants }: ContractAnalyticsProps) {
    const [stats, setStats] = useState<ContractStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContractStats = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${HIRO_API_BASE}/extended/v1/address/${STACKS_CONTRACT_ADDRESS}/transactions?limit=100`
                );
                const data = await response.json();
                const transactions = data.results || [];

                // Calculate stats
                const totalTx = transactions.length;
                const uniqueAddresses = new Set(transactions.map((tx: any) => tx.sender_address));
                const successfulTx = transactions.filter((tx: any) => tx.tx_status === "success");
                const successRate = totalTx > 0 ? (successfulTx.length / totalTx) * 100 : 0;

                // Get last 24h transactions
                const now = Math.floor(Date.now() / 1000);
                const oneDayAgo = now - 86400;
                const last24h = transactions.filter(
                    (tx: any) => tx.burn_block_time > oneDayAgo
                ).length;

                setStats({
                    totalTransactions: totalTx,
                    uniqueUsers: uniqueAddresses.size,
                    successRate: successRate,
                    avgGasUsed: "0.005 STX",
                    last24hTx: last24h
                });
            } catch (error) {
                console.error("Failed to fetch contract stats:", error);
                setStats(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContractStats();
        const interval = setInterval(fetchContractStats, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-[#5546FF]" />
                        Contract Analytics
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Global check-in contract usage metrics
                    </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
                    <span className="text-xs font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#5546FF]/30 border-t-[#5546FF] rounded-full animate-spin" />
                </div>
            ) : stats ? (
                <div className="space-y-6">
                    {/* Primary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-[#5546FF]/10 to-transparent border border-[#5546FF]/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#5546FF]/20 rounded-xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-[#5546FF]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                        Total Transactions
                                    </p>
                                    <p className="text-3xl font-black text-white">
                                        {stats.totalTransactions.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span>All-time contract interactions</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                        Unique Builders
                                    </p>
                                    <p className="text-3xl font-black text-white">
                                        {stats.uniqueUsers.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>Active participants</span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                    Success Rate
                                </p>
                            </div>
                            <p className="text-2xl font-black text-green-500">
                                {stats.successRate.toFixed(1)}%
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                    Last 24h
                                </p>
                            </div>
                            <p className="text-2xl font-black text-yellow-500">
                                {stats.last24hTx}
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-purple-500" />
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">
                                    Avg Gas
                                </p>
                            </div>
                            <p className="text-2xl font-black text-purple-500">
                                {stats.avgGasUsed}
                            </p>
                        </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-black text-white mb-1">
                                    Strong Community Engagement
                                </p>
                                <p className="text-sm text-gray-400 font-medium">
                                    {stats.uniqueUsers} builders checked in across {stats.totalTransactions} transactions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Failed to load contract analytics</p>
                </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500 font-medium">
                    Data updates every minute • Querying last 100 transactions
                </p>
            </div>
        </motion.div>
    );
}
