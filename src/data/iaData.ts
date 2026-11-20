import type { Cell, HeaderCell, IaTable, TaskKey } from '../types';
import { EMAIL_TEMPLATES, ROUTES } from '../constants';

// IA 관리 화면 데이터 (AGENTS.md 6.3)
// - 화면 목록은 docs/requirements.md 페이지 목록과 실제 React Router 경로 기준입니다.
// - Task 상태는 docs/tasks.md 완료 기록 기준이며, 페이지를 추가·수정하면 이 파일도 함께 갱신합니다.
// - 상태별 화면 링크(?state=, ?platform=, ?step=)는 각 화면을 구현할 때 행으로 추가합니다.

export const TASKS: { key: TaskKey; name: string }[] = [
    { key: '0', name: 'Undone' },
    { key: '1', name: 'Done' },
    { key: '2', name: 'Modify' },
    { key: '3', name: 'Delete' }
];

// 프로젝트마다 바꾸는 값: title(h1 <em> 문구), worksheet(작업 영역 제목)
// notice 문구는 원본 그대로 유지합니다.
export const IA_INFO = {
    title: '러너블',
    worksheet: 'Worksheet: Web',
    notice: 'Undone: 코딩중, Done: 코딩완료, Modify: 코딩 완료 후 HTML수정, Delete: 코딩 완료 후 SB삭제'
};

// 메뉴 깊이 열 개수: Depth1 메뉴 그룹, Depth2 화면
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

