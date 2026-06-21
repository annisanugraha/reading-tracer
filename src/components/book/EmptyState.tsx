"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  variant?: "books" | "search" | "review" | "default";
  className?: string;
}

const VARIANT_ICON: Record<string, string> = {
  books: "ri-book-3-line",
  search: "ri-search-eye-line",
  review: "ri-quill-pen-line",
  default: "ri-book-mark-line",
};

/**
 * EmptyState — neumorphic dashed container dengan animated SVG illustration
 * (floating book icon + slow drift).
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  variant = "default",
  className = "",
}: EmptyStateProps) {
  const iconClass = VARIANT_ICON[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1.5px dashed rgba(87,132,230,0.25)",
        borderRadius: "2rem",
      }}
    >
      {/* Animated icon halo */}
      <div className="relative mb-6">
        <motion.div
          aria-hidden
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(194,225,252,0.6) 0%, transparent 65%)",
            filter: "blur(8px)",
          }}
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 w-16 items-center justify-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: "9999px",
            boxShadow:
              "0 8px 24px rgba(87,132,230,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {icon ?? (
            <i
              className={iconClass}
              style={{ fontSize: "1.5rem", color: "var(--navy)" }}
            />
          )}
        </motion.div>
      </div>

      <h3
        className="font-display text-[1.2rem] font-normal tracking-tight"
        style={{ color: "var(--navy)" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="mt-2 max-w-sm font-display text-[0.88rem] italic leading-relaxed"
          style={{ color: "var(--ink-mid)" }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
