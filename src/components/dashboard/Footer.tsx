"use client";

import { motion } from "framer-motion";
import { Globe, Cpu, Shield } from "lucide-react";

export function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="pt-32 pb-16 text-center border-t border-white/5"
        >
            <div className="flex flex-wrap justify-center gap-10 mb-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2 scale-110"><Globe className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">Stacks Foundation</span></div>
                <div className="flex items-center gap-2 scale-110"><Cpu className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">Hiro Ecosystem</span></div>
                <div className="flex items-center gap-2 scale-110"><Shield className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">Clarity 4 Certified</span></div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left px-4 mb-20">
                <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Developed By</h4>
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open("https://github.com/Earnwithalee7890", "_blank")}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5546FF] to-[#3B82F6] flex items-center justify-center font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">A</div>
                        <div>
                            <p className="text-lg font-black text-white">aleekhoso</p>
                            <p className="text-xs text-[#5546FF] font-black uppercase tracking-widest">Stacks Builder #34</p>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 text-right flex flex-col items-end">
                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Challenge Compliance</h4>
                    <div className="flex flex-wrap justify-end gap-3 max-w-sm">
                        {["Reown AppKit v2", "Clarity 4 Adoption", "WalletConnect v2", "Bitcoin L2 Alignment", "Next.js 15 Client-Side"].map((tech, i) => (
                            <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-[#5546FF]/40 transition-all cursor-default">{tech}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] px-4">
                © 2025 BITCOIN-NATIVE & STACKS-ALIGNED PROTOCOL. THE FUTURE OF BITCOIN IS NOW. DEPLOYED ON STACKS MAINNET.
            </p>
        </motion.footer>
    );
}
