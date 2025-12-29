import { motion, AnimatePresence } from "framer-motion";
import { Search, History, Fingerprint } from "lucide-react";
import { SearchResult } from "@/types/dashboard";

interface BuilderSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
    searchResult: SearchResult | null;
    variants: any;
}

export function BuilderSearch({ searchQuery, setSearchQuery, handleSearch, searchResult, variants }: BuilderSearchProps) {
    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                        <Search className="w-5 h-5 text-blue-500" />
                        Reputation Explorer
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 font-medium tracking-wide">Verify Stacks builder identity & social signals</p>
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl group focus-within:border-blue-500/50 transition-all w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Enter Stacks address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm text-white px-4 py-2 w-full md:w-64 font-medium"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95 whitespace-nowrap"
                    >
                        Verify Reputation
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {searchResult ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Fingerprint className="w-32 h-32 text-blue-500" />
                        </div>

                        <div className="md:col-span-2 space-y-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Fingerprint className="w-3 h-3" />
                                    On-Chain Identity
                                </p>
                                <p className="text-lg font-mono font-bold text-white break-all leading-tight">{searchResult.address}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Github Signals</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-xs font-bold text-white uppercase tracking-tight">{searchResult.githubVerified ? 'Strong' : 'Weak'}</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Talent API Score</p>
                                    <span className="text-xs font-bold text-white">{searchResult.talentScore}/100</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 relative z-10">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Builder Score</p>
                            <p className="text-5xl font-black text-white tracking-tighter">{searchResult.reputationScore}</p>
                            <div className="mt-4 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
                                    {searchResult.reputationScore > 80 ? 'Elite' : searchResult.reputationScore > 50 ? 'Rising' : 'Newbie'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl"
                    >
                        <Search className="w-10 h-10 text-gray-800 mb-4" />
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Identity Lookup</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
