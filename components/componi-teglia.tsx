"use client";

import { useState } from "react";

import { IconaTelefono } from "./icone";

/**
 * "Componi la tua teglia": il volantino (menu2.png) dice che le teglie si
 * personalizzano "mettendo fino a 4 gusti diversi". Qui si toccano i gusti
 * e la teglia della foto (teglia.png) si taglia da sola in 1-4 parti.
 *
 * Non è un ordine online: alla fine si chiama, o si copia il testo da
 * mandare. Prezzi, misure e preavviso delle teglie non sono nel materiale.
 */

const MASSIMO = 4;

export default function ComponiTeglia({
  gusti,
  foto,
  telefono,
}: {
  gusti: string[];
  foto: string;
  telefono: { tel: string; mostra: string };
}) {
  const [scelti, setScelti] = useState<string[]>([]);
  const [copiato, setCopiato] = useState(false);

  const pieno = scelti.length >= MASSIMO;
  const testo = scelti.length
    ? `Vorrei una teglia con: ${scelti.join(", ")}.`
    : "";

  function cambia(gusto: string) {
    setCopiato(false);
    setScelti((attuali) =>
      attuali.includes(gusto)
        ? attuali.filter((g) => g !== gusto)
        : attuali.length < MASSIMO
          ? [...attuali, gusto]
          : attuali,
    );
  }

  async function copia() {
    try {
      await navigator.clipboard.writeText(testo);
      setCopiato(true);
    } catch {
      setCopiato(false);
    }
  }

  // 1-3 gusti: fette affiancate. 4 gusti: due file da due.
  const file = scelti.length === 4 ? [scelti.slice(0, 2), scelti.slice(2)] : [scelti];

  return (
    <div className="teglia-gioco">
      <div
        className="teglia"
        style={{ backgroundImage: `url(${foto})` }}
        role="img"
        aria-label={
          scelti.length
            ? `Teglia divisa in ${scelti.length}: ${scelti.join(", ")}`
            : "Teglia intera, ancora senza gusti scelti"
        }
      >
        {scelti.length === 0 ? (
          <p className="teglia-vuota">Tocca i gusti qui sotto</p>
        ) : (
          file.map((fila, i) => (
            <div className="teglia-fila" key={`${scelti.length}-${i}`}>
              {fila.map((gusto) => (
                <div className="teglia-pezzo" key={gusto}>
                  <span>{gusto}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <p className="teglia-conta" aria-live="polite">
        {scelti.length === 0
          ? `Scegli fino a ${MASSIMO} gusti`
          : pieno
            ? `${MASSIMO} gusti su ${MASSIMO}: teglia completa`
            : `${scelti.length} di ${MASSIMO} gusti`}
      </p>

      <ul className="teglia-gusti" aria-label="Gusti per la teglia">
        {gusti.map((gusto) => {
          const scelto = scelti.includes(gusto);
          return (
            <li key={gusto}>
              <button
                type="button"
                aria-pressed={scelto}
                disabled={pieno && !scelto}
                onClick={() => cambia(gusto)}
              >
                {gusto}
              </button>
            </li>
          );
        })}
      </ul>

      {scelti.length > 0 ? (
        <div className="teglia-ordine">
          <p>{testo}</p>
          <div className="azioni">
            <a className="bottone bottone-rosso" href={`tel:${telefono.tel}`}>
              <IconaTelefono />
              Chiama per ordinarla
            </a>
            <button type="button" className="bottone bottone-chiaro" onClick={copia}>
              {copiato ? "Copiato" : "Copia l'ordine"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
