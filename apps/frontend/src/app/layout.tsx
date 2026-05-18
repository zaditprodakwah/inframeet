import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CommandMenu from "./components/CommandMenu";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingContactForm from "@/components/FloatingContactForm";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        {children}
        <MobileBottomNav />
        <FloatingContactForm />
        <CommandMenu />
      </body>
    </html>
  );
}
