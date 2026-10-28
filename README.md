# template-vetrina

Punto di partenza per i siti vetrina one-page dei clienti. Contiene solo le regole
(`CLAUDE.md`): il sito lo costruisce Claude Code.

## Nuovo cliente

1. Su GitHub: **Use this template → Create a new repository**, proprietario
   `siti-web-torino`, nome del cliente in minuscolo con trattini (es. `quartin-torino`).
   Poi clonalo sul tuo computer.
2. Copia le foto del cliente (menu, logo, locale, slogan, cose divertenti) in
   `img-originali/`.
3. Apri un terminale nella cartella del progetto e lancia `claude` (modello più forte per
   questa corsa: `/model`).
4. Incolla il messaggio che ti prepara la chat di avvio, in questa forma:

   ```
   Nuovo cliente: [NOME], [VIA, QUARTIERE], Torino. Tipo: [pizzeria / bar / ...].
   Note: [quello che sai]
   Foto in img-originali/.
   Preferenze mie, facoltative e non vincolanti: [...]
   Segui CLAUDE.md. Lavora da solo fino alla fine.
   ```

5. Al termine leggi, in questo ordine: `RAPPORTO.md`, gli screenshot in `docs/anteprime/`,
   il menu trascritto in `STUDIO.md` e `DECISIONI.md`.

## Perché CLAUDE.md non cambia da solo
È un normale file di testo. Cambia solo se lo modifichi tu o se chiedi a Claude di farlo
("aggiungi questa regola al CLAUDE.md"). Ogni nuovo cliente riceve una copia al momento
della creazione dal template: migliorare il template non cambia i siti già fatti.
