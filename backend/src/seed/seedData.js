const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const Wishlist = require("../models/wishlist.model");

dotenv.config({ path: path.join(__dirname, "../../.env") });

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const password = "Password@123";

const users = [
  {
    name: "Admin User",
    age: 32,
    email: "admin@example.com",
    phone: "9000000001",
    address: "Petpunk HQ, Ahmedabad",
    role: "seller",
    admin: true,
  },
  {
    name: "Aarav Sharma",
    age: 28,
    email: "aarav.seller@example.com",
    phone: "9876543210",
    address: "12 MG Road, Bengaluru",
    role: "seller",
  },
  {
    name: "Priya Nair",
    age: 31,
    email: "priya.seller@example.com",
    phone: "9765432109",
    address: "24 Marine Drive, Mumbai",
    role: "seller",
  },
  {
    name: "Kabir Mehta",
    age: 35,
    email: "kabir.seller@example.com",
    phone: "9654321098",
    address: "18 Park Street, Kolkata",
    role: "seller",
  },
  {
    name: "Ananya Rao",
    age: 24,
    email: "ananya.customer@example.com",
    phone: "9543210987",
    address: "41 Jubilee Hills, Hyderabad",
    role: "customer",
  },
  {
    name: "Rohan Iyer",
    age: 27,
    email: "rohan.customer@example.com",
    phone: "9432109876",
    address: "7 Anna Salai, Chennai",
    role: "customer",
  },
  {
    name: "Meera Singh",
    age: 29,
    email: "meera.customer@example.com",
    phone: "9321098765",
    address: "63 Civil Lines, Delhi",
    role: "customer",
  },
  {
    name: "Dev Patel",
    age: 33,
    email: "dev.customer@example.com",
    phone: "9210987654",
    address: "9 Ring Road, Ahmedabad",
    role: "customer",
  },
  {
    name: "Isha Kapoor",
    age: 26,
    email: "isha.customer@example.com",
    phone: "9109876543",
    address: "33 FC Road, Pune",
    role: "customer",
  },
  {
    name: "Nikhil Verma",
    age: 30,
    email: "nikhil.customer@example.com",
    phone: "9988776655",
    address: "5 Gomti Nagar, Lucknow",
    role: "customer",
  },
  {
    name: "Sara Thomas",
    age: 25,
    email: "sara.customer@example.com",
    phone: "9876501234",
    address: "14 Panampilly Nagar, Kochi",
    role: "customer",
  },
];

const imageTagFor = (category, petType) => {
  if (["dog", "cat", "bird", "fish", "rabbit", "hamster"].includes(petType)) {
    return petType;
  }

  if (category === "food") return "petfood";
  if (category === "toy") return "pettoy";
  if (category === "grooming") return "pet";
  if (category === "medicine") return "veterinary";
  if (category === "accessory") return "pet";

  return "pet";
};

const imageFor = (category, petType, index) =>
  `https://loremflickr.com/800/600/${imageTagFor(category, petType)}?lock=${index + 101}`;

