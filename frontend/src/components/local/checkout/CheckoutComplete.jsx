"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutComplete({ orderId, onClose }) {
  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading text-foreground md:px-8">
      <section className="mx-auto max-w-[760px] border-[4px] border-border bg-secondary-background p-8 shadow-[8px_8px_0_0_var(--border)]">
        <p className="w-fit border-[4px] border-border bg-main px-4 py-2 text-sm font-black uppercase shadow-shadow">
          Order placed
        </p>
        <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-6xl">
          Checkout complete
        </h1>
        <p className="mt-5 text-lg leading-7">
          Your order has been created successfully. Order ID:
        </p>
        <p className="mt-3 break-all border-[3px] border-border bg-background p-3 font-heading text-sm">
          {orderId}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-12 font-heading uppercase"
            onClick={onClose}
          >
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button
            type="button"
            variant="neutral"
            className="h-12 font-heading uppercase"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </section>
    </main>
  );
}
