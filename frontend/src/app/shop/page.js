"use client";
import ShopControls from "@/components/local/shop/ShopControls";
import ShopHero from "@/components/local/shop/ShopHero";
import ShopPagination from "@/components/local/shop/ShopPagination";
import ShopProductGrid from "@/components/local/shop/ShopProductGrid";
import { Spinner } from "@/components/ui/spinner";
import { getAllProducts } from "@/store/thunks/productThunk";
import { PackageOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShopPage = () => {
  const { products, total, page, totalPages, loading, error } = useSelector(
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
  const didMountRef = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      // document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      // document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }, [filters.page]);

  const handlePageChange = (nextPage) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

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
      <ShopPagination
        currentPage={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </main>
  );
};

export default ShopPage;
