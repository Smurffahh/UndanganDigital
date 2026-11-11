import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans, Amiri } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://undangan-digital-fauzan-sinta.vercel.app"
  ),
  title: "The Wedding of Fauzan & Sinta (#SINgkatceritaFAUZAN)",
  description:
    "Minggu, 3 Januari 2027 — Undangan Pernikahan Fauzan Ma'ruf & Sinta Maria Utami. Buka untuk melihat waktu, lokasi acara, dan konfirmasi kehadiran.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "The Wedding of Fauzan & Sinta",
    title: "The Wedding of Fauzan & Sinta (#SINgkatceritaFAUZAN)",
    description:
      "Minggu, 3 Januari 2027 — Undangan Pernikahan Fauzan Ma'ruf & Sinta Maria Utami. Buka untuk melihat waktu, lokasi acara, dan konfirmasi kehadiran.",
    images: [
      {
        url: "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg?v=20270103",
        width: 1200,
        height: 630,
        alt: "The Wedding of Fauzan & Sinta",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding of Fauzan & Sinta (#SINgkatceritaFAUZAN)",
    description:
      "Minggu, 3 Januari 2027 — Undangan Pernikahan Fauzan Ma'ruf & Sinta Maria Utami. Buka untuk melihat waktu, lokasi acara, dan konfirmasi kehadiran.",
    images: [
      "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg?v=20270103",
    ],
  },
  icons: {
    icon: "/images/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#9c5f66",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${greatVibes.variable} ${plusJakarta.variable} ${amiri.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
      </head>
      <body className="font-sans antialiased bg-cream text-ink min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
