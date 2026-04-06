"use client";

import { useStacks } from "@/components/StacksProvider";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CheckCircle2, Activity, Github, Sparkles, Terminal, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STACKS_CONTRACT_ADDRESS, HIRO_API_BASE } from "@/config/constants";
import { ActivityItem, UserStats, SearchResult } from "@/types/dashboard";
import { useMarketData } from "@/hooks/useMarketData";
import { useNetworkStats } from "@/hooks/useNetworkStats";
import {
    StatsGrid,
    ActivityFeed,
    NetworkPulse,
    BuilderSearch,
    SecurityModule,
    EcosystemHub,
    BuilderJourney,
    Leaderboard,
    TransactionHistory,
    PortfolioWidget,
    ContractAnalytics,
    NetworkHealth
} from "./dashboard_modules";
import { EngagementModule } from "./EngagementModule";

// New Components
import { Navigation } from "./dashboard/Navigation";
import { HeroSection } from "./dashboard/HeroSection";
import { ActionCenter } from "./dashboard/ActionCenter";
import { SocialLinks } from "./dashboard/SocialLinks";
import { Roadmap } from "./dashboard/Roadmap";
import { Footer } from "./dashboard/Footer";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export function Dashboard() {
    const {
        isConnected,
        userData,
        doCheckIn,
        isCheckingIn,
        txStatus,
        lastTxId
    } = useStacks();

    // Market & Network Data from Hooks
    const marketData = useMarketData();
    const { blockHeight, networkStats } = useNetworkStats();

    // Local UI State
    const [activeTab, setActiveTab] = useLocalStorage("stx_active_tab", "overview");
    const [isCompact, setIsCompact] = useLocalStorage("stx_is_compact", false);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [isLoadingActivity, setIsLoadingActivity] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const fetchActivity = useCallback(async () => {
        setIsLoadingActivity(true);
        try {
            const res = await fetch(`${HIRO_API_BASE}/extended/v1/address/${STACKS_CONTRACT_ADDRESS}/transactions?limit=10`);
            if (!res.ok) throw new Error("Failed to fetch activity");
            const data: { results: any[] } = await res.json();

            const formatted: ActivityItem[] = data.results.map((tx: any) => ({
                tx_id: tx.tx_id,
                tx_status: tx.tx_status,
                block_height: tx.block_height,
                burn_block_time: tx.burn_block_time,
                sender_address: tx.sender_address,
                tx_type: tx.tx_type,
                user: `${tx.sender_address.slice(0, 4)}...${tx.sender_address.slice(-3)}`,
                fullAddress: tx.sender_address,
                action: tx.tx_type === "contract_call" ? "Check-in" : tx.tx_type.replace("_", " "),
                time: "Recently", // Simplified for now or use actual formatter
                icon: tx.tx_status === "success" ? CheckCircle2 : Activity,
                color: tx.tx_status === "success" ? "text-green-500" : "text-yellow-500"
            }));
            setActivity(formatted);
        } catch (e) {
            console.error("Activity fetch error:", e);
        } finally {
            setIsLoadingActivity(false);
        }
    }, []);

    const fetchUserStats = useCallback(async () => {
        if (!userData?.profile?.stxAddress?.mainnet) return;
        setUserStats({
            count: 5,
            last_active: "24h ago",
            checkInCount: 5,
            lastActive: "24h ago"
        });
    }, [userData]);

    useEffect(() => {
        fetchActivity();
        fetchUserStats();
        const interval = setInterval(() => {
            fetchActivity();
            fetchUserStats();
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchActivity, fetchUserStats]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery) return;
        try {
            const res = await fetch(`${HIRO_API_BASE}/extended/v1/address/${searchQuery}`);
            if (!res.ok) throw new Error("Failed to fetch address");
            const data: any = await res.json();
            setSearchResult({
                address: searchQuery,
                reputationScore: Math.floor(Math.random() * 40) + 60,
                githubVerified: true,
                talentScore: 75
            });
        } catch (e) {
            console.error(e);
        }
    }, [searchQuery]);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }), []);

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }), []);

    return (
        <main className={`min-h-screen p-4 md:p-8 max-w-7xl mx-auto relative overflow-hidden bg-grid ${isCompact ? 'px-2 md:px-4' : ''}`}>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#5546FF] text-white px-4 py-2 rounded-lg z-50 font-black uppercase tracking-widest text-xs transition-all">
                Skip to content
            </a>

            {/* Background Decorative Elements */}
            <div className="glow-mesh" aria-hidden="true" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5546FF]/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3B82F6]/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isCompact={isCompact} setIsCompact={setIsCompact} />

            <div id="main-content">
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
                        <HeroSection />

                        <StatsGrid
                            userStats={userStats}
                            marketData={marketData}
                            currentBlock={blockHeight || 0}
                            variants={itemVariants}
                            isConnected={isConnected}
                            isCompact={isCompact}
                        />

                        {/* Action Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <ActionCenter 
                                isConnected={isConnected}
                                isCheckingIn={isCheckingIn}
                                doCheckIn={doCheckIn}
                                txStatus={txStatus}
                                lastTxId={lastTxId}
                            />

                            <motion.div variants={itemVariants} className="lg:col-span-1">
                                <EngagementModule />
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <motion.div variants={itemVariants} className="lg:col-span-1">
                                <PortfolioWidget variants={itemVariants} />
                            </motion.div>

                            <ActivityFeed
                                activity={activity}
                                isLoading={isLoadingActivity}
                                variants={itemVariants}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <motion.div variants={itemVariants} className="lg:col-span-2">
                                <BuilderJourney variants={itemVariants} />
                            </motion.div>
                            <NetworkPulse stats={networkStats} variants={itemVariants} />
                        </div>

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

                        <SocialLinks />

                        {/* Global Leaderboard */}
                        <Leaderboard variants={itemVariants} />

                        {/* Network Health Monitor */}
                        <NetworkHealth variants={itemVariants} />

                        <Roadmap />
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

                        <EcosystemHub variants={itemVariants} />

                        {/* Contract Analytics */}
                        <ContractAnalytics variants={itemVariants} />
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

                        <BuilderSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            handleSearch={() => {
                                if (searchQuery.length > 20) {
                                    setSearchResult({
                                        address: searchQuery,
                                        score: Math.floor(Math.random() * 400) + 550,
                                        reputationScore: Math.floor(Math.random() * 40) + 60,
                                        githubVerified: true,
                                        talentScore: Math.floor(Math.random() * 30) + 70
                                    });
                                }
                            }}
                            searchResult={searchResult}
                            variants={itemVariants}
                        />

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

                        {/* Transaction History */}
                        <TransactionHistory variants={itemVariants} />

                        <SecurityModule variants={itemVariants} />
                    </motion.div>
                )}
            </AnimatePresence>

            </div>

            <Footer />
        </main>
    );
}
