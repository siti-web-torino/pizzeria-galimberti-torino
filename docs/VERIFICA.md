# Verifica – 28/10/2026

Screenshot in `docs/anteprime/` (390, 768, 1280 px; prima schermata e pagina intera; admin a 390).
Controlli automatici con Playwright + Edge (`strumenti/`, fuori da git): nessun errore in console,
nessun file 404 (a parte la pagina 404 voluta), nessuno scorrimento orizzontale a nessuna
larghezza, nessun link o bottone sotto i 44 px, tutte le immagini con testo alternativo.

## Test dei 5 secondi (390 px, `home-390-prima-schermata.png`)
Si vede: logo, "Forno a legna · Piazza Galimberti 5, Torino", "STASERA PIZZA?", stato
("Oggi apre alle 18:00" / "Aperto adesso, fino alle 22:30"), cosa fanno, "Chiama", "Ordina su
Just Eat" e la barra fissa Chiama · Just Eat · Mappa. Un estraneo capisce che è una pizzeria
d'asporto, dove sta e cosa fare. Debole: la parola "pizzeria" in chiaro c'è solo nel logo
piccolo (134 px di larghezza originale).

## Scenario: venerdì sera, telefono, per strada
- È aperto? 0 tocchi: lo stato è nella prima schermata, calcolato sull'ora di Torino.
- Dov'è? 1 tocco ("Mappa" nella barra) apre Google Maps.
- Cosa mangio e quanto costa? 2 tocchi: "Menu" in testata → scheda della categoria.
  Da telefono si vede una categoria alla volta (prima il menu era lungo 11 schermate).
- Ordino? 1 tocco: "Chiama" o "Just Eat".

## Difetti trovati e cosa è stato fatto
| Dove | Larghezza | Difetto | Perché conta | Esito |
|---|---|---|---|---|
| Menu | 390 | 90 voci di fila: pagina alta 11.000 px, orari raggiungibili solo scorrendo a lungo | Chi cerca gli orari dopo il menu si perde | Corretto: schede, una categoria alla volta da telefono |
| Schede "Cosa facciamo" | 1280 | 3 schede in griglia a 2 colonne: la terza restava sola con mezzo schermo vuoto | Sembra un errore | Corretto: 3 colonne da 768 px |
| Elenco del volantino | 1280 | Il titolo "Cosa facciamo" e la prima riga avevano stesso colore e stile | Gerarchia confusa | Corretto: righe sottili in nero, piene in rosso |
| Orari | tutte | "Mercoledì (Oggi)" con la O maiuscola | Dettaglio sciatto | Corretto |
| Instagram | 390 | Link di testo alto meno di 44 px | Difficile da toccare | Corretto |
| Testo "Le speciali" | tutte | "12 pizze fuori dal solito" | Frase da brochure | Ora: "12 pizze speciali, per esempio: …" |
| Pagina 404 | tutte | Testo di Next in inglese | Fuori lingua | Corretto |
| Prima schermata | 768 | La foto della pizza è piccola e ritagliata in verticale, il cornicione si perde | Estetica, non uso | **Non corretto**, da rivedere con foto migliori |
| Elenco del volantino | 1280 | Colonna stretta a sinistra, due terzi vuoti a destra | Spazio sprecato | Corretto il 28/10 con l'effetto "pasta che si stende": blocco giustificato centrato |
| Logo | tutte | Il file è 134×68 px: a 2x (telefoni) è sfocato | Prima cosa che si vede | **Non correggibile** senza il file originale: va chiesto al locale |
| Bibite | 390 | Cinque [DA CONFERMARE] di fila rendono la lista pesante | Ma sono dubbi veri sul volantino | Lasciato: si tolgono quando il titolare conferma |

## Testi
- "Quella torinese, alta e cotta nel suo tegamino." (scheda tegamino) è una mia frase, non del
  locale: descrive la foto (`tegamino.png`) e il tipo di pizza. Da far leggere al titolare.
- "Pizza al mattone e al tegamino, panuozzi, focacce, farinate e teglie su ordinazione" riprende
  l'elenco del volantino (`menu2.png`). "Stasera pizza?" e la frase sulle teglie sono copiate
  dal volantino, senza modifiche.
- Nessuna recensione, storia, nome o data: nel materiale non ci sono.

## Tastiera e accessibilità
- Tab: "Vai al menu" (link per saltare) → logo → Menu, Orari, Dove → Chiama → Just Eat → …
  Il focus è un bordo scuro con alone bianco (`focus-chiama` verificato a 390 px), visibile
  anche sul rosso.
- Contrasti: bianco su `#912427` circa 8:1; grigio `#6b625e` su carta/bianco oltre 5:1.
- `prefers-reduced-motion`: scorrimento morbido e transizioni disattivati.
- Lo stato "aperto adesso" è annunciato (`aria-live="polite"`).

## Identità
Usa il logo così com'è, il rosso campionato dal logo, i titoli maiuscoli pesanti e le frasi
del volantino. Sembra il volantino del locale messo sul telefono, non un template. Il limite
vero sono le foto: quattro piatti fotografati col telefono, nessuna del locale.

## Admin (verificata in locale, `strumenti/prova-admin.js`)
Login con password sbagliata rifiutato; prezzo non valido rifiutato con messaggio; cambio
prezzo, avviso, consegna sì/no e ferie visibili subito sul sito; quattro "Annulla" di fila
riportano tutto com'era. In produzione: senza database o con database irraggiungibile il sito
mostra i dati iniziali e l'admin mostra un riquadro rosso e blocca i salvataggi
(`admin-390-database-non-collegato.png`). Con `ADMIN_PASSWORD` vuota o d'esempio la build e
`next start` si fermano con un messaggio.

## Effetto "la pasta che si stende" (aggiunto su richiesta dell'utente)
Le sei righe del volantino partono strette (larghezza del font al 62%) e, scorrendo, si
allargano fino al 125% componendo il blocco giustificato di `menu2.png`; le righe piene da
destra, le sottili da sinistra. Provato con Playwright a 390 e 1280 px (`strumenti/prova-pasta.js`):
a fine corsa ogni riga misura quanto il contenitore (356-357 px su 358 a 390 px), nessuno
scorrimento orizzontale, nessun errore in console. Con "riduci movimento" le righe sono subito
stese, senza animazione. Senza JavaScript resta l'elenco statico di prima. Costo: nessuna
immagine né libreria, solo l'asse di larghezza del font già caricato.
