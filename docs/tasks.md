# 작업 목록 (Tasks)

> AI와 사람이 **지금 무엇을 할 차례인지** 확인하는 문서입니다.
> 위에서부터 순서대로 하나씩 진행하고, 끝나면 `[x]`로 체크합니다.
> 각 작업 옆의 `(US-xx)`는 `requirements.md`의 사용자 스토리 번호, `[ME1]` 등은 Figma 화면 ID입니다.
> 페이지를 만들 때마다 IA(`src/data/iaData.ts`) 등록, 공통 컴포넌트를 만들거나 바꿀 때마다 Guide 갱신을 같은 작업 안에서 합니다 (`AGENTS.md` 6.3, 6.4).

---

## 진행 상태
- **현재 단계**: Phase 3
- **다음 작업**: 3-23 (진행 중: Figma TR1 확인 완료, 에셋만 저장 — `iconMessage`·`iconTrackerStart`·`iconPin`.svg, `images/bgTrackerMap.jpg`. 화면 코드는 아직 없음. 상태 8가지: Coming Soon, 대회없음 코치마크·진입, 대회있음 코치마크·진입, 팝업 TR1.1.1·TR1.1.2·TR1.1.3(Popup 재사용))
- **작업 순서 변경 (2026-11-17, 사용자 요청)**: 각 메뉴 메인 화면만 먼저 진행 → 3-7 홈 → 3-18 대회 목록 → 3-23 트래커 메인 → 공통 3-27 웹페이지 에러 → 3-28 이메일 템플릿. 나머지(3-5, 3-6, 3-8 ~ 3-17, 3-19 ~ 3-22, 3-24 ~ 3-26)는 그 뒤에 진행
- **막힌 부분**: 없음

---

## Phase 0. 결정 사항 확정

- [x] 0-1. `requirements.md` 7장 미결정 사항 확정 (퍼블리싱 범위, 경로, 기준 화면 너비, 태블릿·PC 처리, iOS/AOS, 이메일 템플릿, 상태별 화면 확인 방법, 폰트)
- [x] 0-2. Figma 공통 요소 확인: 색상, 텍스트 스타일, `Top Bar`·`Bottom Bar` 구성과 화면별 표시 여부, 버튼·입력·팝업 스타일 → `design.md` 6장, 6.0절
- [x] 0-3. `design.md` 갱신: 화면 구조, 레이아웃(상단 바·하단 탭바), 컴포넌트 명세, 데이터 타입, 디자인 토큰을 러너블 기준으로 변경
- [x] 0-4. `AGENTS.md` 1장 프로젝트 개요(이름, 설명, 대상 사용자) 작성

## Phase 1. 프로젝트 세팅

- [x] 1-1. Vite + React + TypeScript 프로젝트 생성 (`npm create vite@latest`)
- [x] 1-2. React Router 설치 및 `design.md` 1.3 폴더 구조대로 폴더 생성
- [x] 1-3. `types/index.ts`에 기본 타입 작성 (`design.md` 3번, IA 타입 `AGENTS.md` 6.3.3)
- [x] 1-4. `constants/index.ts`에 `ROUTES` 작성 (`requirements.md` 4장 경로 기준)
- [x] 1-5. 기본 템플릿 코드 정리 (Vite 예제 파일 삭제)
- [x] 1-6. Figma 에셋(로고, 아이콘, 이미지) 내보내기 → `assets/icons/`, `assets/images/`. 파비콘(앱 아이콘)도 `public/`에 추가하고 `index.html`에 연결
- [x] 1-7. `common.css` 기본 구성 (디자인 토큰, 리셋, 폰트) — `#siteWrap` 범위. 폰트 로딩 방식 결정
- [x] 1-8. IA 페이지 `/ia` 구현 (`AGENTS.md` 6.3.5 체크리스트, `IA_INFO.title`은 러너블, Guide 항목 최상단 고정)
- [x] 1-9. Guide 페이지 `/guide` 기본 틀 구현 (`AGENTS.md` 6.4)
- [x] 1-10. `npm run build` 통과 확인

## Phase 2. 공통 레이아웃·컴포넌트

> 컴포넌트를 만들 때마다 `/guide`에 등록합니다.

- [x] 2-1. `Layout`(`hasBottomBar`), `TopBar`, `BottomBar` 구현 (`design.md` 1.2, 6.0)
- [x] 2-2. 라우팅 설정 (`/ia`, `/guide` 독립 라우트 + `TabLayout` / `PageLayout` 그룹, `design.md` 1.1.1)
- [x] 2-2-1. `usePageState` 훅 구현 (`?state=`, `?platform=`, `?step=`, `design.md` 9장)
- [x] 2-3. `Button` (기본·비활성 상태) + `FloatingButton`
- [x] 2-4. 입력 컴포넌트: `Input`(에러 메시지 포함), `Checkbox`, `Radio` (`Select`는 시안에 없어 제외)
- [x] 2-5. `Popup` (확인·취소 팝업, 안내 팝업)
- [x] 2-6. `Tabs`
- [x] 2-7. `NoData` (노데이터 화면)
- [x] 2-8. `Loading`, `TermsForm` (약관 폼) [CO 로딩, 약관폼] (US-11)

