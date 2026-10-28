"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Save,
  Users,
  Calendar,
  MapPin,
  Music2,
  CreditCard,
  Gift,
  QrCode,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import type { WeddingSettingsData } from "@/lib/db/store";

interface WeddingSettingsModuleProps {
  initialSettings: WeddingSettingsData | any;
  onSettingsUpdate?: (newSettings: WeddingSettingsData) => void;
}

interface BankItem {
  brand: string;
  type: string;
  number: string;
  holder: string;
}

interface EwalletItem {
  brand: string;
  type: string;
  number: string;
  holder: string;
}

interface GiftAddressData {
  receiver: string;
  phone: string;
  address: string;
}

export function WeddingSettingsModule({
  initialSettings,
  onSettingsUpdate,
}: WeddingSettingsModuleProps) {
  const [formData, setFormData] = useState<WeddingSettingsData | any>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Parse JSON fields safely with fallback
  const bankAccounts: BankItem[] = Array.isArray(formData.bankAccounts)
    ? (formData.bankAccounts as unknown as BankItem[])
    : [];

  const ewallets: EwalletItem[] = Array.isArray(formData.ewallets)
    ? (formData.ewallets as unknown as EwalletItem[])
    : [];

  const giftAddress: GiftAddressData =
    formData.giftAddress && typeof formData.giftAddress === "object"
      ? (formData.giftAddress as unknown as GiftAddressData)
      : { receiver: "", phone: "", address: "" };

  const handleFieldChange = (
    field: string,
    value: string | number | null
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Bank accounts management
  const handleBankChange = (
    index: number,
    field: keyof BankItem,
    val: string
  ) => {
    const updated = [...bankAccounts];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev: any) => ({
      ...prev,
      bankAccounts: updated,
    }));
  };

  const addBankAccount = () => {
    const updated = [
      ...bankAccounts,
      { brand: "Bank Baru", type: "Transfer Bank", number: "", holder: "" },
    ];
    setFormData((prev: any) => ({
      ...prev,
      bankAccounts: updated,
    }));
  };

  const removeBankAccount = (index: number) => {
    const updated = bankAccounts.filter((_, i) => i !== index);
    setFormData((prev: any) => ({
      ...prev,
      bankAccounts: updated,
    }));
  };

  // E-wallets management
  const handleEwalletChange = (
    index: number,
    field: keyof EwalletItem,
    val: string
  ) => {
    const updated = [...ewallets];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev: any) => ({
      ...prev,
      ewallets: updated,
    }));
  };

  const addEwallet = () => {
    const updated = [
      ...ewallets,
      { brand: "E-Wallet Baru", type: "E-Wallet", number: "", holder: "" },
    ];
    setFormData((prev: any) => ({
      ...prev,
      ewallets: updated,
    }));
  };

  const removeEwallet = (index: number) => {
    const updated = ewallets.filter((_, i) => i !== index);
    setFormData((prev: any) => ({
      ...prev,
      ewallets: updated,
    }));
  };

  // Gift address management
  const handleGiftAddressChange = (
    field: keyof GiftAddressData,
    val: string
  ) => {
    const updated = { ...giftAddress, [field]: val };
    setFormData((prev: any) => ({
      ...prev,
      giftAddress: updated,
    }));
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan pengaturan");
      }
      toast.success("Pengaturan pernikahan berhasil disimpan dan disinkronkan ke halaman publik!");
      if (onSettingsUpdate && data.data) {
        onSettingsUpdate(data.data);
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan pengaturan"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-card-dark/80 p-5 rounded-2xl border border-gold-500/20 shadow-sm backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-cream">
            Pengaturan Acara & Pernikahan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola profil kedua mempelai, jadwal acara, lokasi maps, musik, rekening digital, dan kado fisik.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-[0.96] text-white font-medium text-sm transition-transform shadow-md disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>

      {/* 1. PROFIL MEMPELAI */}
      <section className="bg-white/80 dark:bg-card-dark/80 rounded-2xl p-6 border border-gold-500/20 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-cream font-serif">
              Profil Kedua Mempelai
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Data diri, tanggal/tempat lahir, deskripsi bio, dan URL foto profil mempelai.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mempelai Wanita */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Pengantin Wanita
            </span>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.brideName || ""}
                onChange={(e) => handleFieldChange("brideName", e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kelahiran / Info Singkat
              </label>
              <input
                type="text"
                value={formData.brideBirth || ""}
                onChange={(e) => handleFieldChange("brideBirth", e.target.value)}
                placeholder="Pekanbaru, 10 September 2005"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Bio
              </label>
              <textarea
                rows={3}
                value={formData.brideBio || ""}
                onChange={(e) => handleFieldChange("brideBio", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL Foto Profil Wanita
              </label>
              <input
                type="url"
                value={formData.bridePhotoUrl || ""}
                onChange={(e) =>
                  handleFieldChange("bridePhotoUrl", e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>

          {/* Mempelai Pria */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Pengantin Pria
            </span>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.groomName || ""}
                onChange={(e) => handleFieldChange("groomName", e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kelahiran / Info Singkat
              </label>
              <input
                type="text"
                value={formData.groomBirth || ""}
                onChange={(e) => handleFieldChange("groomBirth", e.target.value)}
                placeholder="3 Mei 1997"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Bio
              </label>
              <textarea
                rows={3}
                value={formData.groomBio || ""}
                onChange={(e) => handleFieldChange("groomBio", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL Foto Profil Pria
              </label>
              <input
                type="url"
                value={formData.groomPhotoUrl || ""}
                onChange={(e) =>
                  handleFieldChange("groomPhotoUrl", e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WAKTU & JADWAL ACARA */}
      <section className="bg-white/80 dark:bg-card-dark/80 rounded-2xl p-6 border border-gold-500/20 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-cream font-serif">
              Waktu & Jadwal Acara
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tanggal patokan hitung mundur (ISO 8601) dan teks jam pelaksanaan akad & resepsi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Pernikahan ISO (Hitung Mundur)
            </label>
            <input
              type="text"
              value={formData.weddingDateIso || ""}
              onChange={(e) => handleFieldChange("weddingDateIso", e.target.value)}
              placeholder="2027-01-10T08:00:00+07:00"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm font-mono text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Waktu Akad Nikah
            </label>
            <input
              type="text"
              value={formData.akadTime || ""}
              onChange={(e) => handleFieldChange("akadTime", e.target.value)}
              placeholder="Pukul 08.00 – 10.00 WIB"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Waktu Resepsi Pernikahan
            </label>
            <input
              type="text"
              value={formData.resepsiTime || ""}
              onChange={(e) => handleFieldChange("resepsiTime", e.target.value)}
              placeholder="Pukul 11.00 – 14.00 WIB"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
        </div>
      </section>

      {/* 3. LOKASI & GOOGLE MAPS */}
      <section className="bg-white/80 dark:bg-card-dark/80 rounded-2xl p-6 border border-gold-500/20 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-cream font-serif">
              Lokasi & Navigasi Peta
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nama venue, alamat lengkap, Plus Code, URL navigasi Google Maps, dan URL iframe embed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama Venue / Tempat
            </label>
            <input
              type="text"
              value={formData.venueName || ""}
              onChange={(e) => handleFieldChange("venueName", e.target.value)}
              placeholder="Kelurahan Air Putih"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Plus Code (Opsional)
            </label>
            <input
              type="text"
              value={formData.venuePlusCode || ""}
              onChange={(e) =>
                handleFieldChange("venuePlusCode", e.target.value)
              }
              placeholder="Plus Code: F9M2+C8 Simpang Baru"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Alamat Lengkap Venue
            </label>
            <textarea
              rows={2}
              value={formData.venueAddress || ""}
              onChange={(e) => handleFieldChange("venueAddress", e.target.value)}
              placeholder="Tuah Madani, Kota Pekanbaru, Riau"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tautan Google Maps Langsung (Tombol Buka Peta)
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl || ""}
              onChange={(e) =>
                handleFieldChange("googleMapsUrl", e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              URL Iframe Embed Peta
            </label>
            <input
              type="url"
              value={formData.googleMapsEmbed || ""}
              onChange={(e) =>
                handleFieldChange("googleMapsEmbed", e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
        </div>
      </section>

      {/* 4. MUSIK LATAR YOUTUBE */}
      <section className="bg-white/80 dark:bg-card-dark/80 rounded-2xl p-6 border border-gold-500/20 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <Music2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-cream font-serif">
              Musik Latar Belakang (YouTube)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audio latar undangan diputar via YouTube IFrame API tanpa menampilkan video.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              YouTube Video ID (11 Karakter)
            </label>
            <input
              type="text"
              value={formData.youtubeVideoId || ""}
              onChange={(e) =>
                handleFieldChange("youtubeVideoId", e.target.value)
              }
              placeholder="In8kDy_WU4s"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm font-mono text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Contoh dari URL: https://www.youtube.com/watch?v=<strong>In8kDy_WU4s</strong>
            </p>
          </div>
          {formData.youtubeVideoId && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-cream">
                  Video ID Terpasang
                </p>
                <code className="text-xs text-gold-600 dark:text-gold-400">
                  {formData.youtubeVideoId}
                </code>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${formData.youtubeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <span>Cek Video</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 5. REKENING BANK & E-WALLET AMPLOPT DIGITAL */}
      <section className="bg-white/80 dark:bg-card-dark/80 rounded-2xl p-6 border border-gold-500/20 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-cream font-serif">
                Rekening Amplop Digital
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kartu ATM debit beraksen emas di seksi amplop digital.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addBankAccount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-500/10 text-gold-700 dark:text-gold-300 hover:bg-gold-500/20 active:scale-[0.96] transition-transform"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rekening</span>
          </button>
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Rekening Bank
          </h4>
          {bankAccounts.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada rekening bank yang ditambahkan.</p>
          ) : (
            bankAccounts.map((bank, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 items-end"
              >
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={bank.brand}
                    onChange={(e) =>
                      handleBankChange(idx, "brand", e.target.value)
                    }
                    placeholder="Contoh: Bank BCA"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={bank.number}
                    onChange={(e) =>
                      handleBankChange(idx, "number", e.target.value)
                    }
                    placeholder="1234567890"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono tabular-nums text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={bank.holder}
                    onChange={(e) =>
                      handleBankChange(idx, "holder", e.target.value)
                    }
                    placeholder="Nama Pemilik Rekening"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div className="flex justify-end sm:justify-start">
                  <button
                    type="button"
                    onClick={() => removeBankAccount(idx)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* E-Wallets List */}
        <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daftar Dompet Digital / E-Wallet
            </h4>
            <button
              type="button"
              onClick={addEwallet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-500/10 text-gold-700 dark:text-gold-300 hover:bg-gold-500/20 active:scale-[0.96] transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah E-Wallet</span>
            </button>
          </div>
          {ewallets.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada e-wallet yang ditambahkan.</p>
          ) : (
            ewallets.map((ewallet, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 items-end"
              >
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={ewallet.brand}
                    onChange={(e) =>
                      handleEwalletChange(idx, "brand", e.target.value)
                    }
                    placeholder="Contoh: DANA / GoPay"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Akun / HP
                  </label>
                  <input
                    type="text"
                    value={ewallet.number}
                    onChange={(e) =>
                      handleEwalletChange(idx, "number", e.target.value)
                    }
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono tabular-nums text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={ewallet.holder}
                    onChange={(e) =>
                      handleEwalletChange(idx, "holder", e.target.value)
                    }
                    placeholder="Nama Pemilik Akun"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div className="flex justify-end sm:justify-start">
                  <button
                    type="button"
                    onClick={() => removeEwallet(idx)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. MODAL QRIS & ALAMAT KADO FISIK */}
      <section className="bg-white/80 dark:bg-card-dark/80 rounded-2xl p-6 border border-gold-500/20 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-cream font-serif">
              QRIS & Pengiriman Kado Fisik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gambar barcode QRIS untuk modal amplop, serta alamat tujuan bagi tamu yang mengirimkan bingkisan kado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QRIS Image */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-gold-600 dark:text-gold-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Kode QRIS Pembayaran
              </h4>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL Gambar Kode QRIS
              </label>
              <input
                type="url"
                value={formData.qrisImageUrl || ""}
                onChange={(e) =>
                  handleFieldChange("qrisImageUrl", e.target.value)
                }
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40"
              />
            </div>
            {formData.qrisImageUrl && (
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-white/10 bg-white p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.qrisImageUrl}
                    alt="Preview QRIS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Pratinjau Kode QRIS
                </span>
              </div>
            )}
          </div>

          {/* Gift Address */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Alamat Kirim Kado Fisik
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  value={giftAddress.receiver || ""}
                  onChange={(e) =>
                    handleGiftAddressChange("receiver", e.target.value)
                  }
                  placeholder="Sinta Maharani"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={giftAddress.phone || ""}
                  onChange={(e) =>
                    handleGiftAddressChange("phone", e.target.value)
                  }
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm font-mono text-slate-900 dark:text-cream focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alamat Lengkap Rumah / Paket
              </label>
              <textarea
                rows={2}
                value={giftAddress.address || ""}
                onChange={(e) =>
                  handleGiftAddressChange("address", e.target.value)
                }
                placeholder="Jl. Contoh Alamat No. 10..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-base sm:text-sm text-slate-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-y"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating/Bottom Action Bar */}
      <div className="sticky bottom-6 z-20 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-600 active:scale-[0.96] text-white font-medium text-sm transition-transform shadow-xl disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Menyimpan..." : "Simpan Semua Pengaturan"}</span>
        </button>
      </div>
    </form>
  );
}
