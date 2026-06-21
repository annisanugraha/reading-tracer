import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { Book, BookInput, BookStatus } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

type BookRow = Database["public"]["Tables"]["books"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
type BookUpdate = Database["public"]["Tables"]["books"]["Update"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export type BookRowWithReview = BookRow & { reviews: ReviewRow | null };

/**
 * Konversi satu baris `books` (+ optional joined `reviews`) menjadi UI `Book`
 * (camelCase). Dipakai setelah fetch dari Supabase.
 */
export function bookRowToUi(row: BookRowWithReview): Book {
  const review = row.reviews
    ? {
        rating: row.reviews.rating,
        text: row.reviews.text ?? "",
        updatedAt: row.reviews.updated_at,
      }
    : undefined;
  return {
    id: row.id,
    judul: row.judul,
    penulis: row.penulis,
    genre: row.genre ?? [],
    totalHalaman: row.total_halaman,
    halamanTerbaca: row.halaman_terbaca ?? 0,
    status: row.status as BookStatus,
    coverUrl: row.cover_url ?? undefined,
    tanggalDitambahkan: row.tanggal_ditambahkan,
    tanggalMulaiBaca: row.tanggal_mulai_baca ?? undefined,
    tanggalSelesai: row.tanggal_selesai ?? undefined,
    review,
  };
}

/**
 * Konversi `BookInput` UI menjadi payload INSERT untuk tabel `books`.
 * `tanggal_ditambahkan` tidak di-set supaya DB default `now()` yang mengisi.
 */
export function bookInputToRowInsert(input: BookInput, userId: string): BookInsert {
  return {
    user_id: userId,
    judul: input.judul,
    penulis: input.penulis,
    genre: input.genre ?? [],
    total_halaman: input.totalHalaman,
    halaman_terbaca: input.halamanTerbaca ?? 0,
    status: input.status,
    cover_url: input.coverUrl ?? null,
    tanggal_mulai_baca: input.tanggalMulaiBaca ?? null,
  };
}

/**
 * Konversi `Partial<Book>` UI menjadi payload UPDATE untuk tabel `books`.
 * Field yang `undefined` di-skip (tidak ditimpa).
 */
export function bookPatchToRowUpdate(patch: Partial<Book>): BookUpdate {
  const update: BookUpdate = {};
  if (patch.judul !== undefined) update.judul = patch.judul;
  if (patch.penulis !== undefined) update.penulis = patch.penulis;
  if (patch.genre !== undefined) update.genre = patch.genre;
  if (patch.totalHalaman !== undefined) update.total_halaman = patch.totalHalaman;
  if (patch.halamanTerbaca !== undefined) update.halaman_terbaca = patch.halamanTerbaca;
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.coverUrl !== undefined) update.cover_url = patch.coverUrl;
  if (patch.tanggalMulaiBaca !== undefined) {
    update.tanggal_mulai_baca = patch.tanggalMulaiBaca;
  }
  if (patch.tanggalSelesai !== undefined) update.tanggal_selesai = patch.tanggalSelesai;
  return update;
}

/**
 * Konversi review UI menjadi payload INSERT untuk tabel `reviews`.
 * `book_id` jadi PK di tabel reviews, jadi upsert berdasarkan book_id.
 */
export function reviewToRow(
  review: { rating: number; text: string },
  bookId: string,
  userId: string
): ReviewInsert {
  return {
    book_id: bookId,
    user_id: userId,
    rating: review.rating,
    text: review.text,
  };
}