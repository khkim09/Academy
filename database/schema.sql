-- 데이터베이스가 없다면 'academy'라는 이름으로 생성합니다.
CREATE DATABASE IF NOT EXISTS academy;

-- 'academy' 데이터베이스를 사용합니다.
USE academy;

/*
 1. 분반 관리를 위한 `classes` 테이블 생성
 - 프론트엔드에서 분반 목록을 동적으로 불러오고, 새로운 분반을 추가하는 기능을 위해 필요합니다.
 - class_name은 고유해야 하므로 UNIQUE 제약조건을 추가합니다.
 */
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
 2. 출결 관리를 위한 `attendance` 테이블 수정
 - (class_name, student_name, phone, date) 조합을 UNIQUE KEY로 설정합니다.
 - 이 제약조건은 특정 날짜에 한 학생의 출결 데이터가 중복으로 쌓이는 것을 방지하고,
 '저장' 버튼을 여러 번 눌러도 데이터가 하나로 유지되도록(INSERT 또는 UPDATE) 보장합니다.
 */
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    student_name VARCHAR(50) NOT NULL,
    school VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('출석', '결석') NOT NULL,
    -- 이 부분이 수정/추가된 핵심 제약조건입니다.
    UNIQUE KEY `unique_attendance_record` (`class_name`, `student_name`, `phone`, `date`)
);

-- 만약 이미 `attendance` 테이블을 생성했다면 아래의 ALTER 구문을 실행하여 UNIQUE KEY를 추가할 수 있습니다.
-- ALTER TABLE attendance ADD UNIQUE KEY `unique_attendance_record` (`class_name`, `student_name`, `phone`, `date`);
/*
 기존 scores, students 테이블 (변경 없음)
 */
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