"use client";

import { Save, RotateCcw } from "lucide-react";
import type { WeddingSettingsData } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MempelaiSettingsTab } from "./settings/MempelaiSettingsTab";

interface CoupleDataModuleProps {
  formData: WeddingSettingsData;
  onChange: (field: string, value: unknown) => void;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => Promise<boolean>;
  onDiscard: () => void;
}

export function CoupleDataModule({
  formData,
  onChange,
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: CoupleDataModuleProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form id="couple-data-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Profil Mempelai Pria &amp; Wanita
            </h2>
            {isDirty ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[11px]">
                Belum disimpan
              </Badge>
            ) : (
              <Badge variant="success" size="sm" className="text-[11px]">
                Tersimpan
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Ubah nama lengkap, urutan anak, nama orang tua, dan kutipan profil. Untuk foto utama atau mode karakter adat, buka Galeri &amp; Media atau Tema &amp; Tampilan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={onDiscard}
              disabled={isSaving}
              className="min-h-11 px-3.5 text-xs font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Batal</span>
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSaving}
            className="min-h-11 px-4 text-xs font-semibold bg-[#6B1222] hover:bg-[#520D1A] text-white active:not-disabled:scale-[0.96] transition-[background-color,transform]"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Data Mempelai</span>
          </Button>
        </div>
      </div>

      <MempelaiSettingsTab formData={formData} onChange={onChange} />
    </form>
  );
}
