import { motion } from "framer-motion";
import { User, Layers, History } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { UserStats, MarketData } from "@/types/dashboard";

interface StatsGridProps {
    userStats: UserStats | null;
    marketData: MarketData | null;
    currentBlock: number;
    variants: any;
    isConnected: boolean;
}

export function StatsGrid({ userStats, marketData, currentBlock, variants, isConnected }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
                label="Your Check-ins"
                val={isConnected ? (userStats?.checkInCount.toString() || "0") : "N/A"}
                icon={User}
                color="text-orange-500"
                bg="bg-orange-500/10"
                tag={isConnected ? "Live" : "Auth Required"}
                variants={variants}
            />
            <StatsCard
                label="Stacks Height"
                val={currentBlock.toLocaleString()}
                icon={Layers}
                color="text-blue-500"
                bg="bg-blue-500/10"
                tag="Nakamoto"
                variants={variants}
            />
            <StatsCard
                label="Last Transaction"
                val={userStats?.lastActive || "Recently"}
                icon={History}
                color="text-green-500"
                bg="bg-green-500/10"
                tag="Syncing"
                variants={variants}
            />
        </div>
    );
}
