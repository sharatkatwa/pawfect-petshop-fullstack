import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filters = [
  { label: "Category", color: "bg-[var(--chart-2)]" },
  { label: "Price Range", color: "bg-[var(--chart-3)]" },
  { label: "Pet Type", color: "bg-main" },
];

export default function ShopControls() {
  return (
    <section className="mx-auto max-w-[1220px] px-5 py-12 md:px-8">
      <form className="grid gap-6 md:grid-cols-[1fr_160px]">
        <Input
          aria-label="Search shop"
          placeholder="SNIFF OUT SOMETHING NEW..."
          className="h-20 border-[4px] px-7 font-heading text-lg uppercase shadow-none placeholder:text-foreground/40"
        />
        <Button className="h-20 border-[4px] bg-foreground px-10 font-heading uppercase text-secondary-background">
          Go
        </Button>
      </form>

      <div className="mt-16 flex flex-col gap-6 border-[4px] border-border bg-secondary-background p-4 shadow-shadow lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-5">
          {filters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={`${filter.color} min-w-38 border-[4px] border-border px-5 py-3 text-left font-heading text-xs uppercase shadow-shadow`}
            >
              <span className="flex items-center justify-between gap-5">
                {filter.label}
                <span aria-hidden="true">⌄</span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex min-w-56 items-center justify-between gap-4 border-[4px] border-border bg-secondary-background px-5 py-3 font-heading text-xs uppercase shadow-shadow"
        >
          Sort by: Relevance
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
