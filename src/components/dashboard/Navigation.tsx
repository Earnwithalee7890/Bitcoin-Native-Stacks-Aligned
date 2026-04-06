"use client";

import { motion } from "framer-motion";
import { Rocket, Wallet, Users, LayoutGrid, List } from "lucide-react";
import { useStacks } from "@/components/StacksProvider";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCompact: boolean;
  setIsCompact: (compact: boolean) => void;
}

export function Navigation({ activeTab, setActiveTab, isCompact, setIsCompact }: NavigationProps) {
  const {
    connectWallet,
    isConnected,
    userData,
    disconnectWallet,
    isInitializing
  } = useStacks();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between mb-12 glass-card p-4 px-6 md:px-10 sticky top-4 z-50 backdrop-blur-xl border border-white/5"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 bg-gradient-to-br from-[#5546FF] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group cursor-pointer transition-transform hover:scale-105" 
          onClick={() => setActiveTab("overview")}
        >
          <Rocket className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight block leading-none">STX Builder</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#5546FF] font-black">Week-3 Edition</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10" role="tablist" aria-label="Dashboard views">
          {["overview", "ecosystem", "builder"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${tab}-panel`}
              className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab
                ? "bg-[#5546FF] text-white shadow-lg shadow-[#5546FF]/30"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                } focus-visible:ring-2 focus-visible:ring-[#5546FF] focus-visible:outline-none`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCompact(!isCompact)}
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10 group relative"
          title={isCompact ? "Standard View" : "Compact View"}
          aria-label="Toggle layout density"
        >
          {isCompact ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase tracking-widest pointer-events-none">
            {isCompact ? "List View" : "Grid View"}
          </span>
        </button>
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
  );
}
