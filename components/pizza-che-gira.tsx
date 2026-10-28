"use client";

import { useEffect, useRef } from "react";

/**
 * "La pizza che gira": la pizza vista dall'alto (pizza2.png, ritagliata in
 * cerchio) entra con mezzo giro e poi ruota mentre si scorre, come sulla
 * pala davanti al forno.
 *
 * Con "riduci movimento" sta ferma. Senza JavaScript sta ferma e basta.
 */

/** Gradi di rotazione per ogni pixel scorso. */
const GRADI_PER_PIXEL = 0.12;

export default function PizzaCheGira({
  src,
  w,
  h,
  alt,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
}) {
  const immagine = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = immagine.current;
    if (!img) return;
    const fermo = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    const ruota = () => {
      img.style.transform = fermo.matches
        ? ""
        : `rotate(${(window.scrollY * GRADI_PER_PIXEL).toFixed(2)}deg)`;
    };
    const alloScorrere = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(ruota);
    };

    ruota();
    window.addEventListener("scroll", alloScorrere, { passive: true });
    fermo.addEventListener("change", ruota);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", alloScorrere);
      fermo.removeEventListener("change", ruota);
    };
  }, []);

  return (
    <div className="pizza-giro">
      <div className="pizza-giro-disco">
        <img ref={immagine} src={src} width={w} height={h} alt={alt} fetchPriority="high" />
      </div>
    </div>
  );
}
