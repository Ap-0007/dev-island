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
        setAuraLocal(calculateAura(activityData.activity));
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
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-32 relative overflow-hidden">
        <div className="bg-grain opacity-10" />
        
        {/* Dynamic Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-600/20 blur-[180px] rounded-full animate-aura-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/15 blur-[150px] rounded-full animate-aura-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 backdrop-blur-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-200">Vibe Check V2 Live</span>
          </motion.div>
          
          <h1 className="mb-8 text-6xl font-black tracking-tighter sm:text-8xl lg:text-9xl drop-shadow-2xl">
             <span className="bg-gradient-to-br from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">STREET</span>
             <br className="sm:hidden" />
             <span className="bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent ml-0 sm:ml-4">CRED</span>
          </h1>
          
          <p className="mx-auto mb-14 max-w-2xl text-lg text-white/60 sm:text-2xl font-medium leading-relaxed tracking-wide">
            Your GitHub activity is your personality. Decode your commits into a 
            <span className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"> Digital Aura</span> and flex your lore.
          </p>
          
          <div className="flex flex-col items-center gap-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <LoginButton />
            </motion.div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              <div className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 hover:text-indigo-300 duration-300">
                <span className="text-2xl bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg">🌌</span>
                <span>Lore Engine</span>
              </div>
              <div className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 hover:text-purple-300 duration-300">
                <span className="text-2xl bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg">⚡</span>
                <span>Aura Stats</span>
              </div>
              <div className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 hover:text-pink-300 duration-300">
                <span className="text-2xl bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg">🚀</span>
                <span>Viral Cards</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo Core */}
        <motion.div
          className="mx-auto mt-40 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 relative z-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <div className="relative group hover:scale-105 transition-transform duration-700">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full scale-150 opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="relative">
               <AuraCore aura={demoAura} size={450} />
            </div>
          </div>
          
          <div className="relative z-20 hover:-translate-y-4 transition-transform duration-500 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute -inset-4 bg-gradient-to-b from-white/10 to-transparent blur-xl rounded-3xl -z-10"></div>
            <AuraCard aura={demoAura} username="Test_User" />
          </div>
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



