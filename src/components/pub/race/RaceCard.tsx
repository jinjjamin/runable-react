import { Link } from 'react-router-dom';
import type { MyRace, Race, RaceStatus } from '../../../types';
import { ROUTES } from '../../../constants';
import formatDate from '../../../utils/formatDate';
import Button from '../common/Button';
import iconRace from '../../../assets/icons/iconRace.svg';
import iconRaceWhite from '../../../assets/icons/iconRaceWhite.svg';
import iconTime from '../../../assets/icons/iconTime.svg';
import iconTimeWhite from '../../../assets/icons/iconTimeWhite.svg';
import iconTimeOffWhite from '../../../assets/icons/iconTimeOffWhite.svg';

// 대회 카드 (Figma: _Card) — docs/design.md 2장, 6.0
// - variant dday: 내가 신청한 대회 (90×90 D-day 칸 + 정보). D-DAY는 파란 카드, 그 외는 흰 카드 + 그림자
//   D-00 카드 → 트래커 메인, D-DAY 카드 → 대회 트래커(TR1.3)로 이동 (홈 설명 4)
// - variant image: 참여 가능 대회 (이미지 312×180 + 접수 깃발 + 정보 + 버튼)
//   깃발·버튼은 RA1 "레이스 Card Module 케이스" 기준 (아래 FLAGS). 참가 신청 버튼은 접수중(open)에만 표시
//   마감(finished)은 이미지 위 검정 60% (Figma Image 채우기 #000000 60%)

const DdayCard = ({ race }: { race: MyRace }) => {
    const isToday = race.dDay === 0;
    const dDayLabel = isToday ? 'D-DAY' : `D-${race.dDay}`;

    return (
        <Link to={isToday ? ROUTES.trackerRace : ROUTES.tracker} className={isToday ? 'raceCard dday isToday' : 'raceCard dday'}>
            <span className="raceCardDay">
                <span className="raceCardDayLabel">{dDayLabel}</span>
                <span className="raceCardDivider" aria-hidden="true" />
            </span>
            <span className="raceCardInfo">
                <span className="raceCardDate">{formatDate(race.startDate)} - {formatDate(race.endDate)}</span>
                <strong className="raceCardTitle">{race.title}</strong>
                <span className="raceCardDistance">
                    <img src={isToday ? iconRaceWhite : iconRace} alt="" />
                    {race.myDistance}
                </span>
            </span>
        </Link>
    );
};

interface FlagStyle {
    label: string;
    icon: string;
    className: string;
}

// 진행예정: 흰 깃발 + 파란 시계 / 접수중: 파란 깃발 + 흰 시계 (+ ~마감일) / 신청마감·마감: 검정 깃발 + 줄 그은 시계
// ongoing(대회 진행 중)은 카드 모듈 케이스에 없어 진행예정 모양에 "진행중" 문구로 둡니다.
const FLAGS: Record<RaceStatus, FlagStyle> = {
    upcoming: { label: '진행예정', icon: iconTime, className: 'isUpcoming' },
    ongoing: { label: '진행중', icon: iconTime, className: 'isUpcoming' },
    open: { label: '접수중', icon: iconTimeWhite, className: '' },
    closed: { label: '신청마감', icon: iconTimeOffWhite, className: 'isClosed' },
    finished: { label: '마감', icon: iconTimeOffWhite, className: 'isClosed' }
};

const ImageCard = ({ race }: { race: Race }) => {
    const isOpen = race.status === 'open';
    const flag = FLAGS[race.status];

    return (
        <article className={race.status === 'finished' ? 'raceCard image isFinished' : 'raceCard image'}>
            <div className="raceCardThumb">
                {race.image && <img src={race.image} alt="" className="raceCardImage" />}
                <p className="raceCardFlag">
                    <span className={['raceCardFlagStatus', flag.className].filter(Boolean).join(' ')}>
                        <img src={flag.icon} alt="" />
                        {flag.label}
                    </span>
                    {isOpen && race.applyDeadline && <span className="raceCardFlagDate">~{race.applyDeadline}</span>}
                </p>
            </div>
            <div className="raceCardBody">
                <div className="raceCardInfo">
                    <div>
                        <p className="raceCardDate">{formatDate(race.startDate)} ~ {formatDate(race.endDate)}</p>
                        <h3 className="raceCardTitle">{race.title}</h3>
                    </div>
                    <p className="raceCardDistance">
                        <img src={iconRace} alt="" />
                        <span>{race.distances.join(' / ')}</span>
                    </p>
                </div>
                <div className="buttonGroup">
                    <Button label="자세히 보기" variant="secondary" size="m" to={ROUTES.raceDetail} />
                    {isOpen && <Button label="참가 신청" size="m" to={ROUTES.raceApply} />}
                </div>
            </div>
        </article>
    );
};

type RaceCardProps = { variant: 'dday'; race: MyRace } | { variant: 'image'; race: Race };

const RaceCard = (props: RaceCardProps) => {
    if (props.variant === 'dday') return <DdayCard race={props.race} />;
    return <ImageCard race={props.race} />;
};

export default RaceCard;
