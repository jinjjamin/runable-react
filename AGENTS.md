# AGENTS.md — 기본 프로젝트 AI 개발 가이드

> 이 파일은 프로젝트의 **AI 개발 규칙에 대한 단일 원본(SSOT)**입니다.
>
> AI 코딩 도구는 작업 전에 이 파일을 확인합니다. 도구별 지침 파일(`CLAUDE.md` 등)은 가능한 한 이 문서를 참조하도록 설정합니다.
>
> 도구에 따라 자동 로딩 방식이 다르므로 자동 참조 여부를 확인해야 합니다.

---

## 1. 프로젝트 개요

- **이름:** 러너블 (runable) 모바일 앱 퍼블리싱
- **설명:** 러닝 기록과 버추얼 레이스 대회 참가를 위한 모바일 앱 "러너블"의 Figma 상세 디자인을 React + TypeScript로 퍼블리싱합니다. 회원, 홈/마이, 레이스(대회 소개·참가 신청), 트래커, 공통 화면과 이메일 템플릿을 포함합니다.
- **대상 사용자:** 러닝 기록을 남기고 레이스 대회에 참가하는 러너 (iOS·Android 앱 웹뷰, 모바일 브라우저)
- **디자인 원본:** Figma `기획 인수인계: 03-러너블-상세디자인-v1.1-211108` (기준 화면 너비 360px). 화면 목록은 `docs/requirements.md` 4장, 디자인 토큰은 `docs/design.md` 6장을 따릅니다.
- **현재 작업 범위:** **퍼블리싱 전용.** 컴포넌트와 페이지는 `pub/` 폴더에만 작성합니다.
- **상세 문서 읽기 순서:** `docs/requirements.md` → `docs/design.md` → `docs/tasks.md`
- 위 문서가 없으면 임의로 내용을 가정하지 말고 사용자에게 확인합니다.

## 2. 기술 스택

| 구분 | 사용 기술 | 규칙 |
| --- | --- | --- |
| 빌드 | Vite | 기존 설정 유지 |
| 프레임워크 | React 18+ | 함수형 컴포넌트와 Hooks |
| 언어 | TypeScript | `strict: true` 기준 |
| 스타일 | 일반 CSS | 일반 페이지 `common.css`, 독립 IA `ia.css`, Guide `guide.css` |
| 라우팅 | React Router | 페이지가 2개 이상일 때 사용 |
| 상태 관리 | React 내장 API | `useState`, `useContext` 우선 |
| 슬라이드 | Swiper | 슬라이드 및 캐러셀 구현 시 필수 사용 |
| 패키지 매니저 | npm | 기존 의존성 우선 |

### 2.1 사용 금지

- Tailwind CSS, SCSS, CSS Modules, styled-components, Emotion 등 다른 스타일 방식
- MUI, Ant Design 등 UI 컴포넌트 라이브러리
- 클래스형 React 컴포넌트 및 TypeScript `any`
- 승인 없이 새로운 라이브러리 설치
- Swiper를 사용하지 않고 슬라이드 기능을 직접 구현하는 행위
- Lucide, Font Awesome, React Icons 등 외부 아이콘 라이브러리

### 2.2 라이브러리 설치 정책

- 기존 프로젝트에 설치된 라이브러리를 우선 사용합니다.
- **Swiper는 사전 승인된 라이브러리로 간주합니다.**
- 슬라이드 기능이 필요하고 Swiper가 설치되어 있지 않다면 `npm install swiper`로 설치할 수 있습니다.
- Swiper 외의 신규 라이브러리는 사용자 승인 후 설치합니다.
- 새로운 도구가 필요한 경우 이유와 영향 범위를 설명하고 승인 후 이 문서를 갱신합니다.
- 사용하지 않는 라이브러리를 임의로 추가하지 않습니다.

## 3. 주요 명령어

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 미리보기
npm run lint      # 린트 검사 (스크립트가 정의된 경우)
```

- Vite 개발 서버의 기본 주소는 `http://localhost:5173`입니다.
- 실제 포트는 프로젝트 설정을 따릅니다.
- 작업 완료 시 `npm run build`를 실행하여 결과를 확인합니다.
- 실행하지 못한 경우 실행하지 못했다고 명시합니다.

## 4. 프로젝트 폴더 구조

```text
src/
├── main.tsx                  # 진입점 (수정 최소화)
├── App.tsx                   # 라우팅 / 최상위 레이아웃
├── pages/
│   └── pub/                 # 퍼블리싱 페이지 (폴더 없이 파일로 바로 둠)
│       ├── Home.tsx
│       └── Ia.tsx           # IA 페이지 관리 화면
├── components/
│   └── pub/                 # 퍼블리싱 컴포넌트 (묶음 폴더 안에 파일로 바로 둠)
│       ├── common/          # 범용 UI 컴포넌트
│       │   ├── Button.tsx
│       │   └── Slider.tsx
│       └── layout/          # Header, Container, Footer
├── hooks/                   # 커스텀 훅 (useXxx.ts)
├── types/                   # 공용 타입
│   └── index.ts
├── constants/               # 공용 상수
│   └── index.ts
├── data/                    # 목업 데이터 및 IA 화면 목록
│   └── iaData.ts             # IA 목록 (필요 시 분리)
├── utils/                   # 순수 유틸 함수
└── assets/
    ├── css/
    │   ├── common.css      # 일반 퍼블리싱 페이지 전용
    │   ├── ia.css          # /ia 독립 페이지 전용
    │   └── guide.css       # /guide 독립 페이지 전용
    ├── images/              # 이미지
    ├── icons/               # 아이콘
    └── fonts/               # 폰트 리소스
```

### 4.1 폴더 관리 규칙

- 위 구조는 **기준 구조**이며, 아직 없는 폴더는 필요할 때 생성합니다.
- **컴포넌트는 `src/components/pub/`, 페이지는 `src/pages/pub/`에만 만듭니다.**
- 개발용 폴더(`src/components/common/`, `src/components/layout/`, `src/pages/`의 `pub/` 밖)는 만들지 않습니다.
- 개발 단계로 넘어갈 때 사용자 승인 후 문서를 갱신하고 추가합니다.
- `hooks/`, `types/`, `constants/`, `data/`, `utils/`, `assets/`는 공용 폴더로 `pub/` 밖에 있어도 사용합니다.
- 일반 페이지는 `common.css`, IA는 `ia.css`, Guide는 `guide.css`로 분리합니다.
- `main.tsx`에서 `common.css`를 전역 import하지 않습니다. 일반 페이지 전용 레이아웃에서만 불러옵니다.
- `/ia`, `/guide`는 일반 Layout 밖 독립 라우트로 두며 각 페이지에서 전용 CSS를 import합니다.
- CSS는 import 이후 다른 라우트에도 남을 수 있으므로, `common.css`는 일반 페이지 루트(`#siteWrap` 등), `ia.css`는 `#iaWrap`, `guide.css`는 `.guideWrap` 아래로 선택자를 한정합니다. 전역 `body`, `html`, `:root`, `*` 등은 페이지 간 영향을 주지 않도록 주의합니다.
- 묶음 폴더는 임의로 생성하지 않으며, `docs/requirements.md`에 정의된 폴더 구조만 따릅니다.

## 5. 코딩 규칙

### 5.1 컴포넌트 및 함수

- 컴포넌트는 **`const` + 화살표 함수**로 선언합니다.
- 컴포넌트 파일에서는 선언과 export를 분리합니다.
- 파일 마지막에 `export default ComponentName;`을 작성합니다.
- `function ComponentName() {}` 및 `export default function ComponentName() {}` 형식을 사용하지 않습니다.
- 일반 함수도 `const functionName = () => {}` 형태로 작성합니다.
- 컴포넌트 이름은 PascalCase, 함수 및 변수 이름은 camelCase를 사용합니다.
- 이벤트 핸들러는 `handle` 접두어를 사용합니다.
- 컴포넌트는 컴포넌트별 폴더를 만들지 않고 묶음 폴더(`common/`, `layout/` 등) 안에 `ComponentName.tsx`로 바로 둡니다. 페이지도 `src/pages/pub/PageName.tsx`로 바로 둡니다. (2026-11-20 사용자 요청으로 변경)
- Props 타입은 해당 컴포넌트 파일에 `interface XxxProps`로 정의합니다.
- 여러 파일에서 공유하는 타입만 `src/types/`에 정의합니다.
- 컴포넌트가 약 150줄을 넘으면 분리를 검토하되, 줄 수만을 이유로 불필요하게 분리하지 않습니다.

**컴포넌트 작성 예시**

```tsx
interface ButtonProps {
    label: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
}

const Button = ({
    label,
    variant = 'primary',
    onClick
}: ButtonProps) => {
    return (
        <button
            type="button"
            className={`btn ${variant}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default Button;
```

### 5.2 이름 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트, 타입 | PascalCase | `UserCard`, `UserProfile` |
| 함수, 변수 | camelCase | `formatDate`, `isOpen` |
| 커스텀 훅 | `use` + PascalCase | `useScroll`, `useCart` |
| 공용 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| CSS 클래스, ID | camelCase | `.cardTitle`, `#mainContent` |
| Boolean 변수 | `is`, `has`, `can` 권장 | `isLoading`, `hasError` |

