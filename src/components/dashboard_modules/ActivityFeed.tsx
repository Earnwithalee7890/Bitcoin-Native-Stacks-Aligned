import { motion } from "framer-motion";
import { History, ArrowUpRight } from "lucide-react";
import { ActivityItem } from "@/types/dashboard";

interface ActivityFeedProps {
    activity: ActivityItem[];
    isLoading: boolean;
    variants: any;
}

export function ActivityFeed({ activity, isLoading, variants }: ActivityFeedProps) {
    return (
        <motion.div variants={variants} className="lg:col-span-2 glass-card p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <History className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                            <History className="w-5 h-5 text-orange-500" />
                            Live Protocol Pulse
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium tracking-wide">Real-time on-chain activity from your contract</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                        ))
                    ) : activity.length > 0 ? (
                        activity.map((item, idx) => (
                            <motion.div
                                key={item.tx_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => window.open(`https://explorer.hiro.so/txid/${item.tx_id}?chain=mainnet`, '_blank')}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer group/item"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                        <History className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white group-hover/item:text-orange-400 transition-colors uppercase tracking-tight">
                                            {item.contract_call?.function_name || 'Contract Call'}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                                            <span className="bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">{item.tx_status}</span>
                                            <span>•</span>
                                            <span className="font-mono">{item.block_height}</span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover/item:text-orange-500 transition-colors" />
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-3xl">
                            <History className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No recent events</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
