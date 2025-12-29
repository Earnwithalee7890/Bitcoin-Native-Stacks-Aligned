import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    val: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    tag: string | null;
    variants: any;
}

export function StatsCard({ label, val, icon: Icon, color, bg, tag, variants }: StatsCardProps) {
    return (
        <motion.div variants={variants} className="glass-card p-6 flex flex-col justify-between group cursor-default border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                {tag && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${color} bg-white/5 border border-white/10 px-3 py-1 rounded-full`}>
                        {tag}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black tracking-tight text-white group-hover:translate-x-1 transition-transform">{val}</p>
            </div>
        </motion.div>
    );
}
