"use client";

import { useMemo, type ReactNode } from "react";
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

/* Floating letter fragments */
const FLOATING_CHARS = ["A", "B", "C", "✦", "~", "❋", "…"];

/**
 * EmptyState v2 — animated SVG book illustration, floating letter fragments,
 * gradient text, marching dashed border.
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

  // Generate random floaters
  const floaters = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        char: FLOATING_CHARS[i % FLOATING_CHARS.length],
        left: 20 + Math.random() * 60,
        delay: i * 0.6,
        duration: 3 + Math.random() * 2,
        size: 0.55 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "1.25rem",
        border: "none",
        position: "relative",
      }}
    >
      {/* Marching dashed border */}
      <DashedBorder />

      {/* Floating letter fragments */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {floaters.map((f) => (
          <motion.span
            key={f.id}
            className="absolute font-display italic"
            style={{
              left: `${f.left}%`,
              bottom: "35%",
              fontSize: `${f.size}rem`,
              color: "var(--blue-soft)",
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.25, 0],
              y: [0, -60 - Math.random() * 40],
              x: [0, (Math.random() - 0.5) * 30],
              rotate: [0, (Math.random() - 0.5) * 20],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {f.char}
          </motion.span>
        ))}
      </div>

      {/* Animated icon halo */}
      <div className="relative mb-6">
        <motion.div
          aria-hidden
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(194,225,252,0.6) 0%, transparent 65%)",
            filter: "blur(10px)",
            transform: "scale(1.5)",
          }}
        />

        {/* SVG Book illustration */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-20 w-20 items-center justify-center"
        >
          <BookIllustration variant={variant} />
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
      {action && <div className="mt-6 relative z-10">{action}</div>}
    </motion.div>
  );
}

/* ── Animated SVG book illustration ─────────────────────────── */

function BookIllustration({ variant }: { variant: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book spine */}
      <motion.rect
        x="14"
        y="12"
        width="4"
        height="40"
        rx="1"
        fill="var(--blue-soft)"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ transformOrigin: "14px 52px" }}
      />

      {/* Left page */}
      <motion.path
        d="M18 12 L32 14 L32 54 L18 52 Z"
        fill="var(--paper-soft)"
        stroke="var(--blue-light)"
        strokeWidth="0.8"
        initial={{ opacity: 0, rotateY: -30 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />

      {/* Right page — subtle oscillation */}
      <motion.path
        d="M32 14 L48 12 L48 52 L32 54 Z"
        fill="var(--surface)"
        stroke="var(--blue-light)"
        strokeWidth="0.8"
        animate={{ rotateY: [0, 2, 0, -1, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "32px 34px" }}
      />

      {/* Text lines on right page */}
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="35"
          y1={22 + i * 6}
          x2={42 - i * 1.5}
          y2={22 + i * 6}
          stroke="var(--ink-light)"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{
            duration: 0.6,
            delay: 0.6 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* Decorative variant icon above book */}
      {variant === "books" && (
        <motion.circle
          cx="32"
          cy="8"
          r="2"
          fill="var(--pink-soft)"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {variant === "search" && (
        <motion.circle
          cx="42"
          cy="8"
          r="4"
          stroke="var(--blue-soft)"
          strokeWidth="1.2"
          fill="none"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {variant === "review" && (
        <motion.path
          d="M30 6 Q32 2 34 6"
          stroke="var(--pink-soft)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </svg>
  );
}

/* ── Marching dashed border ──────────────────────────────────── */

function DashedBorder() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden
      style={{ borderRadius: "inherit" }}
    >
      <motion.rect
        x="0.75"
        y="0.75"
        width="calc(100% - 1.5px)"
        height="calc(100% - 1.5px)"
        rx="18"
        ry="18"
        fill="none"
        stroke="rgba(87,132,230,0.2)"
        strokeWidth="1.5"
        strokeDasharray="8 6"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -28 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}
