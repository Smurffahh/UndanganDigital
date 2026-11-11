import type { Metadata } from "next";
import { LinkGeneratorClient } from "./LinkGeneratorClient";

export const metadata: Metadata = {
  title: "Generator Link Undangan (Kode 6 Digit) — Fauzan & Sinta",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LinkGeneratorPage() {
  return <LinkGeneratorClient />;
}
