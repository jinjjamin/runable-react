import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageState from '../../hooks/usePageState';
import { EMAIL_PATTERN, ROUTES } from '../../constants';
import checkPasswordRules from '../../utils/checkPasswordRules';
import Header from '../../components/pub/layout/Header';
import Input from '../../components/pub/common/Input';
import Button from '../../components/pub/common/Button';

// 회원가입 /signup (Figma ME2-회원가입_01입력중·02인증번호, ME2.1-이메일/비밀번호로 가입) — docs/requirements.md US-03
// - [전송하기]: 이메일 형식이 맞으면 인증번호 발송(목업) → [다시전송] + 남은 시간(03:00부터 감소)
// - [인증하기]: 인증번호를 입력하면 활성 → 누르면 인증 완료(ME2.1): 제목 변경, 이메일 확인 아이콘, 인증번호 칸 숨김
// - [이전]: 로그인 화면 / [다음]: 이메일 인증 + 비밀번호 조건 충족 + 재입력 일치 시 활성 → 추가정보·약관동의(/signup/terms)
// - ?state=typing(01입력중), code(02인증번호), verified(ME2.1)
// - 이메일 형식 에러 문구는 로그인 시안(ME1-로그인_02에러) 문구를 사용합니다. 그 밖의 유효성 문구는 정책서(미제공) 참고라 넣지 않았습니다.

type SignupState = 'default' | 'typing' | 'code' | 'verified';

const SIGNUP_STATES: readonly SignupState[] = ['default', 'typing', 'code', 'verified'];

const SAMPLE_EMAIL = 'kimvinyl@vinylc.com';
const EMAIL_ERROR_MESSAGE = '이메일 형식이 유효하지 않습니다.';
const CODE_TIME_LIMIT = 180; // 시안의 기본 남은 시간 03:00
const SAMPLE_REMAINING = 156; // 02인증번호 시안의 02:36

const getInitialEmail = (state: SignupState) => {
    if (state === 'typing') return 'run';
    if (state === 'code' || state === 'verified') return SAMPLE_EMAIL;
    return '';
};

const formatTimer = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const rest = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${rest}`;
};

const Signup = () => {
    const navigate = useNavigate();
    const { state } = usePageState<SignupState>({ states: SIGNUP_STATES, defaultState: 'default' });

    const [email, setEmail] = useState(getInitialEmail(state));
    const [emailError, setEmailError] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(state === 'code');
    const [remaining, setRemaining] = useState(SAMPLE_REMAINING);
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(state === 'verified');
    const [password, setPassword] = useState(state === 'verified' ? 'abc123' : '');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const isPasswordValid = checkPasswordRules(password).every((rule) => rule.isMet);
    const canGoNext = isVerified && isPasswordValid && password === passwordConfirm;

    // 인증번호 남은 시간: 발송 후 1초마다 줄어듭니다.
    useEffect(() => {
        if (!isCodeSent || isVerified || remaining <= 0) return undefined;
        const timer = window.setTimeout(() => setRemaining((prev) => prev - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [isCodeSent, isVerified, remaining]);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailError('');
        // 인증 후 이메일을 바꾸면 다시 인증해야 합니다.
        if (isVerified || isCodeSent) {
            setIsVerified(false);
            setIsCodeSent(false);
            setCode('');
        }
    };

    const handleSendCode = () => {
        if (!EMAIL_PATTERN.test(email)) {
            setEmailError(EMAIL_ERROR_MESSAGE);
            return;
        }
        setIsCodeSent(true);
        setRemaining(CODE_TIME_LIMIT);
        setCode('');
    };

    const handleVerify = () => {
        if (!code || remaining <= 0) return;
        setIsVerified(true);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canGoNext) return;
        navigate(ROUTES.signupTerms);
    };

    return (
        <form className="pageFull" noValidate onSubmit={handleSubmit}>
            <Header title="회원가입" />
            <div className="pageIntro isTitleOnly">
                <h2 className="pageIntroTitle">{isVerified ? '비밀번호를 입력해주세요' : '이메일로 회원가입'}</h2>
            </div>

            <div className="pageContents signupFields">
                <div className="signupGroup">
                    <Input
                        id="signupEmail"
                        label="이메일"
                        required
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="이메일 주소를 입력해주세요"
                        errorMessage={emailError || undefined}
                        hasClear={!isVerified}
                        isComplete={isVerified}
                        autoComplete="email"
                        button={isVerified ? undefined : {
                            label: isCodeSent ? '다시전송' : '전송하기',
                            disabled: !email,
                            onClick: handleSendCode
                        }}
                    />
                    {!isVerified && (
                        <Input
                            id="signupCode"
                            label="인증번호"
                            isLabelHidden
                            type="number"
                            value={code}
                            onChange={setCode}
                            placeholder="인증번호를 입력해주세요"
                            timer={isCodeSent ? formatTimer(remaining) : undefined}
                            autoComplete="one-time-code"
                            button={{ label: '인증하기', disabled: !isCodeSent || !code || remaining <= 0, onClick: handleVerify }}
                        />
                    )}
                </div>

                <div className="signupGroup isPassword">
                    <Input
                        id="signupPassword"
                        label="비밀번호"
                        required
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="비밀번호 (영문, 숫자, 특수문자 8자 이상)"
                        hasClear
                        autoComplete="new-password"
                    />
                    <Input
                        id="signupPasswordConfirm"
                        label="비밀번호 확인"
                        isLabelHidden
                        type="password"
                        value={passwordConfirm}
                        onChange={setPasswordConfirm}
                        placeholder="비밀번호 확인"
                        hasClear
                        autoComplete="new-password"
                    />
                </div>
            </div>

            <div className="pageBottom">
                <div className="buttonGroup isPage">
                    <Button label="이전" variant="secondary" isPage to={ROUTES.login} />
                    <Button label="다음" type="submit" isPage disabled={!canGoNext} />
                </div>
            </div>
        </form>
    );
};

export default Signup;
