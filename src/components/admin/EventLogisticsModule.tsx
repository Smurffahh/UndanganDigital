"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar, CreditCard, Save, RotateCcw } from "lucide-react";
import type { WeddingSettingsData } from "@/lib/db/store";
import { normalizeUrlOrPath, isValidUrlOrLocalPath } from "@/lib/urlUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AcaraSettingsTab } from "./settings/AcaraSettingsTab";
import { AmplopSettingsTab } from "./settings/AmplopSettingsTab";

interface EventLogisticsModuleProps {
  formData: WeddingSettingsData;
  onChange: (field: string, value: unknown) => void;
  onUpdateFields: (patch: Partial<WeddingSettingsData>) => void;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => Promise<boolean>;
  onDiscard: () => void;
}

export function EventLogisticsModule({
  formData,
  onChange,
  onUpdateFields,
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: EventLogisticsModuleProps) {
  const [subTab, setSubTab] = useState<"jadwal" | "amplop">("jadwal");
  const [isResolvingMaps, setIsResolvingMaps] = useState(false);

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

    setIsResolvingMaps(true);
    try {
      const res = await fetch(`/api/admin/resolve-maps?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengekstrak koordinat peta.");
      }

      onUpdateFields({
        mapsLatitude: data.data.latitude ?? formData.mapsLatitude,
        mapsLongitude: data.data.longitude ?? formData.mapsLongitude,
        googleMapsEmbed: data.data.embedUrl ?? formData.googleMapsEmbed,
      });

      if (data.data.latitude && data.data.longitude) {
        toast.success(
          `Koordinat ditemukan (${Number(data.data.latitude).toFixed(4)}, ${Number(data.data.longitude).toFixed(4)}).`
        );
      } else {
        toast.success("Tautan peta terpasang.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengekstrak koordinat Google Maps.");
    } finally {
      setIsResolvingMaps(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form id="event-logistics-form" onSubmit={handleSubmit} className="space-y-6">
      <Tabs
        value={subTab}
        onValueChange={(val) => setSubTab(val as "jadwal" | "amplop")}
        className="w-full"
      >
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <TabsList className="p-1 bg-slate-100 rounded-xl h-auto">
              <TabsTrigger value="jadwal" className="min-h-11 px-3.5 gap-1.5 text-xs font-medium">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Jadwal &amp; Lokasi</span>
              </TabsTrigger>
              <TabsTrigger value="amplop" className="min-h-11 px-3.5 gap-1.5 text-xs font-medium">
                <CreditCard className="h-3.5 w-3.5 shrink-0" />
                <span>Amplop Digital</span>
              </TabsTrigger>
            </TabsList>

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
              <span>Simpan Acara &amp; Amplop</span>
            </Button>
          </div>
        </div>

        <TabsContent value="jadwal" className="mt-5">
          <AcaraSettingsTab
            formData={formData}
            onChange={onChange}
            onResolveMaps={handleResolveMaps}
            isResolvingMaps={isResolvingMaps}
          />
        </TabsContent>

        <TabsContent value="amplop" className="mt-5">
          <AmplopSettingsTab formData={formData} onChange={onChange} />
        </TabsContent>
      </Tabs>
    </form>
  );
}
