import { problemiConfigurazione } from "./lib/config-sicurezza";

/**
 * Gira una volta all'avvio di ogni istanza del server.
 *
 * In produzione il sito si rifiuta di partire se la password dell'admin è
 * vuota o è quella di esempio: un'admin aperta a chiunque legga
 * .env.example è peggio di un sito spento.
 */
export function register() {
  if (process.env.NODE_ENV !== "production") return;

  const problemi = problemiConfigurazione();
  if (problemi.length === 0) return;

  const messaggio = `[avvio] Configurazione non sicura, il server non parte:\n- ${problemi.join("\n- ")}`;
  console.error(messaggio);
  throw new Error(messaggio);
}
