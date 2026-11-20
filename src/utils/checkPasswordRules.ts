// 비밀번호 조건 검사 (Figma ME1.3 입력 문구: 영문자, 특수문자, 숫자, 8자 이상)
// - 조건별 충족 여부를 순서대로 돌려줍니다. 화면 문구는 페이지에서 만듭니다.

export interface PasswordRuleResult {
    key: 'letter' | 'special' | 'number' | 'length';
    label: string;
    isMet: boolean;
}

const MIN_PASSWORD_LENGTH = 8;

const checkPasswordRules = (password: string): PasswordRuleResult[] => [
    { key: 'letter', label: '영문자', isMet: /[A-Za-z]/.test(password) },
    { key: 'special', label: '특수문자', isMet: /[^A-Za-z0-9\s]/.test(password) },
    { key: 'number', label: '숫자', isMet: /\d/.test(password) },
    { key: 'length', label: `${MIN_PASSWORD_LENGTH}자 이상`, isMet: password.length >= MIN_PASSWORD_LENGTH }
];

export default checkPasswordRules;
