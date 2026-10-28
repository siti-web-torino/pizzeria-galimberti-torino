"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";

import { apriSessione, autenticato, chiudiSessione, passwordGiusta } from "@/lib/auth";
import {
  labelAnnullamento,
  labelAvviso,
  labelChiusuraAggiunta,
  labelChiusuraTolta,
  labelConsegna,
  labelOrari,
  labelVoce,
  labelVoceTolta,
  riga,
} from "@/lib/registro";
import {
  avvisoSchema,
  chiusuraSchema,
  consegnaSchema,
  nuovoId,
  orariSchema,
  schemiSezione,
  voceSchema,
  type Dati,
  type Sezione,
} from "@/lib/schema";
import {
  aggiungiAlRegistro,
  leggiDati,
  leggiRegistro,
  salvaSezione,
  statoDatabase,
} from "@/lib/store";

/**
 * Le server action dell'admin. Ognuna: controlla la sessione, controlla
 * che il database salvi davvero, valida con Zod, salva la sezione, scrive
 * nel registro com'era prima (per l'Annulla) e rigenera la home.
 */

export interface Esito {
  ok: boolean;
  messaggio?: string;
  /** Un messaggio per campo, sotto l'input che lo riguarda. */
  errori?: Record<string, string>;
}

const SCADUTA: Esito = {
  ok: false,
  messaggio: "Accesso scaduto. Ricarica la pagina e rientra.",
};

function erroriCampi(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = issue.path.join(".");
    if (campo && !out[campo]) out[campo] = issue.message;
  }
  return out;
}

/** Controlli comuni prima di ogni scrittura. Null se si può procedere. */
async function prima(): Promise<Esito | null> {
  if (!(await autenticato())) return SCADUTA;
  const db = await statoDatabase();
  if (!db.salva) return { ok: false, messaggio: `Non salvato. ${db.messaggio}` };
  return null;
}

/** Salva, registra e rigenera. Gli errori del database diventano un messaggio. */
async function scrivi<S extends Sezione>(
  sezione: S,
  vecchio: Dati[S],
  nuovo: Dati[S],
  label: string,
  ok: string,
): Promise<Esito> {
  try {
    await salvaSezione(sezione, nuovo);
  } catch (error) {
    console.error("[admin] salvataggio non riuscito", error);
    return {
      ok: false,
      messaggio: "Non salvato: il database non ha risposto. Riprova tra un minuto.",
    };
  }

  try {
    await aggiungiAlRegistro(riga(sezione, label, vecchio));
  } catch (error) {
    // La modifica è salva; manca solo la riga del registro.
    console.error("[admin] registro non aggiornato", error);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, messaggio: ok };
}

/** "8,50" / "8.5" / "8" → 850. NaN se non è un prezzo. */
function centesimi(testo: FormDataEntryValue | null): number {
  const pulito = String(testo ?? "")
    .replace(/€/g, "")
    .trim()
    .replace(",", ".");
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(pulito)) return Number.NaN;
  return Math.round(Number(pulito) * 100);
}

/* --- Accesso -------------------------------------------------------------- */

export async function entra(_: Esito | null, form: FormData): Promise<Esito> {
  const password = String(form.get("password") ?? "");

  // Mezzo secondo di attesa: rende scomodo provare password a raffica.
  await new Promise((r) => setTimeout(r, 500));

  if (!password || !(await passwordGiusta(password))) {
    return { ok: false, messaggio: "Password sbagliata." };
  }

  await apriSessione();
  redirect("/admin");
}

export async function esci(): Promise<void> {
  await chiudiSessione();
  redirect("/admin");
}

/* --- Avviso --------------------------------------------------------------- */

export async function salvaAvviso(_: Esito | null, form: FormData): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const parsed = avvisoSchema.safeParse({
    attivo: form.get("attivo") === "on",
    testo: String(form.get("testo") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, messaggio: "Controlla l'avviso.", errori: erroriCampi(parsed.error) };
  }

  const { avviso } = await leggiDati();
  return scrivi(
    "avviso",
    avviso,
    parsed.data,
    labelAvviso(avviso, parsed.data),
    parsed.data.attivo ? "Avviso pubblicato." : "Avviso spento.",
  );
}

/* --- Orari ---------------------------------------------------------------- */

export async function salvaOrari(_: Esito | null, form: FormData): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const parsed = orariSchema.safeParse({
    giorni: [1, 2, 3, 4, 5, 6, 7].map((g) => ({
      giorno: g,
      aperto: form.get(`aperto-${g}`) === "on",
      da: String(form.get(`da-${g}`) ?? ""),
      a: String(form.get(`a-${g}`) ?? ""),
    })),
    // Salvati dal titolare: non sono più da confermare.
    daConfermare: false,
  });
  if (!parsed.success) {
    return { ok: false, messaggio: "Controlla gli orari segnati.", errori: erroriCampi(parsed.error) };
  }

  const { orari } = await leggiDati();
  return scrivi("orari", orari, parsed.data, labelOrari(orari, parsed.data), "Orari salvati.");
}

/* --- Chiusure e ferie ----------------------------------------------------- */