const productTemplates = [
  ["Golden Retriever Puppy", "Friendly vaccinated golden retriever puppy ready for a loving family home.", "pet", "dog", 25000, 2, 3, "Golden Retriever", "male", true],
  ["Persian Cat Kitten", "Calm fluffy Persian kitten with gentle temperament and clean health record.", "pet", "cat", 18000, 3, 2, "Persian", "female", true],
  ["Budgie Pair", "Healthy colorful budgie pair suitable for beginners and small indoor cages.", "pet", "bird", 3500, 4, 1, "Budgerigar", "unknown", false],
  ["Rabbit White Doe", "Soft white rabbit with playful nature and good eating habits.", "pet", "rabbit", 4200, 2, 1, "New Zealand White", "female", true],
  ["Hamster Syrian Male", "Active Syrian hamster with cage friendly behavior and clean coat.", "pet", "hamster", 1200, 5, 1, "Syrian", "male", false],
  ["Betta Fish Blue", "Bright blue betta fish with active swimming pattern and vivid fins.", "pet", "fish", 650, 8, 1, "Betta", "male", false],
  ["Labrador Puppy", "Energetic labrador puppy vaccinated and socialized for home adoption.", "pet", "dog", 22000, 2, 4, "Labrador", "female", true],
  ["Siamese Cat", "Elegant Siamese cat with alert personality and litter trained habits.", "pet", "cat", 16000, 1, 8, "Siamese", "male", true],
  ["Premium Dog Food", "Balanced chicken and rice dry food for adult dogs with high protein nutrition.", "food", "dog", 1850, 40],
  ["Kitten Tuna Food", "Soft tuna recipe kitten food with essential vitamins for healthy growth.", "food", "cat", 720, 55],
  ["Bird Seed Mix", "Nutritious seed mix for parrots, budgies, and other small pet birds.", "food", "bird", 320, 70],
  ["Rabbit Hay Pack", "Fresh timothy hay pack that supports digestion and dental health for rabbits.", "food", "rabbit", 450, 60],
  ["Fish Flakes", "Daily nutrition floating flakes for tropical aquarium fish and goldfish.", "food", "fish", 180, 80],
  ["Dog Chew Toy", "Durable rubber chew toy designed for medium dogs and active play.", "toy", "dog", 399, 35],
  ["Cat Feather Wand", "Interactive feather wand toy for exercise, jumping, and playful bonding.", "toy", "cat", 249, 50],
  ["Bird Swing Toy", "Colorful hanging swing toy that keeps small birds engaged and active.", "toy", "bird", 299, 28],
  ["Hamster Wheel", "Silent running exercise wheel suitable for hamsters and small rodents.", "toy", "hamster", 550, 22],
  ["Dog Grooming Brush", "Comfort grip grooming brush for removing loose fur and reducing shedding.", "grooming", "dog", 499, 30],
  ["Cat Nail Clipper", "Safe stainless steel nail clipper for cats and small pets.", "grooming", "cat", 199, 45],
  ["Pet Shampoo Aloe", "Gentle aloe vera shampoo for dogs and cats with sensitive skin.", "grooming", "other", 349, 38],
  ["Ear Cleaning Drops", "Mild ear cleaning drops for routine dog and cat hygiene care.", "medicine", "other", 275, 32],
  ["Deworming Tablets", "Veterinary deworming tablets for routine parasite control in dogs.", "medicine", "dog", 420, 25],
  ["Cat Hairball Gel", "Palatable gel that helps cats manage hairballs and digestion comfortably.", "medicine", "cat", 360, 20],
  ["Adjustable Dog Collar", "Soft adjustable nylon collar with strong buckle for daily walks.", "accessory", "dog", 299, 65],
  ["Cat Litter Box", "Easy clean litter box with high sides for cleaner indoor cat care.", "accessory", "cat", 899, 18],
  ["Aquarium Filter", "Compact internal aquarium filter for clear water and steady circulation.", "accessory", "fish", 1150, 14],
  ["Bird Cage Medium", "Powder coated medium bird cage with perch, feeder, and removable tray.", "accessory", "bird", 2200, 10],
  ["Rabbit Water Bottle", "Leak resistant water bottle designed for rabbit and small pet cages.", "accessory", "rabbit", 320, 40],
  ["Pet Travel Carrier", "Ventilated travel carrier for cats, puppies, and small pets.", "accessory", "other", 1450, 16],
  ["Training Treat Pouch", "Waist clip treat pouch for dog training walks and reward sessions.", "other", "dog", 399, 24],
];

const buildProducts = (sellerIds) =>
  productTemplates.map((item, index) => {
    const [
      productName,
      description,
      category,
      petType,
      price,
      stock,
      age,
      breed,
      gender,
      isVaccinated,
    ] = item;

    return {
      seller: sellerIds[index % sellerIds.length],
      productName,
      description,
      category,
      petType,
      price,
      stock,
      images: [imageFor(category, petType, index)],
      ...(age !== undefined ? { age } : {}),
      ...(breed ? { breed } : {}),
      ...(gender ? { gender } : {}),
      ...(isVaccinated !== undefined ? { isVaccinated } : {}),
      status: stock > 0 ? "available" : "out_of_stock",
      averageRating: 0,
      totalReviews: 0,
    };
  });

const getTotalAmount = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const buildOrderItem = (product, quantity = 1) => ({
  product: product._id,
  quantity,
  price: product.price,
});

