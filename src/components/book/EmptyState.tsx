"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * Empty state dengan soft glass style dan floating icon animation.
 */
export function EmptyState({ title, description, action, icon = "📚", className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1.5px dashed rgba(87,132,230,0.25)",
        borderRadius: "2rem",
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-4 text-5xl"
        aria-hidden
      >
        {icon}
      </motion.div>
      <h3 className="text-base font-bold" style={{ color: "var(--navy)" }}>{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--ink-mid)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}