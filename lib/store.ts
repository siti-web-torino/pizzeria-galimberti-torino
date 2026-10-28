import "server-only";

import { Redis } from "@upstash/redis";

import { DATI_INIZIALI } from "./dati-iniziali";
import {
  registroSchema,
  schemiSezione,
  type Dati,
  type RigaRegistro,
  type Sezione,
} from "./schema";

/**
 * Il livello dati. È l'unico file che sa dove finiscono i dati.
 *
 * - Produzione: Upstash Redis, due chiavi JSON (dati e registro).
 * - Sviluppo in locale senza variabili: un file in .data/store.json, così
 *   `npm run dev` funziona appena scaricato il progetto.
 * - Produzione SENZA database collegato: nessun salvataggio. Il sito mostra
 *   i dati iniziali e l'admin lo dice chiaramente, invece di far finta di
 *   salvare (il disco dei server Vercel è in sola lettura).
 *
 * Qualunque guasto in lettura → il sito mostra i dati iniziali. Meglio
 * orari e menu del volantino che una pagina bianca il venerdì sera.
 */

const KEY_DATI = "galimberti:dati";
const KEY_REGISTRO = "galimberti:registro";

/** Oltre questo tempo il database si considera giù: il sito non aspetta. */
const TIMEOUT_MS = 2500;

interface Driver {
  tipo: "redis" | "file";
  read(key: string): Promise<unknown>;
  write(key: string, value: unknown): Promise<void>;
}

/* --- Upstash Redis -------------------------------------------------------- */

/**
 * Le credenziali, comunque si chiamino: l'integrazione del marketplace
 * Vercel usa KV_*, un database creato a mano su Upstash usa UPSTASH_*.
 */
