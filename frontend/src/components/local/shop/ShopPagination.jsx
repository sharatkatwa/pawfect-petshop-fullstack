import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShopPagination() {
  return (
    <nav
      aria-label="Shop pagination"
      className="mx-auto flex max-w-[1220px] items-center justify-center gap-4 px-5 py-16 md:px-8"
    >
      <Button variant="neutral" size="icon" aria-label="Previous page">
        <ChevronLeft strokeWidth={2.5} />
      </Button>
      {[1, 2, 3].map((page) => (
        <Button
          key={page}
          variant={page === 1 ? "default" : "neutral"}
          className="h-12 w-16 font-heading"
        >
          {page}
        </Button>
      ))}
      <Button variant="neutral" size="icon" aria-label="Next page">
        <ChevronRight strokeWidth={2.5} />
      </Button>
    </nav>
  );
}
