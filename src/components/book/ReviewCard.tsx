"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { RatingStars } from "./RatingStars";
import { escapeAlt, formatTanggal, inisialJudul } from "@/lib/utils";

export interface ReviewCardProps {
  cover?: string;
  judul: string;
  rating: number;
  teksReview: string;
  tanggal: string;
  penulis?: string;
  href?: string;
  cuplikanMaks?: number;
  className?: string;
}

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
  "linear-gradient(135deg, #F4D1FF 0%, #FA9EBC 100%)",
  "linear-gradient(135deg, #96CBFC 0%, #4E8BC4 100%)",
  "linear-gradient(135deg, #FFC2D9 0%, #FF99BE 100%)",
];

/**
 * ReviewCard — editorial review dengan quote-mark flourish dan neumorphism.
 * Opening curly quote animates in first.
 */
export function ReviewCard({
  cover,
  judul,
  rating,
  teksReview,
  tanggal,
  penulis,
  href,
  cuplikanMaks = 200,
  className = "",
}: ReviewCardProps) {
  const cuplikan =
    teksReview.length > cuplikanMaks
      ? teksReview.slice(0, cuplikanMaks).trimEnd() + "…"
      : teksReview;
  const inisial = inisialJudul(judul);
  const bgIdx = inisial.charCodeAt(0) % COVER_GRADIENTS.length;

  const cardRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const inner = (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`group relative flex gap-5 p-5 ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "1.75rem",
        boxShadow: "var(--shadow-float)",
        transition: "box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        whileInView={{ opacity: 0.18, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
        className="font-display pointer-events-none absolute -top-2 left-4 select-none"
        style={{
          fontSize: "5rem",
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--blue-soft)",
          lineHeight: 1,
        }}
      >
        “
      </motion.span>

      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-8 right-8 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
        }}
      />

      <div className="flex-shrink-0">
        {cover ? (
          <div
            className="overflow-hidden"
            style={{
              height: "7rem",
              width: "5rem",
              borderRadius: "0.75rem",
              boxShadow:
                "0 4px 14px rgba(11,25,87,0.10), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={escapeAlt(`Cover ${judul}`)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              height: "7rem",
              width: "5rem",
              borderRadius: "0.75rem",
              background: COVER_GRADIENTS[bgIdx],
              boxShadow:
                "0 4px 14px rgba(11,25,87,0.12), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <span
              className="font-display text-xl font-normal italic"
              style={{
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.03em",
              }}
            >
              {inisial}
            </span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="font-display line-clamp-1 text-[1.05rem] font-normal tracking-tight"
              style={{ color: "var(--navy)" }}
            >
              {judul}
            </h3>
            {penulis && (
              <p
                className="mt-0.5 line-clamp-1 text-[0.72rem] font-light italic"
                style={{ color: "var(--ink-mid)" }}
              >
                — {penulis}
              </p>
            )}
          </div>
          <time
            className="label-meta shrink-0"
            style={{ fontSize: "0.58rem", color: "var(--ink-mid)" }}
          >
            {formatTanggal(tanggal)}
          </time>
        </div>

        <RatingStars value={rating} readOnly size="sm" />

        {cuplikan && (
          <p
            className="font-display text-[0.9rem] italic leading-relaxed text-pretty"
            style={{ color: "var(--ink)" }}
          >
            {cuplikan}
          </p>
        )}

        <div className="mt-1 flex items-center gap-2">
          <span className="label-meta" style={{ fontSize: "0.58rem" }}>
            <i className="ri-chat-quote-line mr-1" />
            Review
          </span>
        </div>
      </div>
    </motion.article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none"
        style={{ borderRadius: "1.75rem" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
