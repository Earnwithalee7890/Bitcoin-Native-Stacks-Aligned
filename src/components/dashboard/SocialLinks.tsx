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
            <div className="flex flex-wrap gap-4">
                {[
                    { icon: Twitter, label: "Follow on Twitter", href: "https://twitter.com/aleekhoso" },
                    { icon: Github, label: "View GitHub Profile", href: "https://github.com/sawera-mastoi" },
                    { icon: Globe, label: "Visit Personal Website", href: "https://aleekhoso.com" }
                ].map((social, i) => (
                    <button
                        key={i}
                        onClick={() => window.open(social.href, "_blank")}
                        aria-label={social.label}
                        className="glass-button p-4 rounded-2xl hover:scale-110 transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#5546FF] focus-visible:outline-none"
                    >
                        <social.icon className="w-6 h-6" aria-hidden="true" />
                    </button>
                ))}
            </div>
        </motion.section>
    );
}
