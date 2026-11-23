import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const display = localFont({ src: [
  { path: './fonts/bodoni-regular.ttf', weight: '400', style: 'normal' },
  { path: './fonts/bodoni-italic.ttf', weight: '400', style: 'italic' },
], variable: '--font-bodoni', display: 'swap' });
const body = localFont({ src: [
  { path: './fonts/manrope-regular.ttf', weight: '400', style: 'normal' },
  { path: './fonts/manrope-medium.ttf', weight: '500', style: 'normal' },
  { path: './fonts/manrope-semibold.ttf', weight: '600', style: 'normal' },
], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Nuestro pequeño universo · Para Jenni',
  description: 'Cinco estrellas, un mismo amor. Un lugar pequeño para una historia muy nuestra.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
  referrer: 'same-origin',
};
export const viewport: Viewport = { themeColor: '#171326', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}><body><a className="skip-link" href="#main">Saltar al contenido</a>{children}</body></html>;
}
