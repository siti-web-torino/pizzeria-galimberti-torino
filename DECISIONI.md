# DECISIONI – Pizzeria Galimberti

## 0. Deroghe alla pipeline (CLAUDE.md), chieste dall'utente il 28/10/2026
L'utente ha chiesto esplicitamente queste eccezioni, che hanno la precedenza su CLAUDE.md
solo per questi punti:
- **Stack:** un solo progetto Next.js invece di HTML/CSS/JS puri, perché serve un backend per
  l'area admin del titolare (già mostrata al cliente).
- **Base tecnica:** il repo privato `alessandrocostea/flow-running-club`, clonato in sola
  lettura in `../flow-running-club` (fuori da questo progetto, non finisce nei commit). Ripresi
  **solo**: autenticazione (`lib/auth.ts`), store con fallback su file (`lib/store.ts`),
  validazione Zod, server action dell'admin, registro modifiche con Annulla. **Non** ripresi:
  design, testi, foto, colori, dati, calendario, meteo, contatori visite, dati strutturati,
  llms.txt, sitemap, robots.ts.
- **Percorsi:** la regola dei percorsi relativi sotto `/nome-repo/` non vale (serve un server).
- **Dove stanno i dati modificabili:** non in un oggetto in cima a `js/main.js` ma in
  `lib/dati-iniziali.ts` (dati iniziali) + database. Resta un unico file per i dati fissi.
- **Admin limitata a:** orari, giorni di chiusura e ferie, avviso in cima, voci e prezzi del
  menu, consegna sì/no. Nessun dato personale salvato.

Tutto il resto di CLAUDE.md resta valido: dati non inventati, [DA CONFERMARE], noindex,
robots chiuso, niente pubblicazione, font OFL ospitati nel progetto, niente iframe di Maps.

## 1. Tre direzioni

### A. "Il volantino sul bancone"
- **Concetto:** il sito è il volantino che già hanno, reso utile da telefono: rosso del marchio
  pieno, titoli maiuscoli pesanti, listino chiaro.
- **Palette:** rosso marchio `#912427` (testata, bottoni principali, titoli di sezione),
  rosso scuro `#5e1a1e` (testo su chiaro per i titoli, hover), carta `#fbf8f3` (fondo),
  inchiostro `#231f1e` (testo), grigio caldo `#6b625e` (ingredienti), crosta `#9b4727` solo
  come accento nelle foto/separatori.
- **Font:** Archivo (OFL, variabile in peso e larghezza): larghezza stretta e peso 800-900 per
  i titoli, perché richiama il grottesco maiuscolo del volantino (`menu2.png`); stessa
  famiglia a larghezza normale per il testo, così si carica un solo file.
- **Foto e logo:** logo piccolo nella testata rossa: il rettangolo rosso del logo si fonde con
  il rosso della testata (stesso `#912427`). Foto: `teglia.png` e `pizza.png` grandi, ritagliate
  a tutta larghezza.
- **Dettaglio memorabile:** il listino con i puntini di guida tra nome e prezzo, come il menu
  stampato, e "Stasera pizza?" usato come titolo (frase loro).
- **Rischio:** sembrare un volantino rumoroso; troppo rosso stanca.
- **Giustificazione:** `logo.png`, `menu1.png`, `menu2.png` (unico materiale di marca),
  criteri 1, 3, 7.

### B. "Fondo nero, crosta in primo piano"
- **Concetto:** pizzeria artigianale da forno caldo: sfondo quasi nero, foto ravvicinate delle
  bruciature del cornicione, testo chiaro.
- **Palette:** nero `#141624` (da `pizza.png`), panna `#f3eee4`, crosta `#bdb7a2`,
  rosso marchio solo per i bottoni.
- **Font:** Fraunces (OFL, serif con carattere) per i titoli + Archivo per il testo.
- **Foto e logo:** `pizza.png` a tutto schermo come apertura; logo in alto su fondo nero.
- **Dettaglio memorabile:** cerchio-timbro "Aperto adesso" sopra la foto.
- **Rischio:** sembra un locale gourmet con sala, che il materiale non dimostra; con solo 4
  foto da telefono il nero mette in risalto i difetti; testo chiaro su nero meno leggibile per
  strada.
- **Giustificazione:** `pizza.png`, nota "forno a legna".

### C. "Lo scontrino"
- **Concetto:** pratico e ironico, tutto come un listino a scontrino: monospazio, linee
  tratteggiate, totali.
- **Palette:** bianco carta, nero inchiostro, rosso marchio solo per le categorie.
- **Font:** IBM Plex Mono (OFL) per prezzi e titoli + IBM Plex Sans (OFL).
- **Foto e logo:** foto piccole come "allegati"; logo in cima come intestazione dello scontrino.
- **Dettaglio memorabile:** "Consegna € 2,00" come riga del totale.
- **Rischio:** troppo "da agenzia", lontano dall'insegna classica; il monospazio rende lungo un
  menu di 90 voci.
- **Giustificazione:** criterio 3 (menu e prezzi al centro).

## 2. Scelta: A, "Il volantino sul bancone"
Motivo: è l'unica che parte dal materiale di marca reale (logo rosso, volantino con titoli
maiuscoli pesanti e tono diretto). B racconta un posto gourmet che dal materiale non risulta;
C è un'idea grafica nostra, non loro. A ha il rischio del "troppo rosso": lo limito usando il
rosso solo per testata, bottoni principali e titoli, con fondo carta chiaro per il menu.
Dal C prendo una sola cosa compatibile: i prezzi allineati a destra con i puntini, che sono
già nel volantino (`menu1.png` usa linee sotto ogni voce).

