# 설계 (Design)

> 이 문서는 **어떻게 만드는지** 정의하는 설계 문서입니다.
> 기능 요구사항은 `docs/requirements.md`, AI 개발 및 코딩 규칙은 `AGENTS.md`를 따릅니다.
> **현재 작업 범위:** React + TypeScript 기반 퍼블리싱 전용 (러너블 모바일 앱 화면)
> 기준 시안: Figma `기획 인수인계: 03-러너블-상세디자인-v1.1-211108`
> 마지막 수정: 2026-11-16

---

## 1. 화면 구조

### 1.1 전체 화면 구조

```text
App
├── /ia, /guide (독립 관리 페이지, Layout 미적용)
├── TabLayout (탭 루트 화면: Bottom Bar 표시)
│   └── <div id="siteWrap" class="siteScope">
│       ├── <main id="container">
│       │   ├── Home          /            (전용 상단: 프로필·알림 아이콘)
│       │   ├── RaceList      /races       (Header)
│       │   └── Tracker       /tracker     (Header)
│       └── BottomBar → <footer id="footer"><nav> 홈 · 레이스 · 트래커
└── PageLayout (그 외 화면: Bottom Bar 없음)
    └── <div id="siteWrap" class="siteScope">
        └── <main id="container">
            └── 각 페이지
                ├── Header → <header id="header"> (뒤로가기/닫기 + 페이지명)
                └── 페이지 본문
```

- 화면 목록과 경로는 `requirements.md` 4장을 따릅니다.
- `Header`는 페이지마다 제목과 버튼 종류가 달라서 **각 페이지가 직접 렌더링**합니다. Layout은 `Header`를 넣지 않습니다.
- 스플래시, 로그인, 트래커 카운트다운·기록 중 화면은 `Header`를 쓰지 않습니다 (`PageLayout` 안에서 본문만 렌더링).

### 1.1.1 IA 및 Guide 독립 페이지 설계

- `/ia`와 `/guide`는 **공통 Layout을 적용하지 않는 독립 관리 페이지**입니다.
- `/ia`는 `src/pages/pub/Ia.tsx`, `/guide`는 `src/pages/pub/Guide.tsx`에서 관리합니다.
- `/ia`의 화면 목록에는 **Guide (`/guide`) 항목을 최초 생성부터 반드시 포함**하고 항상 맨 위에 둡니다.
- 일반 페이지를 추가하면 IA 화면 목록을 갱신하고, 공통 컴포넌트를 추가하거나 Props·사용법을 변경하면 Guide 항목을 갱신합니다.
- IA에는 페이지 기본 경로와 함께 **상태별 링크**(`?state=`, `?platform=`, `?step=`)도 행으로 등록합니다 (`requirements.md` 4장).

**라우팅 구조**

```tsx
<Routes>
    <Route path="/ia" element={<Ia />} />
    <Route path="/guide" element={<Guide />} />
    {/* 탭 루트 화면: Bottom Bar 표시 */}
    <Route element={<TabLayout />}>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.raceList} element={<RaceList />} />
        <Route path={ROUTES.tracker} element={<Tracker />} />
    </Route>
    {/* 그 외 화면: Bottom Bar 없음 */}
    <Route element={<PageLayout />}>
        <Route path={ROUTES.login} element={<Login />} />
        {/* ... requirements.md 4장 경로 */}
    </Route>
</Routes>
```

- `TabLayout`, `PageLayout`은 `Layout` 하나에 `hasBottomBar` Props를 주는 방식으로 구현해도 됩니다. 라우트에서는 위처럼 두 그룹으로 나눕니다.
- 경로 문자열은 `src/constants/index.ts`의 `ROUTES`에서만 정의합니다.

### 1.2 기본 레이아웃 설계

| 컴포넌트 | HTML 태그 | ID | 역할 |
| --- | --- | --- | --- |
| `Layout` 루트 | `<div class="siteScope">` | `siteWrap` | 일반 페이지 루트. `common.css` 범위 기준은 클래스 `.siteScope` |
| `Header` | `<header>` | `header` | 화면 상단 바 (뒤로가기/닫기, 페이지명) |
| `Layout`의 콘텐츠 영역 | `<main>` | `container` | 페이지 콘텐츠 영역 |
| `BottomBar` | `<footer>` + `<nav>` | `footer` | 하단 탭바 (탭 루트 화면만) |

**기본 레이아웃 규칙**

- **일반 퍼블리싱 페이지에만** `Layout`을 적용합니다. `/ia`, `/guide`는 예외입니다.
- `Layout`은 `<div id="siteWrap" class="siteScope">` 안에 `<main id="container">`와 (탭 루트일 때) `BottomBar`를 순서대로 배치합니다.
- `Header`는 페이지 컴포넌트의 첫 요소로 `<main id="container">` 안에서 렌더링합니다. 한 화면에 `Header`는 하나만 둡니다.
- 페이지 컴포넌트는 `<main>` 내부에 렌더링하며, 중첩된 `<main>`을 만들지 않습니다.
- 한 화면에서 동일한 ID를 중복 사용하지 않습니다.
- 공통 레이아웃 CSS는 `src/assets/css/common.css`에서 `.siteScope` 범위로 관리합니다. 화면 높이 등 일반 페이지 루트 전용 규칙만 `#siteWrap`에 둡니다.

**Layout 구현 예시**

```tsx
import { Outlet } from 'react-router-dom';
import BottomBar from '../BottomBar/BottomBar';
import '../../../../assets/css/common.css';

interface LayoutProps {
    hasBottomBar?: boolean;
}

const Layout = ({ hasBottomBar = false }: LayoutProps) => {
    return (
        <div id="siteWrap" class="siteScope">
            <main id="container">
                <Outlet />
            </main>
            {hasBottomBar && <BottomBar />}
        </div>
    );
};

export default Layout;
```

**공통 레이아웃 높이와 고정**

- `#siteWrap`은 최소 화면 높이(`min-height: 100vh`, 가능하면 `100dvh`)를 확보하고 세로 Flex로 배치합니다.
- 콘텐츠가 짧아도 `BottomBar`는 화면 최하단에 위치합니다 (`#container`에 `flex: 1`).
- `Header`는 `position: sticky; top: 0`, `BottomBar`는 `position: sticky; bottom: 0`으로 스크롤 중에도 보이게 합니다. `position: fixed`·`absolute`는 사용하지 않습니다.
- 팝업(바텀시트)은 화면 전체를 덮어야 하므로 예외로 `position: fixed`를 사용합니다.
- IA 및 Guide 관리 페이지는 독립 레이아웃이므로 이 규칙에서 제외합니다.

### 1.3 폴더 구조

