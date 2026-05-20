import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function CategoryCard({ title, subtitle, image, color }) {
  return (
    <Card
      className=" max-w-90 w-full mx-auto gap-0 border-[3px] py-0 group hover:scale-[1.02] hover:rotate-1 transition-all"
      style={{ backgroundColor: color }}
    >
      <CardContent className="space-y-5 p-6">
        <div className="overflow-hidden border-[3px] border-border bg-black ">
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover sm:h-60 group-hover:scale-102 transition-all duration-300"
          />
        </div>
        <div className="space-y-2 font-heading uppercase">
          <p className="text-base">{title}</p>
          <p className="text-lg leading-tight sm:text-xl">{subtitle}</p>
        </div>
        <ArrowRight className="h-8 w-8 group-hover:ml-3 transition-all" strokeWidth={2.25} />
      </CardContent>
    </Card>
  );
}