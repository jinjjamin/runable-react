import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageState from '../../hooks/usePageState';
import { EMAIL_PATTERN, ROUTES } from '../../constants';
import Input from '../../components/pub/common/Input';
import Checkbox from '../../components/pub/common/Checkbox';
import Button from '../../components/pub/common/Button';
import TextLink from '../../components/pub/common/TextLink';
import iconEmail from '../../assets/icons/iconEmail.svg';
import iconSnsKakao from '../../assets/icons/iconSnsKakao.png';
import iconSnsNaver from '../../assets/icons/iconSnsNaver.png';
import iconSnsGoogle from '../../assets/icons/iconSnsGoogle.png';
import iconSnsApple from '../../assets/icons/iconSnsApple.png';

// 로그인 /login (Figma ME1-로그인_01기본(iOS)·01기본(AOS)·02에러·03접속기록) — docs/requirements.md US-01
// - ?platform=aos: SNS 3개(카카오·네이버·구글), 기본(iOS)은 4개(+애플)
// - ?state=error: 이메일 형식 에러 화면 / ?state=history: 마지막 로그인 SNS 위 말풍선
// - 로그인 상태유지 체크박스는 시안 설명대로 기본 선택 안 됨
// - 목업 동작: 이메일 형식이 맞고 비밀번호가 있으면 홈으로, SNS 버튼은 가입된 계정으로 보고 홈으로 이동

type LoginState = 'default' | 'error' | 'history';
type SnsKey = 'kakao' | 'naver' | 'google' | 'apple';

interface SnsItem {
    key: SnsKey;
    label: string;
    icon: string;
}

const LOGIN_STATES: readonly LoginState[] = ['default', 'error', 'history'];

const SNS_LIST: SnsItem[] = [
    { key: 'kakao', label: '카카오로 시작하기', icon: iconSnsKakao },
    { key: 'naver', label: '네이버로 시작하기', icon: iconSnsNaver },
    { key: 'google', label: '구글로 시작하기', icon: iconSnsGoogle },
    { key: 'apple', label: '애플로 시작하기', icon: iconSnsApple }
];

// 마지막 로그인 SNS 목업: 시안은 애플(iOS). AOS에는 애플이 없어 구글로 표시합니다.
const LAST_LOGIN_SNS: Record<'ios' | 'aos', SnsKey> = { ios: 'apple', aos: 'google' };

const ERROR_SAMPLE_EMAIL = 'ㅂㅇㄴㅆ';
const EMAIL_ERROR_MESSAGE = '이메일 형식이 유효하지 않습니다.';

const Login = () => {
    const navigate = useNavigate();
    const { state, platform } = usePageState<LoginState>({ states: LOGIN_STATES, defaultState: 'default' });

    const isErrorSample = state === 'error';
    const [email, setEmail] = useState(isErrorSample ? ERROR_SAMPLE_EMAIL : '');
    const [password, setPassword] = useState('');
    const [isKeepLogin, setIsKeepLogin] = useState(false);
    const [emailError, setEmailError] = useState(isErrorSample ? EMAIL_ERROR_MESSAGE : '');

    const snsList = platform === 'aos' ? SNS_LIST.filter((item) => item.key !== 'apple') : SNS_LIST;
    const lastLoginSns = state === 'history' ? LAST_LOGIN_SNS[platform] : null;

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (emailError) setEmailError('');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!EMAIL_PATTERN.test(email)) {
            setEmailError(EMAIL_ERROR_MESSAGE);
            return;
        }
        if (!password) return;
        navigate(ROUTES.home);
    };

    const handleSnsClick = () => {
        navigate(ROUTES.home);
    };

    return (
        <div className="login">
            <div className="loginHead">
                <h1 className="loginTitle">로그인</h1>
            </div>

            <form className="loginForm" noValidate onSubmit={handleSubmit}>
                <div className="loginInputGroup">
                    <div className="loginInputs">
                        <Input
                            id="loginEmail"
                            label="이메일 주소"
                            isLabelHidden
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="이메일 주소를 입력해주세요"
                            errorMessage={emailError || undefined}
                            hasClear
                            autoComplete="email"
                        />
                        <Input
                            id="loginPassword"
                            label="비밀번호"
                            isLabelHidden
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="비밀번호를 입력해주세요"
                            hasPasswordToggle={false}
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="loginOption">
                        <Checkbox id="loginKeep" label="로그인 상태유지" checked={isKeepLogin} onChange={setIsKeepLogin} />
                        <TextLink label="비밀번호 재설정" to={ROUTES.passwordFind} />
                    </div>
                </div>
                <Button label="로그인" type="submit" />
            </form>

            <div className="loginBottom">
                <section className="loginSns" aria-labelledby="loginSnsTitle">
                    <h2 className="loginSnsTitle" id="loginSnsTitle">SNS로 시작하기</h2>
                    <ul className="loginSnsList">
                        {snsList.map((item) => {
                            const isLast = item.key === lastLoginSns;
                            return (
                                <li className="loginSnsItem" key={item.key}>
                                    {isLast && (
                                        <p className="loginTooltip" id="loginLastTooltip">마지막 로그인 계정입니다</p>
                                    )}
                                    <button
                                        type="button"
                                        className="loginSnsButton"
                                        aria-label={item.label}
                                        aria-describedby={isLast ? 'loginLastTooltip' : undefined}
                                        onClick={handleSnsClick}
                                    >
                                        <img src={item.icon} alt="" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
                <Button label="이메일로 회원가입" variant="outline" icon={iconEmail} to={ROUTES.signup} />
            </div>
        </div>
    );
};

export default Login;
