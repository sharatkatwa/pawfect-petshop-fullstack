const { ShoppingCart } = require("lucide-react");
const { Button } = require("../ui/button");
const { Card, CardContent } = require("../ui/card");

export default function ProductCard({ name, price, image, tag }) {
  return (
    <Card className="gap-0 border-[3px] max-w-90 mx-auto bg-secondary-background py-0">
      <CardContent className="p-1.5">
        <div className="relative overflow-hidden border-[3px] border-border bg-white">
          {tag ? (
            <span className="absolute left-3 top-3 z-10 border-[2px] border-border bg-[var(--chart-3)] px-2 py-1 font-heading text-[10px] uppercase tracking-[0.16em] text-white">
              {tag}
            </span>
          ) : null}
          <img
            src={image}
            alt={name}
            className="h-64 w-full object-cover md:h-72"
          />
        </div>
        <div className="space-y-4 px-2 pb-2 pt-4">
          <h3 className="font-heading text-sm uppercase tracking-[0.12em] text-foreground">
            {name}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <span className="border-[2px] border-border bg-[var(--chart-1)] px-3 py-1 font-heading text-3xl leading-none text-foreground">
              {price}
            </span>
            <Button
              type="button"
              className="bg-foreground text-secondary-background h-12 w-12 "
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCart strokeWidth={2.25} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}