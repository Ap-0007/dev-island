"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LoginButton from "./components/LoginButton";
import AuraCore from "./components/AuraCore";
import AuraCard from "./components/AuraCard";
import UserCard from "./components/UserCard";
import { calculateAura } from "@/lib/aura-engine";
import type { AuraData } from "@/lib/aura-engine";
import { useAura } from "@/lib/aura-context";

interface HomeContentProps {
  isLoggedIn: boolean;
  username: string | null;
  avatar: string | null;
}

interface ActivityData {
  activity: number[];
  totalCommits: number;
  streak: number;
  allTimeTotal?: number;
  repoCount?: number;
  visitCount: number;
}

export default function HomeContent({
  isLoggedIn,
  username,
  avatar,
}: HomeContentProps) {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aura, setAuraLocal] = useState<AuraData | null>(null);
  const { setAura } = useAura();

  // Demo Aura for landing page
  const demoAura = useMemo(() => calculateAura([2, 5, 8, 12, 15, 20, 25]), []);

  // Update Global background
  useEffect(() => {
    if (!isLoggedIn) {
      setAura(demoAura);
    } else if (aura) {
      setAura(aura);
    }
    // Clean up or global reset on unmount is optional but usually page-dependent
  }, [isLoggedIn, aura, demoAura, setAura]);

  useEffect(() => {
    if (!isLoggedIn || !username) return;

    async function fetchActivity() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/island?username=${username}`);
        if (!res.ok) throw new Error("Failed to fetch activity");
        const activityData: ActivityData = await res.json();
        setData(activityData);
        setAuraLocal(calculateAura(activityData.activity, activityData.repoCount));
      } catch (err) {
        console.error(err);
        setError("Could not calculate your Aura. Try refreshing.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [isLoggedIn, username]);

  // === Logged Out: Aura Landing Page ===
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-32 relative">
        <div className="bg-grain opacity-5" />
        
        {/* Dynamic Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full" />

        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Vibe Check V2 Live</span>
          </motion.div>
          
          <h1 className="mb-6 text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl">
             <span className="aura-text">STREET</span>
             <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">CRED</span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/40 sm:text-2xl font-medium leading-relaxed">
            Your GitHub activity is your personality. Decode your commits into a 
            <span className="text-white"> Digital Aura</span> and flex your lore.
          </p>
          
          <div className="flex flex-col items-center gap-10">
            <LoginButton />
            
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl">🌌</span>
                <span>Lore Engine</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl">⚡</span>
                <span>Aura Stats</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xl">🚀</span>
                <span>Viral Cards</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo Core */}
        <motion.div
          className="mx-auto mt-32 flex flex-col lg:flex-row items-center justify-center gap-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
            <AuraCore aura={demoAura} size={400} />
          </div>
          
          <AuraCard aura={demoAura} username="Test_User" />
        </motion.div>
      </div>
    );
  }

  // === Logged In: Aura Hub ===
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-20 relative">
      <motion.div
        className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Aura Synced
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
            THE {aura?.class.split(' ').pop()?.toUpperCase() || 'CORE'} ⚡
          </h1>
          <p className="text-xl text-white/40 font-medium">Decoding your digital imprint...</p>
        </div>
        
        <Link
          href={`/island/${username}`}
          className="btn-hype sturdy-shadow !px-10 !py-4"
        >
          SHARE LORE
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bento-glass p-32 text-center"
          >
            <div className="relative inline-block mb-10">
               <motion.div
                className="h-20 w-20 rounded-full bg-indigo-500"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
            </div>
            <p className="text-white/20 font-black tracking-[0.4em] text-xs uppercase">Deciphering Your Code Vibe...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            className="bento-glass border-rose-500/20 p-12 text-center"
          >
            <p className="mb-4 text-rose-400 font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-hype bg-rose-500/10 text-rose-400 border-rose-500/20 border"
            >
              RETRY SYNC
            </button>
          </motion.div>
        ) : aura && data && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-12 lg:grid-cols-[1fr_400px]"
          >
            {/* Main Aura Display */}
            <div className="flex flex-col gap-8">
              <div className="bento-glass p-0 relative overflow-hidden flex flex-col min-h-[600px] bg-black/40 items-center justify-center">
                 <div className="absolute inset-0 bg-grain opacity-5" />
                 <AuraCore aura={aura} size={500} />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bento-glass p-8 bg-white/[0.02]">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Vibe Status</div>
                  <div className="aura-text text-3xl mb-2 lowercase tracking-tighter">{aura.vibe}</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Atmosphere Detected</div>
                </div>
                <div className="bento-glass p-8 bg-white/[0.02]">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Core Geometry</div>
                  <div className="text-3xl text-white font-black tracking-tighter uppercase">{aura.geometry}</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Manifestation</div>
                </div>
              </div>
            </div>

            {/* Aura Card & Stats Sidebar */}
            <div className="flex flex-col gap-8">
              <AuraCard aura={aura} username={username!} />
              
              <UserCard
                username={username!}
                avatar={avatar}
                totalCommits={data.totalCommits}
                streak={data.streak}
                visitCount={data.visitCount}
                allTimeTotal={data.allTimeTotal}
              />
              
              <div className="bento-glass p-10 bg-gradient-to-br from-white/5 to-transparent">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 border-b border-white/5 pb-4">
                   Influence Portal
                 </h3>
                 <div className="flex flex-col gap-3">
                   <Link href="/leaderboard" className="bento-glass-hover bg-white/5 px-6 py-4 flex items-center justify-between group rounded-2xl">
                     <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">RANKINGS</span>
                     <span className="text-xl group-hover:translate-x-2 transition-transform">⚡</span>
                   </Link>
                   <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="bento-glass-hover bg-white/5 px-6 py-4 flex items-center justify-between group rounded-2xl">
                     <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">OS PROFILE</span>
                     <span className="text-xl group-hover:translate-x-2 transition-transform">⚡</span>
                   </a>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