```text
src/
├── App.tsx
├── pages/
│   └── pub/                         # 페이지 파일을 폴더 없이 바로 둠
│       ├── Ia.tsx
│       ├── Guide.tsx
│       ├── Splash.tsx               # ME 회원 (MY1 앱 진입)
│       ├── Login.tsx
│       ├── PasswordFind.tsx
│       ├── PasswordReset.tsx
│       ├── Signup.tsx
│       ├── SignupTerms.tsx
│       ├── SignupComplete.tsx
│       ├── Home.tsx                 # MY 홈/마이
│       ├── My.tsx
│       ├── Profile.tsx
│       ├── Settings.tsx
│       ├── Withdraw.tsx
│       ├── Coupons.tsx
│       ├── Records.tsx
│       ├── RecordDetail.tsx
│       ├── RecordSubmit.tsx
│       ├── RaceRecordDetail.tsx
│       ├── Notifications.tsx
│       ├── RaceList.tsx             # RA 레이스
│       ├── RaceDetail.tsx
│       ├── RaceApply.tsx
│       ├── RaceApplyComplete.tsx
│       ├── RaceApplication.tsx
│       ├── Tracker.tsx              # TR 트래커
│       ├── TrackerTraining.tsx
│       ├── TrackerRace.tsx
│       ├── BetaFeedback.tsx
│       └── Error.tsx                # CO 공통
├── components/
│   └── pub/
│       ├── common/                  # 여러 화면에서 쓰는 UI (Guide 등록 대상), 파일로 바로 둠
│       │   ├── Button.tsx
│       │   ├── FloatingButton.tsx
│       │   ├── Input.tsx
│       │   ├── Checkbox.tsx
│       │   ├── Radio.tsx
│       │   ├── Tabs.tsx
│       │   ├── Popup.tsx
│       │   ├── TextLink.tsx
│       │   ├── NoData.tsx
│       │   ├── Loading.tsx
│       │   ├── TermsForm.tsx
│       │   └── Slider.tsx
│       ├── layout/
│       │   ├── Layout.tsx
│       │   ├── Header.tsx
│       │   └── BottomBar.tsx
│       ├── race/                    # 레이스 관련 화면에서만 쓰는 컴포넌트
│       │   └── RaceCard.tsx
│       ├── my/                      # 홈·마이 화면 컴포넌트
│       │   └── RecordCard.tsx
│       └── tracker/
│           └── TrackerRecord.tsx    # 거리·페이스·시간 기록 표시
├── hooks/
│   └── usePageState.ts
├── types/index.ts
├── constants/index.ts
├── data/                            # 목업 데이터, iaData.ts
├── utils/
└── assets/
    ├── css/
    │   ├── common.css
    │   ├── ia.css
    │   └── guide.css
    ├── images/
    ├── icons/
    └── fonts/

public/
└── email/                           # 이메일 템플릿 정적 HTML (AGENTS.md 9장 예외)
    ├── emailConfirm.html            # CO3 이메일 컨펌
    ├── signupComplete.html          # CO3.1
    ├── passwordReset.html           # CO3.2
    ├── adminApprovalRequest.html    # CO3.6
    ├── adminApprovalComplete.html   # CO3.7
    ├── adminPasswordReset.html      # CO3.8
    └── inquiryAnswer.html           # CO3.9
```

**폴더 설계 원칙**

- 페이지는 폴더 없이 `src/pages/pub/PageName.tsx`로 바로 둡니다 (2026-11-20 사용자 요청, 메뉴 그룹 폴더 없음).
- 컴포넌트도 컴포넌트별 폴더 없이 묶음 폴더 안에 `ComponentName.tsx`로 바로 둡니다.
- 여러 화면에서 쓰는 UI는 `components/pub/common/`에, 한 메뉴에서만 쓰는 컴포넌트는 메뉴 폴더(`race/`, `tracker/`)에 둡니다.
- 위 목록 중 실제로 필요해진 시점에 파일을 만듭니다. 미리 빈 파일을 만들지 않습니다 (IA·Guide 관련 파일은 예외).
- 이메일 템플릿은 React 밖 `public/email/`에 두며, 브라우저에서 `/email/파일명.html`로 확인합니다.

## 2. 컴포넌트 명세

| 컴포넌트 | 위치 (`src/components/pub/` 기준) | Props | Figma 컴포넌트 | 설명 |
|---|---|---|---|---|
| `Layout` | `layout/Layout.tsx` | `hasBottomBar?` | - | `#siteWrap`, `#container`, BottomBar 조합 |
| `Header` | `layout/Header.tsx` | `title`, `type?: 'back' \| 'close' \| 'home'`, `isPrimary?`, `onButtonClick?`, `rightSlot?: ReactNode` | `Top Bar` | `<header id="header">`. back은 왼쪽 뒤로가기, close는 오른쪽 닫기. 기본 동작 `navigate(-1)` |
| `BottomBar` | `layout/BottomBar.tsx` | - | `Bottom Bar` | `<footer id="footer"><nav>`, `NavLink`로 홈·레이스·트래커, 활성 탭 Primary-500 |
| `Button` | `common/Button.tsx` | `label`, `variant?: 'primary' \| 'secondary' \| 'outline'`, `size?: 'l' \| 'm'`, `icon?`, `disabled?`, `isPage?`, `to?`, `type?`, `onClick?` | `Button` | 공통 버튼. 두 개 나란히는 `.buttonGroup`(간격 8). `to`가 있으면 링크 |
| `FloatingButton` | `common/FloatingButton.tsx` | `label`, `type?: 'move' \| 'plus'`, `to?`, `onClick?` | `Floating Button` | 둥근 작은 버튼 (보러가기, 더보기) |
| `Input` | `common/Input.tsx` | `id`, `value`, `onChange`, `label?`, `isLabelHidden?`, `hasPasswordToggle?`, `labelNote?`, `required?`, `type?`, `placeholder?`, `errorMessage?`, `helperText?: ReactNode`, `hasClear?`, `isComplete?`, `timer?`, `button?: { label, disabled?, onClick? }`, `name?`, `autoComplete?` | `Text Field` | 입력 중 Primary-500 테두리, 에러 Danger-500 테두리 + 메시지, 비밀번호 보기, 오른쪽 버튼 |
| `Checkbox` | `common/Checkbox.tsx` | `id`, `label`, `checked`, `onChange`, `shape?: 'rectangle' \| 'round'`, `disabled?`, `name?` | `Checkbox` | 사각: 약관 동의·상태유지 / 원형: 회원탈퇴 사유 |
| `Radio` | `common/Radio.tsx` | `id`, `name`, `value`, `label`, `checked`, `onChange`, `disabled?` | `Radio Button` | 종목·사이즈·성별·혈액형 선택. 2열은 `.radioGroup` |
| (`Select`) | - | - | 시안에 없음 | 성별·혈액형·사이즈 모두 Radio라 만들지 않음 (2026-11-17 확인) |
| `Tabs` | `common/Tabs.tsx` | `items: TabItem[]`, `activeId`, `onChange`, `idPrefix`, `ariaLabel` | `Tab` | 대회 소개 탭(4개), 내 정보 기록 탭(2개). 탭 내용은 페이지가 그리며 id는 `utils/getTabIds` |
| `Popup` | `common/Popup.tsx` | `isOpen`, `title`, `onClose`, `primaryButton: { label, onClick }`, `secondaryButton?`, `description?: ReactNode`, `comment?`, `children?` | `Dialog` | 하단 바텀시트 + Dim. ESC·Dim 클릭으로 닫기, 포커스 이동·Tab 순환·복귀, 뒤 화면 스크롤 막기. 시안에서 왼쪽 버튼이 "취소"/"탈퇴하기"로 바뀌어 역할(primary/secondary) 기준으로 Props 구성 |
| `TextLink` | `common/TextLink.tsx` | `label`, `size: s \| m`, `hasArrow`, `to?`, `onClick?` | `Link` | 밑줄 글자 링크. `to`가 있으면 화면 이동 링크, 없으면 버튼. 예: 로그인 비밀번호 재설정(m), 노데이터 바로가기(s + 화살표) |
| `NoData` | `common/NoData.tsx` | `message: ReactNode`, `variant: box \| section`, `action?: ReactNode` | `Nodata` | 노데이터 안내. box: 홈 회색 상자, section: 내 정보 기록 영역. `action`에 `TextLink`·`FloatingButton` 등을 넣음 (0-2 계획의 `linkLabel`·`linkTo`를 `action`으로 일반화) |
| `Loading` | `common/Loading.tsx` | `label?` (화면 읽기용, 기본 '불러오는 중입니다') | CO 로딩 | 흰 화면 전체(fixed, z-index 200 = 팝업 위) 가운데 80px `runable_loading.gif` 원본. 표시 여부는 페이지가 결정 (`{isLoading && <Loading />}`) |
| `TermsForm` | `common/TermsForm.tsx` | `sections: TermsSection[]` (`src/types`) | CO 약관폼 | 약관·라이선스 본문. 섹션 = 본문 타이틀 + 설명 문단 + 블록(서브 타이틀·표·목록). 제목·닫기는 페이지의 `Header type="close"`가 그려서 0-2 계획의 `title`·`children` 대신 데이터(`src/data/terms.ts`)로 받음 |
| `Slider` | `common/Slider.tsx` | `items: T[]`, `getKey`, `renderItem`, `ariaLabel`, `spaceBetween?`(12), `sidePadding?`(24) | - | Swiper(slidesPerView auto, A11y 모듈) 가로 카드 슬라이드 (홈 참여가능 레이스). 0-2 계획의 `options`는 쓰는 곳이 없어 간격·여백 Props로 단순화 |
| `RaceCard` | `race/RaceCard.tsx` | `variant: 'dday' \| 'image'`, `race: MyRace`(dday) / `Race`(image) | `_Card` | dday: 신청 대회 312×90 (D-DAY 파란 카드, 그 외 흰 카드 + 그림자, D-DAY → 대회 트래커, D-00 → 트래커 메인) / image: 참여가능 대회 (이미지 180 + 접수 깃발 + 자세히 보기·참가 신청) |
| `RecordCard` | `my/RecordCard.tsx` | `record: RunningRecord` | `_Card` (러닝 기록) | 홈 러닝 기록, 트레이닝 기록. raceName이 있으면 대회명 깃발 |
| `TrackerRecord` | `tracker/TrackerRecord.tsx` | `record: TrackerSnapshot`, `isPaused` | - | 거리·페이스·시간 큰 숫자 표시 |

