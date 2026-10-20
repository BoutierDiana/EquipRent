export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectFilterProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}

export function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
    return (
        <label className="field">
            <span className="field__label">{label}</span>
            <select className="field__control" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
