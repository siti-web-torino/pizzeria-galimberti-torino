import { z } from "zod";

/**
 * Le sole cose che il titolare può cambiare dall'admin: orari, chiusure e
 * ferie, avviso in cima, menu, consegna sì/no. Tutto il resto (telefoni,
 * indirizzo, testi, foto) è fisso e sta in lib/sito.ts.
 *
 * Nessun campo contiene dati personali.
 */

const ora = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Usa il formato HH:MM, per esempio 18:00");

const data = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Serve una data valida");

/* --- Orari ---------------------------------------------------------------- */

export const giornoSchema = z
  .object({
    /** 1 = lunedì … 7 = domenica (ISO-8601). */
    giorno: z.number().int().min(1).max(7),
    aperto: z.boolean(),
    da: ora,
    a: ora,
  })
  .refine((g) => !g.aperto || g.da < g.a, {
    message: "L'ora di chiusura deve venire dopo quella di apertura",
    path: ["a"],
  });

export const orariSchema = z.object({
  giorni: z.array(giornoSchema).length(7),
  /** Vero finché il titolare non li ha salvati almeno una volta dall'admin. */
  daConfermare: z.boolean().default(false),
});

export type Giorno = z.infer<typeof giornoSchema>;
export type Orari = z.infer<typeof orariSchema>;

/* --- Chiusure e ferie ----------------------------------------------------- */

export const chiusuraSchema = z
  .object({
    id: z.string().min(1),
    dal: data,
    al: data,
    /** Facoltativa: "Ferie", "Chiuso per lavori"… */
    nota: z.string().trim().max(80).default(""),
  })
  .refine((c) => c.dal <= c.al, {
    message: "La data di fine deve venire dopo quella di inizio",
    path: ["al"],
  });

export const chiusureSchema = z.array(chiusuraSchema).max(30);
export type Chiusura = z.infer<typeof chiusuraSchema>;

/* --- Avviso in cima ------------------------------------------------------- */

export const avvisoSchema = z
  .object({
    attivo: z.boolean(),
    testo: z.string().trim().max(160, "Massimo 160 caratteri: deve stare in due righe"),
  })
  .refine((a) => !a.attivo || a.testo.length >= 3, {
    message: "Scrivi il testo dell'avviso, o spegnilo",
    path: ["testo"],
  });

export type Avviso = z.infer<typeof avvisoSchema>;

/* --- Consegna ------------------------------------------------------------- */

export const consegnaSchema = z.object({ attiva: z.boolean() });
export type Consegna = z.infer<typeof consegnaSchema>;

/* --- Menu ----------------------------------------------------------------- */

export const voceSchema = z.object({
  id: z.string().min(1),
  nome: z.string().trim().min(2, "Serve un nome").max(60),
  ingredienti: z.string().trim().max(160).default(""),
  /** In centesimi: 850 = € 8,50. */
  prezzo: z
    .number()
    .int("Prezzo non valido")
    .min(0, "Prezzo non valido")
    .max(100_00, "Prezzo troppo alto: controlla"),
  /** Letta con dubbio dal volantino: mostra [DA CONFERMARE] accanto. */
  daConfermare: z.boolean().default(false),
});

export const categoriaSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  nota: z.string().default(""),
  voci: z.array(voceSchema).max(80),
});

export const menuSchema = z.object({
  /** Falso finché il titolare non ha detto "il menu è giusto". */
  confermato: z.boolean().default(false),
  categorie: z.array(categoriaSchema),
});

export type Voce = z.infer<typeof voceSchema>;
export type Categoria = z.infer<typeof categoriaSchema>;
export type Menu = z.infer<typeof menuSchema>;

/* --- Tutto insieme -------------------------------------------------------- */

export const datiSchema = z.object({
  orari: orariSchema,
  chiusure: chiusureSchema,
  avviso: avvisoSchema,
  consegna: consegnaSchema,
  menu: menuSchema,
});

export type Dati = z.infer<typeof datiSchema>;
export type Sezione = keyof Dati;

/* --- Registro delle modifiche -------------------------------------------- */

/**
 * Una riga del registro. Porta con sé la sezione com'era prima: è questo
 * che permette di annullare con un tocco, senza ricordarsi niente.
 */
export const rigaRegistroSchema = z.object({
  id: z.string().min(1),
  /** "2026-10-28T19:41", ora di Torino. */
  at: z.string(),
  sezione: z.enum(["orari", "chiusure", "avviso", "consegna", "menu"]),
  /** La frase già pronta: "ha cambiato il prezzo di Margherita da € 5,50 a € 6,00". */
  label: z.string(),
  /** La sezione intera prima della modifica. Si valida quando si ripristina. */
  prima: z.unknown().nullable().default(null),
});

export const registroSchema = z.array(rigaRegistroSchema);
export type RigaRegistro = z.infer<typeof rigaRegistroSchema>;

/** Lo schema giusto per ogni sezione: serve a validare un ripristino. */
export const schemiSezione = {
  orari: orariSchema,
  chiusure: chiusureSchema,
  avviso: avvisoSchema,
  consegna: consegnaSchema,
  menu: menuSchema,
} as const;

export function nuovoId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}
