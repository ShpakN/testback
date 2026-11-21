require("dotenv").config();
const mongoose = require("mongoose");
const ProductModel = require("../models/ProductModel");

const items = [
  { title: "Classic Cotton T-Shirt", price: 1299, images: ["https://picsum.photos/seed/tshirt/600/600"], sizes: ["S","M","L","XL"], quantity: 50, rating: 4.4, reviews: 128, description: "100% хлопок, свободный крой." },
  { title: "Slim Fit Jeans", price: 3499, images: ["https://picsum.photos/seed/jeans/600/600"], sizes: ["30","32","34","36"], quantity: 30, rating: 4.6, reviews: 94, description: "Джинсы с эластаном." },
  { title: "Running Sneakers", price: 5499, images: ["https://picsum.photos/seed/sneakers/600/600"], sizes: ["40","41","42","43","44"], quantity: 25, rating: 4.7, reviews: 210 },
  { title: "Hooded Sweatshirt", price: 2799, images: ["https://picsum.photos/seed/hoodie/600/600"], sizes: ["S","M","L","XL"], quantity: 40, rating: 4.3, reviews: 76 },
  { title: "Leather Jacket", price: 8999, images: ["https://picsum.photos/seed/jacket/600/600"], sizes: ["M","L","XL"], quantity: 10, rating: 4.8, reviews: 41 },
  { title: "Summer Dress", price: 3299, images: ["https://picsum.photos/seed/dress/600/600"], sizes: ["XS","S","M","L"], quantity: 22, rating: 4.5, reviews: 88 },
  { title: "Wool Beanie", price: 899, images: ["https://picsum.photos/seed/beanie/600/600"], sizes: ["One Size"], quantity: 60, rating: 4.2, reviews: 55 },
  { title: "Canvas Backpack", price: 2499, images: ["https://picsum.photos/seed/backpack/600/600"], sizes: ["One Size"], quantity: 35, rating: 4.4, reviews: 132 },
  { title: "Aviator Sunglasses", price: 1999, images: ["https://picsum.photos/seed/sunglasses/600/600"], sizes: ["One Size"], quantity: 45, rating: 4.1, reviews: 67 },
  { title: "Sports Watch", price: 7999, images: ["https://picsum.photos/seed/watch/600/600"], sizes: ["One Size"], quantity: 15, rating: 4.6, reviews: 29 },
  { title: "Cotton Socks (3 pack)", price: 599, images: ["https://picsum.photos/seed/socks/600/600"], sizes: ["S","M","L"], quantity: 100, rating: 4.0, reviews: 180 },
  { title: "Baseball Cap", price: 1199, images: ["https://picsum.photos/seed/cap/600/600"], sizes: ["One Size"], quantity: 55, rating: 4.3, reviews: 92 },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    await ProductModel.deleteMany({});
    const created = await ProductModel.insertMany(items);
    console.log(`Seeded ${created.length} products`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
