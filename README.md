# 📚 WordFlash

영어 단어를 플래시카드 방식으로 암기하는 웹 앱입니다.
CEFR 기준으로 정제된 **7,988개** 단어를 수록하고 있으며, 발음 듣기와 암기 추적 기능을 제공합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 플래시카드 플립 | 카드를 탭하면 3D 애니메이션으로 한국어 뜻이 표시됩니다 |
| 예문 자동 읽기 | 카드를 뒤집으면 예문을 영어로 자동 읽어줍니다 |
| 발음 듣기 | 앞/뒷면 모두 버튼으로 단어 발음을 들을 수 있습니다 |
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
└── public/
    └── logo.svg
```