const applyOrderStock = async (orders) => {
  const productMap = new Map();

  orders.forEach((order) => {
    if (order.status === "cancelled") return;

    order.items.forEach((item) => {
      const productId = item.product.toString();
      productMap.set(productId, (productMap.get(productId) || 0) + item.quantity);
    });
  });

  await Promise.all(
    [...productMap.entries()].map(async ([productId, soldQuantity]) => {
      const product = await Product.findById(productId);
      if (!product) return;

      product.stock = Math.max(product.stock - soldQuantity, 0);
      if (product.stock === 0) {
        product.status = product.category === "pet" ? "sold" : "out_of_stock";
      }

      await product.save();
    })
  );
};

const updateProductRatingStats = async (productIds) => {
  await Promise.all(
    productIds.map(async (productId) => {
      const reviews = await Review.find({ product: productId });
      const totalReviews = reviews.length;
      const averageRating = totalReviews
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      await Product.findByIdAndUpdate(productId, {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
      });
    })
  );
};

const seed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(password, 10);

  await Promise.all(
    users.map((user) =>
      User.updateOne(
        { email: user.email },
        {
          $set: {
            ...user,
            admin: Boolean(user.admin),
            password: hashedPassword,
            isActive: true,
          },
        },
        { upsert: true, runValidators: true }
      )
    )
  );

  const seededUsers = await User.find({
    email: { $in: users.map((user) => user.email) },
  });
  const seededUserIds = seededUsers.map((user) => user._id);
  const sellerUsers = seededUsers.filter((user) => user.role === "seller");
  const customerUsers = seededUsers.filter((user) => user.role === "customer");
  const sellerIds = sellerUsers.map((seller) => seller._id);
  const products = buildProducts(sellerIds);

  await Promise.all([
    Cart.deleteMany({ buyer: { $in: seededUserIds } }),
    Wishlist.deleteMany({ buyer: { $in: seededUserIds } }),
    Order.deleteMany({ buyer: { $in: seededUserIds } }),
    Review.deleteMany({ user: { $in: seededUserIds } }),
    Product.deleteMany({
      productName: { $in: products.map((product) => product.productName) },
    }),
  ]);

  const insertedProducts = await Product.insertMany(products);
  const productByName = Object.fromEntries(
    insertedProducts.map((product) => [product.productName, product])
  );
  const customerByEmail = Object.fromEntries(
    customerUsers.map((user) => [user.email, user])
  );

  const carts = [
    {
      buyer: customerByEmail["ananya.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Premium Dog Food"], 2),
        buildOrderItem(productByName["Dog Chew Toy"], 1),
      ],
    },
    {
      buyer: customerByEmail["rohan.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Cat Feather Wand"], 2),
        buildOrderItem(productByName["Cat Litter Box"], 1),
      ],
    },
    {
      buyer: customerByEmail["meera.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Bird Seed Mix"], 3),
        buildOrderItem(productByName["Bird Cage Medium"], 1),
      ],
    },
  ].map((cart) => ({
    ...cart,
    totalAmount: getTotalAmount(cart.items),
  }));

  const wishlists = [
    {
      buyer: customerByEmail["ananya.customer@example.com"]._id,
      items: [
        { product: productByName["Golden Retriever Puppy"]._id },
        { product: productByName["Pet Travel Carrier"]._id },
      ],
    },
    {
      buyer: customerByEmail["dev.customer@example.com"]._id,
      items: [
        { product: productByName["Labrador Puppy"]._id },
        { product: productByName["Training Treat Pouch"]._id },
      ],
    },
    {
      buyer: customerByEmail["isha.customer@example.com"]._id,
      items: [
        { product: productByName["Persian Cat Kitten"]._id },
        { product: productByName["Kitten Tuna Food"]._id },
      ],
    },
  ];

  const orderDrafts = [
    {
      buyer: customerByEmail["ananya.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Premium Dog Food"], 1),
        buildOrderItem(productByName["Dog Grooming Brush"], 1),
      ],
      shippingAddress: {
        phone: "9543210987",
        address: "41 Jubilee Hills, Hyderabad",
      },
      paymentMethod: "cod",
      paymentStatus: "pending",
      paid: false,
      status: "pending",
    },
    {
      buyer: customerByEmail["rohan.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Persian Cat Kitten"], 1),
        buildOrderItem(productByName["Kitten Tuna Food"], 2),
      ],
      shippingAddress: {
        phone: "9432109876",
        address: "7 Anna Salai, Chennai",
      },
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: "order_demo_rohan_001",
      razorpayPaymentId: "pay_demo_rohan_001",
      razorpaySignature: "demo_signature_rohan",
      paid: true,
      paidAt: new Date("2026-05-10T10:30:00.000Z"),
      status: "delivered",
    },
    {
      buyer: customerByEmail["meera.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Budgie Pair"], 1),
        buildOrderItem(productByName["Bird Cage Medium"], 1),
      ],
      shippingAddress: {
        phone: "9321098765",
        address: "63 Civil Lines, Delhi",
      },
      paymentMethod: "cod",
      paymentStatus: "pending",
      paid: false,
      status: "confirmed",
    },
    {
      buyer: customerByEmail["dev.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Labrador Puppy"], 1),
        buildOrderItem(productByName["Adjustable Dog Collar"], 1),
      ],
      shippingAddress: {
        phone: "9210987654",
        address: "9 Ring Road, Ahmedabad",
      },
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: "order_demo_dev_001",
      razorpayPaymentId: "pay_demo_dev_001",
      razorpaySignature: "demo_signature_dev",
      paid: true,
      paidAt: new Date("2026-05-12T12:45:00.000Z"),
      status: "shipped",
    },
    {
      buyer: customerByEmail["isha.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Cat Nail Clipper"], 1),
        buildOrderItem(productByName["Cat Hairball Gel"], 1),
      ],
      shippingAddress: {
        phone: "9109876543",
        address: "33 FC Road, Pune",
      },
      paymentMethod: "cod",
      paymentStatus: "pending",
      paid: false,
      status: "cancelled",
    },
    {
      buyer: customerByEmail["sara.customer@example.com"]._id,
      items: [
        buildOrderItem(productByName["Fish Flakes"], 2),
        buildOrderItem(productByName["Aquarium Filter"], 1),
      ],
      shippingAddress: {
        phone: "9876501234",
        address: "14 Panampilly Nagar, Kochi",
      },
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: "order_demo_sara_001",
      razorpayPaymentId: "pay_demo_sara_001",
      razorpaySignature: "demo_signature_sara",
      paid: true,
      paidAt: new Date("2026-05-14T09:15:00.000Z"),
      status: "delivered",
    },
  ].map((order) => ({
    ...order,
    totalAmount: getTotalAmount(order.items),
  }));

  const orders = await Order.insertMany(orderDrafts);
  await applyOrderStock(orders);
  await Cart.insertMany(carts);
  await Wishlist.insertMany(wishlists);

  const reviews = [
    {
      user: customerByEmail["rohan.customer@example.com"]._id,
      product: productByName["Persian Cat Kitten"]._id,
      rating: 5,
      comment: "Beautiful kitten, healthy and already comfortable at home.",
    },
    {
      user: customerByEmail["rohan.customer@example.com"]._id,
      product: productByName["Kitten Tuna Food"]._id,
      rating: 4,
      comment: "Good quality food and my kitten liked it immediately.",
    },
    {
      user: customerByEmail["sara.customer@example.com"]._id,
      product: productByName["Fish Flakes"]._id,
      rating: 5,
      comment: "Fish are eating well and the pack is good value.",
    },
    {
      user: customerByEmail["sara.customer@example.com"]._id,
      product: productByName["Aquarium Filter"]._id,
      rating: 4,
      comment: "Keeps the tank clear and was simple to install.",
    },
  ];

  await Review.insertMany(reviews);
  await updateProductRatingStats([...new Set(reviews.map((review) => review.product))]);

  console.log(
    `Seeded ${users.length} users, ${insertedProducts.length} products, ${carts.length} carts, ${wishlists.length} wishlists, ${orders.length} orders, and ${reviews.length} reviews.`
  );
  console.log(`Dummy user password: ${password}`);
  console.log("Admin login: admin@example.com");

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seeding failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
