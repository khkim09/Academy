const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// 라우터 등록

// 1. 출결 관리용 라우터
const attendanceRoutes = require('./routes/attendance');
app.use('/api/attendance', attendanceRoutes);

// 2. 성적 입력용 라우터
const scoreRoutes = require('./routes/scores');
app.use('/api/scores', scoreRoutes);

app.get('/', (req, res) => {
    res.send('API 서버가 정상 작동 중입니다.');
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
