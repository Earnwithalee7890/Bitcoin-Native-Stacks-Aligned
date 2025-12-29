import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { MarketData } from "@/types/dashboard";

interface SummaryCardProps {
    marketData: MarketData | null;
    variants: any;
}

export function SummaryCard({ marketData, variants }: SummaryCardProps) {
    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <TrendingUp className="w-32 h-32 text-orange-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                            Stacks Market Pulse
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium tracking-wide">Live STX performance data</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Live Price</p>
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">
                                ${marketData?.price.toFixed(2) || "1.84"}
                            </h2>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                <ArrowUpRight className="w-3 h-3 text-green-500" />
                                <span className="text-xs font-black text-green-500">+{marketData?.change.toFixed(1) || "4.2"}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Market Cap</p>
                                <p className="text-lg font-bold text-white tracking-tight">$2.8B</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Rank</p>
                                <p className="text-lg font-bold text-white tracking-tight">#32</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
