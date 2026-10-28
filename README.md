# Pizzeria Galimberti – sito demo con admin

Sito one-page per Pizzeria Galimberti, Piazza Galimberti 5, Torino, con un'area `/admin` per il
titolare. **Demo:** non indicizzato (meta noindex, `X-Robots-Tag`, `robots.txt` chiuso, niente
sitemap), non pubblicato.

Progetto Next.js 16 (deroga alla pipeline, vedi `DECISIONI.md`). Da leggere, in ordine:
`RAPPORTO.md`, `docs/anteprime/`, `docs/VERIFICA.md`, `STUDIO.md`, `DECISIONI.md`.

## Avviarlo in locale
```bash
npm install
```
Crea `.env.local` copiando `.env.example` e metti una password di prova (almeno 10 caratteri,
diversa dall'esempio) e un `AUTH_SECRET` lungo. Poi:
```bash
npm run dev
```
Sito su http://localhost:3000, admin su http://localhost:3000/admin. Senza database le modifiche
dell'admin finiscono in `.data/store.json` (ignorato da git).

## Come si cambiano i contenuti
| Cosa | Dove |
|---|---|
| Orari, giorni di chiusura, ferie, avviso in cima, voci e prezzi del menu, consegna sì/no | Dall'admin (`/admin`), dal telefono. Ogni modifica va nel registro e si può annullare |
| Telefoni, indirizzo, link Just Eat, Instagram, costo consegna, frasi del volantino, foto | `lib/sito.ts` (un solo file, ogni valore con la sua fonte) |
| I dati di partenza (quelli mostrati se il database non risponde) | `lib/dati-iniziali.ts` |
| Colori, font, spaziature | Variabili in cima a `app/globals.css` |
| Testi delle sezioni | `app/page.tsx` |

Per togliere un [DA CONFERMARE] da un dato fisso: in `lib/sito.ts` metti `daConfermare: false`.
Per il menu e gli orari lo fa il titolare dall'admin: salvare gli orari li conferma, salvare una
voce la conferma, "Il menu è giusto" conferma tutto il menu.

## Elenco dei [DA CONFERMARE]
| Dato | Perché | Fonte |
|---|---|---|
| Tutto il menu (voci e prezzi) | Trascritto dal volantino, data ignota | `menu1.png`, `menu2.png` |
| Giogio, Porrosa (nomi) | Letti con dubbio | `menu1.png` |
| La Mortadella | Nel volantino c'è "mortella", corretto in "mortadella" | `menu1.png` |
| Coca Cola bottiglia, birre | Formato e un numero dopo "33cl" non chiari; Moretti 66 cl a € 2,50 sembra basso | `menu2.png` |
| Nota "* prodotto congelato / surgelato, impasto integrale + 1 €" | Scritta minuscola | `menu1.png` |
| Lunedì chiuso | Dedotto da "martedì-domenica" | note, `menu2.png` |
| Link Just Eat | Le note lo lasciano vuoto; trovato in rete con lo stesso indirizzo | ricerca web |
| Consegna € 2,00 | Dal volantino, data ignota; zona e ordine minimo non noti | `menu2.png` |
| Teglie su ordinazione: prezzo, misure, preavviso e quali gusti si possono fare | Non sono nel volantino; il gioco "componi la tua teglia" propone i gusti di Pizze, Bianche e Speciali | – |
| Pizza al tegamino: gusti e prezzi | Il volantino la nomina ma non la elenca | `menu2.png` |
| Quale numero mettere sul bottone "Chiama" | Messo il fisso (primo nel volantino) | `menu2.png` |
| Glovo, Satispay, Facebook | Nel volantino ma non nelle note: **non mostrati** nel sito | `menu2.png` |
| WhatsApp sul 328 | Non so se c'è: **non mostrato** | – |
| Logo in alta risoluzione | Quello dato è 134×68 px | `logo.png` |

## Struttura
```
app/            pagina (page.tsx), stile (globals.css), font, robots.txt, admin/
components/     stato aperto/chiuso, schede del menu, icone, riquadro [DA CONFERMARE]
lib/            sito.ts (dati fissi), dati-iniziali.ts, schema.ts (Zod), store.ts (database),
                auth.ts, apertura.ts (aperto adesso), registro.ts
public/img/     foto WebP ottimizzate (originali intatti in img-originali/)
docs/           anteprime e verifica
```
