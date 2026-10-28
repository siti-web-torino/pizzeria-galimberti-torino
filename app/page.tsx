import { DaConfermare } from "@/components/da-confermare";
import { IconaPosizione, IconaSacchetto, IconaTelefono } from "@/components/icone";
import SchedeMenu from "@/components/schede-menu";
import StatoApertura from "@/components/stato-apertura";
import {
  GIORNI,
  adessoATorino,
  chiusureFuture,
  dataBreve,
  riassuntoOrari,
} from "@/lib/apertura";
import type { Categoria } from "@/lib/schema";
import { FOTO, SITO, euro } from "@/lib/sito";
import { leggiDati } from "@/lib/store";

/**
 * La pagina si rigenera quando il titolare salva dall'admin
 * (revalidatePath) e comunque ogni cinque minuti.
 */
export const revalidate = 300;

const [FISSO] = SITO.telefoni;

/** Nome corto per le schede delle categorie. */
const ETICHETTA: Record<string, string> = {
  pizze: "Pizze",
  bianche: "Bianche",
  speciali: "Speciali",
  panuozzi: "Panuozzi",
  farinate: "Farinate",
  focacce: "Focacce",
  sfiziosita: "Sfiziosità",
  bibite: "Bibite",
};

export default async function Home() {
  const dati = await leggiDati();
  const { orari, chiusure, avviso, consegna, menu } = dati;
  const oggi = adessoATorino().giorno;
  const prossimeChiusure = chiusureFuture(chiusure);
  const farinate = menu.categorie.find((c) => c.id === "farinate");
  const speciali = menu.categorie.find((c) => c.id === "speciali");

  return (
    <>
      <a className="salta" href="#menu">
        Vai al menu
      </a>

      {avviso.attivo && avviso.testo ? (
        <div className="avviso" role="status">
          <p className="contenitore">
            <b>Avviso</b>
            {avviso.testo}
          </p>
        </div>
      ) : null}

      <header className="su-rosso">
        <div className="contenitore testata">
          <a href="#" aria-label="Pizzeria Galimberti, torna su">
            <img src={FOTO.logo.src} width={FOTO.logo.w} height={FOTO.logo.h} alt={FOTO.logo.alt} />
          </a>
          <nav aria-label="Sezioni">
            <ul className="nav">
              <li>
                <a href="#menu">Menu</a>
              </li>
              <li>
                <a href="#orari">Orari</a>
              </li>
              <li>
                <a href="#dove">Dove</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="contenuto">
        {/* --- Apertura -------------------------------------------------- */}
        <section className="su-rosso apertura" aria-labelledby="titolo">
          <div className="contenitore apertura-griglia">
            <div>
              <p className="occhiello">
                {SITO.forno} · {SITO.indirizzo}, {SITO.citta}
              </p>
              <h1 className="slogan" id="titolo">
                {SITO.frasi.domanda}
              </h1>
              <StatoApertura
                orari={orari}
                chiusure={chiusure}
                riassunto={riassuntoOrari(orari)}
              />
              <p className="offerta">
                Pizza al mattone e al tegamino, panuozzi, focacce, farinate e teglie su
                ordinazione.{" "}
                {consegna.attiva
                  ? "Ritiro in pizzeria o consegna a domicilio."
                  : "Solo ritiro in pizzeria: la consegna a domicilio per ora è sospesa."}
              </p>
              <div className="azioni">
                <a className="bottone bottone-pieno" href={`tel:${FISSO.tel}`}>
                  <IconaTelefono />
                  Chiama {FISSO.mostra}
                </a>
                <span className="con-nota">
                  <a
                    className="bottone bottone-vuoto"
                    href={SITO.justEat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconaSacchetto />
                    Ordina su Just Eat
                  </a>
                  {SITO.justEat.daConfermare ? (
                    <DaConfermare motivo="Link Just Eat trovato in rete, non dato dal locale" />
                  ) : null}
                </span>
              </div>
            </div>
            <figure className="foto-apertura">
              <img
                src={FOTO.cornicione.src}
                width={FOTO.cornicione.w}
                height={FOTO.cornicione.h}
                alt={FOTO.cornicione.alt}
                fetchPriority="high"
              />
            </figure>
          </div>
        </section>

        {/* --- Cosa facciamo --------------------------------------------- */}
        <section className="sezione" aria-labelledby="cosa">
          <div className="contenitore">
            <h2 className="titolo-sezione" id="cosa">
              Cosa facciamo
            </h2>
            {/* Le sei righe del volantino (menu2.png), nello stesso ordine. */}
            <ul className="elenco-volantino">
              <li>Pizza al mattone</li>
              <li>Panuozzi</li>
              <li>Pizza al tegamino</li>
              <li>Focacce</li>
              <li>Teglie su ordinazione</li>
              <li>Farinate</li>
            </ul>

            <div className="schede">
              <article className="scheda">
                <img
                  src={FOTO.teglia.src}
                  width={FOTO.teglia.w}
                  height={FOTO.teglia.h}
                  alt={FOTO.teglia.alt}
                  loading="lazy"
                  decoding="async"
                />
                <h3>Teglie su ordinazione</h3>
                <p className="citazione">{SITO.frasi.teglie}</p>
                <p className="nota-piccola">
                  Prezzo e preavviso: <DaConfermare motivo="Non sono nel volantino" />
                </p>
                <p>
                  <a className="bottone bottone-rosso" href={`tel:${FISSO.tel}`}>
                    <IconaTelefono />
                    Chiama per la teglia
                  </a>
                </p>
              </article>

              <article className="scheda">
                <img
                  src={FOTO.tegamino.src}
                  width={FOTO.tegamino.w}
                  height={FOTO.tegamino.h}
                  alt={FOTO.tegamino.alt}
                  loading="lazy"
                  decoding="async"
                />
                <h3>Pizza al tegamino</h3>
                <p>
                  Quella torinese, alta e cotta nel suo tegamino.{" "}
                  {farinate && farinate.voci.length > 0 ? (
                    <>
                      Da accompagnare con la farinata:{" "}
                      {farinate.voci
                        .map((v) => `${v.nome.replace(/^Farinata /, "")} ${euro(v.prezzo)}`)
                        .join(", ")}
                      .
                    </>
                  ) : null}
                </p>
                <p className="nota-piccola">
                  Gusti e prezzi del tegamino: <DaConfermare motivo="Il volantino non li elenca" />
                </p>
              </article>

              <article className="scheda">
                <img
                  src={FOTO.mortadella.src}
                  width={FOTO.mortadella.w}
                  height={FOTO.mortadella.h}
                  alt={FOTO.mortadella.alt}
                  loading="lazy"
                  decoding="async"
                />
                <h3>Le speciali</h3>
                <p>
                  {speciali ? `${speciali.voci.length} pizze` : "Pizze"} fuori dal solito: con
                  mortadella, burrata e pistacchio, con lardo e cipolla caramellata, con
                  fagiolini, patate e pesto.
                </p>
                <p>
                  <a className="bottone bottone-chiaro" href="#cat-speciali">
                    Vedi le speciali
                  </a>
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* --- Menu ------------------------------------------------------ */}
        <section className="sezione menu" id="menu" aria-labelledby="titolo-menu">
          <div className="contenitore">
            <h2 className="titolo-sezione" id="titolo-menu">
              Menu
            </h2>

            {!menu.confermato ? (
              <p className="dc-box">
                <strong>[DA CONFERMARE]</strong> Voci e prezzi trascritti dal volantino del
                locale: non sappiamo se sono aggiornati.
              </p>
            ) : null}

            <SchedeMenu
              contenitore="voci-menu"
              categorie={menu.categorie
                .filter((c) => c.voci.length > 0)
                .map((c) => ({ id: c.id, etichetta: ETICHETTA[c.id] ?? c.nome }))}
            />

            <p className="consegna">
              {consegna.attiva ? (
                <>
                  Consegna a domicilio {euro(SITO.consegna.costo)}
                  {SITO.consegna.daConfermare ? (
                    <DaConfermare motivo="Dal volantino, data ignota" />
                  ) : null}
                </>
              ) : (
                <>Consegna a domicilio sospesa: solo ritiro in pizzeria.</>
              )}
            </p>

            <div className="colonne-menu" id="voci-menu">
              {menu.categorie
                .filter((c) => c.voci.length > 0)
                .map((c) => (
                  <CategoriaMenu key={c.id} categoria={c} />
                ))}
            </div>

            <p className="nota-piccola">
              {SITO.notaMenu} <DaConfermare motivo="Nota minuscola, letta con dubbio" />
            </p>
          </div>
        </section>

        {/* --- Orari e dove ---------------------------------------------- */}
        <section className="sezione dove" id="dove" aria-labelledby="titolo-dove">
          <div className="contenitore dove-griglia">
            <div id="orari">
              <h2 className="titolo-sezione" id="titolo-dove">
                Orari
              </h2>
              <table className="orari">
                <caption className="nota-piccola" style={{ textAlign: "left", captionSide: "bottom", paddingTop: "0.75rem" }}>
                  Orari di apertura, ora di Torino.
                </caption>
                <tbody>
                  {[...orari.giorni]
                    .sort((a, b) => a.giorno - b.giorno)
                    .map((g) => (
                      <tr key={g.giorno} data-oggi={g.giorno === oggi ? "" : undefined}>
                        <th scope="row">
                          <span className="giorno">{GIORNI[g.giorno - 1]}</span>
                          {g.giorno === oggi ? " (oggi)" : ""}
                        </th>
                        <td className={g.aperto ? undefined : "chiuso"}>
                          {g.aperto ? `${g.da}-${g.a}` : "Chiuso"}
                          {!g.aperto && orari.daConfermare ? (
                            <>
                              {" "}
                              <DaConfermare motivo="Dedotto da 'martedì-domenica'" />
                            </>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {prossimeChiusure.length > 0 ? (
                <ul className="ferie">
                  {prossimeChiusure.map((c) => (
                    <li key={c.id}>
                      {c.nota || "Chiuso"}:{" "}
                      {c.dal === c.al
                        ? dataBreve(c.dal)
                        : `dal ${dataBreve(c.dal)} al ${dataBreve(c.al)}`}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div>
              <h2 className="titolo-sezione">Dove siamo</h2>
              <div className="blocco">
                <p className="indirizzo">
                  {SITO.indirizzo}
                  <br />
                  {SITO.citta}
                </p>
                <a
                  className="bottone bottone-rosso"
                  href={SITO.mappa}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconaPosizione />
                  Come arrivare
                </a>
              </div>
              <div className="blocco">
                <h3>Telefono</h3>
                <ul className="telefoni">
                  {SITO.telefoni.map((t) => (
                    <li key={t.tel}>
                      <a href={`tel:${t.tel}`}>
                        {t.mostra}
                        <span>{t.etichetta}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="blocco">
                <h3>Social</h3>
                <a
                  className="link-social"
                  href={SITO.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram {SITO.instagram.nome}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="su-rosso piede">
        <div className="contenitore">
          <p>
            <strong>{SITO.nome}</strong> · {SITO.indirizzo}, {SITO.citta}
          </p>
          <p>
            Pagina dimostrativa, non è il sito ufficiale del locale. I riquadri [DA CONFERMARE]
            segnano i dati ancora da verificare con la pizzeria.
          </p>
        </div>
      </footer>

      <nav className="barra" aria-label="Azioni rapide">
        <a href={`tel:${FISSO.tel}`}>
          <IconaTelefono />
          Chiama
        </a>
        <a href={SITO.justEat.url} target="_blank" rel="noopener noreferrer">
          <IconaSacchetto />
          Just Eat
        </a>
        <a href={SITO.mappa} target="_blank" rel="noopener noreferrer">
          <IconaPosizione />
          Mappa
        </a>
      </nav>
    </>
  );
}

function CategoriaMenu({ categoria }: { categoria: Categoria }) {
  return (
    <section
      className={`categoria${categoria.voci.length > 15 ? " categoria-lunga" : ""}`}
      id={`cat-${categoria.id}`}
      aria-labelledby={`h-${categoria.id}`}
    >
      <h3 id={`h-${categoria.id}`}>{categoria.nome}</h3>
      {categoria.nota ? <p className="nota-piccola">{categoria.nota}</p> : null}
      <ul className="voci">
        {categoria.voci.map((v) => (
          <li className="voce" key={v.id}>
            <div className="voce-riga">
              <span className="voce-nome">
                {v.nome}
                {v.daConfermare ? <DaConfermare motivo="Letto con dubbio dal volantino" /> : null}
              </span>
              <span className="voce-prezzo">{euro(v.prezzo)}</span>
            </div>
            {v.ingredienti ? <p className="voce-ingredienti">{v.ingredienti}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
