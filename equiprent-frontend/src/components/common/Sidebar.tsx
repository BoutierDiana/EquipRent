import { NavLink } from 'react-router';

export default function Sidebar() {
    return (
        <aside
            style={{
                width: '240px',
                backgroundColor: '#130d24',
                borderRight: '1px solid #2a1f49',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
            }}
        >
            <div style={{ padding: '0 8px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c4b5fd', letterSpacing: '0.03em' }}>
                    EquipRent
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#8b7ca8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          SISTEMA DE GESTION
        </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c6f9e', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Menu
        </span>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/unidades"
                        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                    >
                        Unidades de Maquinaria
                    </NavLink>
                    <NavLink
                        to="/mantenimientos"
                        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                    >
                        Mantenimientos
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
}