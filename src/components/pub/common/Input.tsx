import { useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import iconInputClear from '../../../assets/icons/iconInputClear.svg';
import iconInputComplete from '../../../assets/icons/iconInputComplete.svg';
import iconPasswordShow from '../../../assets/icons/iconPasswordShow.svg';

// 입력창 (Figma: Text Field) — docs/design.md 2장, 6.0
// - 구성: 라벨(+필수 점, 보조 문구) / 입력 영역(+오른쪽 버튼) / 에러 또는 안내 문구
// - 상태: 기본(Primary-50 배경) · 입력 중(흰 배경 + Primary-500 테두리) · 에러(흰 배경 + Danger-500 테두리)
// - 입력 영역 안 요소: 남은 시간(timer), 지우기(hasClear, 값이 있을 때만), 입력 확인(isComplete), 비밀번호 보기(type="password")
// - button: 오른쪽에 붙는 버튼 (예: 전송하기, 인증하기, 우편번호 검색)
// - isLabelHidden: 라벨을 화면에서 숨기고 화면 읽기 프로그램에만 제공 (예: 로그인처럼 placeholder만 보이는 시안)
// - hasPasswordToggle: 비밀번호 보기 버튼 표시 여부 (기본 true, 로그인 시안은 false)

interface InputButton {
    label: string;
    disabled?: boolean;
    onClick?: () => void;
}

interface InputProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    isLabelHidden?: boolean;
    labelNote?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'password' | 'tel' | 'number';
    placeholder?: string;
    errorMessage?: string;
    helperText?: ReactNode;
    hasClear?: boolean;
    isComplete?: boolean;
    timer?: string;
    button?: InputButton;
    name?: string;
    autoComplete?: string;
    hasPasswordToggle?: boolean;
}

const Input = ({
    id,
    value,
    onChange,
    label,
    isLabelHidden = false,
    labelNote,
    required = false,
    type = 'text',
    placeholder,
    errorMessage,
    helperText,
    hasClear = false,
    isComplete = false,
    timer,
    button,
    name,
    autoComplete,
    hasPasswordToggle = true
}: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const hasError = Boolean(errorMessage);
    const message = errorMessage ?? helperText;
    const messageId = message ? `${id}Message` : undefined;
    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const handleClear = () => {
        onChange('');
    };

    const handleTogglePassword = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <div className={hasError ? 'inputField isError' : 'inputField'}>
            {label && (
                <label htmlFor={id} className={isLabelHidden ? 'inputLabel blind' : 'inputLabel'}>
                    {label}
                    {required && <span className="inputRequired"><span className="blind">필수</span></span>}
                    {labelNote && <span className="inputLabelNote">{labelNote}</span>}
                </label>
            )}

            <div className="inputRow">
                <div className="inputBox">
                    <input
                        id={id}
                        name={name}
                        type={inputType}
                        className="inputControl"
                        value={value}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        required={required}
                        aria-invalid={hasError || undefined}
                        aria-describedby={messageId}
                        onChange={handleChange}
                    />
                    {timer && <span className="inputTimer">{timer}</span>}
                    {hasClear && value && (
                        <button type="button" className="inputIconButton" aria-label="입력 내용 지우기" onClick={handleClear}>
                            <img src={iconInputClear} alt="" />
                        </button>
                    )}
                    {isComplete && <img src={iconInputComplete} alt="확인 완료" className="inputStatusIcon" />}
                    {type === 'password' && hasPasswordToggle && (
                        <button
                            type="button"
                            className="inputIconButton passwordToggle"
                            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                            aria-pressed={isPasswordVisible}
                            onClick={handleTogglePassword}
                        >
                            <img src={iconPasswordShow} alt="" />
                        </button>
                    )}
                </div>
                {button && (
                    <button type="button" className="inputButton" disabled={button.disabled} onClick={button.onClick}>
                        {button.label}
                    </button>
                )}
            </div>

            {message && (
                <p id={messageId} className={hasError ? 'inputMessage error' : 'inputMessage'} role={hasError ? 'alert' : undefined}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Input;
