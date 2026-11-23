import 'server-only';
import type { BirthdayCopy, InteractionType, Song } from '@/lib/types';

export interface ChapterDefinition {
  id: number; date: string; unlockAt: string; title: string; starName: string;
  introduction: string; letter: string; song: Song; photoIds: string[];
  interaction: { type: InteractionType; messages: string[] };
}

// The only source of truth for dates, letters, songs and chapter associations.
// Never import this file into a client component.
export const chapters: ChapterDefinition[] = [
  {
    "id": 1,
    "date": "2026-11-23",
    "unlockAt": "2026-11-23T00:00:00-05:00",
    "title": "Desde que llegaste a mi vida",
    "starName": "Nuestra primera estrella",
    "introduction": "Toda historia tiene una primera luz. Esta es la nuestra.",
    "letter": "Mi Princesita ❤️\n\nHoy comienza algo que preparé especialmente para ti. Tal vez no sea el regalo más grande del mundo, pero cada pedacito de esto tiene algo de nosotros.\n\n¿Sabes? A veces me pongo a pensar en todo lo que ha pasado desde que llegaste a mi vida. Ya son 2 años y 5 meses compartiendo una historia que, aunque no siempre ha sido sencilla, significa muchísimo para mí.\n\nQuién diría que una persona podría llegar a ocupar un lugar tan especial en mi corazón.\n\nA veces quisiera regresar a ciertos momentos, volver a sentirlos por primera vez y abrazarte un poquito más fuerte.\n\nPero también me emociona pensar en todos los recuerdos que todavía nos faltan por crear.\n\nEsta es nuestra primera estrella, mi amor. La que representa el comienzo de algo que todavía estamos escribiendo juntos.\n\nY si algo quiero que sepas hoy, es que me alegra muchísimo que nuestros caminos se hayan encontrado. 💗",
    "song": {
      "title": "Eres",
      "artist": "Café Tacvba",
      "url": "https://www.youtube.com/watch?v=98Akpf1ph2o"
    },
    "photoIds": [
      "first-moments"
    ],
    "interaction": {
      "type": "envelope",
      "messages": []
    }
  },
  {
    "id": 2,
    "date": "2026-11-24",
    "unlockAt": "2026-11-24T00:00:00-05:00",
    "title": "El encanto de ser tú",
    "starName": "La estrella de tu sonrisa",
    "introduction": "Hoy el cielo tiene un poquito de tu sonrisa.",
    "letter": "Hola, Mi Princesita hermosa. 💕\n\nHoy quiero dedicarte unas palabras que tal vez no te digo tantas veces como debería.\n\nMe encanta saber que, entre tantas personas en este mundo, existe alguien como tú en mi vida.\n\nAmo esos pequeños detalles que te hacen ser tú. Tu forma de ser, tu sonrisa, tus ocurrencias y todas esas cositas que, sin darte cuenta, pueden alegrarme el día.\n\nSé que ninguno de los dos es perfecto. Y tampoco quiero que lo seamos. Quiero que podamos ser nosotros mismos, aprender, crecer y seguir conociéndonos cada vez más.\n\nOjalá pudieras verte por un momento con mis ojos, para que entendieras lo especial que eres para mí.\n\nHoy no quiero hablar de la distancia ni de los problemas. Hoy quiero que recuerdes algo muy sencillo:\n\nEres una mujer maravillosa, Mi Princesita, y mereces sentirte querida, valorada y feliz.\n\nNunca olvides lo mucho que vales. ❤️",
    "song": {
      "title": "El Embrujo",
      "artist": "Morat",
      "url": "https://www.youtube.com/watch?v=X0KkNGp6YNU"
    },
    "photoIds": [
      "jenni-smile"
    ],
    "interaction": {
      "type": "hearts",
      "messages": [
        "Tu sonrisa ilumina mis días.",
        "Me encanta tu forma de ser.",
        "Tus ocurrencias siempre me sorprenden.",
        "Adoro esos pequeños detalles que te hacen única.",
        "Gracias por ser tú, Mi Princesita."
      ]
    }
  },
  {
    "id": 3,
    "date": "2026-11-25",
    "unlockAt": "2026-11-25T00:00:00-05:00",
    "title": "Ni la distancia puede borrar lo nuestro",
    "starName": "La estrella de los recuerdos",
    "introduction": "Hay recuerdos que nos acercan, incluso desde lejos.",
    "letter": "Mi amorcito. ❤️\n\nSi pudiera pedir un deseo en este momento, sería poder abrazarte.\n\nA veces me gustaría que las cosas fueran más sencillas. Que no tuviéramos que esperar tanto para vernos, que pudiéramos compartir más momentos juntos y que los abrazos no fueran algo que extrañamos tanto.\n\nNo siempre es fácil tenerte lejos.\n\nHay días en los que quisiera estar a tu lado, hacer cualquier cosa contigo, incluso algo tan simple como conversar, reírnos o quedarnos juntos sin hacer absolutamente nada.\n\nPero también hay algo bonito en todo esto: cada momento que logramos compartir se vuelve especial.\n\nMe gusta recordar las veces que hemos estado juntos, los momentos que hemos vivido y todas esas pequeñas historias que se han convertido en nuestros recuerdos.\n\nLa distancia puede quitarnos tiempo juntos, pero no puede borrar lo que ya hemos vivido.\n\nEspero que algún día podamos mirar hacia atrás y sonreír al recordar todo lo que hicimos para estar más cerquita.\n\nMientras tanto, quiero seguir coleccionando recuerdos contigo.\n\nTe extraño mucho, Mi Princesita. 💗",
    "song": {
      "title": "Arroyito",
      "artist": "Fonseca",
      "url": "https://www.youtube.com/watch?v=lj7IQDeBNlI"
    },
    "photoIds": [
      "memory-01",
      "memory-02",
      "memory-03",
      "memory-04",
      "memory-05",
      "memory-06"
    ],
    "interaction": {
      "type": "memories",
      "messages": []
    }
  },
  {
    "id": 4,
    "date": "2026-11-26",
    "unlockAt": "2026-11-26T00:00:00-05:00",
    "title": "El amor también se construye",
    "starName": "La estrella de nuestros sueños",
    "introduction": "Los sueños bonitos también se cuidan, un día a la vez.",
    "letter": "Mi Princesita...\n\nHoy quiero hablarte desde el corazón.\n\nEn estos 2 años y 5 meses hemos pasado por muchas cosas. Hemos tenido días hermosos, pero también discusiones, diferencias y momentos en los que entendernos no ha sido tan sencillo.\n\nY no quiero hacer como si esos momentos no hubieran existido, porque también forman parte de nuestra historia.\n\nSé que todavía tenemos mucho por aprender, muchas cosas que mejorar y retos que enfrentar.\n\nPero hay algo que valoro muchísimo: seguimos intentando construir una vida y una familia juntos.\n\nQuiero que nuestro amor no se quede solamente en palabras bonitas. Quiero que también se note en cómo nos escuchamos, cómo nos tratamos, cómo resolvemos nuestras diferencias y cómo nos acompañamos cuando la vida se pone difícil.\n\nNo puedo prometerte que todo será perfecto.\n\nPero sí quiero seguir esforzándome por ser una mejor persona, una mejor pareja y alguien con quien puedas construir sueños.\n\nGracias por los momentos hermosos, por lo que hemos aprendido y por todo lo que todavía queremos alcanzar.\n\nLo nuestro no tiene que ser perfecto para ser valioso. Lo importante es que ambos sigamos cuidándolo y construyéndolo con amor.\n\nY mañana, mi vida, quiero celebrar algo todavía más importante: que existes tú. ❤️",
    "song": {
      "title": "Amor del bueno",
      "artist": "Reyli Barba",
      "url": "https://www.youtube.com/watch?v=gW3OZC1NDTk"
    },
    "photoIds": [
      "together"
    ],
    "interaction": {
      "type": "wishes",
      "messages": [
        "Escucharnos cada día un poquito mejor.",
        "Seguir aprendiendo juntos.",
        "Crear muchos más recuerdos.",
        "Cuidar nuestro amor y nuestra familia.",
        "Construir un futuro lleno de momentos bonitos."
      ]
    }
  },
  {
    "id": 5,
    "date": "2026-11-27",
    "unlockAt": "2026-11-27T00:00:00-05:00",
    "title": "El universo está de fiesta por ti",
    "starName": "La estrella más brillante",
    "introduction": "Hoy todas las estrellas celebran que existes tú.",
    "letter": "¡FELIZ CUMPLEAÑOS, MI PRINCESITA HERMOSA! ❤️🎂\n\nHoy no es cualquier día.\n\nHoy es uno de esos días en los que me alegra muchísimo que la vida haya permitido que llegaras a este mundo.\n\nPorque, aunque tal vez en ese momento nadie podía imaginarlo, algún día ibas a convertirte en alguien increíblemente importante para mí.\n\nMi amor, deseo de todo corazón que este nuevo año de tu vida esté lleno de cosas bonitas.\n\nQue puedas cumplir tus sueños, que nunca te falten motivos para sonreír, que tengas salud, tranquilidad, oportunidades y muchas razones para sentirte orgullosa de la mujer que eres.\n\nQuisiera poder abrazarte muy fuerte, llenarte de besitos y recordarte en persona cuánto te amo.\n\nY aunque no siempre podamos estar juntos como quisiéramos, espero que esta pequeña sorpresa consiga hacerte sentir un poquito más cerca de mí.\n\nGracias por estos 2 años y 5 meses de historia. Por cada recuerdo, por cada alegría, por todo lo que hemos aprendido y por los sueños que compartimos.\n\nSé que todavía nos queda mucho camino por recorrer. Y deseo que podamos seguir haciéndolo con paciencia, respeto, cariño y muchas ganas de construir algo hermoso.\n\nHoy quiero que te sientas como lo que eres: la protagonista de tu propio universo.\n\nMi Princesita, nunca olvides lo especial que eres.\n\nTe amo muchísimo. Feliz cumpleaños, mi amor. 💗\n\nY antes de que te vayas...\n\nTodavía hay algo más que he preparado para ti. 🎁",
    "song": {
      "title": "Ángel",
      "artist": "Elefante",
      "url": "https://www.youtube.com/watch?v=kHUef5dcOWc"
    },
    "photoIds": [
      "birthday"
    ],
    "interaction": {
      "type": "birthday",
      "messages": []
    }
  }
];

