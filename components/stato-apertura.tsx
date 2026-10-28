"use client";

import { useEffect, useState } from "react";

import { statoApertura, type Stato } from "@/lib/apertura";
import type { Chiusura, Orari } from "@/lib/schema";

/**
 * "Aperto adesso" calcolato nel browser, sull'ora di Torino, e aggiornato
 * ogni minuto: la pagina è in cache sul server e uno stato calcolato lì
 * potrebbe essere vecchio di qualche minuto, proprio a cavallo delle 18.
 */
export default function StatoApertura({
  orari,
  chiusure,
  riassunto,
}: {
  orari: Orari;
  chiusure: Chiusura[];
  /** Mostrato prima che il browser calcoli lo stato: "Mar-dom 18:00-22:30". */
  riassunto: string;
}) {
  const [stato, setStato] = useState<Stato | null>(null);

  useEffect(() => {
    const aggiorna = () => setStato(statoApertura(orari, chiusure));
    aggiorna();
    const timer = setInterval(aggiorna, 60_000);
    return () => clearInterval(timer);
  }, [orari, chiusure]);

  return (
    <p className="stato" data-tipo={stato?.tipo ?? "riassunto"} aria-live="polite">
      {stato?.testo ?? riassunto}
    </p>
  );
}
