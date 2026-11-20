import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import usePageState from '../../hooks/usePageState';
import { ROUTES } from '../../constants';
import logoRunableSplash from '../../assets/images/logoRunableSplash.svg';
import logoRunable from '../../assets/images/logoRunable.svg';

// 스플래시 /splash (Figma MY1-스플래시_01, MY1-스플래시_02인트로) — docs/requirements.md US-04
// - 앱 구동 시 표시: 로고(01) → 인트로(02) → 홈으로 이동
// - /splash: 위 순서를 자동으로 진행합니다 (각 1.5초, 시안에 시간 정보가 없어 정한 값).
// - /splash?state=logo, /splash?state=intro: 해당 화면에서 멈춥니다 (IA 확인용).

const SPLASH_STATES = ['logo', 'intro'] as const;
type SplashState = (typeof SPLASH_STATES)[number];

const STEP_DURATION = 1500;

const Splash = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { state } = usePageState<SplashState>({ states: SPLASH_STATES, defaultState: 'logo' });
    const [autoState, setAutoState] = useState<SplashState>('logo');

    const isAutoPlay = !searchParams.has('state');
    const currentState = isAutoPlay ? autoState : state;

    useEffect(() => {
        if (!isAutoPlay) return undefined;

        const timer = window.setTimeout(() => {
            if (autoState === 'logo') {
                setAutoState('intro');
                return;
            }
            navigate(ROUTES.home, { replace: true });
        }, STEP_DURATION);

        return () => window.clearTimeout(timer);
    }, [isAutoPlay, autoState, navigate]);

    return (
        <div className={`splash ${currentState}`}>
            <h1 className="blind">러너블</h1>
            {currentState === 'logo' ? (
                <img src={logoRunableSplash} alt="" className="splashLogo" />
            ) : (
                <img src={logoRunable} alt="" className="splashIntroLogo" />
            )}
        </div>
    );
};

export default Splash;
