CREATE DATABASE IF NOT EXISTS academy;

USE academy;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    phone VARCHAR(20),
    school VARCHAR(50),
    class VARCHAR(50) -- 분반 정보
);

CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE,
    status VARCHAR(10),
    -- 출석, 결석 등
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(50),
    round INT,
    score INT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);