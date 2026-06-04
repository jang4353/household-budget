# 부부 가계부 MVP — 프로젝트 컨텍스트

## 프로젝트 목표
부부가 함께 쓰는 공유 가계부. MVP v1은 1인 가계부 (인증 + 거래 CRUD + 월별 합계).

## 기술 스택
- Next.js 16 (App Router, JavaScript)
- Supabase (Auth + DB + RLS)
- Tailwind CSS v4
- Vercel (배포 예정)

## 설계 원칙
- v1은 API Routes 없음. 브라우저에서 Supabase 클라이언트 직접 호출. RLS가 보안 담당.
- 카테고리는 DB 테이블 없이 constants/categories.js 고정 목록으로 관리.
- 인증은 클라이언트 세션 확인 방식 (useEffect + supabase.auth.getSession()).

## 현재 완료된 작업 (2026-06-04 기준)
- [x] Next.js 프로젝트 생성 (Tailwind 포함)
- [x] app/page.js — mock 데이터 기반 홈 화면 구현
- [x] components/MonthlySummary.js — 수입/지출/순수익 카드
- [x] components/TransactionList.js — 날짜별 거래 목록
- [x] components/TransactionItem.js — 거래 항목 한 줄
- [x] lib/supabase.js — Supabase 클라이언트 초기화
- [x] .env.local — Supabase URL + anon key 설정 완료
- [x] Supabase 연결 확인 완료

## 다음 작업 (Week 1 Day 3~4)
1. Supabase 대시보드에서 transactions 테이블 생성 + RLS 설정
2. app/(auth)/signup/page.js — 회원가입 페이지
3. app/(auth)/login/page.js — 로그인 페이지
4. app/(dashboard)/layout.js — 네비게이션 바 + 세션 확인
5. app/(dashboard)/transactions/page.js — 실제 DB 연동 거래 목록

## 완료 기준 (Week 1 Day 3~4)
- /signup 에서 회원가입 → /transactions 이동
- /login 에서 로그인 → /transactions 이동
- 로그아웃 후 /transactions 접근 → /login 자동 이동

## 참고 설계 문서
C:\git_project\ai_edu\docs\TECH_DESIGN.md
