"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import { EmptyState, ReviewCard } from "@/components/book";

type SortMode = "rating" | "terbaru";

export default function ReviewPage() {
  const { books, siap } = useBooks();
  const [sort, setSort] = useState<SortMode>("rating");

  const reviewed = useMemo(
    () => books.filter((b) => b.review && b.review.rating > 0),
    [books]
  );

  const sorted = useMemo(() => {
    const arr = [...reviewed];
    if (sort === "rating") {
      arr.sort((a, b) => {
        const rDiff = (b.review?.rating ?? 0) - (a.review?.rating ?? 0);
        if (rDiff !== 0) return rDiff;
        return (b.review?.updatedAt ?? "").localeCompare(a.review?.updatedAt ?? "");
      });
    } else {
      arr.sort((a, b) =>
        (b.review?.updatedAt ?? "").localeCompare(a.review?.updatedAt ?? "")
      );
    }
    return arr;
  }, [reviewed, sort]);

  const rataRating =
    reviewed.length === 0
      ? 0
      : reviewed.reduce((acc, b) => acc + (b.review?.rating ?? 0), 0) /
        reviewed.length;

  if (!siap) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-7 w-7 rounded-full"
            style={{
              border: "1.5px solid rgba(87,132,230,0.15)",
              borderTopColor: "var(--blue-soft)",
            }}
          />
          <p className="label-meta opacity-70">Memuat review…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-32 sm:px-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="eyebrow mb-3">Personal Reviews</div>
          <h1
            className="heading-display text-balance"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Riwayat <em>review</em>
          </h1>
          <p
            className="body-lead mt-3 max-w-xl text-balance"
            style={{ fontSize: "1rem" }}
          >
            {reviewed.length === 0
              ? "Belum ada review yang tercatat"
              : `${reviewed.length} buku sudah direview${
                  rataRating > 0
                    ? ` · rata-rata ★ ${rataRating.toFixed(1)}`
                    : ""
                }`}
          </p>
        </div>

        {reviewed.length > 0 && (
          <div
            className="relative flex items-center self-start"
            style={{
              background: "var(--paper-soft)",
              border: "1px solid var(--hairline)",
              borderRadius: "9999px",
              padding: "3px",
              boxShadow:
                "inset 2px 2px 5px rgba(11,25,87,0.04), inset -1px -1px 3px rgba(255,255,255,0.7)",
            }}
          >
            <LayoutGroup id="review-sort">
              {(
                [
                  { key: "rating", label: "Rating Tertinggi" },
                  { key: "terbaru", label: "Terbaru" },
                ] as { key: SortMode; label: string }[]
              ).map((opt) => {
                const active = sort === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSort(opt.key)}
                    className="relative px-4 py-1.5"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? "var(--navy)" : "var(--ink-mid)",
                      zIndex: 1,
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="review-sort-active"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "var(--surface)",
                          boxShadow:
                            "0 2px 6px rgba(11,25,87,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        )}
      </motion.header>

      {/* ── Grid ───────────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <EmptyState
          variant="review"
          title="Belum ada review"
          description="Tandai sebuah buku sebagai Selesai dan tulis kesan pertamamu — halaman ini akan mulai terisi dengan suara-suara kecilmu."
          action={
            <Link href="/koleksi" className="btn btn-ink">
              <i className="ri-book-open-line" />
              Buka Koleksi
            </Link>
          }
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {sorted.map((b) => (
              <motion.div
                key={b.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 22,
                    },
                  },
                }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ReviewCard
                  cover={b.coverUrl}
                  judul={b.judul}
                  penulis={b.penulis}
                  rating={b.review?.rating ?? 0}
                  teksReview={b.review?.text ?? ""}
                  tanggal={
                    b.review?.updatedAt ??
                    b.tanggalSelesai ??
                    b.tanggalDitambahkan
                  }
                  href={`/koleksi/${b.id}`}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="flex justify-center pt-2">
        <Link href="/" className="section-link">
          <i className="ri-arrow-left-line" style={{ fontSize: "0.85rem" }} />
          Kembali ke Atelier
        </Link>
      </div>
    </div>
  );
}