function credenzialiRedis() {
  const env = process.env;
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

function driverRedis(credenziali: { url: string; token: string }): Driver {
  const redis = new Redis({ ...credenziali, retry: { retries: 1 } });
  return {
    tipo: "redis",
    read: (key) => redis.get(key),
    write: async (key, value) => {
      await redis.set(key, value);
    },
  };
}

/* --- File locale (solo sviluppo o prova) ---------------------------------- */

function driverFile(): Driver {
  const percorso = async () => {
    const path = await import("node:path");
    return path.join(process.cwd(), ".data", "store.json");
  };

  // Le scritture vanno in fila: ognuna riscrive tutto il file.
  let coda: Promise<unknown> = Promise.resolve();
  const inFila = <T,>(lavoro: () => Promise<T>): Promise<T> => {
    const prossimo = coda.then(lavoro, lavoro);
    coda = prossimo.catch(() => undefined);
    return prossimo;
  };

  const leggiTutto = async (): Promise<Record<string, unknown>> => {
    const fs = await import("node:fs/promises");
    try {
      return JSON.parse(await fs.readFile(await percorso(), "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return {};
      throw error;
    }
  };

  return {
    tipo: "file",
    read: async (key) => (await leggiTutto())[key] ?? null,
    write: (key, value) =>
      inFila(async () => {
        const fs = await import("node:fs/promises");
        const path = await import("node:path");
        const file = await percorso();
        const tutto = await leggiTutto();
        tutto[key] = value;
        // Scrive di fianco e rinomina: nessuno legge mai un file a metà.
        const temporaneo = `${file}.${process.pid}-${Math.random().toString(36).slice(2)}.tmp`;
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(temporaneo, JSON.stringify(tutto, null, 2), "utf8");
        await fs.rename(temporaneo, file);
      }),
  };
}

/* --- Scelta del driver ---------------------------------------------------- */

/**
 * Il file locale si usa solo fuori produzione, oppure se lo si chiede
 * apposta con STORE_FILE=1 (per provare `next start` sul proprio computer).
 */
function fileAmmesso(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.STORE_FILE === "1";
}

let driverInCache: Driver | null | undefined;

function driver(): Driver | null {
  if (driverInCache === undefined) {
    const credenziali = credenzialiRedis();
    driverInCache = credenziali
      ? driverRedis(credenziali)
      : fileAmmesso()
        ? driverFile()
        : null;
  }
  return driverInCache;
}

function conTimeout<T>(promessa: Promise<T>): Promise<T> {
  return Promise.race([
    promessa,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Il database non risponde")), TIMEOUT_MS),
    ),
  ]);
}

/* --- Stato del database, per l'admin --------------------------------------- */

export interface StatoDatabase {
  tipo: "redis" | "file" | "nessuno";
  /** Vero se le modifiche verrebbero salvate davvero. */
  salva: boolean;
  messaggio: string;
}

export async function statoDatabase(): Promise<StatoDatabase> {
  const d = driver();
  if (!d) {
    return {
      tipo: "nessuno",
      salva: false,
      messaggio:
        "Database non collegato. Il sito mostra i dati iniziali e le modifiche fatte qui NON verrebbero salvate.",
    };
  }

  try {
    await conTimeout(d.read(KEY_DATI));
  } catch {
    return {
      tipo: d.tipo,
      salva: false,
      messaggio:
        "Il database non risponde. Il sito sta mostrando i dati iniziali e le modifiche adesso NON verrebbero salvate. Riprova tra qualche minuto.",
    };
  }

  if (d.tipo === "file") {
    return {
      tipo: "file",
      salva: true,
      messaggio:
        "Modalità prova: le modifiche si salvano in un file su questo computer, non su internet.",
    };
  }

  return { tipo: "redis", salva: true, messaggio: "Database collegato." };
}

/* --- Lettura -------------------------------------------------------------- */

/**
 * Legge i dati del sito. Ogni sezione si valida da sola: se una è rovinata
 * si mostra quella iniziale, senza perdere le altre.
 */
export async function leggiDati(): Promise<Dati> {
  const d = driver();
  if (!d) return DATI_INIZIALI;

  let grezzi: unknown;
  try {
    grezzi = await conTimeout(d.read(KEY_DATI));
  } catch (error) {
    console.error("[store] lettura non riuscita, mostro i dati iniziali", error);
    return DATI_INIZIALI;
  }

  if (!grezzi || typeof grezzi !== "object") return DATI_INIZIALI;

  const risultato = { ...DATI_INIZIALI } as Record<Sezione, unknown>;
  for (const sezione of Object.keys(schemiSezione) as Sezione[]) {
    const parsed = schemiSezione[sezione].safeParse(
      (grezzi as Record<string, unknown>)[sezione],
    );
    if (parsed.success) risultato[sezione] = parsed.data;
    else if ((grezzi as Record<string, unknown>)[sezione] !== undefined) {
      console.error(`[store] sezione "${sezione}" non valida, uso quella iniziale`);
    }
  }
  return risultato as Dati;
}

/* --- Scrittura ------------------------------------------------------------ */

/**
 * Salva una sezione. Prima rilegge dal database: se la lettura non riesce
 * si ferma, perché scrivere partendo dai dati iniziali cancellerebbe le
 * altre modifiche del titolare.
 */
export async function salvaSezione<S extends Sezione>(
  sezione: S,
  valore: Dati[S],
): Promise<void> {
  const d = driver();
  if (!d) throw new Error("Database non collegato: modifica non salvata.");

  const grezzi = await conTimeout(d.read(KEY_DATI));
  const attuali = grezzi && typeof grezzi === "object" ? (grezzi as Partial<Dati>) : {};
  // Si scrive solo la versione validata: mai dati a metà.
  const pulito = schemiSezione[sezione].parse(valore);
  await conTimeout(d.write(KEY_DATI, { ...attuali, [sezione]: pulito }));
}

/* --- Registro delle modifiche --------------------------------------------- */

const RIGHE_REGISTRO = 100;

export async function leggiRegistro(): Promise<RigaRegistro[]> {
  const d = driver();
  if (!d) return [];
  try {
    const parsed = registroSchema.safeParse(await conTimeout(d.read(KEY_REGISTRO)));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function aggiungiAlRegistro(riga: RigaRegistro): Promise<void> {
  const d = driver();
  if (!d) return;
  const registro = await leggiRegistro();
  await conTimeout(d.write(KEY_REGISTRO, [riga, ...registro].slice(0, RIGHE_REGISTRO)));
}
