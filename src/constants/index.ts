// 공용 상수
// - 경로 문자열은 ROUTES에서만 정의합니다 (docs/design.md 1.1.1).
// - 경로 목록의 기준은 docs/requirements.md 4장입니다. 경로를 바꾸면 requirements.md와 iaData.ts도 함께 갱신합니다.

export const ROUTES = {
    /* 관리 화면 (Layout 미적용) */
    ia: '/ia',
    guide: '/guide',

    /* ME 회원 */
    splash: '/splash', // MY1
    login: '/login', // ME1
    passwordFind: '/password/find', // ME1.1, ME1.2
    passwordReset: '/password/reset', // ME1.3, ME1.4
    signup: '/signup', // ME2, ME2.1
    signupTerms: '/signup/terms', // ME2.2.1 ~ ME2.2.4, ME2.3
    signupComplete: '/signup/complete', // ME2.4

    /* MY 홈/마이 */
    home: '/', // MY3
    my: '/my', // MY3.1
    profile: '/my/profile', // MY3.1.1
    settings: '/my/settings', // MY3.1.2 ~ MY3.1.2.6
    withdraw: '/my/withdraw', // MY3.1.2.3
    coupons: '/my/coupons', // MY3.1.2.8
    records: '/my/records', // MY3.1.3, MY3.1.3.1
    recordDetail: '/my/records/detail', // MY3.1.4 ~ MY3.1.4.4
    recordSubmit: '/my/records/submit', // MY3.1.5 ~ MY3.1.5.2, MY3.1.7
    raceRecordDetail: '/my/race-records/detail', // MY3.1.6, MY3.1.6.1
    notifications: '/notifications', // MY3.2

    /* RA 레이스 */
    raceList: '/races', // RA1
    raceDetail: '/races/detail', // RA2 ~ RA2.3.3
    raceApply: '/races/apply', // RA3 ~ RA3.5
    raceApplyComplete: '/races/apply/complete', // RA3.6
    raceApplication: '/races/application', // RA4 ~ RA4.5

    /* TR 트래커 */
    tracker: '/tracker', // TR1, TR1.1 ~ TR1.1.3
    trackerTraining: '/tracker/training', // TR1.2, TR1.4
    trackerRace: '/tracker/race', // TR1.3, TR1.4
    betaFeedback: '/beta-feedback', // TR2, TR2.1

    /* CO 공통 */
    error: '/error' // CO2.5
} as const;

// 이메일 템플릿 정적 HTML (public/email/, AGENTS.md 9장 예외). React Router 경로가 아닙니다.
export const EMAIL_TEMPLATES = {
    emailConfirm: '/email/emailConfirm.html', // CO3
    signupComplete: '/email/signupComplete.html', // CO3.1
    passwordReset: '/email/passwordReset.html', // CO3.2
    adminApprovalRequest: '/email/adminApprovalRequest.html', // CO3.6
    adminApprovalComplete: '/email/adminApprovalComplete.html', // CO3.7
    adminPasswordReset: '/email/adminPasswordReset.html', // CO3.8
    inquiryAnswer: '/email/inquiryAnswer.html' // CO3.9
} as const;

// 이메일 형식 검사 (로그인, 비밀번호 재설정 등 목업 유효성 검사)
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
