"use client";

import { useState, useEffect } from "react";
import { WayangDivider, ChipMetallic } from "./Ornaments";
import { Copy, Check, QrCode, X, MapPin, Download } from "lucide-react";
import { toast } from "sonner";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

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

function AestheticGoldQRCode() {
  return (
    <svg viewBox="0 0 160 160" className="w-44 h-44 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SVG Kode QRIS Estetik Berbingkai Emas">
      <rect x="2" y="2" width="156" height="156" rx="14" fill="#ffffff" stroke="#c9a24b" strokeWidth="1.5" />
      
      <rect x="14" y="14" width="38" height="38" rx="7" stroke="#b8913b" strokeWidth="3.5" fill="#fcf9f2" />
      <rect x="23" y="23" width="20" height="20" rx="3.5" fill="#5d3a41" />
      
      <rect x="108" y="14" width="38" height="38" rx="7" stroke="#b8913b" strokeWidth="3.5" fill="#fcf9f2" />
      <rect x="117" y="23" width="20" height="20" rx="3.5" fill="#5d3a41" />
      
      <rect x="14" y="108" width="38" height="38" rx="7" stroke="#b8913b" strokeWidth="3.5" fill="#fcf9f2" />
      <rect x="23" y="117" width="20" height="20" rx="3.5" fill="#5d3a41" />
      
      <rect x="60" y="16" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="74" y="16" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="88" y="16" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="60" y="30" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="74" y="30" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="88" y="30" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="60" y="44" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="88" y="44" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="60" y="58" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="74" y="58" width="8" height="8" rx="2" fill="#5d3a41" />
      
      <rect x="16" y="60" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="30" y="60" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="44" y="60" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="16" y="74" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="30" y="74" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="44" y="74" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="16" y="88" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="30" y="88" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="44" y="88" width="8" height="8" rx="2" fill="#5d3a41" />
      
      <rect x="108" y="60" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="122" y="60" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="136" y="60" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="108" y="74" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="122" y="74" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="136" y="74" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="108" y="88" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="122" y="88" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="136" y="88" width="8" height="8" rx="2" fill="#5d3a41" />
      
      <rect x="60" y="108" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="74" y="108" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="88" y="108" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="60" y="122" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="74" y="122" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="88" y="122" width="8" height="8" rx="2" fill="#c9a24b" />
      <rect x="60" y="136" width="8" height="8" rx="2" fill="#5d3a41" />
      <rect x="88" y="136" width="8" height="8" rx="2" fill="#5d3a41" />
      
      <circle cx="80" cy="80" r="12" fill="#ffffff" stroke="#c9a24b" strokeWidth="1.5" />
      <text x="80" y="84" textAnchor="middle" fill="#5d3a41" fontFamily="'Cormorant Garamond', serif" fontSize="11" fontWeight="bold">FS</text>
    </svg>
  );
}

