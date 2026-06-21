"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/book/BookCard";
import { StatCard } from "@/components/book/StatCard";
import { EmptyState } from "@/components/book/EmptyState";
import { formatAngka } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";

// ─── Stagger animation (used by lower sections) ───────────────────────────────
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="heading-section text-lg">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="section-link">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { books, siap, statistik } = useBooks();

  const sedangDibaca = useMemo(
    () =>
      books
        .filter((b) => b.status === "sedang-dibaca")
        .sort((a, b) => (b.tanggalMulaiBaca ?? "").localeCompare(a.tanggalMulaiBaca ?? "")),
    [books]
  );

  const baruSelesai = useMemo(
    () =>
      books
        .filter((b) => b.status === "selesai")
        .sort((a, b) => (b.tanggalSelesai ?? "").localeCompare(a.tanggalSelesai ?? ""))
        .slice(0, 5),
    [books]
  );

  if (!siap) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8"
          style={{
            border: "2.5px solid rgba(87,132,230,0.2)",
            borderTopColor: "var(--blue-soft)",
            borderRadius: "9999px",
          }}
        />
        <p className="label-mono opacity-60">Memuat koleksi…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">

      {/* ── HERO — full-screen, airy canvas ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative flex min-h-[calc(100vh-8rem)] w-full flex-col justify-center overflow-x-clip mt-24 mb-12 rounded-[2.5rem] py-20"
        style={{
          background: "linear-gradient(150deg, var(--blue-pale) 0%, #f8f6fb 50%, var(--pink-pale) 100%)",
        }}
      >
        {/* Paper grain */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045] mix-blend-multiply" aria-hidden="true">
          <filter id="heroGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>

        {/* Ghost word */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-[18%] select-none text-center font-extrabold leading-none sm:block"
          style={{
            fontSize: "clamp(7rem, 26vw, 24rem)",
            color: "rgba(87,132,230,0.05)",
            letterSpacing: "-0.04em",
          }}
          aria-hidden
        >
          Buku
        </div>

        {/* Decorative blobs */}
        <div
          className="blob-float-a pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] opacity-40"
          style={{ background: "radial-gradient(circle, var(--blue-pale) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)" }}
          aria-hidden
        />
        <div
          className="blob-float-b pointer-events-none absolute -bottom-32 -left-16 h-[24rem] w-[24rem] opacity-35"
          style={{ background: "radial-gradient(circle, var(--pink-mid) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(70px)" }}
          aria-hidden
        />
        <div
          className="blob-float-c pointer-events-none absolute right-1/4 top-1/3 h-56 w-56 opacity-25"
          style={{ background: "radial-gradient(circle, var(--pink-pale) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(50px)" }}
          aria-hidden
        />

        {/* Floating stat pill */}
        {statistik.sedang > 0 && (
          <motion.div
            className="absolute right-6 top-12 z-10 hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium sm:right-14 sm:top-16 md:flex"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              border: "1px solid rgba(255,255,255,0.8)",
              color: "var(--navy)",
              boxShadow: "0 10px 30px rgba(87,132,230,0.12)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.9 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: "var(--pink-hot)" }} />
            Sedang baca {statistik.sedang} buku
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }}
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center px-6 sm:px-14"
        >
          <span
            className="mb-5 inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "linear-gradient(90deg, rgba(194,225,252,0.8), rgba(244,209,255,0.8))",
              borderRadius: "9999px",
              color: "var(--navy)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            Reading Lab
          </span>

          <h1 className="heading-display text-4xl sm:text-6xl lg:text-7xl">
            Perpustakaan
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--blue-soft), var(--pink-hot))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pribadi.
            </span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg mx-auto"
            style={{ color: "var(--ink-mid)" }}
          >
            Catat koleksi buku, lacak progress baca, dan tulis review pribadimu.
            Semua data tersimpan aman di browser kamu.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/koleksi" className="btn-primary">
              Buka Koleksi
            </Link>
            <Link href="/review" className="btn-ghost">
              Lihat Review
            </Link>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ color: "var(--ink-mid)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <span className="label-mono text-xs uppercase tracking-widest opacity-60">Gulir ke bawah</span>
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 9l6 6 6-6" stroke="var(--blue-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      </motion.section>

      {/* ── STATISTIK ── */}
      <section aria-label="Statistik">
        <SectionHeading title="Statistik" />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {[
            { label: "Total Buku",       value: formatAngka(statistik.total),              hint: `${statistik.selesai} selesai` },
            { label: "Sedang Dibaca",    value: formatAngka(statistik.sedang),             hint: "Aktif sekarang" },
            { label: "Selesai",          value: formatAngka(statistik.selesai),            hint: `${statistik.berhenti} berhenti` },
            { label: "Halaman Dibaca",   value: formatAngka(statistik.totalHalamanDibaca), hint: undefined },
            {
              label: "Rata-rata Rating",
              value: statistik.rataRating > 0 ? `★ ${statistik.rataRating}` : "—",
              hint: statistik.rataRating > 0 ? "Dari buku yang direview" : "Belum ada review",
            },
          ].map((s, i) => (
            <motion.div key={s.label} variants={item} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
              <StatCard {...s} colorIndex={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── SEDANG DIBACA ── */}
      <section aria-label="Sedang dibaca">
        <SectionHeading title="Sedang Dibaca" href="/koleksi?status=sedang-dibaca" linkLabel="Lihat semua" />
        {sedangDibaca.length === 0 ? (
          <EmptyState
            title="Belum ada buku yang sedang dibaca"
            description="Tandai buku sebagai Sedang Dibaca untuk mulai mencatat progress."
            action={
              <Link href="/koleksi" className="btn-primary">
                Buka Koleksi
              </Link>
            }
          />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {sedangDibaca.map((b) => (
              <motion.div key={b.id} variants={item}>
                <BookCard
                  cover={b.coverUrl}
                  judul={b.judul}
                  penulis={b.penulis}
                  status={b.status}
                  totalHalaman={b.totalHalaman}
                  halamanTerbaca={b.halamanTerbaca}
                  href={`/koleksi/${b.id}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── BARU SELESAI ── */}
      <section aria-label="Baru selesai">
        <SectionHeading title="Baru Selesai" href="/review" linkLabel="Lihat semua review" />
        {baruSelesai.length === 0 ? (
          <EmptyState
            title="Belum ada buku yang selesai dibaca"
            description="Setelah menandai buku Selesai dan menulis review, buku akan muncul di sini."
          />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {baruSelesai.map((b) => (
              <motion.div key={b.id} variants={item}>
                <BookCard
                  cover={b.coverUrl}
                  judul={b.judul}
                  penulis={b.penulis}
                  status={b.status}
                  rating={b.review?.rating}
                  href={`/koleksi/${b.id}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

    </div>
  );
}