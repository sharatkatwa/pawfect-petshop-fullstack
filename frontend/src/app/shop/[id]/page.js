"use client";

import ProductDetail from "@/components/local/shop/ProductDetail";
import ProductReviews from "@/components/local/shop/ProductReviews";
import { clearSingleProduct } from "@/store/features/productSlice";
import { getSingleProduct } from "@/store/thunks/productThunk";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id));
    }

    return () => {
      dispatch(clearSingleProduct());
    };
  }, [dispatch, id]);

  if (loading && !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background font-heading text-foreground">
        <p className="border-[4px] border-border bg-secondary-background px-6 py-4 text-xl font-black uppercase shadow-shadow">
          Loading product...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background font-heading text-foreground">
        <p className="border-[4px] border-border bg-secondary-background px-6 py-4 text-xl font-black uppercase shadow-shadow">
          {error}
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background font-heading text-foreground">
        <p className="border-[4px] border-border bg-secondary-background px-6 py-4 text-xl font-black uppercase shadow-shadow">
          Product not found
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background font-heading text-foreground">
      <ProductDetail product={product} />
      <ProductReviews reviews={[]} />
    </main>
  );
}
