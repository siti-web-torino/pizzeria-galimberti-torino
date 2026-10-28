/**
 * Il riquadro visibile [DA CONFERMARE]: ogni dato mancante o letto con
 * dubbio lo porta accanto, finché il locale non lo conferma.
 */
export function DaConfermare({ motivo }: { motivo?: string }) {
  return (
    <span className="dc" title={motivo}>
      [DA CONFERMARE]
    </span>
  );
}
