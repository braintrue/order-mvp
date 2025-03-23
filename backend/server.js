const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config(); // ✅ 환경 변수 로드

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ 주문 스키마 & 모델
const OrderSchema = new mongoose.Schema({
  items: Array,
  totalPrice: Number,
  status: { type: String, default: "Pending" },
});
const Order = mongoose.model("Order", OrderSchema);

// ✅ 주문 생성 (POST)
app.post("/api/order", async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "유효한 아이템 배열이 필요합니다." });
  }
  const order = new Order({ items, totalPrice: 0 });
  await order.save();
  res.json({ message: "주문 성공!", order });
});

// ✅ 주문 목록 조회 (GET)
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
