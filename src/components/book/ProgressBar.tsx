"use client";

import { motion } from "framer-motion";

export interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

/**
 * Hairline progress bar — 3px, dengan shimmer overlay & fluid width animation.
 */
export function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`w-full ${className}`}>
      {label !== undefined && (
        <div className="mb-1.5 flex items-center justify-between">
          <span
            className="label-meta"
            style={{ fontSize: "0.6rem", color: "var(--ink-light)" }}
          >
            {label.split(/\s+/)[0] || ""}
          </span>
          <motion.span
            key={v}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="num-ticker font-display text-[0.8rem] font-normal italic"
            style={{ color: "var(--navy)" }}
          >
            {v}%
          </motion.span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className="progress-track"
      >
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}
