"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/book/BookCard";
import { StatCard } from "@/components/book/StatCard";
import { EmptyState } from "@/components/book/EmptyState";

/* ── Motion presets ─────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
});
const itemSpring: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
};

/* ── Section heading ────────────────────────────────────────── */
function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6">
      <div>
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h2 className="heading-section text-[1.65rem] sm:text-[1.9rem]">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link href={href} className="section-link shrink-0">
          {linkLabel}
          <i className="ri-arrow-right-line" style={{ fontSize: "0.85rem" }} />
        </Link>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { books, siap, statistik } = useBooks();

  const sedangDibaca = useMemo(
    () =>
      books
        .filter((b) => b.status === "sedang-dibaca")
        .sort((a, b) =>
          (b.tanggalMulaiBaca ?? "").localeCompare(a.tanggalMulaiBaca ?? "")
        ),
    [books]
  );

  const baruSelesai = useMemo(
    () =>
      books
        .filter((b) => b.status === "selesai")
        .sort((a, b) =>
          (b.tanggalSelesai ?? "").localeCompare(a.tanggalSelesai ?? "")
        )
        .slice(0, 6),
    [books]
  );

  if (!siap) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-7 w-7 rounded-full"
          style={{
            border: "1.5px solid rgba(87,132,230,0.15)",
            borderTopColor: "var(--blue-soft)",
          }}
        />
        <p className="label-meta opacity-70">
          <i className="ri-loader-4-line mr-2" style={{ fontSize: "0.85rem" }} />
          Menyiapkan ateliermu…
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ════ HERO — viewport-fit, no scroll needed ════════════ */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-8 sm:pt-24">
        <HeroSection
          totalBuku={statistik.total}
          sedang={statistik.sedang}
          selesai={statistik.selesai}
        />
      </div>

      {/* ════ REST OF PAGE — scrollable (original layout) ═════ */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-24 sm:px-8">
        {/* ════ STATISTIK ═══════════════════════════════════════ */}
        <section aria-label="Statistik">
          <SectionHeading
            eyebrow="Atelier Notes"
            title={
              <>
                Angka-angka <em>dari rakmu</em>
              </>
            }
          />
          <motion.div
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            <motion.div variants={itemSpring}>
              <StatCard
                label="Total Buku"
                value={statistik.total}
                hint={`${statistik.selesai} selesai`}
                icon="ri-book-shelf-line"
                accent="pale"
              />
            </motion.div>
            <motion.div variants={itemSpring}>
              <StatCard
                label="Sedang Dibaca"
                value={statistik.sedang}
                hint="Aktif sekarang"
                icon="ri-book-open-line"
                accent="blue"
              />
            </motion.div>
            <motion.div variants={itemSpring}>
              <StatCard
                label="Selesai"
                value={statistik.selesai}
                hint={`${statistik.berhenti} berhenti`}
                icon="ri-checkbox-circle-line"
                accent="pink"
              />
            </motion.div>
            <motion.div variants={itemSpring}>
              <StatCard
                label="Halaman Dibaca"
                value={statistik.totalHalamanDibaca}
                hint="sepanjang waktu"
                icon="ri-file-text-line"
                accent="mauve"
              />
            </motion.div>
            <motion.div
              variants={itemSpring}
              className="col-span-2 sm:col-span-1"
            >
              <StatCard
                label="Rata-rata Rating"
                value={
                  statistik.rataRating > 0 ? `★ ${statistik.rataRating}` : "—"
                }
                hint={
                  statistik.rataRating > 0
                    ? "dari reviewmu"
                    : "belum ada review"
                }
                icon="ri-star-half-line"
                accent="mute"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ════ SEDANG DIBACA ═════════════════════════════════ */}
        <section aria-label="Sedang dibaca">
          <SectionHeading
            eyebrow="In Progress"
            title={
              <>
                Sedang <em>kupeluk</em>
              </>
            }
            href="/koleksi?status=sedang-dibaca"
            linkLabel="Lihat semua"
          />
          {sedangDibaca.length === 0 ? (
            <EmptyState
              variant="books"
              title="Belum ada buku yang sedang dibaca"
              description="Tandai buku sebagai Sedang Dibaca untuk mulai mencatat progress harianmu."
              action={
                <Link href="/koleksi" className="btn btn-ink">
                  <i className="ri-book-open-line" />
                  Buka Koleksi
                </Link>
              }
            />
          ) : (
            <motion.div
              variants={stagger()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {sedangDibaca.map((b) => (
                <motion.div key={b.id} variants={itemSpring}>
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

        {/* ════ BARU SELESAI ══════════════════════════════════ */}
        <section aria-label="Baru selesai">
          <SectionHeading
            eyebrow="Recently Closed"
            title={
              <>
                Baru saja <em>kusinggah</em>
              </>
            }
            href="/review"
            linkLabel="Lihat review"
          />
          {baruSelesai.length === 0 ? (
            <EmptyState
              variant="review"
              title="Belum ada buku yang selesai dibaca"
              description="Setelah menandai sebuah buku Selesai dan menulis review, buku akan muncul di sini."
            />
          ) : (
            <motion.div
              variants={stagger(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {baruSelesai.map((b) => (
                <motion.div key={b.id} variants={itemSpring}>
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
    </>
  );
}

/* ── Hero — viewport-fit, contained in one screen ───────────── */
function HeroSection({
  totalBuku,
  sedang,
  selesai,
}: {
  totalBuku: number;
  sedang: number;
  selesai: number;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mx.set(x * 26);
      my.set(y * 26);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      ref={heroRef}
      className="relative mb-16 flex w-full flex-col overflow-hidden sm:mb-20"
      style={{
        height: "calc(100vh - 7rem)",
        minHeight: "500px",
        maxHeight: "780px",
      }}
    >
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]"
        style={{
          background:
            "linear-gradient(150deg, rgba(194,225,252,0.4) 0%, rgba(255,255,255,0.85) 45%, rgba(244,209,255,0.4) 100%)",
        }}
      >
        <motion.div
          aria-hidden
          style={{ x: smx, y: smy }}
          className="blob-a absolute -right-32 -top-24 h-[22rem] w-[22rem] rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(194,225,252,0.55) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
        </motion.div>
        <motion.div
          aria-hidden
          className="blob-b absolute -bottom-24 -left-20 h-[20rem] w-[20rem]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,194,217,0.45) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
      </div>

      {/* Hero content — vertically centered within viewport */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 pb-5 pt-8 text-center sm:pb-7 sm:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5"
          style={{
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: "9999px",
            boxShadow: "0 2px 8px rgba(11,25,87,0.05)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--pink-hot)",
              animation: "pulse-soft 2.4s ease-in-out infinite",
            }}
            aria-hidden
          />
          <span
            className="label-meta"
            style={{ fontSize: "0.6rem", color: "var(--navy)" }}
          >
            Reading Atelier · {new Date().getFullYear()}
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={stagger(0.25)}
          className="heading-hero text-balance"
          style={{
            fontSize: "clamp(2rem, 4.8vw, 3.6rem)",
          }}
        >
          <motion.span variants={fadeUp} className="block">
            Sebuah atelier
          </motion.span>
          <motion.span variants={fadeUp} className="block">
            kecil untuk{" "}
            <em
              className="font-display italic"
              style={{ color: "var(--pink-soft)" }}
            >
              buku-buku
            </em>
          </motion.span>
          <motion.span variants={fadeUp} className="block">
            yang pernah kamu{" "}
            <em
              className="font-display italic"
              style={{ color: "var(--blue-soft)" }}
            >
              sentuh
            </em>
            .
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
          className="body-lead mt-4 max-w-md text-balance"
          style={{ fontSize: "clamp(0.92rem, 1.05vw, 1rem)" }}
        >
          Catat koleksi, lacak progress, dan tulis review pribadimu — semua
          tersimpan rapi di atelier kecilmu sendiri.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
        >
          <Link href="/koleksi" className="btn btn-ink">
            <i className="ri-book-open-line" style={{ fontSize: "1rem" }} />
            Buka Koleksi
          </Link>
          <Link href="/review" className="btn btn-paper">
            <i className="ri-quill-pen-line" style={{ fontSize: "1rem" }} />
            Lihat Review
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          <SnapshotItem
            label="buku"
            value={totalBuku}
            icon="ri-book-mark-line"
          />
          <Divider />
          <SnapshotItem
            label="dibaca"
            value={sedang}
            icon="ri-book-open-line"
          />
          <Divider />
          <SnapshotItem
            label="selesai"
            value={selesai}
            icon="ri-checkbox-circle-line"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <span
      aria-hidden
      className="hidden h-5 w-px sm:block"
      style={{ background: "var(--hairline-strong)" }}
    />
  );
}

function SnapshotItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className="flex items-center gap-2.5"
    >
      <span
        className="flex h-8 w-8 items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid var(--hairline)",
          borderRadius: "10px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <i className={icon} style={{ fontSize: "0.88rem", color: "var(--navy)" }} />
      </span>
      <div className="flex flex-col leading-none">
        <span
          className="num-ticker font-display text-[1.05rem] font-normal"
          style={{ color: "var(--navy)" }}
        >
          {value.toLocaleString("id-ID")}
        </span>
        <span
          className="label-meta mt-0.5"
          style={{ fontSize: "0.55rem", color: "var(--ink-light)" }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
