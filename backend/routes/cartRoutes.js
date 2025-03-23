const express = require("express");
const router = express.Router();
const Order = require("./models/Order");

// 주문 생성 (POST)
router.post("/order", async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "유효한 아이템 배열이 필요합니다." });
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const order = new Order({ items, totalPrice });
  await order.save();
  res.json({ message: "주문 성공!", order });
});

// 주문 상태 업데이트 (PUT)
router.put("/order/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["Pending", "Completed", "Cancelled"].includes(status)) {
    return res.status(400).json({ message: "유효한 상태를 입력하세요." });
  }

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) {
    return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
  }

  res.json({ message: "주문 상태 업데이트 성공", order });
});

module.exports = router;
// Compare this snippet from frontend/src/Cart.js:
