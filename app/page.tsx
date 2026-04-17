import { auth } from "@/auth";
import HomeContent from "./HomeContent";

export default async function HomePage() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // Auth not configured — show landing page
    session = null;
  }

  const isLoggedIn = !!(session?.user?.username);

  return (
    <HomeContent
      isLoggedIn={isLoggedIn}
      username={session?.user?.username || null}
      avatar={session?.user?.image || null}
    />
  );
}
