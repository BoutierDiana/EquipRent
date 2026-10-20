export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export function SearchInput({
                                value,
                                onChange,
                                placeholder = 'Buscar...',
                                label = 'Busqueda',
                            }: SearchInputProps) {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem', fontWeight: 600, color: '#c4b5fd' }}>
            <span>{label}</span>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #4c3875',
                    outline: 'none',
                    fontSize: '0.9rem',
                    background: '#221a3a',
                    color: '#ffffff',
                    minHeight: '38px',
                }}
            />
        </label>
    );
}