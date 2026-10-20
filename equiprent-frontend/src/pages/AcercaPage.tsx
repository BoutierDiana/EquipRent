export default function AcercaPage() {
    return (
        <section className="feature-page page-stack">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Información</p>
                    <h1>Acerca de EquipRent</h1>
                </div>
            </div>

            <div className="panel">
                <h3>Plataforma de Gestión Industrial</h3>
                <p>
                    Sistema desarrollado bajo arquitectura hexagonal en Spring Boot y
                    frontend SPA con React + TypeScript.
                </p>
                <ul className="spec-list">
                    <li><span>Relación principal</span><strong className="mono">UnidadEquipo 1:N Mantenimiento</strong></li>
                    <li><span>Backend</span><strong className="mono">Java 21 · Spring Boot 3.2 · PostgreSQL · Flyway</strong></li>
                    <li><span>Frontend</span><strong className="mono">React · TypeScript · Vite · Vitest</strong></li>
                    <li><span>API</span><strong className="mono">{import.meta.env.VITE_API_URL}</strong></li>
                </ul>
            </div>
        </section>
    );
}
