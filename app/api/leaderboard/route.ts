import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

/**
 * GET /api/leaderboard
 *
 * Returns top 20 users ranked by commits (7 days) and streak.
 */
export async function GET() {
  try {
    const supabase = createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // Get top users by commits and streak concurrently
    const [
      { data: topByCommits },
      { data: topByStreak }
    ] = await Promise.all([
      supabase
        .from("islands")
        .select(`
          total_commits,
          streak,
          user_id,
          users!inner (
            username,
            avatar
          )
        `)
        .order("total_commits", { ascending: false })
        .limit(20),

      supabase
        .from("islands")
        .select(`
          total_commits,
          streak,
          user_id,
          users!inner (
            username,
            avatar
          )
        `)
        .order("streak", { ascending: false })
        .limit(20)
    ]);

    return NextResponse.json({
      byCommits: topByCommits || [],
      byStreak: topByStreak || [],
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
