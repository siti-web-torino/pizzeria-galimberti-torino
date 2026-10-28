# RAPPORTO – Pizzeria Galimberti (28/10/2026)

## Cosa è pronto
- **Sito pubblico** (Next.js), provato in locale a 390, 768 e 1280 px: stato "aperto adesso",
  Chiama / Just Eat / Mappa a un tocco, menu completo dal volantino con schede, orari, dove
  siamo. Commit: `Sito pubblico Next.js…`.
- **Admin `/admin`** per il titolare, pensata per il telefono: avviso in cima, orari, ferie e
  chiusure, consegna sì/no, voci e prezzi del menu, registro con Annulla. Nessun dato personale.
  Commit separato: `Admin del titolare…`. Provata end-to-end in locale (`docs/VERIFICA.md`).
- **Sicurezza:** in produzione build e avvio si fermano se `ADMIN_PASSWORD` è vuota, è il valore
  di `.env.example` o è sotto 10 caratteri. Nessuna password nel repo (`.env.local` è ignorato).
- **Database:** se non è collegato o non risponde, il sito mostra i dati iniziali (solo note +
  volantino, con i [DA CONFERMARE]) e l'admin mostra un riquadro rosso e blocca i salvataggi.
- **Demo:** noindex in meta e intestazione HTTP, `robots.txt` chiuso, nessuna sitemap. Niente
  pubblicato, nessun push, nessun account creato, nessuna spesa.
- **Flow:** clonato in sola lettura in `../flow-running-club` (fuori da questo repo). Ripresi solo
  auth, store con fallback, Zod, server action e registro con Annulla.

## Cosa controllare per primo
1. Il menu e i prezzi col titolare: è tutto [DA CONFERMARE] (volantino di data ignota).
2. Il link Just Eat: l'ho trovato in rete, non era nelle note.
3. Lunedì chiuso (dedotto), quale numero sul bottone "Chiama" (ho messo il fisso).
4. Il permesso per foto e logo, e il logo in alta risoluzione (quello dato è 134×68 px, sgranato).
5. La frase mia sul tegamino ("Quella torinese, alta e cotta nel suo tegamino"): da far leggere.

## Cosa non si sa
Zona e minimo di consegna, prezzi di teglie e tegamino, se c'è WhatsApp, se si mangia sul posto,
se Glovo/Satispay/Facebook (nel volantino) sono ancora attivi: nel sito non li ho messi. Le
recensioni online sono contraddittorie (Restaurant Guru dà 4,7 e 2,4 in due risultati, e il
locale aperto anche il lunedì): non usate. Attenzione all'omonimo **Cammafà, Piazza Galimberti
23**: è un'altra pizzeria.

## Hosting: dove, cosa cambia, quanto costa
**Dove:** Vercel (piano **Pro**) + Upstash Redis (piano gratuito) collegato dal Marketplace di
Vercel. È la stessa architettura di Flow, quindi nessuna modifica al codice.

**Il piano gratuito Hobby di Vercel non è ammesso** per un sito di un cliente: è "restricted to
non-commercial personal use only", e tra gli esempi di uso commerciale ci sono pubblicizzare la
vendita di un prodotto e ricevere un pagamento per creare o ospitare il sito
([Vercel, Fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)).

**Cosa cambia rispetto agli altri siti vetrina** (HTML statico): serve un server (non basta
GitHub Pages), variabili d'ambiente segrete, un database, la gestione della password del
titolare, aggiornamenti di sicurezza di Next.js nel tempo, e un costo mensile che non è zero.

