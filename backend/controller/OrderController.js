const mongoose = require("mongoose");
const OrderModel = require("../models/OrderModel");

const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, shippingAddress } = req.body;
    const userId = req.userId;                     

    console.log('[ORDER] createOrder called', {
      hasUserId: !!userId,
      productsCount: products?.length,
      totalPrice,
    });

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "must contain products" });
    }

    // валидация ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('[ORDER] userId не ObjectId:', userId);
      return res.status(400).json({ message: "Invalid userId in token" });
    }

    const order = new OrderModel({
      userId,
      products,
      totalPrice,
      shippingAddress,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    await order.save();
    
    console.log("[ORDER] saved:", order._id);
    res.status(201).json({ message: "Order added successfully", order });
  } catch (error) {
    console.error("[ORDER] save failed:", error.message, error.errors || "");
    res.status(500).json({ message: "Error", error: error.message });
  }
};

 // Fetch all orders 
const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

module.exports = {createOrder, getOrders}
