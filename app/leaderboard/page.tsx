import { Metadata } from "next";
import LeaderboardContent from "./LeaderboardContent";

export const metadata: Metadata = {
  title: "Leaderboard — Dev Island",
  description: "See who's building the most active islands. Ranked by commits and streaks.",
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
