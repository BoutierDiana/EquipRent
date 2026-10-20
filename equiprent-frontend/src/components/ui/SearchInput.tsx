import { Icon } from './Icon';

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
        <label className="field">
            <span className="field__label">{label}</span>
            <span className="field__control-wrap">
                <Icon name="search" size={16} className="field__icon" />
                <input
                    type="search"
                    className="field__control field__control--with-icon"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            </span>
        </label>
    );
}
