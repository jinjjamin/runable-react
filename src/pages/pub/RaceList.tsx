import Header from '../../components/pub/layout/Header';
import RaceCard from '../../components/pub/race/RaceCard';
import { RACE_LIST, RACE_LIST_AVAILABLE_COUNT, RACE_LIST_USER_NAME } from '../../data/raceData';
import bgRaceListHeader from '../../assets/images/bgRaceListHeader.svg';

// 레이스(대회) 목록 /races (Figma RA1-대회 목록) — docs/requirements.md US-07
// - 파란 Top Bar(프로필) + 파란 사선 배경(360×242, Figma 원본) 위 안내 문구 + 대회 카드 목록
// - 카드 깃발·버튼은 RaceCard image(진행예정, 접수중, 신청마감, 마감). [참가신청] → 참가신청 1단계(RA3)

const RaceList = () => {
    return (
        <div className="raceList">
            <Header title="레이스" type="home" isPrimary />
            <div className="raceListContents">
                <img src={bgRaceListHeader} alt="" className="raceListBg" />
                <p className="raceListMessage">
                    {RACE_LIST_USER_NAME}님을 위한<br />
                    {RACE_LIST_AVAILABLE_COUNT}건의 레이스가 있어요
                </p>
                <ul className="raceListCards">
                    {RACE_LIST.map((race) => (
                        <li key={race.id}>
                            <RaceCard variant="image" race={race} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RaceList;
