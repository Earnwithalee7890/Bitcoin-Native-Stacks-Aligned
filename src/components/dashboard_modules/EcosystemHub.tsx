import { motion } from "framer-motion";
import { ExternalLink, Zap, Flame, Layout, ArrowRight } from "lucide-react";

interface EcosystemHubProps {
    variants: any;
}

const PROJECTS = [
    { title: "Hiro Explorer", desc: "Track transactions & blocks", icon: Layout, color: "text-blue-500", bg: "bg-blue-500/10", link: "https://explorer.hiro.so" },
    { title: "Stacks Docs", desc: "Clarity smart contracts", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10", link: "https://docs.stacks.co" },
    { title: "Gamma.io", desc: "NFT marketplace on Bitcoin", icon: Flame, color: "text-purple-500", bg: "bg-purple-500/10", link: "https://gamma.io" },
];

export function EcosystemHub({ variants }: EcosystemHubProps) {
    return (
        <div className="space-y-6">
            <motion.div variants={variants} className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Stacks Universe</h3>
                    <p className="text-gray-500 text-xs mt-1 font-medium tracking-wide">Essential ecosystem resources</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-2 group">
                    View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
                {PROJECTS.map((project, idx) => (
                    <motion.a
                        key={project.title}
                        href={project.link}
                        target="_blank"
                        variants={variants}
                        className="glass-card p-4 flex items-center justify-between group hover:border-orange-500/20 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${project.bg} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}>
                                <project.icon className={`w-6 h-6 ${project.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">{project.title}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{project.desc}</p>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-orange-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
