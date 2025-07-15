-- 데이터베이스가 없다면 'academy'라는 이름으로 생성합니다.
CREATE DATABASE IF NOT EXISTS academy;

-- 'academy' 데이터베이스를 사용합니다.
USE academy;

/*
 [신설] 1. 분반별 학생 명단(Roster)을 위한 `class_rosters` 테이블
 - 어떤 학생이 어떤 분반에 소속되어 있는지 영구적으로 관리합니다.
 - '신규 등록' 기능은 이 테이블을 대상으로 학생을 추가/수정/삭제해야 합니다.
 - (class_name, phone) 조합을 UNIQUE KEY로 설정하여 한 학생이 같은 분반에 중복 등록되는 것을 방지합니다.
 */
CREATE TABLE IF NOT EXISTS class_rosters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    student_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    school VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_roster_entry` (`class_name`, `phone`)
);

/*
 2. 기존 `attendance` 테이블 (역할 변경)
 - 이제 이 테이블은 순수하게 '그날그날의 출결 상태'만 기록하는 용도로 사용됩니다.
 */
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    student_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('출석', '결석') NOT NULL,
    -- 이 키는 동일한 학생이 같은 날짜에 중복 기록되는 것을 방지합니다.
    UNIQUE KEY `unique_attendance_record` (`class_name`, `phone`, `date`)
);

/*
 기존 classes, scores, students 테이블 (변경 없음)
 */
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL UNIQUE
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
    memo TEXT
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    school VARCHAR(100)
);