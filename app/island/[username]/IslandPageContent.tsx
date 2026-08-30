"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import AuraCore from "../../components/AuraCore";
import AuraCard from "../../components/AuraCard";
import UserCard from "../../components/UserCard";
import { calculateAura } from "@/lib/aura-engine";
import type { AuraData } from "@/lib/aura-engine";
import { useAura } from "@/lib/aura-context";

interface IslandPageContentProps {
  username: string;
}

interface ActivityData {
  activity: number[];
  totalCommits: number;
  streak: number;
  allTimeTotal?: number;
  visitCount: number;
  lastUpdated: string;
}

export default function IslandPageContent({ username }: IslandPageContentProps) {
  const { data: session } = useSession();
  const [data, setData] = useState<ActivityData | null>(null);
  const [aura, setAuraLocal] = useState<AuraData | null>(null);
  const { setAura } = useAura();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visited, setVisited] = useState(false);

  const isOwner = session?.user?.username === username;

  useEffect(() => {
    async function fetchActivity() {
      setLoading(true);
      try {
        const res = await fetch(`/api/island?username=${username}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("This developer hasn't synced their Aura yet.");
          } else {
            throw new Error("Failed to fetch activity");
          }
          return;
        }
        const activityData: ActivityData = await res.json();
        setData(activityData);
        setAuraLocal(calculateAura(activityData.activity));
      } catch (err) {
        console.error(err);
        setError("Could not load this Aura.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [username]);

  // Update Global background
  useEffect(() => {
    if (aura) {
      setAura(aura);
    }
  }, [aura, setAura]);

  // Log visit
  useEffect(() => {
    if (!data || isOwner || visited) return;

    async function logVisit() {
      try {
        await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islandUsername: username,
          }),
        });
        setVisited(true);
      } catch (err) {
        console.error("Failed to log visit:", err);
      }
    }

    logVisit();
  }, [data, isOwner, visited, username, session]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="relative inline-block mb-10">
          <motion.div
            className="h-20 w-20 rounded-full bg-indigo-500"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
        </div>
        <p className="text-white/20 font-black tracking-[0.4em] text-xs uppercase">Sailing to {username}&apos;s sector...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="bento-glass mx-auto max-w-md p-12">
          <div className="mb-6 text-6xl">🌌</div>
          <h2 className="aura-text mb-4 text-3xl font-black uppercase tracking-tighter">Sector Dark</h2>
          <p className="mb-8 text-sm text-white/40 leading-relaxed font-bold">{error}</p>
          <Link href="/" className="btn-hype">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!aura || !data) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-20 relative">
      <motion.div
        className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-1">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl uppercase">
              {username}
            </h1>
            {isOwner && (
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                ✨ SELF
              </span>
            )}
          </div>
          <p className="text-lg text-white/40 font-medium">
            Last Sync: {new Date(data.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 px-6 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
          >
            GitHub
          </a>
          <Link href="/leaderboard" className="btn-hype !px-8 text-[10px]">
            RANKS
          </Link>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Main Display */}
        <div className="flex flex-col gap-8">
          <motion.div
            className="bento-glass p-0 relative overflow-hidden flex flex-col min-h-[600px] bg-black/40 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-grain opacity-5" />
            <AuraCore aura={aura} size={500} />
          </motion.div>
          
          <div className="bento-glass p-10 bg-white/[0.02]">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">
              Real-time Activity
            </h3>
            <div className="flex gap-1.5 h-16 items-end">
              {data.activity.map((val, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(100, (val / 15) * 100)}%` }}
                  style={{
                    backgroundColor: val === 0 ? "rgba(255,255,255,0.05)" : aura.color,
                    opacity: val === 0 ? 0.3 : 0.4 + (val / 10) * 0.6,
                    boxShadow: val > 5 ? `0 0 15px ${aura.glowColor}40` : "none"
                  }}
                  title={`Day ${i + 1}: ${val} commits`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <AuraCard aura={aura} username={username} />
          <UserCard
            username={username}
            totalCommits={data.totalCommits}
            streak={data.streak}
            visitCount={data.visitCount}
            allTimeTotal={data.allTimeTotal}
          />
          
          <div className="bento-glass p-8 text-center bg-gradient-to-br from-indigo-500/10 to-transparent">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Lore Scan</div>
             <p className="text-white/40 text-xs font-medium leading-relaxed">
               Scanning digital imprint across 30 repositories... <br/>
               Vibe is steady. No anomalies detected.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

