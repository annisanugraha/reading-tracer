"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Book, BookInput, BookStatus } from "@/lib/types";
import { BOOK_STATUSES, STATUS_LABELS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BookFormProps {
  initialData?: Partial<Book>;
  existingGenres?: string[];
  onSubmit: (data: BookInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

/**
 * BookForm — neumorphic form dengan animated genre chips.
 */
export function BookForm({
  initialData,
  existingGenres = [],
  onSubmit,
  onCancel,
  submitLabel = "Simpan",
}: BookFormProps) {
  const [judul, setJudul] = useState(initialData?.judul ?? "");
  const [penulis, setPenulis] = useState(initialData?.penulis ?? "");
  const [genreInput, setGenreInput] = useState("");
  const [genreList, setGenreList] = useState<string[]>(initialData?.genre ?? []);
  const [totalHalaman, setTotalHalaman] = useState<string>(
    initialData?.totalHalaman?.toString() ?? ""
  );
  const [status, setStatus] = useState<BookStatus>(
    initialData?.status ?? "mau-dibaca"
  );
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl ?? "");
  const [tanggalMulai, setTanggalMulai] = useState<string>(
    initialData?.tanggalMulaiBaca?.slice(0, 10) ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function addGenre(raw: string) {
    const g = raw.trim().toLowerCase();
    if (!g) return;
    if (genreList.includes(g)) return;
    setGenreList([...genreList, g]);
    setGenreInput("");
  }

  function removeGenre(g: string) {
    setGenreList(genreList.filter((x) => x !== g));
  }

  function handleGenreKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addGenre(genreInput);
    } else if (e.key === "Backspace" && !genreInput && genreList.length > 0) {
      removeGenre(genreList[genreList.length - 1]);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!judul.trim()) newErrors.judul = "Judul wajib diisi";
    if (!penulis.trim()) newErrors.penulis = "Penulis wajib diisi";
    const pages = Number(totalHalaman);
    if (!totalHalaman || Number.isNaN(pages) || pages <= 0) {
      newErrors.totalHalaman = "Jumlah halaman harus angka positif";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const payload: BookInput = {
      judul: judul.trim(),
      penulis: penulis.trim(),
      genre: genreList,
      totalHalaman: pages,
      status,
      coverUrl: coverUrl.trim() || undefined,
      tanggalMulaiBaca: tanggalMulai ? new Date(tanggalMulai).toISOString() : undefined,
    };

    onSubmit(payload);
  }

  const genreOptions = Array.from(new Set([...existingGenres, ...genreList]));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Judul" required error={errors.judul}>
        <Input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          aria-invalid={!!errors.judul}
          placeholder="Contoh: Laskar Pelangi"
          className="input-nm"
        />
      </Field>

      <Field label="Penulis" required error={errors.penulis}>
        <Input
          type="text"
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
          aria-invalid={!!errors.penulis}
          placeholder="Nama penulis"
          className="input-nm"
        />
      </Field>

      <Field label="Genre" hint="Tekan Enter atau koma untuk menambah">
        <div className="surface-inset flex flex-wrap items-center gap-2 px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--blue-soft)]/40">
          <AnimatePresence initial={false}>
            {genreList.map((g) => (
              <motion.span
                key={g}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pill pill-pale capitalize"
              >
                <i
                  className="ri-price-tag-3-line"
                  style={{ fontSize: "0.7rem" }}
                />
                <span style={{ letterSpacing: "0.05em" }}>{g}</span>
                <button
                  type="button"
                  onClick={() => removeGenre(g)}
                  aria-label={`Hapus genre ${g}`}
                  className="ml-0.5 opacity-60 hover:opacity-100"
                >
                  <i className="ri-close-line" style={{ fontSize: "0.7rem" }} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            type="text"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={handleGenreKeyDown}
            onBlur={() => addGenre(genreInput)}
            list="genre-options"
            className="flex-1 min-w-[8rem] bg-transparent text-[0.88rem] outline-none placeholder:italic"
            style={{ color: "var(--ink)", padding: "0.25rem 0.25rem" }}
            placeholder={
              genreList.length === 0 ? "fiksi, teknologi…" : ""
            }
          />
          <datalist id="genre-options">
            {genreOptions.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
      </Field>

      <Field label="Jumlah Halaman" required error={errors.totalHalaman}>
        <Input
          type="number"
          min={1}
          value={totalHalaman}
          onChange={(e) => setTotalHalaman(e.target.value)}
          aria-invalid={!!errors.totalHalaman}
          placeholder="320"
          className="input-nm"
        />
      </Field>

      <Field label="Status Awal">
        <Select value={status} onValueChange={(v) => setStatus(v as BookStatus)}>
          <SelectTrigger
            className={cn(
              "input-nm w-full text-left",
              "flex items-center justify-between"
            )}
            style={{ height: "auto", padding: "0.75rem 1.1rem" }}
          >
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            {BOOK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="URL Cover" hint="Opsional. Kosongkan untuk placeholder otomatis.">
        <Input
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://…"
          className="input-nm"
        />
      </Field>

      <Field label="Tanggal Mulai Baca" hint="Opsional">
        <Input
          type="date"
          value={tanggalMulai}
          onChange={(e) => setTanggalMulai(e.target.value)}
          className="input-nm"
        />
      </Field>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="btn btn-ghost"
            style={{ height: "auto", padding: "0.75rem 1.5rem" }}
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          className="btn btn-ink"
          style={{ height: "auto", padding: "0.75rem 1.5rem" }}
        >
          <i className="ri-check-line" style={{ fontSize: "1rem" }} />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        className="label-meta"
        style={{ color: "var(--ink-mid)", letterSpacing: "0.18em" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--pink-soft)", marginLeft: "0.25rem" }}>
            *
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <span
          className="font-display italic text-[0.78rem]"
          style={{ color: "#E05555" }}
        >
          {error}
        </span>
      ) : hint ? (
        <span
          className="font-display italic text-[0.75rem]"
          style={{ color: "var(--ink-light)" }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
