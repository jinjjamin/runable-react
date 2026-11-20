import type { RunningRecord } from '../../../types';
import formatDate from '../../../utils/formatDate';

// 러닝 기록 카드 (Figma: _Card, 홈 러닝 기록·트레이닝 기록) — docs/design.md 2장, 6.0
// - 흰 카드 radius 8 + Elevation 2, 제목 18/26 Bold, 날짜 B2 Gray-500, 거리·시간·페이스 3칸 16/24
// - 대회 기록이면 제목 위에 대회명 깃발(raceName)을 표시합니다.

interface RecordCardProps {
    record: RunningRecord;
}

const formatDistance = (distanceKm: number) => `${distanceKm.toFixed(2).padStart(5, '0')}km`;

const RecordCard = ({ record }: RecordCardProps) => {
    return (
        <article className={record.raceName ? 'recordCard hasFlag' : 'recordCard'}>
            <div className="recordCardHead">
                {record.raceName && <span className="recordCardFlag">{record.raceName}</span>}
                <h3 className="recordCardTitle">{record.title}</h3>
                <p className="recordCardDate">{formatDate(record.date)}</p>
            </div>
            <dl className="recordCardData">
                <div>
                    <dt className="blind">거리</dt>
                    <dd>{formatDistance(record.distanceKm)}</dd>
                </div>
                <div>
                    <dt className="blind">시간</dt>
                    <dd>{record.duration}</dd>
                </div>
                <div>
                    <dt className="blind">페이스</dt>
                    <dd>{record.pace}</dd>
                </div>
            </dl>
        </article>
    );
};

export default RecordCard;
