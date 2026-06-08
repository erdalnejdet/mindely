import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Turbopack yanlışlıkla üst dizindeki lockfile’ı kök sanmasın (bkz. Next uyarısı + bozuk .next cache). */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: turbopackRoot,
  },
  async redirects() {
    return [
      {
        source: "/auth/register/psychologist",
        destination: "/terapist-islemleri/kayit",
        permanent: true,
      },
      {
        source: "/terapist-islemleri/giris",
        destination: "/auth/login?next=/dashboard",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