### 5.3 CSS — 일반 페이지와 독립 관리 페이지 분리 정책

- **일반 페이지 CSS는 `src/assets/css/common.css`, IA CSS는 `src/assets/css/ia.css`, Guide CSS는 `src/assets/css/guide.css`에 작성합니다.**
- 위 세 파일 이외에 `*.module.css`, `Home.css`, `Button.css`, `variables.css` 등 CSS 파일을 생성하지 않습니다.
- 일반 페이지의 스타일은 일반 페이지 루트 아래로 한정하고, 독립 페이지는 각 루트(`#iaWrap`, `.guideWrap`) 아래로 한정합니다.
- CSS import만으로 스타일 격리가 보장되지는 않으므로 공통 전역 선택자에 의한 교차 영향을 방지합니다.
- 리셋, 폰트, CSS 변수, 공통 컴포넌트, 레이아웃, 페이지별 스타일을 `common.css` 내부 주석으로 구분합니다.
- 색상·간격·폰트 크기 등 반복되는 디자인 값은 `:root` 변수로 관리합니다.
- 기존 CSS 클래스명과 HTML 구조를 최대한 유지합니다.
- 반응형은 모바일 우선(`min-width`)으로 작성하며 기본 브레이크포인트는 `768px`, `1024px`입니다.
- 인라인 스타일은 원칙적으로 금지하며 동적 값이 불가피한 경우에만 사용합니다.
- **Swiper 등 승인된 외부 라이브러리의 필수 CSS import는 단일 CSS 파일 정책의 예외로 허용합니다.**
- 외부 라이브러리 스타일을 수정해야 하는 경우 별도 CSS 파일을 만들지 않고 `common.css`에서 재정의합니다.

**CSS 작성 예시**

```css
/* 01. Design tokens */
:root {
    --color-text: #222;
    --space-4: 16px;
    --space-6: 24px;
    --radius-md: 8px;
}

/* 02. Reset / Base */

/* 03. Common components */
.card {
    padding: var(--space-4);
    color: var(--color-text);
    border-radius: var(--radius-md);
}

/* 04. Layout */

/* 05. Publishing pages */

/* 06. Swiper custom styles */

/* 07. Responsive */
@media (min-width: 768px) {
    .card {
        padding: var(--space-6);
    }
}
```

### 5.4 이미지 및 아이콘 관리 규칙

**기본 원칙**

- 이미지와 아이콘은 **Figma 디자인 시안을 기준으로 적용합니다.**
- 아이콘은 Figma 시안에서 제공하는 원본 에셋을 내려받아 사용합니다.
- 아이콘을 임의로 제작하거나 유사한 다른 아이콘으로 대체하지 않습니다.
- Lucide, Font Awesome, React Icons 등 외부 아이콘 라이브러리를 임의로 사용하지 않습니다.
- CSS로 아이콘의 모양을 임의로 그리지 않습니다.
- Figma 원본을 내려받을 수 없거나 에셋이 누락된 경우 사용자에게 확인합니다.

**파일 관리**

- 아이콘은 `src/assets/icons/`에서 관리합니다.
- 일반 이미지는 `src/assets/images/`에서 관리합니다.
- 아이콘은 가능하면 Figma 원본에 맞는 SVG 형식으로 내보냅니다.
- 파일명은 용도를 알 수 있도록 작성합니다. 예: `iconSearch.svg`, `iconArrowRight.svg`.
- 동일한 에셋은 중복 저장하지 않고 기존 파일을 재사용합니다.
- SVG의 비율과 디자인은 시안을 유지하고, 필요한 크기 및 배치는 CSS로 조정합니다.

**React 적용 규칙**

- 다운로드한 에셋은 프로젝트 파일로 import하여 사용합니다.
- 정보 전달 이미지에는 의미 있는 `alt` 텍스트를 제공하고, 장식용 이미지는 `alt=""`를 사용합니다.
- 아이콘 버튼과 링크에는 기능을 설명하는 접근 가능한 이름을 제공합니다.
- 아이콘 크기와 간격 등 추가 스타일은 `src/assets/css/common.css`에서 관리합니다.
- Figma 시안에 없는 아이콘이나 이미지는 임의로 추가하지 않습니다.

**기본 사용 예시**

```tsx
import iconSearch from '../../../assets/icons/iconSearch.svg';
const SearchButton = () => {
    return (
        <button type="button" aria-label="검색">
            <img src={iconSearch} alt="" />
        </button>
    );
};
export default SearchButton;
```

> import 경로는 실제 컴포넌트 위치에 맞게 조정합니다.

### 5.5 TypeScript 및 상태 관리

- 공용 타입은 `src/types/`에서 정의하고 import해서 사용합니다.
- 컴포넌트 전용 Props 타입은 해당 컴포넌트 파일에 둡니다.
- `any` 대신 `unknown`과 타입 좁히기를 사용합니다.
- API 응답과 목업 데이터는 타입을 명시합니다.
- 동일한 상태를 중복 관리하지 않고, 계산 가능한 값은 원본 상태에서 도출합니다.
- React 상태 변경 시 배열과 객체의 불변성을 유지합니다.
- 단순한 화면 상태는 `useState`를 우선 사용합니다.
- 불필요한 전역 상태 관리 라이브러리를 도입하지 않습니다.

### 5.6 슬라이드(Swiper) 개발 규칙

**기본 원칙**

- 슬라이드 및 캐러셀 기능은 **Swiper 라이브러리**를 사용합니다.
- 슬라이드 이동, 터치 및 드래그 기능을 직접 JavaScript로 구현하지 않습니다.
- React 환경에 맞는 `swiper/react` 컴포넌트를 사용합니다.
- 프로젝트에 설치된 Swiper 버전을 기준으로 공식 API를 사용합니다.
- Swiper에서 제공하는 기능을 우선 활용하고 중복 기능을 직접 구현하지 않습니다.
- 슬라이드가 없는 단순 콘텐츠에는 불필요하게 Swiper를 사용하지 않습니다.

**설치**

```bash
npm install swiper
```

**구현 규칙**

- 여러 화면에서 재사용하는 슬라이드는 `src/components/pub/common/`에서 관리합니다.
- 공통으로 사용되는 슬라이드 설정은 재사용 가능한 컴포넌트로 분리합니다.
- 별도의 상태 관리나 이벤트 로직을 여러 곳에서 반복 사용하는 경우 커스텀 훅으로 분리할 수 있습니다.
- 반응형 슬라이드는 Swiper의 `breakpoints` 옵션을 우선 사용합니다.
- 자동 재생, 페이지네이션, 네비게이션은 Swiper에서 제공하는 모듈을 사용합니다.
- 슬라이드 데이터는 가능하면 배열과 `map()`을 사용하여 렌더링합니다.
- 슬라이드 데이터에는 안정적인 고유 `key`를 사용합니다.
- Swiper 기본 CSS는 공식 import 방식을 사용합니다.
- 추가 디자인 스타일은 `common.css`에 작성합니다.
- Swiper의 기본 동작을 불필요하게 변경하지 않습니다.
- 키보드 조작, 버튼 접근성 등 사용자 접근성을 고려합니다.

**기본 사용 예시**

```tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const BannerSlider = () => {
    const slideList = [
        { id: 1, title: '슬라이드 1' },
        { id: 2, title: '슬라이드 2' },
        { id: 3, title: '슬라이드 3' }
    ];

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={20}
        >
            {slideList.map((item) => (
                <SwiperSlide key={item.id}>
                    {item.title}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BannerSlider;
```

**반응형 사용 예시**

```tsx
<Swiper
    slidesPerView={1}
    spaceBetween={16}
    breakpoints={{
        768: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 24
        }
    }}
>
    {slideList.map((item) => (
        <SwiperSlide key={item.id}>
            {item.title}
        </SwiperSlide>
    ))}
</Swiper>
```

**추가 주의사항**

- 슬라이드 옵션은 디자인 요구사항에 따라 설정합니다.
- 자동 재생이 필요한 경우 사용자 조작과 접근성을 고려합니다.
- 페이지네이션 및 네비게이션은 필요한 경우에만 추가합니다.
- 공통 슬라이드 컴포넌트가 이미 있다면 새로 만들지 않고 재사용을 우선합니다.
- 프로젝트에 없는 슬라이드 기능을 임의로 추가하지 않습니다.

### 5.7 커스텀 훅(Hooks) 관리 규칙

**기본 원칙**

- 여러 컴포넌트에서 반복되는 React 상태 관리 및 이벤트 로직은 커스텀 훅으로 분리할 수 있습니다.
- 커스텀 훅은 `src/hooks/` 폴더에서 관리합니다.
- 파일명은 `useXxx.ts` 또는 JSX가 필요한 경우 `useXxx.tsx`로 작성합니다.
- 커스텀 훅은 `use` 접두어로 시작합니다.
- 단순한 데이터 가공 함수는 커스텀 훅이 아닌 `src/utils/`에서 관리합니다.
- 한 컴포넌트에서만 사용하는 단순한 로직은 불필요하게 훅으로 분리하지 않습니다.
- 훅은 React의 Hooks 호출 규칙을 준수합니다.
- 훅은 React 함수형 컴포넌트 또는 다른 커스텀 훅의 최상위에서 호출합니다.
- 조건문, 반복문, 일반 이벤트 핸들러 내부에서 훅을 호출하지 않습니다.

