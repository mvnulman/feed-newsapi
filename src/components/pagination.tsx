"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-2 text-[var(--foreground)] hover:border-[var(--accent)] disabled:pointer-events-none disabled:opacity-40 transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] h-9 w-9 text-sm text-[var(--foreground)] hover:border-[var(--accent)] transition-all"
          >
            1
          </button>
          {start > 2 && (
            <span className="px-2 text-[var(--muted)]">…</span>
          )}
        </>
      )}

      {Array.from({ length: end - start + 1 }).map((_, i) => {
        const page = start + i;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-xl border text-sm font-medium transition-all ${
              page === currentPage
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)]"
            }`}
          >
            {page}
          </button>
        );
      })}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-2 text-[var(--muted)]">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] h-9 w-9 text-sm text-[var(--foreground)] hover:border-[var(--accent)] transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-2 text-[var(--foreground)] hover:border-[var(--accent)] disabled:pointer-events-none disabled:opacity-40 transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