## Phase 3. 페이지 구현

> 각 페이지는 시안의 상태별 화면(입력 전/후, 에러, 노데이터 등)을 모두 재현합니다. 페이지를 만들면 IA에 등록합니다.

### 3-A. ME 회원
- [x] 3-1. 스플래시 `/splash` [MY1] (US-04)
- [x] 3-2. 로그인 `/login` [ME1] (US-01)
- [x] 3-3. 비밀번호 재설정 `/password/find`, `/password/reset` [ME1.1 ~ ME1.4] (US-02)
- [x] 3-4. 회원가입 `/signup` [ME2, ME2.1] (US-03)
- [ ] 3-5. 약관·추가 정보 `/signup/terms` [ME2.2.1 ~ ME2.3] (US-03)
- [ ] 3-6. 가입 완료 `/signup/complete` [ME2.4] (US-03)

### 3-B. MY 홈/마이
- [x] 3-7. 홈 `/` [MY3] (US-04)
- [ ] 3-8. 내 정보 `/my` [MY3.1] (US-04)
- [ ] 3-9. 프로필 수정 `/my/profile` [MY3.1.1] (US-05)
- [ ] 3-10. 설정 `/my/settings` [MY3.1.2 ~ MY3.1.2.6] (US-05)
- [ ] 3-11. 회원 탈퇴 `/my/withdraw` [MY3.1.2.3] (US-05)
- [ ] 3-12. 무료 참가권 `/my/coupons` [MY3.1.2.8] (US-05)
- [ ] 3-13. 전체 기록 `/my/records` [MY3.1.3] (US-06)
- [ ] 3-14. 트레이닝 기록 상세 `/my/records/detail` [MY3.1.4] (US-06)
- [ ] 3-15. 기록 제출 `/my/records/submit` [MY3.1.5, MY3.1.7] (US-06)
- [ ] 3-16. 대회 승인 기록 상세 `/my/race-records/detail` [MY3.1.6] (US-06)
- [ ] 3-17. 알림 `/notifications` [MY3.2] (US-06)

### 3-C. RA 레이스
- [x] 3-18. 대회 목록 `/races` [RA1] (US-07)
- [ ] 3-19. 대회 소개 `/races/detail` [RA2 ~ RA2.3.3] (US-07)
- [ ] 3-20. 참가 신청 6단계 `/races/apply` [RA3 ~ RA3.5] (US-08)
- [ ] 3-21. 참가 신청 완료 `/races/apply/complete` [RA3.6] (US-08)
- [ ] 3-22. 참가 신청 조회 `/races/application` [RA4 ~ RA4.5] (US-09)

### 3-D. TR 트래커
- [ ] 3-23. 트래커 메인 `/tracker` [TR1, TR1.1 ~ TR1.1.3] (US-10)
- [ ] 3-24. 일반 트래커 `/tracker/training` [TR1.2, TR1.4] (US-10)
- [ ] 3-25. 대회 트래커 `/tracker/race` [TR1.3, TR1.4] (US-10)
- [ ] 3-26. 베타 테스트 의견 `/beta-feedback` [TR2, TR2.1] (US-10)

### 3-E. CO 공통
- [ ] 3-27. 웹페이지 에러 `/error` [CO2.5] (US-11)
- [ ] 3-28. 이메일 템플릿 정적 HTML `public/email/*.html` 7개 [CO3 ~ CO3.9] (US-11, `AGENTS.md` 9장 예외)
- [ ] 3-29. 상태별 화면 쿼리 파라미터(`?state=`, `?platform=`) 동작과 IA 상태별 링크 등록 확인

## Phase 4. 마무리

- [ ] 4-1. 반응형 점검 (360px / 768px / 1024px, 화면 너비에 맞게 늘어나는지)
- [ ] 4-2. 접근성 점검 (`alt`, 키보드 포커스, 아이콘 버튼 `aria-label`)
- [ ] 4-3. 하드코딩된 색상, 텍스트를 변수와 상수로 정리
- [ ] 4-4. `console.log` 제거, `npm run lint` 통과
- [ ] 4-5. `npm run build` 최종 확인
- [ ] 4-6. 문서와 실제 코드가 일치하는지 확인 (requirements, design 업데이트)
- [ ] 4-7. IA(`src/data/iaData.ts`) 화면 목록·경로·상태가 실제 라우트와 tasks.md 완료 기록과 일치하는지 확인
- [ ] 4-8. Guide에 모든 공통 컴포넌트가 등록되어 있고 Props·예제가 실제 구현과 일치하는지 확인

