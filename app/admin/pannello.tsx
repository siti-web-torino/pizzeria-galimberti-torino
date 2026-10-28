"use client";

import { useActionState, useState, useTransition } from "react";

import { GIORNI, dataBreve, riassuntoOrari } from "@/lib/apertura";
import { dataRegistro } from "@/lib/registro";
import type { Categoria, Dati, RigaRegistro, Voce } from "@/lib/schema";
import { euro } from "@/lib/sito";
import type { StatoDatabase } from "@/lib/store";

import {
  aggiungiChiusura,
  annulla,
  confermaMenu,
  esci,
  salvaAvviso,
  salvaConsegna,
  salvaOrari,
  salvaVoce,
  togliChiusura,
  togliVoce,
  type Esito,
} from "./actions";

/**
 * Il pannello del titolare. Pensato per il telefono: una sezione aperta
 * alla volta, campi grandi, una conferma per ogni salvataggio.
 * Si cambiano SOLO avviso, orari, chiusure, consegna e menu.
 */
export default function Pannello({
  dati,
  registro,
  db,
}: {
  dati: Dati;
  registro: RigaRegistro[];
  db: StatoDatabase;
}) {
  const bloccato = !db.salva;

  return (
    <main className="a-pannello">
      <header className="a-testa">
        <div>
          <h1>Gestione del sito</h1>
          <a href="/" target="_blank" rel="noopener">
            Apri il sito
          </a>
        </div>
        <form action={esci}>
          <button type="submit" className="a-link">
            Esci
          </button>
        </form>
      </header>

      <p className={`a-db a-db-${db.tipo}${bloccato ? " a-db-ko" : ""}`} role={bloccato ? "alert" : "status"}>
        <strong>{bloccato ? "Attenzione: " : ""}</strong>
        {db.messaggio}
      </p>

      <fieldset disabled={bloccato} className="a-campi">
        <legend className="a-nascosto">Modifiche al sito</legend>

        <Sezione titolo="Avviso in cima" riassunto={dati.avviso.attivo ? `Acceso: "${dati.avviso.testo}"` : "Spento"}>
          <FormAvviso avviso={dati.avviso} />
        </Sezione>

        <Sezione titolo="Orari" riassunto={riassuntoOrari(dati.orari)}>
          <FormOrari orari={dati.orari} />
        </Sezione>

        <Sezione
          titolo="Ferie e chiusure"
          riassunto={dati.chiusure.length ? `${dati.chiusure.length} in elenco` : "Nessuna"}
        >
          <Chiusure dati={dati} />
        </Sezione>

        <Sezione titolo="Consegna a domicilio" riassunto={dati.consegna.attiva ? "Sì" : "No, solo ritiro"}>
          <Consegna attiva={dati.consegna.attiva} />
        </Sezione>

        <Sezione
          titolo="Menu e prezzi"
          riassunto={dati.menu.confermato ? "Confermato" : "Da confermare"}
        >
          <MenuEditor menu={dati.menu} />
        </Sezione>

        <Sezione titolo="Ultime modifiche" riassunto={registro.length ? `${registro.length}` : "Nessuna"}>
          <Registro registro={registro} />
        </Sezione>
      </fieldset>
    </main>
  );
}

/* --- Pezzi comuni ---------------------------------------------------------- */

function Sezione({
  titolo,
  riassunto,
  children,
}: {
  titolo: string;
  riassunto: string;
  children: React.ReactNode;
}) {
  return (
    <details className="a-sezione">
      <summary>
        <span className="a-titolo">{titolo}</span>
        <span className="a-riassunto">{riassunto}</span>
      </summary>
      <div className="a-corpo">{children}</div>
    </details>
  );
}

function Messaggio({ esito }: { esito: Esito | null }) {
  if (!esito?.messaggio) return null;
  return (
    <p className={esito.ok ? "a-ok" : "a-errore"} role={esito.ok ? "status" : "alert"}>
      {esito.messaggio}
    </p>
  );
}

function Errore({ esito, campo }: { esito: Esito | null; campo: string }) {
  const testo = esito?.errori?.[campo];
  return testo ? <span className="a-errore-campo">{testo}</span> : null;
}

function Salva({ inCorso, testo = "Salva" }: { inCorso: boolean; testo?: string }) {
  return (
    <button type="submit" className="a-bottone" disabled={inCorso}>
      {inCorso ? "Salvo…" : testo}
    </button>
  );
}

/* --- Avviso ---------------------------------------------------------------- */

function FormAvviso({ avviso }: { avviso: Dati["avviso"] }) {
  const [esito, azione, inCorso] = useActionState(salvaAvviso, null);
  const [testo, setTesto] = useState(avviso.testo);

  return (
    <form action={azione} className="a-form">
      <p className="a-aiuto">
        Una riga in cima al sito, per esempio: &quot;Stasera chiudiamo alle 21:30&quot;.
      </p>
      <label className="a-spunta">
        <input type="checkbox" name="attivo" defaultChecked={avviso.attivo} />
        Mostra l&apos;avviso sul sito
      </label>
      <label htmlFor="testo-avviso">Testo</label>
      <textarea
        id="testo-avviso"
        name="testo"
        rows={3}
        maxLength={160}
        value={testo}
        onChange={(e) => setTesto(e.target.value)}
      />
      <span className="a-aiuto">{testo.length}/160</span>
      <Errore esito={esito} campo="testo" />
      <Salva inCorso={inCorso} />
      <Messaggio esito={esito} />
    </form>
  );
}

