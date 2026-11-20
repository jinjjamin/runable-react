import { Link } from 'react-router-dom';

// 공통 버튼 (Figma: Button) — docs/design.md 2장, 6.0
// - variant: primary(Primary-500 배경) / secondary(Primary-100 배경) / outline(2px 테두리)
// - size: l(높이 56, 모서리 8, Button(L) 14px) / m(높이 42, 모서리 4, Button(S) 12px)
// - 너비는 부모를 꽉 채웁니다. 두 개를 나란히 둘 때는 <div className="buttonGroup">으로 감쌉니다 (Figma Combination, 간격 8).
// - to를 넘기면 화면 이동 링크(<a>)로, 아니면 <button>으로 렌더링합니다. disabled면 항상 <button>입니다.
// - 비활성 색은 시안에 primary만 있습니다(Primary-200). secondary·outline 비활성은 시안 확인 후 추가합니다.
// - isPage: 화면 맨 아래 꽉 찬 버튼 (Figma Button Type Page, 360×56, 모서리 없음). 예) 비밀번호 변경 완료의 앱으로 로그인

interface ButtonProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'l' | 'm';
    icon?: string;
    disabled?: boolean;
    isPage?: boolean;
    to?: string;
    type?: 'button' | 'submit';
    onClick?: () => void;
}

const Button = ({
    label,
    variant = 'primary',
    size = 'l',
    icon,
    disabled = false,
    isPage = false,
    to,
    type = 'button',
    onClick
}: ButtonProps) => {
    const className = ['btn', variant, size === 'm' ? 'sizeM' : '', isPage ? 'page' : ''].filter(Boolean).join(' ');

    const content = (
        <>
            {icon && <img src={icon} alt="" />}
            <span>{label}</span>
        </>
    );

    if (to && !disabled) {
        return (
            <Link to={to} className={className} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} className={className} disabled={disabled} onClick={onClick}>
            {content}
        </button>
    );
};

export default Button;
