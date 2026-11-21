// backend/models/OrderModel.js
const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const orderProductSchema = new mongoose.Schema(
  {
    productId: { type: String, trim: true },
    title: { type: String, trim: true },
    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 1, default: 1 },
    size: { type: String, trim: true },
    images: { type: [String], default: [] },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    products: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "must contain products",
      },
    },
    totalPrice: { type: Number, required: true, min: 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);