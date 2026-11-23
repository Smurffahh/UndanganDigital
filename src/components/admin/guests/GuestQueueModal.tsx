"use client";

import { Send, SkipForward, X, Clock, CheckCircle2 } from "lucide-react";
import type { GuestData } from "@/lib/db/store";
import { formatPhoneDisplay } from "@/lib/phoneUtils";
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

interface GuestQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueList: GuestData[];
  currentIndex: number;
  cooldownRemaining: number;
  isSending: boolean;
  onSendCurrent: () => void;
  onSkipCurrent: () => void;
  renderMessage: (name: string, token?: string | null) => string;
}

export function GuestQueueModal({
  isOpen,
  onClose,
  queueList,
  currentIndex,
  cooldownRemaining,
  isSending,
  onSendCurrent,
  onSkipCurrent,
  renderMessage,
}: GuestQueueModalProps) {
  const currentGuest = queueList[currentIndex];
  const total = queueList.length;
  const progressPct = total > 0 ? Math.round(((currentIndex) / total) * 100) : 0;

  if (!isOpen || !currentGuest) return null;

  const messagePreview = renderMessage(currentGuest.name, currentGuest.slugQuery);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-900">
              Antrean Pengiriman WhatsApp
            </DialogTitle>
            <Badge variant="outline" size="sm" className="font-mono tabular-nums">
              {currentIndex + 1} dari {total}
            </Badge>
          </div>
          <DialogDescription>
            Sistem mengirim pesan satu per satu melalui WhatsApp Web untuk menjaga keamanan akun Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-1">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPct}%` }}
              className="h-full bg-[#6B1222] transition-[width] duration-300"
            />
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">
                {currentGuest.name}
              </span>
              <Badge variant="outline" size="sm">
                {currentGuest.category || "Reguler"}
              </Badge>
            </div>
            <div className="text-xs text-slate-600 font-mono tabular-nums">
              Nomor: <strong>{currentGuest.whatsappNumber ? formatPhoneDisplay(currentGuest.whatsappNumber) : "—"}</strong>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">
              Pratinjau Pesan yang Dikirim:
            </span>
            <div className="p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
              {messagePreview}
            </div>
          </div>

          {cooldownRemaining > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <Clock className="h-4 w-4 shrink-0 text-amber-600 animate-spin" />
              <span>Jeda keamanan anti-spam: tunggu <strong>{cooldownRemaining} detik</strong> sebelum mengirim berikutnya.</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSkipCurrent}
            disabled={isSending}
          >
            <SkipForward className="h-3.5 w-3.5" />
            <span>Lewati tamu ini</span>
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
            >
              Hentikan
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSendCurrent}
              disabled={isSending || cooldownRemaining > 0}
              className="bg-[#6B1222] hover:bg-[#520D1A] font-semibold"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {cooldownRemaining > 0 ? `Tunggu (${cooldownRemaining}s)` : "Kirim WhatsApp"}
              </span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
