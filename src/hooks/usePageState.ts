import { useSearchParams } from 'react-router-dom';
import type { Platform } from '../types';

// 상태별 화면 전환 훅 (docs/design.md 4장, 9장 / docs/requirements.md 4장)
// - URL 쿼리로 시안의 상태별 화면을 바로 열 수 있게 합니다. 예) /login?state=error&platform=aos, /races/apply?step=3
// - state: 페이지마다 유니온 타입으로 정의한 상태값. 목록에 없는 값이면 defaultState
// - platform: 'ios' | 'aos'. 그 외 값이면 'ios'
// - step: 1 ~ stepCount 정수. 범위를 벗어나면 1
// - 기본값으로 바꾸면 해당 쿼리를 지웁니다.
// - setState는 브라우저 기록을 쌓지 않고(replace), setStep은 기록을 쌓아 뒤로가기로 이전 단계로 돌아갑니다.

const QUERY_KEY = {
    state: 'state',
    platform: 'platform',
    step: 'step'
} as const;

const DEFAULT_PLATFORM: Platform = 'ios';

interface UsePageStateOptions<T extends string> {
    states: readonly T[];
    defaultState: T;
    stepCount?: number;
}

const usePageState = <T extends string>({ states, defaultState, stepCount = 1 }: UsePageStateOptions<T>) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawState = searchParams.get(QUERY_KEY.state);
    const state = states.find((item) => item === rawState) ?? defaultState;

    const platform: Platform = searchParams.get(QUERY_KEY.platform) === 'aos' ? 'aos' : DEFAULT_PLATFORM;

    const rawStep = Number(searchParams.get(QUERY_KEY.step));
    const step = Number.isInteger(rawStep) && rawStep >= 1 && rawStep <= stepCount ? rawStep : 1;

    const updateQuery = (key: string, value: string | null, replace: boolean) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (value === null) {
                    next.delete(key);
                } else {
                    next.set(key, value);
                }
                return next;
            },
            { replace }
        );
    };

    const setState = (nextState: T) => {
        updateQuery(QUERY_KEY.state, nextState === defaultState ? null : nextState, true);
    };

    const setStep = (nextStep: number) => {
        const safeStep = Math.min(Math.max(Math.trunc(nextStep), 1), stepCount);
        updateQuery(QUERY_KEY.step, safeStep === 1 ? null : String(safeStep), false);
    };

    return { state, platform, step, setState, setStep };
};

export default usePageState;
