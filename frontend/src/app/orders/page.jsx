"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeIndianRupee,
  CalendarDays,
  PackageOpen,
  ShoppingBag,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cancelOrder, getMyOrders } from "@/store/thunks/orderThunk";

const getProduct = (item) => item.product || {};
const canCancel = (status) => ["pending", "confirmed"].includes(status);

const formatDate = (date) => {
  if (!date) return "Unknown date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { initialized, isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth,
  );
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (!initialized || authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    dispatch(getMyOrders());
  }, [authLoading, dispatch, initialized, isAuthenticated, router]);

  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading text-foreground md:px-8">
      <section className="mx-auto max-w-[1220px]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">
              My Orders
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7">
              Track current orders and review your recent purchases.
            </p>
          </div>
          <Button asChild variant="neutral" className="h-12 font-heading uppercase">
            <Link href="/shop">
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </Button>
        </div>

        {(!initialized || authLoading || (loading && !orders.length)) ? (
          <div className="border-[4px] border-border bg-secondary-background p-8 text-center text-2xl font-black uppercase shadow-shadow">
            Loading orders...
          </div>
        ) : !orders.length ? (
          <div className="border-[4px] border-border bg-secondary-background p-10 text-center shadow-shadow">
            <PackageOpen className="mx-auto h-14 w-14" />
            <h2 className="mt-5 text-3xl font-black uppercase">
              No orders yet
            </h2>
            <p className="mt-3 text-base">Your orders will appear here.</p>
            <Button asChild className="mt-6 font-heading uppercase">
              <Link href="/shop">Shop now</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-7">
            {orders.map((order) => (
              <Card
                key={order._id}
                className="border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]"
              >
                <CardHeader className="border-b-[4px] border-border">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black uppercase">
                        Order #{order._id.slice(-8)}
                      </CardTitle>
                      <p className="mt-2 flex items-center gap-2 text-sm uppercase">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="font-heading uppercase">
                        {order.status}
                      </Badge>
                      <Badge variant="neutral" className="font-heading uppercase">
                        {order.paymentMethod}
                      </Badge>
                      <Badge variant="neutral" className="font-heading uppercase">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 pt-6">
                  {order.items.map((item) => {
                    const product = getProduct(item);
                    const productId = product._id || item.product;
                    const imageSrc =
                      product.images?.[0] ||
                      `https://placehold.co/160x160/png?text=${encodeURIComponent(product.productName || "Product")}`;

                    return (
                      <article
                        key={`${order._id}-${productId}`}
                        className="grid grid-cols-[72px_1fr] gap-4 border-[3px] border-border bg-background p-3 md:grid-cols-[80px_1fr_auto]"
                      >
                        <Image
                          src={imageSrc}
                          alt={product.productName || "Product"}
                          width={120}
                          height={120}
                          className="h-16 w-16 border-[3px] border-border object-cover md:h-20 md:w-20"
                        />
                        <div>
                          <h2 className="font-heading text-base font-black uppercase leading-5">
                            {product.productName}
                          </h2>
                          <p className="mt-2 text-sm">
                            Qty {item.quantity} x Rs. {item.price}
                          </p>
                        </div>
                        <p className="flex items-center gap-1 font-heading text-lg font-black md:justify-self-end">
                          <BadgeIndianRupee className="h-5 w-5" />
                          {item.quantity * item.price}
                        </p>
                      </article>
                    );
                  })}
                </CardContent>

                <CardFooter className="flex-col items-stretch gap-4 border-t-[4px] border-border pt-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase">Ship to</p>
                    <p className="mt-1 max-w-2xl text-sm leading-6">
                      {order.shippingAddress?.address}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <p className="flex items-center gap-1 text-2xl font-black uppercase">
                      Total <BadgeIndianRupee className="h-6 w-6" />
                      {order.totalAmount}
                    </p>
                    {canCancel(order.status) && (
                      <Button
                        type="button"
                        variant="neutral"
                        className="font-heading uppercase"
                        disabled={loading}
                        onClick={() => dispatch(cancelOrder(order._id))}
                      >
                        Cancel order
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