---

## 완료 기록

| 날짜 | 작업 | 메모 |
|---|---|---|
| 2026-11-16 | requirements.md 작성 | Figma 시안 기준 사용자 스토리 11개, 페이지 경로 제안안 작성 |
| 2026-11-16 | tasks.md 갱신 | requirements.md 기준으로 작업 목록 재구성 |
| 2026-11-16 | 0-1 미결정 사항 확정 | 범위·경로·반응형·iOS/AOS·이메일·상태 확인 방법 결정, AGENTS.md 9장에 이메일 예외 추가 |
| 2026-11-16 | 0-2 Figma 공통 요소 확인 | 색상 10개, 텍스트 스타일 9개, 공통 컴포넌트 14종 스펙을 design.md 6장에 기록. Top/Bottom Bar 표시 기준은 일부 추정이라 화면 구현 시 재확인 |
| 2026-11-16 | 0-3 design.md 갱신 | 레이아웃(TabLayout/PageLayout, sticky 바), 메뉴별 폴더 구조, 컴포넌트 14종 명세, 타입, usePageState, 반응형 제안안(6.2), ADR 작성 |
| 2026-11-16 | 0-4 AGENTS.md 프로젝트 개요 | 이름·설명·대상 사용자·디자인 원본 작성. Phase 0 완료 |
| 2026-11-16 | 1-1 Vite 프로젝트 생성 | create-vite 9.3.4 `react-ts`: React 19.3, Vite 8.3, TypeScript 7.0(strict 기본 켜짐), 린트는 oxlint. 패키지명 `runable-react`, `lang="ko"`, title 러너블. `npm run build`·`npm run lint` 통과 |
| 2026-11-16 | 1-2 React Router·폴더 생성 | `react-router-dom` 7.18 설치. 메뉴 그룹 폴더(pages/pub 5개, components/pub 4개), 공용 폴더, assets 하위 폴더, `public/email/` 생성. 개별 페이지·컴포넌트 폴더와 Ia/Guide 폴더는 해당 작업 때 생성. 빌드 통과 |
| 2026-11-16 | 1-3 공용 타입 작성 | `src/types/index.ts`: design.md 3장 타입 9개 + IA 타입 4개(AGENTS.md 6.3.3). tsc·빌드·린트 통과 |
| 2026-11-16 | 1-4 ROUTES 작성 | `src/constants/index.ts`: `ROUTES` 30개(requirements.md 4장과 스크립트로 대조해 일치), `EMAIL_TEMPLATES` 7개. 빌드·린트 통과 |
| 2026-11-16 | 1-5 Vite 예제 정리 | App.css, index.css, hero.png, react.svg, vite.svg, public/icons.svg, public/favicon.svg 삭제. main.tsx 전역 CSS import 제거, App.tsx 빈 컴포넌트로 교체, index.html 파비콘 링크 제거(1-6에서 앱 아이콘으로 추가). 빌드·린트 통과 |
| 2026-11-16 | 1-6 공통 에셋 (1일차) | Figma "Copy as SVG/PNG" → 클립보드로 저장(다운로드 미사용). `assets/icons/` 19개(아이콘 SVG 15, SNS PNG 4), `assets/images/` 로고 2개, `public/favicon.png`(64px) + index.html 연결. 빌드 통과 |
| 2026-11-17 | 1-6 공통 에셋 완료 | `iconClose`, `iconPlus`, `iconPasswordShow`, `iconInputComplete` 추가. `iconTabRaceOn`은 시안에 없어 `iconTabRaceOff` 색(#C2C2C2)만 Primary-500(#0132FD)으로 바꿔 만듦(사용자 결정). 최종 `assets/icons/` 24개, `assets/images/` 2개, 파비콘 1개. 빌드·린트 통과. 화면 전용 이미지(대회 사진, 지도 등)는 각 화면 작업 때 받음 |
| 2026-11-17 | 1-7 common.css 기본 구성 | `src/assets/css/common.css`: 01 토큰(design.md 6장 값, `#siteWrap`에 정의), 02 리셋·기본(`#siteWrap` 범위, `body:has(#siteWrap)`로 body 여백만 제거, `.blind`, `:focus-visible`), 03~07 구역 주석. `index.html`에 Google Fonts(Noto Sans KR 500·700) 링크. lightningcss 파싱 통과, 선택자 17개 모두 `#siteWrap` 범위 확인, 빌드·린트 통과. 아직 import하는 곳이 없어 화면 적용 확인은 2-1(Layout)에서 |
| 2026-11-17 | 1-8 IA 페이지 `/ia` | `Ia.tsx`(AGENTS.md 6.3.2 그대로 + `ia.css` import 1줄), `ia.css`(6.3.4 코드 블록을 스크립트로 그대로 추출), `iaData.ts`(제목 러너블, 메뉴 7개·36행: Guide 최상단, ME/MY/RA/TR/CO, 이메일 템플릿, 메모에 Figma 화면 ID, 전부 Undone), `App.tsx`에 BrowserRouter + `/ia` 독립 라우트. 상태별 링크 행은 각 화면 구현 때 추가. 확인: tsc·빌드·린트 통과, ia.css 선택자 모두 `#iaWrap` 범위, 브라우저에서 구성 5개·36행·필터(해제 0행/재체크 36행)·새 창 링크·hover 미리보기(400px, 고정)·콘솔 오류 없음. `/guide` 링크는 1-9 전까지 빈 화면. 개발 서버 설정 `.claude/launch.json` 추가 |
| 2026-11-17 | 1-9 Guide 페이지 `/guide` 기본 틀 | `Guide.tsx`(AGENTS.md 6.4 구조: guideSide·guideNav·guideContent, `GuideItem` 블록, 섹션 2개 "시작하기"·"공통 컴포넌트(등록 없음)"), `guide.css`(6.4.1 원본을 스크립트로 그대로 추출 + 추가 규칙: `body:has(.guideWrap)` 여백 제거, 글꼴, `.guideNav a.on`, `:focus-visible`, `scroll-margin-top`), `App.tsx`에 `/guide` 독립 라우트. 메뉴 활성: 해시 진입·클릭(부드러운 이동, 해시 갱신)·스크롤(화면 위 30% 기준, 페이지 끝이면 마지막 섹션) — 짧은 페이지에서 IntersectionObserver가 갱신되지 않아 scroll 이벤트 방식으로 변경. `aria-current="location"`. 확인: tsc·빌드·린트 통과, 브라우저에서 첫 진입·해시 진입·클릭·스크롤·Tab/Enter·포커스 표시·활성 1개 유지, IA Guide 링크 `/guide` 정상, `/ia` 여백 영향 없음. IA Guide 행 Done(2026-11-17) 처리 |
| 2026-11-17 | 1-10 빌드 확인 (Phase 1 완료) | `dist` 삭제 후 클린 빌드 통과(28 modules, JS 271KB/gzip 86KB, CSS 12KB), `tsc -b`·`npm run lint` 통과. 규칙 점검: `pub/` 밖 개발용 폴더 없음, CSS는 common·ia·guide 3개뿐, `console.log`·`any`·`function` 컴포넌트·JSX 인라인 style 없음, `main.tsx` 전역 CSS import 없음 |
| 2026-11-17 | 2-1 Layout·TopBar·BottomBar | `components/pub/layout/`에 `Layout`(`#siteWrap.siteScope` > `main#container` + BottomBar, common.css import), `TopBar`(`header#header`, `type: back\|close`, `onButtonClick`, `rightSlot`, 제목 h1, sticky), `BottomBar`(`footer#footer` > nav, NavLink 3개, 활성 시 On 아이콘·Primary-500, sticky, safe-area). Figma 재확인: Bottom Bar 전체 62px(구분선 1px #F5F5F5 + 7 + 46 + 8). `common.css` 범위를 `.siteScope`로 변경(Guide 실제 예제용, design.md ADR). Guide에 Layout·TopBar·BottomBar 섹션(Props 표·실제 예제·코드) 추가. 확인: tsc·빌드·린트 통과, common.css 선택자 범위 검사, 브라우저 측정값 Figma 일치(TopBar 56·12/16·gap12·H4, BottomBar 62·1px·7/8·탭46·C2), `/ia` 영향 없음, 콘솔 오류 없음. **미확인**: 탭 활성 전환과 실제 Layout 화면 높이는 라우트가 생기는 2-2에서 확인 → 2-2에서 확인 완료 |
| 2026-11-17 | 2-2 라우팅 설정 | `App.tsx`: `/ia`·`/guide` 독립 라우트, TabLayout(`<Layout hasBottomBar />`) 3개(홈·대회 목록·트래커 메인), PageLayout(`<Layout />`) 25개. 아직 화면이 없는 경로는 `element: null`(빈 Layout 표시) — 화면 구현 시 페이지 컴포넌트로 교체. 확인: ROUTES 30개 모두 한 번씩 등록, tsc·빌드·린트 통과. 브라우저(375×812): 탭 루트에서 BottomBar 화면 맨 아래(62px) 고정, 탭 클릭 시 경로·on·aria-current 전환(홈/레이스/트래커), 레이스 활성 아이콘 표시, `#siteWrap` 높이 = 화면 높이, PageLayout 경로(/login, /races/apply/complete)에는 BottomBar 없음, `/ia` 영향 없음, 콘솔 오류 없음 |
| 2026-11-17 | 2-2-1 usePageState 훅 | `src/hooks/usePageState.ts`: `useSearchParams`로 `?state=`(목록 외 값→defaultState), `?platform=`(aos 외→ios), `?step=`(1~stepCount 정수 외→1) 읽기, `setState`(replace)·`setStep`(기록 쌓음, 범위 보정), 기본값이면 쿼리 삭제. 확인: tsc·빌드·린트 통과. 임시 확인 화면(`/hook-check`)으로 브라우저 테스트 — 버튼 조작(error/default 전환, step 2→3, 99→6 보정, 뒤로가기로 이전 step), 주소 직접 입력(유효값 그대로, `foo`/`android`/`abc`/`7`/`2.5`는 기본값) 모두 정상. 테스트 후 임시 화면·라우트 삭제 확인. design.md 9장에 반환값·동작 보충 |
| 2026-11-17 | 2-3 Button·FloatingButton | Figma 확인: Button 속성(Size/Type/Combination/State/Line/Icon), 비활성 배경 Primary-200 #CCD6FF(primary만 존재), 카드용 작은 버튼(42·radius 4·Button(S)), Floating Button은 별도 컴포넌트(42·radius 40·Elevation 2, Move/더보기). `common/Button`(variant primary/secondary/outline, size l/m, icon, disabled, to→Link), `common/FloatingButton`(move/plus, to), CSS `.btn`·`.buttonGroup`·`.floatingBtn`, 토큰 추가(primary-200, text-button-s, radius-button-s, radius-pill, button-height-s). Guide에 Button·FloatingButton 섹션(Props·실제 예제·코드) 추가, "등록된 컴포넌트 없음" 섹션 제거. 확인: tsc·빌드·린트·CSS 범위 통과, 브라우저 측정값 Figma 일치(56/8/14px, 42/4/12px, 비활성 #CCD6FF 클릭 무시, Floating 42/40/그림자), Floating 보러가기 203px(Figma 201px, 글꼴 렌더링 차이). secondary·outline 비활성은 시안 없음 |
| 2026-11-17 | 2-4 Input·Checkbox·Radio | Figma 확인(ME2 회원가입, ME1 로그인, RA3.1·RA3.2 참가 신청, MY3.1.2.3 회원탈퇴): Text Field 구성·상태(입력 중/에러), 오른쪽 버튼(비활성 Gray-200 #CCCCCC), 남은 시간(Roboto 12 Danger), 안내 문구(C1 Gray-700), Checkbox Type Rectangle/Round, Radio Button(22px 원·12px 점). Select는 시안에 없어(성별·혈액형·사이즈 모두 Radio) 제외. 원형 체크 아이콘 2개 추가(`iconCheckboxRoundOn/Off.svg`). `common/Input`(라벨·필수·보조 문구·에러/안내·지우기·입력 확인·남은 시간·비밀번호 보기·오른쪽 버튼), `common/Checkbox`(숨긴 input + 원본 아이콘, rectangle/round), `common/Radio`(CSS 원·점, `.radioGroup` 2열). 토큰 gray-200, text-timer 추가. Guide에 3개 섹션(Props·직접 조작 가능한 예제·코드) 추가. 확인: tsc·빌드·린트·CSS 범위 통과, 브라우저에서 스타일 값 Figma 일치, 입력·지우기·비밀번호 보기·체크·라디오 클릭, 키보드(Space, 화살표)와 포커스 표시, aria-invalid·aria-describedby·role=alert 확인 |
| 2026-11-17 | 2-5 Popup | Figma 확인(MY3.1.2.2 로그아웃, MY3.1.2.3.1 탈퇴 확인, MY3.1.2.3.1.1 탈퇴 완료, MY3.1.2.4 설정 변경 안내): Dialog 속성(Type Bottomsheet, Text, Contents), 모서리 16·padding 32/24·간격 32, 텍스트 padding 24·gap 8, 버튼 padding 16·gap 8, 설명 B2 Gray-900 #3C3C3C(Copy as CSS로 확인)·강조 Primary-500, 부가 문구 C0 Gray-700. `common/Popup`(primaryButton 필수·secondaryButton 선택, description·comment·children, role=dialog·aria-modal·labelledby·describedby, ESC·Dim 클릭 닫기, 포커스 이동·Tab 순환·연 요소로 복귀, `body:has(.siteScope .popupDim)`로 스크롤 막기, 768px 이상 최대 너비 480), 토큰 gray-900 추가. Guide에 Popup 섹션(Props·팝업 3종 실제 열기·코드). 확인: tsc·빌드·린트·CSS 범위 통과, 브라우저에서 스타일 값 Figma 일치, 480px 가운데·하단 고정, ESC·Dim 클릭 닫힘(시트 내부 클릭은 유지), Tab/Shift+Tab 순환, 포커스 복귀, 스크롤 막기·해제, 3줄 제목 줄바꿈. Guide는 데스크톱 관리 화면이라 375px에서는 페이지가 축소 표시되어 모바일 모양은 실제 화면 구현 때 재확인 |
| 2026-11-17 | 2-6 Tabs | Figma 확인(MY3.1 내 정보): Tab 속성(Type Tab 02~04, On), 360×60·위 16·좌우 24, 탭 칸 글자 H4 + 16 + Bar 4px(radius 100, Primary-500), 아래 Line 1px Gray-50. `common/Tabs`(items·activeId·onChange·idPrefix·ariaLabel, role tablist/tab, aria-selected·aria-controls, 선택 탭만 tabindex 0, ←/→/Home/End 이동·선택), `utils/getTabIds`(탭·내용 id 공용 규칙), common.css에 `.siteScope [hidden]` 숨김 보정 추가. Guide에 Tabs 섹션(Props, 탭 2개·4개 예제 + 내용 영역, 코드). 확인: tsc·빌드·린트·CSS 범위 통과, 브라우저 측정값 Figma 일치(60 높이, 44 탭, 4px 밑줄, 1px 구분선, 4개 각 78px), 클릭 전환, 키보드 이동(끝↔처음 순환), 숨긴 내용 display none, ARIA 연결 확인. 대회 소개 탭 문구(공지·FAQ 등)는 예시이며 RA2 구현 때 시안 문구로 맞춤 |
| 2026-11-17 | 2-7 NoData | Figma 확인(홈 러닝 기록 없음 box, MY3.1 레이스 기록 없음 section, Link 컴포넌트 Size Small/Medium, Icon_16/Arrow). 아이콘 `iconChevronRight.svg` 내려받음. `common/TextLink`(label·size s/m·hasArrow·to·onClick, to 있으면 Link 아니면 button), `common/NoData`(message·variant box/section·action, 문구+액션을 `.noDataText`로 묶어 box 간격 8 / section 16), common.css에 `--space-8` 토큰과 textLink·noData 스타일 추가. Guide에 TextLink·NoData 섹션(Props, 예제, 코드). 확인: tsc·빌드·린트·CSS 범위 통과, 브라우저 측정값 Figma 일치(box 높이 182·글 묶음 50, section 274, 링크 s 12px Gray-900 + 화살표 16, m 14px Gray-700 밑줄) |
| 2026-11-17 | 2-8 Loading, TermsForm | Figma 확인(CO_공통 페이지 `로딩`, `약관폼`, `Table 케이스`, CSS(all layers)로 수치 확인). 로딩 이미지는 Figma 이미지 원본 `runable_loading.gif`(500×500 GIF)를 그대로 저장(`assets/images/loadingRunable.gif`). `common/Loading`(label, 화면 전체 fixed·z-index 200, role status + 숨김 문구), `common/TermsForm`(sections), `src/types`에 TermsSection·TermsBlock·TermsTable·TermsList, `src/data/terms.ts`에 시안 문구 목업, common.css에 `--color-gray-100` 토큰과 loading·terms 스타일 추가. Guide에 Loading(영역 미리보기 + 전체 화면 2초 예제)·TermsForm 섹션 추가, guide.css에 미리보기 보정. 확인: tsc·빌드·린트·CSS 범위 통과, 360px 측정값 Figma 일치(전체 1351, 섹션 797·434, 표 263·114, 행 41/161/61·41/73, 목록 242), 로딩 전체 화면 표시·2초 뒤 닫힘·최상단 확인. 목록 내어쓰기 18px은 화면 측정 근삿값 |
| 2026-11-17 | 3-1 스플래시 | Figma 확인(MY1-스플래시_01: 360×640 Primary-700 #0128CA, 흰 세로 로고 110.67×600 left 217.33·top 20 / MY1-스플래시_02인트로: 흰 배경, 로고 280×79 left 40·top 280, 설명 "앱 구동 시, 작동되는 스플래시 화면"). 로고는 1-x에서 받은 `logoRunableSplash.svg`·`logoRunable.svg` 재사용. `pages/pub/member/Splash`(usePageState, 자동 진행 로고 → 인트로 → 홈 각 1.5초, `?state=logo`·`?state=intro`는 멈춤, h1 숨김 "러너블"), App 라우트 연결, common.css에 `--color-primary-700` 토큰과 스플래시 스타일, IA에 스플래시·로고·인트로 3행 Done. Guide 변경 없음(공통 컴포넌트 변경 없음). 확인: tsc·빌드·린트·CSS 범위 통과, 360×640에서 로고 L217.34 T20 110.66×600·인트로 L40 T280.5 280×79(Figma 일치), 세로 스크롤 없음, 자동 진행(1.5초 인트로, 3초 `/` 이동, history replace), IA 링크 확인. 홈(`/`)은 아직 빈 화면(3-7 예정) |
| 2026-11-17 | 3-2 로그인 | Figma 확인(ME1-로그인_01기본(iOS)·01기본(AOS)·02에러·03접속기록, Description 1~6, CSS(all layers)로 수치). 에셋은 기존 SNS PNG·iconEmail 재사용. `pages/pub/member/Login`(usePageState: `?platform=aos` SNS 3개, `?state=error` 이메일 형식 에러, `?state=history` 마지막 로그인 말풍선. 목업 동작: 이메일 형식 검사 → 에러 문구, 형식이 맞고 비밀번호가 있으면 홈, SNS 클릭 시 홈, 비밀번호 재설정 → `/password/find`, 이메일로 회원가입 → `/signup`), 상태유지 체크박스 기본 선택 안 됨(시안 설명 기준). 공통 `Input`에 `isLabelHidden`·`hasPasswordToggle` 추가 → Guide Input Props·예제 갱신(기존 라벨 없는 예제도 숨김 라벨 추가). common.css에 로그인 스타일(말풍선 포함). IA에 iOS·AOS·에러·접속기록 4행 Done. 확인: tsc·빌드·린트·CSS 범위 통과, 360×640 측정값 Figma 일치(제목 64, 입력 영역 124~430, 상태유지 줄 238, 로그인 버튼 286, 아래 영역 430~640, SNS x 62·126·190·254 / top 468, 회원가입 버튼 544, 말풍선 205·417 141×36), 에러 시 아래 요소 20px 이동, 입력·제출·체크박스·홈 이동 동작 확인 |
| 2026-11-17 | 3-3 비밀번호 재설정 | Figma 확인(ME1.1_01입력전·02입력후, ME1.2, ME1.3_01·02·03, ME1.4, Description 7~12, CSS(all layers)). 아이콘 4개 Figma 원본 저장(`iconLockOpen`·`iconLock`·`iconLockCheck`·`iconEmailCheck`.svg). `pages/pub/member/PasswordFind`(이메일 형식이 맞으면 [이메일 전송] 활성 → `?state=sent` 전송 안내, 재전송·로그인 화면으로 이동 링크, `?state=filled`), `pages/pub/member/PasswordReset`(Top Bar 없는 웹 화면, 비밀번호 조건 문구 충족 검정/미충족 빨강, 조건 충족 + 재입력 일치 시 [비밀번호 변경] 활성 → `?state=complete` ME1.4, `?state=typing`·`filled`). `constants`에 `EMAIL_PATTERN`(로그인과 공용), `utils/checkPasswordRules` 추가. 공통 `Button`에 `isPage`, `Input` `helperText`를 ReactNode로 → Guide Button(Props + isPage 예제)·Input Props 갱신. common.css에 회원 화면 공통 블록(`.pageIntro` 등)·조건 문구 색. IA 7행 Done. 확인: tsc·빌드·린트·CSS 범위 통과, 360×640 측정값 Figma 일치(제목 영역 56~240·아이콘 72·제목 128·입력 240·버튼 302, 전송 안내 링크 370 123×22 Primary-500, ME1.3 버튼 364(입력완료)/384(조건 문구), ME1.4 하단 버튼 0·584 360×56 모서리 0), 입력·버튼 활성·상태 전환 동작 확인. 안내·불일치 문구는 시안에 없어 미구현(design.md 10장) |
| 2026-11-17 | 3-4 회원가입 | Figma 확인(ME2-회원가입_01입력중·02인증번호, ME2.1-이메일/비밀번호로 가입, Description 13~17, CSS(all layers)). 새 에셋 없음(입력창 아이콘 재사용). `pages/pub/member/Signup`(전송하기 → 다시전송 + 남은 시간 03:00 감소, 인증번호 입력 시 인증하기 활성 → 인증 완료: 제목 "비밀번호를 입력해주세요"·이메일 확인 아이콘·인증번호 칸 숨김, 이메일 형식 에러, 인증 후 이메일 변경 시 초기화, 비밀번호 조건(checkPasswordRules) + 재입력 일치 시 다음 활성 → `/signup/terms`, 이전 → `/login`, `?state=typing·code·verified`). common.css에 `.pageIntro.isTitleOnly`·`.signupFields`·`.signupGroup`·`.buttonGroup.isPage`. Guide Button isPage 예제에 이전/다음 두 버튼 추가(guide.css `.guideDemoStack`). IA 4행 Done. 확인: tsc·빌드·린트·CSS 범위 통과, 360×640 측정값 Figma 일치(제목 영역 56~140·제목 88, 입력 영역 140~584, 이메일 묶음 128·비밀번호 묶음 292부터 124, 하단 버튼 584 180×56 2개, 색 Primary-100/500·Primary-200/흰색), 전송·타이머·인증·다음 이동 동작 확인 |
| 2026-11-17 | 3-7 홈 | Figma 확인(MY3-홈_01최소·02최대, Description 1~8, CSS(all layers)). 에셋 저장: `iconAlarmNew`(새 알림 점)·`iconGoWhite`·`iconRace`·`iconRaceWhite`·`iconTimeWhite`.svg, `images/shapeButtonEdge.svg`, 대회 사진 `images/raceJtbcSeoul.jpg`(원본 PNG 1248×1040 → JPG 624×520 36KB). Swiper 14 설치. 공통: `TopBar` type home, `common/Slider`(Swiper, A11y), `race/RaceCard`(dday·image), `my/RecordCard`, `utils/formatDate`, 타입 `MyRace`·`Race.applyDeadline`·`RunningRecord.raceName`, 토큰 `--color-gray-500`·`--text-h3`·`--text-h5`·`--text-b1`·`--radius-card-l`. `pages/pub/my/Home`(02최대 기본, `?state=min` 01최소), `data/homeData.ts`. Guide에 Slider·RaceCard·RecordCard 섹션, TopBar home 갱신. IA 2행 Done. 확인: tsc·빌드·린트·CSS 범위 통과, 360 너비 측정값 Figma 일치(Top Bar 56, 메시지 영역 208, 레이스 영역 476 (카드 90×3, 간격 12, 더 보기 24), 참여가능 502 (카드 312×378, 두 번째 카드 348), 러닝 기록 목록 432 (128·128·152), 01최소 메시지 152·레이스 206·노데이터 182), 슬라이드 이동(slideNext) 동작. 차이: 02 러닝 기록 영역 Figma 585(고정 높이로 보임) / 구현 548(내용 높이), 01 마감 카드 종목이 1줄이라 Figma보다 24 낮음(그라데이션에 가려짐) |
| 2026-11-17 | 3-18 대회 목록 | Figma 확인(RA1-대회 목록, 레이스 Card Module 케이스, Description 1~4, CSS(all layers)). 에셋 저장: `iconTime`(파란 시계)·`iconTimeOffWhite`(줄 그은 시계).svg, `images/bgRaceListHeader.svg`(파란 사선 360×242), 대회 사진 `raceHangang.jpg`(624×417)·`raceSheRunsSeoul.jpg`(500×313). `RaceCard` image에 진행예정·신청마감·마감 깃발과 마감 이미지 60% 어둡게, 카드 높이 378 고정(정보 198). `TopBar` `isPrimary`. `pages/pub/race/RaceList`, `data/raceData.ts`. Guide TopBar(isPrimary)·RaceCard(4가지 상태) 갱신. IA Done. 확인: tsc·빌드·린트·CSS 범위 통과, 360 너비 측정값 Figma 일치(Top Bar 파란 배경 56, 사선 배경 360×242, 문구 위 12·왼쪽 24, 첫 카드 위 156(내용 위 100), 카드 378 간격 24, 접수중만 버튼 2개), 홈 01최소 참여가능 영역도 532로 Figma와 일치하게 됨 |
| 2026-11-20 | 상단 바 이름 변경 | `TopBar` → `Header` (`components/pub/layout/Header/Header.tsx`, Props `HeaderProps`). 사용처 Home·RaceList·Signup·PasswordFind·Guide import·JSX 교체, Layout·TermsForm·common.css 주석 갱신, Guide 메뉴·제목·경로 Header로. CSS 클래스명(`topBar*`)과 Guide 앵커 `#topBar`는 유지. design.md 갱신 |
| 2026-11-20 | 폴더 평탄화 | 컴포넌트 17개 `components/pub/<묶음>/X/X.tsx` → `<묶음>/X.tsx`, 페이지 9개 `pages/pub/(<메뉴>/)X/X.tsx` → `pages/pub/X.tsx`, 빈 폴더 삭제, 모든 상대 import 경로 재계산. Guide 파일 경로 표시, AGENTS.md(4장 구조·5.1 규칙·IA/Guide 경로), design.md(폴더 구조·설계 원칙·컴포넌트 위치) 갱신. 확인: tsc·빌드·린트 통과, 화면 확인 |

## 나중에 할 것 (Backlog)

- [ ] 실제 API 연동 (로그인, 대회 목록, 참가 신청, 기록)
- [ ] 실제 결제 연동 (신용카드, 가상계좌)
- [ ] 지도 API, GPS 위치 추적 연동
- [ ] SNS 로그인 연동
- [ ] 다크 모드
