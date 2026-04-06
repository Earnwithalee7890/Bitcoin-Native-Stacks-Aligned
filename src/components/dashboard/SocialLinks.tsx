"use client";

import { motion } from "framer-motion";
import { Github, Globe, Users, Sparkles } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const SOCIAL_LINKS = [
    { name: "GitHub", handle: "@Earnwithalee7890", url: "https://github.com/Earnwithalee7890", icon: Github, color: "hover:bg-white/10 hover:shadow-white/5" },
    { name: "Twitter", handle: "@aleeasghar78", url: "https://x.com/aleeasghar78", icon: Globe, color: "hover:bg-blue-500/10 hover:shadow-blue-500/5" },
    { name: "Farcaster", handle: "aleekhoso", url: "https://farcaster.xyz/aleekhoso", icon: Users, color: "hover:bg-purple-500/10 hover:shadow-purple-500/5" },
    { name: "Talent", handle: "aleekhoso", url: "https://talent.app/aleekhoso", icon: Sparkles, color: "hover:bg-[#5546FF]/10 hover:shadow-[#5546FF]/5" }
];

export function SocialLinks() {
    return (
        <motion.section variants={itemVariants} className="pt-20 pb-12">
            <div className="flex items-center gap-6 mb-12">
                <div className="h-px bg-white/10 flex-grow" />
                <h2 className="text-3xl font-black tracking-tight whitespace-nowrap px-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white">Connect with the Creator</h2>
                <div className="h-px bg-white/10 flex-grow" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                {SOCIAL_LINKS.map((link, i) => (
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
    );
}
