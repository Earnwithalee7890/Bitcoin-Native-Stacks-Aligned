"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface LeaderboardEntry {
    rank: number;
    address: string;
    checkIns: number;
    lastActive: string;
    trend: "up" | "down" | "same";
}

interface LeaderboardProps {
    variants?: any;
}

export function Leaderboard({ variants }: LeaderboardProps) {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching leaderboard data
        // In production, this would fetch from the contract or API
        const mockData: LeaderboardEntry[] = [
            { rank: 1, address: "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT", checkIns: 47, lastActive: "2h ago", trend: "up" },
            { rank: 2, address: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE", checkIns: 42, lastActive: "5h ago", trend: "same" },
            { rank: 3, address: "SPZRAE52H2NC566MFFTEQM3JQVS394J7QBXQ8MZ8", checkIns: 38, lastActive: "1d ago", trend: "up" },
            { rank: 4, address: "SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS", checkIns: 35, lastActive: "3h ago", trend: "down" },
            { rank: 5, address: "SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335", checkIns: 31, lastActive: "6h ago", trend: "up" },
            { rank: 6, address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7", checkIns: 28, lastActive: "12h ago", trend: "same" },
            { rank: 7, address: "SP1QNJS73NDD7DKE27SH9FE0YJX0JVQGQPK52J1D6", checkIns: 25, lastActive: "8h ago", trend: "up" },
            { rank: 8, address: "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9", checkIns: 22, lastActive: "1d ago", trend: "down" },
        ];

        setTimeout(() => {
            setLeaders(mockData);
            setIsLoading(false);
        }, 800);
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Award className="w-6 h-6 text-amber-600" />;
            default:
                return null;
        }
    };

    const getTrendIcon = (trend: "up" | "down" | "same") => {
        if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (trend === "down") return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
        return <Zap className="w-4 h-4 text-gray-500" />;
    };

    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-[#5546FF]" />
                        Global Leaderboard
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Top builders ranked by check-in activity</p>
                </div>
                <div className="bg-[#5546FF]/10 border border-[#5546FF]/20 px-4 py-2 rounded-xl">
                    <span className="text-xs font-black uppercase tracking-widest text-[#5546FF]">Live Rankings</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#5546FF]/30 border-t-[#5546FF] rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-3">
                    {leaders.map((leader, index) => (
                        <motion.div
                            key={leader.address}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all group cursor-pointer ${leader.rank <= 3
                                    ? "bg-gradient-to-r from-[#5546FF]/10 to-transparent border-[#5546FF]/20 hover:border-[#5546FF]/40"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                }`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${leader.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                                        leader.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                                            leader.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                                                "bg-white/5 text-gray-500"
                                    }`}>
                                    {leader.rank <= 3 ? getRankIcon(leader.rank) : `#${leader.rank}`}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-mono font-bold text-white truncate">
                                            {leader.address.slice(0, 8)}...{leader.address.slice(-6)}
                                        </p>
                                        {getTrendIcon(leader.trend)}
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Last active: {leader.lastActive}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-2xl font-black text-white">{leader.checkIns}</p>
                                <p className="text-xs text-gray-500 font-black uppercase tracking-wider">Check-ins</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500 font-medium">
                    Rankings update every 10 minutes • Based on mainnet check-in activity
                </p>
            </div>
        </motion.div>
    );
}
