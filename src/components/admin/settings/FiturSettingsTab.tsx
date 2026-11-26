"use client";

import { Heart, MessageSquare, Hash, Type, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FONT_THEME_OPTIONS, normalizeFontTheme, type FontTheme } from "@/lib/fontThemes";

interface FiturSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
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

export function FiturSettingsTab({ formData, onChange }: FiturSettingsTabProps) {
  const isLoveStoryEnabled = formData.isLoveStoryEnabled !== false;
  const showPublicPreviewWishes = formData.showPublicPreviewWishes !== false;
  const selectedFontTheme = normalizeFontTheme(formData.fontTheme);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Tema Font Undangan
            </CardTitle>
          </div>
          <CardDescription>
            Pilih gaya huruf untuk halaman undangan publik. Pengaturan ini tidak mengubah huruf dashboard admin.
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
                  const prev = FONT_THEME_OPTIONS[(idx - 1 + FONT_THEME_OPTIONS.length) % FONT_THEME_OPTIONS.length];
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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Visibilitas Buku Tamu &amp; Ucapan Publik
            </CardTitle>
          </div>
          <CardDescription>
            Atur apakah pengunjung umum tanpa tautan undangan pribadi dapat membaca doa dan ucapan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-900">
                  Tampilkan daftar ucapan di Mode Pratinjau Publik
                </span>
                <Badge variant={showPublicPreviewWishes ? "success" : "outline"} size="sm">
                  {showPublicPreviewWishes ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 max-w-[560px]">
                {showPublicPreviewWishes
                  ? "Jika aktif, pengunjung tanpa tautan undangan pribadi tetap dapat membaca daftar doa dan ucapan (hanya baca). Jika nonaktif, daftar ucapan ikut disembunyikan dan tidak dikirim ke browser."
                  : "Daftar ucapan disembunyikan total dari pengunjung umum dan tidak dikirim ke browser."}
              </p>
            </div>

            <Switch
              checked={showPublicPreviewWishes}
              onCheckedChange={(checked) => onChange("showPublicPreviewWishes", checked)}
              aria-label="Tampilkan daftar ucapan di Mode Pratinjau Publik"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Alur Perjalanan &amp; Cerita Cinta
            </CardTitle>
          </div>
          <CardDescription>
            Atur visibilitas kisah perjalanan cinta kedua mempelai pada undangan publik.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-900">
                  Tampilkan seksi Cerita Cinta di undangan publik
                </span>
                <Badge variant={isLoveStoryEnabled ? "success" : "outline"} size="sm">
                  {isLoveStoryEnabled ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 max-w-[560px]">
                {isLoveStoryEnabled
                  ? "Seksi cerita perjalanan cinta dan tombol navigasi Kisah ditampilkan pada halaman undangan publik."
                  : "Seksi cerita cinta disembunyikan dari undangan publik."}
              </p>
            </div>

            <Switch
              checked={isLoveStoryEnabled}
              onCheckedChange={(checked) => onChange("isLoveStoryEnabled", checked)}
              aria-label="Tampilkan seksi Cerita Cinta"
            />
          </div>

          <div>
            <Label htmlFor="storyHashtag" className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-slate-400" />
              <span>Hashtag pernikahan</span>
            </Label>
            <Input
              id="storyHashtag"
              value={formData.storyHashtag || ""}
              onChange={(e) => onChange("storyHashtag", e.target.value)}
              placeholder="#SINgkatceritaFAUZAN"
              className="max-w-sm"
            />
          </div>

          <div>
            <Label htmlFor="loveStoryText">Narasi kisah perjalanan cinta</Label>
            <Textarea
              id="loveStoryText"
              value={formData.loveStoryText || ""}
              onChange={(e) => onChange("loveStoryText", e.target.value)}
              placeholder="Ceritakan momen pertama kali bertemu hingga memutuskan melangkah ke jenjang pernikahan..."
              className="min-h-[140px]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Gunakan pemisah baris baru untuk paragraf berbeda.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Template Pesan WhatsApp
            </CardTitle>
          </div>
          <CardDescription>
            Format pesan pembuka otomatis saat mengirimkan tautan undangan melalui WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            id="waMessageTemplate"
            value={formData.waMessageTemplate || ""}
            onChange={(e) => onChange("waMessageTemplate", e.target.value)}
            placeholder="Assalamu'alaikum Wr. Wb. Yth. {nama_tamu}..."
            className="min-h-[150px] font-mono text-xs"
          />
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">Variabel dinamis yang tersedia:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
              <li><code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">{"{nama_tamu}"}</code>: Nama lengkap tamu penerima</li>
              <li><code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">{"{link_undangan}"}</code>: Tautan personal dengan parameter <code className="text-slate-800">?kpd=...</code></li>
              <li><code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">{"{nama_mempelai}"}</code>: Nama mempelai (Fauzan &amp; Sinta)</li>
              <li><code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">{"{tanggal_acara}"}</code>: Tanggal pernikahan resmi</li>
              <li><code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">{"{pengirim}"}</code>: Nama pengirim/keluarga akun pengirim</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
