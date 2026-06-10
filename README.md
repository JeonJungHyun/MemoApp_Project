# MemoApp

React와 Express로 만든 간단한 메모 애플리케이션입니다. 프론트엔드에서 메모를 작성하고, 백엔드 API를 통해 메모 목록 조회, 추가, 삭제, 중요 표시 토글을 처리합니다.

## 주요 기능

- 메모 제목과 내용을 입력해 새 메모 추가
- 메모 목록 조회
- 메모 삭제
- 메모 중요 표시 토글
- 중요 메모만 보기
- 제목 또는 내용 기준 검색
- 메모 생성 시간 표시

## 프로젝트 구조

```text
MemoApp/
  backend/
    package.json
    server.js
  frontend/
    package.json
    src/
      App.jsx
      App.css
      index.css
      main.jsx
```

## 기술 스택

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- CORS
- Nodemon

## 실행 방법

### 1. 백엔드 실행

```bash
cd backend
npm install
npm run dev
```

백엔드는 기본적으로 `http://localhost:5000`에서 실행됩니다.

### 2. 프론트엔드 실행

새 터미널에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

Vite 개발 서버가 안내하는 주소로 접속하면 앱을 확인할 수 있습니다.

## API 정리

### 메모 목록 조회

```http
GET /memos
```

현재 저장된 메모 목록을 반환합니다.

### 메모 추가

```http
POST /memos
Content-Type: application/json
```

요청 예시:

```json
{
  "title": "메모 제목",
  "content": "메모 내용",
  "createdAt": "2026-06-10T00:00:00.000Z"
}
```

### 메모 삭제

```http
DELETE /memos/:id
```

전달한 `id`에 해당하는 메모를 삭제합니다.

### 중요 표시 토글

```http
PATCH /memos/:id
```

전달한 `id`에 해당하는 메모의 `important` 값을 반대로 변경합니다.

## 현재 구현 상태

- 백엔드는 메모 데이터를 서버 메모리 안의 배열로 관리합니다.
- 서버를 재시작하면 새로 추가한 메모는 초기화됩니다.
- 프론트엔드는 `http://localhost:5000/memos` API를 직접 호출합니다.
- 일부 기존 한글 문자열과 주석이 깨져 보일 수 있어 인코딩 정리가 필요합니다.

## 다음에 개선할 수 있는 부분

- 데이터베이스 연동으로 메모 영구 저장
- 메모 수정 기능 추가
- API 주소를 환경 변수로 분리
- 깨진 한글 문자열과 주석 정리
- 입력값 검증과 에러 처리 강화
