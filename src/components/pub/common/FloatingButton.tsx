import { Link } from 'react-router-dom';
import iconArrowRight from '../../../assets/icons/iconArrowRight.svg';
import iconPlus from '../../../assets/icons/iconPlus.svg';

// 둥근 작은 버튼 (Figma: Floating Button) — docs/design.md 2장, 6.0
// - 높이 42, 모서리 40, 흰 배경 + Elevation 2 그림자, 글자 12px Bold Primary-500
// - type: move(라벨 + 오른쪽 화살표, 예: 전체 레이스 리스트 보러가기) / plus(+ 아이콘 + 라벨, 예: 더보기)
// - to를 넘기면 화면 이동 링크(<a>)로, 아니면 <button>으로 렌더링합니다.

interface FloatingButtonProps {
    label: string;
    type?: 'move' | 'plus';
    to?: string;
    onClick?: () => void;
}

const FloatingButton = ({ label, type = 'move', to, onClick }: FloatingButtonProps) => {
    const className = `floatingBtn ${type}`;

    const content = type === 'plus' ? (
        <>
            <img src={iconPlus} alt="" className="floatingBtnIcon" />
            <span>{label}</span>
        </>
    ) : (
        <>
            <span>{label}</span>
            <img src={iconArrowRight} alt="" className="floatingBtnIcon" />
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

export default FloatingButton;
