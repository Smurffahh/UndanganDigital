"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MempelaiSettingsTabProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function MempelaiSettingsTab({ formData, onChange }: MempelaiSettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#6B1222]" />
              <CardTitle className="text-base font-bold text-slate-900">
                Profil Mempelai Pria
              </CardTitle>
            </div>
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
