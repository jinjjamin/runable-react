import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import iconArrowLeft from '../../../assets/icons/iconArrowLeft.svg';
import iconClose from '../../../assets/icons/iconClose.svg';
import iconProfile from '../../../assets/icons/iconProfile.svg';

// 화면 상단 바 Header (Figma: Top Bar) — docs/design.md 1.2, 6.0
// - back: [뒤로가기] [페이지명] [오른쪽 영역]   예) 내 정보, 설정, 회원탈퇴
// - close: [페이지명] [오른쪽 영역] [닫기]      예) 약관·라이선스 안내
// - home:  [프로필(마이페이지)] ... [오른쪽 영역] 예) 홈. 페이지명은 화면에 보이지 않는 h1 (Figma Top Bar Type Home)
// - isPrimary: Primary-500 파란 배경 (예: 레이스 목록 RA1)
// - 버튼을 누르면 기본으로 이전 화면으로 이동하고, onButtonClick을 넘기면 그 동작을 사용합니다.

interface HeaderProps {
    title: string;
    type?: 'back' | 'close' | 'home';
    onButtonClick?: () => void;
    rightSlot?: ReactNode;
    isPrimary?: boolean;
}

const Header = ({ title, type = 'back', onButtonClick, rightSlot, isPrimary = false }: HeaderProps) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
            return;
        }
        navigate(-1);
    };

    return (
        <header id="header" className={['topBar', type === 'home' ? 'isHome' : '', isPrimary ? 'isPrimary' : ''].filter(Boolean).join(' ')}>
            {type === 'back' && (
                <button type="button" className="topBarButton" aria-label="뒤로 가기" onClick={handleButtonClick}>
                    <img src={iconArrowLeft} alt="" />
                </button>
            )}
            {type === 'home' && (
                <Link to={ROUTES.my} className="topBarButton" aria-label="마이페이지">
                    <img src={iconProfile} alt="" />
                </Link>
            )}
            <h1 className={type === 'home' ? 'topBarTitle blind' : 'topBarTitle'}>{title}</h1>
            {rightSlot && <div className="topBarSide">{rightSlot}</div>}
            {type === 'close' && (
                <button type="button" className="topBarButton" aria-label="닫기" onClick={handleButtonClick}>
                    <img src={iconClose} alt="" />
                </button>
            )}
        </header>
    );
};

export default Header;
