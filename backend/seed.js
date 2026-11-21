/**
 * Идемпотентный сидинг товаров.
 * Запуск: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const ProductModel = require("./models/ProductModel");

const products = [
  { title: "Classic Cotton T-Shirt", category: "Men", description: "Мягкая футболка из 100% хлопка, свободный крой.", brand: "Clothisa", price: 1299, rating: 4.4, reviews: 128, images: ["https://picsum.photos/seed/tshirt/600/600"], quantity: 50, sizes: ["S", "M", "L", "XL"] },
  { title: "Slim Fit Denim Jeans", category: "Men", description: "Джинсы слим-фит с лёгким эластаном.", brand: "DenimCo", price: 3499, rating: 4.6, reviews: 94, images: ["https://picsum.photos/seed/jeans/600/600"], quantity: 30, sizes: ["30", "32", "34", "36"] },
  { title: "Leather Jacket Black", category: "Men", description: "Кожаная куртка прямого кроя на молнии.", brand: "UrbanHide", price: 8990, rating: 4.8, reviews: 41, images: ["https://picsum.photos/seed/jacket/600/600"], quantity: 12, sizes: ["M", "L", "XL"] },
  { title: "Summer Floral Dress", category: "Women", description: "Летнее платье с цветочным принтом, миди.", brand: "Bloom", price: 2790, rating: 4.5, reviews: 203, images: ["https://picsum.photos/seed/dress/600/600"], quantity: 25, sizes: ["XS", "S", "M", "L"] },
  { title: "Wool Blend Coat", category: "Women", description: "Пальто из шерстяной смеси, двубортное.", brand: "Nordic", price: 7490, rating: 4.7, reviews: 57, images: ["https://picsum.photos/seed/coat/600/600"], quantity: 18, sizes: ["S", "M", "L"] },
  { title: "Running Sneakers Air", category: "Footwear", description: "Беговые кроссовки с амортизирующей подошвой.", brand: "Stride", price: 5490, rating: 4.6, reviews: 310, images: ["https://picsum.photos/seed/sneakers/600/600"], quantity: 40, sizes: ["40", "41", "42", "43", "44"] },
  { title: "Canvas Backpack", category: "Accessories", description: "Рюкзак из плотного канваса, отделение под ноутбук 15\".", brand: "CarryAll", price: 2190, rating: 4.3, reviews: 76, images: ["https://picsum.photos/seed/backpack/600/600"], quantity: 35, sizes: ["One Size"] },
  { title: "Leather Belt Brown", category: "Accessories", description: "Ремень из натуральной кожи с классической пряжкой.", brand: "UrbanHide", price: 1590, rating: 4.2, reviews: 64, images: ["https://picsum.photos/seed/belt/600/600"], quantity: 60, sizes: ["90", "95", "100"] },
  { title: "Hooded Sweatshirt Grey", category: "Men", description: "Худи оверсайз с капюшоном и карманом-кенгуру.", brand: "Clothisa", price: 2690, rating: 4.5, reviews: 158, images: ["https://picsum.photos/seed/hoodie/600/600"], quantity: 45, sizes: ["M", "L", "XL", "XXL"] },
  { title: "Silk Scarf Pattern", category: "Accessories", description: "Шёлковый платок с геометрическим принтом, 90×90 см.", brand: "Bloom", price: 1890, rating: 4.1, reviews: 29, images: ["https://picsum.photos/seed/scarf/600/600"], quantity: 20, sizes: ["90x90"] },
  { title: "Kids Puffer Jacket", category: "Kids", description: "Тёплая куртка для детей с синтетическим утеплителем.", brand: "Nordic", price: 3290, rating: 4.4, reviews: 33, images: ["https://picsum.photos/seed/kids-jacket/600/600"], quantity: 15, sizes: ["116", "128", "140"] },
  { title: "Baseball Cap", category: "Accessories", description: "Бейсболка с регулируемой застёжкой, вышитый логотип.", brand: "Stride", price: 990, rating: 4.0, reviews: 87, images: ["https://picsum.photos/seed/cap/600/600"], quantity: 70, sizes: ["One Size"] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let created = 0;
    for (const product of products) {
      const exists = await ProductModel.findOne({ title: product.title });
      if (exists) continue;
      await ProductModel.create(product);
      created++;
    }

    const total = await ProductModel.countDocuments();
    console.log(`Seeded ${created} new products. Total in DB: ${total}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();