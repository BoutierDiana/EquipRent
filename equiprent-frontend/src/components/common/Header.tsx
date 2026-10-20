export default function Header() {
    return (
        <header
            style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                backgroundColor: '#19122b',
                borderBottom: '1px solid #2a1f49',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.9rem', color: '#c4b5fd', fontWeight: 500 }}>
          Plataforma de Control de Flota
        </span>
            </div>

            <div>
        <span
            style={{
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: '#2a1f49',
                color: '#ddd6fe',
                border: '1px solid #4c3875',
            }}
        >
          Sesion activa
        </span>
            </div>
        </header>
    );
}