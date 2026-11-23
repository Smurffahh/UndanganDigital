"use client";

import { Send, Copy, Trash2, ExternalLink, Check, CheckCircle2 } from "lucide-react";
import type { GuestData } from "@/lib/db/store";
import { formatPhoneDisplay } from "@/lib/phoneUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuestTableDesktopProps {
  guests: GuestData[];
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSendWhatsApp: (guest: GuestData) => void;
  onCopyLink: (guest: GuestData) => void;
  onToggleSentStatus: (guest: GuestData) => void;
  onDeleteGuest: (guest: GuestData) => void;
  copiedId: number | null;
  baseUrl: string;
  showOwnerBadge?: boolean;
}

export function GuestTableDesktop({
  guests,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSendWhatsApp,
  onCopyLink,
  onToggleSentStatus,
  onDeleteGuest,
  copiedId,
  baseUrl,
  showOwnerBadge = false,
}: GuestTableDesktopProps) {
  const isAllSelected = guests.length > 0 && guests.every((g) => selectedIds.has(g.id));
  const isSomeSelected = guests.some((g) => selectedIds.has(g.id)) && !isAllSelected;

  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="p-3.5 w-10 text-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onToggleSelectAll}
                aria-label="Pilih semua tamu di daftar"
              />
            </th>
            <th className="p-3.5">Nama Tamu</th>
            <th className="p-3.5">Kategori</th>
            <th className="p-3.5">Nomor WhatsApp</th>
            <th className="p-3.5">Tautan Undangan</th>
            <th className="p-3.5">Status Kirim</th>
            <th className="p-3.5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {guests.map((guest) => {
            const isSelected = selectedIds.has(guest.id);
            const link = guest.slugQuery ? `${baseUrl}/?kpd=${guest.slugQuery}` : baseUrl;
            return (
              <tr
                key={guest.id}
                className={`transition-colors hover:bg-slate-50/70 ${
                  isSelected ? "bg-slate-50" : ""
                }`}
              >
                <td className="p-3.5 text-center">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(guest.id)}
                    aria-label={`Pilih tamu ${guest.name}`}
                  />
                </td>
                <td className="p-3.5 font-semibold text-slate-900">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{guest.name}</span>
                    {showOwnerBadge && (
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 rounded-md font-medium ${
                          guest.ownerScope === "parent"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {guest.ownerScope === "parent" ? "Orang Tua" : "Mempelai"}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-3.5">
                  <Badge variant="outline" size="sm" className="bg-slate-50">
                    {guest.category || "Reguler"}
                  </Badge>
                </td>
                <td className="p-3.5 font-mono tabular-nums text-slate-700">
                  {guest.whatsappNumber ? formatPhoneDisplay(guest.whatsappNumber) : "—"}
                </td>
                <td className="p-3.5 max-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-slate-500 font-mono text-[11px]" title={link}>
                      {guest.slugQuery ? `?kpd=${guest.slugQuery}` : "link default"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopyLink(guest)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Salin tautan"
                    >
                      {copiedId === guest.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="p-3.5">
                  <button
                    type="button"
                    onClick={() => onToggleSentStatus(guest)}
                    className="cursor-pointer"
                    title="Klik untuk ubah status"
                  >
                    <Badge variant={guest.waSentStatus ? "success" : "outline"} size="sm">
                      {guest.waSentStatus ? "Terkirim" : "Belum dikirim"}
                    </Badge>
                  </button>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {guest.whatsappNumber && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => onSendWhatsApp(guest)}
                        className="text-[#6B1222] hover:bg-[#6B1222]/10 h-8 px-2.5 text-xs font-semibold"
                        title="Buka WhatsApp Web dan kirim pesan"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Kirim WA</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onDeleteGuest(guest)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Hapus tamu"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
