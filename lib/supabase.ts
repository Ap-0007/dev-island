import { createClient as createSupabaseClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_URL — Supabase features disabled");
}

// Server-side Supabase client using service role key (full access)
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types for our database tables
export interface DbUser {
  id: string;
  username: string;
  avatar: string | null;
  created_at: string;
}

export interface DbIsland {
  id: string;
  user_id: string;
  activity_json: number[];
  total_commits: number;
  streak: number;
  last_updated: string;
}

export interface DbVisit {
  id: string;
  island_id: string;
  visitor_id: string | null;
  visited_at: string;
}
