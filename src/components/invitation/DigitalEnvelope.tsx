"use client";

import { useState, useEffect } from "react";
import { SongketRibbon, ChipMetallic } from "./Ornaments";
import { Copy, Check, QrCode, X, MapPin, Download } from "lucide-react";
import { toast } from "sonner";

interface AccountItem {
  brand: string;
  type: string;
  number: string;
  holder: string;
}

interface GiftAddress {
  receiver: string;
  phone: string;
  address: string;
}

interface DigitalEnvelopeProps {
  bankAccounts: AccountItem[];
  ewallets: AccountItem[];
  giftAddress: GiftAddress;
  qrisImageUrl?: string;
}

export function DigitalEnvelope({
  bankAccounts,
  ewallets,
  giftAddress,
  qrisImageUrl = "https://images.unsplash.com/photo-1595079672139-cdc4b0b44714?auto=format&fit=crop&w=600&q=80",
}: DigitalEnvelopeProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);

  // Close QRIS modal with Escape key (better-accessibility)
  useEffect(() => {
    if (!showQrisModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowQrisModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQrisModal]);

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} berhasil disalin ke clipboard ✓`);
      setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 2500);
    } catch {
      toast.error("Gagal menyalin, silakan salin secara manual.");
    }
  };

  const allAccounts = [...bankAccounts, ...ewallets];

  return (
    <section id="amplop" className="py-20 relative" aria-label="Amplop Digital dan Hadiah Pernikahan">
      <div className="w-[min(100%-2.75rem,720px)] mx-auto">
        <header className="text-center mb-9">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
            Wedding Gift
          </p>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
            Amplop Digital
          </h2>
          <SongketRibbon />
          <p className="text-xs sm:text-sm text-muted max-w-[420px] mx-auto mt-3">
            Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila Anda ingin memberikan tanda kasih secara digital, dapat melalui:
          </p>
        </header>

        {/* Action Button: Modal QRIS Trigger */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setShowQrisModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-white border border-gold-500/60 text-gold-600 text-xs font-bold tracking-[0.16em] uppercase shadow-sm transition-transform duration-150 active:scale-[0.96] hover:bg-rose-100 cursor-pointer"
          >
            <QrCode className="w-4 h-4 stroke-[2]" />
            <span>Lihat Kode QRIS (Semua Bank / E-Wallet)</span>
          </button>
        </div>

        {/* ATM Card Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {allAccounts.map((acc, idx) => {
            const copyKey = `acc-${idx}-${acc.number}`;
            const isCopied = copiedKey === copyKey;

            return (
              <article
                key={copyKey}
                className="relative overflow-hidden rounded-2xl p-5 border border-gold-500/40 shadow-[0_20px_40px_-16px_rgba(93,58,65,0.2)] bg-gradient-to-br from-[#fffcf9] via-[#fcf5f1] to-[#f7e9e5] flex flex-col justify-between"
              >
                {/* Top Card Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                    <span className="font-serif font-bold text-base text-rose-900 tracking-wide">
                      {acc.brand}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-600">
                    {acc.type}
                  </span>
                </div>

                {/* Metallic Chip & Wireless Icon */}
                <div className="flex items-center justify-between mb-4">
                  <ChipMetallic />
                  <svg className="w-6 h-6 text-gold-600/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8.5 16.5a5 5 0 0 1 0-7M12 19a8.5 8.5 0 0 0 0-14M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Card Number in Tabular Nums */}
                <div className="mb-4">
                  <p className="font-serif font-semibold text-xl tracking-[0.08em] text-ink tabular-nums">
                    {acc.number}
                  </p>
                  <p className="text-xs text-muted mt-1 font-light">
                    a.n. <span className="font-medium text-rose-900">{acc.holder}</span>
                  </p>
                </div>

                {/* Salin Button with Contextual Icon Swap */}
                <button
                  type="button"
                  onClick={() => handleCopy(acc.number, copyKey, `Nomor ${acc.brand}`)}
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-200 active:scale-[0.96] cursor-pointer ${
                    isCopied
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                      : "bg-surface-white border-gold-600/50 text-gold-600 hover:bg-gold-500 hover:text-white hover:border-gold-500"
                  }`}
                >
                  <span className="relative w-4 h-4 grid place-items-center">
                    {isCopied ? (
                      <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-300 stroke-[2.5]" />
                    ) : (
                      <Copy className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </span>
                  <span>{isCopied ? "Berhasil Disalin" : "Salin Nomor Rekening"}</span>
                </button>
              </article>
            );
          })}
        </div>

        {/* Physical Gift Address Card */}
        <article className="rounded-2xl p-6 border border-gold-500/40 shadow-[0_20px_40px_-16px_rgba(93,58,65,0.2)] bg-gradient-to-br from-[#fffcf9] via-[#fcf5f1] to-[#f7e9e5]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-700" />
              <span className="font-serif font-bold text-base text-rose-900">
                Kirim Kado Fisik
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-600">
              Alamat Penerima
            </span>
          </div>

          <p className="text-xs sm:text-sm text-ink leading-relaxed font-light mb-2">
            {giftAddress.address}
          </p>

          <p className="text-xs text-muted mb-4 font-light">
            Penerima: <span className="font-medium text-rose-900">{giftAddress.receiver}</span> &middot;{" "}
            <span className="tabular-nums">{giftAddress.phone}</span>
          </p>

          {/* Salin Alamat Button */}
          <button
            type="button"
            onClick={() => handleCopy(giftAddress.address, "addr-copy", "Alamat")}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-200 active:scale-[0.96] cursor-pointer ${
              copiedKey === "addr-copy"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                : "bg-surface-white border-gold-600/50 text-gold-600 hover:bg-gold-500 hover:text-white hover:border-gold-500"
            }`}
          >
            <span className="relative w-4 h-4 grid place-items-center">
              {copiedKey === "addr-copy" ? (
                <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-300 stroke-[2.5]" />
              ) : (
                <Copy className="w-4 h-4 stroke-[1.8]" />
              )}
            </span>
            <span>{copiedKey === "addr-copy" ? "Alamat Berhasil Disalin" : "Salin Alamat Lengkap"}</span>
          </button>
        </article>
      </div>

      {/* QRIS Modal */}
      {showQrisModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kode QRIS Amplop Digital"
          onClick={() => setShowQrisModal(false)}
          className="fixed inset-0 z-50 bg-[#2b151b]/90 backdrop-blur-md grid place-items-center p-4 animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-white border border-gold-500/40 rounded-3xl p-6 sm:p-7 max-w-[360px] w-full text-center relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              aria-label="Tutup modal QRIS"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-rose-100 text-rose-900 grid place-items-center hover:bg-rose-200 active:scale-[0.96] transition-transform cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>

            <span className="inline-block px-4 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
              QRIS Statis
            </span>

            <h3 className="font-serif font-bold text-xl text-rose-900 mb-1">
              Pindai QRIS
            </h3>
            <p className="text-xs text-muted mb-4 font-light">
              Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, dan seluruh m-Banking.
            </p>

            {/* QR Image */}
            <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border border-gold-500/30 shadow-inner grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrisImageUrl}
                alt="Kode QRIS Dian dan Iqbal"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <p className="text-xs font-semibold text-rose-900 mt-3">
              a.n. Dian Ayu Puspa Sari / Iqbal Pradana
            </p>

            {/* Download QR Button */}
            <a
              href={qrisImageUrl}
              download="qris-dian-iqbal.png"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gold-600 text-white text-xs font-bold tracking-[0.16em] uppercase transition-colors duration-150 active:scale-[0.96] hover:bg-gold-500"
            >
              <Download className="w-4 h-4" />
              <span>Simpan Gambar QR</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
