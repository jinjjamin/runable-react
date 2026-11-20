import type { ChangeEvent, ReactNode } from 'react';
import iconCheckboxOff from '../../../assets/icons/iconCheckboxOff.svg';
import iconCheckboxOn from '../../../assets/icons/iconCheckboxOn.svg';
import iconCheckboxRoundOff from '../../../assets/icons/iconCheckboxRoundOff.svg';
import iconCheckboxRoundOn from '../../../assets/icons/iconCheckboxRoundOn.svg';

// 체크박스 (Figma: Checkbox, Type Rectangle / Round) — docs/design.md 2장, 6.0
// - 실제 체크는 화면에서 숨긴 <input type="checkbox">가 담당하고, 모양은 Figma 원본 아이콘(24px)을 보여줍니다.
// - shape: rectangle(사각, 예: 로그인 상태유지·약관 동의) / round(원형, 예: 회원탈퇴 사유)
// - 라벨 색은 화면마다 달라(검정, Gray-700) 부모에서 정합니다. 기본은 부모 글자색을 따릅니다.
// - 비활성(Figma Disable) 모양은 시안에서 확인되지 않아 disabled 속성만 전달합니다.

interface CheckboxProps {
    id: string;
    label: ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shape?: 'rectangle' | 'round';
    disabled?: boolean;
    name?: string;
}

const CHECKBOX_ICONS = {
    rectangle: { on: iconCheckboxOn, off: iconCheckboxOff },
    round: { on: iconCheckboxRoundOn, off: iconCheckboxRoundOff }
};

const Checkbox = ({ id, label, checked, onChange, shape = 'rectangle', disabled = false, name }: CheckboxProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <label htmlFor={id} className="checkbox">
            <input
                id={id}
                name={name}
                type="checkbox"
                className="checkboxInput"
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
            />
            <img src={checked ? CHECKBOX_ICONS[shape].on : CHECKBOX_ICONS[shape].off} alt="" className="checkboxIcon" />
            <span className="checkboxLabel">{label}</span>
        </label>
    );
};

export default Checkbox;
