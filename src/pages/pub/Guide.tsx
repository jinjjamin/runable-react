import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import BottomBar from '../../components/pub/layout/BottomBar';
import Header from '../../components/pub/layout/Header';
import Button from '../../components/pub/common/Button';
import FloatingButton from '../../components/pub/common/FloatingButton';
import Input from '../../components/pub/common/Input';
import Checkbox from '../../components/pub/common/Checkbox';
import Radio from '../../components/pub/common/Radio';
import Popup from '../../components/pub/common/Popup';
import Tabs from '../../components/pub/common/Tabs';
import TextLink from '../../components/pub/common/TextLink';
import NoData from '../../components/pub/common/NoData';
import Loading from '../../components/pub/common/Loading';
import TermsForm from '../../components/pub/common/TermsForm';
import { TERMS_SAMPLE } from '../../data/terms';
import Slider from '../../components/pub/common/Slider';
import RaceCard from '../../components/pub/race/RaceCard';
import RecordCard from '../../components/pub/my/RecordCard';
import { MY_RACES_MAX, OPEN_RACES, RECENT_RECORDS } from '../../data/homeData';
import { RACE_LIST } from '../../data/raceData';
import getTabIds from '../../utils/getTabIds';
import type { TabItem } from '../../types';
import iconEmail from '../../assets/icons/iconEmail.svg';
import iconSetting from '../../assets/icons/iconSetting.svg';
// common.css는 .guideDemo(.siteScope) 안의 실제 컴포넌트 예제에만 적용됩니다.
import '../../assets/css/common.css';
import '../../assets/css/guide.css';

// 공통 컴포넌트 UI Guide (/guide) — AGENTS.md 6.4 기준
// - 공통 Layout을 적용하지 않는 독립 화면이며, 스타일은 guide.css에만 있습니다.
// - 공통 컴포넌트를 추가하거나 Props·사용법을 바꾸면 GUIDE_SECTIONS와 섹션을 함께 갱신합니다.
// - 실제 구현된 컴포넌트만 등록하고, 존재하지 않는 옵션은 만들지 않습니다.

interface GuideSection {
    id: string;
    label: string;
    category: string;
}

// 왼쪽 메뉴와 섹션 id는 이 배열 하나로 연결합니다.
const GUIDE_SECTIONS: GuideSection[] = [
    { id: 'intro', label: '시작하기', category: 'GUIDE' },
    { id: 'layout', label: 'Layout', category: 'LAYOUT' },
    { id: 'topBar', label: 'Header', category: 'LAYOUT' },
    { id: 'bottomBar', label: 'BottomBar', category: 'LAYOUT' },
    { id: 'button', label: 'Button', category: 'COMPONENTS' },
    { id: 'floatingButton', label: 'FloatingButton', category: 'COMPONENTS' },
    { id: 'input', label: 'Input', category: 'COMPONENTS' },
    { id: 'checkbox', label: 'Checkbox', category: 'COMPONENTS' },
    { id: 'radio', label: 'Radio', category: 'COMPONENTS' },
    { id: 'popup', label: 'Popup', category: 'COMPONENTS' },
    { id: 'tabs', label: 'Tabs', category: 'COMPONENTS' },
    { id: 'textLink', label: 'TextLink', category: 'COMPONENTS' },
    { id: 'noData', label: 'NoData', category: 'COMPONENTS' },
    { id: 'loading', label: 'Loading', category: 'COMPONENTS' },
    { id: 'termsForm', label: 'TermsForm', category: 'COMPONENTS' },
    { id: 'slider', label: 'Slider', category: 'COMPONENTS' },
    { id: 'raceCard', label: 'RaceCard', category: 'COMPONENTS' },
    { id: 'recordCard', label: 'RecordCard', category: 'COMPONENTS' }
];

interface PropRow {
    name: string;
    type: string;
    defaultValue: string;
    description: string;
}

interface PropsTableProps {
    rows: PropRow[];
}

