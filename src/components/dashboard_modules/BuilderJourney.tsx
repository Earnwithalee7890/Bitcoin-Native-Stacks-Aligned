import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

interface BuilderJourneyProps {
    variants: any;
}

const MILESTONES = [
    { title: "Point Checklist", status: "completed", date: "Week 1", desc: "Setting up foundations" },
    { title: "Contract Deploy", status: "completed", date: "Week 2", desc: "Clarity 4 verification" },
    { title: "Premium App", status: "in-progress", date: "Week 3", desc: "Advanced UI/UX polishing" },
];

export function BuilderJourney({ variants }: BuilderJourneyProps) {
    return (
        <motion.div variants={variants} className="glass-card p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle2 className="w-32 h-32 text-orange-500" />
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-black text-white tracking-tight mb-8">Builder Odyssey</h3>
                <div className="space-y-8">
                    {MILESTONES.map((step, idx) => (
                        <div key={step.title} className="flex gap-6 group/step">
                            <div className="relative flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.status === 'completed' ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-gray-800 border-2 border-gray-700'}`}>
                                    {step.status === 'completed' ? (
                                        <CheckCircle2 className="w-4 h-4 text-black font-black" />
                                    ) : (
                                        <Circle className="w-2 h-2 text-orange-500 animate-pulse" />
                                    )}
                                </div>
                                {idx !== MILESTONES.length - 1 && (
                                    <div className={`w-[2px] h-full absolute top-6 ${step.status === 'completed' ? 'bg-orange-500/30' : 'bg-gray-800'}`} />
                                )}
                            </div>
                            <div className="pb-4">
                                <div className="flex items-center gap-3 mb-1">
                                    <p className={`text-sm font-black tracking-tight ${step.status === 'completed' ? 'text-white' : 'text-gray-500'}`}>{step.title}</p>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${step.status === 'completed' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}>
                                        {step.date}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 font-medium group-hover/step:text-gray-400 transition-colors uppercase tracking-widest">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
