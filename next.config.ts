import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from "next/constants";

import { problemiConfigurazione } from "./lib/config-sicurezza";

/**
 * Sito demo: niente indicizzazione finché il cliente non dice di sì.
 * L'intestazione vale anche per file e immagini, dove il meta tag non arriva.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

/**
 * Build di produzione e `next start` si fermano subito se la password
 * dell'admin è vuota, d'esempio o troppo corta. Su Vercel questo file gira
 * solo durante la build: a runtime fa lo stesso controllo instrumentation.ts.
 */
export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER) {
    const problemi = problemiConfigurazione();
    if (problemi.length > 0) {
      throw new Error(
        `Configurazione non sicura, mi fermo:\n- ${problemi.join("\n- ")}\nVedi .env.example.`,
      );
    }
  }
  return nextConfig;
}
