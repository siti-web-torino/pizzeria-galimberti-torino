"use client";

import { useActionState } from "react";

import { entra } from "./actions";

export default function Accesso() {
  const [esito, azione, inCorso] = useActionState(entra, null);

  return (
    <main className="a-accesso">
      <h1>Gestione del sito</h1>
      <p>Pizzeria Galimberti</p>
      <form action={azione}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
        />
        {esito && !esito.ok ? (
          <p className="a-errore" role="alert">
            {esito.messaggio}
          </p>
        ) : null}
        <button className="a-bottone" type="submit" disabled={inCorso}>
          {inCorso ? "Controllo…" : "Entra"}
        </button>
      </form>
    </main>
  );
}
