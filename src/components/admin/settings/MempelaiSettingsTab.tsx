"use client";

import { Users, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SVG_CHARACTER_PRESETS, type CoupleVisualMode, type SvgCharacterPreset } from "@/lib/db/seed-data";
import { CoupleCharacterSvg } from "@/components/invitation/CoupleCharacterSvg";

interface MempelaiSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function MempelaiSettingsTab({ formData, onChange }: MempelaiSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#6B1222]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Mode Visual Mempelai
            </CardTitle>
          </div>
          <CardDescription>
            Pilih apakah bagian pengantin menampilkan foto potret atau ilustrasi karakter adat.
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
                onClick={() => onChange("coupleVisualMode", mode.id)}
                className={`p-4 rounded-xl border text-left transition-[border-color,background-color] duration-150 cursor-pointer ${
                  formData.coupleVisualMode === mode.id
                    ? "border-[#6B1222] bg-[#6B1222]/5 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900">{mode.title}</span>
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      formData.coupleVisualMode === mode.id
                        ? "border-[#6B1222] bg-[#6B1222]"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {formData.coupleVisualMode === mode.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{mode.desc}</p>
              </button>
            ))}
          </div>

          {formData.coupleVisualMode === "svg" && (
            <div className="pt-4 border-t border-slate-100">
              <Label className="text-xs font-semibold text-slate-700 mb-2">
                Pilihan Preset Karakter Busana Adat
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SVG_CHARACTER_PRESETS.map((preset) => {
                  const isSelected = (formData.svgCharacterPreset || "javanese-royal") === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onChange("svgCharacterPreset", preset.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-colors cursor-pointer ${
                        isSelected
                          ? "border-[#6B1222] bg-[#6B1222]/5 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-20 w-20 flex items-center justify-center mb-2">
                        <CoupleCharacterSvg preset={preset.id as SvgCharacterPreset} className="h-16 w-16" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900">
              Profil Mempelai Pria
            </CardTitle>
            <CardDescription>
              Data diri dan informasi keluarga mempelai pria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div>
              <Label htmlFor="groomName">Nama lengkap</Label>
              <Input
                id="groomName"
                value={formData.groomName || ""}
                onChange={(e) => onChange("groomName", e.target.value)}
                placeholder="Fauzan Ma'ruf, S.Kom"
              />
            </div>

            <div>
              <Label htmlFor="groomChildOrder">Urutan dalam keluarga</Label>
              <Input
                id="groomChildOrder"
                value={formData.groomChildOrder || ""}
                onChange={(e) => onChange("groomChildOrder", e.target.value)}
                placeholder="Putra Pertama"
              />
            </div>

            <div>
              <Label htmlFor="groomParents">Nama orang tua</Label>
              <Input
                id="groomParents"
                value={formData.groomParents || ""}
                onChange={(e) => onChange("groomParents", e.target.value)}
                placeholder="Bpk. H. Ahmad & Ibu Hj. Siti"
              />
            </div>

            <div>
              <Label htmlFor="groomBio">Deskripsi bio (opsional)</Label>
              <Textarea
                id="groomBio"
                value={formData.groomBio ?? ""}
                onChange={(e) => onChange("groomBio", e.target.value)}
                placeholder="Tuliskan bio atau cerita singkat..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="groomPhotoUrl">URL foto potret</Label>
              <Input
                id="groomPhotoUrl"
                value={formData.groomPhotoUrl || ""}
                onChange={(e) => onChange("groomPhotoUrl", e.target.value)}
                placeholder="https://... atau /assets/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900">
              Profil Mempelai Wanita
            </CardTitle>
            <CardDescription>
              Data diri dan informasi keluarga mempelai wanita.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div>
              <Label htmlFor="brideName">Nama lengkap</Label>
              <Input
                id="brideName"
                value={formData.brideName || ""}
                onChange={(e) => onChange("brideName", e.target.value)}
                placeholder="Sinta Maria Utami, S.E"
              />
            </div>

            <div>
              <Label htmlFor="brideChildOrder">Urutan dalam keluarga</Label>
              <Input
                id="brideChildOrder"
                value={formData.brideChildOrder || ""}
                onChange={(e) => onChange("brideChildOrder", e.target.value)}
                placeholder="Putri Kedua"
              />
            </div>

            <div>
              <Label htmlFor="brideParents">Nama orang tua</Label>
              <Input
                id="brideParents"
                value={formData.brideParents || ""}
                onChange={(e) => onChange("brideParents", e.target.value)}
                placeholder="Bpk. H. Bambang & Ibu Hj. Rina"
              />
            </div>

            <div>
              <Label htmlFor="brideBio">Deskripsi bio (opsional)</Label>
              <Textarea
                id="brideBio"
                value={formData.brideBio ?? ""}
                onChange={(e) => onChange("brideBio", e.target.value)}
                placeholder="Tuliskan bio atau cerita singkat..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="bridePhotoUrl">URL foto potret</Label>
              <Input
                id="bridePhotoUrl"
                value={formData.bridePhotoUrl || ""}
                onChange={(e) => onChange("bridePhotoUrl", e.target.value)}
                placeholder="https://... atau /assets/..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
