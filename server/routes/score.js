// 성적 API 라우터
const express = require("express");
const router = express.Router();
const db = require("../db");

// 성적 저장
router.post("/score", (req, res) => {
    const { student_id, subject, round, score } = req.body;
    const sql =
        "INSERT INTO scores (student_id, subject, round, score) VALUES (?, ?, ?, ?)";
    db.query(sql, [student_id, subject, round, score], (err, result) => {
        if (err) {
            console.error("성적 저장 실패:", err);
            return res.status(500).json({ error: "DB Error" });
        }
        res.json({ success: true });
    });
});

// 성적 조회
router.get("/score/:student_id", (req, res) => {
    const studentId = req.params.student_id;
    const sql = "SELECT * FROM scores WHERE student_id = ?";
    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("성적 조회 실패:", err);
            return res.status(500).json({ error: "DB Error" });
        }
        res.json(results);
    });
});

module.exports = router;
