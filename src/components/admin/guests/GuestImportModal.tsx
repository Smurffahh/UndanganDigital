"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Upload, X } from "lucide-react";
import type { GuestValidationResult } from "@/lib/guestValidator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GuestImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GuestValidationResult | null;
  onConfirmImport: () => void;
  isImporting: boolean;
}

export function GuestImportModal({
  isOpen,
  onClose,
  result,
  onConfirmImport,
  isImporting,
}: GuestImportModalProps) {
  const [activeTab, setActiveTab] = useState<"valid" | "invalid">("valid");

  if (!isOpen || !result) return null;

  const validCount = result.validGuests.length;
  const invalidCount = result.invalidRows.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            Hasil Validasi Berkas Impor
          </DialogTitle>
          <DialogDescription>
            Tinjau data tamu yang terbaca sebelum dimasukkan ke dalam daftar utama.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("valid")}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                activeTab === "valid"
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Data Valid ({validCount})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Siap dimasukkan ke daftar tamu</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("invalid")}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                activeTab === "invalid"
                  ? "border-rose-500 bg-rose-50/50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold">
                <AlertTriangle className="h-4 w-4" />
                <span>Baris Tidak Valid ({invalidCount})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Dilewati karena format tidak sesuai</p>
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 p-2 space-y-1.5">
            {activeTab === "valid" ? (
              validCount === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  Tidak ada data tamu yang valid dalam berkas.
                </div>
              ) : (
                result.validGuests.map((g, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{g.name}</span>
                      <span className="text-[11px] text-slate-500 ml-2 font-mono">
                        {g.whatsappNumber || "Tanpa nomor"}
                      </span>
                    </div>
                    <Badge variant="outline" size="sm">
                      {g.category || "Reguler"}
                    </Badge>
                  </div>
                ))
              )
            ) : invalidCount === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-700 font-medium">
                Semua baris dalam berkas berhasil divalidasi tanpa kesalahan.
              </div>
            ) : (
              result.invalidRows.map((inv, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 flex items-start justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-rose-900 block">
                      Baris #{inv.rowNumber}: {inv.rawName || "(Kosong)"}
                    </span>
                    <span className="text-[11px] text-rose-700">{inv.reason}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isImporting}
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirmImport}
            disabled={validCount === 0 || isImporting}
            isLoading={isImporting}
            className="bg-[#6B1222] hover:bg-[#520D1A] font-semibold"
          >
            {isImporting ? "Mengimpor..." : `Impor ${validCount} tamu valid`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
