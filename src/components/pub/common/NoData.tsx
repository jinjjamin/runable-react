import type { ReactNode } from 'react';
import iconNodata from '../../../assets/icons/iconNodata.svg';

// 데이터가 없을 때 안내 (Figma: Nodata) — docs/design.md 2장, 6.0
// - variant box(기본): 회색 둥근 상자 (예: 홈 러닝 기록 없음). 312px, radius 12, padding 32 20 36, 문구 B2 Gray-700
// - variant section: 너비 전체 회색 영역 (예: 내 정보 레이스 기록 없음). 문구 C0 검정
// - action: 문구 아래 버튼·링크 (예: <TextLink hasArrow />, <FloatingButton />)

interface NoDataProps {
    message: ReactNode;
    variant?: 'box' | 'section';
    action?: ReactNode;
}

const NoData = ({ message, variant = 'box', action }: NoDataProps) => {
    return (
        <div className={`noData ${variant}`}>
            <img src={iconNodata} alt="" className="noDataIcon" />
            <div className="noDataText">
                <p className="noDataMessage">{message}</p>
                {action && <div className="noDataAction">{action}</div>}
            </div>
        </div>
    );
};

export default NoData;
