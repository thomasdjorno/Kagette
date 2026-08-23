import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const heading = Poppins({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kagette — les fruits du jardin, transformés près de chez vous",
  description:
    "Kagette relie donneurs de fruits, cuisiniers locaux et gourmands autour de confitures, sirops et chutneys faits maison, en Dordogne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${heading.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
