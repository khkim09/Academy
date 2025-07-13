// /api/students 경로 처리

const express = require("express");
const router = express.Router();
const db = require("../db");

// 학생 전체 조회
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        console.error('학생 조회 실패 : ', err);
        res.status(500).json({ message: "DB 조회 실패", error: err.message });
    }
});

// 학생 추가
router.post("/", async (req, res) => {
    const { name, phone, school } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO students (name, phone, school) VALUES (?, ?, ?)",
            [name, phone, school]
        );
        res.status(201).json({ id: result.insertId, name, phone, school });
    } catch (err) {
        res.status(500).json({ error: "학생 추가 실패", details: err.message });
    }
});


// 학생 삭제
router.delete("/:id", async (req, res) => {
    const studentId = req.params.id;
    try {
        await db.query("DELETE FROM students WHERE id = ?", [studentId]);
        res.json({ message: "삭제 성공" });
    } catch (err) {
        res.status(500).json({ message: "DB 삭제 실패", error: err.message });
    }
});

module.exports = router;
