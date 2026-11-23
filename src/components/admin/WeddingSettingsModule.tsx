"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Save,
  Users,
  Calendar,
  Heart,
  CreditCard,
  Music2,
  RefreshCw,
  Shield,
} from "lucide-react";
import type { WeddingSettingsData } from "@/lib/db/store";
import {
  AVAILABLE_WEDDING_TRACKS,
  type MusicPreset,
} from "@/lib/db/seed-data";
import { normalizeUrlOrPath, isValidUrlOrLocalPath } from "@/lib/urlUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MempelaiSettingsTab } from "./settings/MempelaiSettingsTab";
import { AcaraSettingsTab } from "./settings/AcaraSettingsTab";
import { FiturSettingsTab } from "./settings/FiturSettingsTab";
import { AmplopSettingsTab } from "./settings/AmplopSettingsTab";
import { MusikSettingsTab } from "./settings/MusikSettingsTab";
import { AksesAkunTab } from "./settings/AksesAkunTab";

interface WeddingSettingsModuleProps {
  initialSettings: WeddingSettingsData | any;
  initialUsers?: any[];
  onSettingsUpdate?: (newSettings: WeddingSettingsData) => void;
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
  initialUsers,
  onSettingsUpdate,
}: WeddingSettingsModuleProps) {
  const [formData, setFormData] = useState<WeddingSettingsData | any>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isResolvingMaps, setIsResolvingMaps] = useState(false);
  const [activeTab, setActiveTab] = useState("mempelai");

  useEffect(() => {
    if (initialSettings) {
      setFormData(initialSettings);
    }
  }, [initialSettings]);

  const isCurrentYouTube =
    formData.musicSourceType === "youtube" ||
    (typeof formData.musicUrl === "string" && formData.musicUrl.includes("youtube.com"));

  const effectiveAudioUrl = !isCurrentYouTube
    ? formData.musicUrl || "/audio/raim-laode-komang.mp3"
    : "/audio/raim-laode-komang.mp3";

  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [activePreviewTrackUrl, setActivePreviewTrackUrl] = useState<string | null>(null);
  const audioTestRef = useRef<HTMLAudioElement | null>(null);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectMusicPreset = (presetId: string) => {
    const selected = AVAILABLE_WEDDING_TRACKS.find((p) => p.id === presetId);
    if (!selected) return;

    if (audioTestRef.current) {
      audioTestRef.current.pause();
      setIsPlayingTest(false);
      setActivePreviewTrackUrl(null);
    }

    setFormData((prev: any) => ({
      ...prev,
      musicTitle: selected.title,
      musicSourceType: selected.sourceType,
      musicUrl: selected.url,
      youtubeVideoId: selected.youtubeId || prev.youtubeVideoId || "In8kDy_WU4s",
    }));

    toast.success(`Lagu "${selected.title}" dipilih.`);
  };

  const handleToggleTrackPreview = (e: React.MouseEvent, preset: MusicPreset) => {
    e.stopPropagation();

    if (preset.sourceType === "youtube") {
      handleSelectMusicPreset(preset.id);
      return;
    }

    const audio = audioTestRef.current;
    if (!audio) return;

    if (isPlayingTest && activePreviewTrackUrl === preset.url) {
      audio.pause();
      setIsPlayingTest(false);
      setActivePreviewTrackUrl(null);
    } else {
      audio.src = preset.url;
      audio.volume = 0.8;
      audio
        .play()
        .then(() => {
          setIsPlayingTest(true);
          setActivePreviewTrackUrl(preset.url);
          toast.success(`Memutar pratinjau: ${preset.title}`);
        })
        .catch((err) => {
          console.error("Preset preview failed:", err);
          toast.error("Gagal memutar audio pratinjau.");
        });
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      toast.error("File harus berupa berkas audio (.mp3, .wav, atau .m4a).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file audio maksimal 10 MB.");
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
        setActivePreviewTrackUrl(null);
      }
      toast.success(`File audio "${file.name}" berhasil dimuat.`);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTestAudio = () => {
    if (isCurrentYouTube) {
      toast.info("Audio YouTube akan otomatis diputar saat halaman undangan dibuka.");
      return;
    }

    const audio = audioTestRef.current;
    if (!audio) return;

    if (isPlayingTest) {
      audio.pause();
      setIsPlayingTest(false);
      setActivePreviewTrackUrl(null);
    } else {
      audio.src = effectiveAudioUrl;
      audio.volume = 0.8;
      audio
        .play()
        .then(() => {
          setIsPlayingTest(true);
          setActivePreviewTrackUrl(effectiveAudioUrl);
        })
        .catch((err) => {
          console.error("Test audio play failed:", err);
          toast.error("Gagal memutar audio preview.");
        });
    }
  };

  const handleResolveMaps = async () => {
    const rawUrl = formData.googleMapsUrl;
    if (!rawUrl || !rawUrl.trim()) {
      toast.error("Masukkan tautan Google Maps terlebih dahulu.");
      return;
    }

    const targetUrl = normalizeUrlOrPath(rawUrl, "maps");
    if (!isValidUrlOrLocalPath(targetUrl)) {
      toast.error("Format tautan Google Maps tidak valid.");
      return;
    }

    setFormData((prev: any) => ({ ...prev, googleMapsUrl: targetUrl }));
    setIsResolvingMaps(true);
    try {
      const res = await fetch(`/api/admin/resolve-maps?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengekstrak koordinat peta.");
      }

      setFormData((prev: any) => ({
        ...prev,
        mapsLatitude: data.latitude || prev.mapsLatitude || "-7.310076",
        mapsLongitude: data.longitude || prev.mapsLongitude || "109.296186",
        googleMapsEmbed: data.embedUrl || prev.googleMapsEmbed,
      }));

      toast.success("Koordinat lokasi Google Maps berhasil diekstrak.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengekstrak peta.";
      toast.error(msg);
    } finally {
      setIsResolvingMaps(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedMusicUrl = normalizeUrlOrPath(formData.musicUrl, "asset");
    const normalizedMapsUrl = normalizeUrlOrPath(formData.googleMapsUrl, "maps");
    const normalizedBridePhoto = normalizeUrlOrPath(formData.bridePhotoUrl, "asset");
    const normalizedGroomPhoto = normalizeUrlOrPath(formData.groomPhotoUrl, "asset");
    const normalizedTasyakuranMapsUrl = formData.tasyakuranMapsUrl
      ? normalizeUrlOrPath(formData.tasyakuranMapsUrl, "maps")
      : "";

    if (formData.musicUrl && !isValidUrlOrLocalPath(normalizedMusicUrl)) {
      toast.error("Format tautan audio tidak valid.");
      return;
    }
    if (formData.googleMapsUrl && !isValidUrlOrLocalPath(normalizedMapsUrl)) {
      toast.error("Format tautan Google Maps tidak valid.");
      return;
    }
    if (formData.tasyakuranMapsUrl && !isValidUrlOrLocalPath(normalizedTasyakuranMapsUrl)) {
      toast.error("Format tautan Google Maps Tasyakuran tidak valid.");
      return;
    }
    if (formData.bridePhotoUrl && !isValidUrlOrLocalPath(normalizedBridePhoto)) {
      toast.error("Format tautan foto mempelai wanita tidak valid.");
      return;
    }
    if (formData.groomPhotoUrl && !isValidUrlOrLocalPath(normalizedGroomPhoto)) {
      toast.error("Format tautan foto mempelai pria tidak valid.");
      return;
    }

    const payload = {
      ...formData,
      musicUrl: normalizedMusicUrl,
      googleMapsUrl: normalizedMapsUrl,
      bridePhotoUrl: normalizedBridePhoto,
      groomPhotoUrl: normalizedGroomPhoto,
      tasyakuranMapsUrl: normalizedTasyakuranMapsUrl,
    };

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan pengaturan.");
      }
      toast.success("Pengaturan undangan berhasil disimpan.");
      if (data.data) {
        setFormData(data.data);
        if (onSettingsUpdate) {
          onSettingsUpdate(data.data);
        }
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kendala saat menyimpan pengaturan."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} id="wedding-settings-form" noValidate className="space-y-6">
      <audio
        ref={audioTestRef}
        src={effectiveAudioUrl}
        preload="none"
        onEnded={() => {
          setIsPlayingTest(false);
          setActivePreviewTrackUrl(null);
        }}
        className="hidden"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:grid-cols-6 p-1 bg-slate-100 rounded-xl">
            <TabsTrigger value="mempelai" className="gap-1.5 text-xs py-2">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Mempelai</span>
            </TabsTrigger>
            <TabsTrigger value="acara" className="gap-1.5 text-xs py-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Acara &amp; Lokasi</span>
            </TabsTrigger>
            <TabsTrigger value="fitur" className="gap-1.5 text-xs py-2">
              <Heart className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Fitur &amp; Cerita</span>
            </TabsTrigger>
            <TabsTrigger value="amplop" className="gap-1.5 text-xs py-2">
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Amplop Digital</span>
            </TabsTrigger>
            <TabsTrigger value="musik" className="gap-1.5 text-xs py-2">
              <Music2 className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Musik Latar</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 text-xs py-2">
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Akses Akun</span>
            </TabsTrigger>
          </TabsList>

          {activeTab !== "users" && (
            <Button
              type="submit"
              isLoading={isSaving}
              className="font-semibold self-end sm:self-auto shrink-0 bg-[#6B1222] hover:bg-[#520D1A] text-white"
            >
              <Save className="h-4 w-4" />
              <span>Simpan semua perubahan</span>
            </Button>
          )}
        </div>

        <TabsContent value="mempelai" className="mt-4">
          <MempelaiSettingsTab formData={formData} onChange={handleFieldChange} />
        </TabsContent>

        <TabsContent value="acara" className="mt-4">
          <AcaraSettingsTab
            formData={formData}
            onChange={handleFieldChange}
            onResolveMaps={handleResolveMaps}
            isResolvingMaps={isResolvingMaps}
          />
        </TabsContent>

        <TabsContent value="fitur" className="mt-4">
          <FiturSettingsTab formData={formData} onChange={handleFieldChange} />
        </TabsContent>

        <TabsContent value="amplop" className="mt-4">
          <AmplopSettingsTab formData={formData} onChange={handleFieldChange} />
        </TabsContent>

        <TabsContent value="musik" className="mt-4">
          <MusikSettingsTab
            formData={formData}
            onChange={handleFieldChange}
            onSelectPreset={handleSelectMusicPreset}
            onToggleTrackPreview={handleToggleTrackPreview}
            onToggleTestAudio={handleToggleTestAudio}
            isPlayingTest={isPlayingTest}
            activePreviewTrackUrl={activePreviewTrackUrl}
            onAudioUpload={handleAudioUpload}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <AksesAkunTab initialUsers={initialUsers} />
        </TabsContent>
      </Tabs>
    </form>
  );
}
