"use client";

import Link from "next/link";
import type { BookStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { RatingStars } from "./RatingStars";
import { ProgressBar } from "./ProgressBar";
import { escapeAlt, hitungProgress, inisialJudul } from "@/lib/utils";
import { motion } from "framer-motion";

export interface BookCardProps {
  cover?: string;
  judul: string;
  penulis: string;
  status: BookStatus;
  rating?: number;
  progressPercent?: number;
  totalHalaman?: number;
  halamanTerbaca?: number;
  href?: string;
  className?: string;
}

/**
 * Kartu buku dengan soft glassmorphism style.
 * Cover di kiri, info di kanan. Bisa dirender sebagai link (href) atau container biasa.
 */
export function BookCard({
  cover,
  judul,
  penulis,
  status,
  rating,
  progressPercent,
  totalHalaman,
  halamanTerbaca,
  href,
  className = "",
}: BookCardProps) {
  const progress =
    progressPercent ??
    (typeof totalHalaman === "number" && typeof halamanTerbaca === "number"
      ? hitungProgress({ totalHalaman, halamanTerbaca })
      : undefined);

  const inner = (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(87,132,230,0.18), 0 4px 16px rgba(0,0,0,0.07)" }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={`flex gap-4 p-4 ${className}`}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.92)",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 24px rgba(87,132,230,0.10), 0 1px 6px rgba(0,0,0,0.05)",
      }}
    >
      <CoverImage src={cover} judul={judul} />
      <div className="flex min-w-0 flex-1 flex-col gap-2 justify-center">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="line-clamp-2 text-sm font-bold leading-snug"
            style={{ color: "var(--navy)" }}
          >
            {judul}
          </h3>
          <StatusBadge status={status} />
        </div>
        <p className="line-clamp-1 text-xs font-medium" style={{ color: "var(--ink-mid)" }}>
          {penulis}
        </p>
        {typeof rating === "number" && rating > 0 && (
          <RatingStars value={rating} readOnly size="sm" />
        )}
        {typeof progress === "number" && progress > 0 && (
          <ProgressBar value={progress} label={`Progress ${progress}%`} />
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-soft)]"
        style={{ borderRadius: "1.5rem" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

// ─── Cover image ─────────────────────────────────────────────────────────────

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
  "linear-gradient(135deg, #F4D1FF 0%, #FA9EBC 100%)",
  "linear-gradient(135deg, #96CBFC 0%, #4E8BC4 100%)",
  "linear-gradient(135deg, #FFC2D9 0%, #FF99BE 100%)",
];

function CoverImage({ src, judul }: { src?: string; judul: string }) {
  const alt = escapeAlt(`Cover buku ${judul}`);
  const inisial = inisialJudul(judul);
  const idx = inisial.charCodeAt(0) % COVER_GRADIENTS.length;

  if (src) {
    return (
      <div
        className="relative h-28 w-20 flex-shrink-0 overflow-hidden"
        style={{ borderRadius: "1rem" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-28 w-20 flex-shrink-0 items-center justify-center"
      style={{
        background: COVER_GRADIENTS[idx],
        borderRadius: "1rem",
        boxShadow: "0 4px 16px rgba(87,132,230,0.20)",
      }}
      aria-label={alt}
    >
      <span className="text-xl font-extrabold text-white/90 tracking-tight">
        {inisial}
      </span>
    </div>
  );
}