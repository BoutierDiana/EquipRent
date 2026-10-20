import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <section className="not-found">
            <p className="eyebrow">Error 404</p>
            <h2>La página solicitada no existe</h2>
            <p>Revisa la dirección ingresada o vuelve al panel inicial.</p>
            <Link className="btn btn--primary" to="/">Volver al inicio</Link>
        </section>
    );
}
