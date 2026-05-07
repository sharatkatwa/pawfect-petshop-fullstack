import { notFound } from "next/navigation";
import ProductDetail from "@/components/local/shop/ProductDetail";
import ProductReviews from "@/components/local/shop/ProductReviews";
import { getShopProductById, shopProducts } from "@/components/local/shop/shopData";

export function generateStaticParams() {
  return shopProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getShopProductById(id);

  if (!product) {
    return {
      title: "Product not found | Petpunk",
    };
  }

  return {
    title: `${product.name} | Petpunk`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const product = getShopProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background font-heading text-foreground">
      <ProductDetail product={product} />
      <ProductReviews reviews={product.reviews} />
    </main>
  );
}