> 컴포넌트는 해당 화면을 구현할 때 만듭니다. Props는 구현하면서 바뀔 수 있으며, 바뀌면 이 표와 `/guide`를 함께 갱신합니다.
> 툴팁(마지막 로그인 계정 안내)처럼 한 화면에서만 쓰는 UI는 페이지 안에서 마크업합니다.

### 2.1 컴포넌트 설계 원칙

- React 함수형 컴포넌트를 사용합니다.
- 컴포넌트는 `const` + 화살표 함수로 선언합니다.
- Props는 TypeScript `interface`로 정의합니다.
- 공통 컴포넌트가 존재하면 새로 만들지 않고 재사용합니다.
- Figma 컴포넌트 이름(`_Text Field`, `_Dialog` 등)과 Props 이름(`Check`, `Disable` 등)을 참고해 상태를 맞춥니다.
- 화면 UI와 데이터 처리 로직은 역할에 따라 분리합니다.
- 컴포넌트 작성 규칙은 `AGENTS.md` 5.1절을 따릅니다.

## 3. 데이터 타입

> 실제 공용 타입은 **`src/types/`**에 정의합니다. 아래 코드는 설계 참고용입니다. IA 타입은 `AGENTS.md` 6.3.3을 따릅니다.

```ts
// 상태별 화면 전환 (쿼리 파라미터)
type Platform = 'ios' | 'aos';

// 대회
type RaceStatus = 'upcoming' | 'open' | 'closed' | 'ongoing' | 'finished';
type PaymentMethod = 'card' | 'virtualAccount' | 'freeTicket';

interface Race {
    id: string;
    title: string;
    startDate: string;   // YYYY-MM-DD
    endDate: string;
    distances: string[]; // 예: ['5K', '10K', 'Half']
    status: RaceStatus;
    image?: string;
}

// 러닝 기록
interface RunningRecord {
    id: string;
    title: string;
    date: string;        // YYYY-MM-DD HH:mm
    distanceKm: number;
    duration: string;    // HH:mm:ss
    pace: string;        // 예: 10'04"
    raceId?: string;
}

// 트래커 화면 표시값
interface TrackerSnapshot {
    distanceKm: number;
    pace: string;
    duration: string;
}

// 알림
interface NotificationItem {
    id: string;
    message: string;
    date: string;
    isRead: boolean;
}

// 무료 참가권
interface Coupon {
    id: string;
    name: string;
    expireDate: string;
}

// 탭
interface TabItem {
    id: string;
    label: string;
}
```

### 3.1 타입 관리 원칙

- 여러 컴포넌트에서 공유하는 타입은 `src/types/`에 정의합니다.
- 특정 컴포넌트에서만 사용하는 Props 타입은 해당 컴포넌트 파일에 정의합니다.
- 페이지별 상태 값(`?state=`)은 각 페이지 파일에 유니온 타입으로 정의합니다. 예: `type LoginState = 'default' | 'error' | 'history';`
- TypeScript의 `any` 타입은 사용하지 않습니다.
- 동일한 타입을 여러 파일에 중복 선언하지 않습니다.

## 4. 상태 관리

| 상태 | 위치 | 방식 | 설명 |
|---|---|---|---|
| 상태별 화면 (`state`, `platform`, `step`) | 각 페이지 | `usePageState` 훅 (URL 쿼리) | IA 링크로 바로 열 수 있게 URL에서 읽음 |
| 팝업 열림 여부 | 각 페이지 | `useState` | 로그아웃 확인, 설정 변경 안내 등 |
| 탭 선택 | 탭을 쓰는 페이지 | `useState` | `Tabs`에 `activeId` 전달 |
| 폼 입력값·에러 | 각 폼 페이지 | `useState` | 로그인, 회원가입, 참가 신청, 1:1 문의 |
| 참가 신청 단계 | `RaceApply` | `usePageState`의 `step` | 1~6단계. 다음/이전 버튼은 쿼리를 바꿈 |
| 트래커 카운트다운·기록 | `TrackerTraining`, `TrackerRace` | `useState` + `setInterval` | 목업 값. 정리 함수로 interval 해제 |
| 슬라이드 활성 인덱스 | `Slider` | Swiper 내부 | 별도 상태 없음 |
| 전역 상태 | - | 사용 안 함 | 로그인 여부 등은 목업 화면이라 필요 없음 |

### 4.1 상태 관리 원칙

- 상태는 해당 상태를 사용하는 **가장 가까운 공통 부모**에서 관리합니다.
- 상태별 화면은 쿼리 파라미터를 기준으로 하고, 사용자가 조작하면 그 결과도 같은 화면에서 바뀌게 합니다 (예: 잘못된 이메일 입력 → 에러 상태 표시).
- 쿼리 값이 없거나 잘못되면 기본(`_01`) 화면을 표시합니다.
- 단순한 상태는 `useState`를 우선 사용하고, 전역 상태는 도입하지 않습니다.
- 계산 가능한 값은 기존 상태에서 도출합니다.
- 화면 크기에 따른 스타일 변경은 CSS 미디어쿼리를 우선 사용합니다.

## 5. 인터랙션

