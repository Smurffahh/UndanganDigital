"use client";

import { useState } from "react";
import Link from "next/link";
import { MonogramFS } from "@/components/invitation/Ornaments";

interface TokenItem {
  name: string;
  code: string;
  url: string;
}

export function LinkGeneratorClient() {
  const [pin, setPin] = useState("");
  const [namesInput, setNamesInput] = useState("");
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedPin = pin.trim();
    if (!trimmedPin) {
      setErrorMessage("Masukkan PIN admin terlebih dahulu.");
      return;
    }

    const lines = namesInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setErrorMessage("Masukkan minimal 1 nama tamu.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/guest-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: trimmedPin, names: lines }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat link tamu.");
      }

      setTokens(data.tokens || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat membuat link.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async (code: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      prompt("Salin link manual:", url);
    }
  };

  const getWaUrl = (name: string, url: string) => {
    const text = `Kepada Yth. *${name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:\n\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.\n\nTerima kasih.\n*Fauzan & Sinta*`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-dvh bg-[#0d1319] text-[#e8eaed] flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-[#141d26] border border-[#C5A059]/25 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-6">
          <MonogramFS className="size-12 mb-3" />
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#EAD8B1]">
            Generator Link Tamu (Kode 6 Digit)
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#A68850] mt-1">
            Format resmi aman anti-pemalsuan: <code className="text-amber-300 font-mono">?to=K9mP4x</code>
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              PIN Admin Otorisasi
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan PIN Admin"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1319] border border-[#C5A059]/30 text-sm text-[#EAD8B1] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059] transition-[border-color,box-shadow]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Daftar Nama Tamu (Satu Nama Per Baris)
            </label>
            <textarea
              rows={4}
              value={namesInput}
              onChange={(e) => setNamesInput(e.target.value)}
              placeholder="Contoh:&#10;Bpk. Joko Widodo & Istri&#10;Dr. Ahmad Fauzi&#10;Keluarga Besar Bpk. Hendra"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1319] border border-[#C5A059]/30 text-sm text-[#EAD8B1] placeholder-zinc-500 focus:outline-none focus:border-[#C5A059] transition-[border-color,box-shadow]"
              required
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/admin/dashboard"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-3"
            >
              ← Kembali ke Dashboard
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#947432] via-[#C5A059] to-[#947432] text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.96] transition-[transform,filter] disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : "Buat Link 6 Digit"}
            </button>
          </div>
        </form>

        {tokens.length > 0 && (
          <div className="mt-8 border-t border-[#C5A059]/20 pt-6">
            <h2 className="font-serif text-base sm:text-lg text-[#EAD8B1] font-semibold mb-3">
              Hasil Link Terverifikasi ({tokens.length} Tamu)
            </h2>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {tokens.map((item) => (
                <div
                  key={item.code}
                  className="p-3.5 rounded-xl bg-[#0d1319] border border-[#C5A059]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-sm text-[#EAD8B1] truncate">
                        {item.name}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#C5A059]/20 text-[#EAD8B1] border border-[#C5A059]/40">
                        {item.code}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                      {item.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item.code, item.url)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#C5A059]/40 bg-[#141d26] hover:bg-[#1f2c3a] text-[#EAD8B1] active:scale-[0.96] transition-[transform,background-color]"
                    >
                      {copiedCode === item.code ? "Tersalin!" : "Salin Link"}
                    </button>
                    <a
                      href={getWaUrl(item.name, item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.96] transition-[transform,background-color]"
                    >
                      Kirim WA
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