// 메뉴(테이블)마다 id는 menuIdx1부터 순서대로 부여합니다. Guide는 항상 첫 번째입니다 (AGENTS.md 6.4).
export const IA_TABLES: IaTable[] = [
    {
        id: 'menuIdx1',
        title: 'Guide',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['Guide', '공통 컴포넌트 가이드'], ROUTES.guide, {
                date: '2026-11-17',
                memo: '필수 고정 항목. 기본 틀 완료, 공통 컴포넌트는 Phase 2에서 추가',
                task: '1'
            })
        ]
    },
    {
        id: 'menuIdx2',
        title: 'ME 회원',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['회원', '스플래시'], ROUTES.splash, { date: '2026-11-17', memo: 'MY1 (자동 진행: 로고 → 인트로 → 홈, 각 1.5초)', task: '1' }),
            createRow(['', '스플래시 - 로고'], `${ROUTES.splash}?state=logo`, { date: '2026-11-17', memo: 'MY1-스플래시_01 (멈춤)', task: '1' }),
            createRow(['', '스플래시 - 인트로'], `${ROUTES.splash}?state=intro`, { date: '2026-11-17', memo: 'MY1-스플래시_02인트로 (멈춤)', task: '1' }),
            createRow(['', '로그인 (iOS)'], ROUTES.login, { date: '2026-11-17', memo: 'ME1-로그인_01기본(iOS)', task: '1' }),
            createRow(['', '로그인 (AOS)'], `${ROUTES.login}?platform=aos`, { date: '2026-11-17', memo: 'ME1-로그인_01기본(AOS), SNS 3개', task: '1' }),
            createRow(['', '로그인 - 에러'], `${ROUTES.login}?state=error`, { date: '2026-11-17', memo: 'ME1-로그인_02에러', task: '1' }),
            createRow(['', '로그인 - 접속기록'], `${ROUTES.login}?state=history`, { date: '2026-11-17', memo: 'ME1-로그인_03접속기록 (AOS는 구글에 말풍선)', task: '1' }),
            createRow(['', '비밀번호 재설정 정보 입력'], ROUTES.passwordFind, { date: '2026-11-17', memo: 'ME1.1_01입력전', task: '1' }),
            createRow(['', '비밀번호 재설정 정보 입력 - 입력후'], `${ROUTES.passwordFind}?state=filled`, { date: '2026-11-17', memo: 'ME1.1_02입력후', task: '1' }),
            createRow(['', '비밀번호 재설정 이메일 전송 안내'], `${ROUTES.passwordFind}?state=sent`, { date: '2026-11-17', memo: 'ME1.2', task: '1' }),
            createRow(['', '비밀번호 재설정'], ROUTES.passwordReset, { date: '2026-11-17', memo: 'ME1.3_01입력전 (이메일 링크로 진입, Top Bar 없음)', task: '1' }),
            createRow(['', '비밀번호 재설정 - 입력후'], `${ROUTES.passwordReset}?state=typing`, { date: '2026-11-17', memo: 'ME1.3_02입력후 (조건 문구)', task: '1' }),
            createRow(['', '비밀번호 재설정 - 입력완료'], `${ROUTES.passwordReset}?state=filled`, { date: '2026-11-17', memo: 'ME1.3_03입력완료', task: '1' }),
            createRow(['', '비밀번호 재설정 완료'], `${ROUTES.passwordReset}?state=complete`, { date: '2026-11-17', memo: 'ME1.4', task: '1' }),
            createRow(['', '회원가입'], ROUTES.signup, { date: '2026-11-17', memo: 'ME2 (빈 화면, 전송→인증→비밀번호 동작)', task: '1' }),
            createRow(['', '회원가입 - 입력중'], `${ROUTES.signup}?state=typing`, { date: '2026-11-17', memo: 'ME2-회원가입_01입력중', task: '1' }),
            createRow(['', '회원가입 - 인증번호'], `${ROUTES.signup}?state=code`, { date: '2026-11-17', memo: 'ME2-회원가입_02인증번호 (남은 시간 감소)', task: '1' }),
            createRow(['', '회원가입 - 비밀번호 입력'], `${ROUTES.signup}?state=verified`, { date: '2026-11-17', memo: 'ME2.1-이메일/비밀번호로 가입', task: '1' }),
            createRow(['', '약관·추가 정보'], ROUTES.signupTerms, { memo: 'ME2.2.1 ~ ME2.3' }),
            createRow(['', '가입 완료'], ROUTES.signupComplete, { memo: 'ME2.4' })
        ]
    },
    {
        id: 'menuIdx3',
        title: 'MY 홈/마이',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['홈', '홈'], ROUTES.home, { date: '2026-11-17', memo: 'MY3-홈_02최대 (참여가능 레이스 Swiper)', task: '1' }),
            createRow(['', '홈 - 최소'], `${ROUTES.home}?state=min`, { date: '2026-11-17', memo: 'MY3-홈_01최소 (참여 가능 대회 없음, 러닝 기록 노데이터)', task: '1' }),
            createRow(['마이', '내 정보'], ROUTES.my, { memo: 'MY3.1' }),
            createRow(['', '프로필 수정'], ROUTES.profile, { memo: 'MY3.1.1' }),
            createRow(['', '설정'], ROUTES.settings, { memo: 'MY3.1.2 ~ MY3.1.2.6' }),
            createRow(['', '회원 탈퇴'], ROUTES.withdraw, { memo: 'MY3.1.2.3' }),
            createRow(['', '무료 참가권'], ROUTES.coupons, { memo: 'MY3.1.2.8' }),
            createRow(['', '전체 기록'], ROUTES.records, { memo: 'MY3.1.3, MY3.1.3.1' }),
            createRow(['', '트레이닝 기록 상세'], ROUTES.recordDetail, { memo: 'MY3.1.4 ~ MY3.1.4.4' }),
            createRow(['', '기록 제출'], ROUTES.recordSubmit, { memo: 'MY3.1.5 ~ MY3.1.5.2, MY3.1.7' }),
            createRow(['', '대회 승인 기록 상세'], ROUTES.raceRecordDetail, { memo: 'MY3.1.6, MY3.1.6.1' }),
            createRow(['알림', '알림'], ROUTES.notifications, { memo: 'MY3.2' })
        ]
    },
    {
        id: 'menuIdx4',
        title: 'RA 레이스',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['레이스', '대회 목록'], ROUTES.raceList, { date: '2026-11-17', memo: 'RA1 (진행예정·접수중·신청마감·마감 카드)', task: '1' }),
            createRow(['', '대회 소개'], ROUTES.raceDetail, { memo: 'RA2 ~ RA2.3.3' }),
            createRow(['', '참가 신청'], ROUTES.raceApply, { memo: 'RA3 ~ RA3.5 (6단계)' }),
            createRow(['', '참가 신청 완료'], ROUTES.raceApplyComplete, { memo: 'RA3.6' }),
            createRow(['', '참가 신청 조회'], ROUTES.raceApplication, { memo: 'RA4 ~ RA4.5' })
        ]
    },
    {
        id: 'menuIdx5',
        title: 'TR 트래커',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['트래커', '트래커 메인'], ROUTES.tracker, { memo: 'TR1, TR1.1 ~ TR1.1.3' }),
            createRow(['', '일반 트래커'], ROUTES.trackerTraining, { memo: 'TR1.2, TR1.4' }),
            createRow(['', '대회 트래커'], ROUTES.trackerRace, { memo: 'TR1.3, TR1.4' }),
            createRow(['', '베타 테스트 의견'], ROUTES.betaFeedback, { memo: 'TR2, TR2.1' })
        ]
    },
    {
        id: 'menuIdx6',
        title: 'CO 공통',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [createRow(['공통', '웹페이지 에러'], ROUTES.error, { memo: 'CO2.5' })]
    },
    {
        id: 'menuIdx7',
        title: '이메일 템플릿',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['이메일', '이메일 컨펌'], EMAIL_TEMPLATES.emailConfirm, { memo: 'CO3, 정적 HTML' }),
            createRow(['', '회원가입 완료'], EMAIL_TEMPLATES.signupComplete, { memo: 'CO3.1' }),
            createRow(['', '비밀번호 재설정'], EMAIL_TEMPLATES.passwordReset, { memo: 'CO3.2' }),
            createRow(['', '관리자 승인요청'], EMAIL_TEMPLATES.adminApprovalRequest, { memo: 'CO3.6' }),
            createRow(['', '관리자 승인완료'], EMAIL_TEMPLATES.adminApprovalComplete, { memo: 'CO3.7' }),
            createRow(['', '관리자 비번재설정'], EMAIL_TEMPLATES.adminPasswordReset, { memo: 'CO3.8' }),
            createRow(['', '1:1 문의 답변'], EMAIL_TEMPLATES.inquiryAnswer, { memo: 'CO3.9' })
        ]
    }
];
