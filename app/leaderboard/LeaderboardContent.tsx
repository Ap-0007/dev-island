"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import LeaderboardTable from "../components/LeaderboardTable";
import { useAura } from "@/lib/aura-context";
import { AuraData, AuraClass } from "@/lib/aura-engine";

interface LeaderboardUser {
  total_commits: number;
  streak: number;
  users: {
    username: string;
    avatar: string | null;
  };
}

interface LeaderboardData {
  byCommits: LeaderboardUser[];
  byStreak: LeaderboardUser[];
}

export default function LeaderboardContent() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"commits" | "streak">("commits");
  const { setAura } = useAura();

  // Custom Trophy Aura
  const trophyAura: AuraData = useMemo(() => ({
    class: "The Champion" as AuraClass,
    lore: "Where legends are made and streaks are born.",
    color: "#f59e0b", // Gold
    glowColor: "#fbbf24",
    geometry: "crystalline",
    vibe: "hyped",
    stats: { consistency: 100, intensity: 100, versatility: 100, impact: 100 }
  }), []);

  useEffect(() => {
    setAura(trophyAura);
  }, [setAura, trophyAura]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const json: LeaderboardData = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 relative">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="glow-text mb-2 text-3xl font-extrabold sm:text-4xl">
          🏆 Leaderboard
        </h1>
        <p className="text-white/40">
          The most active island builders this week
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("commits")}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
            activeTab === "commits"
              ? "bg-accent/20 text-accent-light ring-1 ring-accent/30"
              : "text-white/40 hover:text-white/60"
          }`}
          id="tab-commits"
        >
          🔥 Commits
        </button>
        <button
          onClick={() => setActiveTab("streak")}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
            activeTab === "streak"
              ? "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
              : "text-white/40 hover:text-white/60"
          }`}
          id="tab-streak"
        >
          ⚡ Streaks
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <motion.div
            className="mb-4 text-4xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🏆
          </motion.div>
          <p className="text-white/50">Loading rankings...</p>
        </div>
      ) : data ? (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LeaderboardTable
            users={activeTab === "commits" ? data.byCommits : data.byStreak}
            type={activeTab}
          />
        </motion.div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-white/40">Could not load leaderboard.</p>
        </div>
      )}
    </div>
  );
}
