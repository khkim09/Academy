CREATE DATABASE IF NOT EXISTS academy;

USE academy;

CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50),
    student_name VARCHAR(50),
    school VARCHAR(50),
    phone VARCHAR(20),
    date DATE,
    status ENUM('출석', '결석') NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50),
    round VARCHAR(20),
    student_name VARCHAR(50),
    phone VARCHAR(20),
    school VARCHAR(50),
    test_score INT,
    total_question INT,
    wrong_questions TEXT,
    assignment1 CHAR(1),
    assignment2 CHAR(1),
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    school VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);