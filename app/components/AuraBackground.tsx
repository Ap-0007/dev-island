"use client";

import { motion } from "framer-motion";
import type { AuraData } from "@/lib/aura-engine";

interface AuraBackgroundProps {
  aura: AuraData | null;
}

export default function AuraBackground({ aura }: AuraBackgroundProps) {
  // Use a default theme color if aura is not yet loaded
  const baseColor = aura?.color || "#3b82f6";
  const glowColor = aura?.glowColor || "#6366f1";

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* 1. Sturdy Mesh Overlay */}
      <div className="bg-mesh-dark opacity-40 mix-blend-overlay" />
      <div className="bg-mesh opacity-20" />
      
      {/* 2. Dynamic Aura Blobs */}
      <div className="absolute inset-0">
        {/* Primary Blob */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] h-[70vw] w-[70vw] rounded-full opacity-[0.15] blur-[120px] animate-aura-drift"
          style={{ backgroundColor: baseColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
        />
        
        {/* Secondary Blob */}
        <motion.div
          className="absolute -bottom-[20%] -right-[10%] h-[60vw] w-[60vw] rounded-full opacity-[0.12] blur-[150px] animate-aura-drift"
          style={{ 
            backgroundColor: glowColor,
            animationDelay: "-5s"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        
        {/* Tertiary Accent (Dynamic based on logic) */}
        <motion.div
          className="absolute top-[30%] right-[10%] h-[40vw] w-[40vw] rounded-full opacity-[0.08] blur-[100px] animate-aura-drift"
          style={{ 
            backgroundColor: aura?.vibe === "hyped" ? "#f43f5e" : baseColor,
            animationDelay: "-10s"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 2, delay: 1 }}
        />
      </div>

      {/* 3. Subtle Grain Overlay for Texture */}
      <div className="bg-grain opacity-[0.15] mix-blend-soft-light" />
      
      {/* 4. Vignette for Focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
}
