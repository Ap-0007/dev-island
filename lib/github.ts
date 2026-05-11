import axios from "axios";

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits?: Array<{ sha: string }>;
    size?: number;
  };
}

export interface ActivityData {
  dailyActivity: number[]; // 30 days, index 0 = oldest
  totalCommits: number;    // last 7 days
  streak: number;          // consecutive days with commits (from today backwards)
  allTimeTotal: number;    // total in the 30-day window
}

/**
 * Fetch user's GitHub events and parse into activity data.
 * Uses authenticated requests for higher rate limits and private event access.
 */
export async function fetchUserActivity(
  accessToken: string,
  username: string
): Promise<ActivityData> {
  // Fetch up to 3 pages concurrently (90 events max — API returns 30 per page)
  const pageNumbers = [1, 2, 3];
  const responses = await Promise.all(
    pageNumbers.map((page) =>
      axios
        .get<GitHubEvent[]>(`https://api.github.com/users/${username}/events`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          params: { page, per_page: 30 },
        })
        .catch((error) => {
          console.error(`Failed to fetch events page ${page}:`, error);
          return null;
        })
    )
  );

  const events: GitHubEvent[] = [];
  for (const response of responses) {
    if (response && response.data) {
      events.push(...response.data);
      if (response.data.length < 30) break;
    } else {
      break;
    }
  }

  // Build a map of commits per day for the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyMap = new Map<string, number>();

  // Initialize all 30 days to 0
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().split("T")[0];
    dailyMap.set(key, 0);
  }

  // Count commits from PushEvents
  for (const event of events) {
    if (event.type !== "PushEvent") continue;

    const eventDate = new Date(event.created_at);
    if (eventDate < thirtyDaysAgo) continue;

    const key = eventDate.toISOString().split("T")[0];
    const commitCount = event.payload.commits?.length || event.payload.size || 1;

    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) || 0) + commitCount);
    }
  }

  // Convert map to array (oldest first)
  const sortedKeys = Array.from(dailyMap.keys()).sort();
  const dailyActivity = sortedKeys.map((key) => dailyMap.get(key) || 0);

  // Calculate last 7 days total
  const totalCommits = dailyActivity.slice(-7).reduce((a, b) => a + b, 0);

  // Calculate all-time total (30 days)
  const allTimeTotal = dailyActivity.reduce((a, b) => a + b, 0);

  // Calculate streak (consecutive days with commits from today backwards)
  let streak = 0;
  for (let i = dailyActivity.length - 1; i >= 0; i--) {
    if (dailyActivity[i] > 0) {
      streak++;
    } else {
      break;
    }
  }

  return { dailyActivity, totalCommits, streak, allTimeTotal };
}
