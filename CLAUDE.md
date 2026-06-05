# 부부 가계부 MVP — 프로젝트 컨텍스트

## 프로젝트 목표
부부가 함께 쓰는 공유 가계부. MVP v1은 1인 가계부 (인증 + 거래 CRUD + 통계). v1.1에서 초대 코드 기반 부부 연결 추가 예정.

## 기술 스택
- Next.js 16 (App Router, JavaScript)
- Supabase (Auth + DB + RLS)
- Tailwind CSS v4
- recharts (통계 차트)
- Vercel (배포 예정)

## 설계 원칙
- v1은 API Routes 없음. 브라우저에서 Supabase 클라이언트 직접 호출. RLS가 보안 담당.
- 카테고리는 DB 테이블 없이 constants/categories.js 고정 목록으로 관리.
- 인증은 클라이언트 세션 확인 방식 (useEffect + supabase.auth.getSession()).
- UI는 모바일 우선으로 구성. max-w-md 기준.
- 거래 관리(/transactions)와 통계(/statistics)는 별도 페이지로 분리.
- API Routes는 부부 공유나 AI 기능이 필요해질 때 도입.

## 현재 완료된 작업 (2026-06-05 기준)
- [x] 인증: 회원가입, 로그인, 로그아웃, dashboard 세션 보호
- [x] 거래 CRUD: 입력, 목록 조회, 수정, 삭제
- [x] 월별 필터: ◀ ▶ 이동, 선택 월 DB 조회
- [x] 월별 요약: MonthlySummary (수입/지출/순수익)
- [x] 통계 페이지 분리: /statistics
- [x] 카테고리별 지출 비중: recharts 도넛 그래프

## 다음 작업 (Mission 10~)
- Mission 10: 하단 탭바 + /assets 페이지
- Mission 11: 누적 순자산 그래프
- Mission 12: 부부 초대 코드
- Mission 13: 함께 보기 / 나 / 배우자 필터

## 상세 설계 문서
C:\git_project\ai_edu\docs\TECH_DESIGN.md
