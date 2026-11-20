import loadingRunable from '../../../assets/images/loadingRunable.gif';

// 로딩 표시 (Figma: CO 로딩) — docs/design.md 2장, 6.0
// - 흰 화면 가운데 80px 로딩 애니메이션(runable_loading.gif 원본)
// - 화면 전체를 덮으며(position fixed), 화면 읽기 프로그램에는 label을 읽어 줍니다.
// - 보여 줄지 여부는 페이지가 정합니다. 예) {isLoading && <Loading />}

interface LoadingProps {
    label?: string;
}

const Loading = ({ label = '불러오는 중입니다' }: LoadingProps) => {
    return (
        <div className="loading" role="status" aria-live="polite">
            <img src={loadingRunable} alt="" className="loadingImage" />
            <span className="blind">{label}</span>
        </div>
    );
};

export default Loading;
