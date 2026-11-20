import { useState } from 'react';
import type { FormEvent } from 'react';
import usePageState from '../../hooks/usePageState';
import { ROUTES } from '../../constants';
import checkPasswordRules from '../../utils/checkPasswordRules';
import Input from '../../components/pub/common/Input';
import Button from '../../components/pub/common/Button';
import iconLock from '../../assets/icons/iconLock.svg';
import iconLockCheck from '../../assets/icons/iconLockCheck.svg';

// 비밀번호 재설정 /password/reset (Figma ME1.3_01입력전·02입력후·03입력완료, ME1.4 재설정 완료) — docs/requirements.md US-02
// - 앱 밖 이메일의 [비밀번호 재설정 링크]로 들어오는 웹 화면이라 Top Bar 버튼·제목이 없습니다(빈 56px 영역).
// - 새 비밀번호 입력 시 조건 문구: 충족한 조건은 "(조건 충족)" 검정, 못 채운 조건은 빨강. 모두 충족하면 문구를 숨깁니다.
// - 조건을 모두 충족하고 재입력이 같으면 [비밀번호 변경] 활성화 → 누르면 완료(?state=complete)
// - ?state=typing: 입력후(조건 일부 미충족), ?state=filled: 입력완료, ?state=complete: 재설정 완료

type PasswordResetState = 'default' | 'typing' | 'filled' | 'complete';

const PASSWORD_RESET_STATES: readonly PasswordResetState[] = ['default', 'typing', 'filled', 'complete'];

// 시안 예시 값: 입력후 ●●●●●● (영문·숫자만 6자), 입력완료 1a5gbba12!
const SAMPLE_PASSWORD: Record<PasswordResetState, string> = {
    default: '',
    typing: 'abc123',
    filled: '1a5gbba12!',
    complete: ''
};

const PasswordReset = () => {
    const { state, setState } = usePageState<PasswordResetState>({
        states: PASSWORD_RESET_STATES,
        defaultState: 'default'
    });
    const [password, setPassword] = useState(SAMPLE_PASSWORD[state]);
    const [passwordConfirm, setPasswordConfirm] = useState(state === 'filled' ? SAMPLE_PASSWORD.filled : '');

    const ruleResults = checkPasswordRules(password);
    const isRuleAllMet = ruleResults.every((rule) => rule.isMet);
    const canSubmit = isRuleAllMet && password === passwordConfirm;

    const ruleMessage = password && !isRuleAllMet ? (
        <>
            {ruleResults.map((rule, index) => (
                <span key={rule.key} className={rule.isMet ? 'ruleMet' : 'ruleUnmet'}>
                    {rule.label}
                    {rule.isMet && '(조건 충족)'}
                    {index < ruleResults.length - 1 && ', '}
                </span>
            ))}
        </>
    ) : undefined;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;
        setState('complete');
    };

    if (state === 'complete') {
        return (
            <div className="pageFull">
                <div className="pageIntro hasTopSpace">
                    <img src={iconLockCheck} alt="" className="pageIntroIcon" />
                    <h1 className="pageIntroTitle">비밀번호 변경이 완료되었습니다!</h1>
                    <p className="pageIntroDesc">
                        비밀번호가 재설정되었습니다.<br />
                        로그인 화면으로 이동 후 새로운 비밀번호로<br />
                        로그인 해주세요.
                    </p>
                </div>
                <div className="pageBottom">
                    {/* Figma 문구 "엡으로 로그인"은 오타로 보고 "앱으로 로그인"으로 표기 */}
                    <Button label="앱으로 로그인" isPage to={ROUTES.login} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="pageIntro hasTopSpace">
                <img src={iconLock} alt="" className="pageIntroIcon" />
                <h1 className="pageIntroTitle">새로운 비밀번호를 입력해주세요</h1>
                <p className="pageIntroDesc">해당 이메일로 비밀번호 재설정 링크를 전송했습니다. 확인 후 비밀번호를 재설정해주세요.</p>
            </div>
            <form className="pageContents" noValidate onSubmit={handleSubmit}>
                <Input
                    id="newPassword"
                    label="새 비밀번호"
                    isLabelHidden
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="영문, 숫자, 특수문자 8자 이상 조합을 입력해주세요"
                    helperText={ruleMessage}
                    hasClear
                    autoComplete="new-password"
                />
                <Input
                    id="newPasswordConfirm"
                    label="새 비밀번호 확인"
                    isLabelHidden
                    type="password"
                    value={passwordConfirm}
                    onChange={setPasswordConfirm}
                    placeholder="비밀번호를 한 번 더 입력해 주세요."
                    hasClear
                    autoComplete="new-password"
                />
                <Button label="비밀번호 변경" type="submit" disabled={!canSubmit} />
            </form>
        </>
    );
};

export default PasswordReset;