**커스텀 훅 예시**

`src/hooks/useWindowSize.ts`

```tsx
import { useEffect, useState } from 'react';

const useWindowSize = () => {
    const [width, setWidth] = useState(
        () => typeof window !== 'undefined'
            ? window.innerWidth
            : 0
    );

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return width;
};

export default useWindowSize;
```

**사용 예시**

```tsx
import useWindowSize from '../../../hooks/useWindowSize';

const Home = () => {
    const width = useWindowSize();

    return (
        <div>화면 너비: {width}px</div>
    );
};

export default Home;
```

> import 경로는 실제 파일 위치에 맞게 작성합니다.

**hooks와 utils 구분**

| 구분 | hooks/ | utils/ |
| --- | --- | --- |
| 목적 | React 관련 로직 재사용 | 일반 함수 재사용 |
| 상태 관리 | 가능 | React 상태 직접 관리하지 않음 |
| React Hooks 사용 | 가능 | 사용하지 않음 |
| 예시 | `useWindowSize.ts` | `formatDate.ts` |

## 6. 작업 영역: 퍼블리싱 전용

### 6.1 작업 위치

| 구분 | 페이지 | 컴포넌트 |
| --- | --- | --- |
| 퍼블리싱 (현재 작업 범위) | `src/pages/pub/` | `src/components/pub/` |
| 개발 (현재 사용 안 함) | 만들지 않음 | 만들지 않음 |

### 6.2 퍼블리싱 규칙

- 퍼블리싱은 React + TypeScript로 작성하며 **5장의 코딩 규칙을 동일하게 적용**합니다.
- **모든 컴포넌트와 페이지는 `pub/` 폴더 안에만 작성합니다.**
- 사용자가 개발용을 요청해도 문서가 갱신되기 전에는 `pub/` 밖에 만들지 않고 먼저 확인합니다.
- 퍼블리싱 전용 목업 데이터를 사용할 수 있습니다.
- 기존 마크업 구조와 CSS 클래스명을 최대한 유지합니다.
- 일반 퍼블리싱 페이지 스타일은 `common.css`, `/ia`는 `ia.css`, `/guide`는 `guide.css`에 작성합니다.
- `hooks/`, `types/`, `constants/`, `data/`, `utils/`, `assets/`는 공용 폴더로 `pub/` 밖에 있어도 사용합니다.
- 슬라이드가 필요한 경우 5.6절의 Swiper 개발 규칙을 적용합니다.
- 공통 상태 및 이벤트 로직이 필요한 경우 5.7절의 커스텀 훅 규칙을 적용합니다.
- HTML 마크업은 시맨틱 태그를 우선 사용하며, 공통 레이아웃의 태그 및 ID 구조는 docs/design.md에 정의된 설계를 따릅니다.

### 6.3 IA(Information Architecture) 페이지 관리 규칙

> **이 절(6.3 ~ 6.3.5)이 IA 화면의 디자인·마크업·기능 기준 원본(SSOT)입니다.**
> 별도의 `Ia.tsx` 파일 없이 이 문서만으로 동일한 IA 화면을 구현합니다. 아래 코드와 CSS는 원본 `Ia.tsx`(2026-11-13 반영)에서 마크업·문구·동작·스타일 값을 그대로 옮긴 것입니다.

**목적과 위치**

- IA는 퍼블리싱 화면 목록, 파일 연결, 진행 상태 및 작업 현황을 확인하는 **관리용 페이지**입니다.
- 파일 구성은 아래 4개이며, 이 구성 외의 IA 전용 파일을 만들지 않습니다.

| 파일 | 내용 | 기준 |
| --- | --- | --- |
| `src/pages/pub/Ia.tsx` | IA 화면 컴포넌트 | 6.3.2 코드 그대로 사용 |
| `src/data/iaData.ts` | `TASKS`, `IA_INFO`, `IA_TABLES` | 6.3.3 템플릿에 프로젝트 화면 목록 작성 |
| `src/types/index.ts` | `TaskKey`, `Cell`, `HeaderCell`, `IaTable` | 6.3.3 타입 추가 |
| `src/assets/css/ia.css` | IA 독립 스타일 | 6.3.4 CSS 그대로 추가 |

- 라우트는 `/ia`로 고정하고, 일반 서비스의 `Header / Footer / Layout`을 적용하지 않는 **독립 화면**으로 등록합니다.
- `Ia.tsx`는 `ia.css`를 직접 import합니다. `/guide`는 `Guide.tsx`에서 `guide.css`를 import합니다. 두 관리 화면 모두 일반 페이지의 `common.css` 스타일에 의존하지 않도록 필요한 기본 스타일을 전용 CSS에 명시합니다.

```tsx
<Routes>
    {/* IA 관리 화면: 공통 Header·Footer·Layout을 적용하지 않는 독립 화면 (AGENTS.md 6.3) */}
    <Route path="/ia" element={<Ia />} />
    {/* 일반 페이지는 Layout 안에서 렌더링 */}
    <Route element={<Layout><Outlet /></Layout>}>...</Route>
</Routes>
```

- 개발 서버 접속 주소는 `http://localhost:5173/ia`이며 실제 포트는 프로젝트 설정을 따릅니다.

### 6.3.1 디자인·기능 유지 규칙

- 기존 IA 디자인은 **100% 유지**합니다. 사용자의 별도 승인 없이 색상, 타이포그래피, 간격, 테이블 구조, 표시 문구, 상호작용을 변경하지 않습니다.
- 유지할 화면 구성(위에서 아래 순서):
    1. `header > h1` — `<em>{프로젝트명}</em>, Front-end Web developer Worksheet`
    2. `nav` — 메뉴(테이블)별 앵커 링크 (`#menuIdx1` …), 상단 고정 위치
    3. `section.noticeWrap` — 원형 `*Notice` 배지(색상 순환 애니메이션)와 상태 설명 문구
    4. `footer` — Total Count 표 (메뉴별·상태별 집계, 상태별 배경색)
    5. `section.filterWrap` — `All` + 상태별 체크박스 필터 (체크 즉시 적용)
    6. `section` — Worksheet 제목과 메뉴별 표 (`h3`에 `Menu1:` 자동 번호, `caption`에 `Target path :`)
    7. `iframe.previewIframe` — 파일명 링크에 마우스를 올리면 화면 왼쪽에 400px 미리보기
- 상태 이름과 키는 `Undone(0)`, `Done(1)`, `Modify(2)`, `Delete(3)`로 고정합니다.
- 파일명 링크는 새 창(`target="_blank"`)으로 열고, 링크 경로는 실제 React Router 경로와 일치해야 합니다.
- 미리보기 iframe 내부 `#wrap` 축소는 동일 출처이고 `#wrap`이 있는 페이지에서만 동작합니다. 없으면 축소 없이 미리보기만 표시합니다.
- Done/Modify 날짜 색상(`delayBefore/After/Today/Error`)은 원본 로직대로 클래스명에 `dueDate`가 포함된 셀에만 적용됩니다. (원본 데이터의 날짜 셀은 `date` 클래스이므로 색상 없이 가운데 정렬로 표시)

**원본에서 바꾸는 것 (이것만 다름)**

| 원본 `Ia.tsx` | 새 구현 | 이유 |
| --- | --- | --- |
| 컴포넌트 안 `<style>` 태그 | `ia.css` `#iaWrap` 범위 규칙 (6.3.4) | 독립 페이지 CSS 정책 (5.3) |
| `useEffect`로 `style[type="text/css"]` 전부 삭제 | **구현하지 않음** | 다른 화면 스타일까지 삭제됨 |
| 최상위 Fragment `<>` | `<div id="iaWrap">` | CSS 범위 제한 기준 |
| `h3` 인라인 `style={{marginTop: 50, marginBottom: 10}}` | `className="menuTitle"` + CSS | 인라인 스타일 금지 (5.3) |
| `function`·`toggleAll` 등 이름 | `const` 화살표 함수, `handle` 접두어 | 코딩 규칙 (5.1) |
| 데이터가 컴포넌트 파일 안에 있음 | `src/data/iaData.ts` 분리 | 데이터 관리 규칙 |

### 6.3.2 IA 컴포넌트 (`src/pages/pub/Ia.tsx`) — 그대로 사용

