// 서버 코드
const express = require('express');
const router = express.Router();
const db = require('../db');

// --- 분반 관리 ---

// GET: 모든 분반 목록 불러오기
router.get('/classes', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT class_name FROM classes ORDER BY class_name ASC'
        );
        const classNames = rows.map(row => row.class_name);
        res.json(classNames);
    } catch (err) {
        console.error('DB 분반 목록 조회 오류:', err);
        res.status(500).json({ error: '분반 목록을 불러오는 중 서버 오류가 발생했습니다.' });
    }
});

// POST: 새 분반 추가하기 ('신규 등록' 페이지에서 사용될 API)
router.post('/classes', async (req, res) => {
    const { className } = req.body;
    if (!className) {
        return res.status(400).json({ error: '분반 이름은 필수입니다.' });
    }

    try {
        await db.query(
            'INSERT INTO classes (class_name) VALUES (?)', [className]
        );
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

// 출결 정보 저장 (트랜잭션 및 별칭 사용)
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
            const sql = `
                INSERT INTO attendance (class_name, student_name, school, phone, date, status)
                VALUES (?, ?, ?, ?, ?, ?)
                AS new_record
                ON DUPLICATE KEY UPDATE status = new_record.status, school = new_record.school
            `;

            return connection.query(sql,
                [class_name, student_name, school, phone, date, status]);
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

// 출결 정보 불러오기 (분반 + 날짜) + 전체 분반 한 번에 조회
router.get('/get', async (req, res) => {
    const { class_name, date } = req.query;
    if (!date) return res.status(400).json({ error: '날짜는 필수입니다.' });

    try {
        let query;
        const params = [date];

        // '전체 분반' 또는 '특정 분반'에 따라 분기
        if (class_name === '전체 분반') {
            query = `
                SELECT
                    r.class_name,
                    r.student_name,
                    r.phone,
                    r.school,
                COALESCE(a.status, '결석') AS status
                FROM class_rosters AS r
                LEFT JOIN attendance AS a
                ON r.class_name = a.class_name AND r.phone = a.phone AND a.date = ?
                ORDER BY r.class_name, r.student_name;
            `;
        } else if (class_name) {
            query = `
                SELECT
                    r.class_name,
                    r.student_name,
                    r.phone,
                    r.school,
                COALESCE(a.status, '결석') AS status
                FROM class_rosters AS r
                LEFT JOIN attendance AS a
                ON r.class_name = a.class_name AND r.phone = a.phone AND a.date = ?
                WHERE r.class_name = ?
                ORDER BY r.student_name;
            `;
            params.push(class_name);
        } else {
            return res.json([]);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('출결 조회 오류:', err);
        res.status(500).json({ error: '출결 정보를 불러오는 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