**Costi verificati il 28/10/2026:**
| Voce | Costo | Fonte |
|---|---|---|
| Vercel Pro | $20/mese per seat sviluppatore, con $20 di credito d'uso incluso; oltre, a consumo | [vercel.com/pricing](https://vercel.com/pricing) |
| Upstash Redis Free | $0: 500.000 comandi/mese, 256 MB, 1 database. Un sito così ne usa poche migliaia | [upstash.com/pricing/redis](https://upstash.com/pricing/redis) |
| Upstash, se si supera | $0,20 ogni 100.000 comandi | idem |
| Dominio (.it o .com) | **Non verificato**, da controllare | – |

Note: Upstash archivia i database gratuiti dopo almeno 14 giorni di inattività, con backup e
email di avviso prima ([Upstash FAQ](https://upstash.com/docs/redis/help/faq)); in quel caso il
sito mostra i dati iniziali e l'admin lo segnala. La pagina prezzi di Upstash non dice se il
piano gratuito ammette uso commerciale: da leggere nei termini prima di andare online.
Suppongo (non verificato) che un solo account Vercel Pro possa ospitare anche gli altri siti
dei tuoi clienti, dividendo i $20 al mese.

**Alternativa più economica, non provata:** Cloudflare Workers con l'adattatore OpenNext, che
dichiara supporto a Next.js 16 ([opennext.js.org/cloudflare](https://opennext.js.org/cloudflare)).
Workers Paid costa $5/mese ([Cloudflare](https://developers.cloudflare.com/workers/platform/pricing/));
il piano Free ha 10 ms di CPU per richiesta e 3 MiB di bundle, probabilmente stretti per
Next.js. Richiede di adattare la build e di riprovare tutto: non l'ho fatto.

## Cosa devi fare tu a mano per metterla online
1. Avere l'ok del titolare (incarico, uso di foto e logo) e fargli confermare i [DA CONFERMARE].
2. Creare il repository GitHub (privato) e fare il push: io non ho pushato.
3. Account Vercel → piano Pro → "Add New Project" → importare il repository.
4. Nel progetto Vercel: Marketplace → Upstash Redis → creare il database e collegarlo
   (imposta da solo `KV_REST_API_URL` e `KV_REST_API_TOKEN`).
5. Settings → Environment Variables (Production): `ADMIN_PASSWORD` (almeno 10 caratteri, non
   quella di esempio) e `AUTH_SECRET` (`openssl rand -base64 32`). **Prima** del primo deploy,
   altrimenti la build si ferma apposta.
6. Deploy, poi aprire `/admin`: il riquadro in alto deve dire "Database collegato".
7. Dare la password al titolare di persona (non per messaggio), salvarla sul suo telefono,
   mostrargli come cambiare un orario e come si usa Annulla.
8. Dominio: comprarlo e collegarlo in Vercel → Domains.
9. Solo quando il cliente dice di sì: togliere il noindex dal sito pubblico (`app/robots.txt`,
   `robots` in `app/layout.tsx`, intestazione `X-Robots-Tag` in `next.config.ts` da limitare
   a `/admin`). L'admin deve restare noindex (`app/admin/layout.tsx`).

**Mantenimento:** circa $20/mese di Vercel Pro (divisibili tra più clienti, da verificare) + $0
di Upstash + il dominio all'anno. Ogni tanto: aggiornare Next.js (`npm update`), controllare
che il database non sia stato archiviato, rinnovare il dominio.

## Che vantaggi dà un sito a una pizzeria che vive di telefono e Just Eat
- **Osservato:** le schede in rete dicono cose sbagliate (Restaurant Guru lo dà aperto il lunedì): un sito suo, che il titolare aggiorna dal telefono con orari, ferie e avvisi, diventa la fonte giusta ([Restaurant Guru](https://restaurantguru.com/Pizzeria-Galimberti-Turin), `menu2.png`).
- **Osservato, da verificare:** secondo i risultati di ricerca su Just Eat la Margherita costa € 7,00 contro € 5,50 del volantino (pagina Just Eat non leggibile): il sito mostra il suo listino e porta alla chiamata diretta.
- **Osservato:** tra le pizzerie torinesi al tegamino che ho cercato non ho trovato siti ufficiali, solo schede di guide ([Dissapore](https://www.dissapore.com/pizzerie/torino-le-12-migliori-pizze-al-padellino/)): avere menu e orari chiari da telefono lo distingue.
- **Supposto:** più ordini al telefono invece che in app riducono le commissioni; non so quanto paga oggi a Just Eat.
- **Supposto:** menu e prezzi leggibili in due tocchi tolgono telefonate del tipo "cosa avete, quanto costa?".

## Limite di questo lavoro
L'IA conosce gli schemi che funzionano, ma non misura la clientela reale di questo locale. Il
risultato va fatto vedere a 2-3 persone vere (e al titolare) prima di considerarlo giusto.
Il contatto con il titolare e la proposta commerciale restano a te.
