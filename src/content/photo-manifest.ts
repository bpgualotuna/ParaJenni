import 'server-only';

export interface PrivatePhoto {
  id: string;
  file: string;
  chapter: number;
  alt: string;
  caption: string;
}

/** Fuente única de asociaciones de fotos. Nunca importar en un componente cliente. */
export const photoManifest: PrivatePhoto[] = [
  { id: 'welcome', file: 'welcome.webp', chapter: 0, alt: 'Una fotografía de Jenni', caption: 'Para ti, Mi Princesita.' },
  { id: 'first-moments', file: 'first-moments.webp', chapter: 1, alt: 'Jenni y su pareja juntos', caption: 'Me alegra que nuestros caminos se hayan encontrado.' },
  { id: 'jenni-smile', file: 'jenni-smile.webp', chapter: 2, alt: 'Retrato de Jenni', caption: 'Qué bonito que existas tú.' },
  { id: 'memory-01', file: 'memory-01.webp', chapter: 3, alt: 'Jenni y su pareja compartiendo un momento', caption: 'Un pedacito de nosotros.' },
  { id: 'memory-02', file: 'memory-02.webp', chapter: 3, alt: 'Un recuerdo juntos reflejado en un espejo', caption: 'También en los detalles vive lo nuestro.' },
  { id: 'memory-03', file: 'memory-03.webp', chapter: 3, alt: 'Jenni y su pareja mirándose', caption: 'Volvería a elegir un ratito contigo.' },
  { id: 'memory-04', file: 'memory-04.webp', chapter: 3, alt: 'Una fotografía de Jenni junto a su pareja', caption: 'Hay momentos que se quedan.' },
  { id: 'memory-05', file: 'memory-05.webp', chapter: 3, alt: 'Jenni y su pareja en un abrazo', caption: 'Todos los abrazos que guardo para ti.' },
  { id: 'memory-06', file: 'memory-06.webp', chapter: 3, alt: 'Jenni y su pareja descansando juntos', caption: 'Mi lugar favorito es cerquita de ti.' },
  { id: 'together', file: 'together.webp', chapter: 4, alt: 'Jenni y su pareja juntos en una fotografía', caption: 'Sigamos construyendo recuerdos bonitos.' },
  { id: 'birthday', file: 'birthday.webp', chapter: 5, alt: 'Fotografía especial de Jenni para su cumpleaños', caption: 'Hoy el universo celebra que existes.' },
  { id: 'gift', file: 'gift.webp', chapter: 5, alt: 'Jenni y su pareja compartiendo un momento de cariño', caption: 'Todavía nos faltan muchos recuerdos por crear.' },
];
