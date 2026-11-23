"use client";

import { Send, CheckCheck, Copy, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestBulkActionBarProps {
  selectedCount: number;
  onSendQueue: () => void;
  onMarkSent: (status: boolean) => void;
  onCopyLinks: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  isOperating: boolean;
}

export function GuestBulkActionBar({
  selectedCount,
  onSendQueue,
  onMarkSent,
  onCopyLinks,
  onDeleteSelected,
  onClearSelection,
  isOperating,
}: GuestBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-150">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B1222] text-white text-xs font-bold font-mono tabular-nums">
          {selectedCount}
        </span>
        <span className="text-xs font-semibold text-slate-200">
          tamu terpilih
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          title="Batal pilihan"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          type="button"
          size="sm"
          onClick={onSendQueue}
          disabled={isOperating}
          className="bg-[#6B1222] hover:bg-[#520D1A] text-white text-xs font-semibold"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Kirim WA massal</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onMarkSent(true)}
          disabled={isOperating}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
        >
          <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Tandai terkirim</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onCopyLinks}
          disabled={isOperating}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
          title="Salin semua tautan tamu terpilih"
        >
          <Copy className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Salin link</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onDeleteSelected}
          disabled={isOperating}
          className="text-xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  );
}
