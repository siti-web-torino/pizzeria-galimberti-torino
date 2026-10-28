import type { NextConfig } from "next";

/**
 * Sito demo: niente indicizzazione finché il cliente non dice di sì.
 * L'intestazione vale anche per file e immagini, dove il meta tag non arriva.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
