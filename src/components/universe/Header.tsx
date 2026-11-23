import Link from 'next/link';
import { LockKeyhole, Sparkles, Images } from 'lucide-react';

export function SiteHeader({ active = 'universe', albumAvailable }: { active?: 'universe' | 'album'; albumAvailable: boolean }) {
  return <header className="site-header"><Link href="/" className="wordmark" aria-label="Nuestro pequeño universo, inicio"><Sparkles size={23} strokeWidth={1.2} /><span>un universo <em>contigo</em></span></Link><nav aria-label="Navegación principal"><Link href="/" className={active === 'universe' ? 'nav-link active' : 'nav-link'} aria-current={active === 'universe' ? 'page' : undefined}>Nuestro cielo</Link>{albumAvailable ? <Link className={active === 'album' ? 'nav-link active' : 'nav-link'} href="/album" aria-current={active === 'album' ? 'page' : undefined}><Images size={15} />Recuerdos</Link> : <span className="nav-link nav-locked" title="El álbum abre el 25 de noviembre"><LockKeyhole size={13} />Recuerdos<span className="sr-only">, disponible el 25 de noviembre</span></span>}</nav></header>;
}
