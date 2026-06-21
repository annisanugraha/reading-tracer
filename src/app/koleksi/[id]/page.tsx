"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import { BOOK_STATUSES, STATUS_LABELS, type BookInput, type BookStatus } from "@/lib/types";
import {
  escapeAlt,
  formatAngka,
  formatTanggal,
  hitungProgress,
  inisialJudul,
} from "@/lib/utils";

// ─── Glass Styles ───────────────────────────────────────────────────────────
const glassCardStyle = {
  background: "rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(24px) saturate(1.5)",
  WebkitBackdropFilter: "blur(24px) saturate(1.5)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  borderRadius: "1.5rem",
  boxShadow: "0 8px 32px rgba(87, 132, 230, 0.08)",
};

const glassInputStyle = {
  background: "rgba(255, 255, 255, 0.7)",
  border: "1.5px solid rgba(87, 132, 230, 0.15)",
  borderRadius: "1rem",
  padding: "0.75rem 1rem",
  outline: "none",
  transition: "all 0.2s",
  color: "#0B1957",
};

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
  // progressInput: nilai form untuk halamanTerbaca.
  // Pakai pola "adjust state during rendering" supaya reset otomatis
  // ketika user navigasi ke buku lain.
  const [progressInput, setProgressInput] = useState<string>(
    book ? book.halamanTerbaca.toString() : ""
  );
  const [lastSyncedBookId, setLastSyncedBookId] = useState<string | null>(
    book?.id ?? null
  );
  if (book && book.id !== lastSyncedBookId) {
    setLastSyncedBookId(book.id);
    setProgressInput(book.halamanTerbaca.toString());
  }

  if (!siap) {
    return (
      <div className="flex min-h-screen items-center justify-center py-20 text-sm opacity-60">
        Memuat…
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 pb-20 pt-32">
        <EmptyState
          icon="🔎"
          title="Buku tidak ditemukan"
          description="Buku ini mungkin sudah dihapus atau ID-nya tidak valid."
          action={
            <Link
              href="/koleksi"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200"
              style={{
                background: "#0B1957",
                boxShadow: "0 4px 16px rgba(11, 25, 87, 0.25)",
                textDecoration: "none",
              }}
            >
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
    <div className="flex w-full flex-col gap-8 pb-24 pt-32">
      <nav aria-label="Breadcrumb" className="text-sm font-semibold opacity-70 transition-opacity hover:opacity-100">
        <Link href="/koleksi" style={{ color: "#0B1957", textDecoration: "none" }}>
          ← Kembali ke Koleksi
        </Link>
      </nav>

      {/* ── INFO UTAMA ── */}
      <section 
        className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] p-6 md:p-10"
        style={glassCardStyle}
      >
        {/* Cover besar */}
        <div className="mx-auto md:mx-0 w-[200px] shrink-0">
          {book.coverUrl ? (
            <div 
              className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-white/50"
              style={{ boxShadow: "0 12px 32px rgba(11, 25, 87, 0.15)" }}
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
              className="flex aspect-[2/3] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white"
              style={{ boxShadow: "0 12px 32px rgba(11, 25, 87, 0.15)" }}
            >
              <span className="text-5xl font-bold font-serif opacity-80">
                {inisialJudul(book.judul)}
              </span>
            </div>
          )}
        </div>

        {/* Info Detail */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="heading-display text-3xl sm:text-4xl" style={{ color: "#0B1957" }}>
                {book.judul}
              </h1>
              <p className="mt-2 text-lg opacity-80" style={{ color: "#0B1957" }}>
                oleh <span className="font-bold">{book.penulis}</span>
              </p>
            </div>
            <StatusBadge status={book.status} />
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {book.genre.map((g) => (
              <GenreBadge key={g} nama={g} />
            ))}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.4)" }}>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: "#0B1957" }}>
                Halaman
              </dt>
              <dd className="mt-1 text-base font-semibold" style={{ color: "#0B1957" }}>{formatAngka(book.totalHalaman)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: "#0B1957" }}>
                Ditambahkan
              </dt>
              <dd className="mt-1 text-base font-semibold" style={{ color: "#0B1957" }}>{formatTanggal(book.tanggalDitambahkan)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: "#0B1957" }}>
                Mulai Baca
              </dt>
              <dd className="mt-1 text-base font-semibold" style={{ color: "#0B1957" }}>{formatTanggal(book.tanggalMulaiBaca)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: "#0B1957" }}>
                Selesai
              </dt>
              <dd className="mt-1 text-base font-semibold" style={{ color: "#0B1957" }}>{formatTanggal(book.tanggalSelesai)}</dd>
            </div>
          </dl>

          <div className="mt-auto pt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowEdit(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.8)",
                color: "#0B1957",
                border: "1px solid rgba(87, 132, 230, 0.2)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                e.currentTarget.style.transform = "none";
              }}
            >
              Edit Buku
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition-all duration-200"
              style={{
                background: "rgba(244, 63, 94, 0.1)",
                color: "#E11D48",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(244, 63, 94, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      </section>

      {/* ── PROGRESS & STATUS ── */}
      <section className="p-6 md:p-8" style={glassCardStyle}>
        <h2 className="heading-section text-xl">Progress Membaca</h2>
        <p className="mt-1 text-sm opacity-70" style={{ color: "#0B1957" }}>
          Catat sampai halaman berapa kamu sudah baca.
        </p>
        
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: "#0B1957" }}>
              Halaman Terakhir Dibaca
            </span>
            <input
              type="number"
              min={0}
              max={book.totalHalaman}
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              style={glassInputStyle}
              onFocus={(e) => e.target.style.borderColor = "#5784E6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(87, 132, 230, 0.15)"}
            />
          </label>
          <button
            type="button"
            onClick={handleSaveProgress}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-200"
            style={{ background: "#0B1957", boxShadow: "0 4px 12px rgba(11,25,87,0.2)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#5784E6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#0B1957"}
          >
            Simpan Progress
          </button>
        </div>

        <div className="mt-8">
          <ProgressBar
            value={progress}
            label={`${formatAngka(book.halamanTerbaca)} / ${formatAngka(book.totalHalaman)} halaman`}
          />
        </div>

        <div className="mt-8 border-t pt-6" style={{ borderColor: "rgba(87, 132, 230, 0.15)" }}>
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-3" style={{ color: "#0B1957" }}>
            Ubah Status Buku
          </h3>
          <div className="flex flex-wrap gap-2">
            {BOOK_STATUSES.map((s) => {
              const active = book.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChangeStatus(s)}
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
                  style={{
                    backgroundColor: active ? "#0B1957" : "rgba(255, 255, 255, 0.6)",
                    color: active ? "#FFFFFF" : "#0B1957",
                    border: active ? "1.5px solid #0B1957" : "1.5px solid rgba(87, 132, 230, 0.2)",
                    boxShadow: active ? "0 4px 12px rgba(11,25,87,0.2)" : "none",
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEW ── */}
      <ReviewSection
        isSelesai={isSelesai}
        rating={book.review?.rating ?? 0}
        text={book.review?.text ?? ""}
        onSave={(rating, text) => simpanReview(book.id, { rating, text })}
      />

      {/* ── MODALS ── */}
      {showEdit && (
        <Modal title="Edit Buku" onClose={() => setShowEdit(false)}>
          <BookForm
            initialData={book}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEdit(false)}
            submitLabel="Simpan Perubahan"
          />
        </Modal>
      )}

      {showDelete && (
        <ConfirmDialog
          title={`Hapus "${book.judul}"?`}
          description="Tindakan ini tidak bisa dibatalkan. Buku dan reviewnya akan hilang dari koleksi."
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

// ─── Sub-komponen Review ────────────────────────────────────────────────────
interface ReviewSectionProps {
  isSelesai: boolean;
  rating: number;
  text: string;
  onSave: (rating: number, text: string) => void;
}

function ReviewSection({ isSelesai, rating, text, onSave }: ReviewSectionProps) {
  const [r, setR] = useState(rating);
  const [t, setT] = useState(text);
  // Sync draft state dengan prop setiap kali review di-load buku lain.
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
    <section className="p-6 md:p-8" style={glassCardStyle}>
      <h2 className="heading-section text-xl">Review Pribadi</h2>
      {!isSelesai ? (
        <p className="mt-2 text-sm opacity-70" style={{ color: "#0B1957" }}>
          Fitur review akan terbuka setelah buku ditandai <strong className="font-bold">Selesai</strong>.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 block mb-2" style={{ color: "#0B1957" }}>
              Rating
            </span>
            <RatingStars value={r} onChange={setR} size="lg" />
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: "#0B1957" }}>
              Kesan / Pendapat
            </span>
            <textarea
              value={t}
              onChange={(e) => setT(e.target.value)}
              rows={4}
              placeholder="Apa yang paling berkesan dari buku ini?"
              style={{ ...glassInputStyle, resize: "vertical" }}
              onFocus={(e) => e.target.style.borderColor = "#5784E6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(87, 132, 230, 0.15)"}
            />
          </label>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => onSave(r, t)}
              disabled={r === 0}
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200"
              style={{ 
                background: r === 0 ? "rgba(11,25,87,0.3)" : "#0B1957", 
                boxShadow: r === 0 ? "none" : "0 4px 12px rgba(11,25,87,0.2)",
                cursor: r === 0 ? "not-allowed" : "pointer"
              }}
            >
              Simpan Review
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Sub-komponen Modal ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(11, 25, 87, 0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(40px) saturate(2)",
          borderRadius: "2rem",
          boxShadow: "0 24px 64px rgba(11, 25, 87, 0.2)",
          border: "1px solid rgba(255,255,255,1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: "rgba(87, 132, 230, 0.15)" }}>
          <h2 className="heading-section text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 scrollbar-hide">{children}</div>
      </div>
    </div>
  );
}