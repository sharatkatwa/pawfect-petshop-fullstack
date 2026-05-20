"use client";
import { ArrowRight, Share2, ShoppingCart, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CategoryCard from "@/components/local/CategoryCard";
import SectionLabel from "@/components/local/SectionLabel";
import ProductCard from "@/components/local/ProductCard";
import FloatingElement from "@/components/local/FloatingElement";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/store/thunks/authThunk";
import { useEffect } from "react";
import { dispatch } from "@/store/store";
import Image from "next/image";

const categoryCards = [
  {
    title: "Dogs",
    subtitle: "For the loud barkers",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    color: "var(--chart-1)",
  },
  {
    title: "Cats",
    subtitle: "For the midnight zoomies",
    image:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
    color: "var(--chart-3)",
  },
  {
    title: "Others",
    subtitle: "For the weird & wonderful",
    image:
      "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=900&q=80",
    color: "var(--chart-2)",
  },
];

const arrivals = [
  {
    name: "Spiked Neon Collar",
    price: "$45.00",
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Organic Punk Treats",
    price: "$18.99",
    image:
      "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Graffiti Raincoat",
    price: "$62.00",
    tag: "Hot",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Steel Brutalist Bowl",
    price: "$29.00",
    image:
      "https://images.unsplash.com/photo-1511909525232-61113c912358?auto=format&fit=crop&w=900&q=80",
  },
];

function ZigZagDivider() {
  const points = Array.from({ length: 81 }, (_, index) => {
    const x = index * 20;
    const y = index % 2 === 0 ? 16 : 4;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      aria-hidden="true"
      className="block h-5 w-full"
      viewBox="0 0 1600 20"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="miter"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex-1 bg-background tracking-tight pt-10">
      {/* <div className="absolute inset-0 top-100"> */}
      <FloatingElement
        className={
          "h-20 w-20 animate-floatY rotate-20 bg-chart-3 absolute right-[15%] top-[50%] z-80 hidden lg:block"
        }
      />
      <FloatingElement
        className={
          "h-15 w-15 animate-floatY rounded-full rotate-0 bg-chart-1 absolute right-[10%] top-[20%] z-80 hidden lg:block"
        }
      />
      <FloatingElement
        className={
          "h-25 w-25 animate-floatY  rotate-0 bg-chart-1 absolute right-[10%] top-[70%] z-80 hidden lg:block"
        }
      />
      <FloatingElement
        className={
          "h-15 w-15 animate-floatY rounded-full rotate-0 bg-chart-2 absolute right-[47%] top-[35%] z-80 hidden lg:block"
        }
      />
      {/* </div> */}
      <section className="border-b-[3px] border-border bg-chart-2">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1400px] gap-14 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-16 lg:py-24">
          <div className="max-w-xl space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 font-heading text-sm uppercase tracking-[0.14em]">
                <span>Badass gear for</span>
                <span className="border-[3px] border-border bg-[var(--chart-1)] px-4 py-1 shadow-shadow">
                  Cool pets
                </span>
              </div>
              <h1 className="max-w-lg font-heading font-bold tracking-tighter text-5xl uppercase leading-[0.9] text-foreground sm:text-6xl xl:text-7xl">
                Pet gear with punk energy.
              </h1>
              <p className="max-w-md text-base leading-8 text-foreground sm:text-lg">
                Ditch the boring beige. Give your companion the edge they
                deserve with our hand-picked collection of neobrutalist pet
                essentials.
              </p>
            </div>
            <Button
              onClick={() => router.push("/shop")}
              className="h-auto border-[3px] bg-[var(--chart-3)] px-8 py-5 font-heading text-2xl uppercase text-black hover:bg-[var(--chart-3)]"
            >
              Shop the drop
            </Button>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute inset-x-6 bottom-[-15px] top-8 rotate-[3deg] border-5 border-border bg-chart-3" />
            <div className="relative rotate-2 border-5 bg-[var(--chart-1)] hover:-rotate-2 transition-all">
              <div className="absolute right-[-22px] top-5 -rotate-12 border-[3px] border-border bg-[var(--chart-1)] px-5 py-3 font-heading text-sm uppercase shadow-shadow sm:text-base">
                100% punk
              </div>
              <div className=" bg-main flex min-h-[460px] items-end justify-center overflow-hidden p-6 sm:min-h-[540px] ">
                <Image
                  width={1000}
                  height={1000}
                  src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=80"
                  alt="Cool dog wearing bright glasses"
                  className="max-h-[520px] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-[3px] border-border bg-secondary-background">
        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10 lg:px-16">
          <SectionLabel eyebrow="Browse crews" title="" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((card) => (
              <CategoryCard key={card.title} {...card} />
            ))}
          </div>
        </div>
        <ZigZagDivider />
      </section>

      <section className="border-b-[3px] border-border bg-[#faf7ef]">
        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10 lg:px-16">
          <SectionLabel
            eyebrow="New arrivals"
            title="Fresh from the underground"
            action={
              <Button
                onClick={() => {
                  router.push("/shop");
                }}
                className="h-auto border-[3px] bg-secondary-background px-6 py-3 font-heading uppercase text-foreground"
              >
                View all
              </Button>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {arrivals.map((item) => (
              <ProductCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className=" border-border bg-[var(--chart-1)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div className="max-w-xl space-y-4">
            <p className="font-heading text-2xl uppercase">Join the pack</p>
            <p className="max-w-lg font-heading text-lg uppercase leading-8 text-foreground">
              Get exclusive drops, pet anarchy news, and 10% off your first
              order.
            </p>
          </div>
          <form className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="EMAIL@YOURPET.COM"
              className="h-14 flex-1 border-[3px] border-border bg-secondary-background px-5 font-heading text-sm uppercase tracking-[0.1em] outline-none placeholder:text-neutral-500"
            />
            <Button
              type="submit"
              className="h-14  bg-foreground px-8 font-heading font-bold text-sm uppercase text-secondary-background"
            >
              Go
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
