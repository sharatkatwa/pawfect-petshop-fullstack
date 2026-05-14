const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/user.model");
const Product = require("../models/product.model");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const password = "Password@123";

const users = [
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
    };
  });

const seed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }
const dns = require('dns')
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(password, 10);

  await Promise.all(
    users.map((user) =>
      User.updateOne(
        { email: user.email },
        { $set: { ...user, password: hashedPassword, isActive: true } },
        { upsert: true, runValidators: true }
      )
    )
  );

  const sellerUsers = await User.find({
    email: { $in: users.filter((user) => user.role === "seller").map((user) => user.email) },
  });
  const sellerIds = sellerUsers.map((seller) => seller._id);
  const products = buildProducts(sellerIds);

  await Product.deleteMany({
    seller: { $in: sellerIds },
    productName: { $in: products.map((product) => product.productName) },
  });
  await Product.insertMany(products);

  console.log(`Seeded ${users.length} users and ${products.length} products.`);
  console.log(`Dummy user password: ${password}`);

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error("Seeding failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
