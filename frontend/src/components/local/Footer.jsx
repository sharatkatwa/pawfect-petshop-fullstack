import { Globe, Link, Mail, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// function WaveDivider() {
//   return (
//     <div
//       aria-hidden="true"
//       className="h-5 border-b-[4px] border-border bg-repeat-x"
//       style={{
//         backgroundImage:
//           "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='18' viewBox='0 0 96 18'%3E%3Cpath d='M0 9 C8 1 16 1 24 9 S40 17 48 9 S64 1 72 9 S88 17 96 9' fill='none' stroke='black' stroke-width='3'/%3E%3C/svg%3E\")",
//       }}
//     />
//   );
// }

export default function Footer() {
  return (
    <footer className="bg-[var(--chart-1)] border-t-[3px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div className="space-y-2">
            <img
              src="/logo.png"
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
            <Link href="#">Contact</Link>
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
