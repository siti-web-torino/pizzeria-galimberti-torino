# Sito vetrina per un'attività locale: regole e pipeline

Questo file viene letto da Claude Code all'inizio di ogni sessione in questa cartella.
Contiene le regole fisse. I dati del cliente stanno nel messaggio iniziale, in
img-originali/ e nei file che produci tu (STUDIO.md, DECISIONI.md, RAPPORTO.md).

Rispondi e scrivi i testi in italiano, in modo diretto: dì cosa non va senza giri di parole.

## Principio
L'utente ti dà tre cose: il posto, qualche informazione e qualche foto. Tutto il resto lo fai
tu, compreso lo studio del design. Le preferenze estetiche dell'utente sono facoltative e non
vincolanti: contano meno delle prove raccolte nella ricerca.

## Modalità di lavoro: autonoma di default
Lavora fino alla fine senza fare domande. Quando devi scegliere, scegli e annota scelta e
motivo in DECISIONI.md. Unica eccezione: se manca un input indispensabile (per esempio
nessun indirizzo), chiedilo subito, tutto insieme in un solo messaggio, prima di iniziare.
Ti fermi a chiedere la scelta tra le direzioni solo se l'utente lo chiede esplicitamente.
Avanza a piccoli passi, fai un commit git locale a fine di ogni fase, non riscrivere file
interi per cambiare un dettaglio e non rileggere foto già catalogate. Se uno strumento
manca (per esempio per gli screenshot), cerca un'alternativa; puoi installare strumenti solo
dentro questa cartella (per esempio in strumenti/, ignorata da git), mai a livello globale, e
non devono finire nel sito. Se non c'è un'alternativa, scrivilo in RAPPORTO.md e finisci il
resto. Non bloccarti mai su un permesso.

## Regole non negoziabili
- DATI: usa solo ciò che è nelle note e nelle foto. Mai inventare orari, prezzi, telefono,
  storia, nomi, recensioni. Ogni dato mancante o letto con dubbio è un riquadro visibile
  "[DA CONFERMARE]". Il menu letto da una foto resta [DA CONFERMARE] finché non lo conferma
  il locale.
- FONTI: per ogni affermazione cita il file o la fonte. Se non è nel materiale, scrivi
  "non lo so". Una fonte giornalistica va confermata con il locale prima dell'uso commerciale.
- MARCHIO E OMONIMI: non attribuire all'attività marchi o siti omonimi trovati altrove.
- LOGO: si usa com'è, senza ridisegnarlo o "migliorarlo".
- FOTO: solo quelle date dall'utente, mai immagini da internet. Foto con persone riconoscibili:
  non metterle nel sito e segnalarle (serve il consenso).
- SLOGAN E FRASI: si riusano solo come scritti. Mai inventare frasi e attribuirle a persone reali.
- ISPIRARSI NON È COPIARE: dai siti di altri si traggono principi e schemi, mai layout, testi,
  foto o grafiche.
- DEMO: meta robots noindex e robots.txt chiuso finché l'utente non dice altrimenti. Nessun
  push, nessuna pubblicazione, nessun contatto verso l'esterno, nessuna spesa senza il suo ok.
- STACK: HTML, CSS e JavaScript puri. Nessun framework, build o CDN. Struttura: index.html,
  css/style.css, js/main.js, img/, fonts/. Percorsi relativi (il sito può stare sotto
  /nome-repo/). Font ospitati nel progetto, solo licenze libere (OFL). "Come arrivare" è un
  link a Google Maps, mai un iframe. Tutti i dati modificabili in un unico oggetto in cima a
  js/main.js.

## Fasi

### 1. Studio del materiale (STUDIO.md)
Guarda ogni foto di img-originali/ una sola volta e scrivi tutto, citando il file di origine
per ogni affermazione:
- catalogo foto (file, cosa mostra, qualità, ritaglio, sezione adatta);
- identità visiva reale: palette con hex campionati dalle immagini, stile della scritta del
  logo, materiali, luce, atmosfera;
- tono di voce dagli slogan, con esempi copiati;
- menu trascritto, con certezza alta o bassa per riga;
- cosa manca per fare il sito e cosa non si può sapere dal materiale.
Se non sei sicuro di qualcosa, scrivilo: non indovinare.

