# 📚 WordFlash

영어 단어를 플래시카드 방식으로 암기하는 웹 앱입니다.
CEFR 기준으로 정제된 **7,988개** 단어를 수록하고 있으며, 발음 듣기와 암기 추적 기능을 제공합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 플래시카드 플립 | 카드를 탭하면 3D 애니메이션으로 한국어 뜻이 표시됩니다 |
| 예문 자동 읽기 | 카드를 뒤집으면 예문을 영어로 자동 읽어줍니다 |
| 발음 듣기 | 앞/뒷면 모두 버튼으로 단어 발음을 들을 수 있습니다 (Web Speech API) |
| 암기 추적 | 암기 완료 버튼으로 상태를 저장하고 나중에 필터링할 수 있습니다 |
| 검색 | 영어 단어 또는 한국어 뜻으로 검색 가능합니다 |
| 필터 | 전체 / 미암기 / 암기 완료로 분류해서 볼 수 있습니다 |
| 랜덤 시작 | 앱 실행 시 매번 다른 단어부터 시작합니다 |
| 반응형 UI | 모바일, 태블릿, 데스크톱 모두 지원합니다 |

---

## 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (`better-sqlite3`)
- **Speech**: Web Speech API (브라우저 내장)

---

## 데이터베이스 구조

```sql
CREATE TABLE vocabulary (
  id            INTEGER PRIMARY KEY,
  word          TEXT NOT NULL,
  part_of_speech TEXT,
  meaning_kr    TEXT NOT NULL,
  example_en    TEXT,
  is_memorized  INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. vocabulary.db 파일을 프로젝트 루트에 위치시키기

# 3. 개발 서버 실행
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

---

## API

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/words` | 단어 목록 조회 |
| `PATCH` | `/api/words/[id]` | 암기 상태 업데이트 |

### GET `/api/words` 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `page` | number | 페이지 번호 (기본값: 1) |
| `limit` | number | 페이지당 단어 수 (기본값: 20) |
| `search` | string | 영어/한국어 검색어 |
| `memorized` | boolean | `true`: 암기 완료, `false`: 미암기 |

---

## OCI 배포 (VM.Standard.A1.Flex)

Oracle Cloud Free Tier의 Ampere A1 인스턴스에 배포하는 방법입니다.

### 1. VM 환경 세팅

```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치
sudo npm install -g pm2
```

### 2. 앱 배포

```bash
git clone https://github.com/Taewoo-HN/NewWordApp.git
cd NewWordApp/webapp

npm install
npm run build

# vocabulary.db를 서버에 업로드 (scp 등 이용)
# scp vocabulary.db user@<VM-IP>:~/NewWordApp/webapp/

pm2 start npm --name "wordflash" -- start
pm2 save
pm2 startup
```

### 3. 포트 개방 (OCI 보안 규칙)

OCI 콘솔 → VCN → 보안 목록에서 **TCP 3000** (또는 80) Ingress 규칙 추가

> **참고**: `vocabulary.db`는 `.gitignore`에 포함되어 있어 Git으로 관리되지 않습니다.
> 서버에 직접 업로드하거나 별도로 관리하세요.

---

## 프로젝트 구조

```
webapp/
├── app/
│   ├── api/
│   │   └── words/
│   │       ├── route.ts          # GET 단어 목록
│   │       └── [id]/route.ts     # PATCH 암기 상태
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # 메인 페이지
├── components/
│   └── FlashCard.tsx             # 플래시카드 컴포넌트
├── lib/
│   └── db.ts                     # SQLite 연결
├── public/
│   └── logo.svg
└── vocabulary.db                 # (gitignore, 로컬/서버 전용)
```
