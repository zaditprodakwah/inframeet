import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/env";
import CommandMenu from "./components/CommandMenu";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingContactForm from "@/components/FloatingContactForm";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "INFRAMEET | Infrastruktur Kepercayaan B2B",
    template: "%s | INFRAMEET"
  },
  description: "Platform Infrastruktur Kepercayaan B2B. Pembangunan web berkecepatan tinggi, integrasi direktori, audit Vitals, dan agregator data publik.",
  keywords: ["B2B SaaS", "Web Enterprise", "Direktori Pakar", "Migrasi Cloud", "Zadit Prodakwah"],
  authors: [{ name: "Zadit Prodakwah" }],
  creator: "Zadit Prodakwah",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://inframeet.vercel.app"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://inframeet.vercel.app",
    title: "INFRAMEET | Infrastruktur Kepercayaan B2B",
    description: "Platform Infrastruktur Kepercayaan B2B. Akselerasi pertumbuhan bisnis dan akademik melalui direktori pakar terverifikasi.",
    siteName: "INFRAMEET",
  },
  twitter: {
    card: "summary_large_image",
    title: "INFRAMEET | Infrastruktur Kepercayaan B2B",
    description: "Platform Infrastruktur Kepercayaan B2B. Akselerasi pertumbuhan bisnis dan akademik.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import QueryProvider from "@/components/QueryProvider";

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "INFRAMEET Trust Infrastructure",
                "provider": {
                  "@type": "Organization",
                  "name": "INFRAMEET",
                  "url": "https://inframeet.vercel.app"
                },
                "serviceType": "B2B Trust & Verification Platform",
                "description": "Platform infrastruktur kepercayaan berbasis bukti untuk direktori B2B, lembaga akademik, dan pakar terverifikasi.",
                "areaServed": "ID",
                "availableLanguage": "Indonesian"
              })
            }}
          />
          <QueryProvider>
            {children}
          </QueryProvider>
        <MobileBottomNav />
        <FloatingContactForm />
        <CommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}

