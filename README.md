## 학원 학생 관리 시스템 (웹/앱)

* 프론트 - React
* 백엔드 - Node.js + Express
* 데이터베이스 - MySQL
* 배포 - 추후 지정


## 사용법
### 1. 신규 등록 페이지
<img width="1289" height="809" alt="image" src="https://github.com/user-attachments/assets/43872909-f751-4552-bac5-5f5fec4e2ad9" />

- **"업로드 템플릿 다운로드"** 버튼 : 업로드 할 학생부 양식 다운로드
- **"전체 학생 정보 다운로드"** 버튼 : DB에 저장된 학생부 다운 ( 학생 명단은 추가 가능, but **성적 데이터 수정 불가!!** )
- **"파일 업로드**" : 알맞은 학생부 양식 업로드
  
    +) 업로드 누르면 결과 나옴 (ex. 총 처리 학생 : 3명, 신규 등록 성공 : 3명, 중복으로 제외 : 0명)
  <img width="856" height="339" alt="image" src="https://github.com/user-attachments/assets/ff88a323-d6bc-41a3-8b7a-99672e2873d4" />


### 2. 학생 관리 페이지 - 출결 관리
1) 전체 분반 학생 출결
   - 여기서는 출결 상태 변경 불가. 단순 조회만 가능 (날짜, 학생 이름으로 검색)
   <img width="1905" height="903" alt="image" src="https://github.com/user-attachments/assets/67142d17-1acf-40ad-8aa4-a189ccd3a751" />

2) 각 분반 학생 출결 관리
    - 우상단 분반 선택 후, 출결 관리 (저장 버튼 필수)
    - 일괄 출석 누르고, 결석생 이름만 출결 체크 제거하는 방향이 빠름.
  <img width="1910" height="903" alt="image" src="https://github.com/user-attachments/assets/7450358c-6c3d-4ee3-89e2-9df2e02a273a" />

### 3. 성적 입력 페이지 - 성적 입력 및 간단 조회
1) 성적 입력
       - 좌상단에 회차 선택에서 회차 등록 후, 성적 입력
   <img width="1912" height="905" alt="image" src="https://github.com/user-attachments/assets/2c563bde-d765-44e1-b8be-6783a035f377" />

2) 틀린 문항 체크
       - omr 카드와 같은 기능으로 틀린 문항 체크 or 좌측에 쉼표를 통해 기입 (맞은 개수 자동 계산 있음)
   <img width="1904" height="898" alt="image" src="https://github.com/user-attachments/assets/7ed4fd04-6d7b-4413-aa05-7123f96977c4" />

### 4. 성적 조회 페이지 - 성적 조회
1) 전체 분반 조회
       - 모든 기록 다 나옴.
   <img width="1913" height="907" alt="image" src="https://github.com/user-attachments/assets/94a50339-a86b-416e-a13f-1e03f0f7cc02" />
2) 분반별 조회
   <img width="1911" height="906" alt="image" src="https://github.com/user-attachments/assets/aedc53ac-01f4-4cfc-8d25-69b69952ada8" />


### 주의 사항
1. 로컬 테스트를 위해서는 다음 코드 작성 필요
    > client/package.json
    
    ``` json
    "proxy": "http://localhost:5000"
    ```
2. DB 내 테스트 데이터 반드시 삭제 후 시작 필요
   > MySQL - AWS Academy DB 접속 후 아래 코드 실행
   ```sql
   use academy;

    -- 데이터 간의 연결(외래 키) 제약 조건을 일시적으로 비활성화합니다.
    SET FOREIGN_KEY_CHECKS = 0;
    
    -- 각 테이블의 모든 데이터를 깨끗하게 삭제하고 초기화합니다.
    TRUNCATE TABLE attendance;
    TRUNCATE TABLE scores;
    TRUNCATE TABLE class_rosters;
    TRUNCATE TABLE classes;
    
    -- 비활성화했던 외래 키 제약 조건을 다시 활성화합니다.
    SET FOREIGN_KEY_CHECKS = 1;
    ```
