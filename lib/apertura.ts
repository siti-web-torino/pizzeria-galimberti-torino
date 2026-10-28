import type { Chiusura, Orari } from "./schema";

/**
 * "È aperto adesso?" — la prima domanda di chi apre il sito.
 *
 * Tutto è in ora di Torino, sempre: chi guarda il sito da un telefono con
 * il fuso sbagliato deve leggere lo stesso stato di chi è in piazza.
 * Qui si importano solo tipi: il modulo gira anche nel browser senza Zod.
 */

const FUSO = "Europe/Rome";

export const GIORNI = [
  "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica",
];

const MESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

const DA_INGLESE: Record<string, number> = {
  Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
};

export interface Adesso {
  /** 1 = lunedì … 7 = domenica */
  giorno: number;
  /** Minuti dalla mezzanotte. */
  minuti: number;
  /** "2026-10-28" */
  data: string;
  /** "2026-10-28T19:41" */
  stamp: string;
}

export function adessoATorino(istante = new Date()): Adesso {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: FUSO,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(istante)
      .map((x) => [x.type, x.value]),
  ) as Record<string, string>;

  const data = `${p.year}-${p.month}-${p.day}`;
  return {
    giorno: DA_INGLESE[p.weekday] ?? 1,
    minuti: Number(p.hour) * 60 + Number(p.minute),
    data,
    stamp: `${data}T${p.hour}:${p.minute}`,
  };
}

function minuti(ora: string): number {
  const [h, m] = ora.split(":").map(Number);
  return h * 60 + m;
}

/** "2026-10-28" + n giorni, senza passare dai fusi. */
function piuGiorni(data: string, n: number): string {
  const d = new Date(`${data}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** "2026-08-20" → "20 agosto" */
export function dataBreve(data: string): string {
  const [, m, g] = data.split("-").map(Number);
  return `${g} ${MESI[m - 1]}`;
}

function chiusuraDi(data: string, chiusure: Chiusura[]): Chiusura | undefined {
  return chiusure.find((c) => c.dal <= data && data <= c.al);
}

export type Stato =
  | { tipo: "aperto"; testo: string }
  | { tipo: "apre"; testo: string }
  | { tipo: "chiuso"; testo: string };

/**
 * Lo stato da mostrare in cima. Guarda fino a 60 giorni avanti per trovare
 * la prossima apertura, saltando giorni di riposo e ferie.
 */
export function statoApertura(
  orari: Orari,
  chiusure: Chiusura[],
  adesso: Adesso = adessoATorino(),
): Stato {
  const oggi = orari.giorni.find((g) => g.giorno === adesso.giorno);
  const ferieOggi = chiusuraDi(adesso.data, chiusure);

  if (oggi?.aperto && !ferieOggi) {
    const da = minuti(oggi.da);
    const a = minuti(oggi.a);
    if (adesso.minuti >= da && adesso.minuti < a) {
      return { tipo: "aperto", testo: `Aperto adesso, fino alle ${oggi.a}` };
    }
    if (adesso.minuti < da) {
      return { tipo: "apre", testo: `Oggi apre alle ${oggi.da}` };
    }
  }

  for (let n = 1; n <= 60; n++) {
    const data = piuGiorni(adesso.data, n);
    const giorno = ((adesso.giorno - 1 + n) % 7) + 1;
    const g = orari.giorni.find((x) => x.giorno === giorno);
    if (!g?.aperto || chiusuraDi(data, chiusure)) continue;

    const quando =
      n === 1 ? "domani" : n < 7 ? GIORNI[giorno - 1] : `${GIORNI[giorno - 1]} ${dataBreve(data)}`;
    const prima = ferieOggi
      ? `Chiuso${ferieOggi.nota ? ` (${ferieOggi.nota.toLowerCase()})` : ""}. `
      : "Chiuso. ";
    return { tipo: "chiuso", testo: `${prima}Riapre ${quando} alle ${g.da}` };
  }

  return { tipo: "chiuso", testo: "Chiuso" };
}

/** Le chiusure ancora da venire o in corso, per mostrarle nel sito. */
export function chiusureFuture(chiusure: Chiusura[], adesso = adessoATorino()): Chiusura[] {
  return chiusure
    .filter((c) => c.al >= adesso.data)
    .sort((a, b) => a.dal.localeCompare(b.dal));
}

/**
 * "Martedì-domenica 18:00-22:30" quando tutti i giorni aperti hanno lo
 * stesso orario e sono di fila; altrimenti "Orari qui sotto".
 */
export function riassuntoOrari(orari: Orari): string {
  const aperti = orari.giorni.filter((g) => g.aperto).sort((a, b) => a.giorno - b.giorno);
  if (aperti.length === 0) return "Chiuso";

  const stessoOrario = aperti.every((g) => g.da === aperti[0].da && g.a === aperti[0].a);
  const diFila = aperti.every((g, i) => i === 0 || g.giorno === aperti[i - 1].giorno + 1);
  if (!stessoOrario || !diFila) return "Orari qui sotto";

  const primo = GIORNI[aperti[0].giorno - 1];
  const ultimo = GIORNI[aperti[aperti.length - 1].giorno - 1];
  const giorni =
    aperti.length === 7 ? "Tutti i giorni" : `${primo[0].toUpperCase()}${primo.slice(1)}-${ultimo}`;
  return `${giorni} ${aperti[0].da}-${aperti[0].a}`;
}
