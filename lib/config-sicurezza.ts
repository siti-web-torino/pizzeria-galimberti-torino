/**
 * Controlli sulla configurazione, fatti all'avvio del server
 * (instrumentation.ts) e prima di ogni login.
 *
 * Niente "server-only" qui: lo importa instrumentation.ts, che Next
 * carica fuori dall'albero dei componenti.
 */

/** Il valore scritto in .env.example: chi lo lascia così non ha scelto niente. */
export const PASSWORD_DI_ESEMPIO = "scegli-una-password-lunga";
export const SEGRETO_DI_ESEMPIO = "genera-una-stringa-lunga-e-casuale";

const LUNGHEZZA_MINIMA = 10;

export function problemiConfigurazione(env = process.env): string[] {
  const problemi: string[] = [];
  const password = (env.ADMIN_PASSWORD ?? "").trim();
  const segreto = (env.AUTH_SECRET ?? "").trim();

  if (!password) problemi.push("ADMIN_PASSWORD è vuota.");
  else if (password === PASSWORD_DI_ESEMPIO) {
    problemi.push("ADMIN_PASSWORD è ancora il valore di esempio di .env.example.");
  } else if (password.length < LUNGHEZZA_MINIMA) {
    problemi.push(`ADMIN_PASSWORD è troppo corta (minimo ${LUNGHEZZA_MINIMA} caratteri).`);
  }

  if (!segreto || segreto === SEGRETO_DI_ESEMPIO || segreto.length < 32) {
    problemi.push("AUTH_SECRET manca o è debole. Generala con: openssl rand -base64 32");
  }

  return problemi;
}
