// 출결 API 라우터
const express = require("express");
const router = express.Router();
const db = require("../db");

// 학생 목록 가져오기
router.get("/students", (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("학생 조회 실패:", err);
            return res.status(500).json({ error: "DB Error" });
        }
        res.json(results);
    });
});

// 출결 기록 저장
router.post("/attendance", (req, res) => {
    const { student_id, date, status } = req.body;
    const sql =
        "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)";
    db.query(sql, [student_id, date, status], (err, result) => {
        if (err) {
            console.error("출결 저장 실패:", err);
            return res.status(500).json({ error: "DB Error" });
        }
        res.json({ success: true });
    });
});

module.exports = router;
