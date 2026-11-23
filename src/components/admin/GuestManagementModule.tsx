"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  Send,
  UserPlus,
  FileSpreadsheet,
  Download,
  Copy,
  Trash2,
  CheckCircle2,
  Search,
  Check,
  RotateCcw,
  Upload,
  Plus,
  Filter,
} from "lucide-react";
import type { GuestData, WeddingSettingsData } from "@/lib/db/store";
import { validateGuestImport, type GuestValidationResult } from "@/lib/guestValidator";
import { normalizePhoneNumber, formatPhoneDisplay } from "@/lib/phoneUtils";
import {
  downloadExcelTemplate,
  downloadCsvTemplate,
  exportGuestsToExcel,
  exportGuestsToCsv,
} from "@/lib/guestTemplate";
import { formatWaEventDate } from "@/lib/dateFormat";
import {
  generateEncryptedGuestToken,
  generateBulkEncryptedGuestTokens,
} from "@/app/actions/guest-encryption";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { GuestTableDesktop } from "./guests/GuestTableDesktop";
import { GuestCardMobile } from "./guests/GuestCardMobile";
import { GuestBulkActionBar } from "./guests/GuestBulkActionBar";
import { GuestQueueModal } from "./guests/GuestQueueModal";
import { GuestImportModal } from "./guests/GuestImportModal";
import { GuestBulkTextModal } from "./guests/GuestBulkTextModal";

const SHORT_CODE_REGEX = /^[2-9A-HJ-NP-Za-km-z]{6}$/;
const isValidGuestToken = (t?: string | null) => Boolean(t && (SHORT_CODE_REGEX.test(t) || t.startsWith("v1.")));

function parseBulkGuestLines(
  rawText: string
): Array<{ name: string; rawPhone: string; normalizedPhone: string | null }> {
  const lines = rawText.split(/\r?\n/);
  const results: Array<{ name: string; rawPhone: string; normalizedPhone: string | null }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let name = "";
    let rawPhone = "";

    if (trimmed.includes("|")) {
      const parts = trimmed.split("|");
      name = parts[0].trim();
      rawPhone = parts.slice(1).join("|").trim();
    } else if (trimmed.includes(" - ")) {
      const parts = trimmed.split(" - ");
      name = parts[0].trim();
      rawPhone = parts.slice(1).join(" - ").trim();
    } else if (trimmed.includes(",")) {
      const lastCommaIdx = trimmed.lastIndexOf(",");
      const possiblePhone = trimmed.slice(lastCommaIdx + 1).trim();
      const possibleName = trimmed.slice(0, lastCommaIdx).trim();
      if (/\d{7,}/.test(possiblePhone)) {
        name = possibleName;
        rawPhone = possiblePhone;
      } else {
        name = trimmed;
      }
    } else if (trimmed.includes("\t")) {
      const parts = trimmed.split("\t");
      name = parts[0].trim();
      rawPhone = parts.slice(1).join("\t").trim();
    } else {
      const match = trimmed.match(/^(.*?)[,\s]+(08\d{8,12}|628\d{8,12}|\+628\d{8,12})$/);
      if (match) {
        name = match[1].trim();
        rawPhone = match[2].trim();
      } else {
        name = trimmed;
      }
    }

    if (name) {
      const norm = normalizePhoneNumber(rawPhone);
      results.push({
        name,
        rawPhone,
        normalizedPhone: norm || null,
      });
    }
  }

  return results;
}

interface GuestManagementModuleProps {
  guests: GuestData[];
  settings: WeddingSettingsData;
  onGuestsChange: (updated: GuestData[]) => void;
  onSettingsChange: (updated: WeddingSettingsData) => void;
}

