import "server-only";

import { cookies } from "next/headers";

import { problemiConfigurazione } from "./config-sicurezza";

/**
 * Autenticazione minima, ripresa dall'architettura di Flow: una password
 * in una variabile d'ambiente e un cookie firmato (HMAC) che dura trenta
 * giorni. Niente utenti, niente database delle sessioni.
 *
 * Differenza voluta: il cookie non porta nessun nome. L'admin è del solo
 * titolare e non si salva nessun dato personale.
 */

const COOKIE = "galimberti_admin";
const GIORNI_SESSIONE = 30;

const encoder = new TextEncoder();

function segreto(): string {
  const valore = process.env.AUTH_SECRET;
  if (!valore || valore.length < 16) {
    throw new Error("AUTH_SECRET mancante o troppo corta. Vedi .env.example.");
  }
  return valore;
}

async function hmac(messaggio: string): Promise<string> {
  const chiave = await crypto.subtle.importKey(
    "raw",
    encoder.encode(segreto()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const firma = await crypto.subtle.sign("HMAC", chiave, encoder.encode(messaggio));
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Confronto a tempo costante, passando dalle digest SHA-256. */
async function uguali(a: string, b: string): Promise<boolean> {
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

/**
 * Vero se la password è giusta. In produzione rifiuta sempre se la
 * configurazione non è sicura (stesso controllo di instrumentation.ts).
 */
export async function passwordGiusta(input: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) return false;
  if (process.env.NODE_ENV === "production" && problemiConfigurazione().length > 0) {
    return false;
  }
  return uguali(input, password);
}

export async function apriSessione(): Promise<void> {
  const scadenza = Date.now() + GIORNI_SESSIONE * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: scadenza })).toString("base64url");
  const token = `${payload}.${await hmac(payload)}`;

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GIORNI_SESSIONE * 24 * 60 * 60,
  });
}

export async function chiudiSessione(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function autenticato(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const separatore = token.lastIndexOf(".");
  if (separatore < 1) return false;

  const payload = token.slice(0, separatore);
  const firma = token.slice(separatore + 1);

  try {
    if (!(await uguali(firma, await hmac(payload)))) return false;
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isFinite(exp) && exp > Date.now();
  } catch {
    // Cookie manomesso o segreto cambiato: si rifà il login.
    return false;
  }
}
