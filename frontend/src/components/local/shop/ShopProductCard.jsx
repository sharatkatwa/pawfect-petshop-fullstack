"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/store/thunks/cartThunk";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function ShopProductCard({
  _id,
  productName,
  price,
  images,
  stock,
  status,
  // badge,
  // badgeColor = "bg-[var(--chart-3)]",
  // swatches = [],
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.cart);

  const imageSrc =
    images?.[0] ||
    `https://placehold.co/800x600/png?text=${encodeURIComponent(productName || "Product")}`;
  const isUnavailable = status !== "available" || stock < 1;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Login to add products to cart", { position: "top-center" });
      router.push("/auth/login");
      return;
    }

    dispatch(addToCart({ productId: _id, quantity: 1 }));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Login to checkout products", { position: "top-center" });
      router.push("/auth/login");
      return;
    }

    router.push(`/checkout?productId=${_id}&quantity=1`);
  };

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
        
          <div className="w-full flex items-center justify-between gap-2">
            <Button
              type="button"
              size="sm"
              aria-label={`Buy ${productName} now`}
              className="h-12 w-full px-3 font-heading text-xs font-black uppercase"
              disabled={isUnavailable}
              onClick={handleBuyNow}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
              Buy now
            </Button>
            <Button
              type="button"
              size="icon"
              aria-label={`Add ${productName} to cart`}
              className="h-12 w-20  bg-foreground text-secondary-background"
              disabled={loading || isUnavailable}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
