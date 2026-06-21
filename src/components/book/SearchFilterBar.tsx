"use client";

import { motion, LayoutGroup } from "framer-motion";
import type { BookStatus } from "@/lib/types";
import { BOOK_STATUSES, STATUS_LABELS } from "@/lib/types";

export type SortOption = "terbaru" | "rating" | "judul";

export interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;

  filterStatus: BookStatus[];
  onFilterStatusChange: (status: BookStatus[]) => void;

  filterGenre: string[];
  onFilterGenreChange: (genre: string[]) => void;

  genreOptions: string[];

  sort: SortOption;
  onSortChange: (sort: SortOption) => void;

  className?: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  terbaru: "Terbaru",
  rating: "Rating Tertinggi",
  judul: "Judul A–Z",
};

/**
 * SearchFilterBar — neumorphic surface dengan inset search & animated chip group.
 */
export function SearchFilterBar({
  searchValue,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterGenre,
  onFilterGenreChange,
  genreOptions,
  sort,
  onSortChange,
  className = "",
}: SearchFilterBarProps) {
  const toggleStatus = (s: BookStatus) => {
    if (filterStatus.includes(s)) {
      onFilterStatusChange(filterStatus.filter((x) => x !== s));
    } else {
      onFilterStatusChange([...filterStatus, s]);
    }
  };

  const toggleGenre = (g: string) => {
    if (filterGenre.includes(g)) {
      onFilterGenreChange(filterGenre.filter((x) => x !== g));
    } else {
      onFilterGenreChange([...filterGenre, g]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`surface-nm flex flex-col gap-5 p-6 ${className}`}
    >
      {/* Search + Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <i
              className="ri-search-line"
              style={{ fontSize: "1rem", color: "var(--ink-light)" }}
            />
          </div>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul atau penulis…"
            className="input-nm"
            style={{
              paddingLeft: "2.75rem",
              paddingRight: "2.5rem",
              borderRadius: "9999px",
            }}
            aria-label="Cari buku"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Bersihkan pencarian"
              className="absolute inset-y-0 right-3 my-auto flex h-7 w-7 items-center justify-center rounded-full"
              style={{ color: "var(--ink-mid)" }}
            >
              <i className="ri-close-line" style={{ fontSize: "1rem" }} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="label-meta" style={{ fontSize: "0.62rem" }}>
            Urutkan
          </span>
          <div
            className="relative flex items-center"
            style={{
              background: "var(--paper-soft)",
              border: "1px solid var(--hairline)",
              borderRadius: "9999px",
              padding: "3px",
              boxShadow:
                "inset 2px 2px 5px rgba(11,25,87,0.04), inset -1px -1px 3px rgba(255,255,255,0.7)",
            }}
          >
            <LayoutGroup id="sort-pills">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => {
                const active = sort === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onSortChange(opt)}
                    className="relative px-3 py-1.5"
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? "var(--navy)" : "var(--ink-mid)",
                      zIndex: 1,
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="sort-pill-active"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "var(--surface)",
                          boxShadow:
                            "0 2px 6px rgba(11,25,87,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}
                    <span className="relative z-10">{SORT_LABELS[opt]}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3.5">
        {/* Status */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="label-meta w-14 shrink-0">Status</span>
          <div className="flex flex-wrap items-center gap-2">
            {BOOK_STATUSES.map((s) => {
              const active = filterStatus.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  className="chip"
                  aria-pressed={active}
                >
                  {STATUS_LABELS[s]}
                </button>
              );
            })}
            {filterStatus.length > 0 && (
              <button
                type="button"
                onClick={() => onFilterStatusChange([])}
                className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--ink-light)] hover:text-[var(--pink-soft)] transition-colors px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Genre */}
        {genreOptions.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="label-meta w-14 shrink-0">Genre</span>
            <div className="flex flex-wrap items-center gap-2">
              {genreOptions.map((g) => {
                const active = filterGenre.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className="chip capitalize"
                    aria-pressed={active}
                  >
                    {g}
                  </button>
                );
              })}
              {filterGenre.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterGenreChange([])}
                  className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--ink-light)] hover:text-[var(--pink-soft)] transition-colors px-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
