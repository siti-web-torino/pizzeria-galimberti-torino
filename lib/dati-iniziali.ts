import type { Categoria, Dati, Voce } from "./schema";

/**
 * I dati iniziali: quelli che il sito mostra finché il titolare non
 * cambia qualcosa dall'admin, e anche quando il database non risponde.
 *
 * Contengono SOLO ciò che c'è nelle note dell'utente e nelle foto del
 * volantino (img-originali/menu1.png e menu2.png). Trascrizione completa,
 * con il grado di certezza per riga, in STUDIO.md.
 */

function slug(testo: string): string {
  return testo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Una voce di menu. `dubbio` = letta con incertezza dal volantino. */
function v(nome: string, ingredienti: string, euro: number, dubbio = false): Voce {
  return {
    id: slug(nome),
    nome,
    ingredienti,
    prezzo: Math.round(euro * 100),
    daConfermare: dubbio,
  };
}

function categoria(id: string, nome: string, voci: Voce[], nota = ""): Categoria {
  return { id, nome, nota, voci };
}

const POM = "Pomodoro, fior di latte";

const MENU: Categoria[] = [
  categoria("pizze", "Pizze", [
    v("Marinara", "Pomodoro, origano, aglio", 4.5),
    v("Margherita", POM, 5.5),
    v("Diavola", `${POM}, salamino piccante`, 7),
    v("Salsiccia", `${POM}, salsiccia`, 7),
    v("Würstel", `${POM}, würstel`, 7),
    v("Funghi", `${POM}, funghi`, 7),
    v("Prosciutto", `${POM}, prosciutto cotto`, 7),
    v("Greca", `${POM}, olive nere`, 7),
    v("Napoli", `${POM}, acciughe`, 7),
    v("San Daniele", `${POM}, prosciutto crudo`, 8),
    v("Calabra", `${POM}, salamino piccante, n'duja, cipolla di Tropea`, 9),
    v("Gorgo", `${POM}, gorgonzola`, 7),
    v("Patatine", `${POM}, patatine fritte*`, 7),
    v("Tonno cipolla", `${POM}, tonno, cipolla`, 8),
    v("4 stagioni", `${POM}, funghi, olive, prosciutto cotto, carciofi`, 8),
    v("4 formaggi", `${POM}, fontina, gorgo, parmigiano`, 8.5),
    v("Capricciosa", `${POM}, funghi, olive, prosciutto cotto, carciofi, salamino piccante`, 8.5),
    v("Smilzo", `${POM}, würstel, patatine fritte*`, 8),
    v("Vegetariana", `${POM}, melanzane, zucchine, peperoni, olive`, 8.5),
    v("Siciliana", `${POM}, acciughe, capperi, olive`, 8),
    v("Gran Torino", `${POM}, peperoni, salsiccia`, 8.5),
    v("Salsiccia friarielli", `${POM}, salsiccia, friarielli`, 8.5),
    v("Speck brie", `${POM}, speck, brie`, 8.5),
    v("Bismark", `${POM}, prosciutto cotto, uovo`, 8),
    v("Prosciutto funghi", `${POM}, prosciutto cotto, funghi`, 8),
    v("Parmigiana", `${POM}, melanzane fritte, parmigiano, basilico`, 8),
    v("Bufala", "Pomodoro, bufala, basilico", 9),
    v("Bacon", `${POM}, salsiccia, cipolla, bacon`, 9.5),
    v("Golosa", `${POM}, gorgo, salamino piccante`, 8.5),
    v("Burrata", "Pomodoro, burrata, basilico", 8.5),
    v("Porcini", `${POM}, funghi porcini*`, 9),
    v("Giogio", `${POM}, funghi, panna, speck`, 8.5, true),
    v("Valdostana", `${POM}, prosciutto cotto, fontina`, 8),
  ]),
  categoria("bianche", "Pizze bianche", [
    v("Gorgo pere", "Fior di latte, gorgo, pere", 8.5),
    v("Bresaola", "Fior di latte, pomodorini, bresaola, rucola, scaglie di grana", 10),
    v("Biancaneve", "Fior di latte, basilico", 5.5),
    v("Fumé", "Fior di latte, speck, scamorza affumicata", 8.5),
    v("Carbonara", "Fior di latte, uova, bacon, parmigiano, panna", 8.5),
    v("Luca", "Fior di latte, funghi porcini*, speck", 9.5),
    v("Fiori di zucca", "Fior di latte, fiori di zucca, acciughe", 8),
    v("Porrosa", "Fior di latte, porri, salsiccia, gorgo", 8.5, true),
  ]),
  categoria("speciali", "Le speciali", [
    // Nel volantino è scritto "mortella": probabile refuso, da confermare.
    v("La Mortadella", "Fior di latte, mortadella, burrata, granella di pistacchio", 10, true),
    v("Delicata", "Bufala, pomodorini, prosciutto crudo, rucola, scaglie di grana", 10.5),
    v("Piemontese", `${POM}, peperoni, acciughe`, 8.5),
    v("Norvegese", "Fior di latte, salmone, philadelphia", 9.5),
    v("La Montanara", `${POM}, patate al forno, funghi, speck, fontina`, 10),
    v("Galimberti", `${POM}, salsiccia, gorgo, salamino piccante, cipolla`, 10),
    v("Burrata in camicia", "Pomodoro, burrata, crudo, olio", 10),
    v("Pippo", "Pomodoro, bufala, spianata, olive taggiasche, basilico, origano", 9.5),
    v("Ligure", "Fior di latte, fagiolini, patate, pesto", 9),
    v("Lulu", "Fior di latte, prosciutto cotto fuori cottura, stracciatella, granella di pistacchio, basilico, olio", 10),
    v("Caramellata", "Fior di latte, lardo, cipolla caramellata", 10),
    v("Puglia", "Fior di latte, pomodorini, caciocavallo, basilico, olio", 9.5),
  ]),
  categoria("panuozzi", "Panuozzi", [
    v("Spianata e caciocavallo", "", 8.5),
    v("Prosciutto cotto, bufala o burrata", "", 9),
    v("Prosciutto crudo, bufala o burrata", "", 10),
    v("Tonno, pomodorini, cipolla", "", 8),
    v("Salsiccia, peperoni, scamorza", "", 10),
    v("Pomodorini, rucola, speck, stracciatella", "", 9),
  ]),
  categoria("farinate", "Farinate", [
    v("Farinata classica", "", 3.5),
    v("Farinata farcita", "", 4.5),
  ]),
  categoria("focacce", "Focacce", [
    v("Focaccia origano rosmarino", "", 3.5),
    v("Focaccia lardo e miele", "", 6.5),
    v("Focaccia crudo/speck/lardo", "", 6),
    v("Focaccia estiva", "Bresaola, rucola, scaglie di grana", 8),
    v("Focaccia tricolore", "Pomodorini, bufala, rucola", 7.5),
    v("Focaccia completa", "Pomodorini, rucola, burrata, scaglie di grana, prosciutto crudo", 9),
    v("Focaccia Nutella", "", 6),
  ]),
  categoria("sfiziosita", "Sfiziosità", [
    v("Patatine fritte*", "", 4),
    v("Gnocco fritto", "", 5),
    v("Gnocco fritto con affettati", "", 7),
    v("Gnocco fritto pizzaiola", "", 6),
    v("Gnocco fritto Nutella", "", 7),
    v("Crocchette di patate* (10 pz)", "", 5),
    v("Mozzarelline impanate* (10 pz)", "", 5),
    v("Rinforzo", "", 1),
    v("Extra a scelta", "Su pizze e farinate farcite", 1),
    v("Aggiunte speciali", "Bufala, burrata, crudo, speck, lardo, bresaola, salmone, bacon", 2),
  ]),
  categoria("bibite", "Bibite e birre", [
    v("Lattine", "", 2),
    v("Acqua naturale o gasata", "", 1),
    v("Coca Cola bottiglia", "", 3, true),
    v("Ceres 33 cl", "", 3, true),
    v("Beck's 33 cl", "", 2.5, true),
    v("Tennent's 33 cl", "", 3, true),
    v("Moretti 66 cl", "", 2.5, true),
  ]),
];

/** Martedì-domenica 18:00-22:30 (note e menu2.png). Lunedì chiuso è una deduzione. */
const APERTO = { aperto: true, da: "18:00", a: "22:30" };

export const DATI_INIZIALI: Dati = {
  orari: {
    giorni: [
      { giorno: 1, aperto: false, da: "18:00", a: "22:30" },
      { giorno: 2, ...APERTO },
      { giorno: 3, ...APERTO },
      { giorno: 4, ...APERTO },
      { giorno: 5, ...APERTO },
      { giorno: 6, ...APERTO },
      { giorno: 7, ...APERTO },
    ],
    daConfermare: true,
  },
  chiusure: [],
  avviso: { attivo: false, testo: "" },
  // Le note: "telefono, Just Eat, asporto, consegna a domicilio".
  consegna: { attiva: true },
  menu: { confermato: false, categorie: MENU },
};