| 대상 | 동작 | 결과 |
|---|---|---|
| Bottom Bar 탭 | 클릭 | 홈 `/`, 레이스 `/races`, 트래커 `/tracker`로 이동, 활성 탭 색상 변경 |
| Top Bar 뒤로가기 | 클릭 | 이전 화면 (`navigate(-1)`) |
| Top Bar 닫기 | 클릭 | 이전 화면 또는 지정 경로 |
| 팝업 | 열기 버튼 클릭 | 바텀시트 + Dim 표시, 포커스를 팝업으로 이동 |
| 팝업 | 취소·Dim 클릭·ESC | 닫기, 포커스를 연 버튼으로 복귀 |
| 팝업 | Tab / Shift+Tab | 팝업 안의 버튼 사이에서만 순환 |
| 탭 | 클릭 | 탭 내용 전환 |
| 탭 | ← / → / Home / End | 이전·다음(끝에서 처음으로)·처음·마지막 탭으로 이동하며 바로 선택 |
| 입력창 | 입력 / 지우기 버튼 | 값 변경, 지우기 버튼은 값이 있을 때만 표시 |
| 폼 제출 | 클릭 | 목업 유효성 검사 → 에러 상태 또는 다음 화면 |
| 체크박스 | 클릭 | 체크 토글, 필수 항목 미체크 시 다음 버튼 비활성 |
| 참가 신청 | 다음 / 이전 | `?step=` 변경 |
| 트래커 시작 | 클릭 | 5 → 1 카운트다운 후 기록 화면, 목업 값 증가 |
| 트래커 정지 | 클릭 | 정지 상태 화면, 저장 알림(TR1.4) |
| 코치마크 | 클릭 | 닫기 |
| 홈 참여가능 레이스 | 터치 / 드래그 | Swiper 가로 슬라이드 |

### 5.1 인터랙션 설계 원칙

- 실제 API·결제·GPS가 필요한 동작은 목업으로 구현합니다.
- React 이벤트 핸들러를 사용하고, 이름은 `handle` 접두어를 사용합니다.
- `setInterval`, 키보드 이벤트 등 직접 등록한 리스너는 컴포넌트 정리 시 해제합니다.
- 슬라이드는 Swiper API를 사용합니다.
- 디버깅용 `console.log`를 남기지 않습니다.

## 6. 디자인 토큰

> 실제 디자인 토큰은 **`src/assets/css/common.css`**의 **`.siteScope`**에 정의합니다.
> 아래 값은 2026-11-16 Figma 시안에서 확인한 값입니다 (`tasks.md` 0-2). 주석의 `Primary/Primary-500` 등은 Figma 스타일 이름입니다.
> 시안에서 아직 확인하지 못한 색상·스타일은 화면 구현 중 Figma에서 확인해 추가합니다. 임의 값을 만들지 않습니다.

```css
:root {
    /* 색상 */
    --color-primary-50: #f4f6fb;    /* Primary/Primary-50: 입력창 배경 */
    --color-primary-100: #e6ebff;   /* Primary/Primary-100: 보조 버튼, D-day 박스 */
    --color-primary-200: #ccd6ff;   /* Primary/Primary-200: 비활성 버튼 배경 */
    --color-primary-500: #0132fd;   /* Primary/Primary-500: 주 버튼, 활성 탭, 체크박스 */
    --color-primary-700: #0128ca;   /* Primary/Primary-700: 스플래시 배경 */
    --color-black: #000000;         /* Basic/Black: 기본 텍스트 */
    --color-white: #ffffff;         /* Basic/White */
    --color-gray-50: #f5f5f5;       /* Gray Scale/Gray-50: 노데이터 박스 배경, Bottom Bar 구분선 */
    --color-gray-100: #d8d8d8;      /* Gray Scale/Gray-100: 약관 표 구분선 */
    --color-gray-200: #cccccc;      /* Gray Scale/Gray-200: 입력창 옆 비활성 버튼 */
    --color-gray-300: #c2c2c2;      /* Gray Scale/Gray-300: placeholder, 비활성 탭·체크박스 */
    --color-gray-500: #979797;      /* Gray Scale/Gray-500: 러닝 기록 날짜 */
    --color-gray-700: #818181;      /* Gray Scale/Gray-700: 보조 텍스트, 링크 */
    --color-gray-900: #3c3c3c;      /* Gray Scale/Gray-900: 팝업 설명 문구, 아이콘 */
    --color-danger-500: #ea3323;    /* Semantic/Danger-500: 에러 테두리·메시지 */
    --color-dim: rgba(0, 0, 0, 0.6);/* Basic/Dim: 팝업 배경 */

    /* 폰트 (Noto Sans KR) */
    --font-family: 'Noto Sans KR', sans-serif;
    /* 텍스트 스타일: 굵기 크기/줄 높이 */
    --text-h1: 700 24px/32px var(--font-family);        /* Noto/Headline/H1, 자간 -0.5px */
    --text-h2: 700 20px/28px var(--font-family);        /* Noto/Headline/H2, 자간 -0.5px */
    --text-h4: 700 16px/24px var(--font-family);        /* Noto/Headline/H4: Top Bar 제목, 탭 */
    --text-b2: 500 14px/22px var(--font-family);        /* Noto/Body/B2: 본문, 입력값 */
    --text-button-l: 700 14px/22px var(--font-family);  /* Noto/Button/Button(L) */
    --text-button-s: 700 12px/20px var(--font-family);  /* Noto/Button/Button(S): 작은 버튼 */
    --text-button-m: 700 12px/20px var(--font-family);  /* Form/Button Medium: Floating Button */
    --text-c0: 500 12px/20px var(--font-family);        /* Noto/Caption/C0, 자간 -0.5px */
    --text-c1: 500 11px/16px var(--font-family);        /* Noto/Caption/C1: 에러 메시지, 툴팁 */
    --text-c2: 500 10px/14px var(--font-family);        /* Noto/Caption/C2: Bottom Bar 라벨 */
    --text-timer: 500 12px/20px Roboto, var(--font-family); /* Roboto/Caption/C0: 인증 남은 시간 (Roboto는 불러오지 않음, 기기에 있으면 사용) */
    --letter-spacing-tight: -0.5px;

    /* 간격 */
    --space-page: 24px;             /* 화면 좌우 여백 (360 - 24 * 2 = 콘텐츠 312px) */
    --space-8: 8px;
    --space-12: 12px;
    --space-16: 16px;
    --space-20: 20px;
    --space-24: 24px;
    --space-32: 32px;

    /* 모서리 및 그림자 */
    --radius-card: 6px;             /* 카드 */
    --radius-button: 8px;           /* 버튼 (size l) */
    --radius-button-s: 4px;         /* 작은 버튼 (size m) */
    --radius-pill: 40px;            /* Floating Button */
    --radius-box: 12px;             /* 노데이터 박스 */
    --shadow-elevation-2: 0 2px 10px rgba(0, 0, 0, 0.12); /* Elevation 2: 에러 입력창 등 */

    /* 레이아웃 */
    --top-bar-height: 56px;         /* Top Bar: padding 12px 16px */
    --bottom-bar-height: 62px;      /* Bottom Bar: 구분선 1 + 위 여백 7 + 탭 46 + 아래 여백 8 */
    --button-height: 56px;
    --button-height-s: 42px;
    --input-height: 46px;
}
```

> `:root`를 쓰지 않고 `.siteScope`에 정의해 `/ia`와 Guide 화면 자체에는 영향이 없게 합니다 (`AGENTS.md` 4.1).

### 6.0 Figma 공통 컴포넌트 (0-2 조사 결과)

