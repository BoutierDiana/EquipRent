import type { SVGProps } from 'react';

/**
 * Íconos SVG geométricos de trazo (estética Cyber-Industrial, sin emojis).
 * Son decorativos: aria-hidden, el texto visible o el aria-label del botón da el nombre accesible.
 */
export type IconName =
    | 'dashboard'
    | 'unit'
    | 'wrench'
    | 'info'
    | 'close'
    | 'plus'
    | 'search'
    | 'chevron-left'
    | 'chevron-right'
    | 'edit'
    | 'trash'
    | 'alert'
    | 'check'
    | 'logo';

const PATHS: Record<IconName, string> = {
    dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
    unit: 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10',
    wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-5M12 8h.01',
    close: 'M6 6l12 12M18 6 6 18',
    plus: 'M12 5v14M5 12h14',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
    edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    alert: 'M12 3 2 21h20zM12 10v4M12 17h.01',
    check: 'M4 12l5 5L20 6',
    logo: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6M4 20h16',
};

export interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number;
}

export function Icon({ name, size = 18, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="square"
            strokeLinejoin="miter"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <path d={PATHS[name]} />
        </svg>
    );
}
