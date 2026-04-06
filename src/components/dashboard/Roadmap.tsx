"use client";

import { motion } from "framer-motion";
import { Map } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function Roadmap() {
    return (
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
    );
}
