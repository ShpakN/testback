require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  throw new Error("В .env не задан MONGO_URI");
}

const connection = mongoose.connect(MONGO_URI).catch((e) => {
  console.error("MongoDB connection error:", e.message);
  throw e;
});

module.exports = { connection, PORT };