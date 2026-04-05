export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--card)]"
        >
          {/* Thumbnail placeholder */}
          <div className="h-32 w-32 shrink-0 bg-[var(--card-hover)]" />
          {/* Content placeholder */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
            <div className="h-4 w-28 rounded-full bg-[var(--card-hover)]" />
            <div className="flex flex-col gap-1.5 pt-2">
              <div className="h-4 w-full rounded bg-[var(--card-hover)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--card-hover)]" />
            </div>
            <div className="pt-1">
              <div className="h-3 w-1/2 rounded bg-[var(--card-hover)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
