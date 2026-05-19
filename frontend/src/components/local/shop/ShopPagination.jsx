import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const getVisiblePages = (currentPage, totalPages) => {
  const pages = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 2);
  const adjustedStart = Math.max(1, end - 2);

  for (let page = adjustedStart; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

export default function ShopPagination({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Shop pagination"
      className="mx-auto flex max-w-[1220px] items-center justify-center gap-4 px-5 py-16 md:px-8"
    >
      <Button
        type="button"
        variant="neutral"
        size="icon"
        aria-label="Previous page"
        disabled={loading || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft strokeWidth={2.5} />
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          type="button"
          variant={page === currentPage ? "default" : "neutral"}
          className="h-12 w-16 font-heading"
          disabled={loading}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        type="button"
        variant="neutral"
        size="icon"
        aria-label="Next page"
        disabled={loading || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight strokeWidth={2.5} />
      </Button>
    </nav>
  );
}
