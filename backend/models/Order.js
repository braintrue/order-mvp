const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
