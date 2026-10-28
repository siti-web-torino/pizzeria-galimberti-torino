"use client";

import { useEffect, useState } from "react";

/**
 * Le categorie del menu come schede.
 *
 * Da telefono si vede una categoria alla volta: senza, il menu è lungo
 * undici schermate e per arrivare agli orari si scorre per un minuto.
 * Da tablet in su si vedono tutte in colonne e le schede fanno solo da
 * scorciatoia. Senza JavaScript il menu resta tutto visibile.
 */
export default function SchedeMenu({
  categorie,
  contenitore,
}: {
  categorie: { id: string; etichetta: string }[];
  /** id dell'elemento che contiene le categorie. */
  contenitore: string;
}) {
  const [attiva, setAttiva] = useState(categorie[0]?.id ?? "");

  useEffect(() => {
    /**
     * Mostra la categoria subito, nel DOM, prima che il browser segua il
     * link: se fosse ancora nascosta non ci scorrerebbe fino.
     */
    function mostra(id: string) {
      const el = document.getElementById(contenitore);
      if (!el) return;
      for (const categoria of el.querySelectorAll<HTMLElement>(".categoria")) {
        categoria.toggleAttribute("data-nascosta", categoria.id !== `cat-${id}`);
      }
      setAttiva(id);
    }

    mostra(categorie[0]?.id ?? "");

    // Vale anche per i link da fuori dalle schede ("Vedi le speciali").
    function alClic(evento: MouseEvent) {
      const link = (evento.target as Element).closest?.('a[href^="#cat-"]');
      if (link) mostra(link.getAttribute("href")!.slice(5));
    }
    document.addEventListener("click", alClic, true);
    return () => document.removeEventListener("click", alClic, true);
  }, [categorie, contenitore]);

  return (
    <nav className="categorie" aria-label="Categorie del menu">
      <ul>
        {categorie.map((c) => (
          <li key={c.id}>
            <a
              href={`#cat-${c.id}`}
              aria-current={c.id === attiva ? "true" : undefined}
            >
              {c.etichetta}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
