"use client";

import { useState, useEffect, useRef } from "react";
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
  Play,
  Pause,
  Square,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Upload,
  Image as ImageIcon,
  Palette,
  Check,
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import type { WeddingSettingsData } from "@/lib/db/store";
import {
  WEDDING_MUSIC_PRESETS,
  SVG_CHARACTER_PRESETS,
  type MusicPreset,
  type CoupleVisualMode,
  type SvgCharacterPreset,
} from "@/lib/db/seed-data";
import { CoupleCharacterSvg } from "@/components/invitation/CoupleCharacterSvg";

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

function extractYouTubeVideoId(input?: string): string {
  if (!input) return "In8kDy_WU4s";
  const trimmed = input.trim();
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : "In8kDy_WU4s";
}

export function WeddingSettingsModule({
  initialSettings,
  onSettingsUpdate,
}: WeddingSettingsModuleProps) {
  const [formData, setFormData] = useState<WeddingSettingsData | any>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isResolvingMaps, setIsResolvingMaps] = useState(false);

  const isCurrentYouTube =
    formData.musicSourceType === "youtube" ||
    (typeof formData.musicUrl === "string" && formData.musicUrl.includes("youtube.com"));
  const currentYoutubeId =
    formData.youtubeVideoId ||
    extractYouTubeVideoId(formData.musicUrl) ||
    "In8kDy_WU4s";
  const effectiveAudioUrl = !isCurrentYouTube
    ? formData.musicUrl || "/audio/raim-laode-komang.mp3"
    : "/audio/raim-laode-komang.mp3";

  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const audioTestRef = useRef<HTMLAudioElement | null>(null);

  const [countdownPreview, setCountdownPreview] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isDone: false,
  });

  useEffect(() => {
    const targetIso = formData.weddingDateIso || "2027-01-03T08:00:00+07:00";
    const targetTime = new Date(targetIso).getTime();

    const updatePreview = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setCountdownPreview({ days: 0, hours: 0, minutes: 0, seconds: 0, isDone: true });
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setCountdownPreview({ days, hours, minutes, seconds, isDone: false });
    };

    updatePreview();
    const interval = setInterval(updatePreview, 1000);
    return () => clearInterval(interval);
  }, [formData.weddingDateIso]);

  const getDatetimeLocalValue = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "2027-01-03T08:00";
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
    } catch {
      return "2027-01-03T08:00";
    }
  };

  const handleDatetimeChange = (localVal: string) => {
    if (!localVal) return;
    try {
      const localDate = new Date(localVal);
      const isoString = localDate.toISOString();
      const formattedLabel = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(localDate);

      setFormData((prev: any) => ({
        ...prev,
        weddingDateIso: isoString,
        eventDateLabel: formattedLabel,
      }));
    } catch {
    }
  };

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

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectMusicPreset = (presetId: string) => {
    const selected = WEDDING_MUSIC_PRESETS.find((p) => p.id === presetId);
    if (!selected) return;

    if (audioTestRef.current) {
      audioTestRef.current.pause();
      setIsPlayingTest(false);
    }

    setFormData((prev: any) => ({
      ...prev,
      musicTitle: selected.title,
      musicSourceType: selected.sourceType,
      musicUrl: selected.url,
      youtubeVideoId: selected.youtubeId || prev.youtubeVideoId || "In8kDy_WU4s",
    }));

    toast.success(`Lagu preset "${selected.title}" dipilih! ✓`);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      toast.error("File harus berupa berkas audio (.mp3, .wav, atau .m4a)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file audio maksimal 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setFormData((prev: any) => ({
        ...prev,
        musicSourceType: "audio_url",
        musicUrl: result,
        musicTitle: cleanName,
      }));
      if (audioTestRef.current) {
        audioTestRef.current.pause();
        setIsPlayingTest(false);
      }
      toast.success(`File audio "${file.name}" berhasil dimuat! Simpan perubahan untuk menerapkan.`);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTestAudio = () => {
    if (isCurrentYouTube) {
      const iframe = document.getElementById("dashboard-yt-preview") as HTMLIFrameElement | null;
      if (iframe?.contentWindow) {
        if (isPlayingTest) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
          setIsPlayingTest(false);
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
          setIsPlayingTest(true);
          toast.success("Memutar pratinjau YouTube...");
        }
      } else {
        toast.info("Gunakan tombol putar di dalam jendela pemutar YouTube di bawah.");
      }
      return;
    }

    const audio = audioTestRef.current;
    if (!audio) return;

    if (isPlayingTest) {
      audio.pause();
      setIsPlayingTest(false);
    } else {
      audio.volume = 0.8;
      audio
        .play()
        .then(() => setIsPlayingTest(true))
        .catch((err) => {
          console.error("Test audio play failed:", err);
          toast.error("Gagal memutar audio preview. Periksa berkas atau gunakan preset audio lokal.");
        });
    }
  };

  const handleResolveMaps = async () => {
    const targetUrl = formData.googleMapsUrl;
    if (!targetUrl || !targetUrl.trim()) {
      toast.error("Masukkan tautan Google Maps terlebih dahulu");
      return;
    }

    setIsResolvingMaps(true);
    try {
      const res = await fetch(`/api/admin/resolve-maps?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengekstrak koordinat peta");
      }

      setFormData((prev: any) => ({
        ...prev,
        mapsLatitude: data.latitude || prev.mapsLatitude || "-7.310076",
        mapsLongitude: data.longitude || prev.mapsLongitude || "109.296186",
        googleMapsEmbed: data.embedUrl || prev.googleMapsEmbed,
      }));

      if (data.latitude && data.longitude) {
        toast.success(`Koordinat lokasi berhasil diekstrak: ${data.latitude}, ${data.longitude}! ✓`);
      } else {
        toast.success("Tautan Google Maps berhasil diverifikasi! ✓");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengekstrak peta";
      toast.error(msg);
    } finally {
      setIsResolvingMaps(false);
    }
  };

  const handleBankChange = (index: number, field: keyof BankItem, val: string) => {
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
      { brand: "Bank BCA", type: "Transfer Bank", number: "", holder: formData.brideName || "Sinta Maria Utami" },
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

  const handleEwalletChange = (index: number, field: keyof EwalletItem, val: string) => {
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
      { brand: "DANA", type: "E-Wallet", number: "", holder: formData.brideName || "Sinta Maria Utami" },
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

  const handleGiftAddressChange = (field: keyof GiftAddressData, val: string) => {
    const updated = { ...giftAddress, [field]: val };
    setFormData((prev: any) => ({
      ...prev,
      giftAddress: updated,
    }));
  };

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
      toast.success("Pengaturan Countdown, Musik, dan Lokasi berhasil disimpan & disinkronkan ke halaman publik! ✓");
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
    <form onSubmit={handleSave} id="wedding-settings-form" className="space-y-8 pb-8">
      <audio
        ref={audioTestRef}
        src={effectiveAudioUrl}
        preload="none"
        onEnded={() => setIsPlayingTest(false)}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-white p-5 rounded-2xl border border-gold-500/25 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-rose-900">
            Pengaturan Acara, Countdown &amp; Musik
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Kelola target hitung mundur, pemutar musik romantis, lokasi maps, profil kedua mempelai, dan rekening digital.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-700 to-rose-900 text-white font-semibold text-xs tracking-wider uppercase shadow-md active:scale-[0.96] transition-transform duration-150 ease-out hover:brightness-105 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Acara &amp; Musik</span>
            </>
          )}
        </button>
      </div>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Waktu Acara &amp; Target Hitung Mundur (Countdown)
            </h3>
            <p className="text-xs text-muted">
              Atur waktu patokan pernikahan. Countdown di halaman publik otomatis berjalan menuju waktu ini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                  Tanggal &amp; Waktu Countdown:
                </label>
                <input
                  type="datetime-local"
                  value={getDatetimeLocalValue(formData.weddingDateIso)}
                  onChange={(e) => handleDatetimeChange(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-mono text-ink focus:outline-none focus:border-rose-500"
                />
                <p className="text-[11px] text-muted mt-1">
                  Default: <strong>03 Januari 2027 pukul 08:00 WIB</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                  Label Tanggal Tampilan:
                </label>
                <input
                  type="text"
                  value={formData.eventDateLabel || ""}
                  onChange={(e) => handleFieldChange("eventDateLabel", e.target.value)}
                  placeholder="Contoh: Minggu · 03 · Januari · 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
                />
                <p className="text-[11px] text-muted mt-1">
                  Ditampilkan pada cover gate dan kartu waktu acara
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                  Waktu Akad Nikah:
                </label>
                <input
                  type="text"
                  value={formData.akadTime || ""}
                  onChange={(e) => handleFieldChange("akadTime", e.target.value)}
                  placeholder="Pukul 08.00 – 10.00 WIB"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                  Waktu Resepsi Pernikahan:
                </label>
                <input
                  type="text"
                  value={formData.resepsiTime || ""}
                  onChange={(e) => handleFieldChange("resepsiTime", e.target.value)}
                  placeholder="Pukul 11.00 – 14.00 WIB"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-cream/70 border border-gold-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pratinjau Countdown Waktu Nyata</span>
                </span>
                <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>

              {!countdownPreview.isDone ? (
                <div className="grid grid-cols-4 gap-2 text-center my-3">
                  {[
                    { label: "Hari", value: countdownPreview.days },
                    { label: "Jam", value: countdownPreview.hours },
                    { label: "Menit", value: countdownPreview.minutes },
                    { label: "Detik", value: countdownPreview.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-2.5 rounded-xl bg-surface-white border border-gold-500/30 shadow-2xs"
                    >
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#5d3a41] tabular-nums block leading-none">
                        <NumberFlow
                          value={item.value}
                          format={{ minimumIntegerDigits: 2 }}
                          style={{ color: "#5d3a41" }}
                        />
                      </span>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9c5f66] mt-1 block">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-rose-800 font-serif italic">
                  Acara pernikahan telah berlangsung 🤍
                </div>
              )}
            </div>

            <p className="text-[11px] text-muted mt-2 border-t border-gold-500/20 pt-2 leading-relaxed">
              *Tampilan di atas merefleksikan persis apa yang akan dilihat tamu undangan pada seksi pembuka <strong>02-hitung-mundur</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gold-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900 font-serif">
                Musik Latar Belakang &amp; Pemutar Romantis
              </h3>
              <p className="text-xs text-muted">
                Pilih lagu pernikahan romantis siap pakai atau masukkan tautan MP3/YouTube sendiri.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.musicEnabled !== false}
              onChange={(e) => handleFieldChange("musicEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
            <span className="text-xs font-semibold text-rose-950">
              {formData.musicEnabled !== false ? "Musik Aktif ✓" : "Musik Nonaktif"}
            </span>
          </label>
        </div>

        {formData.musicEnabled !== false && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-2">
                Pilihan Sumber Audio:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "preset",
                    label: "1. Preset Lagu Romantis (Rekomendasi)",
                    desc: "Bebas blokir autoplay & instan",
                  },
                  {
                    id: "audio_url",
                    label: "2. Tautan File MP3 Sendiri",
                    desc: "Stream langsung URL berkas audio",
                  },
                  {
                    id: "youtube",
                    label: "3. Tautan / ID Video YouTube",
                    desc: "Putar via YouTube IFrame API",
                  },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleFieldChange("musicSourceType", s.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      (formData.musicSourceType || "preset") === s.id
                        ? "bg-rose-100/90 border-rose-500 shadow-2xs"
                        : "bg-surface-white border-gold-500/30 hover:bg-cream/50"
                    }`}
                  >
                    <span className="block font-semibold text-xs text-rose-900">
                      {s.label}
                    </span>
                    <span className="block text-[11px] text-muted mt-0.5">
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {(formData.musicSourceType === "preset" || !formData.musicSourceType) && (
              <div className="p-4 rounded-2xl bg-cream/40 border border-gold-500/25 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Pilih Lagu Romantis Siap Pakai:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WEDDING_MUSIC_PRESETS.map((preset) => {
                    const isSelected = formData.musicTitle === preset.title;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectMusicPreset(preset.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-emerald-50/90 border-emerald-500 shadow-2xs"
                            : "bg-surface-white border-gold-500/25 hover:bg-rose-50/50"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-xs text-rose-950 leading-tight">
                            {preset.title}
                          </p>
                          <p className="text-[11px] text-muted mt-0.5">
                            {preset.artist} &bull; <span className="uppercase text-[9px] font-mono">{preset.sourceType}</span>
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                  Judul Lagu &amp; Artis:
                </label>
                <input
                  type="text"
                  value={formData.musicTitle || ""}
                  onChange={(e) => handleFieldChange("musicTitle", e.target.value)}
                  placeholder="Contoh: Shane Filan - Beautiful In White"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              {formData.musicSourceType === "youtube" ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                    YouTube Video ID (11 Karakter):
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeVideoId || ""}
                    onChange={(e) => handleFieldChange("youtubeVideoId", e.target.value)}
                    placeholder="In8kDy_WU4s"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-mono text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                    URL File Audio (.mp3 / .wav) atau Unggah Berkas:
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <input
                      type="url"
                      value={formData.musicUrl || ""}
                      onChange={(e) => handleFieldChange("musicUrl", e.target.value)}
                      placeholder="https://.../lagu-pernikahan.mp3"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-mono text-ink focus:outline-none focus:border-rose-500"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 text-rose-900 border border-gold-500/30 font-semibold text-xs cursor-pointer transition-colors shrink-0">
                      <Upload className="w-4 h-4 text-rose-800" />
                      <span>Unggah Audio HP/PC</span>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-cream/70 border border-emerald-400/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0 shadow-2xs">
                    {isPlayingTest ? (
                      <Volume2 className="w-5 h-5 animate-pulse" />
                    ) : (
                      <VolumeX className="w-5 h-5 opacity-80" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-emerald-950">
                      Uji Dengar Musik di Dashboard:
                    </p>
                    <p className="text-[11px] text-muted">
                      {formData.musicTitle || "Belum ada lagu yang dipilih"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleTestAudio}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs min-h-11 ${
                      isPlayingTest
                        ? "bg-rose-700 text-white hover:bg-rose-800"
                        : "bg-emerald-700 text-white hover:bg-emerald-800"
                    }`}
                  >
                    {isPlayingTest ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Hentikan Uji Dengar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Tes Putar Musik</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isCurrentYouTube && currentYoutubeId && (
                <div className="pt-2 border-t border-emerald-400/20 space-y-2">
                  <div className="relative rounded-xl overflow-hidden aspect-video max-w-sm border border-emerald-500/25 bg-black/90">
                    <iframe
                      id="dashboard-yt-preview"
                      src={`https://www.youtube-nocookie.com/embed/${currentYoutubeId}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1`}
                      title="YouTube Music Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
                    <span>* Putar video di atas untuk menguji kecocokan lagu YouTube.</span>
                    <button
                      type="button"
                      onClick={() => handleSelectMusicPreset("preset-1")}
                      className="text-emerald-800 hover:text-emerald-950 font-medium underline cursor-pointer"
                    >
                      Beralih ke Musik Lokal (Anti-Error)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Lokasi Acara &amp; Integrasi Google Maps
            </h3>
            <p className="text-xs text-muted">
              Masukkan tautan Google Maps (shortlink didukung). Sistem dapat otomatis mengekstrak titik koordinat peta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Nama Venue / Tempat Acara:
            </label>
            <input
              type="text"
              value={formData.venueName || ""}
              onChange={(e) => handleFieldChange("venueName", e.target.value)}
              placeholder="Contoh: Gedung Pertemuan & Kediaman Mempelai"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Plus Code (Opsional):
            </label>
            <input
              type="text"
              value={formData.venuePlusCode || ""}
              onChange={(e) => handleFieldChange("venuePlusCode", e.target.value)}
              placeholder="Plus Code: F9M2+C8 Simpang Baru"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Alamat Lengkap Venue:
            </label>
            <textarea
              rows={2}
              value={formData.venueAddress || ""}
              onChange={(e) => handleFieldChange("venueAddress", e.target.value)}
              placeholder="Pekanbaru, Riau"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 resize-y"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600">
              Tautan Google Maps Share URL:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="url"
                value={formData.googleMapsUrl || ""}
                onChange={(e) => handleFieldChange("googleMapsUrl", e.target.value)}
                placeholder="https://maps.app.goo.gl/HFXpTdshy7Vhwoxs8"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink font-mono focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleResolveMaps}
                disabled={isResolvingMaps}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-600 text-white text-xs font-semibold tracking-wider hover:bg-gold-700 active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
              >
                {isResolvingMaps ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengekstrak Koordinat...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Ambil Koordinat Otomatis</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Mendukung link pendek seperti <code>https://maps.app.goo.gl/HFXpTdshy7Vhwoxs8</code>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Latitude (Titik Lintang):
            </label>
            <input
              type="text"
              value={formData.mapsLatitude || ""}
              onChange={(e) => handleFieldChange("mapsLatitude", e.target.value)}
              placeholder="-7.310076"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-mono text-ink focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Longitude (Titik Bujur):
            </label>
            <input
              type="text"
              value={formData.mapsLongitude || ""}
              onChange={(e) => handleFieldChange("mapsLongitude", e.target.value)}
              placeholder="109.296186"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-mono text-ink focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-2">
              Pratinjau Peta Interaktif (Live Preview):
            </span>
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-gold-500/30 shadow-inner bg-cream/40">
              <iframe
                src={
                  formData.googleMapsEmbed ||
                  `https://maps.google.com/maps?q=${formData.mapsLatitude || "-7.310076"},${formData.mapsLongitude || "109.296186"}&z=17&output=embed`
                }
                title="Pratinjau Peta Lokasi"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Mode Visual Mempelai &amp; Karakter Ilustrasi SVG
            </h3>
            <p className="text-xs text-muted">
              Pilih apakah undangan menggunakan foto asli calon mempelai atau karakter ilustrasi vektor SVG arsitektural.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-3">
            Pilihan Mode Visual Utama:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => handleFieldChange("coupleVisualMode", "photo")}
              className={`p-4 rounded-2xl border text-left transition-transform duration-150 active:scale-[0.98] cursor-pointer flex items-start gap-3.5 ${
                (formData.coupleVisualMode || "photo") === "photo"
                  ? "border-rose-700 bg-rose-50/70 shadow-xs ring-1 ring-rose-700"
                  : "border-gold-500/30 bg-surface-white hover:bg-cream/40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  (formData.coupleVisualMode || "photo") === "photo"
                    ? "bg-rose-900 text-gold-300"
                    : "bg-gold-500/15 text-gold-700"
                }`}
              >
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm text-ink font-serif">
                    Gunakan Foto Asli
                  </h4>
                  {(formData.coupleVisualMode || "photo") === "photo" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-900 text-gold-200 text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Menampilkan foto asli mempelai pria, wanita, dan foto berdua pada bingkai sampul, hero, dan kartu profil.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleFieldChange("coupleVisualMode", "svg")}
              className={`p-4 rounded-2xl border text-left transition-transform duration-150 active:scale-[0.98] cursor-pointer flex items-start gap-3.5 ${
                formData.coupleVisualMode === "svg"
                  ? "border-rose-700 bg-rose-50/70 shadow-xs ring-1 ring-rose-700"
                  : "border-gold-500/30 bg-surface-white hover:bg-cream/40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  formData.coupleVisualMode === "svg"
                    ? "bg-rose-900 text-gold-300"
                    : "bg-gold-500/15 text-gold-700"
                }`}
              >
                <Palette className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm text-ink font-serif">
                    Gunakan Karakter Ilustrasi SVG
                  </h4>
                  {formData.coupleVisualMode === "svg" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-900 text-gold-200 text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Menampilkan ilustrasi vektor karakter dengan keserasian presisi antara pose sendiri-sendiri dan pose berdua.
                </p>
              </div>
            </button>
          </div>
        </div>

        {formData.coupleVisualMode === "svg" && (
          <div className="pt-2 border-t border-gold-500/15 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600">
                  Pilih Versi Karakter Ilustrasi SVG (Live Preview):
                </label>
                <p className="text-xs text-muted mt-0.5">
                  Setiap versi memiliki keserasian garis, warna, dan busana yang identik antara pose solo pria, solo wanita, dan pose berdua.
                </p>
              </div>
              <span className="text-xs font-medium text-[#5d3a41] px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 self-start sm:self-auto">
                Preset Terpilih: <strong>{SVG_CHARACTER_PRESETS.find(p => p.id === (formData.svgCharacterPreset || "javanese-royal"))?.title.split("(")[0]}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {SVG_CHARACTER_PRESETS.map((preset) => {
                const isSelected = (formData.svgCharacterPreset || "javanese-royal") === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleFieldChange("svgCharacterPreset", preset.id)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-transform duration-150 active:scale-[0.98] cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? "border-rose-700 bg-gradient-to-b from-rose-50/90 to-surface-white shadow-md ring-2 ring-rose-700/80"
                        : "border-gold-500/30 bg-surface-white hover:border-gold-500/60 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-serif font-bold text-base text-rose-950">
                            {preset.title}
                          </h4>
                          <p className="text-xs text-[#a9823a] font-medium mt-0.5">
                            {preset.subtitle}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-900 text-gold-200 text-xs font-bold shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            Dipilih
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted leading-relaxed mb-4">
                        {preset.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#fffdfa] border border-[#e9d3a3] text-[11px] font-medium text-ink">
                          👔 {preset.groomAttire}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#fffdfa] border border-[#e9d3a3] text-[11px] font-medium text-ink">
                          👗 {preset.brideAttire}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gold-500/20 bg-cream/30 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 rounded-b-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700 text-center mb-2">
                        Pratinjau Serasi (Pria Solo &bull; Pose Berdua &bull; Wanita Solo)
                      </p>
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-gold-500/40 bg-surface-white shadow-xs p-0.5">
                            <CoupleCharacterSvg preset={preset.id} variant="groom" className="w-full h-full" />
                          </div>
                          <span className="text-[10px] font-medium text-muted mt-1">Pria</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 border-rose-800/60 bg-surface-white shadow-xs p-0.5">
                            <CoupleCharacterSvg preset={preset.id} variant="couple" className="w-full h-full" />
                          </div>
                          <span className="text-[10px] font-bold text-rose-900 mt-1">Pose Berdua</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-gold-500/40 bg-surface-white shadow-xs p-0.5">
                            <CoupleCharacterSvg preset={preset.id} variant="bride" className="w-full h-full" />
                          </div>
                          <span className="text-[10px] font-medium text-muted mt-1">Wanita</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Pengaturan Visibilitas Halaman Galeri Foto
            </h3>
            <p className="text-xs text-muted">
              Kendali apakah seksi Galeri Foto dan tombol pintasan navigasi Galeri ditampilkan pada undangan publik.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-cream/35 border border-gold-500/25">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-ink font-serif">
                Tampilkan Halaman Galeri Foto
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.isGalleryEnabled !== false
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"
                }`}
              >
                {formData.isGalleryEnabled !== false ? "Aktif (ON)" : "Disembunyikan (OFF)"}
              </span>
            </div>
            <p className="text-xs text-muted max-w-[560px] leading-relaxed">
              {formData.isGalleryEnabled !== false
                ? "Halaman galeri foto dan menu navigasi Galeri ditampilkan pada undangan publik."
                : "Halaman galeri foto dan tombol menu Galeri disembunyikan dari undangan publik (foto yang sudah diunggah tetap tersimpan aman di sistem)."}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={formData.isGalleryEnabled !== false}
            aria-label="Tampilkan Halaman Galeri Foto"
            onClick={() => handleFieldChange("isGalleryEnabled", formData.isGalleryEnabled === false)}
            className={`min-w-[52px] w-[52px] h-[30px] rounded-full p-1 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-rose-700 shrink-0 cursor-pointer ${
              formData.isGalleryEnabled !== false ? "bg-emerald-600" : "bg-stone-300"
            }`}
          >
            <div
              className={`w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                formData.isGalleryEnabled !== false ? "translate-x-[22px]" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Profil Kedua Mempelai
            </h3>
            <p className="text-xs text-muted">
              Nama lengkap, tanggal/tempat lahir, bio singkat, dan tautan foto kedua calon pengantin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-cream/40 border border-gold-500/20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 block border-b border-gold-500/15 pb-2">
              Mempelai Wanita (Bride)
            </span>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.brideName || ""}
                onChange={(e) => handleFieldChange("brideName", e.target.value)}
                placeholder="Sinta Maria Utami"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                Kelahiran / Info Singkat
              </label>
              <input
                type="text"
                value={formData.brideBirth || ""}
                onChange={(e) => handleFieldChange("brideBirth", e.target.value)}
                placeholder="Pekanbaru, 10 September 2005"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                Deskripsi Bio
              </label>
              <textarea
                rows={3}
                value={formData.brideBio || ""}
                onChange={(e) => handleFieldChange("brideBio", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                URL Foto Profil Wanita
              </label>
              <input
                type="url"
                value={formData.bridePhotoUrl || ""}
                onChange={(e) => handleFieldChange("bridePhotoUrl", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-cream/40 border border-gold-500/20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 block border-b border-gold-500/15 pb-2">
              Mempelai Pria (Groom)
            </span>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.groomName || ""}
                onChange={(e) => handleFieldChange("groomName", e.target.value)}
                placeholder="Fauzan Ma'ruf"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                Kelahiran / Info Singkat
              </label>
              <input
                type="text"
                value={formData.groomBirth || ""}
                onChange={(e) => handleFieldChange("groomBirth", e.target.value)}
                placeholder="3 Mei 1997"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                Deskripsi Bio
              </label>
              <textarea
                rows={3}
                value={formData.groomBio || ""}
                onChange={(e) => handleFieldChange("groomBio", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
                URL Foto Profil Pria
              </label>
              <input
                type="url"
                value={formData.groomPhotoUrl || ""}
                onChange={(e) => handleFieldChange("groomPhotoUrl", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Behind The Story &amp; Hashtag
            </h3>
            <p className="text-xs text-muted">
              Teks narasi kisah cinta dan hashtag resmi yang tampil di seksi perjalanan cinta publik.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Hashtag Resmi Acara:
            </label>
            <input
              type="text"
              value={formData.storyHashtag || ""}
              onChange={(e) => handleFieldChange("storyHashtag", e.target.value)}
              placeholder="#SINgkatceritaFAUZAN"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-semibold text-rose-900 focus:outline-none focus:border-rose-500 normal-case"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Teks Narasi Singkat Kisah Cinta (Satset Story):
            </label>
            <textarea
              rows={3}
              value={formData.loveStoryText || ""}
              onChange={(e) => handleFieldChange("loveStoryText", e.target.value)}
              placeholder="Berawal dari pertemuan singkat, tanpa rencana panjang yang rumit—satset langsung lamaran, dan kini insya Allah bersatu dalam ikatan suci pernikahan."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 resize-y"
            />
            <p className="mt-1.5 text-[11px] text-muted">
              * Teks ini akan tampil dengan indah pada kartu kutipan pembuka di seksi Behind The Story.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900 font-serif">
                Rekening Amplop Digital
              </h3>
              <p className="text-xs text-muted">
                Kartu ATM debit beraksen emas di seksi amplop digital.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addBankAccount}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gold-500/15 text-gold-700 hover:bg-gold-500/25 active:scale-[0.96] transition-transform duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rekening</span>
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600">
            Daftar Rekening Bank
          </h4>
          {bankAccounts.length === 0 ? (
            <p className="text-xs text-muted italic">Belum ada rekening bank yang ditambahkan.</p>
          ) : (
            bankAccounts.map((bank, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-cream/30 border border-gold-500/25 items-end"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-gold-600 mb-1">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={bank.brand}
                    onChange={(e) => handleBankChange(idx, "brand", e.target.value)}
                    placeholder="Contoh: Bank BCA"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gold-600 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={bank.number}
                    onChange={(e) => handleBankChange(idx, "number", e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-xs font-mono tabular-nums text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gold-600 mb-1">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={bank.holder}
                    onChange={(e) => handleBankChange(idx, "holder", e.target.value)}
                    placeholder="Nama Pemilik Rekening"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex justify-end sm:justify-start">
                  <button
                    type="button"
                    onClick={() => removeBankAccount(idx)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-100/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-gold-500/15">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600">
              Daftar Dompet Digital / E-Wallet
            </h4>
            <button
              type="button"
              onClick={addEwallet}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gold-500/15 text-gold-700 hover:bg-gold-500/25 active:scale-[0.96] transition-transform duration-150 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah E-Wallet</span>
            </button>
          </div>
          {ewallets.length === 0 ? (
            <p className="text-xs text-muted italic">Belum ada e-wallet yang ditambahkan.</p>
          ) : (
            ewallets.map((ewallet, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-cream/30 border border-gold-500/25 items-end"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-gold-600 mb-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={ewallet.brand}
                    onChange={(e) => handleEwalletChange(idx, "brand", e.target.value)}
                    placeholder="Contoh: DANA / GoPay"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gold-600 mb-1">
                    Nomor Akun / HP
                  </label>
                  <input
                    type="text"
                    value={ewallet.number}
                    onChange={(e) => handleEwalletChange(idx, "number", e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-xs font-mono tabular-nums text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gold-600 mb-1">
                    Atas Nama
                  </label>
                  <input
                    type="text"
                    value={ewallet.holder}
                    onChange={(e) => handleEwalletChange(idx, "holder", e.target.value)}
                    placeholder="Nama Pemilik Akun"
                    className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex justify-end sm:justify-start">
                  <button
                    type="button"
                    onClick={() => removeEwallet(idx)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-100/80 flex items-center gap-1.5 transition-colors cursor-pointer"
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

      <section className="bg-surface-white rounded-3xl p-6 sm:p-7 border border-gold-500/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gold-500/15">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center text-gold-700">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900 font-serif">
              Alamat Pengiriman Kado Fisik
            </h3>
            <p className="text-xs text-muted">
              Alamat domisili penerima kado bagi tamu yang ingin mengirimkan bingkisan pernikahan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Nama Penerima Kado:
            </label>
            <input
              type="text"
              value={giftAddress.receiver}
              onChange={(e) => handleGiftAddressChange("receiver", e.target.value)}
              placeholder="Sinta Maria Utami"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Nomor Telepon Penerima:
            </label>
            <input
              type="text"
              value={giftAddress.phone}
              onChange={(e) => handleGiftAddressChange("phone", e.target.value)}
              placeholder="0812-xxxx-xxxx"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm font-mono text-ink focus:outline-none focus:border-rose-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1.5">
              Alamat Lengkap Pengiriman:
            </label>
            <textarea
              rows={3}
              value={giftAddress.address}
              onChange={(e) => handleGiftAddressChange("address", e.target.value)}
              placeholder="Jl. Contoh Alamat No. 10, Kel. Air Putih, Kec. Tuah Madani, Kota Pekanbaru, Riau 28127"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 resize-y"
            />
          </div>
        </div>
      </section>

      <div className="p-5 sm:p-6 bg-surface-white rounded-3xl border border-gold-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-serif font-bold text-base text-rose-900">
            Selesai Mengatur Acara &amp; Musik?
          </p>
          <p className="text-xs text-muted">
            Klik tombol simpan untuk memperbarui Countdown, Musik Latar, Rekening, dan Lokasi Acara.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 text-white font-bold text-xs tracking-wider uppercase shadow-[0_12px_24px_-8px_rgba(93,58,65,0.5)] hover:brightness-110 active:scale-[0.96] transition-transform duration-150 ease-out disabled:opacity-50 cursor-pointer min-h-12"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Menyimpan Perubahan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Acara &amp; Musik</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
