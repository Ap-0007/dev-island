import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import { AuraProvider } from "@/lib/aura-context";
import AuraBackgroundWrapper from "./components/AuraBackgroundWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ISLAND — Dev Aura Hub",
  description: "Decode your GitHub activity into a digital manifestation.",
  keywords: ["github", "developer", "aura", "visualization", "coding", "activity"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-black`}>
        <AuthProviderWrapper>
          <AuraProvider>
            <AuraBackgroundWrapper />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </AuraProvider>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}

// Since useSession needs a provider, and Providers might be complex, 
// I'll ensure we have a client-side auth wrapper.
function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
