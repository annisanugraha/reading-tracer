"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
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

/**
 * useSearchParams() di Next.js 16 mengharuskan pembungkus Suspense
 * supaya build statis tidak bailout. Kita bungkus content dengan
 * Suspense fallback minimal.
 */
export default function KoleksiPage() {
  return (
    <Suspense fallback={<KoleksiFallback />}>
      <KoleksiContent />
    </Suspense>
  );
}

function KoleksiFallback() {
  return (
    <div className="flex items-center justify-center py-20 text-sm text-zinc-500">
      Memuat koleksi…
    </div>
  );
}

function KoleksiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { books, siap, tambah, hapus } = useBooks();

  const [search, setSearch] = useState("");
  // Baca query param ?status=… untuk deep link dari dashboard.
  // Pakai pola "adjust state during rendering" (sesuai React docs) supaya
  // tidak memicu lint react-hooks/set-state-in-effect.
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

  // Kumpulan genre unik dari koleksi, sorted.
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
    <div className="flex w-full flex-col gap-6 pb-20 pt-28">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Koleksi Buku
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {filtered.length} dari {books.length} buku ditampilkan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200"
          style={{
            background: "#0B1957",
            boxShadow: "0 4px 16px rgba(11, 25, 87, 0.25)",
            border: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#5784E6";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(87, 132, 230, 0.35)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0B1957";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(11, 25, 87, 0.25)";
            e.currentTarget.style.transform = "none";
          }}
        >
          <span aria-hidden>＋</span> Tambah Buku
        </button>
      </div>

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

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Tidak ada buku yang cocok"
          description={
            books.length === 0
              ? "Koleksi kamu masih kosong. Yuk, tambah buku pertamamu!"
              : "Coba ubah filter atau kata kunci pencarian."
          }
          action={
            books.length === 0 ? (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200"
                style={{
                  background: "#0B1957",
                  boxShadow: "0 4px 16px rgba(11, 25, 87, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5784E6";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(87, 132, 230, 0.35)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0B1957";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(11, 25, 87, 0.25)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Tambah Buku
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterStatus([]);
                  setFilterGenre([]);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  color: "#0B1957",
                  border: "1px solid rgba(87, 132, 230, 0.25)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(87, 132, 230, 0.18)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Reset Filter
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => (
            <div key={b.id} className="relative group">
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
              <button
                type="button"
                onClick={() => setPendingDeleteId(b.id)}
                aria-label={`Hapus buku ${b.judul}`}
                className="absolute right-3 top-3 hidden h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm ring-1 ring-zinc-200 hover:bg-rose-50 group-hover:flex dark:bg-zinc-900/90 dark:ring-zinc-700 dark:hover:bg-rose-950"
                title="Hapus buku"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link
          href="/"
          className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {showAdd && (
        <Modal title="Tambah Buku Baru" onClose={() => setShowAdd(false)}>
          <BookForm
            existingGenres={genreOptions}
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            submitLabel="Tambah"
          />
        </Modal>
      )}

      {bookToDelete && (
        <ConfirmDialog
          title={`Hapus "${bookToDelete.judul}"?`}
          description="Tindakan ini tidak bisa dibatalkan. Buku dan reviewnya akan hilang dari koleksi."
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

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, onClose, children }: ModalProps) {
  // ESC untuk tutup
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}