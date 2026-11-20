// 공용 타입 (docs/design.md 3장)
// - 여러 파일에서 공유하는 타입만 둡니다. 컴포넌트 Props는 각 컴포넌트 파일에 정의합니다.
// - 페이지별 상태 값(?state=)은 각 페이지 파일에 유니온 타입으로 정의합니다.

/* 상태별 화면 전환 (쿼리 파라미터 ?platform=) ---------------------------- */
export type Platform = 'ios' | 'aos';

/* 대회 ------------------------------------------------------------------ */
export type RaceStatus = 'upcoming' | 'open' | 'closed' | 'ongoing' | 'finished';

export type PaymentMethod = 'card' | 'virtualAccount' | 'freeTicket';

export interface Race {
    id: string;
    title: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    distances: string[]; // 예: ['5K', '10K', 'Half']
    status: RaceStatus;
    image?: string;
    applyDeadline?: string; // 접수 마감일 MM/DD (예: 12/12, 대회 카드 깃발에 ~12/12로 표시)
}

// 내가 신청한 대회 (홈·내 정보의 D-day 카드)
export interface MyRace extends Race {
    dDay: number; // 대회 시작까지 남은 날 (0 = D-DAY)
    myDistance: string; // 신청한 종목 (예: Half, 7K)
}

/* 러닝 기록 -------------------------------------------------------------- */
export interface RunningRecord {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD HH:mm
    distanceKm: number;
    duration: string; // HH:mm:ss
    pace: string; // 예: 10'04"
    raceId?: string;
    raceName?: string; // 대회 기록이면 대회명 깃발 표시 (예: 2021 ELLE RUN)
}

/* 트래커 화면 표시값 ------------------------------------------------------ */
export interface TrackerSnapshot {
    distanceKm: number;
    pace: string;
    duration: string;
}

/* 알림 ------------------------------------------------------------------ */
export interface NotificationItem {
    id: string;
    message: string;
    date: string;
    isRead: boolean;
}

/* 무료 참가권 ------------------------------------------------------------ */
export interface Coupon {
    id: string;
    name: string;
    expireDate: string; // YYYY-MM-DD
}

/* 탭 ------------------------------------------------------------------- */
export interface TabItem {
    id: string;
    label: string;
}

// 약관 본문 (TermsForm, src/data/terms.ts) — Figma CO 약관폼 구조
// 섹션 = 본문 타이틀 + 설명 문단 + 블록(서브 타이틀·표·목록)
export interface TermsTable {
    columns: string[];
    rows: string[][];
}

export interface TermsList {
    type: 'bullet' | 'number';
    items: string[];
}

export interface TermsBlock {
    subTitle?: string;
    table?: TermsTable;
    list?: TermsList;
}

export interface TermsSection {
    id: string;
    title: string;
    paragraphs?: string[];
    blocks?: TermsBlock[];
}

/* IA 관리 화면 (AGENTS.md 6.3 원본 구조 유지) ------------------------------- */
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
