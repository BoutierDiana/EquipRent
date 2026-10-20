import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
}

/**
 * Botón reutilizable (Guía 09). variant decide la presentación vía clases CSS
 * (styles/ui.css); no codifica reglas de negocio. loading evita dobles envíos.
 */
export function Button({
                           variant = 'primary',
                           loading = false,
                           disabled,
                           children,
                           className,
                           type = 'button',
                           ...props
                       }: ButtonProps) {
    const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ');

    return (
        <button type={type} className={classes} disabled={disabled || loading} {...props}>
            {loading ? 'Procesando...' : children}
        </button>
    );
}
