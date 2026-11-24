const CartModel = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");
const getCart = async (req, res) => {
  try {
    const cartItems = await CartModel.find({ userId: req.userId });
    return res.json(cartItems);
  } catch (error) {
    console.error("getCart error:", error.message);
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const addCart = async (req, res) => {
  try {
    const { productId, images, img1, title, price, quantity, size } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1) контракт: либо images (массив), либо img1 (строка, legacy Checkout.tsx)
    // 2) если не передано ни одного — это ошибка контракта, а не повод тянуть из товара
    let imgs;
    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({ message: "images must be an array of URLs" });
      }
      imgs = images;
    } else if (typeof img1 === "string" && img1.trim() !== "") {
      imgs = [img1.trim()];
    } else {
      return res.status(400).json({ message: "Missing or invalid cart fields: images" });
    }

    if (imgs.length === 0) {
      return res.status(400).json({ message: "images must contain at least one URL" });
    }
    if (!imgs.every((u) => typeof u === "string" && u.trim() !== "")) {
      return res.status(400).json({ message: "images must contain only non-empty strings" });
    }
    imgs = imgs.map((u) => u.trim());

    const normalizedPrice = Number(price ?? product.price);
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: "price must be a non-negative number" });
    }

    const normalizedQty = Number(quantity ?? 1);
    if (!Number.isInteger(normalizedQty) || normalizedQty < 1) {
      return res.status(400).json({ message: "quantity must be a positive integer" });
    }

    const cartItem = await new CartModel({
      userId: req.userId,
      productId,
      images: imgs,
      title: title || product.title || "Product",
      price: normalizedPrice,
      quantity: normalizedQty,
      size: size || "One Size",
    }).save();

    return res.status(201).json({
      message: "Added to cart Sucsessfully",
      cartItem,
    });
  } catch (error) {
    console.error("addCart error:", error.message);
    return res.status(400).json({ message: error.message || "Cannot add to cart" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { quantity },
      { new: true }
    );
    if (!cartItem) return res.status(404).json({ message: "Cart is not found" });
    return res.json({ message: "Cart updated sucessfully", cartItem });
  } catch (error) {
    console.error("updateCart error:", error.message);
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const removeCart = async (req, res) => {
  try {
    const cartItem = await CartModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!cartItem) return res.status(404).json({ message: "Cart is not found" });
    return res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("removeCart error:", error.message);
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

module.exports = { getCart, addCart, updateCart, removeCart };