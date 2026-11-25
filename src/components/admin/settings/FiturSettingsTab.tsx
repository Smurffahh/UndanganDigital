"use client";

import { Heart, MessageSquare, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface FiturSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function FiturSettingsTab({ formData, onChange }: FiturSettingsTabProps) {
  const isLoveStoryEnabled = formData.isLoveStoryEnabled !== false;
  const showPublicPreviewWishes = formData.showPublicPreviewWishes !== false;

  return (
    <div className="space-y-6">
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
              <li><code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800">{"{tanggal_acara}"}</code>: Tanggal pernikahan resmi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
