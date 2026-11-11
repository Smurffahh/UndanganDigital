import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Generator Link Undangan — Fauzan & Sinta",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LinkGeneratorPage() {
  redirect("/admin/dashboard");
}
