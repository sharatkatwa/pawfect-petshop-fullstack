import ShopControls from "@/components/local/shop/ShopControls";
import ShopHero from "@/components/local/shop/ShopHero";
import ShopPagination from "@/components/local/shop/ShopPagination";
import ShopProductGrid from "@/components/local/shop/ShopProductGrid";

const ShopPage = () => {
  return (
    <main className="min-h-screen bg-background font-heading text-foreground">
      <ShopHero />
      <ShopControls />
      <ShopProductGrid />
      <ShopPagination />
    </main>
  );
};

export default ShopPage;
