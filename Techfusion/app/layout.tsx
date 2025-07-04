import type { Metadata } from "next";
import { Bebas_Neue, Exo_2 } from "next/font/google";
import "./globals.css";
import AppLoader from "./components/AppLoader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const bebas_Neue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const exo_2 = Exo_2({
  variable: "--font-exo-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TECHFUSION",
  description: "Crypto and Tech News",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebas_Neue.variable} ${exo_2.variable} antialiased bg-background text-foreground min-h-screen w-full overflow-x-hidden`}
      >
        <AppLoader>
          <Navbar />
          <Hero />
          <main>{children}</main>
          <Footer />
        </AppLoader>
      </body>
    </html>
  );
}
