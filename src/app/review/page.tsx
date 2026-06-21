"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
      <div className="flex items-center justify-center py-20 text-sm text-zinc-500">
        Memuat…
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-20 pt-28">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Riwayat Review
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {reviewed.length} buku sudah direview
            {rataRating > 0 && ` · rata-rata ⭐ ${rataRating.toFixed(1)}`}
          </p>
        </div>
        {reviewed.length > 0 && (
          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setSort("rating")}
              className={`rounded-md px-3 py-1 font-medium ${
                sort === "rating"
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              Rating Tertinggi
            </button>
            <button
              type="button"
              onClick={() => setSort("terbaru")}
              className={`rounded-md px-3 py-1 font-medium ${
                sort === "terbaru"
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              Terbaru
            </button>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="Belum ada review"
          description="Tandai buku sebagai Selesai dan tulis感想 pertamamu untuk mulai mengisi halaman ini."
          action={
            <Link
              href="/koleksi"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Buka Koleksi
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sorted.map((b) => (
            <ReviewCard
              key={b.id}
              cover={b.coverUrl}
              judul={b.judul}
              penulis={b.penulis}
              rating={b.review?.rating ?? 0}
              teksReview={b.review?.text ?? ""}
              tanggal={b.review?.updatedAt ?? b.tanggalSelesai ?? b.tanggalDitambahkan}
              href={`/koleksi/${b.id}`}
            />
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
    </div>
  );
}