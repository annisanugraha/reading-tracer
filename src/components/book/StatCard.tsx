"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  colorIndex?: number;
  className?: string;
}

const TINTS = [
  "linear-gradient(135deg, rgba(194,225,252,0.65) 0%, rgba(255,255,255,0.85) 100%)",
  "linear-gradient(135deg, rgba(244,209,255,0.65) 0%, rgba(255,255,255,0.85) 100%)",
  "linear-gradient(135deg, rgba(150,203,252,0.55) 0%, rgba(255,255,255,0.85) 100%)",
  "linear-gradient(135deg, rgba(255,194,217,0.60) 0%, rgba(255,255,255,0.85) 100%)",
  "linear-gradient(135deg, rgba(87,132,230,0.12) 0%, rgba(255,255,255,0.92) 100%)",
];

/**
 * Stat card dengan soft glassmorphism style — pastel tint, rounded, soft shadow.
 */
export function StatCard({ label, value, hint, colorIndex = 0, className = "" }: StatCardProps) {
  const tint = TINTS[colorIndex % TINTS.length];
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(87,132,230,0.18), 0 4px 16px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`flex flex-col gap-2 p-5 ${className}`}
      style={{
        background: tint,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 24px rgba(87,132,230,0.10), 0 1px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--navy)", lineHeight: 1 }}
      >
        {value}
      </div>
      <span className="label-mono">{label}</span>
      {hint && (
        <div className="text-xs font-medium" style={{ color: "var(--ink-light)" }}>
          {hint}
        </div>
      )}
    </motion.div>
  );
}