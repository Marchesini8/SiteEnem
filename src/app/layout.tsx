import type { Metadata } from "next";
import { MetaPixel } from "@/components/layout/MetaPixel";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guiaenem2026.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Guia Definitivo ENEM 2026 | Guia, simulados e Drive completo",
    template: "%s | Guia Definitivo ENEM 2026",
  },
  description:
    "Garanta o Guia Definitivo ENEM 2026 por R$ 29,90 e receba acesso a um Drive completo com guia de estudos, simulados, cronograma, revisão e estratégias de redação.",
  keywords: [
    "Guia ENEM 2026",
    "plano de estudos ENEM",
    "cronograma ENEM",
    "redação ENEM",
    "preparação ENEM",
    "simulados ENEM",
    "Drive ENEM",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Guia Definitivo ENEM 2026",
    description: "Guia de estudos, simulados e Drive completo para melhorar sua preparação no ENEM.",
    url: siteUrl,
    siteName: "Guia Definitivo ENEM 2026",
    images: [
      {
        url: "/images/enem-drive-offer.png",
        width: 1024,
        height: 1365,
        alt: "Guia Definitivo ENEM 2026 com acesso via Drive e simulados",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Definitivo ENEM 2026",
    description: "Organize seus estudos para o ENEM 2026 com guia, simulados e Drive completo.",
    images: ["/images/enem-drive-offer.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
