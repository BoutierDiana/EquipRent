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
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem', fontWeight: 600, color: '#c4b5fd' }}>
            <span>{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #4c3875',
                    outline: 'none',
                    fontSize: '0.9rem',
                    background: '#221a3a',
                    color: '#ffffff',
                    minHeight: '38px',
                    cursor: 'pointer',
                }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: '#221a3a', color: '#ffffff' }}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}