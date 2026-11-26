import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Plus_Jakarta_Sans,
  Amiri,
  Noto_Sans_Javanese,
  Philosopher,
  Lora,
  Playfair_Display,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
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
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400"],
  display: "swap",
});

// Lazy theme fonts (preload: false) keep zero extra font downloads on default classic theme
const notoSansJavanese = Noto_Sans_Javanese({
  subsets: ["javanese"],
  variable: "--font-javanese",
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

const philosopher = Philosopher({
  subsets: ["latin"],
  variable: "--font-philosopher",
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.fauzansinta.my.id"
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
        url: "https://www.fauzansinta.my.id/images/og-wedding-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Undangan Pernikahan Fauzan & Sinta",
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
      "https://www.fauzansinta.my.id/images/og-wedding-preview.jpg",
    ],
  },
  icons: {
    icon: "/images/favicon.svg",
    apple: "/apple-touch-icon.png",
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
      className={`${cormorant.variable} ${greatVibes.variable} ${plusJakarta.variable} ${amiri.variable} ${notoSansJavanese.variable} ${philosopher.variable} ${lora.variable} ${playfairDisplay.variable}`}
    >
      <body className="font-sans antialiased bg-cream text-ink min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
