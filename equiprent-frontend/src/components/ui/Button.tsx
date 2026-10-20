import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
}

export function Button({
                           variant = 'primary',
                           loading = false,
                           disabled,
                           children,
                           style,
                           ...props
                       }: ButtonProps) {
    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'danger':
                return { background: '#dc2626', color: '#ffffff', border: 'none' };
            case 'secondary':
                return { background: '#251b3e', color: '#ddd6fe', border: '1px solid #4c3875' };
            case 'ghost':
                return { background: 'transparent', color: '#c4b5fd', border: '1px solid #4c3875' };
            case 'primary':
            default:
                return { background: '#7c3aed', color: '#ffffff', border: 'none' };
        }
    };

    return (
        <button
            disabled={disabled || loading}
            style={{
                padding: '9px 18px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                opacity: disabled || loading ? 0.65 : 1,
                transition: 'all 0.2s ease',
                ...getVariantStyles(),
                ...style,
            }}
            {...props}
        >
            {loading ? 'Procesando...' : children}
        </button>
    );
}