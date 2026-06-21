"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import {
  BookForm,
  ConfirmDialog,
  EmptyState,
  GenreBadge,
  ProgressBar,
  RatingStars,
  StatusBadge,
} from "@/components/book";
import {
  BOOK_STATUSES,
  STATUS_LABELS,
  type BookInput,
  type BookStatus,
} from "@/lib/types";
import {
  escapeAlt,
  formatAngka,
  formatTanggal,
  hitungProgress,
  inisialJudul,
} from "@/lib/utils";

export default function DetailBukuPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const {
    books,
    siap,
    ubah,
    hapus,
    updateProgress,
    updateStatus,
    simpanReview,
  } = useBooks();

  const book = useMemo(() => books.find((b) => b.id === id), [books, id]);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [progressInput, setProgressInput] = useState<string>(
    book ? book.halamanTerbaca.toString() : ""
  );

  useEffect(() => {
    if (book) {
      setProgressInput(book.halamanTerbaca.toString());
    }
  }, [book?.halamanTerbaca, book?.id]);

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
          <p className="label-meta opacity-70">Memuat…</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-3 pb-20 pt-28">
        <EmptyState
          variant="search"
          title="Buku tidak ditemukan"
          description="Buku ini mungkin sudah dihapus atau ID-nya tidak valid lagi."
          action={
            <Link href="/koleksi" className="btn btn-ink">
              <i className="ri-arrow-left-line" />
              Kembali ke Koleksi
            </Link>
          }
        />
      </div>
    );
  }

  const progress = hitungProgress(book);
  const isSelesai = book.status === "selesai";

  function handleSaveProgress() {
    if (!book) return;
    const num = Number(progressInput);
    if (Number.isNaN(num)) return;
    updateProgress(book.id, num);
  }

  function handleChangeStatus(s: BookStatus) {
    if (!book) return;
    updateStatus(book.id, s);
  }

  function handleEditSubmit(data: BookInput) {
    if (!book) return;
    ubah(book.id, {
      judul: data.judul,
      penulis: data.penulis,
      genre: data.genre,
      totalHalaman: data.totalHalaman,
      status: data.status,
      coverUrl: data.coverUrl,
      tanggalMulaiBaca: data.tanggalMulaiBaca,
    });
    setShowEdit(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-3 pb-24 pt-28 sm:px-6">
      {/* ── Back ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/koleksi" className="section-link">
          <i className="ri-arrow-left-line" style={{ fontSize: "0.85rem" }} />
          Kembali
        </Link>
      </motion.div>

      {/* ── INFO UTAMA ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="surface-nm-lg relative grid grid-cols-1 gap-10 p-6 sm:p-10 md:grid-cols-[260px_1fr]"
      >
        {/* hairline accent */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-10 right-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          }}
        />

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mx-auto md:mx-0 w-[210px] shrink-0"
        >
          {book.coverUrl ? (
            <div
              className="aspect-[2/3] w-full overflow-hidden"
              style={{
                borderRadius: "1rem",
                boxShadow:
                  "0 16px 36px rgba(11,25,87,0.18), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.coverUrl}
                alt={escapeAlt(`Cover ${book.judul}`)}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="flex aspect-[2/3] w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
                borderRadius: "1rem",
                boxShadow:
                  "0 16px 36px rgba(11,25,87,0.18), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              <span
                className="font-display text-5xl font-normal italic"
                style={{
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "-0.04em",
                }}
              >
                {inisialJudul(book.judul)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <StatusBadge status={book.status} />
            <h1
              className="heading-display text-balance"
              style={{ fontSize: "clamp(2rem, 4.5vw, 2.8rem)" }}
            >
              {book.judul}
            </h1>
            <p
              className="font-display italic text-[1.05rem]"
              style={{ color: "var(--ink-mid)" }}
            >
              oleh{" "}
              <span
                className="not-italic font-medium"
                style={{ color: "var(--navy)" }}
              >
                {book.penulis}
              </span>
            </p>
          </div>

          {book.genre.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.genre.map((g) => (
                <GenreBadge key={g} nama={g} />
              ))}
            </div>
          )}

          {/* Meta grid */}
          <dl
            className="mt-2 grid grid-cols-2 gap-x-5 gap-y-4 rounded-xl p-5 sm:grid-cols-4"
            style={{
              background: "var(--paper-soft)",
              border: "1px solid var(--hairline)",
              boxShadow:
                "inset 1px 1px 3px rgba(11,25,87,0.03), inset -1px -1px 2px rgba(255,255,255,0.7)",
            }}
          >
            <Meta label="Halaman" value={formatAngka(book.totalHalaman)} />
            <Meta label="Ditambahkan" value={formatTanggal(book.tanggalDitambahkan)} />
            <Meta label="Mulai Baca" value={formatTanggal(book.tanggalMulaiBaca)} />
            <Meta label="Selesai" value={formatTanggal(book.tanggalSelesai)} />
          </dl>

          <div className="mt-2 flex flex-wrap gap-2.5">
            <motion.button
              type="button"
              onClick={() => setShowEdit(true)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="btn btn-paper"
            >
              <i className="ri-edit-2-line" style={{ fontSize: "1rem" }} />
              Edit Buku
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowDelete(true)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="btn"
              style={{
                background: "rgba(224, 85, 85, 0.08)",
                color: "#E05555",
                border: "1px solid rgba(224,85,85,0.2)",
              }}
            >
              <i
                className="ri-delete-bin-3-line"
                style={{ fontSize: "1rem" }}
              />
              Hapus
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* ── PROGRESS & STATUS ───────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="surface-nm relative p-6 md:p-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-10 right-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          }}
        />
        <div className="eyebrow mb-3">Progress</div>
        <h2 className="heading-section text-[1.5rem]">
          Seberapa <em>jauh</em> kamu sudah sampai?
        </h2>
        <p
          className="body-lead mt-2 max-w-md"
          style={{ fontSize: "0.95rem" }}
        >
          Catat sampai halaman berapa kamu sudah membaca hari ini.
        </p>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-2">
            <span className="label-meta">Halaman Terakhir Dibaca</span>
            <input
              type="number"
              min={0}
              max={book.totalHalaman}
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              className="input-nm num-ticker"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
            />
          </label>
          <motion.button
            type="button"
            onClick={handleSaveProgress}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="btn btn-ink"
          >
            <i className="ri-check-line" style={{ fontSize: "1rem" }} />
            Simpan
          </motion.button>
        </div>

        <div className="mt-8">
          <ProgressBar
            value={progress}
            label={`${formatAngka(book.halamanTerbaca)} / ${formatAngka(book.totalHalaman)} halaman`}
          />
        </div>

        {/* Status changer */}
        <div
          className="mt-10 pt-7"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <h3
            className="label-meta mb-4"
            style={{ fontSize: "0.65rem" }}
          >
            Ubah Status
          </h3>
          <div className="flex flex-wrap gap-2">
            {BOOK_STATUSES.map((s) => {
              const active = book.status === s;
              return (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => handleChangeStatus(s)}
                  whileTap={{ scale: 0.96 }}
                  className="chip"
                  aria-pressed={active}
                >
                  {STATUS_LABELS[s]}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── REVIEW ──────────────────────────────────────────── */}
      <ReviewSection
        isSelesai={isSelesai}
        rating={book.review?.rating ?? 0}
        text={book.review?.text ?? ""}
        onSave={(rating, text) => simpanReview(book.id, { rating, text })}
      />

      {/* ── MODALS ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showEdit && (
          <ModalShell title="Edit Buku" onClose={() => setShowEdit(false)}>
            <BookForm
              initialData={book}
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEdit(false)}
              submitLabel="Simpan Perubahan"
            />
          </ModalShell>
        )}
      </AnimatePresence>

      {showDelete && (
        <ConfirmDialog
          title={`Hapus "${book.judul}"?`}
          description="Tindakan ini tidak bisa dibatalkan. Buku dan reviewnya akan hilang dari koleksimu."
          onConfirm={() => {
            hapus(book.id);
            router.push("/koleksi");
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="label-meta"
        style={{ fontSize: "0.58rem", color: "var(--ink-light)" }}
      >
        {label}
      </dt>
      <dd
        className="num-ticker font-display mt-1.5 text-[0.95rem] font-normal"
        style={{ color: "var(--navy)" }}
      >
        {value}
      </dd>
    </div>
  );
}

/* ── Review Section ──────────────────────────────────────── */
function ReviewSection({
  isSelesai,
  rating,
  text,
  onSave,
}: {
  isSelesai: boolean;
  rating: number;
  text: string;
  onSave: (rating: number, text: string) => void;
}) {
  const [r, setR] = useState(rating);
  const [t, setT] = useState(text);
  const [lastSyncedRating, setLastSyncedRating] = useState(rating);
  const [lastSyncedText, setLastSyncedText] = useState(text);
  if (rating !== lastSyncedRating) {
    setLastSyncedRating(rating);
    setR(rating);
  }
  if (text !== lastSyncedText) {
    setLastSyncedText(text);
    setT(text);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="surface-nm relative p-6 md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-10 right-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
        }}
      />
      <div className="eyebrow mb-3">Impressions</div>
      <h2 className="heading-section text-[1.5rem]">
        Review <em>pribadi</em>
      </h2>

      {!isSelesai ? (
        <div
          className="mt-5 flex items-start gap-3 rounded-xl p-4"
          style={{
            background: "var(--paper-soft)",
            border: "1px solid var(--hairline)",
            boxShadow: "inset 1px 1px 3px rgba(11,25,87,0.03)",
          }}
        >
          <i
            className="ri-lock-2-line"
            style={{ fontSize: "1rem", color: "var(--ink-light)" }}
          />
          <p
            className="font-display italic text-[0.92rem] leading-relaxed"
            style={{ color: "var(--ink-mid)" }}
          >
            Fitur review akan terbuka setelah buku ditandai{" "}
            <span style={{ color: "var(--pink-soft)" }}>Selesai</span>.
          </p>
        </div>
      ) : (
        <div className="mt-7 flex flex-col gap-7">
          <div>
            <span className="label-meta mb-3 block">Rating</span>
            <RatingStars value={r} onChange={setR} size="lg" />
          </div>

          <label className="flex flex-col gap-2">
            <span className="label-meta">Kesan / Pendapat</span>
            <textarea
              value={t}
              onChange={(e) => setT(e.target.value)}
              rows={5}
              placeholder="Apa yang paling berkesan dari buku ini?"
              className="input-nm font-display italic"
              style={{
                resize: "vertical",
                minHeight: "120px",
                lineHeight: "1.55",
                fontSize: "0.98rem",
              }}
            />
          </label>

          <div className="flex justify-end">
            <motion.button
              type="button"
              onClick={() => onSave(r, t)}
              disabled={r === 0}
              whileHover={r === 0 ? undefined : { y: -1 }}
              whileTap={r === 0 ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="btn btn-ink"
              style={{
                opacity: r === 0 ? 0.5 : 1,
                cursor: r === 0 ? "not-allowed" : "pointer",
              }}
            >
              <i className="ri-save-3-line" style={{ fontSize: "1rem" }} />
              Simpan Review
            </motion.button>
          </div>
        </div>
      )}
    </motion.section>
  );
}

/* ── Modal Shell (edit) ──────────────────────────────────── */
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      style={{
        background: "rgba(11,25,87,0.35)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
          mass: 0.8,
        }}
        className="relative w-full max-w-lg overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(36px) saturate(1.6)",
          WebkitBackdropFilter: "blur(36px) saturate(1.6)",
          borderRadius: "1.25rem",
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow:
            "0 30px 80px rgba(11,25,87,0.22), 0 8px 28px rgba(11,25,87,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <div>
            <div className="eyebrow mb-1.5">Edit</div>
            <h2
              className="font-display text-[1.2rem] font-normal tracking-tight"
              style={{ color: "var(--navy)" }}
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="btn-icon"
          >
            <i className="ri-close-line" style={{ fontSize: "1.05rem" }} />
          </button>
        </div>
        <div className="max-h-[68vh] overflow-y-auto px-7 py-6 no-scrollbar">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
