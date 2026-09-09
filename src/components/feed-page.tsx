"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { ArticleCard } from "@/components/article-card";
import { Header } from "@/components/header";
import { SourceFilter } from "@/components/source-filter";
import { Pagination } from "@/components/pagination";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { Article } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ARTICLES_PER_PAGE = 12;

export function FeedPage() {
  const { data, isLoading, isValidating, mutate, error } = useSWR("/api/feed", fetcher, {
    refreshInterval: 300000, // 5 min
    revalidateOnFocus: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const articles = useMemo<Article[]>(() => data?.articles || [], [data]);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (activeSource) {
      result = result.filter((a) => a.source.slug === activeSource);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          (a.description?.toLowerCase() || "").includes(query)
      );
    }

    return result;
  }, [articles, activeSource, searchQuery]);

  const handleSourceChange = (v: string | null) => {
    setActiveSource(v);
    setCurrentPage(1);
  };

  // Count articles per source
  const counts = useMemo(() => {
    const c: Record<string, number> = { total: articles.length };
    articles.forEach((a) => {
      c[a.source.slug] = (c[a.source.slug] || 0) + 1;
    });
    return c;
  }, [articles]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header searchQuery={searchQuery} onSearchChange={(v) => {
        setSearchQuery(v);
        setCurrentPage(1);
      }} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            {isLoading ? (
              <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-24 animate-pulse rounded-full bg-card-hover"
                  />
                ))}
              </div>
            ) : (
              <SourceFilter
                activeSource={activeSource}
                onSourceChange={handleSourceChange}
                counts={counts}
              />
            )}
            <button
              onClick={() => mutate()}
              disabled={isValidating}
              className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)]/40 disabled:opacity-50 transition-all"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
            <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
              Failed to load feeds
            </h2>
            <p className="text-sm text-[var(--muted)]">
              {error.message || "Something went wrong. Try refreshing."}
            </p>
          </div>
        ) : filteredArticles.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-[var(--foreground)]">No articles found</p>
            <p className="text-sm text-[var(--muted)]">
              Try a different search or source filter.
            </p>
          </div>
        ) : (
          <>
            {!isLoading && paginatedArticles.length > 0 && (
              <p className="mb-4 text-sm text-[var(--muted)]">
                Showing {paginatedArticles.length} of {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
              </p>
            )}
            <div
              className={`flex flex-col gap-3 transition-opacity duration-200 ${
                isValidating ? "opacity-60" : "opacity-100"
              }`}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex animate-pulse overflow-hidden rounded-lg border border-card-border bg-card"
                  >
                    <div className="h-32 w-32 shrink-0 bg-card-hover" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                      <div className="h-4 w-28 rounded-full bg-card-hover" />
                      <div className="flex flex-col gap-1.5 pt-2">
                        <div className="h-4 w-full rounded bg-card-hover" />
                        <div className="h-4 w-3/4 rounded bg-card-hover" />
                      </div>
                      <div className="pt-1">
                        <div className="h-3 w-1/2 rounded bg-card-hover" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                paginatedArticles.map((article, i) => (
                  <ArticleCard key={`${article.link}-${i}`} article={article} />
                ))
              )}
            </div>
            {!isLoading && <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />}
          </>
        )}
      </main>
    </div>
  );
}
