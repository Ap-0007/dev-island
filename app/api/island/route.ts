import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@/lib/supabase";
import { fetchUserActivity } from "@/lib/github";

/**
 * GET /api/island?username=xxx
 *
 * Returns cached island data from Supabase.
 * If authenticated and data is stale (>24h), refreshes from GitHub.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter required" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const session = await auth();

    // Try to get cached island data
    if (supabase) {
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      if (user) {
        const { data: island } = await supabase
          .from("islands")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (island) {
          const lastUpdated = new Date(island.last_updated);
          const now = new Date();
          const hoursSinceUpdate =
            (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

          // Return cached if fresh enough or if we can't refresh
          if (hoursSinceUpdate < 24 || !session?.accessToken) {
            // Get visit count
            const { count: visitCount } = await supabase
              .from("visits")
              .select("*", { count: "exact", head: true })
              .eq("island_id", island.id);

            return NextResponse.json({
              activity: island.activity_json,
              totalCommits: island.total_commits,
              streak: island.streak,
              lastUpdated: island.last_updated,
              visitCount: visitCount || 0,
              repoCount: island.repo_count || 1, // Fallback if missing
              cached: true,
            });
          }
        }
      }
    }

    // If authenticated and data is stale or missing, fetch fresh
    if (session?.accessToken && session?.user?.username === username) {
      const activity = await fetchUserActivity(session.accessToken, username);

      // Upsert to Supabase
      if (supabase) {
        // Upsert user
        const { data: upsertedUser } = await supabase
          .from("users")
          .upsert(
            {
              username,
              avatar: session.user.image || null,
            },
            { onConflict: "username" }
          )
          .select("id")
          .single();

        if (upsertedUser) {
          // Upsert island
          const { data: island } = await supabase
            .from("islands")
            .upsert(
              {
                user_id: upsertedUser.id,
                activity_json: activity.dailyActivity,
                total_commits: activity.totalCommits,
                streak: activity.streak,
                repo_count: activity.repoCount,
                last_updated: new Date().toISOString(),
              },
              { onConflict: "user_id" }
            )
            .select("id")
            .single();

          // Get visit count
          let visitCount = 0;
          if (island) {
            const { count } = await supabase
              .from("visits")
              .select("*", { count: "exact", head: true })
              .eq("island_id", island.id);
            visitCount = count || 0;
          }

          return NextResponse.json({
            activity: activity.dailyActivity,
            totalCommits: activity.totalCommits,
            streak: activity.streak,
            allTimeTotal: activity.allTimeTotal,
            repoCount: activity.repoCount,
            lastUpdated: new Date().toISOString(),
            visitCount,
            cached: false,
          });
        }
      }

      // No Supabase — return direct from GitHub
      return NextResponse.json({
        activity: activity.dailyActivity,
        totalCommits: activity.totalCommits,
        streak: activity.streak,
        allTimeTotal: activity.allTimeTotal,
        repoCount: activity.repoCount,
        lastUpdated: new Date().toISOString(),
        visitCount: 0,
        cached: false,
      });
    }

    // No cached data and can't fetch fresh
    return NextResponse.json(
      { error: "No island data found for this user" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Island API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch island data" },
      { status: 500 }
    );
  }
}
