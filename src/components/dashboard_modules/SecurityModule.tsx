import { motion } from "framer-motion";
import { Shield, Fingerprint } from "lucide-react";

interface SecurityModuleProps {
    variants: any;
}

export function SecurityModule({ variants }: SecurityModuleProps) {
    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Shield className="w-64 h-64 text-green-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Clarity 4 Security Alignment</h3>
                        <p className="text-gray-500 text-xs mt-1 font-medium">Protocol-level safety features enabled</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            Time-Lock Security
                        </p>
                        <p className="text-sm font-bold text-white tracking-tight">stacks-block-height base chain validation</p>
                        <p className="text-xs text-gray-500 leading-relaxed">Transactions are governed by native Stacks block height for maximum deterministic security.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Fingerprint className="w-3 h-3" />
                            Post-Conditions
                        </p>
                        <p className="text-sm font-bold text-white tracking-tight">Asset Transfer Protection</p>
                        <p className="text-xs text-gray-500 leading-relaxed">Integrated post-conditions ensure no assets leave your wallet without explicit on-chain approval.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
