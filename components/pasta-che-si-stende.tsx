"use client";

import { useEffect, useRef } from "react";

/**
 * "La pasta che si stende": le righe del volantino (menu2.png) partono
 * strette e, mentre si scorre, si allargano fino a comporre il blocco
 * giustificato del volantino vero, con le righe tutte della stessa larghezza.
 * Tornando su si restringono. È l'asse di larghezza del font Archivo
 * (62%-125%), quindi niente immagini e niente librerie.
 *
 * Senza JavaScript le righe restano come da CSS. Con "riduci movimento"
 * si vede subito il blocco finito, senza animazione.
 */

const STRETTA = 62;
const LARGA = 125;
/** Oltre questa dimensione una parola corta diventerebbe un manifesto. */
const CARATTERE_MASSIMO = 150;

export default function PastaCheSiStende({ righe }: { righe: string[] }) {
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = lista.current;
    if (!ul) return;
    const voci = [...ul.querySelectorAll<HTMLElement>("li > span")];
    const fermo = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Per ogni riga, la dimensione che la fa arrivare da bordo a bordo. */
    function misura() {
      const larghezza = ul!.clientWidth;
      for (const voce of voci) {
        voce.style.fontSize = "100px";
        voce.style.fontStretch = `${LARGA}%`;
        const naturale = voce.getBoundingClientRect().width || 1;
        const dimensione = Math.min(CARATTERE_MASSIMO, (100 * larghezza) / naturale);
        voce.style.fontSize = `${dimensione.toFixed(2)}px`;
      }
      ul!.dataset.pronta = "";
      aggiorna();
    }

    function aggiorna() {
      const alto = window.innerHeight;
      for (const voce of voci) {
        let p = 1;
        if (!fermo.matches) {
          // Comincia a stendersi quando entra dal basso, è stesa al 60% dello schermo.
          const top = voce.getBoundingClientRect().top;
          p = Math.min(1, Math.max(0, (alto * 0.95 - top) / (alto * 0.35)));
          p = 1 - (1 - p) ** 3;
        }
        voce.style.fontStretch = `${(STRETTA + (LARGA - STRETTA) * p).toFixed(1)}%`;
      }
    }

    let frame = 0;
    const alloScorrere = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(aggiorna);
    };

    // Si rimisura solo se cambia la larghezza: l'altezza cambia per colpa nostra.
    let ultimaLarghezza = 0;
    const osservatore = new ResizeObserver(() => {
      if (ul.clientWidth !== ultimaLarghezza) {
        ultimaLarghezza = ul.clientWidth;
        misura();
      }
    });
    document.fonts.ready.then(() => osservatore.observe(ul));
    window.addEventListener("scroll", alloScorrere, { passive: true });
    fermo.addEventListener("change", aggiorna);

    return () => {
      cancelAnimationFrame(frame);
      osservatore.disconnect();
      window.removeEventListener("scroll", alloScorrere);
      fermo.removeEventListener("change", aggiorna);
    };
  }, []);

  return (
    <ul className="elenco-volantino" ref={lista}>
      {righe.map((riga) => (
        <li key={riga}>
          <span>{riga}</span>
        </li>
      ))}
    </ul>
  );
}
