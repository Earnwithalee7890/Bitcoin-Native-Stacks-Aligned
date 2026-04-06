"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ExternalLink } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function HeroSection() {
    return (
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
    );
}
