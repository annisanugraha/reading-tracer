"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Book, BookInput, BookStatus } from "@/lib/types";
import {
  supabase,
  bookRowToUi,
  bookInputToRowInsert,
  bookPatchToRowUpdate,
  reviewToRow,
} from "@/lib/supabase";
import { hariIniIso } from "@/lib/utils";

/**
 * Hook utama untuk koleksi buku. Single source of truth di sisi klien,
 * persist ke Supabase lewat src/lib/supabase.ts.
 *
 * Kontrak:
 * - books: daftar buku terurut sesuai urutan dari DB
 * - tambah: tambah buku baru (+ optional review), return id
 * - ubah: edit buku berdasarkan id (partial merge)
 * - hapus: hapus buku berdasarkan id (review ikut terhapus via FK cascade)
 * - updateProgress: ubah halamanTerbaca + auto-set tanggalMulaiBaca + auto-promote status
 * - updateStatus: ubah status + auto-set tanggalSelesai kalau jadi "selesai"
 * - simpanReview: upsert review (otomatis timestamp updated_at di DB)
 * - muatUlang: refetch dari Supabase
 *
 * Catatan migrasi dari localStorage:
 * - tambah sekarang async (return Promise<string>) — UI call site di koleksi/page.tsx sudah di-await.
 * - Siap hanya menandai fetch awal selesai, bukan persistensi sinkron.
 */
const USER_ID = process.env.NEXT_PUBLIC_SUPABASE_USER_ID ?? "";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [siap, setSiap] = useState(false);

  const muatUlang = useCallback(async () => {
    if (!USER_ID) {
      console.error("useBooks.muatUlang: NEXT_PUBLIC_SUPABASE_USER_ID kosong");
      setBooks([]);
      setSiap(true);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*, reviews(*)")
        .eq("user_id", USER_ID);
      if (error) throw error;
      const list = (data ?? []).map((row) =>
        bookRowToUi({
          ...row,
          reviews: Array.isArray(row.reviews)
            ? row.reviews[0] ?? null
            : row.reviews,
        })
      );
      setBooks(list);
    } catch (err) {
      console.error(
        "useBooks.muatUlang:",
        err instanceof Error ? err.message : err
      );
    } finally {
      setSiap(true);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount. Lint rule react-hooks/set-state-in-effect flags
    // async setState in effects, but this is the canonical data-fetch pattern.
    // Three pre-existing call sites in koleksi pages follow the same shape.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    muatUlang();
  }, [muatUlang]);

  const tambah = useCallback(
    async (input: BookInput): Promise<string> => {
      if (!USER_ID) {
        console.error("useBooks.tambah: USER_ID kosong");
        return "";
      }
      try {
        const insertPayload = bookInputToRowInsert(input, USER_ID);
        const { data, error } = await supabase
          .from("books")
          .insert(insertPayload)
          .select("id")
          .single();
        if (error) throw error;
        const newId = data.id;

        if (input.review) {
          const reviewPayload = reviewToRow(
            { rating: input.review.rating, text: input.review.text },
            newId,
            USER_ID
          );
          const { error: reviewError } = await supabase
            .from("reviews")
            .upsert(reviewPayload, { onConflict: "book_id" });
          if (reviewError) throw reviewError;
        }

        await muatUlang();
        return newId;
      } catch (err) {
        console.error(
          "useBooks.tambah:",
          err instanceof Error ? err.message : err
        );
        return "";
      }
    },
    [muatUlang]
  );

  const ubah = useCallback(
    async (id: string, patch: Partial<Book>): Promise<void> => {
      try {
        const updatePayload = bookPatchToRowUpdate(patch);
        const { error } = await supabase
          .from("books")
          .update(updatePayload)
          .eq("id", id);
        if (error) throw error;
        await muatUlang();
      } catch (err) {
        console.error(
          "useBooks.ubah:",
          err instanceof Error ? err.message : err
        );
      }
    },
    [muatUlang]
  );

  const hapus = useCallback(
    async (id: string): Promise<void> => {
      try {
        const { error } = await supabase.from("books").delete().eq("id", id);
        if (error) throw error;
        await muatUlang();
      } catch (err) {
        console.error(
          "useBooks.hapus:",
          err instanceof Error ? err.message : err
        );
      }
    },
    [muatUlang]
  );

  const updateProgress = useCallback(
    async (id: string, halaman: number): Promise<void> => {
      const current = books.find((b) => b.id === id);
      if (!current) return;
      const clamped = Math.max(0, Math.min(halaman, current.totalHalaman));
      const patch: Partial<Book> = { halamanTerbaca: clamped };
      if (!current.tanggalMulaiBaca && clamped > 0) {
        patch.tanggalMulaiBaca = hariIniIso();
      }
      // Otomatis pindah ke "sedang-dibaca" begitu mulai baca,
      // tapi JANGAN paksa kembali dari "selesai" ke "sedang-dibaca" kalau
      // halaman penuh: user bisa tetap di "selesai".
      if (clamped > 0 && current.status === "mau-dibaca") {
        patch.status = "sedang-dibaca";
      }
      await ubah(id, patch);
    },
    [books, ubah]
  );

  const updateStatus = useCallback(
    async (id: string, status: BookStatus): Promise<void> => {
      const current = books.find((b) => b.id === id);
      if (!current) return;
      const patch: Partial<Book> = { status };
      if (status === "sedang-dibaca" && !current.tanggalMulaiBaca) {
        patch.tanggalMulaiBaca = hariIniIso();
      }
      if (status === "selesai") {
        patch.tanggalSelesai = hariIniIso();
        if (current.halamanTerbaca < current.totalHalaman) {
          patch.halamanTerbaca = current.totalHalaman;
        }
      }
      await ubah(id, patch);
    },
    [books, ubah]
  );

  const simpanReview = useCallback(
    async (id: string, review: { rating: number; text: string }): Promise<void> => {
      if (!USER_ID) {
        console.error("useBooks.simpanReview: USER_ID kosong");
        return;
      }
      try {
        const payload = reviewToRow(review, id, USER_ID);
        const { error } = await supabase
          .from("reviews")
          .upsert(payload, { onConflict: "book_id" });
        if (error) throw error;
        await muatUlang();
      } catch (err) {
        console.error(
          "useBooks.simpanReview:",
          err instanceof Error ? err.message : err
        );
      }
    },
    [muatUlang]
  );

  const statistik = useMemo(() => {
    const total = books.length;
    const sedang = books.filter((b) => b.status === "sedang-dibaca").length;
    const selesai = books.filter((b) => b.status === "selesai").length;
    const berhenti = books.filter((b) => b.status === "berhenti").length;
    const mauDibaca = books.filter((b) => b.status === "mau-dibaca").length;
    const totalHalamanDibaca = books.reduce(
      (acc, b) => acc + (b.halamanTerbaca ?? 0),
      0
    );
    const ratedBooks = books.filter((b) => b.review?.rating);
    const rataRating =
      ratedBooks.length === 0
        ? 0
        : ratedBooks.reduce((acc, b) => acc + (b.review?.rating ?? 0), 0) /
          ratedBooks.length;
    return {
      total,
      sedang,
      selesai,
      berhenti,
      mauDibaca,
      totalHalamanDibaca,
      rataRating: Number(rataRating.toFixed(1)),
    };
  }, [books]);

  return {
    books,
    siap,
    tambah,
    ubah,
    hapus,
    updateProgress,
    updateStatus,
    simpanReview,
    muatUlang,
    statistik,
  };
}