## 3. Scelte di contenuto
| Scelta | Motivo |
|---|---|
| Link Just Eat trovato in ricerca usato nel sito, con nota [DA CONFERMARE] | Le note lo lasciano vuoto; il link compare nei risultati di ricerca con lo stesso indirizzo. Un bottone che apre l'app è più utile di un bottone morto, ma va confermato |
| Glovo, Facebook, Satispay: citati solo come [DA CONFERMARE] | Sono nel volantino ma non nelle note: il volantino potrebbe essere vecchio |
| Lunedì indicato come giorno di chiusura, [DA CONFERMARE] | Deduzione da "martedì-domenica" (note, `menu2.png`) |
| "Forno a legna" usato una volta, accanto a "pizza al mattone" del volantino | Le note dicono legna, il volantino dice mattone: entrambe dal materiale |
| Nessuna recensione nel sito | Fonti inaffidabili e contraddittorie (Restaurant Guru) e nessun consenso |
| Nessuna storia o "chi siamo" inventato | Non c'è nel materiale. La sezione "chi è" diventa "cosa facciamo", con le parole del volantino |
| `menu2.png` non usata come foto; `tegamino.png` ritagliata sotto il volantino | Contengono persone riconoscibili |
| Il refuso "mortella" della pizza La Mortadella è mostrato come "mortadella" con [DA CONFERMARE] | Il nome della pizza rende evidente il refuso, ma è comunque una correzione mia |
| Bottone principale "Chiama" sul 328 o sullo 011? Sul fisso 011 come primo, mobile come secondo | Il volantino mette lo 011 per primo (`menu2.png`); non so quale preferiscano: [DA CONFERMARE] |
| Stato "Aperto adesso / Apre alle 18:00 / Chiuso oggi" calcolato sull'ora di Torino | Criterio 1 e 4. Se il titolare imposta ferie dall'admin, il sito dice "Chiuso per ferie fino al …" |

## 4. Scelte tecniche
| Scelta | Motivo |
|---|---|
| Next.js 16.4.3, CSS puro con variabili (niente Tailwind) | Serve un backend per l'admin (deroga). Il CSS a variabili rispetta "scale come variabili CSS" e resta leggibile |
| Foto pre-ottimizzate in WebP (sharp, lato lungo ≤ 1600, senza EXIF) e servite come `<img>`, non con `next/image` | Nessun costo di ottimizzazione immagini sull'hosting, file già piccoli (40-85 KB) |
| Home statica rigenerata (ISR): al salvataggio dall'admin (`revalidatePath`) e comunque ogni 5 minuti | Veloce, poche letture dal database (che resta nel piano gratuito), e il sito sta su anche se il database cade |
| Stato "aperto adesso" calcolato nel browser sull'ora di Torino | La pagina è in cache: uno stato calcolato sul server potrebbe essere vecchio proprio alle 18:00 |
| Menu a schede da telefono, tutto in colonne da tablet | Da telefono il menu completo era lungo 11 schermate (`docs/VERIFICA.md`) |
| Foto di apertura `pizza.png` (non `teglia.png`) | Il cornicione maculato dice "forno caldo" a colpo d'occhio; la teglia va nella sezione teglie, dove spiega il prodotto |
| `menu2.png` mai pubblicata, `tegamino.png` ritagliata sotto il volantino | Contengono foto di persone riconoscibili |
| Store: Upstash Redis → file locale **solo** in sviluppo (o con `STORE_FILE=1`) → dati iniziali | In produzione senza database non si finge di salvare. L'admin lo dice con un riquadro rosso e blocca i campi; le action rifiutano comunque |
| Lettura dal database con timeout di 2,5 s | Se Upstash è lento il sito non aspetta: mostra i dati iniziali |
| Ogni sezione dei dati validata da sola con Zod | Una sezione rovinata non fa sparire le altre |
| Salvataggio rifiutato se il database non si legge | Scrivere partendo dai dati iniziali cancellerebbe le altre modifiche del titolare |
| Registro senza nome di chi modifica (Flow lo aveva) | L'admin è del solo titolare e non si salvano dati personali |
| Password: blocco in `next.config.ts` (build e `next start`) e in `instrumentation.ts` (avvio su Vercel); oltre a vuota e d'esempio rifiuto anche sotto 10 caratteri e `AUTH_SECRET` sotto 32 | Su Vercel `next.config` gira solo in build: serve anche il controllo a runtime. La lunghezza minima è un'aggiunta mia, prudente |
| Da Flow non ripresi: robots.ts (apriva ai crawler), sitemap, llms.txt, dati strutturati, contatori, meteo, calendario, design | Richiesta esplicita dell'utente |

## 5. Hosting (dettagli e costi in RAPPORTO.md)
Consiglio **Vercel Pro + Upstash Redis gratuito**. Il piano Hobby di Vercel non si può usare: la
documentazione lo limita a uso personale non commerciale, e un sito che promuove un'attività
(o che si viene pagati per fare o ospitare) è commerciale
([Vercel, Fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines), aggiornata
14/09/2026). Alternativa più economica non provata: Cloudflare Workers con l'adattatore OpenNext.

## 6. Effetto "wow" (richiesta dell'utente, 28/10/2026)
Scelto: **"la pasta che si stende"**. Le righe del volantino ("Pizza al mattone, Panuozzi…") si
allargano mentre si scorre, come pasta tirata, fino a diventare il blocco giustificato del
volantino vero (`menu2.png`). Motivi: nasce dal materiale del locale (le sue parole, la sua
impaginazione), parla di pasta e forno senza illustrazioni inventate, funziona a qualsiasi ora
(non dipende dall'apertura) e pesa zero (asse di larghezza del font Archivo, già caricato).
Scartata un'insegna al neon "APERTO" che si accende alle 18: d'effetto, ma in una demo fatta di
giorno si vedrebbe spenta, e il neon non è nell'identità del locale.
