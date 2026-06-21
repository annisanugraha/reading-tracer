"use client";

import type { BookStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

export interface StatusBadgeProps {
  status: BookStatus;
  tampilkanLabel?: boolean;
  className?: string;
}

const STATUS_STYLES: Record<BookStatus, { bg: string; dot: string; color: string }> = {
  "mau-dibaca":    { bg: "rgba(194,225,252,0.7)",  dot: "#5784E6", color: "#28343B" },
  "sedang-dibaca": { bg: "rgba(150,203,252,0.65)", dot: "#4E8BC4", color: "#1a2a4a" },
  "selesai":       { bg: "rgba(255,194,217,0.65)", dot: "#FF99BE", color: "#28343B" },
  "berhenti":      { bg: "rgba(220,220,225,0.6)",  dot: "#9CA3AF", color: "#6B7280" },
};

/**
 * Badge status dengan soft pill style — rounded, pastel bg, color dot.
 */
export function StatusBadge({ status, tampilkanLabel = true, className = "" }: StatusBadgeProps) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["mau-dibaca"];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${className}`}
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: "9999px",
        border: "1px solid rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        className="h-1.5 w-1.5 flex-shrink-0"
        style={{ background: s.dot, borderRadius: "9999px" }}
      />
      {tampilkanLabel && <span>{STATUS_LABELS[status]}</span>}
    </span>
  );
}