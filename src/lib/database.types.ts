/**
 * Hand-written Supabase Database type matching the deployed schema in
 * `books` and `reviews` tables. Mirrors the shape `supabase gen types` would
 * emit, so `createClient<Database>` can infer row/insert/update types and
 * embedded joins like `reviews(*)` resolve correctly.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookStatusDb =
  | "mau-dibaca"
  | "sedang-dibaca"
  | "selesai"
  | "berhenti";

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          user_id: string;
          judul: string;
          penulis: string;
          genre: string[];
          total_halaman: number;
          halaman_terbaca: number;
          status: BookStatusDb;
          cover_url: string | null;
          tanggal_ditambahkan: string;
          tanggal_mulai_baca: string | null;
          tanggal_selesai: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          judul: string;
          penulis: string;
          genre?: string[];
          total_halaman: number;
          halaman_terbaca?: number;
          status: BookStatusDb;
          cover_url?: string | null;
          tanggal_ditambahkan?: string;
          tanggal_mulai_baca?: string | null;
          tanggal_selesai?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          judul?: string;
          penulis?: string;
          genre?: string[];
          total_halaman?: number;
          halaman_terbaca?: number;
          status?: BookStatusDb;
          cover_url?: string | null;
          tanggal_ditambahkan?: string;
          tanggal_mulai_baca?: string | null;
          tanggal_selesai?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: true;
            referencedRelation: "reviews";
            referencedColumns: ["book_id"];
          },
        ];
      };
      reviews: {
        Row: {
          book_id: string;
          user_id: string;
          rating: number;
          text: string | null;
          updated_at: string;
        };
        Insert: {
          book_id: string;
          user_id: string;
          rating: number;
          text?: string | null;
          updated_at?: string;
        };
        Update: {
          book_id?: string;
          user_id?: string;
          rating?: number;
          text?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};