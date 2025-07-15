// 서버 코드
const express = require('express');
const router = express.Router();
const db = require('../db');

// --- 분반 관리 ---

// GET: 모든 분반 목록 불러오기
router.get('/classes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT class_name FROM classes ORDER BY class_name ASC');
        const classNames = rows.map(row => row.class_name);
        res.json(classNames);
    } catch (err) {
        console.error('DB 분반 목록 조회 오류:', err);
        res.status(500).json({ error: '분반 목록을 불러오는 중 서버 오류가 발생했습니다.' });
    }
});

// POST: 새 분반 추가하기
router.post('/classes', async (req, res) => {
    const { className } = req.body;
    if (!className) {
        return res.status(400).json({ error: '분반 이름은 필수입니다.' });
    }

    try {
        await db.query('INSERT INTO classes (class_name) VALUES (?)', [className]);
        res.status(201).json({ message: '분반이 성공적으로 추가되었습니다.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: '이미 존재하는 분반 이름입니다.' });
        }
        console.error('DB 분반 추가 오류:', err);
        res.status(500).json({ error: '분반을 추가하는 중 서버 오류가 발생했습니다.' });
    }
});

// --- 출결 관리 ---

// 출결 정보 저장 (트랜잭션 및 Deprecated 구문 수정 적용)
router.post('/save', async (req, res) => {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
        return res.status(400).json({ error: 'records 형식이 올바르지 않습니다.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const promises = records.map(record => {
            const { class_name, student_name, school, phone, date, status } = record;
            if (!class_name || !student_name || !school || !phone || !date || !status) {
                throw new Error('필수 필드가 누락된 항목이 있습니다.');
            }

            // [수정된 부분] VALUES() 대신 별칭 'new_record'를 사용하는 최신 방식으로 변경
            const sql = `
        INSERT INTO attendance (class_name, student_name, school, phone, date, status)
        VALUES (?, ?, ?, ?, ?, ?)
        AS new_record
        ON DUPLICATE KEY UPDATE status = new_record.status, school = new_record.school`;

            return connection.query(sql, [class_name, student_name, school, phone, date, status]);
        });

        await Promise.all(promises);
        await connection.commit();
        res.status(200).json({ message: '출결 정보 저장 완료' });
    } catch (err) {
        await connection.rollback();
        console.error('DB 저장 오류:', err);
        res.status(500).json({ error: '출결 정보 저장 중 서버 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
});

// 출결 정보 불러오기 (분반 + 날짜)
router.get('/get', async (req, res) => {
    const { class_name, date } = req.query;
    if (!class_name || !date) {
        return res.status(400).json({ error: '분반 및 날짜는 필수입니다.' });
    }

    try {
        const [rows] = await db.query(
            `SELECT student_name, phone, school, status FROM attendance WHERE class_name=? AND date=?`,
            [class_name, date]
        );
        res.json(rows);
    } catch (err) {
        console.error('출결 조회 오류:', err);
        res.status(500).json({ error: '출결 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
