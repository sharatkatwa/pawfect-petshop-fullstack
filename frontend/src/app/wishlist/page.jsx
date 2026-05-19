"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addToCart } from "@/store/thunks/cartThunk";
import {
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/store/thunks/wishlistThunk";

const getProduct = (item) => item.product || {};

export default function WishlistPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    initialized,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);
  const { loading: cartLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!initialized || authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    dispatch(getWishlist());
  }, [authLoading, dispatch, initialized, isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading text-foreground md:px-8">
      <section className="mx-auto max-w-[1220px]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">
              Wishlist
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7">
              Products you saved for later.
            </p>
          </div>

          {!!items.length && (
            <Button
              type="button"
              variant="neutral"
              className="h-12 font-heading uppercase"
              disabled={loading}
              onClick={() => dispatch(clearWishlist())}
            >
              <Trash2 className="h-4 w-4" />
              Clear wishlist
            </Button>
          )}
        </div>

        {(!initialized || authLoading || (loading && !items.length)) ? (
          <div className="border-[4px] border-border bg-secondary-background p-8 text-center text-2xl font-black uppercase shadow-shadow">
            Loading wishlist...
          </div>
        ) : !items.length ? (
          <div className="border-[4px] border-border bg-secondary-background p-10 text-center shadow-shadow">
            <Heart className="mx-auto h-14 w-14" />
            <h2 className="mt-5 text-3xl font-black uppercase">
              No saved products
            </h2>
            <p className="mt-3 text-base">
              Tap the heart on a product to save it here.
            </p>
            <Button asChild className="mt-6 font-heading uppercase">
              <Link href="/shop">Browse shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const product = getProduct(item);
              const productId = product._id || item.product;
              const imageSrc =
                product.images?.[0] ||
                `https://placehold.co/500x500/png?text=${encodeURIComponent(product.productName || "Product")}`;
              const isUnavailable =
                product.status !== "available" || product.stock < 1;

              return (
                <Card
                  key={productId}
                  className="flex flex-col border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]"
                >
                  <Link href={`/shop/${productId}`}>
                    <Image
                      src={imageSrc}
                      alt={product.productName || "Product"}
                      width={600}
                      height={600}
                      className="h-64 w-full border-b-[4px] border-border object-cover"
                    />
                  </Link>
                  <CardHeader>
                    <CardTitle className="text-xl font-black uppercase leading-6">
                      {product.productName}
                    </CardTitle>
                    <p className="w-fit border-2 border-border bg-main px-3 py-1 text-sm">
                      Rs. {product.price}
                    </p>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <p className="text-sm uppercase">
                      {product.status || "available"}
                    </p>
                  </CardContent>
                  <CardFooter className="grid gap-3 border-t-[4px] border-border pt-5">
                    <Button
                      asChild
                      className="h-12 w-full font-heading uppercase"
                      disabled={isUnavailable}
                    >
                      <Link href={`/checkout?productId=${productId}&quantity=1`}>
                        <ShoppingBag className="h-4 w-4" />
                        Buy now
                      </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="neutral"
                        className="h-11 font-heading uppercase"
                        disabled={cartLoading || isUnavailable}
                        onClick={() =>
                          dispatch(addToCart({ productId, quantity: 1 }))
                        }
                      >
                        Add cart
                      </Button>
                      <Button
                        type="button"
                        variant="neutral"
                        className="h-11 font-heading uppercase"
                        disabled={loading}
                        onClick={() => dispatch(removeFromWishlist(productId))}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
