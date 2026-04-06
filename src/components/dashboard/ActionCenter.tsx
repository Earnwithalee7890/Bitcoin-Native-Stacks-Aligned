"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Shield, Sparkles, CheckCircle2 } from "lucide-react";

interface ActionCenterProps {
    isConnected: boolean;
    isCheckingIn: boolean;
    doCheckIn: () => void;
    showSuccess: boolean;
    txStatus: "idle" | "pending" | "success" | "failed";
    lastTxId: string | null;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function ActionCenter({ isConnected, isCheckingIn, doCheckIn, showSuccess, txStatus, lastTxId }: ActionCenterProps) {
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
                        disabled={!isConnected || isCheckingIn || txStatus === "pending"}
                        aria-label={isCheckingIn || txStatus === "pending" ? "Transaction in progress" : "Confirm check-in on-chain"}
                        aria-busy={isCheckingIn || txStatus === "pending"}
                        className={`glass-button w-full sm:w-auto px-12 py-6 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 transition-all ${(!isConnected || isCheckingIn || txStatus === "pending") ? 'opacity-50 grayscale cursor-not-allowed' : ''} active:scale-95 focus-visible:ring-4 focus-visible:ring-[#5546FF] focus-visible:outline-none`}
                    >
                        {isCheckingIn || txStatus === "pending" ? (
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        ) : (
                            <>
                                <Sparkles className="w-7 h-7" aria-hidden="true" />
                                <span>CONFIRM ON-CHAIN</span>
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {(showSuccess || txStatus !== "idle") && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-6 border rounded-3xl flex items-center gap-5 ${
                                    txStatus === "failed" ? "bg-red-500/10 border-red-500/20" : 
                                    txStatus === "success" ? "bg-green-500/10 border-green-500/20" :
                                    "bg-blue-500/10 border-blue-500/20"
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    txStatus === "failed" ? "bg-red-500/20 text-red-500" :
                                    txStatus === "success" ? "bg-green-500/20 text-green-500" :
                                    "bg-blue-500/20 text-blue-500"
                                }`}>
                                    {txStatus === "pending" ? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-7 h-7" />}
                                </div>
                                <div className="flex-grow">
                                    <p className={`font-black text-xl ${
                                        txStatus === "failed" ? "text-red-500" :
                                        txStatus === "success" ? "text-green-500" :
                                        "text-blue-500"
                                    }`}>
                                        {txStatus === "pending" ? "Transaction Pending..." : 
                                         txStatus === "success" ? "Check-in Confirmed!" :
                                         txStatus === "failed" ? "Transaction Failed" :
                                         "Check-in Broadcasted!"}
                                    </p>
                                    <p className={`text-[10px] uppercase font-black tracking-widest ${
                                        txStatus === "failed" ? "text-red-500/60" :
                                        txStatus === "success" ? "text-green-500/60" :
                                        "text-blue-500/60"
                                    }`}>
                                        {txStatus === "pending" ? "Waiting for Stacks block confirmation" :
                                         txStatus === "success" ? "Your reputation has been updated" :
                                         txStatus === "failed" ? "Please check your STX balance and try again" :
                                         "Transaction pending on Stacks Mainnet"}
                                    </p>
                                    {lastTxId && (
                                        <a 
                                            href={`https://explorer.hiro.so/txid/${lastTxId}`} 
                                            target="_blank" 
                                            className="text-[10px] font-black text-white/40 hover:text-white underline mt-2 block"
                                        >
                                            View in Explorer
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