// Props 표 (AGENTS.md 6.4: Props / Type / Default / Description)
const PropsTable = ({ rows }: PropsTableProps) => {
    return (
        <div className="guideTableWrap">
            <table className="guideTable">
                <thead>
                    <tr>
                        <th scope="col">Props</th>
                        <th scope="col">Type</th>
                        <th scope="col">Default</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.name}>
                            <td><code>{row.name}</code></td>
                            <td><code>{row.type}</code></td>
                            <td>{row.defaultValue}</td>
                            <td>{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LAYOUT_PROPS: PropRow[] = [
    { name: 'hasBottomBar', type: 'boolean', defaultValue: 'false', description: '탭 루트 화면(홈, 대회 목록, 트래커 메인)에서 BottomBar 표시' }
];

const TOP_BAR_PROPS: PropRow[] = [
    { name: 'title', type: 'string', defaultValue: '-', description: '페이지명 (h1, H4 스타일)' },
    { name: 'type', type: "'back' | 'close' | 'home'", defaultValue: "'back'", description: 'back: 왼쪽 뒤로가기 / close: 오른쪽 닫기 / home: 왼쪽 프로필(마이페이지 이동) + 제목 숨김(h1 blind), 홈 화면' },
    { name: 'onButtonClick', type: '() => void', defaultValue: '이전 화면 이동', description: '뒤로가기·닫기 버튼 동작을 바꿀 때' },
    { name: 'rightSlot', type: 'ReactNode', defaultValue: '-', description: '오른쪽 영역 (예: 설정 아이콘 버튼)' },
    { name: 'isPrimary', type: 'boolean', defaultValue: 'false', description: 'Primary-500 파란 배경 (예: 레이스 목록 RA1)' }
];

const BUTTON_PROPS: PropRow[] = [
    { name: 'label', type: 'string', defaultValue: '-', description: '버튼 문구' },
    { name: 'variant', type: "'primary' | 'secondary' | 'outline'", defaultValue: "'primary'", description: 'primary: Primary-500 배경 / secondary: Primary-100 배경 / outline: 2px 테두리' },
    { name: 'size', type: "'l' | 'm'", defaultValue: "'l'", description: 'l: 높이 56·모서리 8·14px / m: 높이 42·모서리 4·12px' },
    { name: 'icon', type: 'string', defaultValue: '-', description: '문구 왼쪽 아이콘 경로 (24px, 예: iconEmail)' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '비활성. 시안에는 primary만 있음 (Primary-200 배경)' },
    { name: 'isPage', type: 'boolean', defaultValue: 'false', description: '화면 맨 아래 꽉 찬 버튼 (Figma Type Page, 모서리 없음). 예: 비밀번호 변경 완료의 앱으로 로그인' },
    { name: 'to', type: 'string', defaultValue: '-', description: '넘기면 화면 이동 링크(<a>)로 렌더링' },
    { name: 'type', type: "'button' | 'submit'", defaultValue: "'button'", description: '<button>의 type' },
    { name: 'onClick', type: '() => void', defaultValue: '-', description: '클릭 동작' }
];

const FLOATING_BUTTON_PROPS: PropRow[] = [
    { name: 'label', type: 'string', defaultValue: '-', description: '버튼 문구' },
    { name: 'type', type: "'move' | 'plus'", defaultValue: "'move'", description: 'move: 문구 + 오른쪽 화살표 / plus: + 아이콘 + 문구' },
    { name: 'to', type: 'string', defaultValue: '-', description: '넘기면 화면 이동 링크(<a>)로 렌더링' },
    { name: 'onClick', type: '() => void', defaultValue: '-', description: '클릭 동작' }
];

const INPUT_PROPS: PropRow[] = [
    { name: 'id', type: 'string', defaultValue: '-', description: 'input id (라벨·문구 연결)' },
    { name: 'value / onChange', type: 'string / (value: string) => void', defaultValue: '-', description: '입력값과 변경 함수' },
    { name: 'label', type: 'string', defaultValue: '-', description: '라벨 (C0 12px)' },
    { name: 'isLabelHidden', type: 'boolean', defaultValue: 'false', description: '라벨을 화면에서 숨기고 화면 읽기 프로그램에만 제공 (placeholder만 보이는 시안, 예: 로그인)' },
    { name: 'labelNote', type: 'string', defaultValue: '-', description: '라벨 옆 회색 보조 문구 (예: 혈액형 안내)' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: '필수 표시 (빨간 점)' },
    { name: 'type', type: "'text' | 'email' | 'password' | 'tel' | 'number'", defaultValue: "'text'", description: 'password면 비밀번호 보기 버튼 표시 (hasPasswordToggle로 끄기)' },
    { name: 'hasPasswordToggle', type: 'boolean', defaultValue: 'true', description: 'type password일 때 비밀번호 보기 버튼 표시 여부 (로그인 시안은 false)' },
    { name: 'placeholder', type: 'string', defaultValue: '-', description: '안내 문구 (Gray-300)' },
    { name: 'errorMessage', type: 'string', defaultValue: '-', description: '에러 상태 + 빨간 문구 (C1)' },
    { name: 'helperText', type: 'ReactNode', defaultValue: '-', description: '회색 안내 문구 (C1). 에러가 있으면 에러 문구가 우선. 글자별 색이 필요하면 span으로 전달 (예: 비밀번호 조건 문구 ruleMet·ruleUnmet)' },
    { name: 'hasClear', type: 'boolean', defaultValue: 'false', description: '값이 있을 때 지우기 버튼 표시' },
    { name: 'isComplete', type: 'boolean', defaultValue: 'false', description: '입력 확인 아이콘 (초록 체크)' },
    { name: 'timer', type: 'string', defaultValue: '-', description: '남은 시간 (빨간 글자, 예: 02:36)' },
    { name: 'button', type: '{ label, disabled?, onClick? }', defaultValue: '-', description: '오른쪽 버튼 (예: 전송하기). 비활성은 Gray-200' },
    { name: 'name / autoComplete', type: 'string', defaultValue: '-', description: 'input 속성 전달' }
];

const CHECKBOX_PROPS: PropRow[] = [
    { name: 'id', type: 'string', defaultValue: '-', description: 'input id' },
    { name: 'label', type: 'ReactNode', defaultValue: '-', description: '라벨 (B2 14px). 색은 부모 글자색을 따름' },
    { name: 'checked / onChange', type: 'boolean / (checked: boolean) => void', defaultValue: '-', description: '체크 상태와 변경 함수' },
    { name: 'shape', type: "'rectangle' | 'round'", defaultValue: "'rectangle'", description: 'rectangle: 사각 (약관 동의) / round: 원형 (회원탈퇴 사유)' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '비활성. 시안에 모양이 없어 속성만 전달' },
    { name: 'name', type: 'string', defaultValue: '-', description: 'input name' }
];

const RADIO_PROPS: PropRow[] = [
    { name: 'id / name / value', type: 'string', defaultValue: '-', description: 'input id, 같은 그룹 name, 값' },
    { name: 'label', type: 'string', defaultValue: '-', description: '라벨 (B2 14px)' },
    { name: 'checked / onChange', type: 'boolean / (value: string) => void', defaultValue: '-', description: '선택 상태와 변경 함수' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '비활성. 시안에 모양이 없어 속성만 전달' }
];

const DISTANCE_OPTIONS = ['10K', 'Half', 'Full'];

const POPUP_PROPS: PropRow[] = [
    { name: 'isOpen', type: 'boolean', defaultValue: '-', description: '열림 여부' },
    { name: 'title', type: 'string', defaultValue: '-', description: '제목 (H2). 줄바꿈 문자(\\n) 반영' },
    { name: 'onClose', type: '() => void', defaultValue: '-', description: 'Dim 클릭·ESC로 닫을 때' },
    { name: 'primaryButton', type: '{ label, onClick }', defaultValue: '-', description: '오른쪽 primary 버튼 (필수)' },
    { name: 'secondaryButton', type: '{ label, onClick }', defaultValue: '-', description: '왼쪽 secondary 버튼 (선택). 없으면 버튼 1개' },
    { name: 'description', type: 'ReactNode', defaultValue: '-', description: '설명 (B2 Gray-900). <em>은 Primary-500 강조' },
    { name: 'comment', type: 'string', defaultValue: '-', description: '회색 부가 문구 (C0 Gray-700, 예: 변경일)' },
    { name: 'children', type: 'ReactNode', defaultValue: '-', description: '설명 아래 추가 내용 (Figma Contents)' }
];

type DemoPopup = 'logout' | 'notice' | 'withdraw' | null;

const TABS_PROPS: PropRow[] = [
    { name: 'items', type: 'TabItem[] ({ id, label })', defaultValue: '-', description: '탭 목록. 개수만큼 같은 너비로 나눔 (Figma Tab 02~04)' },
    { name: 'activeId / onChange', type: 'string / (id: string) => void', defaultValue: '-', description: '선택된 탭과 변경 함수' },
    { name: 'idPrefix', type: 'string', defaultValue: '-', description: '탭·내용 id 접두어. 내용 영역 id는 getTabIds(idPrefix, id).panelId' },
    { name: 'ariaLabel', type: 'string', defaultValue: '-', description: '탭 목록 이름 (스크린리더용)' }
];

const TEXT_LINK_PROPS: PropRow[] = [
    { name: 'label', type: 'string', defaultValue: '-', description: '링크 문구 (밑줄)' },
    { name: 'size', type: "'s' | 'm'", defaultValue: "'m'", description: 'm: 14px Gray-700 / s: 12px Gray-900' },
    { name: 'hasArrow', type: 'boolean', defaultValue: 'false', description: '오른쪽 16px 화살표' },
    { name: 'to', type: 'string', defaultValue: '-', description: '넘기면 화면 이동 링크(<a>)로 렌더링' },
    { name: 'onClick', type: '() => void', defaultValue: '-', description: '클릭 동작' }
];

const NO_DATA_PROPS: PropRow[] = [
    { name: 'message', type: 'ReactNode', defaultValue: '-', description: '안내 문구. 줄바꿈은 <br />' },
    { name: 'variant', type: "'box' | 'section'", defaultValue: "'box'", description: 'box: 회색 둥근 상자(B2 Gray-700) / section: 너비 전체 회색 영역(C0 검정)' },
    { name: 'action', type: 'ReactNode', defaultValue: '-', description: '문구 아래 링크·버튼 (TextLink, FloatingButton 등)' }
];

const LOADING_PROPS: PropRow[] = [
    { name: 'label', type: 'string', defaultValue: "'불러오는 중입니다'", description: '화면 읽기 프로그램용 안내 문구 (화면에는 보이지 않음)' }
];

const TERMS_FORM_PROPS: PropRow[] = [
    { name: 'sections', type: 'TermsSection[]', defaultValue: '-', description: '본문 타이틀(title), 설명 문단(paragraphs), 블록(blocks: subTitle·table·list). 타입은 src/types' }
];

const SLIDER_PROPS: PropRow[] = [
    { name: 'items / getKey', type: 'T[] / (item: T) => string', defaultValue: '-', description: '슬라이드 데이터와 고유 key' },
    { name: 'renderItem', type: '(item: T) => ReactNode', defaultValue: '-', description: '카드 그리기. 카드 너비가 슬라이드 너비 (slidesPerView auto)' },
    { name: 'ariaLabel', type: 'string', defaultValue: '-', description: '슬라이드 영역 이름 (role region)' },
    { name: 'spaceBetween', type: 'number', defaultValue: '12', description: '카드 간격' },
    { name: 'sidePadding', type: 'number', defaultValue: '24', description: '처음·끝 카드 바깥 여백' }
];

const RACE_CARD_PROPS: PropRow[] = [
    { name: 'variant', type: "'dday' | 'image'", defaultValue: '-', description: 'dday: 내가 신청한 대회(D-DAY 파란 카드, 그 외 흰 카드) / image: 참여가능 대회(이미지 + 접수 깃발 + 버튼)' },
    { name: 'race', type: 'MyRace (dday) / Race (image)', defaultValue: '-', description: 'src/types. dday는 dDay·myDistance, image는 status(open/closed)·image·applyDeadline 사용' }
];

const RECORD_CARD_PROPS: PropRow[] = [
    { name: 'record', type: 'RunningRecord', defaultValue: '-', description: '제목, 날짜, 거리·시간·페이스. raceName이 있으면 대회명 깃발 표시' }
];

const RECORD_TABS: TabItem[] = [
    { id: 'certified', label: '인증 기록' },
    { id: 'training', label: '트레이닝 기록' }
];

const RACE_TABS: TabItem[] = [
    { id: 'overview', label: '대회개요' },
    { id: 'howTo', label: '참가방법' },
    { id: 'racePack', label: '레이스팩' },
    { id: 'notice', label: '공지·FAQ' }
];

const handleDemoClick = () => {
    // Guide 예제에서는 화면을 이동하지 않습니다.
};

const getInitialSectionId = () => {
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    return GUIDE_SECTIONS.some((section) => section.id === hash) ? hash : GUIDE_SECTIONS[0].id;
};

interface GuideItemProps {
    title: string;
    desc?: string;
    children: ReactNode;
}

// 가이드 항목 공통 블록 (AGENTS.md 6.4: title, 선택적 desc, children)
const GuideItem = ({ title, desc, children }: GuideItemProps) => {
    return (
        <div className="guideItem">
            <div className="guideItemHead">
                <strong>{title}</strong>
                {desc && <p>{desc}</p>}
            </div>
            <div className="guidePreview">{children}</div>
        </div>
    );
};

const Guide = () => {
    const [activeId, setActiveId] = useState(getInitialSectionId);
    const [demoEmail, setDemoEmail] = useState('run');
    const [demoCode, setDemoCode] = useState('');
    const [demoPassword, setDemoPassword] = useState('');
    const [demoErrorEmail, setDemoErrorEmail] = useState('ㅂㅇㄴㅆ');
    const [demoName, setDemoName] = useState('김러너');
    const [isKeepLogin, setIsKeepLogin] = useState(true);
    const [isAgree, setIsAgree] = useState(false);
    const [isReasonChecked, setIsReasonChecked] = useState(true);
    const [isReasonUnchecked, setIsReasonUnchecked] = useState(false);
    const [demoDistance, setDemoDistance] = useState('10K');
    const [demoPopup, setDemoPopup] = useState<DemoPopup>(null);
    const [demoRecordTab, setDemoRecordTab] = useState(RECORD_TABS[0].id);
    const [demoRaceTab, setDemoRaceTab] = useState(RACE_TABS[0].id);
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    // 로딩 전체 화면 예제: 2초 뒤 자동으로 닫습니다.
    useEffect(() => {
        if (!isDemoLoading) return undefined;
        const timer = window.setTimeout(() => setIsDemoLoading(false), 2000);
        return () => window.clearTimeout(timer);
    }, [isDemoLoading]);

    const handlePopupClose = () => {
        setDemoPopup(null);
    };

    // 최초 진입 시 URL 해시가 있으면 해당 섹션으로 이동합니다.
    useEffect(() => {
        const hash = decodeURIComponent(window.location.hash.replace('#', ''));
        if (GUIDE_SECTIONS.some((section) => section.id === hash)) {
            document.getElementById(hash)?.scrollIntoView();
        }
    }, []);

    // 직접 스크롤할 때 현재 섹션의 메뉴를 활성화합니다.
    // - 화면 위쪽 30% 지점을 지난 마지막 섹션을 활성화합니다.
    // - 페이지 끝에 닿으면 마지막 섹션을 활성화합니다 (짧은 페이지에서 마지막 섹션이 위로 올라오지 못하는 경우).
    useEffect(() => {
        const handleScroll = () => {
            const scrollBottom = window.innerHeight + window.scrollY;
            if (scrollBottom >= document.documentElement.scrollHeight - 2) {
                setActiveId(GUIDE_SECTIONS[GUIDE_SECTIONS.length - 1].id);
                return;
            }

            const threshold = window.innerHeight * 0.3;
            const currentSection = GUIDE_SECTIONS.reduce((current, section) => {
                const top = document.getElementById(section.id)?.getBoundingClientRect().top;
                return top !== undefined && top <= threshold ? section : current;
            }, GUIDE_SECTIONS[0]);
            setActiveId(currentSection.id);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        event.preventDefault();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${sectionId}`);
        setActiveId(sectionId);
    };

    return (
        <div className="guideWrap">
            <aside className="guideSide">
                <h1 className="guideLogo">RUNABLE UI</h1>
                <nav className="guideNav" aria-label="가이드 메뉴">
                    {GUIDE_SECTIONS.map((section, index) => (
                        <div key={section.id}>
                            {GUIDE_SECTIONS[index - 1]?.category !== section.category && <strong>{section.category}</strong>}
                            <a
                                href={`#${section.id}`}
                                className={activeId === section.id ? 'on' : undefined}
                                aria-current={activeId === section.id ? 'location' : undefined}
                                onClick={(event) => handleNavClick(event, section.id)}
                            >
                                {section.label}
                            </a>
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="guideContent">
                <div className="guideHead">
                    <span className="guideBadge">UI GUIDE</span>
                    <h2>러너블 공통 컴포넌트</h2>
                    <p>퍼블리싱 공통 컴포넌트의 Props, 상태, 사용 예제를 확인하는 화면입니다.</p>
                </div>

                <section className="guideSection" id="intro">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">GUIDE</span>
                            <h3>시작하기</h3>
                        </div>
                        <span className="guidePath">src/pages/pub/Guide.tsx</span>
                    </div>

                    <GuideItem title="가이드 작성 규칙" desc="AGENTS.md 6.4">
                        <div className="guideTableWrap">
                            <table className="guideTable">
                                <thead>
                                    <tr>
                                        <th scope="col">항목</th>
                                        <th scope="col">기준</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>등록 대상</td>
                                        <td><code>src/components/pub/common/</code>, <code>layout/</code>의 공통 컴포넌트</td>
                                    </tr>
                                    <tr>
                                        <td>등록 시점</td>
                                        <td>공통 컴포넌트를 새로 만들거나 Props·사용법을 바꿀 때</td>
                                    </tr>
                                    <tr>
                                        <td>섹션 구성</td>
                                        <td>Props 표, 상태·이벤트, 실제 UI 예제, 사용 코드 중 필요한 항목</td>
                                    </tr>
                                    <tr>
                                        <td>페이지 목록</td>
                                        <td>Guide에 등록하지 않고 <code>/ia</code>에서 관리</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </GuideItem>
                </section>

                <section className="guideSection" id="layout">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">LAYOUT</span>
                            <h3>Layout</h3>
                        </div>
                        <span className="guidePath">src/components/pub/layout/Layout.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="일반 퍼블리싱 페이지의 공통 레이아웃입니다. /ia, /guide에는 쓰지 않습니다.">
                        <PropsTable rows={LAYOUT_PROPS} />
                    </GuideItem>

                    <GuideItem title="구조와 사용 코드" desc="라우트에서 Outlet으로 페이지를 렌더링합니다. Header는 각 페이지가 직접 넣습니다.">
                        <pre className="guideCode"><code>{`<div id="siteWrap" class="siteScope">
    <main id="container">{페이지}</main>
    <footer id="footer">BottomBar</footer>  {/* hasBottomBar일 때만 */}
</div>

// App.tsx
<Route element={<Layout hasBottomBar />}>   {/* TabLayout */}
<Route element={<Layout />}>                {/* PageLayout */}`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="topBar">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">LAYOUT</span>
                            <h3>Header</h3>
                        </div>
                        <span className="guidePath">src/components/pub/layout/Header.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Top Bar (360 × 56, padding 12px 16px). 루트는 header#header입니다.">
                        <PropsTable rows={TOP_BAR_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제: 뒤로가기 + 오른쪽 영역" desc="예: 내 정보(MY3.1). 한 화면에 Header는 하나만 둡니다(id 중복 방지).">
                        <div className="siteScope guideDemo">
                            <Header
                                title="마이페이지"
                                onButtonClick={handleDemoClick}
                                rightSlot={(
                                    <button type="button" className="topBarButton" aria-label="설정">
                                        <img src={iconSetting} alt="" />
                                    </button>
                                )}
                            />
                        </div>
                        <pre className="guideCode"><code>{`<Header
    title="마이페이지"
    rightSlot={
        <button type="button" className="topBarButton" aria-label="설정">
            <img src={iconSetting} alt="" />
        </button>
    }
/>

// 닫기형 (약관·라이선스 안내)
<Header title="서비스 이용약관" type="close" />

// 파란 배경 (RA1 레이스 목록)
<Header title="레이스" type="home" isPrimary />

// 홈형 (MY3 홈): 왼쪽 프로필 → 마이페이지, 오른쪽 알림 (새 알림이면 iconAlarmNew)
<Header
    title="홈"
    type="home"
    rightSlot={
        <Link to={ROUTES.notifications} className="topBarButton" aria-label="알림 (새 알림 있음)">
            <img src={iconAlarmNew} alt="" />
        </Link>
    }
/>`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="bottomBar">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">LAYOUT</span>
                            <h3>BottomBar</h3>
                        </div>
                        <span className="guidePath">src/components/pub/layout/BottomBar.tsx</span>
                    </div>

                    <GuideItem
                        title="예제"
                        desc="Figma: Bottom Bar (높이 62). Props 없음. 현재 경로와 같은 탭이 활성(on, aria-current)이 되며, 이 Guide 화면에서는 활성 탭이 없습니다."
                    >
                        <div className="siteScope guideDemo">
                            <BottomBar />
                        </div>
                        <pre className="guideCode"><code>{`<Layout hasBottomBar />  // Layout이 표시합니다. 페이지에서 직접 쓰지 않습니다.

탭: 홈 / · 레이스 /races · 트래커 /tracker
활성 아이콘: iconTab*On.svg (Primary-500), 비활성: iconTab*Off.svg (Gray-300)`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="button">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Button</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Button.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Button. 너비는 부모를 꽉 채웁니다.">
                        <PropsTable rows={BUTTON_PROPS} />
                    </GuideItem>

                    <GuideItem title="size l (높이 56)" desc="예: 로그인, 이메일로 회원가입, 비활성(ME1.1 이메일 전송)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <Button label="로그인" />
                            <Button label="이메일로 회원가입" variant="outline" icon={iconEmail} />
                            <Button label="이메일 전송" disabled />
                            <div className="buttonGroup">
                                <Button label="취소" variant="secondary" />
                                <Button label="로그아웃" />
                            </div>
                        </div>
                        <pre className="guideCode"><code>{`<Button label="로그인" />
<Button label="이메일로 회원가입" variant="outline" icon={iconEmail} />
<Button label="이메일 전송" disabled />

<div className="buttonGroup">
    <Button label="취소" variant="secondary" />
    <Button label="로그아웃" />
</div>`}</code></pre>
                    </GuideItem>

                    <GuideItem title="size m (높이 42)" desc="예: 대회 카드의 자세히 보기 / 참가 신청 (Figma Combination, 간격 8)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <div className="buttonGroup">
                                <Button label="자세히 보기" variant="secondary" size="m" />
                                <Button label="참가 신청" size="m" />
                            </div>
                        </div>
                        <pre className="guideCode"><code>{`<div className="buttonGroup">
    <Button label="자세히 보기" variant="secondary" size="m" to={ROUTES.raceDetail} />
    <Button label="참가 신청" size="m" to={ROUTES.raceApply} />
</div>`}</code></pre>
                    </GuideItem>

                    <GuideItem title="isPage (화면 맨 아래)" desc="예: 비밀번호 변경 완료(ME1.4)의 앱으로 로그인, 회원가입(ME2)의 이전/다음. 360×56(두 개면 180씩), 모서리 없음. 화면 아래 고정은 페이지의 .pageBottom이 담당">
                        <div className="siteScope guideDemo guideDemoStack">
                            <Button label="앱으로 로그인" isPage onClick={handleDemoClick} />
                            <div className="buttonGroup isPage">
                                <Button label="이전" variant="secondary" isPage onClick={handleDemoClick} />
                                <Button label="다음" isPage disabled />
                            </div>
                        </div>
                        <pre className="guideCode"><code>{`<div className="pageBottom">
    <Button label="앱으로 로그인" isPage to={ROUTES.login} />
</div>

// 두 버튼 (회원가입 ME2 이전/다음): buttonGroup에 isPage 클래스를 붙이면 간격 0, 각 180px
<div className="pageBottom">
    <div className="buttonGroup isPage">
        <Button label="이전" variant="secondary" isPage to={ROUTES.login} />
        <Button label="다음" type="submit" isPage disabled={!canGoNext} />
    </div>
</div>`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="floatingButton">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>FloatingButton</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/FloatingButton.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Floating Button (높이 42, 모서리 40, 흰 배경 + Elevation 2 그림자)">
                        <PropsTable rows={FLOATING_BUTTON_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="예: 홈의 전체 레이스 리스트 보러가기(move), 더보기(plus)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <div className="guideFlex">
                                <FloatingButton label="전체 레이스 리스트 보러가기" />
                                <FloatingButton label="더보기" type="plus" />
                            </div>
                        </div>
                        <pre className="guideCode"><code>{`<FloatingButton label="전체 레이스 리스트 보러가기" to={ROUTES.raceList} />
<FloatingButton label="더보기" type="plus" onClick={handleMoreClick} />`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="input">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Input</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Input.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Text Field (입력 높이 46, padding 0 12px). 기본 Primary-50 배경, 입력 중 파란 테두리, 에러 빨간 테두리">
                        <PropsTable rows={INPUT_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="회원가입(ME2), 로그인 에러(ME1), 참가 신청 개인정보(RA3.1). 직접 입력해 보세요.">
                        <div className="siteScope guideDemo guideDemoPad">
                            <Input
                                id="guideEmail"
                                label="이메일"
                                required
                                type="email"
                                value={demoEmail}
                                onChange={setDemoEmail}
                                placeholder="이메일 주소를 입력해주세요"
                                hasClear
                                button={{ label: '전송하기' }}
                            />
                            <Input
                                id="guideCode"
                                label="인증번호"
                                isLabelHidden
                                value={demoCode}
                                onChange={setDemoCode}
                                placeholder="인증번호를 입력해주세요"
                                timer="02:36"
                                button={{ label: '인증하기', disabled: !demoCode }}
                            />
                            <Input
                                id="guidePassword"
                                label="비밀번호"
                                required
                                type="password"
                                value={demoPassword}
                                onChange={setDemoPassword}
                                placeholder="비밀번호 (영문, 숫자, 특수문자 8자 이상)"
                            />
                            <Input
                                id="guideErrorEmail"
                                label="이메일 주소"
                                isLabelHidden
                                value={demoErrorEmail}
                                onChange={setDemoErrorEmail}
                                hasClear
                                errorMessage="이메일 형식이 유효하지 않습니다."
                            />
                            <Input
                                id="guideName"
                                label="이름"
                                required
                                value={demoName}
                                onChange={setDemoName}
                                placeholder="이름을 입력하세요."
                                helperText="이름은 배번호와 기념품 등에 기입될 수 있어요."
                                isComplete={demoName.length > 0}
                            />
                        </div>
                        <pre className="guideCode"><code>{`<Input
    id="email"
    label="이메일"
    required
    type="email"
    value={email}
    onChange={setEmail}
    placeholder="이메일 주소를 입력해주세요"
    hasClear
    button={{ label: '전송하기', onClick: handleSendCode }}
/>
<Input id="code" label="인증번호" isLabelHidden value={code} onChange={setCode} timer="02:36"
    button={{ label: '인증하기', disabled: !code }} />

// 로그인(ME1): 라벨 숨김, 지우기 버튼, 비밀번호 보기 버튼 없음
<Input id="loginEmail" label="이메일 주소" isLabelHidden type="email" value={email} onChange={setEmail}
    hasClear errorMessage="이메일 형식이 유효하지 않습니다." />
<Input id="loginPassword" label="비밀번호" isLabelHidden type="password" value={password}
    onChange={setPassword} hasPasswordToggle={false} />`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="checkbox">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Checkbox</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Checkbox.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Checkbox (Type Rectangle / Round, 24px 원본 아이콘)">
                        <PropsTable rows={CHECKBOX_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="사각: 로그인 상태유지(ME1), 약관 동의(RA3) / 원형: 회원탈퇴 사유(MY3.1.2.3). 눌러 보세요.">
                        <div className="siteScope guideDemo guideDemoPad">
                            <Checkbox id="guideKeepLogin" label="로그인 상태유지" checked={isKeepLogin} onChange={setIsKeepLogin} />
                            <Checkbox id="guideAgree" label="[필수] 보험 관련 안내사항" checked={isAgree} onChange={setIsAgree} />
                            <Checkbox id="guideReasonOn" shape="round" label="앱 사용이 불편해요" checked={isReasonChecked} onChange={setIsReasonChecked} />
                            <Checkbox id="guideReasonOff" shape="round" label="이용빈도가 적어요" checked={isReasonUnchecked} onChange={setIsReasonUnchecked} />
                        </div>
                        <pre className="guideCode"><code>{`<Checkbox id="keepLogin" label="로그인 상태유지" checked={isKeepLogin} onChange={setIsKeepLogin} />
<Checkbox id="reason1" shape="round" label="앱 사용이 불편해요" checked={isChecked} onChange={setIsChecked} />`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="radio">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Radio</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Radio.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Radio Button (22px 원, 테두리 2px, 가운데 점 12px)">
                        <PropsTable rows={RADIO_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="참가 신청 종목 선택(RA3.2). 2열 배치는 .radioGroup (가로 12, 세로 8)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <div className="radioGroup" role="radiogroup" aria-label="종목 선택">
                                {DISTANCE_OPTIONS.map((option) => (
                                    <Radio
                                        key={option}
                                        id={`guideDistance${option}`}
                                        name="guideDistance"
                                        value={option}
                                        label={option}
                                        checked={demoDistance === option}
                                        onChange={setDemoDistance}
                                    />
                                ))}
                            </div>
                        </div>
                        <pre className="guideCode"><code>{`<div className="radioGroup" role="radiogroup" aria-label="종목 선택">
    {DISTANCES.map((option) => (
        <Radio key={option} id={\`distance\${option}\`} name="distance" value={option}
            label={option} checked={distance === option} onChange={setDistance} />
    ))}
</div>`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="popup">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Popup</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Popup.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Dialog (Type Bottomsheet). 위쪽 모서리 16, padding 32 0 24, 내용·버튼 간격 32, Dim 60%">
                        <PropsTable rows={POPUP_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="버튼을 눌러 여세요. Dim 클릭·ESC로 닫히고, Tab은 팝업 안에서만 이동합니다. 768px 이상에서는 최대 너비 480px.">
                        <div className="siteScope guideDemo guideDemoPad">
                            <Button label="로그아웃 확인 (버튼 2개)" variant="outline" onClick={() => setDemoPopup('logout')} />
                            <Button label="설정 변경 안내 (설명 + 부가 문구)" variant="outline" onClick={() => setDemoPopup('notice')} />
                            <Button label="회원탈퇴 확인 (제목 여러 줄)" variant="outline" onClick={() => setDemoPopup('withdraw')} />

                            <Popup
                                isOpen={demoPopup === 'logout'}
                                title="로그아웃 하시겠습니까?"
                                onClose={handlePopupClose}
                                secondaryButton={{ label: '취소', onClick: handlePopupClose }}
                                primaryButton={{ label: '로그아웃', onClick: handlePopupClose }}
                            />
                            <Popup
                                isOpen={demoPopup === 'notice'}
                                title="마케팅 수신 동의 여부 안내"
                                description={<>러너블 마케팅 정보 수신 설정이<br /><em>수신동의</em>로 변경되었습니다.</>}
                                comment="변경일 : 2021.07.26 09:34"
                                onClose={handlePopupClose}
                                primaryButton={{ label: '확인', onClick: handlePopupClose }}
                            />
                            <Popup
                                isOpen={demoPopup === 'withdraw'}
                                title={'회원탈퇴 이후 동일한 이메일\n회원가입이 불가능합니다.\n탈퇴하시겠습니까?'}
                                onClose={handlePopupClose}
                                secondaryButton={{ label: '탈퇴하기', onClick: handlePopupClose }}
                                primaryButton={{ label: '취소', onClick: handlePopupClose }}
                            />
                        </div>
                        <pre className="guideCode"><code>{`const [isLogoutOpen, setIsLogoutOpen] = useState(false);

<Popup
    isOpen={isLogoutOpen}
    title="로그아웃 하시겠습니까?"
    onClose={() => setIsLogoutOpen(false)}
    secondaryButton={{ label: '취소', onClick: () => setIsLogoutOpen(false) }}
    primaryButton={{ label: '로그아웃', onClick: handleLogout }}
/>

<Popup
    isOpen={isNoticeOpen}
    title="마케팅 수신 동의 여부 안내"
    description={<>러너블 마케팅 정보 수신 설정이<br /><em>수신동의</em>로 변경되었습니다.</>}
    comment="변경일 : 2021.07.26 09:34"
    onClose={handleClose}
    primaryButton={{ label: '확인', onClick: handleClose }}
/>`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="tabs">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Tabs</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Tabs.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Tab (높이 60, 밑줄 4px Primary-500, 구분선 1px Gray-50). ←/→/Home/End로 이동합니다.">
                        <PropsTable rows={TABS_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제: 탭 2개" desc="내 정보(MY3.1) 인증 기록 / 트레이닝 기록">
                        <div className="siteScope guideDemo">
                            <Tabs items={RECORD_TABS} activeId={demoRecordTab} onChange={setDemoRecordTab} idPrefix="guideRecord" ariaLabel="기록 구분" />
                            {RECORD_TABS.map((tab) => {
                                const { tabId, panelId } = getTabIds('guideRecord', tab.id);
                                return (
                                    <div key={tab.id} id={panelId} role="tabpanel" aria-labelledby={tabId} hidden={tab.id !== demoRecordTab} className="guideDemoPad">
                                        <p>{tab.label} 내용 영역</p>
                                    </div>
                                );
                            })}
                        </div>
                    </GuideItem>

                    <GuideItem title="예제: 탭 4개" desc="대회 소개(RA2) 대회개요 / 참가방법 / 레이스팩 / 공지·FAQ (문구는 예시)">
                        <div className="siteScope guideDemo">
                            <Tabs items={RACE_TABS} activeId={demoRaceTab} onChange={setDemoRaceTab} idPrefix="guideRace" ariaLabel="대회 소개" />
                            {RACE_TABS.map((tab) => {
                                const { tabId, panelId } = getTabIds('guideRace', tab.id);
                                return (
                                    <div key={tab.id} id={panelId} role="tabpanel" aria-labelledby={tabId} hidden={tab.id !== demoRaceTab} className="guideDemoPad">
                                        <p>{tab.label} 내용 영역</p>
                                    </div>
                                );
                            })}
                        </div>
                        <pre className="guideCode"><code>{`const TABS: TabItem[] = [{ id: 'certified', label: '인증 기록' }, { id: 'training', label: '트레이닝 기록' }];
const [activeTab, setActiveTab] = useState(TABS[0].id);

<Tabs items={TABS} activeId={activeTab} onChange={setActiveTab} idPrefix="myRecord" ariaLabel="기록 구분" />
{TABS.map((tab) => {
    const { tabId, panelId } = getTabIds('myRecord', tab.id);
    return (
        <div key={tab.id} id={panelId} role="tabpanel" aria-labelledby={tabId} hidden={tab.id !== activeTab}>
            ...
        </div>
    );
})}`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="textLink">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>TextLink</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/TextLink.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Link (Size Small / Medium), 화살표는 Icon_16 / Arrow">
                        <PropsTable rows={TEXT_LINK_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="m: 로그인 비밀번호 재설정(ME1) / s + 화살표: 홈 노데이터 트래커 바로가기(MY3)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <div className="guideFlex">
                                <TextLink label="비밀번호 재설정" onClick={handleDemoClick} />
                                <TextLink label="트래커 바로가기" size="s" hasArrow onClick={handleDemoClick} />
                            </div>
                        </div>
                        <pre className="guideCode"><code>{`<TextLink label="비밀번호 재설정" to={ROUTES.passwordFind} />
<TextLink label="트래커 바로가기" size="s" hasArrow to={ROUTES.tracker} />`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="noData">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>NoData</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/NoData.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: Nodata (아이콘 48, 간격 16)">
                        <PropsTable rows={NO_DATA_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제: box" desc="홈 러닝 기록 없음(MY3-홈_01최소)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <NoData
                                message="러닝 기록이 없네요, 한 번 달려볼까요?"
                                action={<TextLink label="트래커 바로가기" size="s" hasArrow onClick={handleDemoClick} />}
                            />
                        </div>
                    </GuideItem>

                    <GuideItem title="예제: section" desc="내 정보 레이스 기록 없음(MY3.1-내 정보_대회 기록_01Nodata)">
                        <div className="siteScope guideDemo">
                            <NoData
                                variant="section"
                                message={<>참여하신 레이스 기록이 없습니다.<br />진행 중인 레이스 확인 후 참여해보시겠어요?</>}
                                action={<FloatingButton label="진행중인 레이스보기" onClick={handleDemoClick} />}
                            />
                        </div>
                        <pre className="guideCode"><code>{`<NoData
    message="러닝 기록이 없네요, 한 번 달려볼까요?"
    action={<TextLink label="트래커 바로가기" size="s" hasArrow to={ROUTES.tracker} />}
/>

<NoData
    variant="section"
    message={<>참여하신 레이스 기록이 없습니다.<br />진행 중인 레이스 확인 후 참여해보시겠어요?</>}
    action={<FloatingButton label="진행중인 레이스보기" to={ROUTES.raceList} />}
/>`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="loading">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Loading</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Loading.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: CO 로딩 (흰 화면 가운데 80×80 runable_loading.gif)">
                        <PropsTable rows={LOADING_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="실제로는 화면 전체를 덮습니다(position fixed). 아래 상자는 Guide에서만 영역 안에 표시한 미리보기입니다.">
                        <div className="siteScope guideDemo guideDemoLoading">
                            <Loading />
                        </div>
                        <div className="siteScope guideFlex">
                            <Button label="전체 화면 로딩 보기 (2초)" size="m" onClick={() => setIsDemoLoading(true)} />
                        </div>
                        {isDemoLoading && (
                            <div className="siteScope">
                                <Loading />
                            </div>
                        )}
                        <pre className="guideCode"><code>{`{isLoading && <Loading />}`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="termsForm">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>TermsForm</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/TermsForm.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: CO 약관폼 (padding 32 24 40, 섹션 간격 48). 제목·닫기는 페이지의 Header(type close)">
                        <PropsTable rows={TERMS_FORM_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="본문 타이틀 + 설명 + 표(3칸) + 글머리 목록 / 본문 타이틀 + 표(1칸) + 번호 목록. 실제 화면에서는 위에 Header(type close)를 둡니다 (Guide에서는 #header id 중복을 막기 위해 생략)">
                        <div className="siteScope guideDemo">
                            <TermsForm sections={TERMS_SAMPLE} />
                        </div>
                        <pre className="guideCode"><code>{`<Header title="개인정보 처리방침" type="close" />
<TermsForm sections={TERMS_SAMPLE} />

// src/data/terms.ts
{
    id: 'termsSample1',
    title: '본문 타이틀',
    paragraphs: ['…', '…'],
    blocks: [{
        subTitle: '서브 타이틀',
        table: { columns: ['처리 업무', …], rows: [['처리 업무', '(필수항목)\\n이름, …', …]] },
        list: { type: 'bullet', items: ['…'] }
    }]
}`}</code></pre>
                    </GuideItem>
                </section>
                <section className="guideSection" id="slider">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>Slider</h3>
                        </div>
                        <span className="guidePath">src/components/pub/common/Slider.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Swiper(swiper/react) 기반 가로 카드 슬라이드. 카드 간격 12, 좌우 여백 24 (홈 참여가능 레이스)">
                        <PropsTable rows={SLIDER_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="좌우로 끌어서 넘겨 보세요.">
                        <div className="siteScope guideDemo guideDemoSlider">
                            <Slider
                                items={OPEN_RACES}
                                getKey={(race) => race.id}
                                renderItem={(race) => <RaceCard variant="image" race={race} />}
                                ariaLabel="참여가능 레이스 목록"
                            />
                        </div>
                        <pre className="guideCode"><code>{`<Slider
    items={OPEN_RACES}
    getKey={(race) => race.id}
    renderItem={(race) => <RaceCard variant="image" race={race} />}
    ariaLabel="참여가능 레이스 목록"
/>`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="raceCard">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>RaceCard</h3>
                        </div>
                        <span className="guidePath">src/components/pub/race/RaceCard.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: _Card. dday 312×90 (D-day 칸 90), image 312 (이미지 180)">
                        <PropsTable rows={RACE_CARD_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제: dday" desc="D-DAY는 대회 트래커(TR1.3), D-00은 트래커 메인으로 이동">
                        <div className="siteScope guideDemo guideDemoPad">
                            {MY_RACES_MAX.slice(0, 2).map((race) => <RaceCard key={race.id} variant="dday" race={race} />)}
                        </div>
                    </GuideItem>

                    <GuideItem title="예제: image" desc="RA1 레이스 Card Module 케이스: 진행예정(upcoming) 흰 깃발 / 접수중(open) 파란 깃발 + 마감일, 참가 신청 버튼 / 신청마감(closed) 검정 깃발 / 마감(finished) 검정 깃발 + 이미지 검정 60%. 카드 높이 378 고정">
                        <div className="siteScope guideDemo guideDemoPad">
                            {RACE_LIST.map((race) => <RaceCard key={race.id} variant="image" race={race} />)}
                        </div>
                        <pre className="guideCode"><code>{`<RaceCard variant="dday" race={myRace} />   // MyRace
<RaceCard variant="image" race={race} />    // Race`}</code></pre>
                    </GuideItem>
                </section>

                <section className="guideSection" id="recordCard">
                    <div className="guideTitle">
                        <div>
                            <span className="guideCategory">COMPONENTS</span>
                            <h3>RecordCard</h3>
                        </div>
                        <span className="guidePath">src/components/pub/my/RecordCard.tsx</span>
                    </div>

                    <GuideItem title="Props" desc="Figma: _Card (러닝 기록). 흰 카드 radius 8 + Elevation 2">
                        <PropsTable rows={RECORD_CARD_PROPS} />
                    </GuideItem>

                    <GuideItem title="예제" desc="일반 기록 / 대회 기록(대회명 깃발)">
                        <div className="siteScope guideDemo guideDemoPad">
                            <RecordCard record={RECENT_RECORDS[0]} />
                            <RecordCard record={RECENT_RECORDS[2]} />
                        </div>
                        <pre className="guideCode"><code>{`<RecordCard record={record} />`}</code></pre>
                    </GuideItem>
                </section>
            </main>
        </div>
    );
};

export default Guide;
