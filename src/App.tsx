import type { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/pub/layout/Layout';
import { ROUTES } from './constants';
import Guide from './pages/pub/Guide';
import Ia from './pages/pub/Ia';
import Splash from './pages/pub/Splash';
import Login from './pages/pub/Login';
import PasswordFind from './pages/pub/PasswordFind';
import PasswordReset from './pages/pub/PasswordReset';
import Signup from './pages/pub/Signup';
import Home from './pages/pub/Home';
import RaceList from './pages/pub/RaceList';

// 라우팅 / 최상위 구성 (docs/design.md 1.1.1)
// - /ia, /guide: Layout을 적용하지 않는 독립 관리 페이지 (AGENTS.md 6.3, 6.4)
// - TabLayout: 탭 루트 화면, BottomBar 표시
// - PageLayout: 그 외 화면, BottomBar 없음
// - element가 null인 경로는 아직 화면을 만들지 않은 경로입니다. 화면을 구현하면 페이지 컴포넌트로 바꾸고 IA 상태도 갱신합니다.

interface PageRoute {
    path: string;
    element: ReactNode;
}

const TAB_ROUTES: PageRoute[] = [
    { path: ROUTES.home, element: <Home /> }, // MY3
    { path: ROUTES.raceList, element: <RaceList /> }, // RA1
    { path: ROUTES.tracker, element: null } // TR1, TR1.1
];

const PAGE_ROUTES: PageRoute[] = [
    /* ME 회원 */
    { path: ROUTES.splash, element: <Splash /> }, // MY1
    { path: ROUTES.login, element: <Login /> }, // ME1
    { path: ROUTES.passwordFind, element: <PasswordFind /> }, // ME1.1, ME1.2
    { path: ROUTES.passwordReset, element: <PasswordReset /> }, // ME1.3, ME1.4
    { path: ROUTES.signup, element: <Signup /> }, // ME2, ME2.1
    { path: ROUTES.signupTerms, element: null }, // ME2.2.1 ~ ME2.3
    { path: ROUTES.signupComplete, element: null }, // ME2.4

    /* MY 홈/마이 */
    { path: ROUTES.my, element: null }, // MY3.1
    { path: ROUTES.profile, element: null }, // MY3.1.1
    { path: ROUTES.settings, element: null }, // MY3.1.2 ~ MY3.1.2.6
    { path: ROUTES.withdraw, element: null }, // MY3.1.2.3
    { path: ROUTES.coupons, element: null }, // MY3.1.2.8
    { path: ROUTES.records, element: null }, // MY3.1.3
    { path: ROUTES.recordDetail, element: null }, // MY3.1.4
    { path: ROUTES.recordSubmit, element: null }, // MY3.1.5, MY3.1.7
    { path: ROUTES.raceRecordDetail, element: null }, // MY3.1.6
    { path: ROUTES.notifications, element: null }, // MY3.2

    /* RA 레이스 */
    { path: ROUTES.raceDetail, element: null }, // RA2
    { path: ROUTES.raceApply, element: null }, // RA3 ~ RA3.5
    { path: ROUTES.raceApplyComplete, element: null }, // RA3.6
    { path: ROUTES.raceApplication, element: null }, // RA4

    /* TR 트래커 */
    { path: ROUTES.trackerTraining, element: null }, // TR1.2
    { path: ROUTES.trackerRace, element: null }, // TR1.3
    { path: ROUTES.betaFeedback, element: null }, // TR2

    /* CO 공통 */
    { path: ROUTES.error, element: null } // CO2.5
];

// GitHub Pages(/runable-react/)에서도 같은 경로로 동작하도록 빌드 base를 라우터 basename으로 사용
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');

const App = () => {
    return (
        <BrowserRouter basename={ROUTER_BASENAME}>
            <Routes>
                <Route path={ROUTES.ia} element={<Ia />} />
                <Route path={ROUTES.guide} element={<Guide />} />

                {/* TabLayout: BottomBar 표시 */}
                <Route element={<Layout hasBottomBar />}>
                    {TAB_ROUTES.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>

                {/* PageLayout: BottomBar 없음 */}
                <Route element={<Layout />}>
                    {PAGE_ROUTES.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
