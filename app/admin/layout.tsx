import type { Metadata } from "next";

import "./admin.css";

export const metadata: Metadata = {
  title: "Gestione · Pizzeria Galimberti",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}
