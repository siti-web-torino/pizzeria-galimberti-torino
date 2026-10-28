/**
 * Dati fissi del sito: quelli che il titolare NON cambia dall'admin.
 * Per cambiarli si modifica questo file (vedi README.md).
 *
 * Ogni valore ha accanto la sua fonte. `daConfermare: true` mostra nel sito
 * un riquadro [DA CONFERMARE].
 */

export const SITO = {
  nome: "Pizzeria Galimberti",
  // Fonte: note dell'utente, volantino (menu2.png).
  indirizzo: "Piazza Galimberti 5",
  citta: "Torino",
  // "Come arrivare": link a Google Maps, mai un iframe.
  mappa:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Pizzeria Galimberti, Piazza Galimberti 5, Torino"),

  telefoni: [
    // Fonte: note dell'utente e volantino (menu2.png). Il volantino mette il fisso per primo.
    { etichetta: "Fisso", mostra: "011 194 81 030", tel: "+390119481030" },
    { etichetta: "Cellulare", mostra: "328 277 61 18", tel: "+393282776118" },
  ],

  justEat: {
    // Le note lo lasciano vuoto. Trovato nei risultati di ricerca con lo stesso
    // indirizzo: va confermato col locale prima di mostrarlo a qualcuno.
    url: "https://www.justeat.it/restaurants-pizzeria-galimberti-torino-10134-1/menu",
    daConfermare: true,
  },

  instagram: {
    // Fonte: volantino (menu2.png) "pizzeria_galimberti"; le note dicono "Instagram".
    nome: "@pizzeria_galimberti",
    url: "https://www.instagram.com/pizzeria_galimberti/",
  },

  consegna: {
    // Fonte: volantino (menu2.png) "CONSEGNA A DOMICILIO € 2.00". Data del volantino ignota.
    costo: 200,
    daConfermare: true,
  },

  // Fonte: note dell'utente ("forno a legna") e volantino ("pizza al mattone").
  forno: "Forno a legna",

  // Frasi del volantino (menu2.png), riusate come sono scritte.
  frasi: {
    domanda: "Stasera pizza?",
    teglie:
      "Festa di compleanno? Un evento speciale? Ordina le nostre teglie, le puoi personalizzare come vuoi mettendo fino a 4 gusti diversi.",
  },

  // Nota in fondo al menu (menu1.png), letta con dubbio.
  notaMenu: "* Prodotto congelato / surgelato. Impasto integrale + 1 €",
} as const;

export const FOTO = {
  teglia: {
    src: "/img/teglia.webp",
    w: 675,
    h: 797,
    alt: "Pizza in teglia con pomodoro, fior di latte e prosciutto cotto, appena sfornata",
  },
  cornicione: {
    src: "/img/pizza-cornicione.webp",
    w: 838,
    h: 651,
    alt: "Pizza tonda dal cornicione alto e maculato, con fior di latte, carne e basilico",
  },
  mortadella: {
    src: "/img/pizza-mortadella.webp",
    w: 683,
    h: 767,
    alt: "Pizza con mortadella, burrata e granella di pistacchio nel cartone da asporto",
  },
  tegamino: {
    src: "/img/tegamino.webp",
    w: 676,
    h: 467,
    alt: "Pizza al tegamino con pomodoro, fior di latte e salsiccia, bordo alto e bruciacchiato",
  },
  logo: { src: "/img/logo.png", w: 134, h: 68, alt: "Galimberti Pizzeria" },
} as const;

/** 850 → "€ 8,50" */
export function euro(centesimi: number): string {
  return `€ ${(centesimi / 100).toFixed(2).replace(".", ",")}`;
}