| Figma 컴포넌트 | 확인한 스펙 | 구현 대상 |
|---|---|---|
| `Top Bar` | 너비 360, 높이 56, padding 12px 16px, gap 12px, 흰 배경. 뒤로가기(또는 닫기) 아이콘 + 페이지명(H4) | `layout/Header.tsx` |
| `Bottom Bar` | 전체 높이 62 = 위 구분선 1px(Gray-50 #F5F5F5) + 위 여백 7 + 탭 46 + 아래 여백 8, 흰 배경. 탭 3개(홈·레이스·트래커) 각 120px, 아이콘 32 + 라벨 C2, 활성 Primary-500, 비활성 Gray-300 | `layout/BottomBar.tsx` |
| `Button` (Primary) | 높이 56, radius 8, padding 16px 24px, 배경 Primary-500, 라벨 Button(L) 흰색 | `common/Button` |
| `Button` (Outline) | 높이 56, radius 8, 테두리 2px Primary-500, 라벨 Primary-500, 아이콘 gap 4px | `common/Button` |
| `Button` (Secondary) | 높이 56, radius 8, 배경 Primary-100, 라벨 Primary-500 (팝업 취소 버튼) | `common/Button` |
| `Button` (Disable) | 배경 Primary-200 #CCD6FF, 라벨 흰색. 시안에는 primary만 있음 (secondary·outline 비활성 없음) | `common/Button` `disabled` |
| `Button` (Size Medium, 카드) | 높이 42, radius 4, 라벨 Button(S) 12px. Combination(두 개 나란히) 간격 8, 각 136px | `common/Button` `size="m"` |
| `Floating Button` | Button과 별도 컴포넌트. 높이 42, radius 40, padding 0 16px, gap 4, 흰 배경 + Elevation 2, 라벨 Form/Button Medium 12px Primary-500. Type: Move(→ 24px) / 더보기(+ 16px) | `common/FloatingButton` |
| Figma `Button` 속성 | `Size`(Large/Medium), `Type`(Popup/Contents), `Combination`, `State`(Default/Disable), `Line`, `Icon`. 높이는 Size가 아니라 위치에 따라 56/42로 달라 구현은 `size: l \| m`으로 단순화 | - |
| `Text Field` | 속성 `Type`(Button 등), `State`(After 등). 라벨 C0(12/20, -0.5) + 필수 점 4×4 Danger-500, 간격 4. 입력 높이 46, padding 0 12px, gap 8, 배경 Primary-50, 값 B2 검정, placeholder Gray-300. 입력 중: 흰 배경 + 1px Primary-500 + Elevation 2. 에러: 흰 배경 + 1px Danger-500 + Elevation 2, 메시지 C1 Danger-500. 안내 문구 C1 Gray-700. 오른쪽 버튼 높이 46·padding 0 16px·Button(L) 흰 글자, 활성 Primary-500 / 비활성 Gray-200 #CCCCCC. 남은 시간 Roboto 12px Danger-500. 아이콘: 지우기 24, 입력 확인 24(#34C759), 비밀번호 보기 32 | `common/Input` |
| `Checkbox` | 24×24, 라벨 B2 간격 8. Rectangle 체크: Primary-500 배경 + 흰 체크 / 해제: 2px Gray-300 테두리 + Gray-300 체크. Round: 22px 원(체크 Primary-500 채움 + 흰 체크 / 해제 2px Gray-300 + Gray-300 체크). 속성 `Type`(Rectangle/Round), `Check`, `Disable`(시안에서 미확인) | `common/Checkbox` |
| `Radio Button` | 24 영역 안 22px 원, 테두리 2px, 흰 배경, 가운데 점 12px. 선택 Primary-500 / 해제 Gray-300. 라벨 B2 간격 8. 2열 배치 가로 12·세로 8 | `common/Radio` |
| `_Link` | B2 + 밑줄, Gray-700 | 클래스 `.textLink` |
| `Tab` | 속성 `Type`(Tab 02~04, 탭 개수), `On`(활성 번호). 360×60 흰 배경, 위 16·좌우 24(탭 줄 312), 맨 아래 `Line` 1px Gray-50. 탭 한 칸은 같은 너비(2개 156, 4개 78), 글자 H4 + 간격 16 + `Bar` 4px(radius 100) = 44. 활성 검정 + Bar Primary-500, 비활성 Gray-300(Bar 없음) | `common/Tabs` |
| `Dialog` | 속성 `Type`(Bottomsheet), `Text`(Title 등), `Contents`. 너비 360, 위쪽 모서리 16, padding 32 0 24, 내용·버튼 간격 32, 흰 배경, 뒤 Dim 60%. 텍스트 영역 padding 0 24px·gap 8: 제목 H2(-0.5) 검정, 설명 B2 Gray-900 #3C3C3C(강조 Primary-500), 부가 문구 C0 Gray-700. 버튼 영역 padding 0 16px·gap 8, 버튼 높이 56(Button Large/Popup, Combination). 버튼 1개(확인) 또는 2개(왼쪽 Secondary + 오른쪽 Primary) | `common/Popup` |
| `_Card` (Race) | 카드 radius 6. D-day 영역 90×90 (진행 Primary-500 / 예정 Primary-100) + 정보 영역 | `race/RaceCard.tsx` |
| `Nodata` | 배경 Gray-50, 아이콘 `Icon_48 / Nodata` 48px, 아이콘·글 묶음 간격 16. **box**: 312×182, radius 12, padding 32px 20px 36px, 문구 B2 Gray-700, 문구·링크 묶음 세로 간격 8 (272×50). **section**: 360×274 고정 영역, 문구 C0 검정(-0.5), 문구·버튼 간격 16. 높이 고정 대신 내용 기준 위아래 padding 56으로 계산 | `common/NoData` |
| `Link` | 밑줄 글자. Size Medium 14px Gray-700, Size Small 12px Gray-900. 화살표 `Icon_16 / Arrow`(16px)는 링크 오른쪽 별도 아이콘 | `common/TextLink` |
| `Button` (Type Page) | 화면 맨 아래 꽉 찬 버튼 360×56, padding 16 24, 모서리 없음, Primary-500 + Button(L) 흰색 (ME1.4 앱으로 로그인) | `common/Button` `isPage` |
| `Icon_48 / Lock`, `Icon_48 / Email` | 48px. Lock Type Open(Gray-300, ME1.1) / Close(Gray-900, ME1.3) / Check(ME1.4), Email Type Check(Primary-500, ME1.2). Figma 원본을 `iconLockOpen`·`iconLock`·`iconLockCheck`·`iconEmailCheck`.svg로 저장 | 페이지 마크업 |
| 회원 화면 제목 영역 (`+Title`) | Top Bar 아래 padding 16 24 32, 간격 8: 아이콘 48 / 제목 H2(-0.5) 검정 / 설명 B2 Gray-700. 입력 영역(`+Contents`) padding 0 24, 간격 16. 버튼 + 글자 링크(B2 Primary-500, 밑줄 없음) 간격 12. Top Bar 버튼·제목이 없는 화면(ME1.3, ME1.4)은 빈 56px | `common.css` `.pageIntro`, `.pageContents`, `.pageActions`, `.pageTextLink`, `.pageBottom` |
| 비밀번호 조건 문구 (ME1.3) | Text Field 메시지 C1. 충족 조건은 "영문자(조건 충족)" 검정, 미충족은 Danger-500. 순서 영문자, 특수문자, 숫자, 8자 이상 | `Input` `helperText` + `utils/checkPasswordRules` |
| 회원가입 (ME2, ME2.1) | Top Bar(회원가입) + 제목만 있는 `+Title` padding 32 24 24(84) + `+Contents` padding 0 24·간격 24(이메일 묶음 간격 12: 이메일 70 + 인증번호 46 / 비밀번호 묶음 간격 8: 비밀번호 70 + 확인 46) + 하단 버튼 2개(Button Type Page Combination 180×56 간격 0: 이전 Primary-100 + Primary-500 글자, 다음 Primary-500 / 비활성 Primary-200). 남은 시간 C0 Danger-500, 기본 03:00 | `common.css` `.pageIntro.isTitleOnly`, `.signupFields`, `.signupGroup`, `.buttonGroup.isPage` |
| 홈 (MY3) | Top Bar Type Home (프로필 32 ↔ 알림 32, 새 알림은 빨간 점 아이콘 `iconAlarmNew`). `+Top` padding 16 0 40·간격 16: 메시지 H1(24/32 -0.5), 강조 글자 Primary-500 배경 흰 글자 / 결과 버튼 높이 40, 화면 왼쪽 끝부터 글자 영역 padding 8 6 8 32 + 끝 모양 26×40(`shapeButtonEdge.svg`, Primary-500 + Secondary-500 #17FF53). 섹션 padding 32 24 40·제목 H2·간격 16, 신청 대회 목록 간격 12 ↔ 더 보기 24. 참여가능 레이스 padding 32 0 40 (좌우 여백은 Slider 24), 제목 ↔ 카드 24, 카드 312 간격 12. 참여 가능 대회 없음: 마감 대회 카드 위 DIM 360×(카드 + 40) 그라데이션 투명 7.38% → 흰색 84.46%, padding 56, 전체 레이스 리스트 버튼. 러닝 기록 카드 padding 24 20 20(깃발 있으면 20)·간격 12, 제목 18/26 Bold, 날짜 B2 Gray-500, 값 16/24 3칸 | `pages/pub/my/Home`, `RaceCard`, `RecordCard`, `Slider` |
| 대회 카드 (`_Card`) | dday: 90×90 D-day 칸(H2, Primary-100/Primary-500, D-DAY는 Primary-500/흰색, 오른쪽 1×74 구분선) + 정보 padding 14 (날짜 C1 → 2 → 제목 Button(L) → 종목 아이콘 16 + Button(L)). image: 312, 이미지 180 위 모서리 8, 깃발 왼쪽 16·위 16 (접수중 Primary-500 [시계 16 + 접수중] + 흰 [~마감일], 마감은 검정 radius 4), 정보 padding 16 16 20·간격 16 (날짜 C0 Gray-700 + 제목 H2 / 종목 아이콘 + 14/24 Bold Primary-500, 간격 8), 버튼 Size Medium 2개 (간격 8) | `race/RaceCard.tsx` |
| 대회 카드 깃발 (RA1 Card Module 케이스) | 진행예정: 흰 배경 + 파란 시계(`iconTime`) + Primary-500 글자 / 접수중: Primary-500 + 흰 시계 + 흰 [~마감일] / 신청마감·마감: 검정 + 줄 그은 시계(`iconTimeOffWhite`). 마감은 이미지 위 검정 60%. [참가 신청]은 접수중만, 나머지는 [자세히 보기] 1개. 카드 높이 378 고정(정보 영역 198, 버튼은 아래) | `race/RaceCard.tsx` |
| 레이스 목록 (RA1) | Top Bar Type Home + Primary-500 배경(프로필만). 내용: 파란 사선 배경 360×242(`bgRaceListHeader.svg`) 위 문구 H2(-0.5) 흰색 2줄(위 12, 왼쪽 24), 카드 목록 위 100(문구 아래 32)·간격 24 | `pages/pub/race/RaceList` |
| CO `로딩` | 360×640 흰 화면, 가운데 80×80 이미지 `runable_loading.gif`(원본 500×500 GIF, Figma 이미지 원본을 그대로 저장: `assets/images/loadingRunable.gif`) | `common/Loading` |
| CO `약관폼` | Top Bar(close, 약관 타이틀) + `+CONTENTS`: padding 32 24 40, 섹션 간격 48, 흰 배경. 섹션 안 간격 16: 본문 타이틀 H4 검정 / 설명 B2 Gray-700. 블록 간격 8: 서브 타이틀 B2 검정 / 표 / 목록 B2 Gray-700(글머리·번호, 내어쓰기 약 18px). 표: 위 1px Gray-700, 머리 칸 Gray-50 + Button(S) Gray-700 가운데, 내용 칸 C0 Gray-700, 칸 padding 10px 16px(한 칸 표는 16), 칸 사이·행 아래 1px Gray-100 #D8D8D8, 칸 너비 같음. 본문·목록은 Figma처럼 글자 단위 줄바꿈, 좁은 표 칸은 낱말 단위(칸 높이 Figma와 일치) | `common/TermsForm` |
| 툴팁 | 마지막 로그인 계정 안내 말풍선 141×36(+꼬리 11×7), Primary-500, radius 8, padding 10 12, C1 흰색, Elevation 2. 마지막 로그인 SNS 아이콘 가운데 위, 꼬리 끝 ↔ 아이콘 8 | 로그인 페이지 마크업 |

**Top Bar / Bottom Bar 표시 기준 (시안 확인 + 추정, 화면 구현 시 Figma에서 화면별로 다시 확인)**

| 구분 | 화면 | Top Bar | Bottom Bar | Layout |
|---|---|---|---|---|
| 탭 루트 | 홈 `/`, 대회 목록 `/races`, 트래커 메인 `/tracker` | 홈은 전용 상단(프로필·알림 아이콘), 나머지는 Header | 표시 | `TabLayout` |
| 하위 화면 | 내 정보, 설정, 기록, 대회 소개, 참가 신청 등 | 표시 (뒤로가기 + 페이지명) | 없음 | `PageLayout` |
| 전체 화면 | 스플래시, 로그인, 트래커 카운트다운·기록 중 | 없음 | 없음 | `PageLayout` |
| 약관·라이선스 안내 | 오픈소스 라이선스, 약관 상세 | 표시 (페이지명 + 닫기) | 없음 | `PageLayout` |

### 6.1 스타일 관리 원칙

- 일반 퍼블리싱 CSS는 `common.css`(`#siteWrap` 범위), IA는 `ia.css`(`#iaWrap`), Guide는 `guide.css`(`.guideWrap`)에서 관리합니다.
- `common.css`를 `main.tsx`에서 전역 import하지 않고 `Layout`과 `Guide`(실제 컴포넌트 예제용)에서 import합니다.
- CSS Modules, SCSS, styled-components 등을 사용하지 않습니다.
- 색상·텍스트 스타일·간격은 6장 변수를 사용하고, 시안 값을 그대로 하드코딩하지 않습니다.
- 반응형은 모바일 우선(`min-width`)으로 작성하며 브레이크포인트는 `768px`, `1024px`입니다.
- 이메일 템플릿(`public/email/`)은 `common.css`를 쓰지 않고 테이블 레이아웃과 인라인 스타일로 작성합니다 (`AGENTS.md` 9장 예외).

### 6.2 반응형 설계 (화면 너비에 맞게 늘리기)

| 구간 | 기준 | 처리 |
|---|---|---|
| 모바일 | 360px~ | Figma 시안 그대로. 좌우 여백 24px |
| 태블릿 | 768px~ | 전체 너비 사용. 좌우 여백 40px. 카드 목록(대회 목록, 기록 목록) 2열 |
| 데스크톱 | 1024px~ | 전체 너비 사용. 좌우 여백 40px, 콘텐츠 최대 너비 1024px 가운데 정렬. 카드 목록 3열 |

- Top Bar, Bottom Bar, 팝업 Dim은 항상 화면 전체 너비를 사용합니다. 바텀시트 본문은 768px 이상에서 최대 너비 480px로 가운데 정렬합니다.
- 버튼은 모바일에서 꽉 찬 너비(312px 기준)이며, 768px 이상에서는 콘텐츠 너비를 따릅니다.
- 위 수치(여백 40px, 최대 너비 1024px, 바텀시트 480px)는 시안에 없는 값이므로 **설계 제안**입니다. 화면 구현 후 확인해서 조정합니다.

## 7. API / 데이터 소스

| 용도 | 현재 (퍼블리싱) | 추후 (개발) |
|---|---|---|
| 대회 목록·상세 | `src/data/races.ts` 목업 | 대회 API |
| 러닝 기록 | `src/data/records.ts` 목업 | 기록 API |
| 알림 | `src/data/notifications.ts` 목업 | 알림 API |
| 무료 참가권 | `src/data/coupons.ts` 목업 | 쿠폰 API |
| 약관 본문 | `src/data/terms.ts` 목업 (시안 문구) | CMS 또는 API |
| 로그인·회원가입·참가 신청 제출 | 로컬 유효성 검사 + 목업 완료 처리 | 인증·신청 API |
| 결제 | 결제 수단별 화면만 표시 | PG 연동 |
| 트래커 기록 | `setInterval` 목업 값 | GPS 연동 |
| 지도 | Figma 이미지 에셋 | 지도 API |

### 7.1 데이터 관리 원칙

- 현재 단계에서는 실제 API 연동을 구현하지 않습니다.
- 목업 문구와 수치는 Figma 시안의 값을 그대로 사용합니다 (예: `2021 JTBC 서울 마라톤`, `김러너`).
- 노데이터 상태는 빈 배열로 표현하고, `?state=nodata`일 때 빈 배열을 넘깁니다.
- 반복되는 UI 데이터는 배열로 관리하고 타입을 명시합니다.

### 7.2 환경 변수

- 현재 퍼블리싱 단계에서는 환경 변수를 추가하지 않습니다.
- 추후 API 연동 시 `.env`에 `VITE_` 접두사로 관리하고, 비밀키는 클라이언트 환경 변수에 저장하지 않습니다.

## 8. 슬라이드 컴포넌트 설계 (Swiper)

### 8.1 사용 위치

| 화면 | 영역 | Figma | 옵션 |
|---|---|---|---|
| 홈 | 참여가능 레이스 | `MY3-홈_02최대` (다음 카드가 일부 보임) | `slidesPerView: 'auto'`, `spaceBetween` 시안 기준, 768px 이상은 `breakpoints`로 조정 |
| 대회 소개 | 상세 이미지 (RA2.2.2) | 시안 확인 후 결정 | 필요 시 `pagination` |

- 위 외에 슬라이드가 필요한 영역이 시안에서 확인되면 이 표에 추가합니다.

### 8.2 설계 원칙

- 슬라이드는 Swiper(`swiper/react`)로 구현하고, 공통 `Slider`(`components/pub/common/Slider.tsx`)를 재사용합니다.
- 자동 재생, 반복, 네비게이션은 시안에 없으므로 사용하지 않습니다.
- Swiper 기본 CSS는 공식 import, 추가 스타일은 `common.css`에 작성합니다.
- 슬라이드 데이터는 `Race[]` 배열을 사용하고 `id`를 `key`로 씁니다.

## 9. 커스텀 훅 설계

| 훅 | 목적 | 사용 대상 |
|---|---|---|
| `usePageState` | URL 쿼리 `state`, `platform`, `step` 읽기·변경 | 상태별 화면이 있는 모든 페이지 |

```ts
// 사용 예시 (설계 참고용)
type LoginState = 'default' | 'error' | 'history';

const { state, platform, setState } = usePageState<LoginState>({
    states: ['default', 'error', 'history'],
    defaultState: 'default'
});
```

- 잘못된 값이 들어오면 `defaultState`를 반환합니다.
- `platform`은 `'ios' | 'aos'`이며 기본값은 `'ios'`입니다.
- `step`은 `stepCount`(기본 1)를 넘지 않는 1 이상의 정수이며, 범위를 벗어나거나 정수가 아니면 1입니다. 참가 신청은 `stepCount: 6`으로 사용합니다.
- 반환값: `{ state, platform, step, setState, setStep }`. 기본값으로 바꾸면 해당 쿼리를 주소에서 지웁니다.
- `setState`는 브라우저 기록을 쌓지 않고(replace), `setStep`은 기록을 쌓아 뒤로가기로 이전 단계로 돌아갈 수 있게 합니다.
- 구현: `src/hooks/usePageState.ts` (2026-11-17)
- 그 외 훅은 실제로 두 곳 이상에서 같은 로직이 필요해질 때 추가합니다 (예: 팝업 ESC 닫기, 카운트다운).

### 9.1 hooks와 utils 구분

| 구분 | hooks | utils |
|---|---|---|
| 위치 | `src/hooks/` | `src/utils/` |
| 목적 | React 로직 재사용 | 일반 함수 재사용 |
| 사용 예시 | `usePageState()` | `formatDday()`, `formatPace()`, `getTabIds()`(탭·내용 id, 2026-11-17 구현), `checkPasswordRules()`(비밀번호 조건 영문자·특수문자·숫자·8자 이상 충족 여부, 2026-11-17 구현) |

## 10. 결정 기록 (ADR)

> 중요한 기술 결정과 그 이유를 기록합니다. 코딩 규칙의 공식 원본은 `AGENTS.md`입니다.

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-11-16 | 상태별 화면을 쿼리 파라미터(`?state=`, `?platform=`, `?step=`)로 전환 | IA에서 상태별 화면을 바로 열어 확인하기 위해 (`requirements.md` 결정) |
| 2026-11-16 | 레이아웃을 `TabLayout`(Bottom Bar)과 `PageLayout`으로 나눔 | 시안에서 Bottom Bar가 탭 루트 화면에만 있음 |
| 2026-11-16 | `TopBar`는 각 페이지가 렌더링 | 화면마다 제목·버튼이 달라 Layout에서 관리하면 설정이 복잡해짐 |
| 2026-11-16 | Top Bar·Bottom Bar는 `position: sticky` | 스크롤 중에도 보이게 하되 템플릿 규칙(Footer fixed 금지)을 지키기 위해 |
| 2026-11-16 | 페이지 폴더를 메뉴 그룹(`member`, `my`, `race`, `tracker`, `common`)으로 나눔 | 페이지가 30개 가까이 되어 한 폴더에 두면 찾기 어려움 |
| 2026-11-16 | 이메일 템플릿은 `public/email/` 정적 HTML | 메일 클라이언트 호환 (`AGENTS.md` 9장 예외) |
| 2026-11-16 | 태블릿·PC는 화면 너비에 맞게 늘림, 세부 수치는 6.2 제안안 | 사용자 결정. 시안에 태블릿·PC 디자인이 없어 수치는 추후 조정 |
| 2026-11-16 | 폰트는 Noto Sans KR | Figma 텍스트 스타일 기준 |
| 2026-11-17 | 폰트는 `index.html`의 Google Fonts 링크로 500·700만 불러옴 | 파일 다운로드·라이브러리 설치 없이 적용 (사용자 결정). 외부 서버 의존이라 오프라인 웹뷰에서는 기본 폰트로 표시될 수 있음 |
| 2026-11-17 | 디자인 토큰·리셋은 `:root`가 아닌 `#siteWrap`에 정의, body 여백 제거는 `body:has(#siteWrap)`로 한정 | `/ia`, `/guide`에 영향을 주지 않기 위해 (`AGENTS.md` 4.1). `:has()`는 Chrome 105, Safari 15.4 이상 |
| 2026-11-17 | `common.css` 범위 기준을 `#siteWrap`에서 클래스 `.siteScope`로 변경 (루트 높이·body 여백 규칙만 `#siteWrap` 유지) | Guide에서 실제 컴포넌트 예제를 보여주려면 `<div class="siteScope">` 영역에도 같은 스타일이 적용되어야 함. ID는 한 화면에 하나뿐이라 클래스로 변경. `/ia`에는 `.siteScope`가 없어 영향 없음 |
| 2026-11-17 | TopBar Props를 `leftButton`에서 `type: 'back' \| 'close'`로 변경, 제목은 `h1` | Figma에서 뒤로가기는 왼쪽, 닫기는 오른쪽에 있어 위치가 다름. 각 화면의 페이지명을 최상위 제목으로 사용 |
| 2026-11-16 | IA·Guide 전용 CSS 분리, IA에 Guide 필수 등록 | 템플릿 규칙 유지 |
| 2026-11-17 | 레이스 탭 활성 아이콘은 비활성 아이콘 색만 Primary-500으로 바꿔 사용 (`iconTabRaceOn.svg`) | 시안에 레이스 활성 상태가 없음(RA1도 홈 활성으로 그려짐). 다른 탭도 활성·비활성이 색만 달라 같은 규칙 적용 (사용자 결정) |
| 2026-11-17 | SNS 아이콘은 PNG(88×88, 2배) 사용 | Figma 원본 로고가 비트맵이라 SVG로 받으면 파일당 150KB 이상 |
| 2026-11-16 | CSS Modules·상태 관리 라이브러리 미사용, Swiper 사용 | `AGENTS.md` 정책 |
| 2026-11-20 | 컴포넌트·페이지 폴더 평탄화: `components/pub/<묶음>/X/X.tsx` → `components/pub/<묶음>/X.tsx`, `pages/pub/<메뉴>/X/X.tsx` → `pages/pub/X.tsx` (메뉴 그룹 폴더도 없앰). AGENTS.md 4장·5.1 갱신 | 사용자 요청 |
| 2026-11-20 | 상단 바 컴포넌트 이름을 `TopBar`에서 `Header`로 변경 (`layout/Header/Header.tsx`). CSS 클래스명 `topBar*`와 Guide 앵커 `#topBar`는 그대로 둠 | 사용자 요청. 클래스명은 기존 이름 유지 규칙(AGENTS.md 5.3), 앵커 id를 header로 바꾸면 화면의 `#header` 요소와 겹침 |
| 2026-11-17 | 레이스 목록(RA1): 대회 상태 깃발은 RA1 Card Module 케이스 기준(upcoming 진행예정, open 접수중, closed 신청마감, finished 마감 + 이미지 60% 어둡게). 시안에 없는 ongoing은 진행예정 모양에 "진행중". 신청 가능 건수는 시안 예시(3건) 목업. 홈 01최소의 마감 대회도 finished로 통일(카드 모듈 기준 줄 그은 시계) | 시안 설명 1~4와 카드 모듈 케이스 |
| 2026-11-17 | 홈(MY3): 기본 `/`는 02최대, `?state=min`은 01최소. 메시지·버튼 노출 기준은 정책서(미제공)라 시안 두 문구 그대로, "레이스 결과 보러가기"는 내 정보(대회 기록)로 연결. 대회 사진은 Figma 원본 PNG(1248×1040, 824KB)를 2배 크기 JPG(624×520, 36KB)로 줄여 사용. Swiper 설치(AGENTS.md 사전 승인) | 시안 설명 3·7·8, 이미지 최적화 기준(requirements.md 5장) |
| 2026-11-17 | 회원가입(ME2): [전송하기]는 이메일이 있으면 활성(시안 01입력중이 "run" 입력 상태에서 활성), 누를 때 형식이 틀리면 로그인 시안의 "이메일 형식이 유효하지 않습니다." 표시. 남은 시간은 03:00부터 1초씩 감소, 0이면 [인증하기] 비활성. 인증 후 이메일을 바꾸면 인증 초기화. 비밀번호 조건 문구는 ME2.1 시안에 없어 표시하지 않고 [다음] 활성 조건에만 사용 | 시안·설명(13~17)에 없는 문구를 새로 만들지 않고, 기존 시안 문구·컴포넌트로 동작을 완결하기 위해 |
| 2026-11-17 | 비밀번호 재설정 화면: ME1.1 가입 이력 없음·SNS 가입 안내 문구는 넣지 않음, 새 비밀번호 재입력 불일치 문구도 없음(버튼 비활성만), ME1.4 버튼 문구는 "앱으로 로그인" | 안내·에러 문구는 시안에 없고 "서비스 정책서-입력체크 시트"(미제공) 참고라 임의로 만들지 않음. Figma 문구 "엡으로 로그인"은 오타로 판단 |
| 2026-11-17 | `Button`에 `isPage`, `Input` `helperText`를 `ReactNode`로 확장 | Figma Button Type Page(모서리 없는 하단 버튼)와 글자별 색이 다른 비밀번호 조건 문구를 공통 컴포넌트로 표현하기 위해 |
| 2026-11-17 | 로그인 상태유지 체크박스는 기본 선택 안 됨. `Input`에 `isLabelHidden`(라벨 숨김)·`hasPasswordToggle`(비밀번호 보기 버튼 끄기) 추가 | 시안 설명 "기본 값은 선택 안된 상태"(01 화면 그림은 체크됨). 로그인 시안은 라벨 없이 placeholder만 보이고 비밀번호 보기 버튼이 없어, 접근성용 라벨은 유지하며 숨김 |
| 2026-11-17 | 로그인 접속기록(`?state=history`)의 마지막 로그인 SNS는 iOS 애플(시안), AOS 구글 | AOS에는 애플 버튼이 없어 마지막 아이콘으로 표시 (목업 값) |
| 2026-11-17 | 스플래시(MY1)는 `/splash`에서 로고(01) → 인트로(02) → 홈을 각 1.5초로 자동 진행, `?state=logo`·`?state=intro`는 해당 화면에서 멈춤 | 시안 설명은 "앱 구동 시 작동되는 스플래시 화면"뿐이고 시간 정보가 없어 정한 값. IA에서 각 화면을 멈춘 채 확인하기 위해 쿼리가 있을 때는 자동 진행하지 않음 |

---

## 11. 설계 변경 관리

- 기능 요구사항이 변경되면 `docs/requirements.md`를 먼저 확인합니다.
- 컴포넌트 구조, 데이터 흐름, 인터랙션 등이 변경되면 이 문서를 갱신합니다.
- 코딩 규칙이나 라이브러리 정책 변경은 `AGENTS.md`에서 관리합니다.
- 작업 진행 상태는 `docs/tasks.md`에서 관리합니다.
- 실제 코드와 설계 문서가 다르면 임의로 수정하지 않고 차이를 확인합니다.
- 설계에 없는 기능은 사용자 확인 없이 임의로 추가하지 않습니다.

### 11.1 IA·Guide 작업 완료 검증

- `/ia`와 `/guide`가 독립 라우트로 접속되는지 확인합니다.
- `/ia`의 목록 맨 위에 `/guide` 링크가 항상 존재하는지 확인합니다.
- `ia.css`, `guide.css`, `common.css`의 스타일이 다른 페이지에 영향을 주지 않는지 확인합니다.
- 페이지 추가 시 IA(상태별 링크 포함), 공통 컴포넌트 추가·수정 시 Guide 갱신 여부를 확인합니다.
