// frontend/src/app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <article>
      <h1>Bienvenido al Sistema de Clasificación de IA</h1>
      <p>Este es el punto de control de nuestro sistema Full-Stack y Asíncrono.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/tickets" role="button">
          Enviar Nuevo Ticket 📝
        </Link>
        <Link href="/history" role="button" className="secondary">
          Ver Historial de IA 🔎
        </Link>
      </div>
    </article>
  );
}