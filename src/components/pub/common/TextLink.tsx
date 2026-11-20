import { Link } from 'react-router-dom';
import iconChevronRight from '../../../assets/icons/iconChevronRight.svg';

// 밑줄 글자 링크 (Figma: Link, Size Small / Medium) — docs/design.md 2장, 6.0
// - size m: 14px Gray-700 (예: 로그인의 비밀번호 재설정)
// - size s: 12px Gray-900 (예: 노데이터의 트래커 바로가기)
// - hasArrow: 오른쪽 16px 화살표 (Figma Icon_16 / Arrow, 링크 밖 아이콘)
// - to를 넘기면 화면 이동 링크(<a>), 아니면 <button>으로 렌더링합니다.

interface TextLinkProps {
    label: string;
    size?: 's' | 'm';
    hasArrow?: boolean;
    to?: string;
    onClick?: () => void;
}

const TextLink = ({ label, size = 'm', hasArrow = false, to, onClick }: TextLinkProps) => {
    const className = size === 's' ? 'textLink sizeS' : 'textLink';

    const content = (
        <>
            <span className="textLinkLabel">{label}</span>
            {hasArrow && <img src={iconChevronRight} alt="" className="textLinkArrow" />}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={className} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" className={className} onClick={onClick}>
            {content}
        </button>
    );
};

export default TextLink;
