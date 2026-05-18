import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShopProductCard({
  _id,
  productName,
  price,
  images,
  // badge,
  // badgeColor = "bg-[var(--chart-3)]",
  // swatches = [],
}) {
  const imageSrc =
    images?.[0] ||
    `https://placehold.co/800x600/png?text=${encodeURIComponent(productName || "Product")}`;

  return (
    <article className="flex min-h-[450px] flex-col border-[4px] border-border bg-secondary-background p-2 shadow-shadow">
      <Link href={`/shop/${_id}`} className="relative block border-b-[4px] border-border bg-main">
        {/* {badge ? (
          <span
            className={`absolute right-3 top-3 z-10 border-2 border-border ${badgeColor} px-2 py-1 font-heading text-[10px] uppercase leading-none text-foreground`}
          >
            {badge}
          </span>
        ) : null} */}
        <Image
          src={imageSrc}
          alt={productName}
          width={800}
          height={600}
          className="h-64 w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <Link
          href={`/shop/${_id}`}
          className="font-heading text-sm uppercase tracking-normal text-foreground"
        >
          {productName}
        </Link>
        <p className="mt-2 w-fit border-2 border-border bg-main px-3 py-1 font-heading text-sm leading-none text-foreground">
          ₹{price}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <div className="flex gap-1">
            {/* {swatches.map((swatch, index) => (
              <span
                key={`${name}-${index}`}
                className={`h-4 w-4 border border-border ${swatch}`}
                aria-hidden="true"
              />
            ))} */}
          </div>
          <Button
              type="button"
            size="icon"
            aria-label={`Add ${productName} to cart`}
            className="h-12 w-12 border-[4px] bg-foreground text-secondary-background"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </article>
  );
}
