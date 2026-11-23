"use client";

import { Send, Copy, Trash2, Check, Phone } from "lucide-react";
import type { GuestData } from "@/lib/db/store";
import { formatPhoneDisplay } from "@/lib/phoneUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuestCardMobileProps {
  guests: GuestData[];
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onSendWhatsApp: (guest: GuestData) => void;
  onCopyLink: (guest: GuestData) => void;
  onToggleSentStatus: (guest: GuestData) => void;
  onDeleteGuest: (guest: GuestData) => void;
  copiedId: number | null;
  baseUrl: string;
}

export function GuestCardMobile({
  guests,
  selectedIds,
  onToggleSelect,
  onSendWhatsApp,
  onCopyLink,
  onToggleSentStatus,
  onDeleteGuest,
  copiedId,
  baseUrl,
}: GuestCardMobileProps) {
  return (
    <div className="md:hidden space-y-3">
      {guests.map((guest) => {
        const isSelected = selectedIds.has(guest.id);
        const link = guest.slugQuery ? `${baseUrl}/?kpd=${guest.slugQuery}` : baseUrl;
        return (
          <div
            key={guest.id}
            className={`p-3.5 rounded-2xl border transition-colors bg-white ${
              isSelected ? "border-[#6B1222] ring-1 ring-[#6B1222]/20" : "border-slate-200/80 shadow-2xs"
            }`}
          >
            <div className="flex items-start justify-between gap-2.5 mb-2.5">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="pt-0.5">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(guest.id)}
                    aria-label={`Pilih tamu ${guest.name}`}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-slate-900 leading-tight truncate">
                    {guest.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Badge variant="outline" size="sm" className="bg-slate-50">
                      {guest.category || "Reguler"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => onToggleSentStatus(guest)}
                      className="cursor-pointer"
                    >
                      <Badge variant={guest.waSentStatus ? "success" : "outline"} size="sm">
                        {guest.waSentStatus ? "Terkirim" : "Belum dikirim"}
                      </Badge>
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onDeleteGuest(guest)}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                aria-label={`Hapus ${guest.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {guest.whatsappNumber && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 font-mono tabular-nums bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                <span>{formatPhoneDisplay(guest.whatsappNumber)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {guest.whatsappNumber ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onSendWhatsApp(guest)}
                  className="flex-1 min-h-11 text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Kirim WhatsApp</span>
                </Button>
              ) : (
                <div className="flex-1 text-[11px] text-slate-400 italic py-2">
                  Tanpa nomor WhatsApp
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCopyLink(guest)}
                className="min-h-11 px-3 text-xs"
                title="Salin tautan"
              >
                {copiedId === guest.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>Salin link</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
