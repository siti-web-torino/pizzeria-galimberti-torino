import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

// Archivo (SIL OFL 1.1, licenza in app/fonts/OFL-Archivo.txt), ospitato nel
// progetto. Variabile in peso e larghezza: un solo file per titoli stretti
// e testo normale.
const archivo = localFont({
  src: "./fonts/archivo-variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  title: "Pizzeria Galimberti · Piazza Galimberti 5, Torino",
  description:
    "Pizza al mattone, al tegamino, panuozzi, focacce, farinate e teglie su ordinazione. Asporto e consegna a domicilio in Piazza Galimberti 5, Torino.",
  // Sito dimostrativo: fuori dai motori di ricerca finché il cliente non dice di sì.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#912427",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
