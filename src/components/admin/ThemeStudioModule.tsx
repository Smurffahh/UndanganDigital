"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Type, Palette, CheckCircle2, Save, RotateCcw, Eye, Sparkles, Music2 } from "lucide-react";
import type { WeddingSettingsData } from "@/lib/db/store";
import {
  AVAILABLE_WEDDING_TRACKS,
  SVG_CHARACTER_PRESETS,
  type CoupleVisualMode,
  type SvgCharacterPreset,
  type MusicPreset,
} from "@/lib/db/seed-data";
import {
  DEFAULT_FONT_THEME,
  FONT_THEME_OPTIONS,
  normalizeFontTheme,
  type FontTheme,
} from "@/lib/fontThemes";
import { formatEventCardDate } from "@/lib/dateFormat";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { CoupleCharacterSvg } from "@/components/invitation/CoupleCharacterSvg";
import { JavaneseScriptAccent } from "@/components/invitation/JavaneseScriptAccent";
import { MusikSettingsTab } from "./settings/MusikSettingsTab";

interface ThemeStudioModuleProps {
  formData: WeddingSettingsData;
  onChange: (field: string, value: unknown) => void;
  onUpdateFields: (patch: Partial<WeddingSettingsData>) => void;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => Promise<boolean>;
  onDiscard: () => void;
}

function getPreviewStyles(themeId: FontTheme) {
  if (themeId === "javanese") {
    return {
      display: { fontFamily: 'var(--font-philosopher), Georgia, serif', fontWeight: 700 as const },
      subtitle: { fontFamily: 'var(--font-lora), Georgia, serif', fontWeight: 400 as const },
    };
  }
  if (themeId === "latin") {
    return {
      display: {
        fontFamily: 'var(--font-script), "Great Vibes", cursive',
        fontWeight: 400 as const,
        lineHeight: 1.35,
        paddingBlock: "0.08em",
        letterSpacing: "0.01em",
      },
      subtitle: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 500 as const },
    };
  }
  return {
    display: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 700 as const },
    subtitle: { fontFamily: 'var(--font-sans), sans-serif', fontWeight: 400 as const },
  };
}

