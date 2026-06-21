"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import {
  BookCard,
  BookForm,
  EmptyState,
  SearchFilterBar,
  type SortOption,
} from "@/components/book";
import type { BookStatus, BookInput } from "@/lib/types";
import { ConfirmDialog } from "@/components/book/ConfirmDialog";

export default function KoleksiPage() {
  return (
    <Suspense fallback={<KoleksiFallback />}>
      <KoleksiContent />
    </Suspense>
  );
}

function KoleksiFallback() {
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
        <p className="label-meta opacity-70">Memuat koleksi…</p>
      </div>
    </div>
  );
}

function KoleksiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { books, siap, tambah, hapus } = useBooks();

  const [search, setSearch] = useState("");
  const statusParam = searchParams.get("status");
  const initialStatus: BookStatus | null =
    statusParam === "mau-dibaca" ||
    statusParam === "sedang-dibaca" ||
    statusParam === "selesai" ||
    statusParam === "berhenti"
      ? statusParam
      : null;
  const [filterStatus, setFilterStatus] = useState<BookStatus[]>(
    initialStatus ? [initialStatus] : []
  );
  const [lastStatusParam, setLastStatusParam] = useState(statusParam);
  if (statusParam !== lastStatusParam) {
    setLastStatusParam(statusParam);
    setFilterStatus(initialStatus ? [initialStatus] : []);
  }
  const [filterGenre, setFilterGenre] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("terbaru");
  const [showAdd, setShowAdd] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const genreOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genre.forEach((g) => set.add(g.toLowerCase())));
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = books.filter((b) => {
      if (q) {
        const hay = `${b.judul} ${b.penulis}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filterStatus.length > 0 && !filterStatus.includes(b.status)) {
        return false;
      }
      if (filterGenre.length > 0) {
        const bookGenres = b.genre.map((g) => g.toLowerCase());
        const ada = filterGenre.some((g) => bookGenres.includes(g));
        if (!ada) return false;
      }
      return true;
    });

    switch (sort) {
      case "judul":
        list = [...list].sort((a, b) =>
          a.judul.localeCompare(b.judul, "id", { sensitivity: "base" })
        );
        break;
      case "rating":
        list = [...list].sort((a, b) => {
          const ra = a.review?.rating ?? 0;
          const rb = b.review?.rating ?? 0;
          if (rb !== ra) return rb - ra;
          return a.judul.localeCompare(b.judul, "id", { sensitivity: "base" });
        });
        break;
      case "terbaru":
      default:
        list = [...list].sort((a, b) =>
          b.tanggalDitambahkan.localeCompare(a.tanggalDitambahkan)
        );
        break;
    }

    return list;
  }, [books, search, filterStatus, filterGenre, sort]);

  const handleAdd = async (data: BookInput) => {
    const id = await tambah(data);
    setShowAdd(false);
    if (id) router.push(`/koleksi/${id}`);
  };

  const bookToDelete = pendingDeleteId
    ? books.find((b) => b.id === pendingDeleteId)
    : null;

  if (!siap) {
    return <KoleksiFallback />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-3 pb-24 pt-28 sm:px-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="eyebrow mb-3">Collection</div>
          <h1
            className="heading-display text-balance"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            <em>Koleksi</em> buku
          </h1>
          <p
            className="body-lead mt-3 text-balance"
            style={{ fontSize: "1rem", maxWidth: "32rem" }}
          >
            {filtered.length === books.length
              ? `Menampilkan seluruh ${books.length} buku`
              : `${filtered.length} dari ${books.length} buku ditampilkan`}
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => setShowAdd(true)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="btn btn-ink self-start"
        >
          <i className="ri-add-line" style={{ fontSize: "1.1rem" }} />
          Tambah Buku
        </motion.button>
      </motion.header>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterGenre={filterGenre}
        onFilterGenreChange={setFilterGenre}
        genreOptions={genreOptions}
        sort={sort}
        onSortChange={setSort}
      />

      {/* ── Grid / empty ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          variant={books.length === 0 ? "books" : "search"}
          title={
            books.length === 0
              ? "Koleksi kamu masih kosong"
              : "Tidak ada buku yang cocok"
          }
          description={
            books.length === 0
              ? "Yuk, tambah buku pertamamu — halaman kosong ini menunggu untuk diisi."
              : "Coba ubah filter atau kata kunci pencarianmu."
          }
          action={
            books.length === 0 ? (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="btn btn-ink"
              >
                <i className="ri-add-line" />
                Tambah Buku Pertama
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterStatus([]);
                  setFilterGenre([]);
                }}
                className="btn btn-paper"
              >
                <i className="ri-refresh-line" />
                Reset Filter
              </button>
            )
          }
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((b) => (
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
                className="group relative"
              >
                <BookCard
                  cover={b.coverUrl}
                  judul={b.judul}
                  penulis={b.penulis}
                  status={b.status}
                  rating={b.review?.rating}
                  totalHalaman={b.totalHalaman}
                  halamanTerbaca={b.halamanTerbaca}
                  href={`/koleksi/${b.id}`}
                />
                <motion.button
                  type="button"
                  onClick={() => setPendingDeleteId(b.id)}
                  aria-label={`Hapus buku ${b.judul}`}
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="btn-icon absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    color: "#E05555",
                    width: "2rem",
                    height: "2rem",
                  }}
                  title="Hapus buku"
                >
                  <i
                    className="ri-delete-bin-3-line"
                    style={{ fontSize: "0.95rem" }}
                  />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Back link ──────────────────────────────────────── */}
      <div className="flex justify-center pt-2">
        <Link href="/" className="section-link">
          <i className="ri-arrow-left-line" style={{ fontSize: "0.85rem" }} />
          Kembali ke Atelier
        </Link>
      </div>

      {/* ── Add modal ──────────────────────────────────────── */}
      <Modal open={showAdd} title="Tambah Buku Baru" onClose={() => setShowAdd(false)}>
        <BookForm
          existingGenres={genreOptions}
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
          submitLabel="Tambah ke Koleksi"
        />
      </Modal>

      {/* ── Delete confirm ─────────────────────────────────── */}
      {bookToDelete && (
        <ConfirmDialog
          title={`Hapus "${bookToDelete.judul}"?`}
          description="Tindakan ini tidak bisa dibatalkan. Buku dan reviewnya akan hilang dari koleksimu."
          onConfirm={() => {
            hapus(bookToDelete.id);
            setPendingDeleteId(null);
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}

/* ── Modal (add) ──────────────────────────────────────────── */
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  open: boolean;
}

function Modal({ title, onClose, children, open }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
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
          aria-label={title}
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
                <div className="eyebrow mb-1.5">New</div>
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
      )}
    </AnimatePresence>,
    document.body
  );
}
