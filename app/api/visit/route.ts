import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { auth } from "@/auth";

/**
 * POST /api/visit
 * Body: { islandUsername: string }
 *
 * Logs a visit to an island. Returns updated visit count.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const visitorUsername = session?.user?.username || null;
    const body = await request.json();
    const { islandUsername } = body;

    if (!islandUsername) {
      return NextResponse.json(
        { error: "islandUsername is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // Find island owner
    const { data: owner } = await supabase
      .from("users")
      .select("id")
      .eq("username", islandUsername)
      .single();

    if (!owner) {
      return NextResponse.json(
        { error: "Island owner not found" },
        { status: 404 }
      );
    }

    // Find island
    const { data: island } = await supabase
      .from("islands")
      .select("id")
      .eq("user_id", owner.id)
      .single();

    if (!island) {
      return NextResponse.json(
        { error: "Island not found" },
        { status: 404 }
      );
    }

    // Find visitor (optional)
    let visitorId: string | null = null;
    if (visitorUsername) {
      const { data: visitor } = await supabase
        .from("users")
        .select("id")
        .eq("username", visitorUsername)
        .single();
      visitorId = visitor?.id || null;
    }

    // Don't log visit if visiting own island
    if (visitorId === owner.id) {
      const { count } = await supabase
        .from("visits")
        .select("*", { count: "exact", head: true })
        .eq("island_id", island.id);

      return NextResponse.json({ visitCount: count || 0, selfVisit: true });
    }

    // Insert visit
    await supabase.from("visits").insert({
      island_id: island.id,
      visitor_id: visitorId,
    });

    // Get updated count
    const { count } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("island_id", island.id);

    return NextResponse.json({ visitCount: count || 0 });
  } catch (error) {
    console.error("Visit API error:", error);
    return NextResponse.json(
      { error: "Failed to log visit" },
      { status: 500 }
    );
  }
}
