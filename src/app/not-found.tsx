import Link from 'next/link';
import { StarField } from '@/components/universe/Atmosphere';
export default function NotFound() {
  return <div className="night-page"><StarField /><main id="main" className="quiet-state"><h1>Esta estrella está en otro cielo.</h1><p>Volvamos al lugar donde comienza nuestro viaje.</p><Link className="button button-gold" href="/">Volver a nuestro universo</Link></main></div>;
}
