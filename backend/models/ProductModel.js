const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    images: { type: [String], required: true },
    quantity: { type: Number, required: true },
    sizes: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);