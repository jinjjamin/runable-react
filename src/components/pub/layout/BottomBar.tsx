import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import iconTabHomeOff from '../../../assets/icons/iconTabHomeOff.svg';
import iconTabHomeOn from '../../../assets/icons/iconTabHomeOn.svg';
import iconTabRaceOff from '../../../assets/icons/iconTabRaceOff.svg';
import iconTabRaceOn from '../../../assets/icons/iconTabRaceOn.svg';
import iconTabTrackerOff from '../../../assets/icons/iconTabTrackerOff.svg';
import iconTabTrackerOn from '../../../assets/icons/iconTabTrackerOn.svg';

// 하단 탭바 (Figma: Bottom Bar) — docs/design.md 1.2, 6.0
// - 탭 루트 화면(홈, 대회 목록, 트래커 메인)에서만 Layout이 표시합니다.
// - 현재 경로와 같은 탭이 활성(on)이 되며, 활성 탭에는 aria-current="page"가 붙습니다 (NavLink 기본 동작).

interface BottomBarItem {
    to: string;
    label: string;
    iconOn: string;
    iconOff: string;
}

const BOTTOM_BAR_ITEMS: BottomBarItem[] = [
    { to: ROUTES.home, label: '홈', iconOn: iconTabHomeOn, iconOff: iconTabHomeOff },
    { to: ROUTES.raceList, label: '레이스', iconOn: iconTabRaceOn, iconOff: iconTabRaceOff },
    { to: ROUTES.tracker, label: '트래커', iconOn: iconTabTrackerOn, iconOff: iconTabTrackerOff }
];

const BottomBar = () => {
    return (
        <footer id="footer" className="bottomBar">
            <nav aria-label="주요 메뉴">
                <ul className="bottomBarList">
                    {BOTTOM_BAR_ITEMS.map((item) => (
                        <li key={item.to} className="bottomBarItem">
                            <NavLink
                                to={item.to}
                                end={item.to === ROUTES.home}
                                className={({ isActive }) => (isActive ? 'bottomBarLink on' : 'bottomBarLink')}
                            >
                                {({ isActive }) => (
                                    <>
                                        <img src={isActive ? item.iconOn : item.iconOff} alt="" />
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </footer>
    );
};

export default BottomBar;
