// RootLayout.tsx (async server component)

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "react18-json-view/src/style.css";
import QueryProvider from "@/providers/queryProvider";
import { getLocale } from "next-intl/server";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import NotificationProvider from "@/providers/notifications";
// import Notification from "@/components/ui/notification";
// import CartController from "@/components/Cart/CartController";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Cartt from "@/components/Cart/Cartt";

const font_sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const font_mono_semibold = localFont({
  variable: "--font-mono-semibold",
  src: "../public/fonts/Aileron-SemiBold.otf",
});
const font_mono_bold = localFont({
  variable: "--font-mono-bold",
  src: "../public/fonts/Aileron-Bold.otf",
});

export const metadata: Metadata = {
  title:
    "LoumoShop — La Plateforme d’E-commerce la Plus Fiable et la Plus rapide",
  description:
    "Découvrez LoumoShop, votre plateforme e-commerce moderne qui vous offre une expérience de shopping rapide, simple et agréable en toute simplicité. Explorez des milliers de produits, profitez de livraisons rapides et d’une sécurité optimale. Rejoignez-nous dès aujourd’hui et vivez une nouvelle expérience d'achat en ligne !",
  keywords:
    "LoumoShop, e-commerce Cameroun, plateforme multi-vendeurs, boutique en ligne, acheter en ligne et livraison rapide, shopping sécurisé",
  openGraph: {
    type: "website",
    url: "https://loumoshop.com",
    title:
      "LoumoShop — La Plateforme d’E-commerce Multi-Vendeurs la Plus Fiable",
    description:
      "Shoppez malin avec LoumoShop ! Découvrez des milliers de produits, et profitez d’une expérience d’achat rapide, simple et sécurisée. Essayez dès maintenant !",
    images: [
      {
        url: "https://home.loumoshop.com/Images/hero.png",
        width: 1200,
        height: 630,
        alt: "LoumoShop - Marketplace multi-vendeurs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "LoumoShop — La Plateforme d’E-commerce Multi-Vendeurs la Plus Fiable",
    description:
      "LoumoShop simplifie vos achats ! Explorez des milliers de produits, profitez de prix attractifs et de livraisons rapides. Commencez vos achats dès maintenant !",
    images: ["https://home.loumoshop.com/Images/hero.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        {/* Google Identity script */}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>

      <body
        className={`${font_sans.variable} ${font_mono_bold.variable} ${font_mono_semibold.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          <QueryProvider>
            <NotificationProvider>
              {/* <Notification /> */}
              <Header />
              {/* <CartController /> */}
              {children}
              <Cartt />
              <Footer />
            </NotificationProvider>
            {/* <Maintenance /> */}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
