"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hooks/use-url-state";
import type { PageMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

function pageWindow(page: number, total: number) {
  const pages = new Set<number>([1, total, page - 1, page, page + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function Pagination({ meta }: { meta: PageMeta }) {
  const { setParams, isPending } = useUrlState();
  if (meta.total === 0) return null;
  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);
  const pages = pageWindow(meta.page, meta.totalPages);

  return (
    <nav aria-label="Pagination" className={cn("flex flex-col items-center justify-between gap-3 pt-4 sm:flex-row", isPending && "opacity-60")}>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground">{from}-{to}</span> of <span className="font-medium text-foreground">{meta.total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setParams({ page: meta.page - 1 })} aria-label="Previous page">
          <ChevronLeft /> Prev
        </Button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - (pages[i - 1] ?? 0) > 1 && <span className="px-1 text-muted-foreground">…</span>}
            <Button
              variant={p === meta.page ? "default" : "ghost"}
              size="sm"
              className="min-w-8 px-2"
              aria-current={p === meta.page ? "page" : undefined}
              onClick={() => setParams({ page: p })}
            >
              {p}
            </Button>
          </span>
        ))}
        <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setParams({ page: meta.page + 1 })} aria-label="Next page">
          Next <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
