import type { MyRace, Race, RunningRecord } from '../types';
import raceJtbcSeoul from '../assets/images/raceJtbcSeoul.jpg';

// 홈(MY3) 목업 데이터 — Figma MY3-홈_01최소 / 02최대 시안 문구 기준
// - 시안의 날짜·D-day 값은 예시 값이라 계산하지 않고 그대로 둡니다.

export const HOME_USER_NAME = '김러너';

const WOMAN_RACE: MyRace = {
    id: 'womanVirtual2021',
    title: '2021 Woman’s Virtual Race',
    startDate: '2021-11-05',
    endDate: '2021-11-08',
    distances: ['Half'],
    status: 'ongoing',
    dDay: 0,
    myDistance: 'Half'
};

const JTBC_DISTANCES = ['2K', '4K', '6K', '8K', '9K', '12K', '14K', '16K', 'Half', 'Full'];

export const MY_RACES_MAX: MyRace[] = [
    WOMAN_RACE,
    { id: 'jtbc2021-7k', title: '2021 JTBC 서울 마라톤', startDate: '2021-11-05', endDate: '2021-11-08', distances: JTBC_DISTANCES, status: 'upcoming', dDay: 15, myDistance: '7K' },
    { id: 'jtbc2021-10k', title: '2021 JTBC 서울 마라톤', startDate: '2021-11-05', endDate: '2021-11-08', distances: JTBC_DISTANCES, status: 'upcoming', dDay: 15, myDistance: '10K' }
];

export const MY_RACES_MIN: MyRace[] = [WOMAN_RACE];

export const OPEN_RACES: Race[] = [
    { id: 'jtbc2021', title: '2021 JTBC 서울 마라톤', startDate: '2021-11-07', endDate: '2021-11-10', distances: JTBC_DISTANCES, status: 'open', image: raceJtbcSeoul, applyDeadline: '12/12' },
    { id: 'jtbc2021-2', title: '2021 JTBC 서울 마라톤', startDate: '2021-11-07', endDate: '2021-11-10', distances: JTBC_DISTANCES, status: 'open', image: raceJtbcSeoul, applyDeadline: '12/12' }
];

// 참여 가능한 대회가 없을 때 흐리게 보여 주는 마감 대회 (01최소)
export const LAST_CLOSED_RACE: Race = {
    id: 'jtbc2021-closed',
    title: '2021 JTBC 서울 마라톤',
    startDate: '2021-11-07',
    endDate: '2021-11-10',
    distances: ['7K', '10K'],
    status: 'finished',
    image: raceJtbcSeoul
};

export const RECENT_RECORDS: RunningRecord[] = [
    { id: 'record1111', title: '11월 11일 월요일 달리기', date: '2021-11-11 12:00', distanceKm: 0, duration: '00:00:00', pace: '00\'00"' },
    { id: 'record1112', title: '11월 12일 화요일 달리기', date: '2021-11-12 12:00', distanceKm: 0, duration: '00:00:00', pace: '00\'00"' },
    { id: 'record1113', title: '11월 13일 수요일 달리기', date: '2021-11-13 12:00', distanceKm: 0, duration: '00:00:00', pace: '00\'00"', raceName: '2021 ELLE RUN' }
];
