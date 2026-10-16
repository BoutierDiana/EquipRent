export default function AcercaPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Información</p>
          <h2>Acerca del proyecto</h2>
        </div>
      </div>
      <div className="placeholder-card">
        <h3>EquipRent · Proyecto 15</h3>
        <p>
          Frontend React + TypeScript + Vite que consume el backend
          <code> equiprent-backend </code> (Spring Boot + PostgreSQL), sobre la relación
          1:N Equipo → UnidadEquipo.
        </p>
      </div>
    </section>
  );
}
