"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAura } from "@/lib/aura-context";
import { useEffect, useMemo, useState, useRef } from "react";
import { calculateAura } from "@/lib/aura-engine";

// --- Components & Hooks ---

const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

const FloatingOrb = ({ color, delay, size }: { color: string; delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full blur-[60px] opacity-20 pointer-events-none"
    style={{ 
      backgroundColor: color, 
      width: size, 
      height: size,
      zIndex: -1 
    }}
    animate={{
      x: [0, 100, -50, 0],
      y: [0, -80, 50, 0],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
      delay: delay
    }}
  />
);

export default function LoginPage() {
  const { setAura } = useAura();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Scaling/Transform for Logo based on mouse
  const logoRotate = useTransform(springX, [0, 1000], [-10, 10]);
  const logoScale = useTransform(springY, [0, 800], [0.95, 1.05]);

  // Set a subtle neutral aura for the login page
  const loginAura = useMemo(() => calculateAura([1, 1, 1, 1, 1, 1, 1]), []);

  useEffect(() => {
    setAura(loginAura);
  }, [setAura, loginAura]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleSignIn = (provider: string) => {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 overflow-hidden"
    >
      {/* 1. Mouse Spotlight Reveal */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(600px_circle_at_var(--x)_var(--y),rgba(99,102,241,0.08),transparent_80%)]"
        style={{
          // @ts-expect-error - Dynamic CSS variables for the spotlight
          "--x": springX,
          "--y": springY,
        }}
      />

      {/* 2. Floating Aura Primitives */}
      <FloatingOrb color="#6366f1" delay={0} size={300} />
      <FloatingOrb color="#ec4899" delay={-5} size={250} />
      <FloatingOrb color="#8b5cf6" delay={-10} size={200} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bento-glass relative overflow-hidden p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl bg-black/60 border border-white/5 group">
          <div className="bg-grain opacity-5" />

          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.div
              style={{ rotate: logoRotate, scale: logoScale }}
              className="mb-8"
            >
              <Link
                href="/"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black font-black text-3xl sturdy-shadow transition-transform active:scale-95 border-b-4 border-indigo-500/20"
              >
                A
              </Link>
            </motion.div>
            
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              <ScrambleText text="SYNCHRONIZE" /> <br/>
              <span className="aura-text">AURA</span>
            </h1>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              Identity Protocol // Authorized Only
            </p>
          </div>

          {/* Form Overlay - Mock Inputs */}
          <div className="mb-8 flex flex-col gap-5">
            <div className="relative group/input">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 pl-1 mb-1 block group-focus-within/input:text-indigo-400 transition-colors">
                Vector ID
              </label>
              <input
                type="text"
                disabled
                placeholder="UNAVAILABLE"
                className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-white/20 placeholder-white/5 outline-none font-mono text-xs cursor-not-allowed"
              />
            </div>

            <div className="relative group/input">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 pl-1 mb-1 block">
                Access Key
              </label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-white/20 placeholder-white/5 outline-none font-mono text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSignIn("github")}
              disabled={loadingProvider === "github"}
              className="btn-hype !py-4 w-full flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em]"
            >
              {loadingProvider === "github" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              ) : (
                <span className="text-xl">🐙</span>
              )}
              CONTINUE WITH GITHUB
            </motion.button>
            
            <p className="text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">
              By entering, you accept all digital terms
            </p>
          </div>

          {/* Interactive corner scan decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 border-r border-t border-white/10 rounded-tr-3xl pointer-events-none group-hover:border-indigo-500/40 transition-colors" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-l border-b border-white/10 rounded-bl-3xl pointer-events-none group-hover:border-indigo-500/40 transition-colors" />
        </div>
      </motion.div>

      {/* Background Mesh Overlay Integration */}
      <div className="absolute inset-0 z-[-1] bg-mesh opacity-20 pointer-events-none" />
    </div>
  );
}