export async function aggiungiChiusura(_: Esito | null, form: FormData): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const dal = String(form.get("dal") ?? "");
  const parsed = chiusuraSchema.safeParse({
    id: nuovoId(),
    dal,
    // Un giorno solo: basta la prima data.
    al: String(form.get("al") || dal),
    nota: String(form.get("nota") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, messaggio: "Controlla le date.", errori: erroriCampi(parsed.error) };
  }

  const { chiusure } = await leggiDati();
  if (chiusure.length >= 30) {
    return { ok: false, messaggio: "Troppe chiusure in elenco: togli quelle passate." };
  }
  return scrivi(
    "chiusure",
    chiusure,
    [...chiusure, parsed.data].sort((a, b) => a.dal.localeCompare(b.dal)),
    labelChiusuraAggiunta(parsed.data),
    "Chiusura aggiunta.",
  );
}

export async function togliChiusura(id: string): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const { chiusure } = await leggiDati();
  const target = chiusure.find((c) => c.id === id);
  if (!target) return { ok: false, messaggio: "Chiusura non trovata." };

  return scrivi(
    "chiusure",
    chiusure,
    chiusure.filter((c) => c.id !== id),
    labelChiusuraTolta(target),
    "Chiusura tolta.",
  );
}

/* --- Consegna ------------------------------------------------------------- */

export async function salvaConsegna(attiva: boolean): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const nuovo = consegnaSchema.parse({ attiva });
  const { consegna } = await leggiDati();
  return scrivi(
    "consegna",
    consegna,
    nuovo,
    labelConsegna(nuovo),
    attiva ? "Consegna attiva." : "Consegna sospesa: il sito dice solo ritiro.",
  );
}

/* --- Menu ----------------------------------------------------------------- */

export async function salvaVoce(_: Esito | null, form: FormData): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const idCategoria = String(form.get("categoria") ?? "");
  const id = String(form.get("id") ?? "").trim();

  const parsed = voceSchema.safeParse({
    id: id || nuovoId(),
    nome: String(form.get("nome") ?? ""),
    ingredienti: String(form.get("ingredienti") ?? ""),
    prezzo: centesimi(form.get("prezzo")),
    // Salvata dal titolare: confermata.
    daConfermare: false,
  });
  if (!parsed.success) {
    const errori = erroriCampi(parsed.error);
    if (errori.prezzo) errori.prezzo = "Scrivi il prezzo così: 8,50";
    return { ok: false, messaggio: "Controlla i campi segnati.", errori };
  }

  const { menu } = await leggiDati();
  const categoria = menu.categorie.find((c) => c.id === idCategoria);
  if (!categoria) return { ok: false, messaggio: "Categoria non trovata." };

  const indice = categoria.voci.findIndex((v) => v.id === parsed.data.id);
  const vecchia = indice >= 0 ? categoria.voci[indice] : null;

  const nuovo = structuredClone(menu);
  const cat = nuovo.categorie.find((c) => c.id === idCategoria)!;
  if (indice >= 0) cat.voci[indice] = parsed.data;
  else cat.voci.push(parsed.data);

  return scrivi(
    "menu",
    menu,
    nuovo,
    labelVoce(categoria.nome, vecchia, parsed.data),
    vecchia ? "Salvato." : "Aggiunto al menu.",
  );
}

export async function togliVoce(idCategoria: string, id: string): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const { menu } = await leggiDati();
  const categoria = menu.categorie.find((c) => c.id === idCategoria);
  const voce = categoria?.voci.find((v) => v.id === id);
  if (!categoria || !voce) return { ok: false, messaggio: "Voce non trovata." };

  const nuovo = structuredClone(menu);
  const cat = nuovo.categorie.find((c) => c.id === idCategoria)!;
  cat.voci = cat.voci.filter((v) => v.id !== id);

  return scrivi("menu", menu, nuovo, labelVoceTolta(categoria.nome, voce), "Tolto dal menu.");
}

/** "Ho controllato tutto il menu": toglie i [DA CONFERMARE] dal menu. */
export async function confermaMenu(): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const { menu } = await leggiDati();
  const nuovo = structuredClone(menu);
  nuovo.confermato = true;
  for (const c of nuovo.categorie) for (const v of c.voci) v.daConfermare = false;

  return scrivi(
    "menu",
    menu,
    nuovo,
    "Menu confermato tutto: tolti i [DA CONFERMARE]",
    "Menu confermato.",
  );
}

/* --- Annulla -------------------------------------------------------------- */

/**
 * Rimette la sezione com'era prima di una modifica, usando la fotografia
 * salvata nel registro. Anche l'annullamento finisce nel registro, con la
 * sua fotografia: si può annullare anche quello.
 */
export async function annulla(idRiga: string): Promise<Esito> {
  const blocco = await prima();
  if (blocco) return blocco;

  const voce = (await leggiRegistro()).find((r) => r.id === idRiga);
  if (!voce || voce.prima === null) {
    return { ok: false, messaggio: "Per questa riga non c'è niente da ripristinare." };
  }

  const parsed = schemiSezione[voce.sezione].safeParse(voce.prima);
  if (!parsed.success) {
    return { ok: false, messaggio: "La copia salvata non è più valida: non si può ripristinare." };
  }

  const attuali = await leggiDati();
  return scrivi(
    voce.sezione,
    attuali[voce.sezione],
    parsed.data as Dati[typeof voce.sezione],
    labelAnnullamento(voce.sezione, voce.at),
    "Ripristinato com'era prima.",
  );
}
