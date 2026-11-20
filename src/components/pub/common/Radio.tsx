import type { ChangeEvent } from 'react';

// 라디오 버튼 (Figma: Radio Button) — docs/design.md 2장, 6.0
// - Figma Radio Button은 아이콘이 아니라 원(22px, 테두리 2px)과 가운데 점(12px) 프레임이라 같은 수치로 CSS로 표현합니다.
// - 선택: 테두리·점 Primary-500 / 해제: 테두리·점 Gray-300
// - 여러 개를 2열로 놓을 때는 <div className="radioGroup" role="radiogroup">으로 감쌉니다 (간격 가로 12, 세로 8).

interface RadioProps {
    id: string;
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const Radio = ({ id, name, value, label, checked, onChange, disabled = false }: RadioProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <label htmlFor={id} className="radio">
            <input
                id={id}
                name={name}
                type="radio"
                className="radioInput"
                value={value}
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
            />
            <span className="radioMark" aria-hidden="true" />
            <span className="radioLabel">{label}</span>
        </label>
    );
};

export default Radio;
