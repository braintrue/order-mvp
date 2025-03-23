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

// ✅ Order 모델 임포트
const Order = require("./models/Order"); // Order 모델을 임포트

// ✅ 라우터 임포트
const cartRoutes = require("./cartRoutes"); // cartRoutes 파일 임포트

// ✅ 라우터 사용
app.use("/api", cartRoutes); // "/api" 경로로 시작하는 요청에 대해 cartRoutes를 사용

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
