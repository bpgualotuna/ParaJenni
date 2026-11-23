'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="quiet-state"><h1>Una nubecita en nuestro cielo.</h1><p>No pudimos cargar este recuerdo. Puedes intentarlo de nuevo.</p><button className="button button-gold" onClick={reset}>Intentar de nuevo</button></main>;
}