export function ThemeStudioModule({
  formData,
  onChange,
  onUpdateFields,
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: ThemeStudioModuleProps) {
  const selectedFontTheme = normalizeFontTheme(formData.fontTheme);
  const selectedThemeMeta =
    FONT_THEME_OPTIONS.find((item) => item.id === selectedFontTheme) ?? FONT_THEME_OPTIONS[0];

  const groomFirstName = formData.groomName?.trim().split(/\s+/)[0] || "Fauzan";
  const brideFirstName = formData.brideName?.trim().split(/\s+/)[0] || "Sinta";
  const visualMode: CoupleVisualMode = formData.coupleVisualMode === "photo" ? "photo" : "svg";
  const presetId = (formData.svgCharacterPreset || "javanese-royal") as SvgCharacterPreset;
  const coverPhotoSrc = formData.coverPhotoUrl || "/images/couple/cover.webp";

  const isCurrentYouTube =
    formData.musicSourceType === "youtube" ||
    (typeof formData.musicUrl === "string" && formData.musicUrl.includes("youtube.com"));

  const effectiveAudioUrl = !isCurrentYouTube
    ? formData.musicUrl || "/audio/raim-laode-komang.mp3"
    : "/audio/raim-laode-komang.mp3";

  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [activePreviewTrackUrl, setActivePreviewTrackUrl] = useState<string | null>(null);
  const audioTestRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioTestRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const handleSelectMusicPreset = (presetIdValue: string) => {
    const selected = AVAILABLE_WEDDING_TRACKS.find((p) => p.id === presetIdValue);
    if (!selected) return;

    if (audioTestRef.current) {
      audioTestRef.current.pause();
      setIsPlayingTest(false);
      setActivePreviewTrackUrl(null);
    }

    onUpdateFields({
      musicTitle: selected.title,
      musicSourceType: selected.sourceType,
      musicUrl: selected.url,
      youtubeVideoId: selected.youtubeId || formData.youtubeVideoId || "In8kDy_WU4s",
    });

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
        .catch(() => {
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
      onUpdateFields({
        musicSourceType: "audio_url",
        musicUrl: result,
        musicTitle: cleanName,
      });
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
        .catch(() => {
          toast.error("Gagal memutar audio preview.");
        });
    }
  };

  const handleResetDefaultTheme = () => {
    onChange("fontTheme", DEFAULT_FONT_THEME);
    toast.info("Tema font draf dikembalikan ke Classic. Klik Simpan untuk menerapkan.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form id="theme-studio-form" onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        <div className="space-y-6 min-w-0 order-2 xl:order-1">
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-[#6B1222]" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Tema Font Undangan
                </CardTitle>
              </div>
              <CardDescription>
                Pilih gaya tipografi untuk halaman undangan publik. Pengaturan ini tidak mengubah huruf di dashboard admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                role="radiogroup"
                aria-label="Pilih tema font undangan"
                className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
              >
                {FONT_THEME_OPTIONS.map((option, idx) => {
                  const isSelected = selectedFontTheme === option.id;
                  const previewStyles = getPreviewStyles(option.id);

                  const handleRadioKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      const next = FONT_THEME_OPTIONS[(idx + 1) % FONT_THEME_OPTIONS.length];
                      onChange("fontTheme", next.id);
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const prev =
                        FONT_THEME_OPTIONS[
                          (idx - 1 + FONT_THEME_OPTIONS.length) % FONT_THEME_OPTIONS.length
                        ];
                      onChange("fontTheme", prev.id);
                    }
                  };

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      data-testid={`font-theme-option-${option.id}`}
                      onClick={() => onChange("fontTheme", option.id)}
                      onKeyDown={handleRadioKeyDown}
                      className={`text-left w-full min-h-11 rounded-2xl p-2.5 border transition-[border-color,background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B1222] flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? "border-[#6B1222] ring-2 ring-[#6B1222]/20 bg-[#FDF7F3]"
                          : "border-slate-200 bg-white hover:border-[#C59B6D]/70 hover:bg-slate-50/70"
                      }`}
                    >
                      <div className="w-full space-y-2.5">
                        <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
                          <span className="text-xs sm:text-sm font-semibold text-slate-900">
                            {option.label}
                          </span>
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#6B1222] text-[#FBF7F2] shrink-0">
                              <CheckCircle2 className="w-3 h-3 stroke-[2]" />
                              Aktif
                            </span>
                          ) : (
                            <Badge variant="outline" size="sm" className="shrink-0 text-[11px]">
                              {option.badge}
                            </Badge>
                          )}
                        </div>

                        <div className="rounded-md border border-[#C59B6D]/35 bg-[#FBF7F2] px-3 py-3 text-center flex flex-col items-center justify-center min-h-[86px]">
                          {option.previewJavanese && (
                            <p
                              lang="jv"
                              aria-hidden="true"
                              className="text-sm text-[#7A4E1D] leading-[1.85] py-0.5"
                              style={{ fontFamily: 'var(--font-javanese), "Noto Sans Javanese", serif' }}
                            >
                              {option.previewJavanese}
                            </p>
                          )}
                          <p
                            className={`${
                              option.id === "latin" ? "text-2xl sm:text-[26px]" : "text-lg sm:text-xl"
                            } text-[#6B1222] leading-snug`}
                            style={previewStyles.display}
                          >
                            {option.previewDisplay}
                          </p>
                          <p
                            className="text-[11px] text-[#6E4A50] mt-1 tabular-nums"
                            style={previewStyles.subtitle}
                          >
                            {option.previewSubtitle}
                          </p>
                        </div>
                      </div>

                      <div className="px-1 pb-0.5 space-y-1">
                        <p className="text-[11px] font-medium text-[#6B1222]/85">
                          {option.fontSummary}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#6B1222]" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Mode Visual Mempelai
                </CardTitle>
              </div>
              <CardDescription>
                Pilih apakah bagian pengantin menampilkan foto potret asli atau ilustrasi karakter adat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "photo" as CoupleVisualMode,
                    title: "Foto Potret Asli",
                    desc: "Menggunakan foto asli kedua mempelai dalam bingkai artistik.",
                  },
                  {
                    id: "svg" as CoupleVisualMode,
                    title: "Karakter Ilustrasi Adat",
                    desc: "Menggunakan ilustrasi busana pernikahan khas tradisi nusantara.",
                  },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    data-testid={`visual-mode-${mode.id}`}
                    onClick={() => onChange("coupleVisualMode", mode.id)}
                    className={`p-4 min-h-11 rounded-xl border text-left transition-[border-color,background-color] duration-150 cursor-pointer ${
                      visualMode === mode.id
                        ? "border-[#6B1222] bg-[#6B1222]/5 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900">
                        {mode.title}
                      </span>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          visualMode === mode.id
                            ? "border-[#6B1222] bg-[#6B1222]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {visualMode === mode.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
                  </button>
                ))}
              </div>

              {visualMode === "svg" && (
                <div className="pt-4 border-t border-slate-100">
                  <Label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Pilihan Preset Karakter Busana Adat
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SVG_CHARACTER_PRESETS.map((preset) => {
                      const isSelected = presetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => onChange("svgCharacterPreset", preset.id)}
                          className={`p-3 min-h-11 rounded-xl border flex flex-col items-center text-center transition-[border-color,background-color] duration-150 cursor-pointer ${
                            isSelected
                              ? "border-[#6B1222] bg-[#6B1222]/5 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="h-20 w-20 flex items-center justify-center mb-2">
                            <CoupleCharacterSvg
                              preset={preset.id as SvgCharacterPreset}
                              className="h-16 w-16"
                            />
                          </div>
                          <span className="font-medium text-xs text-slate-900">{preset.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <MusikSettingsTab
            formData={formData}
            onChange={onChange}
            onSelectPreset={handleSelectMusicPreset}
            onToggleTrackPreview={handleToggleTrackPreview}
            onToggleTestAudio={handleToggleTestAudio}
            isPlayingTest={isPlayingTest}
            activePreviewTrackUrl={activePreviewTrackUrl}
            onAudioUpload={handleAudioUpload}
          />
        </div>

        <aside className="order-1 xl:order-2 xl:sticky xl:top-24 space-y-4 max-w-[420px] xl:max-w-none w-full mx-auto">
          <Card className="border-slate-200/80 shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Eye className="h-4 w-4 text-[#6B1222] shrink-0" />
                  <CardTitle className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    Pratinjau Langsung
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[11px] bg-white shrink-0 whitespace-nowrap">
                  {selectedThemeMeta.label}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Tampilan sampul undangan menyesuaikan tema font dan mode visual yang sedang dipilih.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-3 space-y-3">
              <div
                data-testid="theme-studio-live-preview"
                data-font-theme={selectedFontTheme}
                className="rounded-xl overflow-hidden border border-[#C59B6D]/40 bg-gradient-to-b from-[#6B1222] via-[#5A0E1B] to-[#470A15] text-[#FBF7F2] px-5 py-6 text-center relative shadow-sm"
              >
                <div className="pointer-events-none absolute inset-2 rounded-lg border border-[#C59B6D]/30" />

                <div className="relative z-10 flex flex-col items-center">
                  <JavaneseScriptAccent
                    section="cover"
                    fontTheme={selectedFontTheme}
                    className="text-base !text-[#E2C299] mb-1.5"
                  />

                  <p className="font-invitation-heading text-[10px] uppercase tracking-[0.22em] text-[#E2C299] mb-3">
                    The Wedding Of
                  </p>

                  {visualMode === "svg" ? (
                    <div className="w-28 h-28 rounded-full bg-[#FBF7F2]/10 border border-[#C59B6D]/45 flex items-end justify-center overflow-hidden mb-3.5">
                      <CoupleCharacterSvg
                        preset={presetId}
                        variant="couple"
                        className="w-24 h-24"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-28 rounded-xl overflow-hidden border border-[#C59B6D]/50 bg-[#470A15] mb-3.5 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPhotoSrc}
                        alt={`Foto ${groomFirstName} & ${brideFirstName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3
                    style={{ color: "#FBF7F2" }}
                    className={`font-invitation-display text-[#FBF7F2] text-center max-w-full ${
                      selectedFontTheme === "latin"
                        ? "text-[34px] leading-[1.35] font-normal py-0.5"
                        : "text-[26px] font-bold leading-snug"
                    }`}
                  >
                    {groomFirstName} &amp; {brideFirstName}
                  </h3>

                  <p className="font-sans text-[11px] text-[#FBF7F2]/85 tracking-wide tabular-nums mt-1.5">
                    {formatEventCardDate(formData.weddingDateIso, formData.eventDateLabel)}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C59B6D] text-[#3B0B14] text-[11px] font-semibold font-sans shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>Buka Undangan</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Status Perubahan</span>
                  {isDirty ? (
                    <span className="font-semibold text-amber-700">Belum disimpan</span>
                  ) : (
                    <span className="font-semibold text-emerald-700">Tersinkron</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Visual Pengantin</span>
                  <span className="font-medium text-slate-900">
                    {visualMode === "svg" ? "Karakter Adat" : "Foto Potret"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 inline-flex items-center gap-1">
                    <Music2 className="h-3 w-3 text-slate-400" />
                    Audio Latar
                  </span>
                  <span className="font-medium text-slate-900 truncate max-w-[160px]">
                    {formData.musicEnabled === false
                      ? "Nonaktif"
                      : formData.musicTitle || "Musik Aktif"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  className="w-full min-h-11 text-xs font-semibold bg-[#6B1222] hover:bg-[#520D1A] text-white active:not-disabled:scale-[0.96] transition-[background-color,transform]"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Tema &amp; Tampilan</span>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetDefaultTheme}
                    disabled={isSaving || selectedFontTheme === DEFAULT_FONT_THEME}
                    className="min-h-11 text-xs font-medium"
                  >
                    <span>Default Classic</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onDiscard}
                    disabled={isSaving || !isDirty}
                    className="min-h-11 text-xs font-medium"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Batalkan</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
