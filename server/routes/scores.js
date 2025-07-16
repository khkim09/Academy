const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/rounds', async (req, res) => {
    const { className } = req.query;
    if (!className) return res.status(400).json({ error: '분반 이름은 필수입니다.' });
    try {
        const query = 'SELECT DISTINCT round, date FROM scores WHERE class_name = ? ORDER BY CAST(round AS UNSIGNED), round ASC';
        const [rows] = await db.query(query, [className]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: '회차 목록 조회 중 오류' }); }
});

router.get('/roster', async (req, res) => {
    const { className } = req.query;
    if (!className) return res.status(400).json({ error: '분반 이름은 필수입니다.' });
    try {
        const query = 'SELECT student_name, phone, school FROM class_rosters WHERE class_name = ? ORDER BY student_name;';
        const [rows] = await db.query(query, [className]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: '학생 명단 조회 오류' }); }
});

router.get('/list', async (req, res) => {
    const { className, round } = req.query;
    if (!className || !round) return res.status(400).json({ error: '분반과 회차는 필수입니다.' });
    try {
        const query = `
            SELECT r.student_name, r.phone, r.school, s.test_score, s.assignment1, s.assignment2, s.date
            FROM class_rosters AS r
            LEFT JOIN scores AS s ON r.phone = s.phone AND r.class_name = s.class_name AND s.round = ?
            WHERE r.class_name = ? ORDER BY student_name;`;
        const [rows] = await db.query(query, [round, className]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: '성적 목록 조회 오류' }); }
});

router.post('/save', async (req, res) => {
    const { class_name, round, date, student_name, phone, school, test_score, total_question, wrong_questions, assignment1, assignment2, memo } = req.body;
    if (!class_name || !round || !phone || !test_score || !total_question || !assignment1 || !assignment2) {
        return res.status(400).json({ error: '필수 입력 항목이 누락되었습니다.' });
    }
    try {
        const sql = `
            INSERT INTO scores (class_name, round, date, student_name, phone, school, test_score, total_question, wrong_questions, assignment1, assignment2, memo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            AS new
            ON DUPLICATE KEY UPDATE date = new.date, student_name = new.student_name, school = new.school, test_score = new.test_score, total_question = new.total_question, wrong_questions = new.wrong_questions, assignment1 = new.assignment1, assignment2 = new.assignment2, memo = new.memo;`;
        await db.query(sql, [class_name, round, date, student_name, phone, school, test_score, total_question, wrong_questions, assignment1, assignment2, memo || '']);
        res.status(200).json({ message: '성적이 성공적으로 저장되었습니다.' });
    } catch (err) { res.status(500).json({ error: '성적 저장 중 서버 오류' }); }
});

router.get('/search-student', async (req, res) => {
    const { className, name } = req.query;
    if (!className || !name) return res.json([]);
    try {
        const query = `SELECT student_name, phone, school FROM class_rosters WHERE class_name = ? AND student_name LIKE ?`;
        const [rows] = await db.query(query, [className, `%${name}%`]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: '학생 검색 중 오류 발생' }); }
});

module.exports = router;
