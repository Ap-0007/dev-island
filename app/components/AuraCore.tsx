"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { AuraData } from "@/lib/aura-engine";

interface AuraCoreProps {
  aura: AuraData;
  size?: number;
}

export default function AuraCore({ aura, size = 300 }: AuraCoreProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex items-center justify-center p-20" style={{ width: size, height: size }}>
      {/* SVG Gooey Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="aura-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Atmospheric Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-[100px] opacity-40 mix-blend-screen"
        style={{ backgroundColor: aura.glowColor }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The Morphing Core */}
      <div className="aura-core-container perspective-[1000px] flex items-center justify-center" style={{ filter: "url(#aura-goo)" }}>
        {/* Main Body */}
        <motion.div
          className="aura-morph relative flex items-center justify-center"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            backgroundColor: aura.color,
            boxShadow: `inset -20px -20px 60px rgba(0,0,0,0.5), 0 0 80px ${aura.glowColor}aa`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Inner Pulse */}
          <motion.div
            className="w-1/2 h-1/2 rounded-full bg-white opacity-20 blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Orbiting Satellites (Activity Indicators) */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 40,
              height: 40,
              backgroundColor: aura.glowColor,
              opacity: 0.6,
              filter: "blur(5px)",
            }}
            animate={{
              x: [Math.cos(i) * 100, Math.cos(i + 2) * 100, Math.cos(i) * 100],
              y: [Math.sin(i) * 100, Math.sin(i + 2) * 100, Math.sin(i) * 100],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Aura Label */}
      <motion.div
        className="absolute -bottom-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="aura-text text-3xl font-black uppercase tracking-tighter shimmer-fast">
          {aura.class}
        </span>
        <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/40"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
