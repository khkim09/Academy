// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 라우트 등록
const attendanceRoutes = require("./routes/attendance");
const scoreRoutes = require("./routes/score");

app.use("/api", attendanceRoutes);
app.use("/api", scoreRoutes);

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}번에서 실행 중`);
});
