"use client";

import { motion } from "framer-motion";

interface VisitorCounterProps {
  count: number;
}

export default function VisitorCounter({ count }: VisitorCounterProps) {
  return (
    <motion.div
      className="stat-badge"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <span>👁️</span>
      <span>{count} visitor{count !== 1 ? "s" : ""}</span>
    </motion.div>
  );
}
