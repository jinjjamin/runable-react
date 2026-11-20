import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import Button from './Button';

// 하단 바텀시트 팝업 (Figma: Dialog, Type Bottomsheet) — docs/design.md 2장, 5장, 6.0
// - 구성: 제목(H2) / 설명(B2 Gray-900, <em>은 Primary-500 강조) / 회색 부가 문구(C0) / 추가 내용(children) / 버튼 1~2개
// - 버튼: primaryButton(오른쪽, primary)은 필수, secondaryButton(왼쪽, secondary)은 선택
// - 닫기: Dim 클릭, ESC. 열리면 팝업으로 포커스를 옮기고 Tab은 팝업 안에서만 이동하며, 닫히면 연 요소로 포커스를 되돌립니다.
// - 뒤 화면 스크롤은 열려 있는 동안 CSS(body:has(.popupDim))로 막습니다.

interface PopupButton {
    label: string;
    onClick: () => void;
}

interface PopupProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    primaryButton: PopupButton;
    secondaryButton?: PopupButton;
    description?: ReactNode;
    comment?: string;
    children?: ReactNode;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const Popup = ({ isOpen, title, onClose, primaryButton, secondaryButton, description, comment, children }: PopupProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    const titleId = useId();
    const descriptionId = useId();

    // 부모가 매번 새 함수를 넘겨도 포커스 처리가 다시 실행되지 않도록 최신 onClose를 ref로 보관합니다.
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialogRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCloseRef.current();
                return;
            }
            if (event.key !== 'Tab' || !dialogRef.current) return;

            const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
            if (focusables.length === 0) {
                event.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && (active === first || active === dialogRef.current)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previousFocus?.focus();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDimClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="popupDim" onClick={handleDimClick}>
            <div
                ref={dialogRef}
                className="popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
            >
                <div className="popupContents">
                    <div className="popupText">
                        <h2 id={titleId} className="popupTitle">{title}</h2>
                        {description && <p id={descriptionId} className="popupDesc">{description}</p>}
                        {comment && <p className="popupComment">{comment}</p>}
                    </div>
                    {children}
                </div>
                <div className="buttonGroup popupButtons">
                    {secondaryButton && (
                        <Button label={secondaryButton.label} variant="secondary" onClick={secondaryButton.onClick} />
                    )}
                    <Button label={primaryButton.label} onClick={primaryButton.onClick} />
                </div>
            </div>
        </div>
    );
};

export default Popup;
