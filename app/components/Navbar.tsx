"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "HUB", icon: "🌌" },
    { href: "/leaderboard", label: "RANKS", icon: "🏆" },
  ];

  return (
    <nav className="sticky top-0 z-[100] border-b border-white/10 bg-black/60 backdrop-blur-3xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-black text-xl sturdy-shadow">
            A
          </div>
          <span className="aura-text text-2xl uppercase font-black tracking-tighter">
            AURA
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/5 ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <span className="text-sm">{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}

          {/* User Menu */}
          {session?.user ? (
            <div className="ml-4 flex items-center gap-4 border-l border-white/10 pl-4">
              <Link
                href={`/island/${session.user.username}`}
                className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all"
              >
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  <span className="text-indigo-500">◆</span> Identity: Decoded
                </div>
                <span>🗺️</span>
                <span>My Sector</span>
              </Link>
              
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    width={36}
                    height={36}
                    className="rounded-xl ring-1 ring-white/20 sturdy-shadow"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="rounded-xl bg-rose-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/20 transition-all"
                >
                  OUT
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn-hype ml-4 !px-6 !py-2.5 !text-[10px]">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

