"use client";
import ShopControls from "@/components/local/shop/ShopControls";
import ShopHero from "@/components/local/shop/ShopHero";
import ShopPagination from "@/components/local/shop/ShopPagination";
import ShopProductGrid from "@/components/local/shop/ShopProductGrid";
import { Spinner } from "@/components/ui/spinner";
import { getAllProducts } from "@/store/thunks/productThunk";
import { PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShopPage = () => {
  const { products, total, loading, error } = useSelector(
    (state) => state.product,
  );

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 8,
  });
  useEffect(() => {
    console.log(
      "Products",
      products,
      "total",
      total,
      "loading",
      loading,
      "error",
      error,
    );
  }, [products]);

  const dispatch = useDispatch();
  console.log(filters);
  useEffect(() => {
    dispatch(getAllProducts(filters));
  }, [dispatch, filters]);

  const LoadProdcuts = (
    <>
      {loading ? (
        <Spinner className={"size-30 mx-auto"} />
      ) : total ? (
        <ShopProductGrid products={products} />
      ) : (
        <div className="text-3xl  px-auto w-full flex items-center justify-center gap-5 text">
          <PackageOpen size={40} /> <p>No products available </p>
        </div>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-background font-heading text-foreground">
      <ShopHero />
      <ShopControls filters={filters} setFilters={setFilters} />
      {/* <LoadProdcuts /> */}
      {LoadProdcuts}
      <ShopPagination />
    </main>
  );
};

export default ShopPage;
