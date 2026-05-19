"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/store/thunks/cartThunk";

const getProduct = (item) => item.product || {};

export default function CartMenu() {
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems, loading } = useSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="noShadow"
          aria-label="Open cart"
          className="relative h-11 w-11 bg-secondary-background"
        >
          <ShoppingCart className="h-6 w-6" strokeWidth={2.25} />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 grid min-h-6 min-w-6 place-items-center border-2 border-border bg-main px-1 font-heading text-xs font-black leading-none text-main-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full border-l-[4px] bg-secondary-background p-0 shadow-[-8px_0_0_0_var(--border)] sm:max-w-md">
        <SheetHeader className="border-b-[4px] border-border bg-main p-5">
          <SheetTitle className="font-heading text-3xl font-black uppercase">
            Cart
          </SheetTitle>
          <SheetDescription className="font-heading text-sm uppercase">
            {totalItems} item{totalItems === 1 ? "" : "s"} ready for checkout
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading && !items.length ? (
            <p className="border-[4px] border-border bg-background p-5 font-heading text-lg font-black uppercase shadow-shadow">
              Loading cart...
            </p>
          ) : !items.length ? (
            <div className="border-[4px] border-border bg-background p-6 shadow-shadow">
              <p className="font-heading text-2xl font-black uppercase">
                Your cart is empty
              </p>
              <p className="mt-3 text-sm leading-6">
                Add products from the shop and they will appear here.
              </p>
              <SheetClose asChild>
                <Button asChild className="mt-6 w-full font-heading uppercase">
                  <Link href="/shop">Shop Now</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const product = getProduct(item);
                const productId = product._id || item.product;
                const imageSrc =
                  product.images?.[0] ||
                  `https://placehold.co/200x200/png?text=${encodeURIComponent(product.productName || "Product")}`;

                return (
                  <article
                    key={productId}
                    className="grid grid-cols-[88px_1fr] gap-4 border-[4px] border-border bg-background p-3 shadow-shadow"
                  >
                    <Image
                      src={imageSrc}
                      alt={product.productName || "Cart product"}
                      width={120}
                      height={120}
                      className="h-20 w-20 border-[3px] border-border object-cover"
                    />

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-sm font-black uppercase leading-5">
                            {product.productName}
                          </h3>
                          <p className="mt-1 font-heading text-sm">
                            Rs. {item.price}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="noShadow"
                          aria-label={`Remove ${product.productName}`}
                          className="h-9 w-9 bg-secondary-background"
                          onClick={() => dispatch(removeCartItem(productId))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex h-10 items-center border-[3px] border-border bg-secondary-background">
                          <Button
                            type="button"
                            size="icon"
                            variant="noShadow"
                            className="h-9 w-9 border-0"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleQuantityChange(productId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-9 text-center font-heading text-sm font-black">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="noShadow"
                            className="h-9 w-9 border-0"
                            aria-label="Increase quantity"
                            onClick={() =>
                              handleQuantityChange(productId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-heading text-sm font-black">
                          Rs. {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <SheetFooter className="border-t-[4px] border-border bg-background p-5">
          <div className="flex items-center justify-between font-heading text-xl font-black uppercase">
            <span>Total</span>
            <span>Rs. {totalAmount}</span>
          </div>
          {items.length ? (
            <SheetClose asChild>
              <Button asChild className="h-12 w-full font-heading uppercase">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </SheetClose>
          ) : (
            <Button disabled className="h-12 w-full font-heading uppercase">
              Checkout
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
