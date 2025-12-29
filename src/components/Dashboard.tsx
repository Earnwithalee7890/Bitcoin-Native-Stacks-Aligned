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
    ArrowDownRight,
    Activity,
    Shield,
    Cpu,
    Compass,
    Sparkles,
    LayoutDashboard,
    Terminal,
    Map,
    Code2,
    Database,
    Link2,
    Flame,
    LineChart,
    Layers,
    Lock
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
    const [activeTab, setActiveTab] = useState("overview");

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto relative overflow-hidden bg-grid">
            {/* Background Decorative Elements */}
            <div className="glow-mesh" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5546FF]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3B82F6]/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Header / Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between mb-12 glass-card p-4 px-6 md:px-10 sticky top-4 z-50 backdrop-blur-xl border border-white/5"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5546FF] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group cursor-pointer transition-transform hover:scale-105" onClick={() => setActiveTab("overview")}>
                        <Rocket className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight block leading-none">STX Builder</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#5546FF] font-black">Week-3 Edition</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-sm font-black uppercase tracking-widest text-gray-500">
                    {["overview", "ecosystem", "builder"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`hover:text-white transition-all relative px-2 py-1 ${activeTab === tab ? 'text-white' : ''}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5546FF]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {!isConnected ? (
                        <button
                            onClick={connectWallet}
                            disabled={isInitializing}
                            className="glass-button px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2"
                        >
                            {isInitializing ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Wallet className="w-4 h-4" />
                                    <span>Connect</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1.5 pl-4 rounded-2xl">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Builder ID</p>
                                <p className="text-xs font-mono font-black text-[#5546FF]">
                                    {userData?.profile?.stxAddress?.mainnet?.slice(0, 6)}...{userData?.profile?.stxAddress?.mainnet?.slice(-4)}
                                </p>
                            </div>
                            <button
                                onClick={disconnectWallet}
                                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-colors group"
                                title="Disconnect Wallet"
                            >
                                <Users className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.nav>

            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-12"
                    >
                        {/* Hero Section */}
                        <motion.section variants={itemVariants} className="text-center max-w-4xl mx-auto mb-16 px-4">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 hover:bg-white/10 transition-colors cursor-default">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Stacks Builder Challenge #3 Hub</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[1.1] text-shimmer">
                                <span className="text-[#3B82F6]">Bitcoin</span> L2 <br />
                                Powerhouse
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
                                Maximize your reputation on the Stacks network with real-time analytics, daily check-ins, and a direct link to the global builder ecosystem.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="glass-button px-10 py-5 rounded-3xl font-black text-xl flex items-center gap-3 group">
                                    Start Building <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                                <a href="https://stacks.org" target="_blank" className="bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-3xl font-black text-xl transition-all flex items-center gap-2">
                                    SDK Docs <ExternalLink className="w-5 h-5 opacity-50" />
                                </a>
                            </div>
                        </motion.section>

                        {/* Stats Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                            {[
                                { label: "STX Price", val: `$${marketData?.price?.toFixed(2) || "---"}`, icon: BarChart3, color: "text-green-500", bg: "bg-green-500/10", tag: marketData ? `${marketData.change >= 0 ? '+' : ''}${marketData.change.toFixed(1)}%` : null },
                                { label: "Network Pulse", val: `Block #${blockHeight || "---"}`, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10", tag: "Live" },
                                { label: "Active Builders", val: "1,240+", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", tag: "Growing" },
                                { label: "Challenge Rewards", val: "12,000 STX", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", tag: "Week 3" }
                            ].map((stat, i) => (
                                <div key={i} className="glass-card p-6 flex flex-col justify-between group cursor-default border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        {stat.tag && (
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${stat.color.replace('text', 'border')}/20 ${stat.bg}`}>
                                                {stat.tag}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-2xl font-black mt-1 leading-none">{stat.val}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Action Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                            {/* Live Feed */}
                            <motion.div variants={itemVariants} className="glass-card p-6 h-full flex flex-col border border-white/5">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-gray-400">
                                    <Activity className="w-4 h-4 text-[#5546FF] animate-pulse" />
                                    Live Network Pulse
                                </h3>
                                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar lg:max-h-[350px]">
                                    {[
                                        { user: "SP2D...X45", action: "Minted NFT", time: "2m ago", icon: Trophy, color: "text-yellow-500" },
                                        { user: "SP3F...Z91", action: "Daily Check-in", time: "5m ago", icon: CheckCircle2, color: "text-[#5546FF]" },
                                        { user: "SP1A...B82", action: "Swapped STX", time: "12m ago", icon: TrendingUp, color: "text-green-500" },
                                        { user: "SP5M...K10", action: "New Builder Joined", time: "15m ago", icon: Users, color: "text-blue-500" },
                                        { user: "SP8N...L04", action: "Contract Deployed", time: "22m ago", icon: Terminal, color: "text-purple-500" }
                                    ].map((act, i) => (
                                        <div key={i} className="flex items-center justify-between group cursor-default">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors ${act.color}`}>
                                                    <act.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-200">{act.user}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{act.action}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-black">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Stacks Price Trends (NEW) */}
                        <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 bg-gradient-to-br from-[#5546FF]/5 to-transparent relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5546FF] to-transparent opacity-50" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="max-w-md">
                                    <div className="flex items-center gap-2 mb-4 text-[#3B82F6]">
                                        <LineChart className="w-6 h-6" />
                                        <span className="font-black uppercase tracking-widest text-xs">Market Trends</span>
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 tracking-tight">STX / BTC Integration</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">
                                        Monitoring the Nakamoto upgrade progress and its impact on STX liquidity. Stacks is currently the most secure L2 for Bitcoin.
                                    </p>
                                </div>
                                <div className="flex-grow w-full max-w-xl bg-white/5 rounded-3xl p-6 border border-white/5 relative h-48 flex items-end justify-between px-10">
                                    {[40, 60, 45, 80, 55, 90, 75, 100, 85, 110].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                                            className="w-4 bg-gradient-to-t from-[#5546FF] to-[#3B82F6] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group/bar"
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Bento Grid: Featured Section */}
                        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-8 group border border-white/5">
                                <div className="w-40 h-40 bg-[#5546FF]/20 rounded-[2rem] flex items-center justify-center relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#5546FF] to-[#3B82F6] opacity-40 group-hover:scale-110 transition-transform" />
                                    <Terminal className="w-16 h-16 relative z-10 text-white" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5546FF] mb-2 block">Developer Feature</span>
                                    <h3 className="text-3xl font-black mb-4 tracking-tight">Clarity Smart Contracts</h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        Our dashboard integrates directly with the latest Clarity 4 standards.
                                        Secure, readable, and native to the Bitcoin security model.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-[#5546FF]">(get-block-height)</span>
                                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-[#3B82F6]">stx-transfer?</span>
                                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-gray-400">trait-reference</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 flex flex-col justify-center items-center text-center bg-gradient-to-tr from-yellow-500/10 via-transparent to-transparent border border-white/5">
                                <Trophy className="w-12 h-12 text-yellow-500 mb-4 animate-float" />
                                <h4 className="text-2xl font-black mb-2 tracking-tight">Global Leaderboard</h4>
                                <p className="text-xs text-gray-500 font-bold mb-6">Top builders on the Stacks Mainnet this season.</p>
                                <button
                                    onClick={() => window.open("https://explorer.hiro.so", "_blank")}
                                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                                >
                                    View on Explorer
                                </button>
                            </div>
                        </motion.section>

                        <motion.section variants={itemVariants} className="pt-20 pb-12">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="h-px bg-white/10 flex-grow" />
                                <h2 className="text-3xl font-black tracking-tight whitespace-nowrap px-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white">Connect with the Creator</h2>
                                <div className="h-px bg-white/10 flex-grow" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                                {[
                                    { name: "GitHub", handle: "@Earnwithalee7890", url: "https://github.com/Earnwithalee7890", icon: Github, color: "hover:bg-white/10 hover:shadow-white/5" },
                                    { name: "Twitter", handle: "@aleeasghar78", url: "https://x.com/aleeasghar78", icon: Globe, color: "hover:bg-blue-500/10 hover:shadow-blue-500/5" },
                                    { name: "Farcaster", handle: "aleekhoso", url: "https://farcaster.xyz/aleekhoso", icon: Users, color: "hover:bg-purple-500/10 hover:shadow-purple-500/5" },
                                    { name: "Talent", handle: "aleekhoso", url: "https://talent.app/aleekhoso", icon: Sparkles, color: "hover:bg-[#5546FF]/10 hover:shadow-[#5546FF]/5" }
                                ].map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" className={`glass-card p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-2 border border-white/5 ${link.color}`}>
                                        <link.icon className="w-10 h-10" />
                                        <div className="text-center">
                                            <p className="font-black text-sm uppercase tracking-widest text-[#5546FF]">{link.name}</p>
                                            <p className="text-xs text-gray-500 font-bold mt-1">{link.handle}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.section>

                        {/* Multi-feature Roadmap Section */}
                        <motion.section variants={itemVariants} className="glass-card p-12 bg-gradient-to-br from-black to-[#5546FF]/5 border border-white/5 text-center">
                            <Map className="w-12 h-12 text-[#5546FF] mx-auto mb-6" />
                            <h3 className="text-4xl font-black mb-6 tracking-tight">Project Roadmap</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Phase 1 (Complete)</span>
                                    <h4 className="font-bold text-lg">Mainnet Check-In</h4>
                                    <p className="text-xs text-gray-500">Secure Clarity 4 integration with basic reporting.</p>
                                </div>
                                <div className="space-y-2 opacity-100 border-x border-white/10 px-4">
                                    <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">Phase 2 (In-Progress)</span>
                                    <h4 className="font-bold text-lg">Ecosystem Pulse</h4>
                                    <p className="text-xs text-gray-500">Live network monitoring and builder feed integration.</p>
                                </div>
                                <div className="space-y-2 opacity-50">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phase 3 (Coming Soon)</span>
                                    <h4 className="font-bold text-lg">NFT Badges</h4>
                                    <p className="text-xs text-gray-500">On-chain rewards for consistent builder check-ins.</p>
                                </div>
                            </div>
                        </motion.section>
                    </motion.div>
                )}

                {activeTab === "ecosystem" && (
                    <motion.div
                        key="ecosystem"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-12"
                    >
                        <motion.section variants={itemVariants} className="text-left mb-16 px-4">
                            <h2 className="text-5xl font-black mb-4 tracking-tighter">Stacks <span className="text-[#3B82F6]">Ecosystem</span> Hub</h2>
                            <p className="text-gray-400 text-lg max-w-2xl font-medium">Explore the leading protocols, marketplaces, and infrastructure built on the Stacks layer.</p>
                        </motion.section>

                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                            {[
                                { name: "Hiro", desc: "The foundational tools for Stacks development including Explorer and SDKs.", url: "https://hiro.so", icon: Terminal, tag: "Infrastructure" },
                                { name: "ALEX Lab", desc: "The definitive DeFi protocol on Stacks for swaps and yield.", url: "https://alexlab.co", icon: BarChart3, tag: "DeFi" },
                                { name: "Gamma", desc: "The primary NFT marketplace on Bitcoin L2 for creators and collectors.", url: "https://gamma.io", icon: LayoutDashboard, tag: "NFTs" },
                                { name: "Stacks Foundation", desc: "Supporting the open internet on Bitcoin through grants and governance.", url: "https://stacks.org", icon: Globe, tag: "Governance" },
                                { name: "Xverse", desc: "The Bitcoin wallet for Web3, supporting Stacks and Ordinals natively.", url: "https://xverse.app", icon: Wallet, tag: "Wallet" },
                                { name: "Leather", desc: "A premium Bitcoin-native wallet experience for the entire ecosystem.", url: "https://leather.io", icon: Shield, tag: "Wallet" },
                                { name: "Velar", desc: "Liquidity protocol for Bitcoin assets on Stacks.", url: "https://velar.com", icon: Flame, tag: "DeFi" },
                                { name: "Stacking DAO", desc: "Liquid stacking for STX - unlock liquidity while earning yield.", url: "https://stackingdao.com", icon: Layers, tag: "Liquid Staking" },
                                { name: "Arkadiko", desc: "Self-repaying loans and stablecoins on Stacks.", url: "https://arkadiko.finance", icon: Lock, tag: "DeFi" }
                            ].map((proj, i) => (
                                <a key={i} href={proj.url} target="_blank" className="glass-card p-8 group hover:-translate-y-2 flex flex-col h-full border border-white/5 hover:border-[#5546FF]/30 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#5546FF]/20 transition-all">
                                            <proj.icon className="w-7 h-7 text-gray-400 group-hover:text-[#5546FF]" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#5546FF] border border-[#5546FF]/20 px-3 py-1 rounded-full group-hover:bg-[#5546FF]/10 transition-colors">{proj.tag}</span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 group-hover:text-white transition-colors">{proj.name}</h3>
                                    <p className="text-gray-400 text-sm font-medium mb-8 flex-grow leading-relaxed">{proj.desc}</p>
                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                        Visit Platform <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === "builder" && (
                    <motion.div
                        key="builder"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="space-y-12"
                    >
                        <motion.section variants={itemVariants} className="text-center mb-16 px-4">
                            <h2 className="text-5xl font-black mb-4 tracking-tighter">Builder <span className="text-[#3B82F6]">Reputation</span> Profile</h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Your global contribution score across GitHub, Talent Protocol, and Stacks activity.</p>
                        </motion.section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                            <motion.div variants={itemVariants} className="glass-card p-10 bg-gradient-to-br from-[#5546FF]/5 to-transparent border border-white/5">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-20 h-20 bg-[#5546FF] rounded-3xl flex items-center justify-center shadow-lg shadow-[#5546FF]/30">
                                        <Github className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black">GitHub Signals</h3>
                                        <p className="text-green-500 font-black text-sm uppercase tracking-widest mt-1">Status: Synced & Verified</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-2">Primary Identity</p>
                                        <p className="text-lg font-black text-gray-200">earnwithalee@gmail.com</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter mb-1">Commits</p>
                                            <p className="text-2xl font-black">19</p>
                                        </div>
                                        <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter mb-1">Repos</p>
                                            <p className="text-2xl font-black">12</p>
                                        </div>
                                        <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter mb-1">Followers</p>
                                            <p className="text-2xl font-black">150+</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="glass-card p-10 flex flex-col justify-center items-center text-center border border-white/5 bg-gradient-to-tr from-yellow-500/5 to-transparent">
                                <Sparkles className="w-16 h-16 text-yellow-500 mb-6 animate-pulse" />
                                <h3 className="text-3xl font-black mb-4">Talent API Score</h3>
                                <div className="text-8xl font-black text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5546FF] to-[#3B82F6]">920</div>
                                <div className="flex items-center gap-2 mb-8 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest text-green-500">Top 5% of Builders</span>
                                </div>
                                <p className="text-gray-400 font-medium max-w-sm mb-10 leading-relaxed">
                                    Your builder score is calculated based on activity, verification, and contributions. Sync more repositories to increase your ranking.
                                </p>
                                <button
                                    onClick={() => window.open("https://talent.app/aleekhoso", "_blank")}
                                    className="glass-button w-full py-5 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    Enhance Profile on Talent.app
                                </button>
                            </motion.div>
                        </div>

                        {/* Builder Milestones (NEW) */}
                        <motion.section variants={itemVariants} className="px-4">
                            <h3 className="text-2xl font-black mb-8 px-4 border-l-4 border-[#5546FF]">Developer Milestones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { title: "First Check-in", desc: "Started the Stacks journey", icon: Zap, status: "completed" },
                                    { title: "Clarity Master", desc: "Wrote first smart contract", icon: Code2, status: "completed" },
                                    { title: "Network Peer", desc: "Joined the ecosystem hub", icon: Globe, status: "completed" },
                                    { title: "Top Ranked", desc: "Reach top 1% on leaderboard", icon: Trophy, status: "upcoming" }
                                ].map((m, i) => (
                                    <div key={i} className={`glass-card p-6 border border-white/5 flex items-center gap-4 ${m.status === 'upcoming' ? 'opacity-50 grayscale' : ''}`}>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.status === 'completed' ? 'bg-[#5546FF]/20 text-[#5546FF]' : 'bg-white/5 text-gray-500'}`}>
                                            <m.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm">{m.title}</h4>
                                            <p className="text-[10px] text-gray-500 font-medium">{m.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="pt-32 pb-16 text-center border-t border-white/5"
            >
                <div className="flex flex-wrap justify-center gap-10 mb-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2 scale-110"><Globe className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">Stacks Foundation</span></div>
                    <div className="flex items-center gap-2 scale-110"><Cpu className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">Hiro Ecosystem</span></div>
                    <div className="flex items-center gap-2 scale-110"><Shield className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">Clarity 4 Certified</span></div>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left px-4 mb-20">
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Developed By</h4>
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open("https://github.com/Earnwithalee7890", "_blank")}>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5546FF] to-[#3B82F6] flex items-center justify-center font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">A</div>
                            <div>
                                <p className="text-lg font-black text-white">aleekhoso</p>
                                <p className="text-xs text-[#5546FF] font-black uppercase tracking-widest">Stacks Builder #34</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 text-right flex flex-col items-end">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Challenge Compliance</h4>
                        <div className="flex flex-wrap justify-end gap-3 max-w-sm">
                            {["Reown AppKit v2", "Clarity 4 Adoption", "WalletConnect v2", "Bitcoin L2 Alignment", "Next.js 15 Client-Side"].map((tech, i) => (
                                <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-[#5546FF]/40 transition-all cursor-default">{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] px-4">
                    © 2025 BITCOIN-NATIVE & STACKS-ALIGNED PROTOCOL. THE FUTURE OF BITCOIN IS NOW. DEPLOYED ON STACKS MAINNET.
                </p>
            </motion.footer>
        </main>
    );
}
