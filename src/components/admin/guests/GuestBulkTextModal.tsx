"use client";

import { useState } from "react";
import { UserPlus, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GuestBulkTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLines: (rawText: string, category: string) => Promise<void>;
}

export function GuestBulkTextModal({
  isOpen,
  onClose,
  onImportLines,
}: GuestBulkTextModalProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Reguler");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const lineCount = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onImportLines(text, category);
      setText("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            Tambah Tamu Massal (Salin &amp; Tempel)
          </DialogTitle>
          <DialogDescription>
            Tempel daftar nama dan nomor WhatsApp dari catatan atau spreadsheet secara cepat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div>
            <Label htmlFor="bulkCategory">Kategori tamu</Label>
            <Input
              id="bulkCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Contoh: Keluarga / Sahabat / Rekan Kerja"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="bulkTextInput">Daftar nama &amp; nomor</Label>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {lineCount} baris terdeteksi
              </span>
            </div>
            <Textarea
              id="bulkTextInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Budi Santoso | 081234567890&#10;Siti Rahmawati, 081398765432&#10;Andi Wijaya"
              className="min-h-[160px] font-mono text-xs"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-[11px] space-y-0.5">
              <p>Format yang didukung per baris:</p>
              <p><code className="font-semibold text-slate-800">Nama | 081234567890</code> atau <code className="font-semibold text-slate-800">Nama, 081234567890</code></p>
              <p>Jika tanpa nomor, cukup tuliskan nama saja.</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={lineCount === 0 || isSubmitting}
              isLoading={isSubmitting}
              className="bg-[#6B1222] hover:bg-[#520D1A] font-semibold"
            >
              {isSubmitting ? "Menambahkan..." : `Tambahkan ${lineCount} tamu`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
