"use client";

import { Music2, Play, Pause, Upload, Volume2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_WEDDING_TRACKS, type MusicPreset } from "@/lib/db/seed-data";

interface MusikSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onSelectPreset: (presetId: string) => void;
  onToggleTrackPreview: (e: React.MouseEvent, preset: MusicPreset) => void;
  onToggleTestAudio: () => void;
  isPlayingTest: boolean;
  activePreviewTrackUrl: string | null;
  onAudioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MusikSettingsTab({
  formData,
  onChange,
  onSelectPreset,
  onToggleTrackPreview,
  onToggleTestAudio,
  isPlayingTest,
  activePreviewTrackUrl,
  onAudioUpload,
}: MusikSettingsTabProps) {
  const isMusicEnabled = formData.musicEnabled !== false;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4 text-[#6B1222]" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Musik Latar Belakang
                </CardTitle>
                <CardDescription className="mt-0.5">
                  Musik romantis yang otomatis berputar saat tamu membuka undangan.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-600">
                {isMusicEnabled ? "Musik Aktif" : "Musik Nonaktif"}
              </span>
              <Switch
                checked={isMusicEnabled}
                onCheckedChange={(checked) => onChange("musicEnabled", checked)}
                aria-label="Aktifkan musik latar"
              />
            </div>
          </div>
        </CardHeader>

        {isMusicEnabled && (
          <CardContent className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-2 block">
                Sumber Musik
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "preset", label: "Preset Lagu Siap Pakai", desc: "Pilih dari koleksi lagu pernikahan pilihan" },
                  { id: "audio_url", label: "Unggah / URL Audio", desc: "Gunakan berkas MP3 atau URL audio sendiri" },
                  { id: "youtube", label: "Tautan YouTube", desc: "Gunakan audio dari video YouTube" },
                ].map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => onChange("musicSourceType", src.id)}
                    className={`p-3.5 rounded-xl border text-left transition-[border-color,background-color] duration-150 cursor-pointer ${
                      formData.musicSourceType === src.id
                        ? "border-[#6B1222] bg-[#6B1222]/5 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-xs text-slate-900 block mb-0.5">
                      {src.label}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      {src.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {formData.musicSourceType === "preset" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <Label className="text-xs font-semibold text-slate-700 block">
                  Koleksi Lagu Pernikahan Pilihan
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_WEDDING_TRACKS.map((track) => {
                    const isSelected = formData.musicTitle === track.title;
                    const isThisPlaying = isPlayingTest && activePreviewTrackUrl === track.url;
                    return (
                      <div
                        key={track.id}
                        onClick={() => onSelectPreset(track.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-[border-color,background-color] ${
                          isSelected
                            ? "border-[#6B1222] bg-[#6B1222]/5 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-slate-900 block truncate">
                            {track.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {track.sourceType === "youtube" ? "Audio YouTube" : "Audio Berkualitas Tinggi"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {track.sourceType !== "youtube" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => onToggleTrackPreview(e, track)}
                              className="text-slate-500 hover:text-[#6B1222]"
                              title={isThisPlaying ? "Jeda pratinjau" : "Putar pratinjau"}
                            >
                              {isThisPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            </Button>
                          )}
                          <span
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-[#6B1222] bg-[#6B1222]" : "border-slate-300"
                            }`}
                          >
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.musicSourceType === "audio_url" && (
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <Label htmlFor="musicTitle">Judul lagu</Label>
                    <Input
                      id="musicTitle"
                      value={formData.musicTitle || ""}
                      onChange={(e) => onChange("musicTitle", e.target.value)}
                      placeholder="Contoh: Komang - Raim Laode"
                    />
                  </div>

                  <div>
                    <Label htmlFor="musicUrl">URL berkas audio (MP3)</Label>
                    <Input
                      id="musicUrl"
                      value={formData.musicUrl || ""}
                      onChange={(e) => onChange("musicUrl", e.target.value)}
                      placeholder="https://... atau /audio/..."
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Unggah berkas audio dari komputer
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Maksimal 10 MB (format MP3, WAV, atau M4A)
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0">
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    <span>Pilih berkas audio</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={onAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {formData.musicSourceType === "youtube" && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <Label htmlFor="youtubeVideoId">Tautan atau ID video YouTube</Label>
                  <Input
                    id="youtubeVideoId"
                    value={formData.youtubeVideoId || ""}
                    onChange={(e) => onChange("youtubeVideoId", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau ID 11 karakter"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Audio video akan diputar secara otomatis di latar belakang saat undangan dibuka.
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Uji Pemutar Audio
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Lagu aktif: <strong>{formData.musicTitle || "Tanpa judul"}</strong>
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleTestAudio}
                className="gap-2"
              >
                {isPlayingTest ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-[#6B1222]" />
                    <span>Hentikan audio</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-[#6B1222]" />
                    <span>Putar pratinjau</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