### 2. Ricerca di contesto (sezione "Contesto e criteri di design" in STUDIO.md)
Prima di decidere il design, studia da solo il contesto con la ricerca web:
- che cosa cerca chi arriva sul sito di un'attività di questo tipo (di solito: aperto adesso?,
  dove?, cosa offre e a che prezzo?, come prenoto o ordino?) e in che ordine;
- 6-10 siti di attività simili, a Torino e i migliori esempi altrove: cosa mettono sopra la
  piega, come mostrano il menu da telefono, quali azioni propongono (chiama, WhatsApp,
  prenota, mappa), cosa funziona e cosa no. Nota i principi, non copiare nulla;
- cosa dicono di questo locale le fonti pubbliche (recensioni, profili social, articoli): cosa
  apprezzano i clienti, cosa sottolineano, con la fonte per ogni punto;
- le preferenze dell'utente, se ci sono: tienile se non danneggiano chiarezza e usabilità; se
  confliggono con ciò che emerge dalla ricerca, segui le prove e spiegalo in DECISIONI.md.
Concludi con 5-8 criteri di design concreti che guideranno le scelte (es. "menu leggibile in
3 tocchi da telefono", "orari in cima", "azione principale: WhatsApp"), distinguendo ciò che
hai osservato da ciò che stai supponendo.

### 3. Direzioni
Proponi 3 direzioni visive davvero diverse tra loro (non lo stesso concetto con colori
diversi), coerenti con le foto e con i criteri della ricerca. Per ognuna: concetto in una
frase, palette con ruoli, coppia di font con motivazione, uso di foto e logo, un dettaglio
memorabile, rischio principale, e quale foto o criterio la giustifica. Poi scegli tu quella
più fedele al locale e annota il motivo in DECISIONI.md.

### 4. Costruzione
Costruisci la direzione scelta, mobile-first (390px, poi tablet e desktop). Scale tipografica e
di spaziature come variabili CSS. Crea versioni ottimizzate delle foto in img/ (WebP, lato
lungo massimo 1600px, senza metadati EXIF) lasciando intatti gli originali. Contrasto WCAG AA,
bersagli touch di almeno 44px, focus visibile, prefers-reduced-motion. Evita l'aspetto da
sito generato: niente gradienti viola, card tutte uguali con ombra, emoji come icone, Inter
su bianco, hero centrato generico. Sezioni tipiche: Benvenuto con "Come arrivare", chi è,
proposta (menu), locale (galleria), dove e quando (indirizzo, orari, contatti), adattate ai
criteri trovati.

### 5. Verifica
Screenshot a 390, 768 e 1280px in docs/anteprime/. Poi critica dura, ancorata alle prove:
ogni difetto cita dove si vede, a quale larghezza e perché conta. Non inventare difetti per
sembrare severo e non ammorbidire quelli veri. Controlla:
- test dei 5 secondi: cosa capisce un estraneo nella prima schermata (che posto è, cosa
  offre, dove, cosa fare);
- scenario reale: venerdì sera, telefono, per strada. È aperto? Dov'è? Cosa si beve o mangia?
  Quanti tocchi servono?;
- gerarchia, tipografia, spazi, allineamenti, contrasto, immagini, coerenza con il logo,
  scorrimento orizzontale involontario, elementi tagliati;
- tastiera (Tab, focus), testi alternativi, errori in console, file 404;
- testi: generici, da brochure, fuori tono per un locale di quartiere; cita le frasi e
  proponi la versione;
- identità: sembra davvero il locale o un template con il suo nome?
Al massimo 2 giri di correzione per problema: se non si risolve, annotalo e vai avanti.
Prima di sostituire un testo, verifica se l'originale veniva dalle foto del locale: in tal
caso non sostituirlo.

### 6. Consegna
- README.md: come si cambiano i contenuti e l'elenco dei [DA CONFERMARE].
- DECISIONI.md: scelte fatte e perché.
- RAPPORTO.md breve: cosa è pronto, cosa controllare per primo, cosa non si sa. Scrivi sempre
  che l'IA conosce gli schemi che funzionano ma non misura la clientela reale di quel
  locale: il risultato va fatto vedere a 2-3 persone vere (e al cliente) prima di
  considerarlo giusto.

## Prima di mostrare il sito a qualcuno
Controlla che non resti nulla di inventato, che i [DA CONFERMARE] siano spiegati e che foto e
logo siano usati con permesso. Il contatto con i gestori e la proposta commerciale restano
all'umano.
