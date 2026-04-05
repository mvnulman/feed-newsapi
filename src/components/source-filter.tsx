"use client";

import { sources } from "@/lib/sources";

interface SourceFilterProps {
  activeSource: string | null;
  onSourceChange: (source: string | null) => void;
  counts?: Record<string, number>;
}

export function SourceFilter({
  activeSource,
  onSourceChange,
  counts,
}: SourceFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSourceChange(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          activeSource === null
            ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/25"
            : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--accent)]/40"
        }`}
      >
        All {counts && <span className="ml-1 opacity-60">({counts.total})</span>}
      </button>
      {sources.map((source) => {
        const count = counts?.[source.slug];
        if (!count || count === 0) return null;
        return (
          <button
            key={source.slug}
            onClick={() => onSourceChange(source.slug)}
            className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeSource === source.slug
                ? "!text-white shadow-md"
                : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--accent)]/40"
            }`}
            style={
              activeSource === source.slug
                ? { backgroundColor: source.color, boxShadow: `0 4px 14px ${source.color}40` }
                : undefined
            }
          >
            <span>{source.icon}</span>
            <span>{source.name}</span>
            {count !== undefined && (
              <span className="opacity-60">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
