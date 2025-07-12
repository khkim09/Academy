-- academy 데이터베이스가 없다면 생성
CREATE DATABASE IF NOT EXISTS academy DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE academy;

-- 학생 테이블
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    school VARCHAR(50),
    class VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 출결 테이블
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('출석', '결석', '지각') DEFAULT '출석',
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 성적 테이블
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    round INT NOT NULL,
    subject VARCHAR(50),
    score INT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 오답노트 테이블
CREATE TABLE IF NOT EXISTS wrong_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    round INT NOT NULL,
    question TEXT,
    student_answer TEXT,
    correct_answer TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);