/* --- Orari ----------------------------------------------------------------- */

function FormOrari({ orari }: { orari: Dati["orari"] }) {
  const [esito, azione, inCorso] = useActionState(salvaOrari, null);
  const giorni = [...orari.giorni].sort((a, b) => a.giorno - b.giorno);

  return (
    <form action={azione} className="a-form">
      {orari.daConfermare ? (
        <p className="a-aiuto a-giallo">
          Orari presi dal volantino. Il lunedì chiuso è una deduzione. Salvandoli li confermi.
        </p>
      ) : null}
      <div className="a-orari">
        {giorni.map((g, i) => (
          <fieldset key={g.giorno} className="a-giorno">
            <legend>{GIORNI[g.giorno - 1]}</legend>
            <label className="a-spunta">
              <input type="checkbox" name={`aperto-${g.giorno}`} defaultChecked={g.aperto} />
              Aperto
            </label>
            <label>
              <span className="a-nascosto">Apre alle, {GIORNI[g.giorno - 1]}</span>
              <input type="time" name={`da-${g.giorno}`} defaultValue={g.da} required />
            </label>
            <span aria-hidden>–</span>
            <label>
              <span className="a-nascosto">Chiude alle, {GIORNI[g.giorno - 1]}</span>
              <input type="time" name={`a-${g.giorno}`} defaultValue={g.a} required />
            </label>
            <Errore esito={esito} campo={`giorni.${i}.a`} />
          </fieldset>
        ))}
      </div>
      <Salva inCorso={inCorso} testo="Salva gli orari" />
      <Messaggio esito={esito} />
    </form>
  );
}

/* --- Chiusure -------------------------------------------------------------- */

function Chiusure({ dati }: { dati: Dati }) {
  const [esito, azione, inCorso] = useActionState(aggiungiChiusura, null);
  const [esitoTogli, setEsitoTogli] = useState<Esito | null>(null);
  const [togliendo, startTransition] = useTransition();

  return (
    <div className="a-form">
      {dati.chiusure.length ? (
        <ul className="a-elenco">
          {dati.chiusure.map((c) => (
            <li key={c.id}>
              <span>
                {c.dal === c.al ? dataBreve(c.dal) : `${dataBreve(c.dal)} → ${dataBreve(c.al)}`}
                {c.nota ? ` · ${c.nota}` : ""}
              </span>
              <button
                type="button"
                className="a-link"
                disabled={togliendo}
                onClick={() =>
                  startTransition(async () => setEsitoTogli(await togliChiusura(c.id)))
                }
              >
                Togli
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="a-aiuto">Nessuna chiusura in programma.</p>
      )}
      <Messaggio esito={esitoTogli} />

      <form action={azione} className="a-form a-riquadro" key={dati.chiusure.length}>
        <p className="a-sottotitolo">Aggiungi una chiusura</p>
        <label htmlFor="dal">Dal</label>
        <input id="dal" type="date" name="dal" required />
        <Errore esito={esito} campo="dal" />
        <label htmlFor="al">Al (vuoto se è un giorno solo)</label>
        <input id="al" type="date" name="al" />
        <Errore esito={esito} campo="al" />
        <label htmlFor="nota">Motivo (facoltativo)</label>
        <input id="nota" name="nota" maxLength={80} placeholder="Ferie" />
        <Salva inCorso={inCorso} testo="Aggiungi" />
        <Messaggio esito={esito} />
      </form>
    </div>
  );
}

/* --- Consegna -------------------------------------------------------------- */

function Consegna({ attiva }: { attiva: boolean }) {
  const [esito, setEsito] = useState<Esito | null>(null);
  const [inCorso, startTransition] = useTransition();

  const scegli = (valore: boolean) =>
    startTransition(async () => setEsito(await salvaConsegna(valore)));

  return (
    <div className="a-form">
      <div className="a-scelta" role="group" aria-label="Consegna a domicilio">
        <button
          type="button"
          aria-pressed={attiva}
          disabled={inCorso || attiva}
          onClick={() => scegli(true)}
        >
          Sì, consegniamo
        </button>
        <button
          type="button"
          aria-pressed={!attiva}
          disabled={inCorso || !attiva}
          onClick={() => scegli(false)}
        >
          No, solo ritiro
        </button>
      </div>
      <Messaggio esito={esito} />
    </div>
  );
}

/* --- Menu ------------------------------------------------------------------ */

const prezzoTesto = (c: number) => (c / 100).toFixed(2).replace(".", ",");

function MenuEditor({ menu }: { menu: Dati["menu"] }) {
  const [idAttiva, setIdAttiva] = useState(menu.categorie[0]?.id ?? "");
  const categoria = menu.categorie.find((c) => c.id === idAttiva) ?? menu.categorie[0];
  const [esitoConferma, setEsitoConferma] = useState<Esito | null>(null);
  const [confermando, startTransition] = useTransition();

  return (
    <div className="a-form">
      {!menu.confermato ? (
        <div className="a-giallo a-riquadro">
          <p>
            Il menu è stato copiato dal volantino e sul sito ha la scritta [DA CONFERMARE].
            Quando l&apos;hai controllato tutto, premi qui.
          </p>
          <button
            type="button"
            className="a-bottone"
            disabled={confermando}
            onClick={() => {
              if (window.confirm("Hai controllato tutte le voci e i prezzi?")) {
                startTransition(async () => setEsitoConferma(await confermaMenu()));
              }
            }}
          >
            Il menu è giusto
          </button>
          <Messaggio esito={esitoConferma} />
        </div>
      ) : null}

      <label htmlFor="categoria">Categoria</label>
      <select id="categoria" value={categoria?.id} onChange={(e) => setIdAttiva(e.target.value)}>
        {menu.categorie.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome} ({c.voci.length})
          </option>
        ))}
      </select>

      {categoria ? <VociCategoria key={categoria.id} categoria={categoria} /> : null}
    </div>
  );
}

function VociCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <>
      <ul className="a-voci">
        {categoria.voci.map((v) => (
          <li key={v.id}>
            <details>
              <summary>
                <span>
                  {v.nome}
                  {v.daConfermare ? <span className="a-dc"> da confermare</span> : null}
                </span>
                <span className="a-prezzo">{euro(v.prezzo)}</span>
              </summary>
              <FormVoce categoria={categoria.id} voce={v} />
            </details>
          </li>
        ))}
      </ul>
      <details className="a-riquadro">
        <summary className="a-sottotitolo">+ Aggiungi a {categoria.nome}</summary>
        <FormVoce key={categoria.voci.length} categoria={categoria.id} voce={null} />
      </details>
    </>
  );
}

function FormVoce({ categoria, voce }: { categoria: string; voce: Voce | null }) {
  const [esito, azione, inCorso] = useActionState(salvaVoce, null);
  const [esitoTogli, setEsitoTogli] = useState<Esito | null>(null);
  const [togliendo, startTransition] = useTransition();
  const id = voce?.id ?? "nuova";

  return (
    <form action={azione} className="a-form a-voce">
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="id" value={voce?.id ?? ""} />

      <label htmlFor={`nome-${categoria}-${id}`}>Nome</label>
      <input id={`nome-${categoria}-${id}`} name="nome" defaultValue={voce?.nome} required maxLength={60} />
      <Errore esito={esito} campo="nome" />

      <label htmlFor={`ingr-${categoria}-${id}`}>Ingredienti (facoltativo)</label>
      <textarea
        id={`ingr-${categoria}-${id}`}
        name="ingredienti"
        rows={2}
        maxLength={160}
        defaultValue={voce?.ingredienti}
      />

      <label htmlFor={`prezzo-${categoria}-${id}`}>Prezzo in euro</label>
      <input
        id={`prezzo-${categoria}-${id}`}
        name="prezzo"
        inputMode="decimal"
        placeholder="8,50"
        defaultValue={voce ? prezzoTesto(voce.prezzo) : ""}
        required
        className="a-corto"
      />
      <Errore esito={esito} campo="prezzo" />

      <div className="a-riga">
        <Salva inCorso={inCorso} testo={voce ? "Salva" : "Aggiungi"} />
        {voce ? (
          <button
            type="button"
            className="a-link a-pericolo"
            disabled={togliendo}
            onClick={() => {
              if (window.confirm(`Togliere "${voce.nome}" dal menu?`)) {
                startTransition(async () => setEsitoTogli(await togliVoce(categoria, voce.id)));
              }
            }}
          >
            Togli dal menu
          </button>
        ) : null}
      </div>
      <Messaggio esito={esito} />
      <Messaggio esito={esitoTogli} />
    </form>
  );
}

/* --- Registro -------------------------------------------------------------- */

function Registro({ registro }: { registro: RigaRegistro[] }) {
  const [esito, setEsito] = useState<Esito | null>(null);
  const [inCorso, startTransition] = useTransition();

  if (registro.length === 0) {
    return <p className="a-aiuto">Ancora nessuna modifica. Da qui in poi ogni modifica finisce qui e si può annullare.</p>;
  }

  return (
    <div className="a-form">
      <Messaggio esito={esito} />
      <ul className="a-registro">
        {registro.map((r) => (
          <li key={r.id}>
            <span className="a-quando">{dataRegistro(r.at)}</span>
            <span>{r.label}</span>
            {r.prima !== null ? (
              <button
                type="button"
                className="a-link"
                disabled={inCorso}
                onClick={() => {
                  if (window.confirm("Rimettere com'era prima di questa modifica?")) {
                    startTransition(async () => setEsito(await annulla(r.id)));
                  }
                }}
              >
                Annulla
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="a-aiuto">Si tengono le ultime 100 modifiche.</p>
    </div>
  );
}
