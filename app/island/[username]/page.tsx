import { Metadata } from "next";
import IslandPageContent from "./IslandPageContent";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `${params.username}'s Island — Dev Island`,
    description: `Visit ${params.username}'s Dev Island and see their GitHub activity visualized as a living island.`,
    openGraph: {
      title: `${params.username}'s Dev Island`,
      description: `Check out ${params.username}'s island — built from real GitHub activity.`,
    },
  };
}

export default function IslandPage({ params }: PageProps) {
  return <IslandPageContent username={params.username} />;
}
