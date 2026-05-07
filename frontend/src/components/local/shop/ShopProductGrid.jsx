import ShopProductCard from "./ShopProductCard";
import { shopProducts } from "./shopData";

export default function ShopProductGrid() {
  return (
    <section className="mx-auto max-w-[1220px] px-5 md:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shopProducts.map((product) => (
          <ShopProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}
