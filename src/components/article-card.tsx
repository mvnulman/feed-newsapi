"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock } from "lucide-react";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.pubDate), {
    addSuffix: true,
  });

  if (!article.title) return null;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex overflow-hidden rounded-lg border border-card-border bg-card transition-all duration-200 hover:border-accent hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      {article.image && (
        <div className="relative h-32 w-32 shrink-0 overflow-hidden bg-card-hover">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {/* Source + Time */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-white">
            {article.source.name}
          </span>
          <span className="flex items-center gap-1 text-muted">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors">
          {article.title}
        </h2>

        {/* Description */}
        {article.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted">
            {article.description}
          </p>
        )}
      </div>
    </a>
  );
}
