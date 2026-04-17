import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchUserActivity } from "@/lib/github";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken || !session?.user?.username) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const activity = await fetchUserActivity(
      session.accessToken,
      session.user.username
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub activity" },
      { status: 500 }
    );
  }
}
