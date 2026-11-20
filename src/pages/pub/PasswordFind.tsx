import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import usePageState from '../../hooks/usePageState';
import { EMAIL_PATTERN, ROUTES } from '../../constants';
import Header from '../../components/pub/layout/Header';
import Input from '../../components/pub/common/Input';
import Button from '../../components/pub/common/Button';
import iconLockOpen from '../../assets/icons/iconLockOpen.svg';
import iconEmailCheck from '../../assets/icons/iconEmailCheck.svg';

// 비밀번호 재설정 정보 입력 /password/find (Figma ME1.1_01입력전·02입력후, ME1.2 이메일 전송 안내) — docs/requirements.md US-02
// - 이메일 형식이 맞으면 [이메일 전송] 버튼 활성화 → 누르면 전송 안내(?state=sent)로 바뀝니다.
// - ?state=filled: 입력후 화면, ?state=sent: 전송 안내 화면
// - 가입 이력 없음·SNS 가입 안내 문구는 시안에 없고 "서비스 정책서-입력체크 시트"(미제공) 참고라 넣지 않았습니다.

type PasswordFindState = 'default' | 'filled' | 'sent';

const PASSWORD_FIND_STATES: readonly PasswordFindState[] = ['default', 'filled', 'sent'];
const SAMPLE_EMAIL = 'kimvinyl@vinylc.com';

const PasswordFind = () => {
    const { state, setState } = usePageState<PasswordFindState>({
        states: PASSWORD_FIND_STATES,
        defaultState: 'default'
    });
    const [email, setEmail] = useState(state === 'default' ? '' : SAMPLE_EMAIL);

    const isSent = state === 'sent';
    const isEmailValid = EMAIL_PATTERN.test(email);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isEmailValid) return;
        // 목업: 첫 전송은 안내 화면으로 바꾸고, 재전송은 화면을 그대로 둡니다.
        if (!isSent) setState('sent');
    };

    return (
        <>
            <Header title="비밀번호 재설정" />
            <div className="pageIntro">
                <img src={isSent ? iconEmailCheck : iconLockOpen} alt="" className="pageIntroIcon" />
                <h2 className="pageIntroTitle">{isSent ? '이메일이 전송되었습니다' : '비밀번호를 잊으셨나요?'}</h2>
                <p className="pageIntroDesc">
                    {isSent
                        ? '해당 이메일로 비밀번호 재설정 링크를 전송했습니다. 확인 후 비밀번호를 재설정해주세요.'
                        : '비밀번호를 재설정 하기 위한 이메일 계정을 입력해주세요'}
                </p>
            </div>
            <form className="pageContents" noValidate onSubmit={handleSubmit}>
                <Input
                    id="passwordFindEmail"
                    label="이메일 주소"
                    isLabelHidden
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="이메일 주소를 입력해주세요"
                    hasClear
                    autoComplete="email"
                />
                <div className="pageActions">
                    <Button label={isSent ? '이메일 재전송' : '이메일 전송'} type="submit" disabled={!isEmailValid} />
                    {isSent && (
                        <Link to={ROUTES.login} className="pageTextLink">로그인 화면으로 이동</Link>
                    )}
                </div>
            </form>
        </>
    );
};

export default PasswordFind;
