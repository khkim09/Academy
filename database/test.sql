-- DB에 원활하게 저장되는지 테스트용 script
USE academy;

-- 1. 테스트용 분반(class) 데이터 2건 추가
INSERT INTO
    classes (class_name)
VALUES
    ('일 대찬 1400-1700'),
    ('월 명인 1800-2130') ON DUPLICATE KEY
UPDATE
    class_name = class_name;

-- 2. 오늘 날짜로 테스트용 출결(attendance) 데이터 3건 추가
INSERT INTO
    attendance (
        class_name,
        student_name,
        school,
        phone,
        date,
        status
    )
VALUES
    (
        '일 대찬 1400-1700',
        '김민준',
        '대찬고',
        '010-1234-5678',
        CURDATE(),
        '출석'
    ),
    (
        '일 대찬 1400-1700',
        '이서연',
        '명인고',
        '010-2345-6789',
        CURDATE(),
        '출석'
    ),
    (
        '일 대찬 1400-1700',
        '박도윤',
        '대찬고',
        '010-3456-7890',
        CURDATE(),
        '결석'
    ) AS new_data ON DUPLICATE KEY
UPDATE
    school = new_data.school,
    status = new_data.status;