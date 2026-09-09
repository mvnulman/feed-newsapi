"use client";

import useSWR from "swr";
import { ArticleCard } from "@/components/article-card";
import { Header } from "@/components/header";
import { Pagination } from "@/components/pagination";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { sources } from "@/lib/sources";
import { ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { Article } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ARTICLES_PER_PAGE = 12;

export function SourcePage({ slug }: { slug: string }) {
  const { data, isLoading, error } = useSWR(`/api/feed?source=${slug}`, fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const source = sources.find((s) => s.slug === slug);

  const articles = useMemo<Article[]>(() => data?.articles || [], [data]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const query = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        (a.description?.toLowerCase() || "").includes(query)
    );
  }, [articles, searchQuery]);

  // Reset page on search
  const handleSearch = (v: string) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Source Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to all feeds
          </Link>
          {source && (
            <div className="flex items-center gap-3">
              <span className="text-3xl">{source.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{source.name}</h1>
                <p className="text-sm text-[var(--muted)]">
                  {articles.length} articles loaded
                </p>
              </div>
            </div>
          )}
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Failed to load feed</h2>
          </div>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[var(--muted)]">No articles found.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[var(--muted)]">
              Showing {paginatedArticles.length} of {filteredArticles.length} articles
            </p>
            <div className="flex flex-col gap-3">
              {paginatedArticles.map((article, i) => (
                <ArticleCard key={`${article.link}-${i}`} article={article} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
