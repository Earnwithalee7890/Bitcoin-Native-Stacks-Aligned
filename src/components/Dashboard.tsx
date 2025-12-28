"use client";

import { useStacks } from "@/components/StacksProvider";
import { useState, useEffect } from "react";
import {
    Rocket,
    Github,
    Wallet,
    CheckCircle2,
    Trophy,
    Users,
    TrendingUp,
    ExternalLink,
    BarChart3,
    Globe,
    BookOpen,
    Zap,
    ArrowUpRight,
    ArrowDownRight
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

    // Market & Network State
    const [marketData, setMarketData] = useState<{ price: number; change: number } | null>(null);
    const [blockHeight, setBlockHeight] = useState<number | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch STX Price from CoinGecko
                const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd&include_24hr_change=true");
                const priceJson = await priceRes.json();
                setMarketData({
                    price: priceJson.blockstack.usd,
                    change: priceJson.blockstack.usd_24h_change
                });

                // Fetch Block Height from Hiro API
                const heightRes = await fetch("https://api.mainnet.hiro.so/v2/info");
                const heightJson = await heightRes.json();
                setBlockHeight(heightJson.stacks_tip_height);
            } catch (e) {
                console.error("Stats fetch error:", e);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <nav className="flex justify-between items-center mb-8 glass-card p-4 px-8">
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="text-green-500 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">STX Price</p>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">${marketData?.price?.toFixed(2) || "---"}</span>
                            {marketData && (
                                <span className={`text-xs flex items-center ${marketData.change >= 0 ? 'text-green-500' : 'text-danger'}`}>
                                    {marketData.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(marketData.change).toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Zap className="text-blue-500 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Network Pulse</p>
                        <p className="text-lg font-bold">Block #{blockHeight || "---"}</p>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                        <Trophy className="text-purple-500 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Event Pool</p>
                        <p className="text-lg font-bold">12,000 STX</p>
                    </div>
                </div>
            </div>

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
                        The definitive hub for the Stacks Builder Challenge. Perform daily check-ins, track ecosystem health, and earn rewards on-chain.
                    </p>
                </motion.div>
            </section>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Check In Action (Large) */}
                <div className="lg:col-span-2">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="glass-card p-10 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <CheckCircle2 className="w-24 h-24 text-[#5546FF]" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Daily Check-In</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Boost your ecosystem rank and verify your Stacks activity.
                            0.01 STX Fee required.
                        </p>
                        <button
                            onClick={doCheckIn}
                            disabled={!isConnected || isCheckingIn}
                            className={`glass-button w-full max-w-sm py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 ${!isConnected ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        >
                            {isCheckingIn ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Rocket className="w-6 h-6" />
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
                                    className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Check-in broadcasted to Stacks Mainnet!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isConnected && <p className="mt-4 text-xs text-[#5546FF] animate-pulse font-medium">Connect wallet to participate</p>}
                    </motion.div>
                </div>

                {/* Ecosystem Links Side Panel */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#3B82F6]" />
                        Ecosystem Pulse
                    </h3>
                    <a href="https://explorer.hiro.so" target="_blank" rel="noopener noreferrer"
                        className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            <span>Hiro Explorer</span>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                    </a>
                    <a href="https://docs.hiro.so" target="_blank" rel="noopener noreferrer"
                        className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            <span>Developer Docs</span>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                    </a>
                    <a href="https://stacks.org" target="_blank" rel="noopener noreferrer"
                        className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            <span>Stacks Foundation</span>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                    </a>

                    <div className="mt-auto glass-card p-6 bg-gradient-to-br from-[#5546FF]/10 to-transparent border-[#5546FF]/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-[#5546FF]">
                            <Zap className="w-4 h-4" />
                            Live Network Status
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Node Status</span>
                                <span className="text-green-500 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Synchronized
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Api Latency</span>
                                <span className="text-white">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Follow the Developer (Expanded) */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px bg-white/10 flex-grow" />
                    <h2 className="text-2xl font-bold whitespace-nowrap px-4">Meet the Builder</h2>
                    <div className="h-px bg-white/10 flex-grow" />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <a href="https://github.com/Earnwithalee7890" target="_blank" rel="noopener noreferrer" className="glass-card px-8 py-4 flex items-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1">
                        <Github className="w-6 h-6 text-white" />
                        <span className="font-medium">GitHub</span>
                    </a>
                    <a href="https://x.com/aleeasghar78" target="_blank" rel="noopener noreferrer" className="glass-card px-8 py-4 flex items-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        <span className="font-medium">Twitter</span>
                    </a>
                    <a href="https://farcaster.xyz/aleekhoso" target="_blank" rel="noopener noreferrer" className="glass-card px-8 py-4 flex items-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1">
                        <Users className="w-6 h-6 text-white" />
                        <span className="font-medium">Farcaster</span>
                    </a>
                    <a href="https://talent.app/aleekhoso" target="_blank" rel="noopener noreferrer" className="glass-card px-8 py-4 flex items-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1">
                        <ExternalLink className="w-6 h-6 text-white" />
                        <span className="font-medium">Talent Protocol</span>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-gray-400 text-sm py-12 border-t border-white/5 space-y-2">
                <p>© 2025 Bitcoin-Native & Stacks-Aligned. Built for the Stacks Builder Challenge #3.</p>
                <p className="text-[#5546FF] font-medium">Developed by aleekhoso</p>
                <div className="flex justify-center gap-4 mt-4 opacity-60">
                    <span className="bg-white/5 px-2 py-1 rounded text-[10px]">Clarity 4</span>
                    <span className="bg-white/5 px-2 py-1 rounded text-[10px]">Hiro SDK</span>
                    <span className="bg-white/5 px-2 py-1 rounded text-[10px]">Reown AppKit</span>
                </div>
            </footer>
        </main>
    );
}
