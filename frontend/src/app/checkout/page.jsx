"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeIndianRupee, CreditCard, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCart } from "@/store/thunks/cartThunk";
import {
  checkoutFromCart,
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/store/thunks/orderThunk";
import { clearLatestOrder } from "@/store/features/orderSlice";
import CheckoutComplete from "@/components/local/checkout/CheckoutComplete";
import { getSingleProduct } from "@/store/thunks/productThunk";
import { clearSingleProduct } from "@/store/features/productSlice";

const getProduct = (item) => item.product || {};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // If productId exists in the URL, this page works as "Buy Now" checkout.
  // Without productId, it uses the normal cart checkout flow.
  const productId = searchParams.get("productId");
  const quantity = Math.max(Number(searchParams.get("quantity") || 1), 1);
  const isDirectCheckout = Boolean(productId);
  const {
    initialized,
    isAuthenticated,
    loading: authLoading,
    user,
  } = useSelector((state) => state.auth);
  const {
    items,
    totalAmount,
    loading: cartLoading,
  } = useSelector((state) => state.cart);
  const { product: directProduct, loading: productLoading } = useSelector(
    (state) => state.product,
  );
  const { checkoutLoading, latestOrder } = useSelector((state) => state.order);
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      house: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      paymentMethod: "cod",
    },
  });
  const paymentMethod = useWatch({
    control,
    name: "paymentMethod",
  });
  const directProductReady = directProduct?._id === productId;
  const directTotalAmount = directProductReady ? directProduct.price * quantity : 0;
  const isOrderEmpty = isDirectCheckout ? !directProductReady : !items.length;

  useEffect(() => {
    if (!initialized || authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Direct checkout needs only one product; cart checkout needs the full cart.
    if (isDirectCheckout) {
      dispatch(getSingleProduct(productId));
      return () => {
        dispatch(clearSingleProduct());
      };
    }

    dispatch(getCart());

    return () => {
      dispatch(clearSingleProduct());
    };
  }, [
    authLoading,
    dispatch,
    initialized,
    isAuthenticated,
    isDirectCheckout,
    productId,
    router,
  ]);

  useEffect(() => {
    if (!latestOrder || isDirectCheckout) return;

    dispatch(getCart());
  }, [dispatch, isDirectCheckout, latestOrder]);

  useEffect(() => {
    if (user?.name) setValue("fullName", user.name);
    if (user?.phone) setValue("phone", user.phone);
  }, [setValue, user]);

  const onSubmit = async (data) => {
    if (isDirectCheckout && !directProductReady) {
      toast.error("Product is not ready for checkout", {
        position: "top-center",
      });
      return;
    }

    if (!isDirectCheckout && !items.length) {
      toast.error("Your cart is empty", { position: "top-center" });
      return;
    }

    // Backend expects one address string, so separate form fields are joined here.
    const combinedAddress = [
      data.fullName.trim(),
      data.house.trim(),
      data.city.trim(),
      data.state.trim(),
      data.country.trim(),
      `Pincode: ${data.pincode.trim()}`,
    ].join(", ");

    const orderPayload = {
      paymentMethod: data.paymentMethod,
      shippingAddress: {
        phone: data.phone.trim(),
        address: combinedAddress,
      },
    };

    if (data.paymentMethod === "razorpay") {
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!key) {
        toast.error("Razorpay key is missing in frontend env", {
          position: "top-center",
        });
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Unable to load Razorpay checkout", {
          position: "top-center",
        });
        return;
      }

      const razorpayPayload = {
        source: isDirectCheckout ? "direct" : "cart",
        shippingAddress: orderPayload.shippingAddress,
        ...(isDirectCheckout ? { productId, quantity } : {}),
      };
      const result = await dispatch(createRazorpayOrder(razorpayPayload));

      if (!createRazorpayOrder.fulfilled.match(result)) return;

      const { razorpayOrder } = result.payload;
      const razorpay = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Pawfect",
        description: isDirectCheckout
          ? directProduct.productName
          : "Pet shop cart order",
        order_id: razorpayOrder.id,
        prefill: {
          name: data.fullName.trim(),
          email: user?.email || "",
          contact: data.phone.trim(),
        },
        notes: {
          source: razorpayPayload.source,
        },
        theme: {
          color: "#000000",
        },
        handler: (response) => {
          dispatch(
            verifyRazorpayPayment({
              ...razorpayPayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          );
        },
        modal: {
          ondismiss: () => {
            toast.info("Razorpay payment was cancelled", {
              position: "top-center",
            });
          },
        },
      });

      razorpay.open();
      return;
    }

    // Buy Now calls createOrder directly. Cart checkout calls checkoutFromCart.
    if (isDirectCheckout) {
      dispatch(
        createOrder({
          ...orderPayload,
          productId,
          quantity,
        }),
      );
      return;
    }

    dispatch(
      checkoutFromCart({
        ...orderPayload,
      }),
    );
  };

  if (latestOrder) {
    return (
      <CheckoutComplete
        orderId={latestOrder._id}
        onClose={() => {
          dispatch(clearLatestOrder());
          router.push("/");
          return;
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading text-foreground md:px-8"> 
      <div className="mx-auto max-w-[1220px]">
        <Button
          asChild
          variant="neutral"
          className="mb-8 font-heading uppercase"
        >
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
        </Button>

        <div className="mb-10">
          <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">
            {isDirectCheckout ? "Buy Now" : "Checkout"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7">
            Confirm your delivery details and place your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-8 lg:grid-cols-[1fr_420px]"
        >
          <Card className="border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
            <CardHeader className="border-b-[4px] border-border">
              <CardTitle className="flex items-center gap-3 text-3xl font-black uppercase">
                <MapPin className="h-7 w-7" />
                Shipping
              </CardTitle>
              <CardDescription className="font-heading uppercase">
                Where should the order go?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="uppercase">
                  Full name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Your name"
                  className="h-14 border-[4px] px-4 font-heading text-base"
                  {...register("fullName", {
                    required: "Full name is required",
                    validate: (value) =>
                      value.trim().length >= 2 ||
                      "Full name must be at least 2 characters",
                  })}
                />
                {errors.fullName && (
                  <p className="text-sm font-heading text-[var(--chart-3)]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="uppercase">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  className="h-14 border-[4px] px-4 font-heading text-base"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10 digit phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-sm font-heading text-[var(--chart-3)]">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="house" className="uppercase">
                  House / street
                </Label>
                <textarea
                  id="house"
                  placeholder="House no, street, landmark"
                  rows={5}
                  className="flex w-full resize-none rounded-base border-[4px] border-border bg-secondary-background px-4 py-3 font-heading text-base text-foreground selection:bg-main selection:text-main-foreground placeholder:text-foreground/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("house", {
                    required: "House or street address is required",
                    validate: (value) =>
                      value.trim().length >= 5 ||
                      "Address must be at least 5 characters",
                  })}
                />
                {errors.house && (
                  <p className="text-sm font-heading text-[var(--chart-3)]">
                    {errors.house.message}
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="city" className="uppercase">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Ahmedabad"
                    className="h-14 border-[4px] px-4 font-heading text-base"
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  {errors.city && (
                    <p className="text-sm font-heading text-[var(--chart-3)]">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state" className="uppercase">
                    State
                  </Label>
                  <Input
                    id="state"
                    placeholder="Gujarat"
                    className="h-14 border-[4px] px-4 font-heading text-base"
                    {...register("state", {
                      required: "State is required",
                    })}
                  />
                  {errors.state && (
                    <p className="text-sm font-heading text-[var(--chart-3)]">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="country" className="uppercase">
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="India"
                    className="h-14 border-[4px] px-4 font-heading text-base"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  />
                  {errors.country && (
                    <p className="text-sm font-heading text-[var(--chart-3)]">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pincode" className="uppercase">
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    placeholder="380001"
                    className="h-14 border-[4px] px-4 font-heading text-base"
                    {...register("pincode", {
                      required: "Pincode is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Enter a valid 6 digit pincode",
                      },
                    })}
                  />
                  {errors.pincode && (
                    <p className="text-sm font-heading text-[var(--chart-3)]">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
              <CardHeader className="border-b-[4px] border-border">
                <CardTitle className="flex items-center gap-3 text-3xl font-black uppercase">
                  <CreditCard className="h-7 w-7" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setValue("paymentMethod", value)}
                >
                  <SelectTrigger className="h-14 border-[4px] font-heading uppercase">
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on delivery</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                  </SelectContent>
                </Select>
                {paymentMethod === "razorpay" && (
                  <p className="mt-4 border-[3px] border-border bg-main p-3 text-sm uppercase">
                    You will be redirected to Razorpay secure checkout.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
              <CardHeader className="border-b-[4px] border-border">
                <CardTitle className="text-3xl font-black uppercase">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {(isDirectCheckout ? productLoading : cartLoading) && isOrderEmpty ? (
                  <p className="font-heading uppercase">
                    {isDirectCheckout ? "Loading product..." : "Loading cart..."}
                  </p>
                ) : isDirectCheckout && directProductReady ? (
                  <article className="grid grid-cols-[72px_1fr] gap-4 border-[3px] border-border bg-background p-3">
                    <Image
                      src={
                        directProduct.images?.[0] ||
                        `https://placehold.co/160x160/png?text=${encodeURIComponent(directProduct.productName || "Product")}`
                      }
                      alt={directProduct.productName || "Product"}
                      width={100}
                      height={100}
                      className="h-16 w-16 border-[3px] border-border object-cover"
                    />
                    <div>
                      <h2 className="font-heading text-sm font-black uppercase leading-5">
                        {directProduct.productName}
                      </h2>
                      <p className="mt-2 text-sm">
                        Qty {quantity} x Rs. {directProduct.price}
                      </p>
                    </div>
                  </article>
                ) : !isDirectCheckout && !items.length ? (
                  <div className="border-[4px] border-border bg-background p-4">
                    <p className="font-heading text-xl font-black uppercase">
                      Your cart is empty
                    </p>
                    <Button
                      asChild
                      className="mt-4 w-full font-heading uppercase"
                    >
                      <Link href="/shop">Shop products</Link>
                    </Button>
                  </div>
                ) : isDirectCheckout ? (
                  <div className="border-[4px] border-border bg-background p-4">
                    <p className="font-heading text-xl font-black uppercase">
                      Product not found
                    </p>
                    <Button
                      asChild
                      className="mt-4 w-full font-heading uppercase"
                    >
                      <Link href="/shop">Back to shop</Link>
                    </Button>
                  </div>
                ) : (
                  items.map((item) => {
                    const product = getProduct(item);
                    const productId = product._id || item.product;
                    const imageSrc =
                      product.images?.[0] ||
                      `https://placehold.co/160x160/png?text=${encodeURIComponent(product.productName || "Product")}`;

                    return (
                      <article
                        key={productId}
                        className="grid grid-cols-[72px_1fr] gap-4 border-[3px] border-border bg-background p-3"
                      >
                        <Image
                          src={imageSrc}
                          alt={product.productName || "Product"}
                          width={100}
                          height={100}
                          className="h-16 w-16 border-[3px] border-border object-cover"
                        />
                        <div>
                          <h2 className="font-heading text-sm font-black uppercase leading-5">
                            {product.productName}
                          </h2>
                          <p className="mt-2 text-sm">
                            Qty {item.quantity} x Rs. {item.price}
                          </p>
                        </div>
                      </article>
                    );
                  })
                )}
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4 border-t-[4px] border-border pt-6">
                <div className="flex items-center justify-between text-2xl font-black uppercase">
                  <span>Total</span>
                  <span className="flex items-center gap-1">
                    <BadgeIndianRupee className="h-6 w-6" />
                    {isDirectCheckout ? directTotalAmount : totalAmount}
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={isOrderEmpty || checkoutLoading}
                  className="h-14 w-full border-[4px] font-heading text-lg font-black uppercase"
                >
                  {checkoutLoading ? "Placing order..." : "Place order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
}
