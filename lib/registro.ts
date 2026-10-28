import { GIORNI, adessoATorino, dataBreve } from "./apertura";
import {
  nuovoId,
  type Avviso,
  type Chiusura,
  type Consegna,
  type Orari,
  type RigaRegistro,
  type Sezione,
  type Voce,
} from "./schema";
import { euro } from "./sito";

/**
 * Le frasi del registro delle modifiche, in italiano. Una riga deve far
 * capire in tre secondi cosa è cambiato: "Margherita: € 5,50 → € 6,00",
 * non un pezzo di JSON.
 */

export function riga(sezione: Sezione, label: string, prima: unknown): RigaRegistro {
  return { id: nuovoId(), at: adessoATorino().stamp, sezione, label, prima };
}

const fascia = (g: Orari["giorni"][number]) => (g.aperto ? `${g.da}-${g.a}` : "chiuso");

export function labelOrari(prima: Orari, dopo: Orari): string {
  const cambiati = dopo.giorni
    .map((g) => {
      const vecchio = prima.giorni.find((x) => x.giorno === g.giorno);
      return vecchio && fascia(vecchio) !== fascia(g)
        ? `${GIORNI[g.giorno - 1]} ${fascia(vecchio)} → ${fascia(g)}`
        : null;
    })
    .filter(Boolean);
  return cambiati.length
    ? `Orari: ${cambiati.join("; ")}`
    : "Orari confermati senza cambiamenti";
}

const periodo = (c: Chiusura) =>
  c.dal === c.al ? dataBreve(c.dal) : `dal ${dataBreve(c.dal)} al ${dataBreve(c.al)}`;

export const labelChiusuraAggiunta = (c: Chiusura) =>
  `Aggiunta chiusura ${periodo(c)}${c.nota ? ` (${c.nota})` : ""}`;

export const labelChiusuraTolta = (c: Chiusura) =>
  `Tolta la chiusura ${periodo(c)}${c.nota ? ` (${c.nota})` : ""}`;

export function labelAvviso(prima: Avviso, dopo: Avviso): string {
  if (!dopo.attivo) return prima.attivo ? "Avviso spento" : "Avviso salvato (spento)";
  if (!prima.attivo) return `Avviso acceso: "${dopo.testo}"`;
  return `Avviso cambiato: "${dopo.testo}"`;
}

export const labelConsegna = (dopo: Consegna) =>
  dopo.attiva ? "Consegna a domicilio riattivata" : "Consegna a domicilio sospesa";

export function labelVoce(categoria: string, prima: Voce | null, dopo: Voce): string {
  if (!prima) return `Aggiunta "${dopo.nome}" in ${categoria} a ${euro(dopo.prezzo)}`;

  const cambi: string[] = [];
  if (prima.nome !== dopo.nome) cambi.push(`nome "${prima.nome}" → "${dopo.nome}"`);
  if (prima.prezzo !== dopo.prezzo) cambi.push(`${euro(prima.prezzo)} → ${euro(dopo.prezzo)}`);
  if (prima.ingredienti !== dopo.ingredienti) cambi.push("ingredienti cambiati");
  if (cambi.length === 0) return `Confermata "${dopo.nome}" senza cambiamenti`;
  return `${dopo.nome}: ${cambi.join(", ")}`;
}

export const labelVoceTolta = (categoria: string, voce: Voce) =>
  `Tolta "${voce.nome}" da ${categoria}`;

const NOMI_SEZIONE: Record<Sezione, string> = {
  orari: "agli orari",
  chiusure: "alle chiusure",
  avviso: "all'avviso",
  consegna: "alla consegna",
  menu: "al menu",
};

/** La riga che descrive un annullamento: non cita la frase annullata. */
export const labelAnnullamento = (sezione: Sezione, at: string) =>
  `Annullata la modifica ${NOMI_SEZIONE[sezione]} delle ${at.slice(11, 16)} del ${dataBreve(at.slice(0, 10))}`;

/** "mer 28 ottobre · 19:41" */
export function dataRegistro(at: string): string {
  const [data, ora] = at.split("T");
  const giorno = new Date(`${data}T12:00:00Z`).getUTCDay(); // 0 = domenica
  return `${GIORNI[(giorno + 6) % 7].slice(0, 3)} ${dataBreve(data)} · ${ora}`;
}
