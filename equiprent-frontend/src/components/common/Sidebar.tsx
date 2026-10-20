import { NavLink } from 'react-router';
import { Icon, type IconName } from '../ui/Icon';

interface NavItem {
    to: string;
    label: string;
    icon: IconName;
    end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
    { to: '/unidades', label: 'Unidades de Maquinaria', icon: 'unit' },
    { to: '/mantenimientos', label: 'Mantenimientos', icon: 'wrench' },
    { to: '/acerca', label: 'Acerca de', icon: 'info' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <span className="sidebar__logo">
                    <Icon name="logo" size={22} />
                </span>
                <div>
                    <h2>EquipRent</h2>
                    <span className="sidebar__tagline">SISTEMA DE GESTION</span>
                </div>
            </div>

            <div className="sidebar__section">
                <span className="sidebar__section-title">Menu</span>

                <nav className="sidebar__nav" aria-label="Navegación principal">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon name={item.icon} size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar__footer">
                <span className="pixel">v1.0.0</span>
                <span className="mono">UnidadEquipo 1:N Mantenimiento</span>
            </div>
        </aside>
    );
}
