// routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 출결 정보 저장 (기존 날짜 → update, 새로운 날짜 → insert)
router.post('/save', async (req, res) => {
    const records = req.body.records;

    if (!records || !Array.isArray(records)) {
        return res.status(400).json({ error: 'records 형식이 올바르지 않습니다.' });
    }

    const conn = db.promise();

    try {
        for (const record of records) {
            const { class_name, student_name, school, phone, date, status } = record;

            if (!class_name || !student_name || !school || !phone || !date || !status) {
                return res.status(400).json({ error: '필수 필드가 누락된 항목이 있습니다.', record });
            }

            // 해당 학생+분반+날짜의 기존 출결 데이터가 있는지 확인
            const [existing] = await conn.query(
                `SELECT * FROM attendance WHERE class_name=? AND student_name=? AND phone=? AND date=?`,
                [class_name, student_name, phone, date]
            );

            if (existing.length > 0) {
                // 존재하면 UPDATE
                await conn.query(
                    `UPDATE attendance SET status=?, school=? WHERE class_name=? AND student_name=? AND phone=? AND date=?`,
                    [status, school, class_name, student_name, phone, date]
                );
            } else {
                // 없으면 INSERT
                await conn.query(
                    `INSERT INTO attendance (class_name, student_name, school, phone, date, status) VALUES (?, ?, ?, ?, ?, ?)`,
                    [class_name, student_name, school, phone, date, status]
                );
            }
        }

        res.status(200).json({ message: '출결 정보 저장 완료' });
    } catch (err) {
        console.error('DB 저장 오류:', err);
        res.status(500).json({ error: '출결 정보 저장 중 서버 오류가 발생했습니다.' });
    }
});

// 출결 정보 불러오기 (분반 + 날짜)
router.get('/load', async (req, res) => {
    const { class_name, date } = req.query;
    if (!class_name || !date) {
        return res.status(400).json({ error: '분반 및 날짜는 필수입니다.' });
    }

    try {
        const conn = db.promise();
        const [rows] = await conn.query(
            `SELECT student_name, phone, school, status FROM attendance WHERE class_name=? AND date=?`,
            [class_name, date]
        );
        res.json({ data: rows });
    } catch (err) {
        console.error('출결 조회 오류:', err);
        res.status(500).json({ error: '출결 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
