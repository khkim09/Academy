const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../db');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-roster', upload.single('rosterFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '엑셀 파일이 필요합니다.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        let totalProcessed = 0;
        let totalAdded = 0;
        let sheetsProcessed = 0;

        for (const sheetName of workbook.SheetNames) {
            // [핵심 수정] 시트 이름을 기준으로 classes 테이블에 분반을 먼저 등록 (없으면 생성, 있으면 무시)
            await connection.query('INSERT IGNORE INTO classes (class_name) VALUES (?)', [sheetName]);

            sheetsProcessed++;

            const worksheet = workbook.Sheets[sheetName];
            const students = xlsx.utils.sheet_to_json(worksheet, { defval: "" }); // 빈 셀도 처리

            if (students.length === 0) continue;

            totalProcessed += students.length;

            const values = students
                .filter(student => student['이름'] && student['전화번호']) // 이름과 전화번호가 모두 있는 데이터만 필터링
                .map(student => [
                    sheetName,
                    student['이름'],
                    String(student['전화번호']).trim(),
                    student['학교'] || ''
                ]);

            if (values.length === 0) continue;

            const sql = 'INSERT IGNORE INTO class_rosters (class_name, student_name, phone, school) VALUES ?';
            const [result] = await connection.query(sql, [values]);
            totalAdded += result.affectedRows;
        }

        await connection.commit();

        res.status(200).json({
            message: `총 ${sheetsProcessed}개 시트 처리 완료.`,
            totalCount: totalProcessed,
            addedCount: totalAdded,
            skippedCount: totalProcessed - totalAdded,
        });

    } catch (err) {
        await connection.rollback();
        console.error('엑셀 업로드 처리 오류:', err);
        res.status(500).json({ error: err.message || '파일 처리 중 오류가 발생했습니다. 엑셀 양식을 확인해주세요.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
