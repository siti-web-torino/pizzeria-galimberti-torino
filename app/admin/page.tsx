import { autenticato } from "@/lib/auth";
import { leggiDati, leggiRegistro, statoDatabase } from "@/lib/store";

import Accesso from "./accesso";
import Pannello from "./pannello";

/** Dipende dal cookie di accesso: mai in cache. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await autenticato())) return <Accesso />;

  const [dati, registro, db] = await Promise.all([
    leggiDati(),
    leggiRegistro(),
    statoDatabase(),
  ]);

  return <Pannello dati={dati} registro={registro} db={db} />;
}