export const giftMessage = "Mi Princesita...\n\nPensaste que aquí terminaba todo, ¿verdad?\n\nPues no. ❤️\n\nDurante estos cinco días te he regalado palabras, canciones, recuerdos y pequeños pedacitos de nuestra historia.\n\nPero hay un regalo que no puedo entregarte a través de una pantalla.\n\nAlgo que quiero darte personalmente, cuando llegue nuestro momento de estar juntos.\n\nPor ahora, solo quiero que sepas que esta sorpresa fue preparada con muchísimo cariño, pensando en ti.\n\nLa última estrella no guarda el final de nuestra historia. Guarda otro momento bonito que todavía nos falta vivir.\n\nTe amo, Mi Princesita.";

// Narrative for the final surprise: serialized only after the final chapter unlocks.
export const birthdayCopy: BirthdayCopy = {
  "prelude": "Hoy no es un día cualquiera...",
  "heading": "¡Feliz cumpleaños,\nMi Princesita hermosa!",
  "name": "Jenni",
  "wish": "Hoy, todas las estrellas brillan un poquito más por ti.",
  "invitationTitle": "Hay algo más que quiero darte...",
  "invitationDescription": "La última estrella todavía guarda una sorpresa.",
  "puzzleTitle": "El cofre de nuestros deseos",
  "puzzleDescription": "Hay cinco estrellas escondidas en este cielo.\nEncuéntralas y descubre lo que guardan para ti.",
  "words": [
    "Nuestro",
    "amor",
    "seguirá",
    "creando",
    "recuerdos"
  ],
  "couponTitle": "Vale por una sorpresa muy especial",
  "couponDescription": "Canjeable por un regalo y todos los abrazos que tengo guardados para ti.",
  "couponDedication": "Para mi Princesita, con todo mi amor.",
  "giftFooter": "Nuestra historia tiene muchas más estrellas por encender.",
  "puzzleComplete": "Las cinco estrellas están juntas. Ya puedes usar la llave.",
  "puzzleOpened": "Otro recuerdo bonito nos está esperando.",
  "keyInvitation": "La llave es tuya. Abre el cofre",
  "keyOpening": "Abriendo tu sorpresa…"
};
