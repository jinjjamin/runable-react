// 탭과 탭 내용 영역의 id를 만듭니다 (Tabs 컴포넌트와 페이지가 같은 규칙을 쓰도록 공용 함수로 둡니다).
// 예) getTabIds('raceDetail', 'overview') → { tabId: 'raceDetailTaboverview', panelId: 'raceDetailPaneloverview' }

const getTabIds = (idPrefix: string, itemId: string) => ({
    tabId: `${idPrefix}Tab${itemId}`,
    panelId: `${idPrefix}Panel${itemId}`
});

export default getTabIds;
