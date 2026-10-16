export default function DashboardPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Panel principal</p>
          <h2>Bienvenido a EquipRent</h2>
        </div>
      </div>
      <div className="placeholder-card">
        <h3>Catálogo y activos</h3>
        <p>
          Un <strong>Equipo</strong> es el modelo del catálogo, por ejemplo un taladro
          percutor. Una <strong>Unidad</strong> es la copia física concreta que se entrega
          al cliente, con su propio código. Por eso un equipo tiene muchas unidades.
        </p>
      </div>
    </section>
  );
}
