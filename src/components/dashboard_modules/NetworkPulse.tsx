import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { NetworkStats } from "@/types/dashboard";

interface NetworkPulseProps {
    stats: NetworkStats | null;
    variants: any;
}

export function NetworkPulse({ stats, variants }: NetworkPulseProps) {
    return (
        <motion.div variants={variants} className="glass-card p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live Network Pulse</span>
                </div>
                <Activity className="w-4 h-4 text-gray-700 group-hover:text-green-500 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Stacks TPS</p>
                    <p className="text-xl font-black text-white">{stats?.tps || "0.42"}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">24h Vol</p>
                    <p className="text-xl font-black text-white">{stats?.volume_24h || "$24.8M"}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Protocol Status</p>
                        <p className="text-xs font-bold text-green-400">NAKAMOTO READY</p>
                    </div>
                    <div className="h-8 w-16 bg-white/5 rounded-lg overflow-hidden flex items-end gap-1 p-1">
                        {[40, 70, 45, 90, 60, 80].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1, repeatType: 'reverse' }}
                                className="flex-1 bg-green-500/30 rounded-t-sm"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
