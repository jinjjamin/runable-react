import { Link } from 'react-router-dom';
import usePageState from '../../hooks/usePageState';
import { ROUTES } from '../../constants';
import {
    HOME_USER_NAME,
    LAST_CLOSED_RACE,
    MY_RACES_MAX,
    MY_RACES_MIN,
    OPEN_RACES,
    RECENT_RECORDS
} from '../../data/homeData';
import Header from '../../components/pub/layout/Header';
import FloatingButton from '../../components/pub/common/FloatingButton';
import NoData from '../../components/pub/common/NoData';
import TextLink from '../../components/pub/common/TextLink';
import Slider from '../../components/pub/common/Slider';
import RaceCard from '../../components/pub/race/RaceCard';
import RecordCard from '../../components/pub/my/RecordCard';
import iconAlarm from '../../assets/icons/iconAlarm.svg';
import iconAlarmNew from '../../assets/icons/iconAlarmNew.svg';
import iconGoWhite from '../../assets/icons/iconGoWhite.svg';
import shapeButtonEdge from '../../assets/images/shapeButtonEdge.svg';

// 홈 / (Figma MY3-홈_01최소, MY3-홈_02최대) — docs/requirements.md US-04
// - 기본: 02최대 (대회 종료 메시지 + 결과 버튼, 신청 대회 3개 + 더 보기, 참여가능 레이스 슬라이드, 러닝 기록 3개, 새 알림)
// - ?state=min: 01최소 (접수 중 메시지, 신청 대회 1개, 참여 가능 대회 없음(마감 대회 흐리게 + 전체 리스트 버튼), 러닝 기록 노데이터)
// - 타이틀 메시지 문구·버튼 노출 기준은 정책서 참고(시안 설명 3)라, 시안 두 가지 문구를 그대로 사용합니다.

type HomeState = 'default' | 'min';

const HOME_STATES: readonly HomeState[] = ['default', 'min'];

const Home = () => {
    const { state } = usePageState<HomeState>({ states: HOME_STATES, defaultState: 'default' });
    const isMin = state === 'min';

    const myRaces = isMin ? MY_RACES_MIN : MY_RACES_MAX;
    const records = isMin ? [] : RECENT_RECORDS;
    const hasNewAlarm = !isMin;

    return (
        <div className="home">
            <Header
                title="홈"
                type="home"
                rightSlot={(
                    <Link to={ROUTES.notifications} className="topBarButton" aria-label={hasNewAlarm ? '알림 (새 알림 있음)' : '알림'}>
                        <img src={hasNewAlarm ? iconAlarmNew : iconAlarm} alt="" />
                    </Link>
                )}
            />

            <section className="homeTop" aria-label="안내 메시지">
                {isMin ? (
                    <p className="homeMessage">
                        접수 중인<br />
                        <em className="homeMessagePoint">버추얼 레이스</em>가 있습니다,<br />
                        레이스 정보를 확인해보세요.
                    </p>
                ) : (
                    <>
                        <p className="homeMessage">
                            우먼스 버추얼 마라톤이<br />
                            <em className="homeMessagePoint">종료</em>되었습니다.<br />
                            레이스 결과를 확인해보세요.
                        </p>
                        <Link to={ROUTES.my} className="homeMessageButton">
                            <span className="homeMessageButtonText">
                                레이스 결과 보러가기
                                <img src={iconGoWhite} alt="" />
                            </span>
                            <img src={shapeButtonEdge} alt="" className="homeMessageButtonEdge" />
                        </Link>
                    </>
                )}
            </section>

            <section className="homeSection" aria-labelledby="homeMyRaceTitle">
                <h2 className="homeSectionTitle" id="homeMyRaceTitle">{HOME_USER_NAME}님의 레이스</h2>
                <div className="homeMyRace">
                    <ul className="homeCardList">
                        {myRaces.map((race) => (
                            <li key={race.id}>
                                <RaceCard variant="dday" race={race} />
                            </li>
                        ))}
                    </ul>
                    {!isMin && <FloatingButton label="더 보기" type="plus" to={ROUTES.my} />}
                </div>
            </section>

            <section className="homeSection isOpenRace" aria-labelledby="homeOpenRaceTitle">
                <div className="homeSectionHead">
                    <h2 className="homeSectionTitle" id="homeOpenRaceTitle">참여가능 레이스</h2>
                    {isMin && <p className="homeSectionDesc">현재 참여 가능한 레이스가 없습니다</p>}
                </div>
                {isMin ? (
                    <div className="homeOpenEmpty">
                        <div className="homeOpenEmptyCard" inert>
                            <RaceCard variant="image" race={LAST_CLOSED_RACE} />
                        </div>
                        <div className="homeOpenEmptyDim">
                            <FloatingButton label="전체 레이스 리스트 보러가기" to={ROUTES.raceList} />
                        </div>
                    </div>
                ) : (
                    <Slider
                        items={OPEN_RACES}
                        getKey={(race) => race.id}
                        renderItem={(race) => <RaceCard variant="image" race={race} />}
                        ariaLabel="참여가능 레이스 목록"
                    />
                )}
            </section>

            <section className="homeSection" aria-labelledby="homeRecordTitle">
                <h2 className="homeSectionTitle" id="homeRecordTitle">{HOME_USER_NAME}님의 러닝 기록</h2>
                {records.length > 0 ? (
                    <ul className="homeCardList">
                        {records.map((record) => (
                            <li key={record.id}>
                                <RecordCard record={record} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <NoData
                        message="러닝 기록이 없네요, 한 번 달려볼까요?"
                        action={<TextLink label="트래커 바로가기" size="s" hasArrow to={ROUTES.tracker} />}
                    />
                )}
            </section>
        </div>
    );
};

export default Home;
