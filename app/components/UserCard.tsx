"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface UserCardProps {
  username: string;
  avatar?: string | null;
  totalCommits: number;
  streak: number;
  visitCount: number;
  allTimeTotal?: number;
}

export default function UserCard({
  username,
  avatar,
  totalCommits,
  streak,
  visitCount,
  allTimeTotal,
}: UserCardProps) {
  return (
    <motion.div
      className="bento-glass p-8 relative overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-grain opacity-5" />
      
      {/* Profile Header */}
      <div className="flex items-center gap-5 relative z-10">
        <div className="relative group">
          {avatar ? (
            <Image
              src={avatar}
              alt={username}
              width={72}
              height={72}
              className="rounded-2xl ring-1 ring-white/10 sturdy-shadow transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white/5 text-3xl ring-1 ring-white/10 sturdy-shadow">
              👾
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-black" />
        </div>
        
        <div>
          <h2 className="aura-text text-xl uppercase tracking-tighter leading-none mb-1">{username}</h2>
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <span className="text-indigo-500">◆</span> Identity: Decoded
          </div>
        </div>
      </div>

      {/* Grid Stats (Sturdy) */}
      <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
        <div className="bento-glass bg-white/[0.02] p-4 flex flex-col items-center justify-center border-white/5">
          <div className="text-xl font-black aura-text">
            {formatNumber(totalCommits)}
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/20">Daily Grind</div>
        </div>
        
        <div className="bento-glass bg-white/[0.02] p-4 flex flex-col items-center justify-center border-white/5 relative">
          <div className="text-xl font-black text-orange-400">
            {streak}
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/20">Aura Streak</div>
          {streak > 3 && <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full blur-sm animate-pulse" />}
        </div>

        {allTimeTotal !== undefined && (
          <div className="bento-glass bg-white/[0.02] p-4 flex flex-col items-center justify-center border-white/5">
            <div className="text-xl font-black text-emerald-400">
              {formatNumber(allTimeTotal)}
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/20">Main Quest</div>
          </div>
        )}
        
        <div className="bento-glass bg-white/[0.02] p-4 flex flex-col items-center justify-center border-white/5">
          <div className="text-xl font-black text-sky-400">
            {formatNumber(visitCount)}
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/20">Hype Level</div>
        </div>
      </div>
    </motion.div>
  );
}

