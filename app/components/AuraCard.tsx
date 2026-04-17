"use client";

import { motion } from "framer-motion";
import type { AuraData } from "@/lib/aura-engine";

interface AuraCardProps {
  aura: AuraData;
  username: string;
}

export default function AuraCard({ aura, username }: AuraCardProps) {
  return (
    <motion.div
      className="bento-glass relative min-h-[500px] w-full max-w-[400px] overflow-hidden p-0 sturdy-shadow"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="bg-grain opacity-10" />
      
      {/* Top Banner */}
      <div className="relative h-40 w-full overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30 blur-2xl"
          style={{ backgroundColor: aura.color }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            DIGITAL IDENTITY // 0x{username.length}
          </div>
          <h2 className="aura-text text-4xl font-black uppercase tracking-tighter shimmer-fast">
             {username}
          </h2>
        </div>
      </div>

      {/* Lore Content */}
      <div className="relative p-8 pt-4">
        <div className="mb-8 flex flex-col gap-4">
          <div className="inline-flex self-start items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
            <span className="text-xl" style={{ color: aura.glowColor }}>✦</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-white/60">
              {aura.class}
            </span>
          </div>
          
          <p className="text-lg font-medium leading-relaxed text-white/80">
            &quot;{aura.lore}&quot;
          </p>
        </div>

        {/* Aura Stats Grid */}
        <div className="space-y-6">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">
            Aura Analysis
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(aura.stats).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40">
                  <span>{key}</span>
                  <span>{Math.round(value)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: aura.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-12 flex items-center justify-between">
           <div className="flex flex-col gap-1">
             <span className="text-[9px] font-black tracking-widest text-white/10">POWERED BY</span>
             <span className="aura-text text-xs font-black tracking-tighter">ISLAND.DEV</span>
           </div>
           
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black font-black text-xl sturdy-shadow">
             I
           </div>
        </div>
      </div>

      {/* Decorative Aura Shimmer */}
      <div 
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: aura.glowColor }}
      />
    </motion.div>
  );
}
