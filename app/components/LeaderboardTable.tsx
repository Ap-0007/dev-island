"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface LeaderboardUser {
  total_commits: number;
  streak: number;
  users: {
    username: string;
    avatar: string | null;
  };
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  type: "commits" | "streak";
}

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

export default function LeaderboardTable({ users, type }: LeaderboardTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-white/[0.06] px-6 py-4">
        <h3 className="text-lg font-bold">
          {type === "commits" ? "🔥 Top Commits (7 days)" : "⚡ Longest Streaks"}
        </h3>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {users.length === 0 ? (
          <div className="px-6 py-12 text-center text-white/30">
            <p className="text-4xl mb-3">🏝️</p>
            <p>No island settlers yet. Be the first!</p>
          </div>
        ) : (
          users.map((entry, index) => (
            <motion.div
              key={entry.users.username}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={`/island/${entry.users.username}`}
                className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.03]"
                id={`leaderboard-${type}-${index}`}
              >
                {/* Rank */}
                <div className="w-8 text-center text-lg font-bold">
                  {index < 3 ? (
                    <span>{RANK_EMOJIS[index]}</span>
                  ) : (
                    <span className="text-sm text-white/30">{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                {entry.users.avatar ? (
                  <Image
                    src={entry.users.avatar}
                    alt={entry.users.username}
                    width={36}
                    height={36}
                    className="rounded-full ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm">
                    🏝️
                  </div>
                )}

                {/* Username */}
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {entry.users.username}
                  </div>
                </div>

                {/* Stat */}
                <div className="text-right">
                  {type === "commits" ? (
                    <div className="font-mono text-sm font-bold text-accent-light">
                      {formatNumber(entry.total_commits)} commits
                    </div>
                  ) : (
                    <div className="font-mono text-sm font-bold text-orange-400">
                      {entry.streak} day{entry.streak !== 1 ? "s" : ""} 🔥
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
