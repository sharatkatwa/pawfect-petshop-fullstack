import { Globe, Mail, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";



export default function Footer() {
  return (
    <footer className="bg-[var(--chart-1)] border-t-[3px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div className="space-y-2">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="Petpunk"
              className="h-auto w-28 object-contain"
            />
            <p className="font-heading text-xs uppercase tracking-[0.08em] text-foreground">
              © 2024 Petpunk. Unapologetically loud.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 font-heading text-sm uppercase tracking-[0.1em] text-foreground">
            <Link href="#" className="border-r-[3px] border-border pr-4">
              Privacy
            </Link>
            <Link href="#" className="border-r-[3px] border-border pr-4">
              Terms
            </Link>
            <Link href="#" className="border-r-[3px] border-border pr-4">
              Shipping
            </Link>
            <Link href="#" className="border-r-[3px] border-border pr-4">
              Returns
            </Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="flex h-12 w-12 i bg-black text-white "
              aria-label="Share site"
            >
              <Share2 className="h-5 w-5" strokeWidth={2.25} />
            </Button>
            <Button
              type="button"
              className="flex h-12 w-12 items-center justify-center border-[3px] border-border bg-black text-white shadow-shadow"
              aria-label="Like site"
            >
              <ThumbsUp className="h-5 w-5" strokeWidth={2.25} />
            </Button>
          </div>
        </div>
      </footer>
  );
}
