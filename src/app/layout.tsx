import type { Metadata } from "next";
import { Syne, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gen-M Tech — Digital Products & AI Solutions",
  description: "We design modern websites, brand identities, graphic designs, and AI solutions to help businesses grow.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Gen-M Tech — Digital Products & AI Solutions",
    description: "We design modern websites, brand identities, graphic designs, and AI solutions to help businesses grow.",
    url: "https://gen-m-website.ai.studio",
    siteName: "Gen-M Tech",
    images: [
      {
        url: "/og-square.png",
        width: 600,
        height: 600,
        alt: "Gen-M Tech",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gen-M Tech Digital Products & AI Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gen-M Tech — Digital Products & AI Solutions",
    description: "We design modern websites, brand identities, graphic designs, and AI solutions to help businesses grow.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta property="og:image" content="/og-square.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
