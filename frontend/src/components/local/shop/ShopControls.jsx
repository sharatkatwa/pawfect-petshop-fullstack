"use client";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

const filters = [
  { label: "Category", color: "bg-[var(--chart-2)]" },
  { label: "Price Range", color: "bg-[var(--chart-3)]" },
  { label: "Pet Type", color: "bg-main" },
];

export default function ShopControls({ filters, setFilters }) {
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchRef.current.value }));
  };

  return (
    <section className="mx-auto max-w-[1220px] px-5 py-12 md:px-8">
      <form
        onSubmit={handleSearch}
        className="grid gap-6 md:grid-cols-[1fr_160px]"
      >
        <Input
          ref={searchRef}
          // value={searchRef.current.value}
          aria-label="Search shop"
          name="search"
          placeholder="SNIFF OUT SOMETHING NEW..."
          className="h-20 border-[4px] px-7 font-heading text-lg uppercase shadow-none placeholder:text-foreground/40"
        />
        <Button className="h-20 border-[4px] bg-foreground px-10 font-heading uppercase text-secondary-background">
          Go
        </Button>
      </form>

      <div className="mt-16 flex flex-col gap-6 border-[4px] border-border bg-secondary-background p-4 shadow-shadow lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-5">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value, page: 1 }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="pet">Pet</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="toy">Toy</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => {
              const ranges = {
                "0-1000": { minPrice: 0, maxPrice: 1000 },
                "1000-2000": { minPrice: 1000, maxPrice: 2000 },
                "2000-5000": { minPrice: 2000, maxPrice: 5000 },
                "5000-10000": { minPrice: 5000, maxPrice: 10000 },
                "10000+": { minPrice: 10000, maxPrice: "" },
              };

              setFilters((prev) => ({
                ...prev,
                ...ranges[value],
                page: 1,
              }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Price Range</SelectLabel>
                <SelectItem value="0-1000">0 - 1000</SelectItem>
                <SelectItem value="1000-2000">1000 - 2000</SelectItem>
                <SelectItem value="2000-5000">2000 - 5000</SelectItem>
                <SelectItem value="5000-10000">5000 - 10000</SelectItem>
                <SelectItem value="10000+">above 10000</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {filters.search !== "" && (
            <Badge className={"bg-secondary"}>Search: {filters.search}</Badge>
          )}
        </div>

        <Button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              search: "",
              category: "",
              minPrice: "",
              maxPrice: "",
            }));
          }}
          variant={"neutral"}
        >
          Clear Filters <X />
        </Button>
        {/* <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} /> */}
      </div>
    </section>
  );
}
