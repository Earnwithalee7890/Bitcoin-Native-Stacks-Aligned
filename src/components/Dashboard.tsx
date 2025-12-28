"use client";

import { useStacks } from "@/components/StacksProvider";
import { useState } from "react";
import {
    Rocket,
    Github,
    Wallet,
    CheckCircle2,
    Trophy,
    Users,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Dashboard() {
    const {
        connectWallet,
        isConnected,
        userData,
        disconnectWallet,
        isInitializing,
        doCheckIn,
        isCheckingIn,
        showSuccess
    } = useStacks();

    const [isGitHubConnected, setIsGitHubConnected] = useState(false);

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <nav className="flex justify-between items-center mb-12 glass-card p-4 px-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5546FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
                        <Rocket className="text-white w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Bitcoin-Native & Stacks-Aligned</span>
                </div>

                <div className="flex items-center gap-4">
                    {!isConnected ? (
                        <button
                            onClick={connectWallet}
                            disabled={isInitializing}
                            className={`glass-button px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-opacity ${isInitializing ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {isInitializing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-gray-400">Connected</p>
                                <p className="text-sm font-mono">{userData?.profile?.stxAddress?.mainnet?.slice(0, 6)}...{userData?.profile?.stxAddress?.mainnet?.slice(-4)}</p>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="text-center mb-16 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        Bitcoin-Native & <br /> Stacks-Aligned
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Boost your rewards by completing daily on-chain activity and
                        contributing to the Stacks ecosystem. Earn STX while you build.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-6">
                    <div className="glass-card p-6 min-w-[200px] flex flex-col items-center">
                        <Trophy className="text-[#5546FF] w-8 h-8 mb-3" />
                        <p className="text-2xl font-bold">12,000</p>
                        <p className="text-sm text-gray-400">$STX Reward Pool</p>
                    </div>
                    <div className="glass-card p-6 min-w-[200px] flex flex-col items-center">
                        <Users className="text-[#3B82F6] w-8 h-8 mb-3" />
                        <p className="text-2xl font-bold">50</p>
                        <p className="text-sm text-gray-400">Weekly Winners</p>
                    </div>
                    <div className="glass-card p-6 min-w-[200px] flex flex-col items-center">
                        <TrendingUp className="text-[#8B5CF6] w-8 h-8 mb-3" />
                        <p className="text-2xl font-bold">0.01</p>
                        <p className="text-sm text-gray-400">STX Fee</p>
                    </div>
                </div>
            </section>

            {/* Main Actions */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 className="w-12 h-12 text-[#5546FF]" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Daily Check-In</h2>
                    <p className="text-gray-400 mb-8">
                        Complete your daily on-chain check-in to verify activity.
                        Fee: 0.01 STX | Reward: 0.001 STX rebate.
                    </p>
                    <button
                        onClick={doCheckIn}
                        disabled={!isConnected || isCheckingIn}
                        className={`glass-button w-full max-w-xs py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 ${!isConnected ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        {isCheckingIn ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Rocket className="w-5 h-5" />
                                Check In Now
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Check-in broadcasted successfully!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isConnected && <p className="mt-4 text-xs text-[#5546FF] animate-pulse">Connect wallet to unlock</p>}
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Github className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">GitHub Profile</h2>
                    <p className="text-gray-400 mb-8">
                        Connect your GitHub account to track contributions to public Stacks repositories.
                    </p>
                    <button
                        onClick={() => setIsGitHubConnected(true)}
                        disabled={isGitHubConnected}
                        className={`w-full max-w-xs py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isGitHubConnected ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                        {isGitHubConnected ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Connected
                            </>
                        ) : (
                            <>
                                <Github className="w-5 h-5" />
                                Connect GitHub
                            </>
                        )}
                    </button>
                </motion.div>
            </div>

            {/* Leaderboard Section */}
            <section className="glass-card p-8 mb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold">Top Builders</h3>
                        <p className="text-sm text-gray-400">Leaderboard updates every 24 hours</p>
                    </div>
                    <button className="text-[#3B82F6] text-sm flex items-center gap-1 hover:underline">
                        View All <ExternalLink className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((rank) => (
                        <div key={rank} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : rank === 2 ? 'bg-gray-400/20 text-gray-400' : 'bg-orange-500/20 text-orange-500'}`}>
                                    {rank}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                                <div>
                                    <p className="font-medium">builder-{rank}.stx</p>
                                    <p className="text-xs text-gray-500">Stacks L2 Active</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{(1000 / rank).toFixed(0)} pts</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                                    <span className="bg-white/5 px-2 py-0.5 rounded">WalletKit</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded">GitHub</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm py-12 border-t border-white/5">
                <p>© 2025 Bitcoin-Native & Stacks-Aligned. Built with Clarity 4 & WalletKit.</p>
            </footer>
        </main>
    );
}
