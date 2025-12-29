"use client";

import { motion } from "framer-motion";
import { History, ExternalLink, CheckCircle2, XCircle, Clock, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useStacks } from "@/components/StacksProvider";
import { HIRO_API_BASE } from "@/config/constants";

interface Transaction {
    tx_id: string;
    tx_type: string;
    tx_status: string;
    burn_block_time: number;
    sender_address?: string;
    fee_rate?: string;
    nonce?: number;
}

interface TransactionHistoryProps {
    variants?: any;
}

export function TransactionHistory({ variants }: TransactionHistoryProps) {
    const { userData, isConnected } = useStacks();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

    useEffect(() => {
        if (!isConnected || !userData?.profile?.stxAddress?.mainnet) return;

        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const address = userData.profile.stxAddress.mainnet;
                const response = await fetch(
                    `${HIRO_API_BASE}/extended/v1/address/${address}/transactions?limit=20`
                );
                const data = await response.json();
                setTransactions(data.results || []);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [isConnected, userData]);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const formatTxType = (type: string) => {
        return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const filteredTransactions = transactions.filter((tx) => {
        if (filter === "all") return true;
        if (filter === "success") return tx.tx_status === "success";
        if (filter === "failed") return tx.tx_status !== "success";
        return true;
    });

    if (!isConnected) {
        return (
            <motion.div variants={variants} className="glass-card p-12 border border-white/5 text-center">
                <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">Transaction History</h3>
                <p className="text-gray-500 font-medium">Connect your wallet to view transaction history</p>
            </motion.div>
        );
    }

    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <History className="w-6 h-6 text-[#5546FF]" />
                        Transaction History
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Your recent on-chain activity
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                    {(["all", "success", "failed"] as const).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === filterType
                                    ? "bg-[#5546FF] text-white"
                                    : "text-gray-500 hover:text-white"
                                }`}
                        >
                            {filterType}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#5546FF]/30 border-t-[#5546FF] rounded-full animate-spin" />
                </div>
            ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-20">
                    <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No transactions found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTransactions.map((tx, index) => (
                        <motion.div
                            key={tx.tx_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer"
                            onClick={() =>
                                window.open(
                                    `https://explorer.hiro.so/txid/${tx.tx_id}?chain=mainnet`,
                                    "_blank"
                                )
                            }
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.tx_status === "success"
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-red-500/20 text-red-500"
                                        }`}
                                >
                                    {tx.tx_status === "success" ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <XCircle className="w-6 h-6" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-white">
                                            {formatTxType(tx.tx_type)}
                                        </p>
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${tx.tx_status === "success"
                                                    ? "bg-green-500/20 text-green-500"
                                                    : "bg-red-500/20 text-red-500"
                                                }`}
                                        >
                                            {tx.tx_status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-mono truncate mt-1">
                                        {tx.tx_id.slice(0, 12)}...{tx.tx_id.slice(-8)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-gray-500 font-medium">
                                        {formatTime(tx.burn_block_time)}
                                    </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {filteredTransactions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing {filteredTransactions.length} transaction
                        {filteredTransactions.length !== 1 ? "s" : ""}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
