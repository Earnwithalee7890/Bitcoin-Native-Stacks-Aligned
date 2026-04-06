"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Shield, Sparkles, CheckCircle2 } from "lucide-react";

interface ActionCenterProps {
    isConnected: boolean;
    isCheckingIn: boolean;
    doCheckIn: () => void;
    showSuccess: boolean;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function ActionCenter({ isConnected, isCheckingIn, doCheckIn, showSuccess }: ActionCenterProps) {
    return (
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 md:p-12 relative overflow-hidden group border border-white/5 border-beam">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Rocket className="w-64 h-64 text-white" />
            </div>
            <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-2 text-[#5546FF] font-black mb-4 uppercase tracking-widest text-sm">
                    <Shield className="w-5 h-5 text-[#5546FF]" />
                    <span>Mainnet Signature Verified</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-none">Daily Builder <br /> <span className="text-[#5546FF]">Check-In</span></h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                    Verify your active participation in the Stacks Weekly Challenge.
                    This creates a permanent record on the Bitcoin L2 layer, boosting your developer reputation score.
                </p>
                <div className="space-y-6">
                    <button
                        onClick={doCheckIn}
                        disabled={!isConnected || isCheckingIn}
                        className={`glass-button w-full sm:w-auto px-12 py-6 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 transition-all ${!isConnected ? 'opacity-50 grayscale cursor-not-allowed' : ''} active:scale-95`}
                    >
                        {isCheckingIn ? (
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-7 h-7" />
                                <span>CONFIRM ON-CHAIN</span>
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center gap-5"
                            >
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-xl text-green-500">Check-in Broadcasted!</p>
                                    <p className="text-xs text-green-500/60 uppercase font-black tracking-widest">Transaction pending on Stacks Mainnet</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
