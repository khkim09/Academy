const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const db = require('../db');

router.get('/comprehensive-report', async (req, res) => {
    const { className } = req.query;
    if (!className) {
        return res.status(400).json({ error: '분반 이름은 필수입니다.' });
    }

    try {
        // 1. 해당 분반의 모든 학생 정보 가져오기
        const [students] = await db.query('SELECT student_name, phone, school FROM class_rosters WHERE class_name = ? ORDER BY student_name', [className]);
        if (students.length === 0) {
            return res.status(404).json({ error: '해당 분반에 학생이 없습니다.' });
        }
        const studentPhones = students.map(s => s.phone);

        // 2. 학생들의 모든 출결 및 성적 기록 가져오기
        const [attendance] = await db.query('SELECT phone, date, status FROM attendance WHERE phone IN (?)', [studentPhones]);
        const [scores] = await db.query('SELECT phone, round, date, test_score, assignment1, assignment2 FROM scores WHERE phone IN (?)', [studentPhones]);

        // 3. 데이터를 학생별, 날짜/회차별로 가공
        const studentDataMap = new Map();
        students.forEach(s => studentDataMap.set(s.phone, { base: s, records: new Map() }));

        attendance.forEach(a => {
            if (studentDataMap.has(a.phone)) {
                const dateStr = a.date.toISOString().split('T')[0];
                const studentRecords = studentDataMap.get(a.phone).records;
                if (!studentRecords.has(dateStr)) studentRecords.set(dateStr, {});
                studentRecords.get(dateStr).attendance = a.status;
            }
        });

        scores.forEach(s => {
            if (studentDataMap.has(s.phone)) {
                const dateStr = s.date ? s.date.toISOString().split('T')[0] : `(날짜없음-${s.round}회차)`;
                const studentRecords = studentDataMap.get(s.phone).records;
                if (!studentRecords.has(dateStr)) studentRecords.set(dateStr, {});
                studentRecords.get(dateStr).score = s.test_score;
                studentRecords.get(dateStr).assignment1 = s.assignment1;
                studentRecords.get(dateStr).assignment2 = s.assignment2;
            }
        });

        // 4. 엑셀 파일 생성
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(className);

        worksheet.columns = [
            { header: '이름', key: 'name', width: 15 },
            { header: '전화번호', key: 'phone', width: 20 },
            { header: '학교', key: 'school', width: 20 },
        ];

        // 동적 헤더 생성 (날짜/회차)
        const dateHeaders = new Set();
        studentDataMap.forEach(data => {
            data.records.forEach((_, key) => dateHeaders.add(key));
        });
        const sortedDateHeaders = Array.from(dateHeaders).sort();

        sortedDateHeaders.forEach(header => {
            worksheet.getColumn(`${header} (출결)`).width = 12;
            worksheet.getColumn(`${header} (점수)`).width = 12;
            worksheet.getColumn(`${header} (과제1)`).width = 12;
            worksheet.getColumn(`${header} (과제2)`).width = 12;
        });

        // 학생 데이터 행 추가
        students.forEach(s => {
            const data = studentDataMap.get(s.phone);
            const row = { name: s.student_name, phone: s.phone, school: s.school };
            sortedDateHeaders.forEach(header => {
                const record = data.records.get(header) || {};
                row[`${header} (출결)`] = record.attendance || '-';
                row[`${header} (점수)`] = record.score ?? '-';
                row[`${header} (과제1)`] = record.assignment1 || '-';
                row[`${header} (과제2)`] = record.assignment2 || '-';
            });
            worksheet.addRow(row);
        });

        // 5. 파일 다운로드 응답
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(className)}_종합리포트.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error('엑셀 내보내기 오류:', err);
        res.status(500).send('엑셀 파일 생성 중 오류가 발생했습니다.');
    }
});

module.exports = router;
