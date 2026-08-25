import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const heading = Poppins({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kagette, les fruits du jardin, transformés près de chez vous",
  description:
    "Kagette relie donneurs de fruits, cuisiniers locaux et gourmands autour de confitures, sirops et chutneys faits maison, en Dordogne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${heading.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
