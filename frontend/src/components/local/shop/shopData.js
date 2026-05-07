export const shopProducts = [
  {
    id: "cyberpunk-collar",
    name: "Cyberpunk Collar",
    price: "$89.00",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1567612529009-afe5a2f765ce?auto=format&fit=crop&w=700&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1567612529009-afe5a2f765ce?auto=format&fit=crop&w=1200&q=90",
    description:
      "Built for the rebels. Genuine leather with spiked studs and a heavy-duty chrome buckle.",
    sizes: ['Small (10"-14")', 'Medium (14"-18")', 'Large (18"-22")'],
    colors: [
      "bg-[var(--chart-3)]",
      "bg-foreground",
      "bg-[var(--chart-4)]",
    ],
    selectedColor: 1,
    specs: [
      "Full-grain leather",
      "Nickel-plated studs",
      "D-ring for lead",
      "Reinforced stitching",
    ],
    shipping: ["Ships in 2-3 days.", "Express delivery available.", "Free over $100."],
    reviews: [
      {
        title: "Spike is a beast",
        body: "My pitbull looks like he's ready for a neon street race. The quality is insane!",
        author: "Max V.",
      },
      {
        title: "Heavy but cool",
        body: "A bit heavier than expected, but it stands out in the park. Absolute unit of a collar.",
        author: "Sarah K.",
      },
      {
        title: "Perfection",
        body: "Finally a brand that gets pet style isn't just about soft colors and paws.",
        author: "Riley J.",
      },
    ],
    swatches: ["bg-foreground", "bg-[var(--chart-3)]"],
  },
  {
    id: "radical-chewer",
    name: "Radical Chewer",
    price: "$24.99",
    image:
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=700&q=80",
    description:
      "A loud little chew toy for pets who treat playtime like a headline show.",
    swatches: ["bg-[var(--chart-2)]", "bg-[var(--chart-3)]"],
  },
  {
    id: "street-carrier-x",
    name: "Street Carrier X",
    price: "$155.00",
    badge: "New Drop",
    badgeColor: "bg-[var(--chart-2)]",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=700&q=80",
    description:
      "Structured travel gear with padded comfort, tough handles, and city-ready attitude.",
    swatches: ["bg-secondary-background"],
  },
  {
    id: "bolt-bites-50pk",
    name: "Bolt Bites (50pk)",
    price: "$18.00",
    image:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80",
    description:
      "Crunchy training bites packed for quick rewards and louder tail wags.",
    swatches: ["bg-foreground"],
  },
  {
    id: "tagger-lounge",
    name: "Tagger Lounge",
    price: "$120.00",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=700&q=80",
    description:
      "A plush crash pad with a graffiti edge for pets who nap like they own the room.",
    swatches: ["bg-[var(--chart-1)]"],
  },
  {
    id: "riot-rope-leash",
    name: "Riot Rope Leash",
    price: "$45.00",
    image:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=700&q=80",
    description:
      "A grippy rope leash with street-ready color and hardware that can keep up.",
    swatches: ["bg-[var(--chart-3)]", "bg-foreground"],
  },
  {
    id: "punk-denim-vest",
    name: "Punk Denim Vest",
    price: "$68.00",
    image:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=700&q=80",
    description:
      "Layered denim attitude for pets who refuse to be background characters.",
    swatches: ["bg-[var(--chart-5)]"],
  },
  {
    id: "the-static-bowl",
    name: "The Static Bowl",
    price: "$32.00",
    image:
      "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=700&q=80",
    description:
      "A clean, weighty bowl with punk typography and everyday dinner durability.",
    swatches: ["bg-secondary-background", "bg-foreground"],
  },
];

const defaultDetails = {
  detailImage: null,
  sizes: ['Small (10"-14")', 'Medium (14"-18")', 'Large (18"-22")'],
  colors: ["bg-[var(--chart-3)]", "bg-foreground", "bg-main"],
  selectedColor: 0,
  specs: [
    "Pet-safe materials",
    "Daily use tested",
    "Easy-clean finish",
    "Limited drop design",
  ],
  shipping: ["Ships in 2-3 days.", "Express delivery available.", "Free over $100."],
  reviews: [
    {
      title: "Loud in the best way",
      body: "The design gets noticed everywhere and still feels practical for daily use.",
      author: "Max V.",
    },
    {
      title: "Heavy but cool",
      body: "A little tougher than expected, which is exactly why I like it.",
      author: "Sarah K.",
    },
    {
      title: "Perfection",
      body: "Finally a brand that gets pet style isn't just about soft colors and paws.",
      author: "Riley J.",
    },
  ],
};

export function getShopProductById(id) {
  const product = shopProducts.find((item) => item.id === id);

  if (!product) {
    return null;
  }

  return {
    ...defaultDetails,
    ...product,
    detailImage: product.detailImage || product.image,
  };
}
