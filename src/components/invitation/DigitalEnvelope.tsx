"use client";

import { useState } from "react";
import { WayangDivider, ChipMetallic } from "./Ornaments";
import { Copy, Check, QrCode, MapPin, Download } from "lucide-react";
import { toast } from "sonner";
import { ScrollLinkedItem } from "./ScrollLinkedItem";
import { JavaneseScriptAccent } from "./JavaneseScriptAccent";
import { sanitizeSafeHref, sanitizeSafeMediaSrc } from "@/lib/urlUtils";
import type { FontTheme } from "@/lib/fontThemes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  fontTheme?: FontTheme;
}

function AestheticGoldQRCode() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/ornament-qris-gold.svg"
      alt="SVG Kode QRIS Estetik Berbingkai Emas"
      className="w-44 h-44 mx-auto object-contain select-none pointer-events-none"
      loading="lazy"
      draggable={false}
    />
  );
}

export function DigitalEnvelope({
  bankAccounts,
  ewallets,
  giftAddress,
  qrisImageUrl,
  fontTheme = "classic",
}: DigitalEnvelopeProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [qrisImgError, setQrisImgError] = useState(false);

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} berhasil disalin.`);
      setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 2500);
    } catch {
      toast.error("Gagal menyalin, silakan salin secara manual.");
    }
  };

  const allAccounts = [...bankAccounts, ...ewallets];
  const safeQrisImgSrc = sanitizeSafeMediaSrc(qrisImageUrl, "");
  const safeQrisDownloadHref = sanitizeSafeHref(qrisImageUrl, "");

  return (
    <section id="amplop" className="py-20 relative bg-transparent" aria-label="Amplop Digital dan Hadiah Pernikahan">
      <div className="w-[min(100%-2.75rem,720px)] mx-auto">
        <header className="text-center mb-9">
          <ScrollLinkedItem direction="down" offsetY={22}>
            <JavaneseScriptAccent section="envelope" fontTheme={fontTheme} className="mb-1 text-base sm:text-lg" />
            <p className="typo-eyebrow text-[#C59B6D] mb-2">
              Wedding Gift
            </p>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title text-[#6B1222]">
              Amplop Digital
            </h2>
            <WayangDivider />
            <p className="typo-body text-center max-w-[420px] mx-auto mt-3 text-[#3B1A20]">
              Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila Anda ingin memberikan tanda kasih secara digital, dapat melalui:
            </p>
          </ScrollLinkedItem>
        </header>

        <ScrollLinkedItem direction="center-scale" className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setShowQrisModal(true)}
            className="typo-button inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FBF7F2] border border-[#C59B6D]/60 text-[#6B1222] uppercase shadow-xs transition-colors duration-150 active:scale-[0.96] hover:bg-[#6B1222]/10 cursor-pointer min-h-11"
          >
            <QrCode className="w-4 h-4 stroke-[2] text-[#C59B6D]" />
            <span>Lihat Kode QRIS (Semua Bank / E-Wallet)</span>
          </button>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {allAccounts.map((acc, idx) => {
              const copyKey = `acc-${idx}-${acc.number}`;
              const isCopied = copiedKey === copyKey;

              return (
                <article
                  key={copyKey}
                  className="relative overflow-hidden rounded-2xl p-5 border border-[#6B1222]/16 shadow-[0_20px_40px_-16px_rgba(67,10,20,0.14)] bg-gradient-to-br from-[#FBF7F2] via-[#F8EFE6] to-[#F1E0CE] flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_24px_48px_-14px_rgba(67,10,20,0.22)] transition-[transform,box-shadow] duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C59B6D]" />
                      <span className="font-sans text-sm font-bold uppercase tracking-[0.08em] text-[#C59B6D]">
                        {acc.brand}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#C59B6D]">
                      {acc.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <ChipMetallic />
                    <svg className="w-6 h-6 text-[#C59B6D]/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8.5 16.5a5 5 0 0 1 0-7M12 19a8.5 8.5 0 0 0 0-14M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="mb-4">
                    <p className="font-sans text-xl sm:text-2xl font-bold tabular-nums tracking-[0.06em] text-[#6B1222]">
                      {acc.number}
                    </p>
                    <p className="font-sans text-sm font-medium text-[#3B1A20] mt-1">
                      a.n. <span className="font-semibold text-[#6B1222]">{acc.holder}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(acc.number, copyKey, `Nomor ${acc.brand}`)}
                    className={`typo-button w-full inline-flex items-center justify-center gap-2 py-2.5 ps-3.5 pe-4 rounded-full border uppercase transition-colors duration-200 active:scale-[0.96] cursor-pointer min-h-11 ${
                      isCopied
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                        : "bg-[#FBF7F2] border-[#C59B6D]/50 text-[#6B1222] hover:bg-[#6B1222] hover:text-[#FBF7F2] hover:border-[#6B1222]"
                    }`}
                  >
                    <span className="relative w-4 h-4 grid place-items-center">
                      <Check
                        className={`w-4 h-4 text-white stroke-[2] absolute transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                          isCopied ? "scale-100 opacity-100 blur-none" : "scale-50 opacity-0 blur-[2px] pointer-events-none"
                        }`}
                      />
                      <Copy
                        className={`w-4 h-4 stroke-[1.8] absolute transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                          isCopied ? "scale-50 opacity-0 blur-[2px] pointer-events-none" : "scale-100 opacity-100 blur-none"
                        }`}
                      />
                    </span>
                    <span>{isCopied ? "Berhasil Disalin" : "Salin Nomor Rekening"}</span>
                  </button>
                </article>
              );
            })}
          </div>
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <article className="rounded-2xl p-6 border border-[#6B1222]/16 shadow-[0_20px_40px_-16px_rgba(67,10,20,0.14)] bg-gradient-to-br from-[#FBF7F2] via-[#F8EFE6] to-[#F1E0CE]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6B1222]" />
                <span className="typo-card-title text-base sm:text-lg text-[#6B1222]">
                  Kirim Kado Fisik
                </span>
              </div>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#C59B6D]">
                Alamat Penerima
              </span>
            </div>

            <p className="typo-body text-xs sm:text-sm text-[#3B1A20] leading-relaxed mb-2 font-normal">
              {giftAddress.address}
            </p>

            <p className="font-sans text-sm text-[#3B1A20] mb-4">
              Penerima: <span className="font-semibold text-[#6B1222]">{giftAddress.receiver}</span> &middot;{" "}
              <span className="tabular-nums font-medium">{giftAddress.phone}</span>
            </p>

            <button
              type="button"
              onClick={() => handleCopy(giftAddress.address, "addr-copy", "Alamat")}
              className={`typo-button w-full inline-flex items-center justify-center gap-2 py-2.5 ps-3.5 pe-4 rounded-full border uppercase transition-colors duration-200 active:scale-[0.96] cursor-pointer min-h-11 ${
                copiedKey === "addr-copy"
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                  : "bg-[#FBF7F2] border-[#C59B6D]/50 text-[#6B1222] hover:bg-[#6B1222] hover:text-[#FBF7F2] hover:border-[#6B1222]"
              }`}
            >
              <span className="relative w-4 h-4 grid place-items-center">
                <Check
                  className={`w-4 h-4 text-white stroke-[2] absolute transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                    copiedKey === "addr-copy"
                      ? "scale-100 opacity-100 blur-none"
                      : "scale-50 opacity-0 blur-[2px] pointer-events-none"
                  }`}
                />
                <Copy
                  className={`w-4 h-4 stroke-[1.8] absolute transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                    copiedKey === "addr-copy"
                      ? "scale-50 opacity-0 blur-[2px] pointer-events-none"
                      : "scale-100 opacity-100 blur-none"
                  }`}
                />
              </span>
              <span>{copiedKey === "addr-copy" ? "Alamat Berhasil Disalin" : "Salin Alamat Kirim Kado"}</span>
            </button>
          </article>
        </ScrollLinkedItem>
      </div>

      <Dialog open={showQrisModal} onOpenChange={setShowQrisModal}>
        <DialogContent className="w-[min(100%-2rem,400px)] bg-gradient-to-b from-[#FBF7F2] via-[#FAF3EA] to-[#F1E0CE] rounded-3xl border border-[#C59B6D]/60 shadow-[0_24px_50px_-12px_rgba(67,10,20,0.22)] p-6 text-center overflow-hidden">
          <DialogHeader className="items-center text-center space-y-1.5">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#6B1222] inline-block px-4 py-1 rounded-full bg-[#6B1222]/10 mb-1">
              QRIS Statis
            </span>
            <DialogTitle className="typo-card-title text-xl sm:text-2xl text-[#6B1222] text-center">
              Pindai QRIS
            </DialogTitle>
            <DialogDescription className="typo-body text-xs sm:text-sm text-[#6E4A50] text-center max-w-[280px] mx-auto leading-relaxed">
              Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, dan seluruh m-Banking.
            </DialogDescription>
          </DialogHeader>

          <div className="w-56 h-56 mx-auto bg-white p-2.5 rounded-2xl border border-[#C59B6D]/40 shadow-inner grid place-items-center relative my-2">
            {safeQrisImgSrc && !qrisImgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={safeQrisImgSrc}
                alt="Kode QRIS Fauzan Ma'ruf & Sinta Maria Utami"
                className="w-full h-full object-contain rounded-xl outline outline-1 -outline-offset-1 outline-black/10"
                onError={() => setQrisImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                <AestheticGoldQRCode />
              </div>
            )}
          </div>

          <p className="font-sans text-sm font-semibold text-[#6B1222] mt-1">
            a.n. Fauzan Ma&apos;ruf / Sinta Maria Utami
          </p>

          <a
            href={safeQrisDownloadHref || "/images/ornament-qris-gold.svg"}
            download="qris-fauzan-sinta.png"
            target="_blank"
            rel="noopener noreferrer"
            className="typo-button mt-4 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6B1222] hover:bg-[#520D1A] text-[#FBF7F2] uppercase shadow-xs transition-colors duration-150 active:scale-[0.96] min-h-11 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2]" />
            <span>Simpan Gambar QR</span>
          </a>
        </DialogContent>
      </Dialog>
    </section>
  );
}
