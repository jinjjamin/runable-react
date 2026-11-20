import { Outlet } from 'react-router-dom';
import BottomBar from './BottomBar';
import '../../../assets/css/common.css';

// 일반 퍼블리싱 페이지 공통 레이아웃 — docs/design.md 1.1, 1.2
// - <div id="siteWrap" class="siteScope"> 안에 <main id="container">와 BottomBar를 배치합니다.
// - Header는 화면마다 제목·버튼이 달라 각 페이지가 <main> 안에서 직접 렌더링합니다.
// - hasBottomBar: 탭 루트 화면(TabLayout)은 true, 그 외(PageLayout)는 false

interface LayoutProps {
    hasBottomBar?: boolean;
}

const Layout = ({ hasBottomBar = false }: LayoutProps) => {
    return (
        <div id="siteWrap" className="siteScope">
            <main id="container">
                <Outlet />
            </main>
            {hasBottomBar && <BottomBar />}
        </div>
    );
};

export default Layout;
