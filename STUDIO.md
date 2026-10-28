# STUDIO – Pizzeria Galimberti, Piazza Galimberti 5, Torino

Fonti usate in questo file:
- **[note]** = messaggio iniziale dell'utente (28/10/2026).
- **[nomefile]** = foto in `img-originali/`.
- Fonti web: citate con URL nella sezione "Contesto e criteri di design".

## 1. Catalogo foto

| File | Cosa mostra | Qualità | Ritaglio | Sezione adatta |
|---|---|---|---|---|
| `logo.png` | Logo: ovale bianco su rettangolo rosso, "Galimberti" in corsivo bianco, "PIZZERIA" in maiuscoletto sotto | **Molto bassa: 134×68 px.** Ingrandito oltre ~130 px di larghezza si sgrana | Nessuno (si usa com'è) | Testata, piccolo. Serve il file originale in alta risoluzione o vettoriale |
| `menu1.png` | Volantino-menu, facciata interna: Pizze, Pizze bianche, Le speciali, Panuozzi, Farinate | 849×588, testo leggibile solo ingrandendo; piccole parti sfocate | Non va nel sito come immagine | Solo fonte per trascrivere il menu |
| `menu2.png` | Volantino, facciata esterna: Focacce, Sfiziosità, Bibite, Birre, consegna €2; pannello rosso con logo, offerta, telefoni, social, indirizzo, orari, pagamenti/app di consegna | 847×599 | **Non usare nel sito:** contiene foto di persone riconoscibili (gruppo che fa un selfie, bambino) | Solo fonte di dati e slogan |
| `pizza.png` | Pizza tonda dal cornicione alto e maculato (bruciature tipiche di forno molto caldo), fior di latte grattugiato/sfilacciato, pezzetti di carne cruda rossa (forse salsiccia cruda o battuta: **non lo so**, nessuna scritta), basilico; piatto bianco su fondo nero | 838×651, buona, luce frontale, un po' di rumore sul fondo | Orizzontale, si può stringere sulla pizza | Hero o galleria |
| `pizza2.png` | Pizza vista dall'alto in cartone da asporto: mortadella, ciuffi di burrata/stracciatella, granella di pistacchio, una foglia di basilico. Corrisponde per ingredienti a "La Mortadella" del menu (`menu1.png`), ma **l'abbinamento è una mia deduzione** | 683×767, buona, luce piatta | Verticale; bordi del cartone visibili | Galleria / sezione asporto |
| `tegamino.png` | Pizza al tegamino (bordo alto e scuro, pomodoro, fior di latte, salsiccia) su piatto bianco sopra un bancone in granito; dietro, il volantino del locale (`menu2.png`) in piedi | 676×842 | **Ritagliare solo la metà bassa:** il volantino sullo sfondo contiene foto di persone | Galleria (ritaglio dal piatto in giù) |
| `teglia.png` | Primo piano di pizza in teglia rettangolare, pomodoro, fior di latte, prosciutto cotto; dietro un'altra teglia; banco in acciaio | 675×797, buona, molto "appetitosa" | Verticale, si presta a ritaglio quadrato | Sezione "Teglie su ordinazione" |
| `LEGGIMI.txt` | Istruzioni del template, non è materiale del cliente | – | – | – |

Persone riconoscibili: in `menu2.png` e sullo sfondo di `tegamino.png` (sono le foto stampate sul volantino, probabilmente immagini di repertorio, ma **non lo so**). Nessuna delle due va pubblicata così com'è.

Mancano: foto del locale (interno, insegna, forno, piazza), foto del titolare/staff. Per la galleria ci sono solo piatti.

## 2. Identità visiva reale

### Palette campionata (hex medi di aree, script con sharp in `strumenti/`)
| Ruolo osservato | Hex | Da dove |
|---|---|---|
| Rosso del logo (fondo del rettangolo) | `#912427` | `logo.png`, angolo alto-sinistra |
| Rosso del pannello volantino | `#7c292c` | `menu2.png`, pannello centrale |
| Rosso scuro dei titoli di sezione del menu ("PIZZE") | `#491f26` (pixel più scuro) | `menu1.png` |
| Testo nomi pizze | `#272727` | `menu1.png` |
| Prezzi | `#5f5f5f` | `menu1.png` |
| Carta del menu | `#fefefe` | `menu1.png` |
| Fondo nero foto | `#141624` | `pizza.png` |
| Cornicione cotto | `#bdb7a2` | `pizza.png` |
| Bruciature del cornicione | `#464244` | `pizza.png` |
| Crosta del tegamino | `#9b4727` | `tegamino.png` |
| Pomodoro in teglia | `#aa6c47` | `teglia.png` |
| Granito del bancone | `#aea07d` | `tegamino.png` |

Lettura: il marchio è **un solo colore, rosso bordeaux**, più bianco. Nessun secondo colore di marca. I toni caldi (crosta, pomodoro, granito) vengono dalle foto, non dal marchio.

### Scritta del logo (`logo.png`)
- "Galimberti": corsivo calligrafico inclinato con svolazzo, bianco.
- "PIZZERIA": maiuscolo spaziato, senza grazie, piccolo, bianco.
- Ovale bianco con filetto, su fondo rosso pieno. Stile classico da insegna di pizzeria di quartiere, non "di design".
- Il volantino (`menu2.png`) usa un sans geometrico/grottesco maiuscolo molto pesante per i titoli ("PIZZA AL MATTONE", "PANUOZZI", "FARINATE"), simile a Montserrat ExtraBold (**somiglianza visiva, non so il font reale**). Il menu (`menu1.png`) usa un sans maiuscolo per i nomi e un sans leggero per gli ingredienti.

### Materiali, luce, atmosfera
- Banco in granito chiaro e piatti bianchi (`tegamino.png`); acciaio inox e teglie nere (`teglia.png`); cartone da asporto (`pizza2.png`).
- Luce da cucina/bancone, foto fatte col telefono, niente set fotografico (tranne `pizza.png` su fondo nero).
- Atmosfera: laboratorio di pizzeria d'asporto, pratico, generoso nelle porzioni. Nessun elemento che indichi sala o servizio al tavolo: **non so se ci sono tavoli**.

## 3. Tono di voce (testi copiati dal volantino `menu2.png`)
- "STASERA PIZZA?"
- "PIZZA AL MATTONE / PANUOZZI / PIZZA AL TEGAMINO / FOCACCE / TEGLIE SU ORDINAZIONE / FARINATE"
- "SEGUICI SUI NOSTRI SOCIAL PER RIMANERE AGGIORNATO SULLE NOSTRE PROMOZIONI E NON DIMENTICARTI DI CONDIVIDERE LA FOTO DELLA TUA PIZZA PREFERITA CON I TUOI AMICI."
- "FESTA DI COMPLEANNO? UN EVENTO SPECIALE?" / "ORDINA LE NOSTRE TEGLIE, LE PUOI PERSONALIZZARE COME VUOI METTENDO FINO A 4 GUSTI DIVERSI."
- "Aperti dal martedì alla domenica 18.00 | 22.30"
- "CONSEGNA A DOMICILIO € 2.00"

Tono: diretto, dà del tu, domande brevi, elenco di prodotti invece di aggettivi. Niente storia, niente "tradizione dal 19xx". Il sito deve parlare così.

## 4. Menu trascritto
Fonte: `menu1.png` (Pizze, Pizze bianche, Le speciali, Panuozzi, Farinate) e `menu2.png` (Focacce, Sfiziosità, Bibite, Birre, consegna). **Tutto il menu resta [DA CONFERMARE] finché il locale non lo conferma: non so di quando è il volantino.**
Certezza: **A** = leggibile senza dubbi; **B** = letto ingrandendo, possibile errore. L'asterisco `*` è nel volantino.

### Pizze (`menu1.png`)
| Nome | Ingredienti | Prezzo | Cert. |
|---|---|---|---|
| Marinara | Pomodoro, origano, aglio | € 4,50 | A |
| Margherita | Pomodoro, fior di latte | € 5,50 | A |
| Diavola | Pomodoro, fior di latte, salamino piccante | € 7,00 | A |
| Salsiccia | Pomodoro, fior di latte, salsiccia | € 7,00 | A |
| Würstel | Pomodoro, fior di latte, würstel | € 7,00 | A |
| Funghi | Pomodoro, fior di latte, funghi | € 7,00 | A |
| Prosciutto | Pomodoro, fior di latte, prosciutto cotto | € 7,00 | A |
| Greca | Pomodoro, fior di latte, olive nere | € 7,00 | A |
| Napoli | Pomodoro, fior di latte, acciughe | € 7,00 | A |
| San Daniele | Pomodoro, fior di latte, prosciutto crudo | € 8,00 | A |
| Calabra | Pomodoro, fior di latte, salamino piccante, n'duja, cipolla di tropea | € 9,00 | A |
| Gorgo | Pomodoro, fior di latte, gorgonzola | € 7,00 | A |
| Patatine | Pomodoro, fior di latte, patatine fritte* | € 7,00 | A |
| Tonno cipolla | Pomodoro, fior di latte, tonno, cipolla | € 8,00 | A |
| 4 stagioni | Pomodoro, fior di latte, funghi, olive, prosciutto cotto, carciofi | € 8,00 | A |
| 4 formaggi | Pomodoro, fior di latte, fontina, gorgo, parmigiano | € 8,50 | A |
| Capricciosa | Pomodoro, fior di latte, funghi, olive, prosciutto cotto, carciofi, salamino piccante | € 8,50 | A |
| Smilzo | Pomodoro, fior di latte, würstel, patatine fritte* | € 8,00 | A |
| Vegetariana | Pomodoro, fior di latte, melanzane, zucchine, peperoni, olive | € 8,50 | A |
| Siciliana | Pomodoro, fior di latte, acciughe, capperi, olive | € 8,00 | A |
| Gran Torino | Pomodoro, fior di latte, peperoni, salsiccia | € 8,50 | A |
| Salsiccia friarielli | Pomodoro, fior di latte, salsiccia, friarielli | € 8,50 | A |
| Speck brie | Pomodoro, fior di latte, speck, brie | € 8,50 | A |
| Bismark | Pomodoro, fior di latte, prosciutto cotto, uovo | € 8,00 | A |
| Prosciutto funghi | Pomodoro, fior di latte, prosciutto cotto, funghi | € 8,00 | A |
| Parmigiana | Pomodoro, fior di latte, melanzane fritte, parmigiano, basilico | € 8,00 | A |
| Bufala | Pomodoro, bufala, basilico | € 9,00 | A |
| Bacon | Pomodoro, fior di latte, salsiccia, cipolla, bacon | € 9,50 | A |
| Golosa | Pomodoro, fior di latte, gorgo, salamino piccante | € 8,50 | A |
| Burrata | Pomodoro, burrata, basilico | € 8,50 | A |
| Porcini | Pomodoro, fior di latte, funghi porcini* | € 9,00 | A |
| Giogio | Pomodoro, fior di latte, funghi, panna, speck | € 8,50 | B (nome) |
| Valdostana | Pomodoro, fior di latte, prosciutto cotto, fontina | € 8,00 | A |

### Pizze bianche (`menu1.png`)
| Nome | Ingredienti | Prezzo | Cert. |
|---|---|---|---|
| Gorgo pere | Fior di latte, gorgo, pere | € 8,50 | A |
| Bresaola | Fior di latte, pomodorini, bresaola, rucola, scaglie di grana | € 10,00 | A |
| Biancaneve | Fior di latte, basilico | € 5,50 | A |
| Fumé | Fior di latte, speck, scamorza affumicata | € 8,50 | A (scritto "FUME'") |
| Carbonara | Fior di latte, uova, bacon, parmigiano, panna | € 8,50 | A |
| Luca | Fior di latte, funghi porcini*, speck | € 9,50 | A |
| Fiori di zucca | Fior di latte, fiori di zucca, acciughe | € 8,00 | A |
| Porrosa | Fior di latte, porri, salsiccia, gorgo | € 8,50 | B (nome) |

### Le speciali (`menu1.png`)
| Nome | Ingredienti | Prezzo | Cert. |
|---|---|---|---|
| La Mortadella | Fior di latte, mortella [sic], burrata, granella di pistacchio | € 10,00 | B (nel volantino è scritto "mortella": probabile refuso di "mortadella") |
| Delicata | Bufala, pomodorini, prosciutto crudo, rucola, scaglie di grana | € 10,50 | A |
| Piemontese | Pomodoro, fior di latte, peperoni, acciughe | € 8,50 | A |
| Norvegese | Fior di latte, salmone, philadelphia | € 9,50 | A |
| La Montanara | Pomodoro, fior di latte, patate al forno, funghi, speck, fontina | € 10,00 | A |
| Galimberti | Pomodoro, fior di latte, salsiccia, gorgo, salamino picc., cipolla | € 10,00 | A |
| Burrata in camicia | Pomodoro, burrata, crudo, olio | € 10,00 | A |
| Pippo | Pomodoro, bufala, spianata, olive taggiasche, basilico, origano | € 9,50 | A |
| Ligure | Fior di latte, fagiolini, patate, pesto | € 9,00 | A |
| Lulu | Fior di latte, prosciutto cotto fuori cottura, stracciatella, granella di pistacchio, basilico, olio | € 10,00 | A |
| Caramellata | Fior di latte, lardo, cipolla caramellata | € 10,00 | A |
| Puglia | Fior di latte, pomodorini, caciocavallo, basilico, olio | € 9,50 | A |

### Panuozzi (`menu1.png`)
| Nome | Prezzo | Cert. |
|---|---|---|
| Spianata e caciocavallo | € 8,50 | A |
| Prosciutto cotto bufala o burrata | € 9,00 | A |
| Prosciutto crudo bufala o burrata | € 10,00 | A |
| Tonno, pomodorini, cipolla | € 8,00 | A |
| Salsiccia, peperoni, scamorza | € 10,00 | A |
| Pomodorini, rucola, speck, stracciatella | € 9,00 | A |

### Farinate (`menu1.png`)
| Nome | Prezzo | Cert. |
|---|---|---|
| Farinata classica | € 3,50 | A |
| Farinata farcita | € 4,50 | A |

Nota in fondo a `menu1.png`, minuscola: "*Prodotto congelato / surgelato - Impasto integrale + 1 €" — **certezza B**.

### Focacce (`menu2.png`)
| Nome | Ingredienti | Prezzo | Cert. |
|---|---|---|---|
| Focaccia origano rosmarino | – | € 3,50 | A |
| Focaccia lardo e miele | – | € 6,50 | A |
| Focaccia crudo/speck/lardo | – | € 6,00 | A |
| Focaccia estiva | Bresaola, rucola, scaglie di grana | € 8,00 | A |
| Focaccia tricolore | Pomodorini, bufala, rucola | € 7,50 | A |
| Focaccia completa | Pomodorini, rucola, burrata, scaglie di grana, prosciutto crudo | € 9,00 | A |
| Focaccia Nutella | – | € 6,00 | A |

### Sfiziosità (`menu2.png`)
| Nome | Prezzo | Cert. |
|---|---|---|
| Patatine fritte* | € 4,00 | A |
| Gnocco fritto | € 5,00 | A |
| Gnocco fritto con affettati | € 7,00 | A |
| Gnocco fritto pizzaiola | € 6,00 | A |
| Gnocco fritto Nutella | € 7,00 | A |
| Crocchette di patate* (10 pz) | € 5,00 | A |
| Mozzarelline impanate* (10 pz) | € 5,00 | A |
| Rinforzo | € 1,00 | A (non so cosa sia) |
| Extra a scelta (pizze e farinate farcite) | € 1,00 | A |
| Aggiunte speciali: bufala, burrata, crudo, speck, lardo, bresaola, salmone, bacon | € 2,00 | A |

### Bibite e birre (`menu2.png`)
| Nome | Prezzo | Cert. |
|---|---|---|
| Lattine | € 2,00 | A |
| Acqua naturale o gasata | € 1,00 | A |
| Coca Cola bottiglia | € 3,00 | B (formato non indicato) |
| Ceres 33cl | € 3,00 | B (dopo "33cl" c'è un numero, "3", che ripete il prezzo o è altro: non lo so) |
| Beck's 33cl | € 2,50 | B (idem, "2,5") |
| Tennent's 33cl | € 3,00 | B (idem, "3") |
| Moretti 66cl | € 2,50 | B (idem, "2,5"; prezzo basso per 66cl, da verificare) |

Consegna a domicilio: **€ 2,00** (`menu2.png`). Il volantino non dice zona servita né ordine minimo.

## 5. Dati di contatto e servizio (con fonte)
| Dato | Valore | Fonte | Stato |
|---|---|---|---|
| Nome | Pizzeria Galimberti | [note], `logo.png` | ok |
| Indirizzo | Piazza Galimberti 5, Torino | [note], `menu2.png` | ok |
| Tipo | Pizzeria con forno a legna | [note] | Il volantino dice "pizza al mattone", non "legna": coerente ma da far confermare la formula da usare |
| Orari | 18:00–22:30 | [note], `menu2.png` | ok (due fonti concordi) |
| Giorni | martedì–domenica, chiuso lunedì | [note] ("martedi-domenica compresi"), `menu2.png` | Il lunedì chiuso è una deduzione da "martedì–domenica": [DA CONFERMARE] |
| Telefono mobile | 328 277 6118 | [note], `menu2.png` | ok. WhatsApp sullo stesso numero: **non lo so** |
| Telefono fisso | 011 1948 1030 | [note], `menu2.png` | ok |
| Ordini | telefono, Just Eat, asporto, consegna a domicilio | [note] | ok |
| Link Just Eat | vuoto | [note] | [DA CONFERMARE] |
| Glovo | logo nel volantino | `menu2.png` | non nelle note: [DA CONFERMARE] se è ancora attivo |
| Satispay | logo nel volantino | `menu2.png` | [DA CONFERMARE] |
| Instagram | pizzeria_galimberti | `menu2.png`; [note] dice solo "Instagram" | link da confermare |
| Facebook | "pizzeria galimberti" | `menu2.png` | non nelle note: [DA CONFERMARE] |
| Costo consegna | € 2,00 | `menu2.png` | [DA CONFERMARE] (data del volantino ignota) |
| Teglie su ordinazione, fino a 4 gusti | – | `menu2.png` | prezzo e preavviso: non lo so |

## 6. Cosa manca e cosa non si può sapere dal materiale
- Logo in alta risoluzione (quello dato è 134×68 px).
- Link Just Eat; zona di consegna; ordine minimo; tempi di attesa.
- Prezzi e preavviso per le teglie; prezzo dell'impasto integrale (+1 € letto con dubbio).
- Se si mangia sul posto (tavoli? coperti?). Se si accettano carte.
- Se il 328 è anche WhatsApp.
- Chiusure per ferie; festivi.
- Storia, titolare, anno di apertura: **non lo so**, e non va scritto nulla.
- Foto del locale, dell'insegna, del forno.
- Cosa sia "Rinforzo" e "Giogio"/"Porrosa" scritti bene.
- Data del volantino: se i prezzi sono aggiornati.
