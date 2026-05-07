import { ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

function TriangleTrim() {
  return (
    <div
      aria-hidden="true"
      className="h-5 bg-repeat-x "
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='20' viewBox='0 0 56 20'%3E%3Cpath d='M0 0 L28 20 L56 0 Z' fill='black'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function DetailList({ title, items }) {
  return (
    <section className=" border-border pt-6">
      <h2 className="border-b-[4px] border-border pb-3 font-heading text-2xl font-black uppercase md:text-3xl">
        {title}
      </h2>
      <ul className="mt-4 space-y-2 font-heading text-sm uppercase leading-6 md:text-base">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ProductDetail({ product }) {
  return (
    <section className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div className="space-y-3">
        <div className="border-[4px] border-border bg-secondary-background p-0 shadow-[8px_8px_0_0_var(--border)]">
          <img
            src={product.detailImage}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>
        <TriangleTrim />
      </div>

      <div className="flex flex-col">
        <h1 className="max-w-2xl font-heading text-5xl font-black uppercase leading-[0.95] tracking-normal md:text-7xl">
          {product.name}
        </h1>
        <p className="mt-5 w-fit border-[4px] border-border bg-main px-5 py-3 font-heading text-2xl font-black leading-none shadow-shadow">
          {product.price}
        </p>
        <p className="mt-8 max-w-2xl text-xl leading-8 md:text-2xl">
          {product.description}
        </p>

        <div className="mt-10">
          <label className="font-heading text-sm uppercase" htmlFor="product-size">
            Size
          </label>
          <div className="relative mt-3">
            <select
              id="product-size"
              className="h-16 w-full appearance-none border-[4px] border-border bg-secondary-background px-5 pr-12 font-heading text-base uppercase outline-none"
              defaultValue={product.sizes[0]}
            >
              {product.sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2"
              strokeWidth={2.5}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="font-heading text-sm uppercase">Color</p>
          <div className="mt-3 flex gap-4">
            {product.colors.map((color, index) => (
              <button
                key={`${product.id}-color-${index}`}
                type="button"
                aria-label={`Select color ${index + 1}`}
                className={`h-12 w-12 border-[4px] border-border ${color} shadow-[5px_5px_0_0_var(--border)] ${
                  index === product.selectedColor ? "outline-4 outline-main" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <Button className="mt-12 h-22 w-full border-[4px] px-8 font-heading text-2xl font-black uppercase shadow-[8px_8px_0_0_var(--border)]">
          <ShoppingBag className="h-7 w-7" strokeWidth={2.75} />
          Add to Bag
        </Button>

        <div className="mt-24 grid gap-8 border-t-[4px] border-border pt-0 md:grid-cols-2">
          <DetailList title="Specs" items={product.specs} />
          <DetailList title="Shipping" items={product.shipping} />
        </div>
      </div>
    </section>
  );
}