export function DigitalEnvelope({
  bankAccounts,
  ewallets,
  giftAddress,
  qrisImageUrl,
}: DigitalEnvelopeProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrisImgError, setQrisImgError] = useState(false);

  const openQrisModal = () => {
    setShowQrisModal(true);
    requestAnimationFrame(() => {
      setIsModalVisible(true);
    });
  };

  const closeQrisModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setShowQrisModal(false);
    }, 300);
  };

  useEffect(() => {
    if (!showQrisModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQrisModal();
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
    <section id="amplop" className="py-20 relative bg-transparent" aria-label="Amplop Digital dan Hadiah Pernikahan">
      <div className="w-[min(100%-2.75rem,720px)] mx-auto">
        <header className="text-center mb-9">
          <ScrollLinkedItem offsetY={36}>
            <p className="typo-eyebrow text-[#a9823a] mb-2">
              Wedding Gift
            </p>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title">
              Amplop Digital
            </h2>
            <WayangDivider />
            <p className="typo-body text-center max-w-[420px] mx-auto mt-3 text-[#4b3a3e]">
              Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila Anda ingin memberikan tanda kasih secara digital, dapat melalui:
            </p>
          </ScrollLinkedItem>
        </header>

        <ScrollLinkedItem direction="center-scale" className="flex justify-center mb-8">
          <button
            type="button"
            onClick={openQrisModal}
            className="typo-button inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-white border border-gold-500/60 text-[#a9823a] uppercase shadow-sm transition-transform duration-150 active:scale-[0.96] hover:bg-rose-100 cursor-pointer min-h-11"
          >
            <QrCode className="w-4 h-4 stroke-[2]" />
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
                  className="relative overflow-hidden rounded-2xl p-5 border border-gold-500/40 shadow-[0_20px_40px_-16px_rgba(93,58,65,0.2)] bg-gradient-to-br from-[#fffcf9] via-[#fcf5f1] to-[#f7e9e5] flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_24px_48px_-14px_rgba(93,58,65,0.26)] transition-[transform,box-shadow] duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gold-500" />
                      <span className="font-sans text-sm font-bold uppercase tracking-[0.08em] text-[#a9823a]">
                        {acc.brand}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#a9823a]">
                      {acc.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <ChipMetallic />
                    <svg className="w-6 h-6 text-gold-600/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8.5 16.5a5 5 0 0 1 0-7M12 19a8.5 8.5 0 0 0 0-14M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="mb-4">
                    <p className="font-sans text-xl sm:text-2xl font-bold tabular-nums tracking-[0.06em] text-[#5d3a41]">
                      {acc.number}
                    </p>
                    <p className="font-sans text-sm font-medium text-[#4b3a3e] mt-1">
                      a.n. <span className="font-semibold text-rose-900">{acc.holder}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(acc.number, copyKey, `Nomor ${acc.brand}`)}
                    className={`typo-button w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border uppercase transition-colors duration-200 active:scale-[0.96] cursor-pointer min-h-11 ${
                      isCopied
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-surface-white border-gold-600/50 text-[#a9823a] hover:bg-gold-500 hover:text-white hover:border-gold-500"
                    }`}
                  >
                    <span className="relative w-4 h-4 grid place-items-center">
                      <Check
                        className={`w-4 h-4 text-white stroke-[2.5] absolute transition-[transform,opacity,filter] duration-200 ${
                          isCopied ? "scale-100 opacity-100 blur-none" : "scale-50 opacity-0 blur-[2px] pointer-events-none"
                        }`}
                      />
                      <Copy
                        className={`w-4 h-4 stroke-[1.8] absolute transition-[transform,opacity,filter] duration-200 ${
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
          <article className="rounded-2xl p-6 border border-gold-500/40 shadow-[0_20px_40px_-16px_rgba(93,58,65,0.2)] bg-gradient-to-br from-[#fffcf9] via-[#fcf5f1] to-[#f7e9e5]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-700" />
                <span className="typo-card-title text-base sm:text-lg">
                  Kirim Kado Fisik
                </span>
              </div>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#a9823a]">
                Alamat Penerima
              </span>
            </div>

            <p className="typo-body text-xs sm:text-sm text-[#4b3a3e] leading-relaxed mb-2 font-normal">
              {giftAddress.address}
            </p>

            <p className="font-sans text-sm text-[#4b3a3e] mb-4">
              Penerima: <span className="font-semibold text-rose-900">{giftAddress.receiver}</span> &middot;{" "}
              <span className="tabular-nums font-medium">{giftAddress.phone}</span>
            </p>

            <button
              type="button"
              onClick={() => handleCopy(giftAddress.address, "addr-copy", "Alamat")}
              className={`typo-button w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border uppercase transition-colors duration-200 active:scale-[0.96] cursor-pointer min-h-11 ${
                copiedKey === "addr-copy"
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                  : "bg-surface-white border-gold-600/50 text-[#a9823a] hover:bg-gold-500 hover:text-white hover:border-gold-500"
              }`}
            >
              <span className="relative w-4 h-4 grid place-items-center">
                <Check
                  className={`w-4 h-4 text-white stroke-[2.5] absolute transition-[transform,opacity,filter] duration-200 ${
                    copiedKey === "addr-copy"
                      ? "scale-100 opacity-100 blur-none"
                      : "scale-50 opacity-0 blur-[2px] pointer-events-none"
                  }`}
                />
                <Copy
                  className={`w-4 h-4 stroke-[1.8] absolute transition-[transform,opacity,filter] duration-200 ${
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

      {showQrisModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Modal Kode QRIS Pernikahan"
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
            isModalVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeQrisModal}
        >
          <div
            className={`w-full max-w-sm bg-gradient-to-b from-[#fffcf9] to-[#fbf1ed] rounded-3xl border border-gold-500/60 shadow-2xl p-6 text-center relative overflow-hidden transition-[transform,opacity] duration-300 ${
              isModalVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeQrisModal}
              aria-label="Tutup modal QRIS"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-rose-100 text-rose-900 grid place-items-center hover:bg-rose-200 active:scale-[0.96] transition-transform duration-150 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>

            <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#9c5f66] inline-block px-4 py-1 rounded-full bg-rose-100 mb-3">
              QRIS Statis
            </span>

            <h3 className="typo-card-title text-xl sm:text-2xl mb-1">
              Pindai QRIS
            </h3>
            <p className="typo-body text-xs sm:text-sm mb-4 mx-auto text-center text-[#8d757c]">
              Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, dan seluruh m-Banking.
            </p>

            <div className="w-56 h-56 mx-auto bg-white p-2.5 rounded-2xl border border-gold-500/40 shadow-inner grid place-items-center relative">
              {qrisImageUrl && !qrisImgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrisImageUrl}
                  alt="Kode QRIS Fauzan Ma'ruf & Sinta Maria Utami"
                  className="w-full h-full object-contain rounded-lg"
                  onError={() => setQrisImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                  <AestheticGoldQRCode />
                </div>
              )}
            </div>

            <p className="font-sans text-sm font-semibold text-[#5d3a41] mt-3.5">
              a.n. Fauzan Ma&apos;ruf / Sinta Maria Utami
            </p>

            <a
              href={qrisImageUrl || "#"}
              download="qris-fauzan-sinta.png"
              target="_blank"
              rel="noopener noreferrer"
              className="typo-button mt-4 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#c9a24b] hover:bg-[#b8913b] text-white uppercase shadow-sm transition-colors duration-150 active:scale-[0.96] min-h-11 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2]" />
              <span>Simpan Gambar QR</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
