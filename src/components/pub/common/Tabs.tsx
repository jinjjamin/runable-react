import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { TabItem } from '../../../types';
import getTabIds from '../../../utils/getTabIds';

// 탭 (Figma: Tab, Type Tab 02~04) — docs/design.md 2장, 6.0
// - 높이 60 = 위 여백 16 + 탭(글자 H4 + 간격 16 + 밑줄 4), 좌우 여백 24, 맨 아래 1px Gray-50 구분선
// - 활성: 검정 글자 + Primary-500 밑줄 / 비활성: Gray-300 글자
// - 접근성: role="tablist"/"tab", aria-selected, aria-controls. ←/→/Home/End로 탭 이동·선택(포커스한 탭이 바로 선택됨)
// - 탭 내용은 페이지가 그립니다. 내용 영역에는 getTabIds(idPrefix, id).panelId를 id로,
//   role="tabpanel", aria-labelledby={tabId}를 붙입니다.

interface TabsProps {
    items: TabItem[];
    activeId: string;
    onChange: (id: string) => void;
    idPrefix: string;
    ariaLabel: string;
}

const Tabs = ({ items, activeId, onChange, idPrefix, ariaLabel }: TabsProps) => {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const moveTo = (index: number) => {
        const nextIndex = (index + items.length) % items.length;
        onChange(items[nextIndex].id);
        tabRefs.current[nextIndex]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const keyActions: Record<string, () => void> = {
            ArrowRight: () => moveTo(index + 1),
            ArrowLeft: () => moveTo(index - 1),
            Home: () => moveTo(0),
            End: () => moveTo(items.length - 1)
        };
        const action = keyActions[event.key];
        if (action) {
            event.preventDefault();
            action();
        }
    };

    return (
        <div className="tabs">
            <div className="tabList" role="tablist" aria-label={ariaLabel}>
                {items.map((item, index) => {
                    const isActive = item.id === activeId;
                    const { tabId, panelId } = getTabIds(idPrefix, item.id);
                    return (
                        <button
                            key={item.id}
                            ref={(element) => {
                                tabRefs.current[index] = element;
                            }}
                            id={tabId}
                            type="button"
                            role="tab"
                            className={isActive ? 'tab on' : 'tab'}
                            aria-selected={isActive}
                            aria-controls={panelId}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onChange(item.id)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Tabs;
