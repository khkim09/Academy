// 백엔드 서버 시작점

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// DB 연결 테스트용 API
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() as now");
        res.json({ message: "DB 연결 성공!", time: rows[0].now });
    } catch (err) {
        res.status(500).json({ message: "DB 연결 실패", error: err.message });
    }
});

// 학생 API 연결
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);


app.listen(PORT, () => {
    console.log(`✅ 서버가 포트 ${PORT}번에서 실행 중`);
});
