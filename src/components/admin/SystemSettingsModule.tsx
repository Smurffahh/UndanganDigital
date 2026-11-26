"use client";

import { useState } from "react";
import { Heart, Shield, Save, RotateCcw } from "lucide-react";
import type { WeddingSettingsData } from "@/lib/db/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FiturSettingsTab } from "./settings/FiturSettingsTab";
import { AksesAkunTab } from "./settings/AksesAkunTab";

interface SystemSettingsModuleProps {
  formData: WeddingSettingsData;
  onChange: (field: string, value: unknown) => void;
  initialUsers?: any[];
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => Promise<boolean>;
  onDiscard: () => void;
}

export function SystemSettingsModule({
  formData,
  onChange,
  initialUsers = [],
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: SystemSettingsModuleProps) {
  const [subTab, setSubTab] = useState<"fitur" | "akses">("fitur");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form id="system-settings-form" onSubmit={handleSubmit} className="space-y-6">
      <Tabs
        value={subTab}
        onValueChange={(val) => setSubTab(val as "fitur" | "akses")}
        className="w-full"
      >
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <TabsList className="p-1 bg-slate-100 rounded-xl h-auto">
              <TabsTrigger value="fitur" className="min-h-11 px-3.5 gap-1.5 text-xs font-medium">
                <Heart className="h-3.5 w-3.5 shrink-0" />
                <span>Privasi &amp; Fitur</span>
              </TabsTrigger>
              <TabsTrigger value="akses" className="min-h-11 px-3.5 gap-1.5 text-xs font-medium">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>Akses Akun</span>
              </TabsTrigger>
            </TabsList>

            {subTab === "fitur" &&
              (isDirty ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-[11px]">
                  Belum disimpan
                </Badge>
              ) : (
                <Badge variant="success" size="sm" className="text-[11px]">
                  Tersimpan
                </Badge>
              ))}
          </div>

          {subTab === "fitur" ? (
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
                <span>Simpan Pengaturan</span>
              </Button>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Setiap penambahan atau perubahan kata sandi akun langsung tersimpan saat dikonfirmasi.
            </p>
          )}
        </div>

        <TabsContent value="fitur" className="mt-5">
          <FiturSettingsTab formData={formData} onChange={onChange} />
        </TabsContent>

        <TabsContent value="akses" className="mt-5">
          <AksesAkunTab initialUsers={initialUsers} />
        </TabsContent>
      </Tabs>
    </form>
  );
}
