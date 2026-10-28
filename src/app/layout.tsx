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
  title: "The Wedding of Fauzan & Sinta — Minggu, 3 Januari 2027",
  description:
    "Undangan pernikahan digital Fauzan Pratama & Sinta Maharani — Minggu, 3 Januari 2027, Pekanbaru, Riau.",
  openGraph: {
    type: "website",
    title: "The Wedding of Fauzan & Sinta",
    description:
      "Minggu, 3 Januari 2027 — Pekanbaru, Riau. Merupakan kehormatan bagi kami apabila Anda berkenan hadir.",
    images: [
      {
        url: "https://i.pinimg.com/1200x/33/68/5c/33685c889963395977ed9789f4147b67.jpg",
        width: 1200,
        height: 630,
        alt: "The Wedding of Fauzan & Sinta",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
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
      <body className="font-sans antialiased bg-cream text-ink min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
