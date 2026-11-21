require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("В .env не задан MONGO_URI");
  }
  await mongoose.connect(MONGO_URI);
  return mongoose.connection;
};

module.exports = { connectDB, PORT, MONGO_URI, connection: mongoose.connection };
