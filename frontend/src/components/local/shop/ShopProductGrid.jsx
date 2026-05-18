import ShopProductCard from "./ShopProductCard";
import { shopProducts } from "./shopData";

export default function ShopProductGrid({products}) {
  return (
    <section className="mx-auto max-w-[1220px] px-5 md:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ShopProductCard key={product._id} {...product} />
        ))}
      </div>
    </section>
  );
}