export function GuestManagementModule({
  guests,
  settings,
  onGuestsChange,
  onSettingsChange,
}: GuestManagementModuleProps) {
  const [template, setTemplate] = useState(settings.waMessageTemplate);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCategory, setNewCategory] = useState("Reguler");
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [isSavingGuest, setIsSavingGuest] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unsent" | "sent" | "no_phone">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<number>>(new Set());
  const [isBulkOperating, setIsBulkOperating] = useState(false);

  const [guestToDelete, setGuestToDelete] = useState<GuestData | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);
  const [isConfirmingBulkDelete, setIsConfirmingBulkDelete] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [validationResult, setValidationResult] = useState<GuestValidationResult | null>(null);
  const [isStagingModalOpen, setIsStagingModalOpen] = useState(false);
  const [isImportingValid, setIsImportingValid] = useState(false);

  const [isBulkTextModalOpen, setIsBulkTextModalOpen] = useState(false);

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [queueList, setQueueList] = useState<GuestData[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isQueueSending, setIsQueueSending] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const unencrypted = guests.filter((g) => !isValidGuestToken(g.slugQuery));
    if (unencrypted.length === 0) return;

    generateBulkEncryptedGuestTokens(unencrypted.map((g) => g.name))
      .then((map) => {
        onGuestsChange(
          guests.map((g) => {
            if (!isValidGuestToken(g.slugQuery) && map[g.name]) {
              return { ...g, slugQuery: map[g.name] };
            }
            return g;
          })
        );
      })
      .catch(() => {});
  }, [guests, onGuestsChange]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setTimeout(() => {
      setCooldownRemaining((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldownRemaining]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const g of guests) {
      if (g.category) set.add(g.category);
    }
    return Array.from(set);
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (statusFilter === "unsent" && (g.waSentStatus || !g.whatsappNumber)) return false;
      if (statusFilter === "sent" && !g.waSentStatus) return false;
      if (statusFilter === "no_phone" && g.whatsappNumber) return false;

      if (categoryFilter !== "all" && g.category !== categoryFilter) return false;

      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const matchName = g.name.toLowerCase().includes(q);
        const matchPhone = g.whatsappNumber ? g.whatsappNumber.includes(q) : false;
        if (!matchName && !matchPhone) return false;
      }

      return true;
    });
  }, [guests, statusFilter, categoryFilter, debouncedSearch]);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.fauzansinta.my.id";

  const renderMessageForGuest = (guestName: string, guestToken?: string | null) => {
    const token = guestToken || "";
    const link = token ? `${baseUrl}/?kpd=${token}` : baseUrl;
    const mempelai = `${settings.brideName.split(" ")[0]} & ${settings.groomName.split(" ")[0]}`;

    return template
      .replace(/{nama_tamu}/g, guestName)
      .replace(/{nama}/g, guestName)
      .replace(/{link_undangan}/g, link)
      .replace(/{link}/g, link)
      .replace(/{nama_mempelai}/g, mempelai)
      .replace(/{mempelai}/g, mempelai)
      .replace(/{tanggal_acara}/g, formatWaEventDate(settings.weddingDateIso))
      .replace(/{lokasi_acara}/g, `${settings.venueName}, ${settings.venueAddress}`);
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    if (!cleanName || cleanName.length < 2) {
      toast.error("Nama tamu wajib diisi (minimal 2 karakter).");
      return;
    }

    let formattedPhone: string | null = null;
    if (newPhone.trim()) {
      formattedPhone = normalizePhoneNumber(newPhone);
      if (!formattedPhone) {
        toast.error("Nomor WhatsApp tidak valid (harus 10-15 digit angka).");
        return;
      }
    }

    setIsSavingGuest(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          whatsappNumber: formattedPhone,
          category: newCategory.trim() || "Reguler",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menambahkan tamu.");
      }

      const createdGuest: GuestData = data.data;
      onGuestsChange([createdGuest, ...guests]);
      setNewName("");
      setNewPhone("");
      setIsAddingSingle(false);
      toast.success(`Tamu "${createdGuest.name}" berhasil ditambahkan.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menambahkan tamu.");
    } finally {
      setIsSavingGuest(false);
    }
  };

  const handleSendWhatsApp = async (guest: GuestData) => {
    if (!guest.whatsappNumber) {
      toast.error(`Tamu "${guest.name}" tidak memiliki nomor WhatsApp.`);
      return;
    }

    const phone = normalizePhoneNumber(guest.whatsappNumber) || guest.whatsappNumber;

    try {
      let token = guest.slugQuery;
      if (!isValidGuestToken(token)) {
        token = await generateEncryptedGuestToken(guest.name);
      }
      const message = renderMessageForGuest(guest.name, token);
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const waUrl = isMobile
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

      window.open(waUrl, "undangan_wa_sender");

      const nowIso = new Date().toISOString();
      const res = await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: guest.id,
          waSentStatus: true,
          waSentAt: nowIso,
        }),
      });
      if (res.ok) {
        onGuestsChange(
          guests.map((g) =>
            g.id === guest.id ? { ...g, slugQuery: token, waSentStatus: true, waSentAt: nowIso } : g
          )
        );
        toast.success(`Pesan WhatsApp untuk ${guest.name} dibuka.`);
      }
    } catch {
      toast.error("Gagal membuka tautan WhatsApp.");
    }
  };

  const handleCopyLink = async (guest: GuestData) => {
    let token = guest.slugQuery;
    if (!isValidGuestToken(token)) {
      try {
        token = await generateEncryptedGuestToken(guest.name);
      } catch {
        token = guest.slugQuery;
      }
    }
    const link = token ? `${baseUrl}/?kpd=${token}` : baseUrl;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(guest.id);
      toast.success(`Tautan undangan untuk "${guest.name}" disalin.`);
      setTimeout(() => setCopiedId((c) => (c === guest.id ? null : c)), 2000);
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  };

  const handleToggleSentStatus = async (guest: GuestData) => {
    const nextStatus = !guest.waSentStatus;
    const nowIso = nextStatus ? new Date().toISOString() : null;
    try {
      const res = await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: guest.id,
          waSentStatus: nextStatus,
          waSentAt: nowIso,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status");
      onGuestsChange(
        guests.map((g) =>
          g.id === guest.id ? { ...g, waSentStatus: nextStatus, waSentAt: nowIso } : g
        )
      );
      toast.success(
        nextStatus
          ? `Status "${guest.name}" ditandai Terkirim.`
          : `Status "${guest.name}" ditandai Belum dikirim.`
      );
    } catch {
      toast.error("Gagal memperbarui status pengiriman.");
    }
  };

  const confirmDeleteSingle = async () => {
    if (!guestToDelete) return;
    setIsDeletingSingle(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [guestToDelete.id] }),
      });
      if (!res.ok) throw new Error("Gagal menghapus data tamu");
      onGuestsChange(guests.filter((g) => g.id !== guestToDelete.id));
      setSelectedGuestIds((prev) => {
        const next = new Set(prev);
        next.delete(guestToDelete.id);
        return next;
      });
      toast.success(`Tamu "${guestToDelete.name}" berhasil dihapus.`);
      setGuestToDelete(null);
    } catch {
      toast.error("Gagal menghapus data tamu.");
    } finally {
      setIsDeletingSingle(false);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    const allFilteredIds = filteredGuests.map((g) => g.id);
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedGuestIds.has(id));

    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        for (const id of allFilteredIds) next.delete(id);
      } else {
        for (const id of allFilteredIds) next.add(id);
      }
      return next;
    });
  };

  const handleStartQueueSelected = () => {
    const selected = guests.filter((g) => selectedGuestIds.has(g.id));
    const withPhone = selected.filter((g) => g.whatsappNumber);
    if (withPhone.length === 0) {
      toast.error("Tamu terpilih tidak memiliki nomor WhatsApp.");
      return;
    }
    setQueueList(withPhone);
    setCurrentQueueIndex(0);
    setCooldownRemaining(0);
    setIsQueueModalOpen(true);
  };

  const handleStartQueueUnsent = () => {
    const unsent = guests.filter((g) => !g.waSentStatus && g.whatsappNumber);
    if (unsent.length === 0) {
      toast.error("Semua tamu yang memiliki nomor WhatsApp sudah terkirim.");
      return;
    }
    setQueueList(unsent);
    setCurrentQueueIndex(0);
    setCooldownRemaining(0);
    setIsQueueModalOpen(true);
  };

  const handleQueueSendCurrent = async () => {
    if (cooldownRemaining > 0 || isQueueSending) return;
    const currentGuest = queueList[currentQueueIndex];
    if (!currentGuest) return;

    setIsQueueSending(true);
    try {
      let token = currentGuest.slugQuery;
      if (!isValidGuestToken(token)) {
        try {
          token = await generateEncryptedGuestToken(currentGuest.name);
        } catch {
          token = currentGuest.slugQuery;
        }
      }

      const message = renderMessageForGuest(currentGuest.name, token);
      const phone = normalizePhoneNumber(currentGuest.whatsappNumber) || currentGuest.whatsappNumber;
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const waUrl = isMobile
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

      window.open(waUrl, "undangan_wa_sender");

      const nowIso = new Date().toISOString();
      await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentGuest.id,
          waSentStatus: true,
          waSentAt: nowIso,
        }),
      });

      onGuestsChange(
        guests.map((g) =>
          g.id === currentGuest.id ? { ...g, slugQuery: token, waSentStatus: true, waSentAt: nowIso } : g
        )
      );

      toast.success(`Pesan untuk ${currentGuest.name} dibuka.`);

      if (currentQueueIndex + 1 < queueList.length) {
        setCurrentQueueIndex((i) => i + 1);
        setCooldownRemaining(3);
      } else {
        toast.success("Seluruh antrean pengiriman WhatsApp telah selesai.");
        setIsQueueModalOpen(false);
      }
    } catch {
      toast.error("Gagal mengirim pesan pada antrean.");
    } finally {
      setIsQueueSending(false);
    }
  };

  const handleQueueSkipCurrent = () => {
    if (currentQueueIndex + 1 < queueList.length) {
      setCurrentQueueIndex((i) => i + 1);
      setCooldownRemaining(1);
    } else {
      setIsQueueModalOpen(false);
    }
  };

  const handleBulkMarkSent = async (status: boolean) => {
    const ids = Array.from(selectedGuestIds);
    if (ids.length === 0) return;

    setIsBulkOperating(true);
    const nowIso = status ? new Date().toISOString() : null;
    try {
      const res = await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, waSentStatus: status, waSentAt: nowIso }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status");

      const idSet = new Set(ids);
      onGuestsChange(
        guests.map((g) => (idSet.has(g.id) ? { ...g, waSentStatus: status, waSentAt: nowIso } : g))
      );
      toast.success(
        status
          ? `${ids.length} tamu ditandai Terkirim.`
          : `Status ${ids.length} tamu dikembalikan ke Belum dikirim.`
      );
    } catch {
      toast.error("Gagal memperbarui status pengiriman massal.");
    } finally {
      setIsBulkOperating(false);
    }
  };

  const confirmBulkDelete = async () => {
    const ids = Array.from(selectedGuestIds);
    if (ids.length === 0) return;

    setIsBulkOperating(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Gagal menghapus tamu");

      const idSet = new Set(ids);
      onGuestsChange(guests.filter((g) => !idSet.has(g.id)));
      setSelectedGuestIds(new Set());
      setIsConfirmingBulkDelete(false);
      toast.success(`${ids.length} tamu berhasil dihapus dari daftar.`);
    } catch {
      toast.error("Gagal menghapus tamu terpilih.");
    } finally {
      setIsBulkOperating(false);
    }
  };

  const handleBulkCopyLinks = async () => {
    const selected = guests.filter((g) => selectedGuestIds.has(g.id));
    if (selected.length === 0) return;

    const lines = selected.map((g) => {
      const link = g.slugQuery ? `${baseUrl}/?kpd=${g.slugQuery}` : baseUrl;
      return `${g.name}: ${link}`;
    });

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success(`${selected.length} tautan undangan berhasil disalin.`);
    } catch {
      toast.error("Gagal menyalin tautan.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });

        if (rawJson.length === 0) {
          toast.error("Berkas spreadsheet kosong.");
          return;
        }

        const result = validateGuestImport(rawJson, guests);
        setValidationResult(result);
        setIsStagingModalOpen(true);
      } catch {
        toast.error("Gagal membaca berkas Excel/CSV. Periksa kembali format file.");
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmImportValidGuests = async () => {
    if (!validationResult || validationResult.validGuests.length === 0) return;

    setIsImportingValid(true);
    try {
      const res = await fetch("/api/admin/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: validationResult.validGuests }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengimpor data tamu.");
      }

      onGuestsChange(data.data);
      setIsStagingModalOpen(false);
      setValidationResult(null);
      toast.success(`${validationResult.validGuests.length} tamu berhasil diimpor.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengimpor tamu.");
    } finally {
      setIsImportingValid(false);
    }
  };

  const handleImportBulkLines = async (rawText: string, category: string) => {
    const parsed = parseBulkGuestLines(rawText);
    if (parsed.length === 0) {
      toast.error("Tidak ada baris yang valid.");
      return;
    }

    const payloadGuests = parsed.map((item, idx) => ({
      rowNumber: idx + 1,
      name: item.name,
      whatsappNumber: item.normalizedPhone,
      category: category.trim() || "Reguler",
    }));

    const res = await fetch("/api/admin/guests/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guests: payloadGuests }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Gagal menambahkan tamu.");
    }

    onGuestsChange(data.data);
    toast.success(`${payloadGuests.length} tamu berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Daftar Tamu Undangan ({guests.length} Tamu)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Kelola kontak penerima, status pengiriman pesan, dan tautan undangan personal.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddingSingle(!isAddingSingle)}
              >
                <Plus className="h-4 w-4" />
                <span>Tambah tamu</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsBulkTextModalOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                <span>Tambah massal</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                title="Unggah berkas Excel atau CSV"
              >
                <Upload className="h-4 w-4" />
                <span>Impor Excel</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => exportGuestsToExcel(guests, baseUrl)}
                title="Unduh seluruh daftar tamu ke file Excel"
              >
                <Download className="h-4 w-4" />
                <span>Ekspor</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleStartQueueUnsent}
                className="bg-[#6B1222] hover:bg-[#520D1A] font-semibold"
                title="Mulai antrean pengiriman WhatsApp untuk tamu yang belum terkirim"
              >
                <Send className="h-4 w-4" />
                <span>Kirim WA belum terkirim</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isAddingSingle && (
            <form
              onSubmit={handleCreateGuest}
              className="p-4 rounded-xl border border-slate-300 bg-slate-50/50 space-y-3.5 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tambah Tamu Baru
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingSingle(false)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Tutup
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="singleName">Nama tamu *</Label>
                  <Input
                    id="singleName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Bpk. H. Budi Santoso"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="singlePhone">Nomor WhatsApp (opsional)</Label>
                  <Input
                    id="singlePhone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="081234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="singleCategory">Kategori</Label>
                  <Input
                    id="singleCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Keluarga / Rekan / VIP"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingSingle(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSavingGuest}
                  className="bg-[#6B1222] hover:bg-[#520D1A]"
                >
                  Simpan tamu
                </Button>
              </div>
            </form>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau nomor WA..."
                className="pl-9 h-10 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
                {(
                  [
                    { id: "all", label: "Semua" },
                    { id: "unsent", label: "Belum dikirim" },
                    { id: "sent", label: "Terkirim" },
                    { id: "no_phone", label: "Tanpa WA" },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setStatusFilter(pill.id)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      statusFilter === pill.id
                        ? "bg-white text-slate-900 shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {categories.length > 0 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 outline-none focus:border-[#6B1222]"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {filteredGuests.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Tidak ada data tamu yang cocok dengan filter atau pencarian.
            </div>
          ) : (
            <>
              <GuestTableDesktop
                guests={filteredGuests}
                selectedIds={selectedGuestIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onSendWhatsApp={handleSendWhatsApp}
                onCopyLink={handleCopyLink}
                onToggleSentStatus={handleToggleSentStatus}
                onDeleteGuest={(g) => setGuestToDelete(g)}
                copiedId={copiedId}
                baseUrl={baseUrl}
              />

              <GuestCardMobile
                guests={filteredGuests}
                selectedIds={selectedGuestIds}
                onToggleSelect={handleToggleSelect}
                onSendWhatsApp={handleSendWhatsApp}
                onCopyLink={handleCopyLink}
                onToggleSentStatus={handleToggleSentStatus}
                onDeleteGuest={(g) => setGuestToDelete(g)}
                copiedId={copiedId}
                baseUrl={baseUrl}
              />
            </>
          )}
        </CardContent>
      </Card>

      <GuestBulkActionBar
        selectedCount={selectedGuestIds.size}
        onSendQueue={handleStartQueueSelected}
        onMarkSent={handleBulkMarkSent}
        onCopyLinks={handleBulkCopyLinks}
        onDeleteSelected={() => setIsConfirmingBulkDelete(true)}
        onClearSelection={() => setSelectedGuestIds(new Set())}
        isOperating={isBulkOperating}
      />

      <GuestQueueModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
        queueList={queueList}
        currentIndex={currentQueueIndex}
        cooldownRemaining={cooldownRemaining}
        isSending={isQueueSending}
        onSendCurrent={handleQueueSendCurrent}
        onSkipCurrent={handleQueueSkipCurrent}
        renderMessage={renderMessageForGuest}
      />

      <GuestImportModal
        isOpen={isStagingModalOpen}
        onClose={() => setIsStagingModalOpen(false)}
        result={validationResult}
        onConfirmImport={confirmImportValidGuests}
        isImporting={isImportingValid}
      />

      <GuestBulkTextModal
        isOpen={isBulkTextModalOpen}
        onClose={() => setIsBulkTextModalOpen(false)}
        onImportLines={handleImportBulkLines}
      />

      <AlertDialog open={Boolean(guestToDelete)} onOpenChange={(open) => !open && setGuestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data tamu?</AlertDialogTitle>
            <AlertDialogDescription>
              Tamu <strong>{guestToDelete?.name}</strong> akan dihapus permanen dari daftar undangan. Tautan undangan personal terkait tidak dapat diakses lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSingle}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSingle}
              disabled={isDeletingSingle}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeletingSingle ? "Menghapus..." : "Hapus tamu"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isConfirmingBulkDelete} onOpenChange={setIsConfirmingBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedGuestIds.size} tamu terpilih?</AlertDialogTitle>
            <AlertDialogDescription>
              Data seluruh tamu yang dipilih akan dihapus secara permanen dari daftar undangan. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkOperating}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={isBulkOperating}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isBulkOperating ? "Menghapus..." : `Hapus ${selectedGuestIds.size} tamu`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