```tsx
import { useMemo, useState } from 'react';
import type { FormEvent, SyntheticEvent } from 'react';
import { IA_INFO, IA_TABLES, TASKS } from '../../../data/iaData';
import type { Cell, TaskKey } from '../../../types';

// IA 관리 화면 (/ia) — AGENTS.md 6.3 기준
// - 마크업·표시 문구·동작은 원본 Ia.tsx와 동일하게 유지합니다.
// - 원본의 <style> 태그와 전역 style 제거 useEffect는 사용하지 않고, 스타일은 ia.css의 #iaWrap 범위에 있습니다.
// - 공통 Header·Footer·Layout을 적용하지 않는 독립 화면입니다.

const hasClass = (cell: Cell, className: string) => cell.className.split(' ').includes(className);

const getTaskKey = (row: Cell[]): TaskKey => {
    const task = row.find((cell) => hasClass(cell, 'checkTask'))?.text;
    return TASKS.some((item) => item.key === task) ? (task as TaskKey) : '0';
};

const getTaskName = (key: TaskKey) => TASKS.find((task) => task.key === key)?.name ?? 'Undone';

const getFileHref = (path: string, row: Cell[]) => {
    const fileName = row.find((cell) => hasClass(cell, 'fileName'))?.text ?? '';
    const filePath = row.find((cell) => hasClass(cell, 'filePath'))?.text ?? '';
    return [path.replace(/\/$/, ''), filePath.replace(/^\/|\/$/g, ''), fileName].filter(Boolean).join('/');
};

const getDueDateClass = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'delayError';
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayText = `${yyyy}-${mm}-${dd}`;
    if (date > todayText) return 'delayBefore';
    if (date < todayText) return 'delayAfter';
    return 'delayToday';
};

const countTasks = (rows: Cell[][]) => {
    const counts = Object.fromEntries(TASKS.map((task) => [task.key, 0])) as Record<TaskKey, number>;
    rows.forEach((row) => counts[getTaskKey(row)]++);
    return counts;
};

const Ia = () => {
    const [selectedTasks, setSelectedTasks] = useState<TaskKey[]>(TASKS.map((task) => task.key));
    const [previewUrl, setPreviewUrl] = useState('');

    const allChecked = selectedTasks.length === TASKS.length;

    const totalCounts = useMemo(() => countTasks(IA_TABLES.flatMap((table) => table.rows)), []);

    const handleToggleAll = () => setSelectedTasks(allChecked ? [] : TASKS.map((task) => task.key));

    const handleToggleTask = (key: TaskKey) => {
        setSelectedTasks((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    };

    const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    // 미리보기 iframe 내부 #wrap 축소: 동일 출처이고 #wrap이 있는 페이지에서만 동작합니다.
    const handlePreviewLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
        try {
            const wrap = event.currentTarget.contentDocument?.querySelector<HTMLElement>('#wrap');
            if (wrap) {
                wrap.style.transform = 'scale(0.16923076923076924)';
                wrap.style.transformOrigin = '0 0';
            }
        } catch {
            // 다른 origin의 페이지는 iframe 내부 DOM에 접근할 수 없습니다.
        }
    };

    return (
        <div id="iaWrap">
            <header>
                <h1><em>{IA_INFO.title}</em>, Front-end Web developer Worksheet</h1>
            </header>

            <nav>
                <h2>Navigation</h2>
                <ul>
                    {IA_TABLES.map((table) => (
                        <li key={table.id}><a href={`#${table.id}`}>{table.title}</a></li>
                    ))}
                </ul>
            </nav>

            <section className="noticeWrap">
                <h2>Notice</h2>
                <ul>
                    <li>{IA_INFO.notice}</li>
                </ul>
            </section>

            <footer>
                <h2>Total Count</h2>
                <table>
                    <caption>Task total count</caption>
                    <thead>
                        <tr>
                            <th scope="col">Menu</th>
                            {TASKS.map((task) => (
                                <th scope="col" key={task.key}><i>{task.name}</i><b>{task.key}</b></th>
                            ))}
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {IA_TABLES.map((table) => {
                            const counts = countTasks(table.rows);
                            return (
                                <tr key={table.id}>
                                    <th scope="row">{table.title}</th>
                                    {TASKS.map((task) => <td key={task.key}>{counts[task.key]}</td>)}
                                    <td>{table.rows.length}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row">Total</th>
                            {TASKS.map((task) => <td key={task.key}>{totalCounts[task.key]}</td>)}
                            <td>{IA_TABLES.reduce((sum, table) => sum + table.rows.length, 0)}</td>
                        </tr>
                    </tfoot>
                </table>
            </footer>

            <section className="filterWrap">
                <h2>Task Key/Filter</h2>
                <form onSubmit={handleFilterSubmit}>
                    <fieldset>
                        <legend>Filter option(It&apos;ll be automatically applied)</legend>
                        <label><input type="checkbox" checked={allChecked} onChange={handleToggleAll} />All</label>
                        {TASKS.map((task) => (
                            <label key={task.key}>
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.includes(task.key)}
                                    onChange={() => handleToggleTask(task.key)}
                                />
                                <b className={task.key === '0' ? 'default' : undefined}>{task.key}</b><i>{task.name}</i>
                            </label>
                        ))}
                    </fieldset>
                </form>
            </section>

            <section>
                <h2>{IA_INFO.worksheet}</h2>
                {IA_TABLES.map((table) => {
                    const visibleRows = table.rows.filter((row) => selectedTasks.includes(getTaskKey(row)));
                    const tableCounts = countTasks(table.rows);

                    return (
                        <div key={table.id}>
                            <h3 id={table.id} className="menuTitle">{table.title}</h3>
                            <table>
                                <caption>{table.path}</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className="pageNumber">Number</th>
                                        {table.headers.map((header, index) => (
                                            <th scope="col" className={header.className || undefined} key={`${header.text}-${index}`}>
                                                {header.text}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleRows.map((row) => {
                                        const originalIndex = table.rows.indexOf(row);
                                        const taskKey = getTaskKey(row);
                                        return (
                                            <tr key={`${table.id}-${originalIndex}`}>
                                                <td className="pageNumber">{originalIndex + 1}</td>
                                                {row.map((cell, cellIndex) => {
                                                    const isFileName = hasClass(cell, 'fileName');
                                                    const isTask = hasClass(cell, 'checkTask');
                                                    const isDueDate = hasClass(cell, 'dueDate');
                                                    const className = [cell.className, isDueDate ? getDueDateClass(cell.text) : '']
                                                        .filter(Boolean)
                                                        .join(' ');
                                                    const href = isFileName && cell.text ? getFileHref(table.path, row) : '';
                                                    return (
                                                        <td className={className} data-task={isTask ? taskKey : undefined} key={cellIndex}>
                                                            {isFileName && cell.text ? (
                                                                <a
                                                                    href={href}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onMouseEnter={() => setPreviewUrl(href)}
                                                                    onMouseLeave={() => setPreviewUrl('')}
                                                                >
                                                                    {cell.text}
                                                                </a>
                                                            ) : isTask ? getTaskName(taskKey) : cell.text}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    {TASKS.map((task) => (
                                        <tr key={task.key}>
                                            <th scope="row" colSpan={table.headers.length}><i>{task.name}</i><b>{task.key}</b></th>
                                            <td>{tableCounts[task.key]}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th scope="row" colSpan={table.headers.length}>Total</th>
                                        <td>{table.rows.length}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    );
                })}
            </section>

            {previewUrl && (
                <iframe className="previewIframe" src={previewUrl} title="페이지 미리보기" onLoad={handlePreviewLoad} />
            )}
        </div>
    );
};

export default Ia;
```

### 6.3.3 IA 데이터 구조 (`src/types/index.ts`, `src/data/iaData.ts`)

**타입** — `src/types/index.ts`에 추가합니다. (원본 타입 이름 유지)

```ts
// IA 관리 화면 (AGENTS.md 6.3 원본 구조 유지)
// Task 상태: 0 Undone(코딩중), 1 Done(코딩완료), 2 Modify(완료 후 수정), 3 Delete(완료 후 삭제)
export type TaskKey = '0' | '1' | '2' | '3';

export interface Cell {
    className: string;
    text: string;
}

export interface HeaderCell {
    className: string;
    text: string;
}

export interface IaTable {
    id: string;
    title: string;
    path: string;
    headers: HeaderCell[];
    rows: Cell[][];
}
```

**데이터 템플릿** — `src/data/iaData.ts`. 구조는 그대로 두고 `IA_INFO`와 `IA_TABLES`의 화면 목록만 프로젝트에 맞게 작성합니다.

```ts
import type { Cell, HeaderCell, IaTable, TaskKey } from '../types';
import { ROUTES } from '../constants';

// IA 관리 화면 데이터 (AGENTS.md 6.3)
// - 화면 목록은 docs/requirements.md 페이지 목록과 실제 React Router 경로 기준입니다.
// - Task 상태는 docs/tasks.md 완료 기록 기준이며, 페이지를 추가·수정하면 이 파일도 함께 갱신합니다.

export const TASKS: { key: TaskKey; name: string }[] = [
    { key: '0', name: 'Undone' },
    { key: '1', name: 'Done' },
    { key: '2', name: 'Modify' },
    { key: '3', name: 'Delete' }
];

// 프로젝트마다 바꾸는 값: title(h1 <em> 문구), worksheet(작업 영역 제목)
// notice 문구는 원본 그대로 유지합니다.
export const IA_INFO = {
    title: '프로젝트 이름',
    worksheet: 'Worksheet: Web',
    notice: 'Undone: 코딩중, Done: 코딩완료, Modify: 코딩 완료 후 HTML수정, Delete: 코딩 완료 후 SB삭제'
};

// 메뉴 깊이 열 개수 (원본 기본값: 5~6. 프로젝트 메뉴 깊이에 맞게 조정)
const DEPTH_COUNT = 2;

const createHeaders = (depthCount: number): HeaderCell[] => [
    ...Array.from({ length: depthCount }, (_, index) => ({ className: 'menuDepth', text: `Depth${index + 1}` })),
    { className: 'fileName', text: 'File Name/ID' },
    { className: 'dueDate', text: 'Done/Modify' },
    { className: 'people', text: 'People' },
    { className: 'issueMemo', text: 'Issue/Memo' },
    { className: 'checkTask', text: 'Task' }
];

interface RowOption {
    date?: string;
    people?: string;
    memo?: string;
    task?: TaskKey;
}

// depths: 메뉴 깊이별 이름 (상위 메뉴와 같은 행이 아니면 빈 문자열)
// fileName: 실제 React Router 경로 (IA에서 새 창 열기·미리보기 링크로 사용)
// task 기본값은 '0'(Undone). 검증된 페이지만 '1'(Done)로 바꿉니다.
const createRow = (depths: string[], fileName: string, option: RowOption = {}): Cell[] => {
    const { date = '', people = '', memo = '', task = '0' } = option;
    return [
        ...Array.from({ length: DEPTH_COUNT }, (_, index) => ({ className: 'menuDepth', text: depths[index] ?? '' })),
        { className: 'fileName', text: fileName },
        { className: 'date', text: date },
        { className: 'people', text: people },
        { className: 'issueMemo', text: memo },
        { className: 'checkTask', text: task }
    ];
};

// 예시: 메뉴(테이블)마다 id는 menuIdx1부터 순서대로 부여합니다.
export const IA_TABLES: IaTable[] = [
    {
        id: 'menuIdx1',
        title: '메인',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [createRow(['메인'], ROUTES.home, { date: 'YYYY-MM-DD', task: '1' })]
    },
    {
        id: 'menuIdx2',
        title: '회사소개',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['회사소개'], '/about'),
            createRow(['', '오시는 길'], '/about/location', { memo: '지도 API 미정' })
        ]
    }
];
```

**셀 규칙**

| 열 | `className` | 내용 |
| --- | --- | --- |
| 메뉴 깊이 | `menuDepth` | 해당 깊이의 메뉴명. 상위 메뉴와 같은 행이 아니면 빈 문자열 |
| 파일명/ID | `fileName` | 실제 라우트 경로. 값이 있으면 새 창 링크 + 미리보기 |
| (선택) 하위 경로 | `filePath` | 필요할 때만. 링크 = `table.path` + `filePath` + `fileName` |
| 완료/수정일 | `date` | `YYYY-MM-DD` |
| 담당자 | `people` | 이름 |
| 이슈/메모 | `issueMemo` | 특이사항 |
| 상태 | `checkTask` | `'0'`~`'3'`. 그 외 값은 `'0'`(Undone)으로 처리 |

**화면 목록 관리**

- 실제 IA 목록은 `docs/requirements.md`, `docs/design.md`, 생성된 `src/pages/pub/` 페이지를 기준으로 등록합니다. 임의로 화면이나 완료 상태를 만들지 않습니다.
- 미완료 페이지를 `Done`으로 표시하지 않습니다. `docs/tasks.md`에서 검증 완료된 페이지만 `'1'`로 바꿉니다.
- 페이지 추가·수정 시 IA 항목의 메뉴명, 파일명(경로), 상태를 함께 갱신합니다.
- **필수 고정 항목:** `/guide` 페이지는 공통 컴포넌트 유무와 관계없이 `/ia` 화면 목록에 반드시 포함합니다. `src/pages/pub/Guide.tsx` 및 `/guide` 라우트를 생성·유지하고 `IA_TABLES`에 `Guide` 행을 등록합니다. 삭제하거나 누락하지 않습니다.
- Guide의 상태는 실제 작업 및 검증 결과를 따르며, 미완료 상태를 임의로 `Done`으로 표시하지 않습니다.
- `docs/tasks.md`(작업 공식 기록)와 IA 상태가 다르면 사용자에게 확인하며 임의로 덮어쓰지 않습니다.
- 과거 프로젝트의 메뉴·파일명·화면 ID(예: `SMSCO00001M`)는 새 프로젝트 데이터로 사용하지 않습니다.

### 6.3.4 IA 스타일 (`src/assets/css/ia.css`) — 그대로 추가

- 원본 `<style>`의 모든 규칙을 **값 변경 없이** `#iaWrap` 범위로 옮긴 결과입니다. 변환 규칙: 각 선택자 앞에 `#iaWrap ` 추가, `body` → `#iaWrap`, `html input[...]` → `input[...]`, normalize의 `body{margin:0}`·`html{...}`·빈 규칙 제외, `@keyframes`는 범위 지정이 불가하여 그대로 둠.
- `08-1`은 프로젝트 공통 리셋(`box-sizing: border-box`, `ul` 목록 스타일 제거)을 IA 안에서만 원본 기본값으로 되돌리는 보정입니다.
- 일반 페이지 CSS가 IA에 영향을 주지 않고, IA CSS가 일반 페이지(`#header`, `#container`, `#footer`)에 영향을 주지 않는지 확인합니다.

```css
/* 08. IA 관리 화면 (/ia) --------------------------------------------------- */
/* AGENTS.md 6.3: 원본 Ia.tsx <style>의 규칙을 값 변경 없이 #iaWrap 범위로 옮겼습니다.
   - body 규칙 → #iaWrap, html input[...] → input[...]
   - normalize의 body{margin:0}, html{...}, 빈 규칙(q{}, h1 em::before{})은 제외
   - @keyframes bgChange는 범위 지정이 불가하여 그대로 둡니다. */

/* 08-1. 일반 페이지 스타일과 분리: IA는 원본처럼 브라우저 기본값 기준으로 표시 */
#iaWrap,
#iaWrap *,
#iaWrap *::before,
#iaWrap *::after {
    box-sizing: content-box;
}

#iaWrap ul {
    padding-left: 40px;
    list-style: disc;
}

/* 08-2. 원본 Ia.tsx 인라인 스타일(h3 style={{marginTop: 50, marginBottom: 10}})을 옮긴 규칙 */
#iaWrap h3.menuTitle {
    margin-top: 50px;
    margin-bottom: 10px;
}

/* 08-3. 원본 Ia.tsx <style> (범위 지정본) */
#iaWrap article, #iaWrap aside, #iaWrap details, #iaWrap figcaption, #iaWrap figure, #iaWrap footer, #iaWrap header, #iaWrap hgroup, #iaWrap main, #iaWrap nav, #iaWrap section, #iaWrap summary {display: block}
#iaWrap audio, #iaWrap canvas, #iaWrap video {display: inline-block}
#iaWrap audio:not([controls]) {display: none;height: 0;}
#iaWrap [hidden], #iaWrap template {display: none}
#iaWrap a {background: transparent;text-decoration: none;}
#iaWrap a:focus {outline: thin dotted}
#iaWrap a:active, #iaWrap a:hover {outline: 0}
#iaWrap h1 {font-size: 2em;margin: 0.67em 0;}
#iaWrap abbr[title] {border-bottom: 1px dotted}
#iaWrap b, #iaWrap strong {font-weight: bold}
#iaWrap dfn {font-style: italic}
#iaWrap hr {-moz-box-sizing: content-box;box-sizing: content-box;height: 0;}
#iaWrap mark {background: #ff0;color: #000;}
#iaWrap code, #iaWrap kbd, #iaWrap pre, #iaWrap samp {font-family: monospace, serif;font-size: 1em;}
#iaWrap pre {white-space: pre-wrap}
#iaWrap small {font-size: 80%}
#iaWrap sub, #iaWrap sup {font-size: 75%;line-height: 0;position: relative;vertical-align: baseline;}
#iaWrap sup {top: -0.5em}
#iaWrap sub {bottom: -0.25em}
#iaWrap img {border: 0}
#iaWrap svg:not(:root) {overflow: hidden}
#iaWrap figure {margin: 0}
#iaWrap fieldset {border: 1px solid #c0c0c0;margin: 0 2px;padding: 0.35em 0.625em 0.75em;}
#iaWrap legend {border: 0;padding: 0;}
#iaWrap button, #iaWrap input, #iaWrap select, #iaWrap textarea {font-family: inherit;font-size: 100%;margin: 0;}
#iaWrap button, #iaWrap input {line-height: normal}
#iaWrap button, #iaWrap select {text-transform: none}
#iaWrap button, #iaWrap input[type="button"], #iaWrap input[type="reset"], #iaWrap input[type="submit"] {-webkit-appearance: button;cursor: pointer;}
#iaWrap button[disabled], #iaWrap input[disabled] {cursor: default}
#iaWrap input[type="checkbox"], #iaWrap input[type="radio"] {box-sizing: border-box;padding: 0;}
#iaWrap input[type="search"] {-webkit-appearance: textfield;-moz-box-sizing: content-box;-webkit-box-sizing: content-box;box-sizing: content-box;}
#iaWrap input[type="search"]::-webkit-search-cancel-button, #iaWrap input[type="search"]::-webkit-search-decoration {-webkit-appearance: none}
#iaWrap button::-moz-focus-inner, #iaWrap input::-moz-focus-inner {border: 0;padding: 0;}
#iaWrap textarea {overflow: auto;vertical-align: top;}
#iaWrap table {border-collapse: collapse;border-spacing: 0;}
#iaWrap section:not([class]) tr [data-task="0"], #iaWrap tfoot tr:nth-child(1) th, #iaWrap footer thead th:nth-child(2), #iaWrap footer tfoot td:nth-child(2) {color: #b90b0b;background-color: #feeeee;}
#iaWrap section:not([class]) tr [data-task="1"], #iaWrap tfoot tr:nth-child(2) th, #iaWrap footer thead th:nth-child(3), #iaWrap footer tfoot td:nth-child(3) {color: #5f8b33;background-color: #eaf5e1;}
#iaWrap section:not([class]) tr [data-task="2"], #iaWrap tfoot tr:nth-child(3) th, #iaWrap footer thead th:nth-child(4), #iaWrap footer tfoot td:nth-child(4) {color: #f2ac1a;background-color: #fffbe5;}
#iaWrap section:not([class]) tr [data-task="3"], #iaWrap tfoot tr:nth-child(4) th, #iaWrap footer thead th:nth-child(5), #iaWrap footer tfoot td:nth-child(5) {color: #23485a;background-color: #eef7fc;}
#iaWrap section:not([class]) tr [data-task="4"], #iaWrap tfoot tr:nth-child(5) th, #iaWrap footer thead th:nth-child(6), #iaWrap footer tfoot td:nth-child(6) {color: #892997;background-color: #f4eefc;}
#iaWrap .delayBefore {color: #5f8b33}
#iaWrap .delayAfter {color: #b90b0b}
#iaWrap .delayToday {color: #23485a}
#iaWrap .delayError {color: #f2ac1a}
#iaWrap nav + h2, #iaWrap footer b, #iaWrap tfoot b, #iaWrap footer h2, #iaWrap footer caption {display: block;overflow: hidden;position: absolute;left: 0;top: 0;width: 1px;height: 1px;text-indent: -1px;}
#iaWrap {min-width: 1000px;margin: 100px auto 0;padding-bottom: 50px;color: #777;border-bottom: 20px solid #333;font: .75em/1 "helveticaneue-light", "helvetica neue light", "helvetica neue", helvetica, arial, sans-serif;}
#iaWrap section, #iaWrap footer, #iaWrap header {width: 95%;margin: auto;}
#iaWrap h1, #iaWrap h2, #iaWrap h3 {color: #333;font-weight: normal;letter-spacing: -1px;}
#iaWrap h1 {position: relative;margin-bottom: 50px;padding: 50px 0 25px;border: 4px double #eee;border-width: 4px 0 1px;font: italic 2.3em "droid serif", georgia, times, serif;}
#iaWrap h1 em {font-size: 1.5em}
#iaWrap h2 {letter-spacing: 1px}
#iaWrap nav h2 {width: 95%;height: 30px;margin: 0 auto;padding: 0;font-size: 1.2em;line-height: 30px;}
#iaWrap nav h2::after {content: ": "}
#iaWrap .noticeWrap h2 {position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto auto auto 10px;width: 150px;height: 150px;border-radius: 150px;color: #fff;font-size: 2em;text-align: center;line-height: 150px;letter-spacing: 3px;background-color: #666;animation: bgChange 5s linear 2s;-webkit-animation: bgChange 5s linear 2s;}
#iaWrap .noticeWrap h2::before {content: "*"}
@keyframes bgChange {0% { color: #fff;background-color: #ccc;} 10%{color: #b90b0b;background-color: #feeeee;} 20%{color: #5f8b33;background-color: #eaf5e1;} 30%{color: #f2ac1a;background-color: #fffbe5;} 40%{color: #23485a;background-color: #eef7fc;} 50%{color: #892997;background-color: #f4eefc;} 60%{color: #23485a;background-color: #eef7fc;} 70%{color: #f2ac1a;background-color: #fffbe5;} 80%{color: #5f8b33;background-color: #eaf5e1;} 90%{color: #b90b0b;background-color: #feeeee;} 100%{color: #fff;background-color: #ccc;}}
@-webkit-keyframes bgChange {0% { color: #fff;background-color: #ccc;} 10%{color: #b90b0b;background-color: #feeeee;} 20%{color: #5f8b33;background-color: #eaf5e1;} 30%{color: #f2ac1a;background-color: #fffbe5;} 40%{color: #23485a;background-color: #eef7fc;} 50%{color: #892997;background-color: #f4eefc;} 60%{color: #23485a;background-color: #eef7fc;} 70%{color: #f2ac1a;background-color: #fffbe5;} 80%{color: #5f8b33;background-color: #eaf5e1;} 90%{color: #b90b0b;background-color: #feeeee;} 100%{color: #fff;background-color: #ccc;}}
#iaWrap .filterWrap h2 {margin: 0 0 10px;font-size: 1.8em;text-align: center;}
#iaWrap section:not([class]) h2 {color: #eee;margin: 0;border-bottom: 2px solid;font: italic 3em "droid serif", georgia, times, serif;text-align: right;opacity: .7;}
#iaWrap h3 {margin: 50px 0 0 0;font-size: 1.8em;}
#iaWrap h3:before {counter-increment: menu;content: "Menu" counter(menu) ": ";font-size: .8em;letter-spacing: 0px;}
#iaWrap a {color: #205589;text-decoration: none;}
#iaWrap a:hover, #iaWrap a:focus {text-decoration: underline}
#iaWrap i {margin-right: 3px;font-style: normal;}
#iaWrap b {font-weight: normal}
#iaWrap ::selection {background: #f2ebff}
#iaWrap nav {overflow: hidden;position: absolute;top: 50px;left: 0;width: 100%;min-width: 1000px;}
#iaWrap nav ul {overflow: hidden;width: 95%;margin: -30px auto 0;padding: 0 0 10px;border-bottom: 5px solid #333;list-style: none;}
#iaWrap nav li, #iaWrap nav a {float: left}
#iaWrap nav a {position: relative;height: 30px;margin: 0 10px;color: #333;font-size: 1.2em;font-weight: bold;text-decoration: none;line-height: 30px;transition: .3s ease-out;}
#iaWrap nav a:hover {color: #b90b0b;transition: .3s;}
#iaWrap nav li:not(:first-child) a::before {content: "";display: block;position: absolute;top: 10px;left: -10px;width: 1px;height: 10px;background-color: #aaa;}
#iaWrap nav li:first-child a {margin-left: 90px}
#iaWrap section {counter-reset: menu;margin-top: 50px;padding: 25px 0;}
#iaWrap .noticeWrap {position: relative;min-height: 100px;margin-bottom: 25px;padding: 50px 0;border-bottom: 1px dashed #eee;}
#iaWrap .noticeWrap ul {margin: 0 10px 0 160px;line-height: 1.5;}
#iaWrap table {width: 100%;border: 1px solid #e0e0e0;border-bottom-width: 2px;font-size: .95em;}
#iaWrap caption {margin: -10px 0 5px;padding-bottom: 5px;border-bottom: 1px dashed #ccc;font-size: 1em;text-align: right;}
#iaWrap caption:before {content: "Target path : "}
#iaWrap thead th {color: #666;padding: 15px 5px;border: 1px solid #e0e0e0;border-bottom-width: 2px;font-weight: normal;background: #f3f3f3;}
#iaWrap tbody tr:nth-child(2n) td, #iaWrap tbody tr:nth-child(2n) th {background-color: #f8f8f8}
#iaWrap tbody th, #iaWrap tbody td {padding: 10px 5px;border: 1px solid #e0e0e0;font-weight: normal;background: #fcfcfc;transition: .3s ease-out;}
#iaWrap tbody tr:hover td {color: #000;background-color: #f3f9ff;transition: .3s;}
#iaWrap tbody td:last-child {text-align: center}
#iaWrap tfoot {border-top: 3px double #ccc}
#iaWrap tfoot th, #iaWrap tfoot td {color: #333;padding: 5px;border: 1px solid #e0e0e0;font-weight: normal;background: #fcfcfc;}
#iaWrap tfoot th {padding: 3px 10px;text-align: right;background-color: #eee;}
#iaWrap th:first-child {width: 6%}
#iaWrap .dueDate {width: 7%}
#iaWrap .dueDate, #iaWrap td:first-child {text-align: center}
#iaWrap footer {margin-top: -10px;margin-bottom: 25px;padding: 0 10px;}
#iaWrap footer table {text-align: center}
#iaWrap footer th, #iaWrap footer td {border-width: 3px;border-color: #fff;}
#iaWrap footer th:first-child {width: auto}
#iaWrap footer thead th {letter-spacing: 1px;font-size: 1.3em;background-color: #fff !important;}
#iaWrap footer thead th:first-child, #iaWrap footer tbody th:first-child {text-align: right;border-left-width: 1px;}
#iaWrap footer tbody tr:last-child th, #iaWrap footer tbody tr:last-child td {border-bottom-width: 15px}
#iaWrap footer tfoot th, #iaWrap footer tfoot td {padding: 10px;font-size: 1.5em;}
#iaWrap footer tfoot th:first-child {color: #666;background-color: #f3f3f3;}
#iaWrap .filterWrap {margin-top: 0;border-top: 1px dashed #eee;border-bottom: 1px dashed #ccc;background-color: #fcfcfc;}
#iaWrap .filterWrap fieldset {border: none;margin: 0;padding: 0 10px;overflow: hidden;text-align: center;}
#iaWrap .filterWrap legend {display: none}
#iaWrap .filterWrap label {display: inline-block;margin-right: 10px;padding: 5px 0;font-size: 1.2em;}
#iaWrap .filterWrap input {margin-right: 5px}
#iaWrap .filterWrap b::after {content: ":"}
#iaWrap .filterWrap i {margin-left: 5px}
#iaWrap .people {text-align:center}
#iaWrap nav a { letter-spacing: -1px; }
#iaWrap .design, #iaWrap .date { text-align: center; }
#iaWrap .previewIframe { display: block; position: fixed; top: 0; left: 0; background: #fff; width: 400px; height: 100%; border: 1px solid #000; z-index: 999; }
#iaWrap .delete { text-decoration: line-through; }
```

### 6.3.5 IA 구현 절차 (체크리스트)

1. `src/types/index.ts`에 6.3.3 타입을 추가합니다.
2. `src/data/iaData.ts`를 6.3.3 템플릿으로 만들고, `IA_INFO.title`과 `IA_TABLES` 화면 목록을 requirements.md·실제 라우트 기준으로 작성합니다.
3. `src/pages/pub/Ia.tsx`를 6.3.2 코드 그대로 만듭니다.
4. `src/assets/css/ia.css`에 6.3.4 CSS를 작성하고 `Ia.tsx`에서 import합니다. `common.css`에는 IA 스타일을 추가하지 않습니다.
5. React Router에 `/ia`를 Layout 밖 독립 라우트로 등록합니다. `/guide`도 동일하게 독립 라우트로 등록하고 `Guide.tsx`에서 `guide.css`를 import합니다. `/guide`도 독립 라우트로 등록하고, `/ia` 목록에 `Guide` 항목이 반드시 보이도록 `IA_TABLES`에 추가합니다.
6. 확인: `common.css`가 `/ia`, `/guide`에 영향을 주지 않고 각 전용 CSS가 일반 페이지에 영향을 주지 않는지 확인합니다. `/ia`에서 상단 Navigation·Notice·Total Count·필터·메뉴별 표가 보이는지, 필터 체크 해제 시 행이 숨겨지는지, 파일명 링크 새 창 열기와 마우스 오버 미리보기가 되는지, 일반 페이지 스타일이 바뀌지 않았는지, `npm run build` 통과.

### 6.4 공통 컴포넌트 UI Guide 작성 규칙

**목적 및 위치**

- `/guide`는 퍼블리싱 공통 컴포넌트의 Props, 상태, 이벤트, 사용 예제를 확인하는 독립 페이지입니다.
- 파일: `src/pages/pub/Guide.tsx`. 일반 서비스 Header/Footer를 적용하지 않습니다.
- 기존 `Guide.tsx`의 마크업·클래스명을 우선 재사용하며, 컴포넌트가 추가되면 가이드 항목도 함께 갱신합니다.
- 스타일은 **`src/assets/css/guide.css`**에 작성하며 `.guideWrap` 범위로 제한합니다. `Guide.tsx`에서 전용 CSS를 import하고 `common.css`에 Guide 전용 스타일을 작성하지 않습니다.

**기본 화면 구조 (참고 템플릿)**

```text
.guideWrap
├── aside.guideSide
│   ├── h1.guideLogo
│   └── nav.guideNav → a[href="#섹션ID"]
└── main.guideContent
    ├── .guideHead → 제목 / 소개
    └── section.guideSection#섹션ID (반복)
        ├── .guideTitle → 구분 / 컴포넌트명 / 파일 경로
        └── .guideItem (반복)
            ├── .guideItemHead → 제목 / 설명
            └── .guidePreview → Props 표 / 실제 UI / 예제 코드
```

**가이드 작성 기준**

- 컴포넌트별 섹션을 만들고 왼쪽 메뉴 앵커와 섹션 `id`를 동일하게 연결합니다.
- 각 섹션에는 필요한 항목만 작성합니다: **Props 표**(`Props / Type / Default / Description`), **상태·이벤트**, **실제 UI 예제**, **사용 코드**.
- 기존 클래스 `.guideTable`, `.guideFlex`, `.guideCode`, `.guideItem` 등을 재사용합니다.
- `GuideItem`은 `title`, 선택적 `desc`, `children`을 받는 공통 블록으로 사용합니다.
- 컴포넌트 Props와 예제는 실제 구현을 확인하여 작성하며 존재하지 않는 옵션을 만들지 않습니다.
- 기존 섹션 예: `button`, `input`, `checkbox`, `radiobox`, `select`, `tabs`, `modal`, `table`.
- React 컴포넌트는 5.1절의 `const` 화살표 함수 및 파일 마지막 `export default` 규칙을 따릅니다.

**왼쪽 메뉴 활성화 및 접근성**

- 최초 진입 시 URL 해시와 일치하는 메뉴를 활성화하며, 해시가 없으면 첫 번째 메뉴를 활성화합니다.
- 메뉴 클릭 시 해당 섹션으로 부드럽게 이동하고 선택된 링크에 `on` 클래스를 적용합니다.
- 직접 스크롤할 때도 현재 섹션에 맞춰 활성 메뉴를 변경합니다. 활성 메뉴는 항상 하나만 유지합니다.
- 기존 `<a href="#섹션ID">`를 유지하고 Tab·Enter 조작, `:focus-visible` 포커스 표시를 지원합니다.
- 활성 링크에는 `aria-current="location"`을 적용합니다.
- 스크롤 감지는 `IntersectionObserver` 등을 사용하되 이벤트 및 Observer를 정리합니다.
- 활성 메뉴 스타일은 `guide.css`의 `.guideWrap .guideNav a.on`에서 관리합니다.

**페이지 생성 시 IA 및 Guide 등록 (필수)**

- **Guide 페이지 자체는 `/ia`의 필수 고정 등록 항목이며, 항상 목록의 최상단에 배치합니다.** 최초 프로젝트 구성부터 `src/pages/pub/Guide.tsx`와 `/guide` 라우트를 만들고, `src/data/iaData.ts`의 `IA_TABLES`에 `Guide` 페이지를 반드시 등록합니다. 공통 컴포넌트 추가 여부와 무관하게 항상 유지합니다.

- `src/pages/pub/`에 새 퍼블리싱 페이지를 생성하면 **같은 작업에서 IA 화면 목록에도 해당 페이지를 추가**합니다.
- IA 목록은 `src/data/iaData.ts`의 `IA_TABLES`를 기준으로 관리하고, 화면명·경로·진행 상태를 실제 라우트와 일치시킵니다. 기존 IA 화면 구조 및 스타일은 변경하지 않습니다.
- 새 페이지에서 **재사용 가능한 공통 컴포넌트를 신규 작성하거나 기존 공통 컴포넌트의 Props·사용법을 변경했다면** `/guide`에 해당 컴포넌트의 메뉴와 섹션, Props·사용 예제를 추가하거나 갱신합니다.
- 페이지 자체를 Guide에 중복 등록하지 않습니다. **IA는 페이지 목록, Guide는 공통 컴포넌트 설명**을 관리합니다.
- 단순 페이지 생성으로 Guide 변경이 필요하지 않다면 작업 결과에 `Guide 변경 없음(공통 컴포넌트 변경 없음)`이라고 명시합니다.
- IA·Guide 갱신도 해당 작업의 완료 조건에 포함하며, 누락된 경우 완료 처리하지 않습니다.
- Guide는 메인(Home) 페이지보다 항상 위에 표시하며, 다른 페이지가 추가되거나 목록이 변경되어도 첫 번째 순서를 유지합니다.

### 6.4.1 UI Guide CSS 원본 (`src/assets/css/guide.css`)

- 아래는 사용자가 제공한 Guide CSS 전체입니다. 채팅 입력 과정에서 속성명에 붙은 Markdown 강조 기호(`*`)만 제거해 정상 CSS 문법으로 복원했습니다. 디자인 수치는 변경하지 않습니다.
- `Guide.tsx`에서 `guide.css`를 import합니다. 이 원본은 `.guideSide` 등 독립 클래스 선택자를 포함하므로, 다른 페이지와 충돌하지 않도록 Guide 전용 클래스명을 다른 페이지에서 사용하지 않습니다.
- 왼쪽 메뉴의 `on` 상태 및 키보드 포커스는 아래 원본에 없는 추가 동작이므로, 기존 원본 규칙을 보존하면서 필요한 규칙만 별도로 덧붙입니다.

```css
.guideWrap {min-height: 100vh;background: #f6f7f9;color: #1d2129;}

/* sidebar */
.guideSide {position: fixed;left: 0;top: 0;width: 250px;height: 100vh;padding: 40px 28px;box-sizing: border-box;background: #111318;color: #fff;}
.guideLogo { margin: 0 0 50px; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.guideNav { display: flex; flex-direction: column; gap: 4px; }
.guideNav strong { margin: 26px 0 10px; color: #777e8c; font-size: 11px; letter-spacing: 1.2px; }
.guideNav a { display: block; padding: 9px 12px; border-radius: 8px; color: #b8bdc7; font-size: 14px; text-decoration: none; transition: 0.2s; }
.guideNav a:hover { background: rgba(255,255,255,0.08); color: #fff; }

/* content */
.guideContent { margin-left: 250px; padding: 70px 70px 150px; }
.guideHead { margin-bottom: 70px; }
.guideBadge { display: inline-flex; align-items: center; height: 26px; padding: 0 10px; border-radius: 20px; background: #111318; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.guideHead h2 { margin: 18px 0 10px; font-size: 42px; line-height: 1.2; letter-spacing: -1.5px; }
.guideHead p { margin: 0; color: #777; font-size: 15px; }

/* section */
.guideSection { margin-top: 60px; padding-top: 20px; }
.guideTitle { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid #dadde3; }
.guideCategory { display: block; margin-bottom: 7px; color: #8a8f99; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.guideTitle h3 { margin: 0; font-size: 30px; letter-spacing: -0.8px; }
.guidePath { color: #999; font-family: monospace; font-size: 12px; }

/* item */
.guideItem { margin-top: 26px; overflow: hidden; border: 1px solid #e1e3e8; border-radius: 14px; background: #fff; }
.guideItemHead { padding: 20px 24px; border-bottom: 1px solid #eeeeef; }
.guideItemHead strong { display: block; font-size: 15px; }
.guideItemHead p { margin: 6px 0 0; color: #888; font-size: 13px; }
.guidePreview { display: flex; flex-direction: column; gap: 18px; padding: 34px; }

/* util */
.guideFlex { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.guideFlex.alignEnd { align-items: flex-end; }

/* props table */
.guideTableWrap { overflow: hidden; border: 1px solid #e5e7eb; border-radius: 10px; }
.guideTable { width: 100%; border-collapse: collapse; }
.guideTable th { padding: 13px 16px; background: #f7f8fa; color: #666; font-size: 12px; font-weight: 600; text-align: left; }
.guideTable td { padding: 14px 16px; border-top: 1px solid #eee; color: #555; font-size: 13px; }
.guideTable code { padding: 3px 6px; border-radius: 5px; background: #f1f3f5; color: #333; font-size: 12px; }

/* code */
.guideCode { overflow-x: auto; margin: 0; padding: 22px; border-radius: 10px; background: #17191e; color: #e9ebef; font-family: Consolas, monospace; font-size: 13px; line-height: 1.7; }
.guideValues { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.guideValues code { display: inline-flex; align-items: center; min-height: 24px; padding: 2px 8px; border: 1px solid #e1e4e8; border-radius: 5px; background: #f6f8fa; color: #555; font-size: 11px; }

/* guide Input */
.guideInputList { display: flex; flex-direction: column; gap: 12px; }
```

**완료 기준**

- [ ] 메뉴와 섹션 ID가 일치하며 클릭·스크롤 시 `on` 클래스가 올바르게 변경된다.
- [ ] Tab·Enter로 메뉴를 사용할 수 있고 포커스가 보인다.
- [ ] 가이드 예제가 실제 공통 컴포넌트 Props·동작과 일치한다.
- [ ] Guide CSS는 `guide.css`에서만 관리하며 일반 페이지 및 IA에 영향을 주지 않는다.
- [ ] `/ia`에 `Guide` 항목이 항상 표시되고 클릭 시 `/guide`가 열린다.
- [ ] 새 페이지 생성 시 IA 등록 여부를 확인하고, 공통 컴포넌트 변경 시 Guide를 갱신한다.

## 7. SSOT 문서 관리

| 정보 | 공식 원본 | 다른 위치에서는 |
| --- | --- | --- |
| AI 개발 규칙 | `AGENTS.md` | 참조만 |
| 기능 요구사항 | `docs/requirements.md` | 참조만 |
| 구조 및 설계 | `docs/design.md` | 참조만 |
| 작업 진행 상태 | `docs/tasks.md` | 체크박스로 관리 |
| 공용 타입 | `src/types/` | import하여 사용 |
| 공용 상수 | `src/constants/` | import하여 사용 |
| 일반 페이지 스타일 | `src/assets/css/common.css` | 일반 페이지에만 적용 |
| IA 독립 스타일 | `src/assets/css/ia.css` | `#iaWrap` 범위로 제한 |
| Guide 독립 스타일 | `src/assets/css/guide.css` | `.guideWrap` 범위로 제한 |
| 슬라이드 개발 규칙 | `AGENTS.md` 5.6절 | 참조만 |
| 커스텀 훅 개발 규칙 | `AGENTS.md` 5.7절 | 참조만 |
| IA 페이지 디자인·마크업·기능·스타일 | `AGENTS.md` 6.3.1~6.3.4 | 코드·`ia.css`를 그대로 사용, 화면 목록만 `src/data/iaData.ts`에서 프로젝트에 맞게 관리 |
| IA 페이지 관리 규칙 | `AGENTS.md` 6.3절 | 참조만 |

- 같은 규칙과 데이터를 여러 곳에 중복 정의하지 않습니다.
- 스펙 변경이 확정되면 해당 공식 문서를 먼저 갱신하고 코드를 수정합니다.
- AI는 승인 없이 프로젝트 규칙을 변경하지 않습니다.
- 문서와 코드가 충돌하면 임의로 덮어쓰지 않고 차이를 보고합니다.

## 8. AI 작업 절차

1. **작업 범위 확인:** 모든 작업은 퍼블리싱(`pub/`)으로 진행합니다. `pub/` 밖에 컴포넌트나 페이지가 필요해 보이면 만들기 전에 질문합니다.
2. **문서 확인:** `AGENTS.md`와 관련 문서를 읽고 `docs/tasks.md`에서 현재 작업을 확인합니다.
3. **기존 코드 분석:** 새 파일을 만들기 전에 `pub/` 안에 유사한 파일과 공통 컴포넌트가 있는지 검색합니다. IA 관련 작업에서는 6.3절 명세를 먼저 확인합니다.
4. **작업 단위 제한:** 한 번에 요청된 작업 한 가지에 집중합니다.
5. **최소 수정:** 요청하지 않은 리팩터링, 파일 삭제, 라이브러리 설치를 하지 않습니다. 단, 슬라이드 구현에 필요한 Swiper 설치는 승인된 작업으로 간주합니다.
6. **불명확한 요구사항 확인:** 추측으로 설계를 확정하지 않고 질문합니다.
7. **검증:** `npm run build`를 실행하고, 사용 가능한 경우 린트 및 관련 동작도 검사합니다. 개발용 폴더에 파일이 생기지 않았는지도 확인합니다.
8. **IA·Guide 동기화:** `/guide`는 최초 구성부터 `/ia`에 필수 등록하고 항상 유지합니다. 새 퍼블리싱 페이지는 IA에 등록하고, 신규·변경 공통 컴포넌트는 Guide에 반영합니다(6.3·6.4절 참고).
9. **작업 기록:** 완료한 작업은 `docs/tasks.md`에서 `[x]`로 변경합니다. 검증되지 않은 작업은 완료 처리하지 않습니다.
10. **결과 보고:** 수정 파일, IA·Guide 반영 여부, 변경 이유, 검증 결과, 남은 문제를 요약합니다.

## 9. 금지 사항 및 예외

- **`src/components/pub/`, `src/pages/pub/` 밖에 컴포넌트나 페이지를 만들지 않습니다.**
- `src/types/`, `src/constants/` 외부에 공용 타입과 공용 상수를 중복 정의하지 않습니다.
- 프로젝트 CSS는 `common.css`, `ia.css`, `guide.css`만 사용합니다. 추가 CSS 파일을 임의로 만들지 않습니다.
- 디자인 토큰으로 관리할 값을 임의의 색상 코드나 px 값으로 반복 하드코딩하지 않습니다.
- 불필요한 인라인 스타일을 사용하지 않습니다.
- 디버깅용 `console.log`를 남긴 채 완료하지 않습니다.
- 승인되지 않은 패키지를 설치하지 않습니다.
- `main.tsx`, `vite.config.ts`, `tsconfig.json`을 이유 없이 수정하지 않습니다. 단, `common.css`의 전역 import 제거 등 독립 CSS 분리에 필수적인 최소 수정은 허용합니다.
- 파일 이동·삭제, 기존 퍼블리싱 원본 변경 등 영향이 큰 작업은 사전에 승인받습니다.
- 슬라이드 기능을 Swiper 없이 임의로 구현하지 않습니다.
- 단순한 일반 함수를 불필요하게 커스텀 훅으로 만들지 않습니다.
- 공통 컴포넌트가 이미 존재하는 경우 동일한 기능의 컴포넌트를 중복 생성하지 않습니다.
- 기존 IA 디자인과 기능을 사용자 승인 없이 변경하거나, IA 구현을 위해 전역 스타일을 제거하지 않습니다.

### 예외 처리

기존 프로젝트 구조나 외부 도구의 제약으로 규칙을 지키기 어려우면 이유와 대안을 먼저 설명하고 승인받은 뒤 진행합니다.

**승인된 예외**

- Swiper 패키지 설치
- Swiper 공식 CSS import
- 승인된 외부 라이브러리의 필수 스타일 import
- 이메일 템플릿(2026-11-16 승인): `public/email/*.html` 정적 HTML은 React·`pub/` 밖에 두며, 메일 클라이언트 호환을 위해 테이블 레이아웃과 인라인 스타일을 허용합니다. `common.css`를 사용하지 않습니다. 이 예외는 `public/email/` 안에서만 적용합니다.

위 예외를 제외한 신규 라이브러리 설치, 추가 CSS 파일 생성, 프로젝트 구조 변경은 사전 승인을 원칙으로 합니다.