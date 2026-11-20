import type { Race } from '../types';
import raceJtbcSeoul from '../assets/images/raceJtbcSeoul.jpg';
import raceHangang from '../assets/images/raceHangang.jpg';
import raceSheRunsSeoul from '../assets/images/raceSheRunsSeoul.jpg';

// 레이스(대회) 목록(RA1) 목업 데이터 — Figma RA1-대회 목록 시안 문구 기준
// - 목록 정렬(참가신청 시작일 순, 관리자 순서)은 실제 데이터 단계에서 처리하며, 여기서는 시안 순서를 그대로 둡니다.
// - 신청 가능한 레이스 건수는 시안 예시 값(3건)입니다.

export const RACE_LIST_USER_NAME = '김러너';
export const RACE_LIST_AVAILABLE_COUNT = 3;

export const RACE_LIST: Race[] = [
    {
        id: 'jtbc2021',
        title: '2021 JTBC 서울 마라톤',
        startDate: '2021-11-07',
        endDate: '2021-11-10',
        distances: ['2K', '4K', '6K', '8K', '9K', '12K', '14K', '16K', 'Half', 'Full'],
        status: 'open',
        image: raceJtbcSeoul,
        applyDeadline: '12/12'
    },
    { id: 'hangang2021-upcoming', title: '2021 한강 마라톤', startDate: '2021-11-07', endDate: '2021-11-10', distances: ['7K', '10K'], status: 'upcoming', image: raceHangang },
    { id: 'sheruns2021', title: '2021 한강 마라톤', startDate: '2021-11-07', endDate: '2021-11-10', distances: ['7K', '10K'], status: 'closed', image: raceSheRunsSeoul },
    { id: 'hangang2021-finished', title: '2021 한강 마라톤', startDate: '2021-11-07', endDate: '2021-11-10', distances: ['7K', '10K'], status: 'finished', image: raceHangang }
];
