import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INFRAMEET | Premium B2B Solusi Enterprise & Akademik Kustom",
  description: "Pembangunan web-application berkecepatan tinggi, migrasi cloud database serverless, audit Core Web Vitals, asistensi statistik, Turnitin, layouting naskah jurnal steril.",
  keywords: ["Serverless hosting", "Web-development kustom", "Migrasi database cloud", "Turnitin naskah ilmiah", "SPSS SmartPLS", "Zadit Prodakwah"],
  authors: [{ name: "Zadit Prodakwah" }],
  metadataBase: new URL("https://inframeet.vercel.app"),
  alternates: {
    canonical: "/"
  }
};

import QueryProvider from "@/components/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0 light-mode">
        <QueryProvider>
          {children}
        </QueryProvider>
        <MobileBottomNav />
        <FloatingContactForm />
        <CommandMenu />
      </body>
    </html>
  );
}

