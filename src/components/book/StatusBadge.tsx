"use client";

import type { BookStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

export interface StatusBadgeProps {
  status: BookStatus;
  tampilkanLabel?: boolean;
  className?: string;
}

const STATUS_STYLES: Record<BookStatus, { icon: string; variant: string }> = {
  "mau-dibaca":    { icon: "ri-bookmark-line",         variant: "pill-pale" },
  "sedang-dibaca": { icon: "ri-book-open-line",        variant: "pill-blue" },
  "selesai":       { icon: "ri-checkbox-circle-line",  variant: "pill-pink" },
  "berhenti":      { icon: "ri-pause-circle-line",     variant: "pill-mute" },
};

/**
 * Status badge — hairline pill dengan remix icon & breathing dot.
 */
export function StatusBadge({
  status,
  tampilkanLabel = true,
  className = "",
}: StatusBadgeProps) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["mau-dibaca"];
  return (
    <span className={`pill ${s.variant} ${className}`}>
      <i className={s.icon} style={{ fontSize: "0.75rem" }} />
      {tampilkanLabel && <span>{STATUS_LABELS[status]}</span>}
    </span>
  );
}
