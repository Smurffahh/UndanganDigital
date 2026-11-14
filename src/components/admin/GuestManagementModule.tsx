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
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Check,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  History,
  X,
  ListFilter,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Upload,
  Play,
  SkipForward,
  FileText,
  CornerDownLeft,
  Link as LinkIcon,
  Square,
  CheckSquare,
  Smartphone,
  Laptop,
} from "lucide-react";
import type { GuestData, WeddingSettingsData } from "@/lib/db/store";
import {
  validateGuestImport,
  type GuestValidationResult,
} from "@/lib/guestValidator";
import {
  normalizePhoneNumber,
  isValidPhoneNumber,
  formatPhoneDisplay,
} from "@/lib/phoneUtils";
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
  const [activeViewTab, setActiveViewTab] = useState<"list" | "history">("list");
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const [template, setTemplate] = useState(settings.waMessageTemplate);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCategory, setNewCategory] = useState("Keluarga");
  const [isSavingGuest, setIsSavingGuest] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unsent" | "sent" | "no_phone">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedGuestId, setCopiedGuestId] = useState<number | null>(null);
  const [isBulkOperating, setIsBulkOperating] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
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

  const [historySearchQuery, setHistorySearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [validationResult, setValidationResult] = useState<GuestValidationResult | null>(null);
  const [isStagingModalOpen, setIsStagingModalOpen] = useState(false);
  const [isImportingValid, setIsImportingValid] = useState(false);
  const [stagingActiveTab, setStagingActiveTab] = useState<"valid" | "invalid">("valid");

  const formatSentDate = (dateVal: Date | string | null | undefined) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "—";
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(d);
    } catch {
      return String(dateVal);
    }
  };

  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<number>>(new Set());

  const [isBulkTextModalOpen, setIsBulkTextModalOpen] = useState(false);
  const [bulkTextInput, setBulkTextInput] = useState("");
  const [bulkTextCategory, setBulkTextCategory] = useState("Reguler");
  const [isImportingBulkText, setIsImportingBulkText] = useState(false);

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [queueList, setQueueList] = useState<GuestData[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isQueueSending, setIsQueueSending] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setTimeout(() => {
      setCooldownRemaining((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldownRemaining]);

  const renderMessageForGuest = (guestName: string, guestToken?: string | null) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id";
    const token = guestToken || "";
    const link = token ? `${origin}/?kpd=${token}` : origin;
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

  const handleInsertTag = (tag: string) => {
    const el = textareaRef.current;
    if (!el) {
      setTemplate((prev) => prev + tag);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const nextVal = val.substring(0, start) + tag + val.substring(end);
    setTemplate(nextVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  const handleSaveTemplate = async () => {
    setIsSavingTemplate(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waMessageTemplate: template }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal menyimpan template");

      onSettingsChange({ ...settings, waMessageTemplate: template });
      toast.success("Template pengantar WhatsApp berhasil disimpan! ✓");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan template";
      toast.error(msg);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleCreateGuest = async (autoSendWhatsApp: boolean = false) => {
    if (!newName.trim()) {
      toast.error("Nama tamu wajib diisi (minimal 2 karakter)");
      return;
    }

    let formattedPhone: string | null = null;
    if (newPhone.trim()) {
      formattedPhone = normalizePhoneNumber(newPhone);
      if (!formattedPhone) {
        toast.error("Nomor WhatsApp tidak valid (harus 10-15 digit angka)");
        return;
      }
    }

    let waWindow: Window | null = null;
    if (autoSendWhatsApp && formattedPhone) {
      waWindow = window.open("about:blank", "_blank");
    }

    setIsSavingGuest(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          whatsappNumber: formattedPhone,
          category: newCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (waWindow) waWindow.close();
        throw new Error(data.error || "Gagal menambahkan tamu");
      }

      const createdGuest: GuestData = data.data;
      setNewName("");
      setNewPhone("");
      toast.success(`Tamu "${createdGuest.name}" berhasil ditambahkan ke daftar!`);

      if (autoSendWhatsApp && formattedPhone) {
        let token = createdGuest.slugQuery;
        if (!isValidGuestToken(token)) {
          try {
            token = await generateEncryptedGuestToken(createdGuest.name);
          } catch {
            token = createdGuest.slugQuery;
          }
        }
        const message = renderMessageForGuest(createdGuest.name, token);
        const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        if (waWindow) {
          waWindow.location.href = waUrl;
        } else {
          window.open(waUrl, "_blank");
        }

        const nowIso = new Date().toISOString();
        fetch("/api/admin/guests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: createdGuest.id,
            waSentStatus: true,
            waSentAt: nowIso,
          }),
        }).then(() => {
          onGuestsChange([
            { ...createdGuest, slugQuery: token, waSentStatus: true, waSentAt: nowIso },
            ...guests,
          ]);
        }).catch(() => {
          onGuestsChange([{ ...createdGuest, slugQuery: token }, ...guests]);
        });
      } else {
        onGuestsChange([createdGuest, ...guests]);
      }
    } catch (err: unknown) {
      if (waWindow) waWindow.close();
      const msg = err instanceof Error ? err.message : "Gagal menambahkan tamu";
      toast.error(msg);
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
        toast.success(`Undangan untuk ${guest.name} dibuka di WhatsApp! Tercatat terkirim ✓`);
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
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id";
    const link = token ? `${origin}/?kpd=${token}` : origin;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(guest.id);
      toast.success(`Link undangan untuk "${guest.name}" berhasil disalin!`);
      setTimeout(() => setCopiedLinkId((c) => (c === guest.id ? null : c)), 2500);
    } catch {
      toast.error("Gagal menyalin link.");
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
          ? `Status "${guest.name}" ditandai Terkirim ✓`
          : `Status "${guest.name}" dikembalikan ke Belum Dikirim`
      );
    } catch {
      toast.error("Gagal memperbarui status pengiriman.");
    }
  };

  const handleStartQueueSelected = () => {
    const selected = guests.filter((g) => selectedGuestIds.has(g.id));
    const withPhone = selected.filter((g) => g.whatsappNumber);
    const withoutPhoneCount = selected.length - withPhone.length;
    if (withPhone.length === 0) {
      toast.error("Tamu terpilih tidak memiliki nomor WhatsApp.");
      return;
    }
    if (withoutPhoneCount > 0) {
      toast.info(`${withoutPhoneCount} tamu tanpa nomor WhatsApp dilewati dari antrean.`);
    }
    setQueueList(withPhone);
    setCurrentQueueIndex(0);
    setCooldownRemaining(0);
    setIsQueueModalOpen(true);
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
        body: JSON.stringify({
          ids,
          waSentStatus: status,
          waSentAt: nowIso,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal memperbarui status");

      const idSet = new Set(ids);
      onGuestsChange(
        guests.map((g) =>
          idSet.has(g.id) ? { ...g, waSentStatus: status, waSentAt: nowIso } : g
        )
      );
      toast.success(
        status
          ? `${ids.length} tamu berhasil ditandai Terkirim ✓`
          : `Status ${ids.length} tamu dikembalikan ke Belum Dikirim`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status";
      toast.error(msg);
    } finally {
      setIsBulkOperating(false);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedGuestIds);
    if (ids.length === 0) return;
    if (!confirm(`Hapus permanen ${ids.length} tamu terpilih dari daftar undangan?`)) return;

    setIsBulkOperating(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal menghapus tamu");

      const idSet = new Set(ids);
      onGuestsChange(guests.filter((g) => !idSet.has(g.id)));
      setSelectedGuestIds(new Set());
      toast.success(`${ids.length} tamu berhasil dihapus dari daftar.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus tamu";
      toast.error(msg);
    } finally {
      setIsBulkOperating(false);
    }
  };

  const handleBulkCopyLinks = async () => {
    const selected = guests.filter((g) => selectedGuestIds.has(g.id));
    if (selected.length === 0) return;

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id";

    const lines = selected.map((g) => {
      const link = g.slugQuery ? `${origin}/?kpd=${g.slugQuery}` : origin;
      return `${g.name}: ${link}`;
    });

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success(`${selected.length} link undangan tamu berhasil disalin!`);
    } catch {
      toast.error("Gagal menyalin link.");
    }
  };

  const handleExportSelected = (type: "xlsx" | "csv") => {
    const selected = guests.filter((g) => selectedGuestIds.has(g.id));
    if (selected.length === 0) {
      toast.error("Pilih minimal satu tamu untuk diekspor.");
      return;
    }
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id";

    if (type === "xlsx") {
      exportGuestsToExcel(selected, origin);
      toast.success(`${selected.length} data tamu terpilih berhasil diekspor ke Excel!`);
    } else {
      exportGuestsToCsv(selected, origin);
      toast.success(`${selected.length} data tamu terpilih berhasil diekspor ke CSV!`);
    }
  };

  const handleExportAll = (type: "xlsx" | "csv") => {
    if (guests.length === 0) {
      toast.error("Belum ada data tamu untuk diekspor.");
      return;
    }
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id";

    if (type === "xlsx") {
      exportGuestsToExcel(guests, origin);
      toast.success(`Seluruh ${guests.length} data tamu berhasil diekspor ke Excel!`);
    } else {
      exportGuestsToCsv(guests, origin);
      toast.success(`Seluruh ${guests.length} data tamu berhasil diekspor ke CSV!`);
    }
  };

  const handleStartQueueUnsent = () => {
    const unsent = guests.filter((g) => !g.waSentStatus && g.whatsappNumber);
    if (unsent.length === 0) {
      toast.error("Tidak ada tamu belum dikirim yang memiliki nomor WhatsApp.");
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
      fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentGuest.id,
          waSentStatus: true,
          waSentAt: nowIso,
        }),
      }).then(() => {
        onGuestsChange(
          guests.map((g) =>
            g.id === currentGuest.id
              ? { ...g, slugQuery: token, waSentStatus: true, waSentAt: nowIso }
              : g
          )
        );
      }).catch(() => {});

      setCooldownRemaining(2);
      setCurrentQueueIndex((prev) => prev + 1);
    } catch {
      toast.error("Gagal mengirim pesan WhatsApp.");
    } finally {
      setIsQueueSending(false);
    }
  };

  const handleConfirmBulkTextImport = async () => {
    const parsed = parseBulkGuestLines(bulkTextInput);
    if (parsed.length === 0) {
      toast.error("Tidak ada baris tamu valid untuk disimpan.");
      return;
    }

    setIsImportingBulkText(true);
    try {
      const payload = parsed.map((item) => ({
        name: item.name,
        whatsappNumber: item.normalizedPhone,
        category: bulkTextCategory,
      }));

      const res = await fetch("/api/admin/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: payload }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal mengimpor tamu");

      const refreshRes = await fetch("/api/admin/guests");
      const refreshJson = await refreshRes.json();
      if (refreshJson.success) onGuestsChange(refreshJson.data);

      toast.success(`${data.count || parsed.length} tamu berhasil disimpan ke database! ✓`);
      setBulkTextInput("");
      setIsBulkTextModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor tamu";
      toast.error(msg);
    } finally {
      setIsImportingBulkText(false);
    }
  };

  const handleRevertSentStatus = async (guest: GuestData) => {
    if (!confirm(`Kembalikan tamu "${guest.name}" ke antrean Belum Dikirim?`)) return;

    try {
      const res = await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: guest.id,
          waSentStatus: false,
          waSentAt: null,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengembalikan status");

      onGuestsChange(
        guests.map((g) =>
          g.id === guest.id ? { ...g, waSentStatus: false, waSentAt: null } : g
        )
      );
      toast.success(`Status ${guest.name} berhasil dikembalikan ke Belum Dikirim.`);
    } catch {
      toast.error("Gagal memperbarui status pengiriman.");
    }
  };

  const handleCopyMessage = async (guest: GuestData) => {
    let token = guest.slugQuery;
    if (!isValidGuestToken(token)) {
      try {
        token = await generateEncryptedGuestToken(guest.name);
      } catch {
        token = guest.slugQuery;
      }
    }
    const text = renderMessageForGuest(guest.name, token);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedGuestId(guest.id);
      toast.success(`Pesan pengantar untuk "${guest.name}" berhasil disalin! Siap ditempel ke WhatsApp.`);
      setTimeout(() => setCopiedGuestId((c) => (c === guest.id ? null : c)), 2500);
    } catch {
      toast.error("Gagal menyalin pesan.");
    }
  };

  const handleDeleteGuest = async (id: number, name: string) => {
    if (!confirm(`Hapus tamu "${name}" dari daftar undangan?`)) return;

    try {
      const res = await fetch(`/api/admin/guests?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");

      onGuestsChange(guests.filter((g) => g.id !== id));
      toast.success(`Tamu "${name}" berhasil dihapus.`);
    } catch {
      toast.error("Gagal menghapus tamu.");
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawRows: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawRows || rawRows.length === 0) {
          toast.error("File Excel / CSV kosong atau tidak terbaca.");
          return;
        }

        const result = validateGuestImport(rawRows, guests);
        setValidationResult(result);
        setStagingActiveTab(result.validGuests.length > 0 ? "valid" : "invalid");
        setIsStagingModalOpen(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal memproses berkas Excel / CSV";
        toast.error(msg);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const handleConfirmSaveValidGuests = async () => {
    if (!validationResult || validationResult.validGuests.length === 0) return;

    setIsImportingValid(true);
    try {
      const payload = validationResult.validGuests.map((v) => ({
        name: v.name,
        whatsappNumber: v.whatsappNumber,
        category: v.category,
      }));

      const res = await fetch("/api/admin/guests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: payload }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal mengimpor data valid");

      const refreshRes = await fetch("/api/admin/guests");
      const refreshJson = await refreshRes.json();
      if (refreshJson.success) onGuestsChange(refreshJson.data);

      const invalidCount = validationResult.invalidRows.length;
      const countMsg = `${json.count} tamu berhasil disimpan (${json.withPhone || 0} dengan WA, ${json.noPhone || 0} tanpa WA)`;
      if (invalidCount > 0) {
        toast.success(
          `${countMsg}! (${invalidCount} baris bermasalah dilewati)`
        );
      } else {
        toast.success(`${countMsg}! ✓`);
      }

      setIsStagingModalOpen(false);
      setValidationResult(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan tamu valid";
      toast.error(msg);
    } finally {
      setIsImportingValid(false);
    }
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.whatsappNumber && g.whatsappNumber.includes(q)) ||
        (g.category && g.category.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "sent" && g.waSentStatus) ||
        (statusFilter === "unsent" && !g.waSentStatus) ||
        (statusFilter === "no_phone" && !g.whatsappNumber);

      const matchCategory = categoryFilter === "all" || g.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [guests, debouncedSearch, statusFilter, categoryFilter]);

  const sentHistoryGuests = useMemo(() => {
    return guests
      .filter((g) => g.waSentStatus)
      .sort((a, b) => {
        const timeA = a.waSentAt ? new Date(a.waSentAt).getTime() : 0;
        const timeB = b.waSentAt ? new Date(b.waSentAt).getTime() : 0;
        return timeB - timeA;
      })
      .filter((g) => {
        if (!historySearchQuery.trim()) return true;
        const q = historySearchQuery.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          (g.whatsappNumber && g.whatsappNumber.includes(q)) ||
          (g.category && g.category.toLowerCase().includes(q))
        );
      });
  }, [guests, historySearchQuery]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [guests]);

  const unsentWithPhoneCount = useMemo(() => {
    return guests.filter((g) => !g.waSentStatus && g.whatsappNumber).length;
  }, [guests]);

  const noPhoneCount = useMemo(() => {
    return guests.filter((g) => !g.whatsappNumber).length;
  }, [guests]);

  const parsedBulkGuests = useMemo(() => {
    return parseBulkGuestLines(bulkTextInput);
  }, [bulkTextInput]);

  const isAllSelected = useMemo(() => {
    if (filteredGuests.length === 0) return false;
    return filteredGuests.every((g) => selectedGuestIds.has(g.id));
  }, [filteredGuests, selectedGuestIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedGuestIds(new Set());
    } else {
      setSelectedGuestIds(new Set(filteredGuests.map((g) => g.id)));
    }
  };

  const toggleSelectGuest = (id: number) => {
    setSelectedGuestIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!isQueueModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        cooldownRemaining === 0 &&
        !isQueueSending &&
        currentQueueIndex < queueList.length
      ) {
        e.preventDefault();
        handleQueueSendCurrent();
      } else if (e.key === "Escape") {
        setIsQueueModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQueueModalOpen, cooldownRemaining, isQueueSending, currentQueueIndex, queueList]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStagingModalOpen) {
        setIsStagingModalOpen(false);
      } else if (e.key === "Escape" && isBulkTextModalOpen) {
        setIsBulkTextModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStagingModalOpen, isBulkTextModalOpen]);

  const sentCount = guests.filter((g) => g.waSentStatus).length;
  const unsentCount = guests.length - sentCount;

  return (
    <div className="space-y-8">
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#f0f8f3] to-teal-50 border border-emerald-500/30 text-ink shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
              <span>Keamanan Distribusi Undangan WhatsApp</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                Anti-Blokir
              </span>
            </h3>
            <p className="text-xs text-emerald-900/85 mt-1 leading-relaxed">
              Kirim undangan satu per satu secara berkala untuk menjaga nomor WhatsApp Anda tetap
              aman dari risiko pembatasan atau pemblokiran otomatis oleh sistem anti-spam WhatsApp.
              Setiap kali tombol <strong>Kirim WA</strong> ditekan, status tamu akan otomatis tercatat
              ke riwayat terkirim beserta waktu pengirimannya.
            </p>
          </div>
        </div>
      </div>

      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              Template Pengantar Undangan WhatsApp
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Pesan personalisasi yang otomatis memuat nama tamu dan tautan unik saat tombol Kirim ditekan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={isSavingTemplate}
            className="px-5 py-2 rounded-full bg-rose-700 text-white text-xs font-bold tracking-wider hover:bg-rose-800 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSavingTemplate ? "Menyimpan..." : "Simpan Perubahan Template"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[11px] font-semibold text-gold-600 mr-1 uppercase tracking-wider">
            Variabel Otomatis:
          </span>
          {[
            { tag: "{nama}", label: "+ {nama}" },
            { tag: "{link}", label: "+ {link}" },
            { tag: "{mempelai}", label: "+ {mempelai}" },
            { tag: "{tanggal_acara}", label: "+ {tanggal_acara}" },
            { tag: "{lokasi_acara}", label: "+ {lokasi_acara}" },
          ].map((v) => (
            <button
              key={v.tag}
              type="button"
              onClick={() => handleInsertTag(v.tag)}
              className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-mono font-medium hover:bg-rose-200 transition-colors cursor-pointer"
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <textarea
              ref={textareaRef}
              rows={8}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink font-mono leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-y"
            />
          </div>

          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-[#e7f2ea]/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                Pratinjau Tampilan Pesan di WhatsApp:
              </span>
              <div className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans bg-white p-3.5 rounded-xl border border-emerald-300 shadow-inner">
                {renderMessageForGuest("Bpk. H. Ahmad Fauzi & Keluarga", "K9mP4x")}
              </div>
            </div>
            <p className="text-[10px] text-muted mt-2">
              *Tautan di atas otomatis membawa nama tamu dan langsung terisi di sampul undangan saat dibuka.
            </p>
          </div>
        </div>
      </section>

      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gold-500/20">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold-600" />
              <span>Kelola Kontak Tamu &amp; Impor Berkas</span>
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Tambah kontak perorangan atau gunakan berkas spreadsheet resmi dengan validasi pra-simpan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleExportAll("xlsx")}
              aria-label="Ekspor seluruh daftar tamu ke berkas Excel resmi .xlsx"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-600/40 bg-emerald-50/80 text-emerald-900 text-xs font-semibold hover:bg-emerald-100/90 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportAll("csv")}
              aria-label="Ekspor seluruh daftar tamu ke berkas CSV resmi .csv"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-cream/70 text-rose-950 text-xs font-semibold hover:bg-rose-100/80 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Ekspor CSV (.csv)</span>
            </button>

            <button
              type="button"
              onClick={downloadExcelTemplate}
              aria-label="Unduh Template Excel resmi .xlsx"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-surface-white text-rose-950 text-xs font-semibold hover:bg-rose-50 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Unduh Template (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={downloadCsvTemplate}
              aria-label="Unduh Contoh CSV resmi .csv"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-surface-white text-rose-950 text-xs font-semibold hover:bg-rose-50 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Unduh Template (.csv)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkTextModalOpen(true)}
              aria-label="Tambah tamu massal dari teks"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-950 text-xs font-semibold hover:bg-rose-100 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-rose-700 shrink-0" />
              <span>+ Tambah Massal (Teks)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Unggah berkas Excel atau CSV untuk diimpor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 text-white text-xs font-bold tracking-wider hover:brightness-110 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Berkas (Excel / CSV)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-b from-[#fbf8f5] to-cream/40 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setIsGuideOpen((prev) => !prev)}
            aria-expanded={isGuideOpen}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-rose-50/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-700 grid place-items-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-rose-950 flex items-center gap-2">
                  <span>Panduan Format Berkas &amp; Pengisian Nomor WhatsApp</span>
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-[10px] font-bold text-gold-800 uppercase tracking-wider">
                    Anti-Gagal
                  </span>
                </h3>
                <p className="text-[11px] text-muted">
                  Pelajari aturan 3 kolom, format nomor yang diterima, dan solusi angka 0 terpotong di Excel.
                </p>
              </div>
            </div>

            <div className="p-1 rounded-md text-muted hover:text-rose-900 transition-colors">
              {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isGuideOpen && (
            <div className="p-4 sm:p-5 pt-1 space-y-4 border-t border-gold-500/20 text-xs text-ink">
              <div>
                <div className="font-semibold text-rose-900 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold grid place-items-center">
                    1
                  </span>
                  <span>Struktur 3 Kolom Utama (Wajib Sesuai Baris Header):</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2">
                  <div className="p-3 rounded-xl bg-white border border-gold-500/25 shadow-2xs">
                    <span className="font-mono font-bold text-[11px] text-rose-800 block mb-0.5">
                      Nama_Tamu <span className="text-rose-600 font-sans text-[10px]">(Wajib)</span>
                    </span>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Nama lengkap atau instansi tamu, minimal 2 karakter. Contoh: <em>Bpk. H. Budi Santoso &amp; Keluarga</em>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gold-500/25 shadow-2xs">
                    <span className="font-mono font-bold text-[11px] text-rose-800 block mb-0.5">
                      Nomor_WhatsApp <span className="text-rose-600 font-sans text-[10px]">(Wajib)</span>
                    </span>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Nomor WhatsApp aktif penerima undangan (10–15 digit angka). Boleh diawali <code>08...</code>, <code>628...</code>, atau <code>+628...</code>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gold-500/25 shadow-2xs">
                    <span className="font-mono font-bold text-[11px] text-rose-800 block mb-0.5">
                      Kategori <span className="text-muted font-sans text-[10px]">(Opsional)</span>
                    </span>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Kelompok relasi (misal: <em>Keluarga Fauzan</em>, <em>Keluarga Sinta</em>, <em>VIP</em>, <em>Sahabat</em>). Default: <em>Reguler</em>.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-rose-900 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold grid place-items-center">
                    2
                  </span>
                  <span>Perbandingan Format Nomor WhatsApp:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-2xs space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-900 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Format Diterima (✓ Valid)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-emerald-950 font-mono">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">081234567890</strong> — Format nasional umum
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">6281234567890</strong> — Format internasional resmi
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">+62 812-3456-7890</strong> — Spasi &amp; strip dibersihkan otomatis
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">81234567890</strong> — Angka 0 terpotong Excel otomatis dilengkapi ke 628...
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-300 shadow-2xs space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-900 text-xs">
                      <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      <span>Format Ditolak (✕ Tidak Valid)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-950 font-mono">
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">081234</strong> — Terlalu pendek (minimal 10 digit)
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">0812345678901234</strong> — Terlalu panjang (&gt; 15 digit)
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">0812-budi-ok</strong> — Mengandung huruf / karakter palsu
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-700 font-bold shrink-0">•</span>
                        <span>
                          <strong className="tabular-nums">021-7654321</strong> — Nomor rumah (PSTN) bukan WhatsApp
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300/80 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-950 leading-relaxed">
                  <strong>Tips Microsoft Excel:</strong> Gunakan tombol <strong>Unduh Template Excel (.xlsx)</strong> di atas karena seluruh kolom nomor telepon sudah kami kunci format <em>Teks (@)</em>. Jika Anda mengetik di lembar Excel baru, awali nomor telepon dengan tanda petik tunggal (contoh: <code>&apos;081234567890</code>) agar Excel tidak otomatis menghapus angka nol di depan.
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-2.5 flex items-center gap-1.5">
            <span>Atau Tambahkan Tamu Manual:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 rounded-2xl bg-cream/50 border border-gold-500/20">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mb-1">
                Nama Tamu / Gelar:
              </label>
              <input
                type="text"
                placeholder="Contoh: Bpk. H. Ahmad Fauzi &amp; Keluarga"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mb-1">
                Nomor WhatsApp:
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="081234567890 (atau 628...)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink tabular-nums focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mb-1">
                Kategori:
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
              >
                <option value="Keluarga Fauzan">Keluarga Fauzan</option>
                <option value="Keluarga Sinta">Keluarga Sinta</option>
                <option value="VIP">VIP</option>
                <option value="Sahabat">Sahabat</option>
                <option value="Teman Kantor">Teman Kantor</option>
                <option value="Tetangga">Tetangga</option>
                <option value="Reguler">Reguler</option>
              </select>
            </div>

            <div className="sm:col-span-12 flex flex-wrap gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsBulkTextModalOpen(true)}
                className="px-4 py-2 rounded-full border border-gold-600/40 text-rose-950 bg-cream/70 text-xs font-semibold hover:bg-rose-100 cursor-pointer flex items-center gap-1.5 active:scale-[0.96] transition-transform duration-150"
              >
                <FileText className="w-3.5 h-3.5 text-gold-600" />
                <span>+ Tambah Massal (Teks)</span>
              </button>
              <button
                type="button"
                onClick={() => handleCreateGuest(false)}
                disabled={isSavingGuest}
                className="px-5 py-2 rounded-full border border-gold-600/50 text-gold-600 bg-surface-white text-xs font-semibold hover:bg-rose-100 cursor-pointer disabled:opacity-50"
              >
                + Simpan ke Daftar
              </button>
              <button
                type="button"
                onClick={() => handleCreateGuest(true)}
                disabled={isSavingGuest || !newPhone}
                className="px-5 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold tracking-wider hover:bg-emerald-800 cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan &amp; Langsung Kirim WA</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gold-500/20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveViewTab("list")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeViewTab === "list"
                  ? "bg-rose-800 text-white shadow-xs"
                  : "bg-cream text-muted hover:text-rose-900 border border-gold-500/25"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Daftar Undangan ({guests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewTab("history")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeViewTab === "history"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-cream text-muted hover:text-emerald-900 border border-gold-500/25"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat Terkirim ({sentCount})</span>
            </button>
          </div>

          <div className="text-[11px] text-muted flex items-center gap-3">
            <span>
              Belum Dikirim: <strong className="text-amber-700">{unsentCount}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Sudah Terkirim: <strong className="text-emerald-700">{sentCount}</strong>
            </span>
          </div>
        </div>

        {activeViewTab === "list" && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari nama, WhatsApp, kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStartQueueUnsent}
                  disabled={unsentWithPhoneCount === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.96] transition-transform duration-150"
                  title="Mulai antrean pengiriman pesan WhatsApp untuk seluruh tamu yang belum dikirimi undangan"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Kirim Massal Belum Terkirim ({unsentWithPhoneCount})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-cream p-1 rounded-full border border-gold-500/30">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      statusFilter === "all" ? "bg-rose-700 text-white" : "text-muted hover:text-rose-700"
                    }`}
                  >
                    Semua ({guests.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("unsent")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      statusFilter === "unsent"
                        ? "bg-amber-700 text-white"
                        : "text-muted hover:text-amber-700"
                    }`}
                  >
                    Belum Dikirim ({unsentCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("sent")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      statusFilter === "sent"
                        ? "bg-emerald-700 text-white"
                        : "text-muted hover:text-emerald-700"
                    }`}
                  >
                    Sudah Terkirim ({sentCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("no_phone")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      statusFilter === "no_phone"
                        ? "bg-slate-700 text-white"
                        : "text-muted hover:text-slate-700"
                    }`}
                  >
                    Belum Ada WA ({noPhoneCount})
                  </button>
                </div>

                {availableCategories.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-full border border-gold-500/35 bg-surface-white text-base sm:text-[11px] text-ink focus:outline-none focus:border-rose-500"
                  >
                    <option value="all">Semua Kategori</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {selectedGuestIds.size > 0 && (
              <div className="sticky top-3 z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-300 text-rose-950 text-xs shadow-md animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 font-semibold text-rose-900">
                  <CheckSquare className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{selectedGuestIds.size} Tamu Terpilih</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartQueueSelected}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 active:scale-[0.96] transition-transform duration-150 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim WA Massal ({selectedGuestIds.size})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBulkMarkSent(true)}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-600/40 bg-emerald-50 text-emerald-900 font-semibold text-xs hover:bg-emerald-100 active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tandai Terkirim</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBulkMarkSent(false)}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-50 text-amber-900 font-semibold text-xs hover:bg-amber-100 active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                    <span>Reset Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkCopyLinks}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gold-500/40 bg-cream/70 text-rose-950 font-semibold text-xs hover:bg-rose-100 active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50"
                  >
                    <Copy className="w-3.5 h-3.5 text-gold-600" />
                    <span>Salin Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportSelected("xlsx")}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-600/40 bg-white text-emerald-900 font-semibold text-xs hover:bg-emerald-50 active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50"
                    title="Ekspor tamu terpilih ke Excel (.xlsx)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Ekspor .xlsx</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportSelected("csv")}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gold-500/40 bg-white text-rose-950 font-semibold text-xs hover:bg-cream active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50"
                    title="Ekspor tamu terpilih ke CSV (.csv)"
                  >
                    <Download className="w-3.5 h-3.5 text-gold-600" />
                    <span>Ekspor .csv</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={isBulkOperating}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 bg-rose-100 text-rose-900 font-semibold text-xs hover:bg-rose-200 active:scale-[0.96] transition-transform duration-150 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                    <span>Hapus Terpilih</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGuestIds(new Set())}
                    className="px-3 py-2 rounded-xl border border-rose-300 bg-white text-rose-800 hover:bg-rose-50 text-xs font-medium cursor-pointer"
                  >
                    Batal Pilih
                  </button>
                </div>
              </div>
            )}

            <div className="md:hidden space-y-3">
              {filteredGuests.length > 0 && (
                <div className="flex items-center justify-between px-2 py-1 text-xs text-muted">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-gold-500/50 text-rose-700 focus:ring-rose-500 cursor-pointer w-4 h-4"
                    />
                    <span>Pilih Semua Tamu ({filteredGuests.length})</span>
                  </label>
                </div>
              )}

              {filteredGuests.length === 0 ? (
                <div className="py-8 text-center text-muted text-xs bg-surface-white rounded-2xl border border-gold-500/25 p-4">
                  Tidak ada tamu yang cocok dengan filter atau pencarian.
                </div>
              ) : (
                filteredGuests.map((guest) => {
                  const isCopiedMsg = copiedGuestId === guest.id;
                  const isCopiedLnk = copiedLinkId === guest.id;

                  return (
                    <article
                      key={guest.id}
                      className={`p-4 rounded-2xl bg-surface-white border transition-colors shadow-xs space-y-3 ${
                        selectedGuestIds.has(guest.id)
                          ? "border-rose-400 bg-rose-50/40"
                          : "border-gold-500/25"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedGuestIds.has(guest.id)}
                            onChange={() => toggleSelectGuest(guest.id)}
                            aria-label={`Pilih ${guest.name}`}
                            className="mt-1 rounded border-gold-500/50 text-rose-700 focus:ring-rose-500 cursor-pointer w-4 h-4 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-base text-[#4b3a3e] break-words leading-snug">
                              {guest.name}
                            </h4>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-cream border border-gold-500/30 text-[10px] font-medium text-gold-700">
                              {guest.category || "Reguler"}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleSentStatus(guest)}
                          title="Klik untuk mengubah status pengiriman"
                          className="shrink-0 cursor-pointer active:scale-[0.96] transition-transform duration-150"
                        >
                          {guest.waSentStatus ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300 hover:bg-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Terkirim</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-300 hover:bg-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Belum Dikirim</span>
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[#8d757c] tabular-nums font-mono">
                        <span>WhatsApp:</span>
                        <strong className="text-[#4b3a3e] font-semibold">
                          {guest.whatsappNumber ? `+${guest.whatsappNumber}` : "— (Belum diisi)"}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-gold-500/15">
                        {guest.whatsappNumber ? (
                          <button
                            type="button"
                            onClick={() => handleSendWhatsApp(guest)}
                            className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs active:scale-[0.96] transition-transform duration-150 cursor-pointer shadow-xs"
                          >
                            <Send className="w-4 h-4 stroke-[2]" />
                            <span>{guest.waSentStatus ? "Kirim Ulang" : "Kirim ke WhatsApp"}</span>
                          </button>
                        ) : (
                          <div className="flex-1 min-h-11 inline-flex items-center justify-center px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium">
                            Nomor Tidak Tersedia
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopyLink(guest)}
                          title="Salin Link Undangan (?kpd=...)"
                          aria-label={`Salin link undangan untuk ${guest.name}`}
                          className={`min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl border text-xs transition-colors duration-150 active:scale-[0.96] cursor-pointer ${
                            isCopiedLnk
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-surface-white text-muted border-gold-500/30 hover:bg-rose-100 hover:text-rose-900"
                          }`}
                        >
                          {isCopiedLnk ? <Check className="w-4 h-4 text-emerald-700" /> : <LinkIcon className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyMessage(guest)}
                          title="Salin Pesan Pengantar"
                          aria-label={`Salin pesan pengantar untuk ${guest.name}`}
                          className={`min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl border text-xs transition-colors duration-150 active:scale-[0.96] cursor-pointer ${
                            isCopiedMsg
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-surface-white text-muted border-gold-500/30 hover:bg-rose-100 hover:text-rose-900"
                          }`}
                        >
                          {isCopiedMsg ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <a
                          href={guest.slugQuery ? `/?kpd=${guest.slugQuery}` : "/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka Undangan Tamu Ini"
                          aria-label={`Buka undangan untuk ${guest.name}`}
                          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl border border-gold-500/30 bg-surface-white text-muted hover:bg-rose-100 hover:text-rose-900 active:scale-[0.96] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(guest.id, guest.name)}
                          title="Hapus Tamu"
                          aria-label={`Hapus ${guest.name} dari daftar`}
                          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-600 hover:text-white active:scale-[0.96] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gold-500/25">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-cream/80 border-b border-gold-500/30 text-rose-900 font-serif font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        aria-label="Pilih semua tamu"
                        className="rounded border-gold-500/50 text-rose-700 focus:ring-rose-500 cursor-pointer w-4 h-4"
                      />
                    </th>
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">Nomor WhatsApp</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Distribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/15">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted text-xs">
                        Tidak ada tamu yang cocok dengan filter atau pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => {
                      const isCopiedMsg = copiedGuestId === guest.id;
                      const isCopiedLnk = copiedLinkId === guest.id;
                      const isSelected = selectedGuestIds.has(guest.id);

                      return (
                        <tr
                          key={guest.id}
                          className={`hover:bg-rose-50/50 transition-colors ${
                            isSelected ? "bg-rose-50/60" : ""
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectGuest(guest.id)}
                              aria-label={`Pilih ${guest.name}`}
                              className="rounded border-gold-500/50 text-rose-700 focus:ring-rose-500 cursor-pointer w-4 h-4"
                            />
                          </td>

                          <td className="py-3 px-4 font-medium text-rose-900 break-words">
                            {guest.name}
                          </td>

                          <td className="py-3 px-4 text-muted tabular-nums">
                            {guest.whatsappNumber ? `+${guest.whatsappNumber}` : "—"}
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-cream border border-gold-500/30 text-[10px] font-medium text-gold-700">
                              {guest.category || "Reguler"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleSentStatus(guest)}
                              title="Klik untuk mengubah status pengiriman"
                              className="cursor-pointer active:scale-[0.96] transition-transform duration-150"
                            >
                              {guest.waSentStatus ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300 hover:bg-emerald-200">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Sudah Dikirim</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-300 hover:bg-amber-200">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Belum Dikirim</span>
                                </span>
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {guest.whatsappNumber && (
                                <button
                                  type="button"
                                  onClick={() => handleSendWhatsApp(guest)}
                                  title="Kirim Undangan ke WhatsApp"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 transition-transform active:scale-[0.96] shadow-xs cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>{guest.waSentStatus ? "Kirim Ulang" : "Kirim WA"}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleCopyLink(guest)}
                                title="Salin Link Undangan (?kpd=...)"
                                aria-label={`Salin link undangan untuk ${guest.name}`}
                                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  isCopiedLnk
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : "bg-surface-white text-muted border-gold-500/30 hover:bg-rose-100 hover:text-rose-900"
                                }`}
                              >
                                {isCopiedLnk ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <LinkIcon className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyMessage(guest)}
                                title="Salin Teks Pengantar & Link"
                                aria-label={`Salin pesan pengantar untuk ${guest.name}`}
                                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  isCopiedMsg
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : "bg-surface-white text-muted border-gold-500/30 hover:bg-rose-100 hover:text-rose-900"
                                }`}
                              >
                                {isCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <a
                                href={guest.slugQuery ? `/?kpd=${guest.slugQuery}` : "/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Buka Undangan Tamu Ini"
                                aria-label={`Buka undangan untuk ${guest.name}`}
                                className="p-1.5 rounded-lg border border-gold-500/30 bg-surface-white text-muted hover:bg-rose-100 hover:text-rose-900 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                title="Hapus Tamu"
                                aria-label={`Hapus ${guest.name} dari daftar`}
                                className="p-1.5 rounded-lg border border-gold-500/30 bg-surface-white text-rose-600 hover:bg-rose-700 hover:text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeViewTab === "history" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-sm text-emerald-950 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-700" />
                  Riwayat Tamu yang Telah Dikirimi Undangan ({sentHistoryGuests.length})
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Daftar di bawah diurutkan dari yang paling baru dikirimkan. Anda dapat mengirim ulang atau mengembalikan tamu ke status belum dikirim jika diperlukan.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari riwayat terkirim..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-full border border-emerald-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="md:hidden space-y-3">
              {sentHistoryGuests.length === 0 ? (
                <div className="py-8 text-center text-muted text-xs bg-surface-white rounded-2xl border border-emerald-500/25 p-4">
                  Belum ada undangan yang tercatat dikirim. Silakan kirim undangan melalui tab Daftar Undangan.
                </div>
              ) : (
                sentHistoryGuests.map((guest) => (
                  <article
                    key={guest.id}
                    className="p-4 rounded-2xl bg-surface-white border border-emerald-500/25 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-base text-[#4b3a3e] break-words leading-snug">
                          {guest.name}
                        </h4>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-cream border border-gold-500/30 text-[10px] font-medium text-gold-700">
                          {guest.category || "Reguler"}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300 shrink-0">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>✓ Terkirim</span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-[#8d757c]">
                      <div className="flex items-center gap-2">
                        <span>WhatsApp:</span>
                        <strong className="text-[#4b3a3e] font-semibold tabular-nums font-mono">
                          {guest.whatsappNumber ? `+${guest.whatsappNumber}` : "—"}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Waktu Kirim:</span>
                        <span className="text-[#4b3a3e] tabular-nums font-mono text-[11px]">
                          {formatSentDate(guest.waSentAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-emerald-500/15">
                      {guest.whatsappNumber ? (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(guest)}
                          className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs active:scale-[0.96] transition-transform duration-150 cursor-pointer shadow-xs"
                        >
                          <Send className="w-4 h-4 stroke-[2]" />
                          <span>Kirim Ulang WA</span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => handleRevertSentStatus(guest)}
                        title="Kembalikan ke Status Belum Dikirim"
                        className="min-h-11 px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-600/40 text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-medium active:scale-[0.96] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                        <span>Kembalikan</span>
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-emerald-500/25">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#e7f2ea]/70 border-b border-emerald-500/30 text-emerald-950 font-serif font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">Nomor WhatsApp</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Waktu Terkirim</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/15">
                  {sentHistoryGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted text-xs">
                        Belum ada undangan yang tercatat dikirim. Silakan kirim undangan melalui tab Daftar Undangan.
                      </td>
                    </tr>
                  ) : (
                    sentHistoryGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-emerald-950 break-words">
                          {guest.name}
                        </td>

                        <td className="py-3 px-4 text-muted tabular-nums">
                          {guest.whatsappNumber ? `+${guest.whatsappNumber}` : "—"}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-cream border border-gold-500/30 text-[10px] font-medium text-gold-700">
                            {guest.category || "Reguler"}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-muted tabular-nums">
                          {formatSentDate(guest.waSentAt)}
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Terkirim ✓</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {guest.whatsappNumber && (
                              <button
                                type="button"
                                onClick={() => handleSendWhatsApp(guest)}
                                title="Kirim Ulang Undangan ke WhatsApp"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-medium hover:bg-emerald-800 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>Kirim Ulang</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRevertSentStatus(guest)}
                              title="Kembalikan ke Status Belum Dikirim"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-600/40 text-amber-800 bg-amber-50 hover:bg-amber-100 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                              <span>Kembalikan ke Belum Dikirim</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {isStagingModalOpen && validationResult && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="staging-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-3xl max-h-[90vh] bg-surface-white rounded-3xl border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 border-b border-gold-500/20 bg-cream/50 flex items-start justify-between gap-4">
              <div>
                <h3
                  id="staging-modal-title"
                  className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-5 h-5 text-gold-600" />
                  <span>Verifikasi Data Impor Tamu (Pre-Insert)</span>
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Pemeriksaan integritas berkas selesai. Tinjau baris yang valid sebelum dimasukkan ke database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsStagingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-rose-100 text-muted hover:text-rose-900 cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 sm:px-6 py-3 bg-surface-white border-b border-gold-500/15 flex flex-wrap items-center gap-3">
              <div className="text-xs text-muted">
                Total Baris Dibaca: <strong>{validationResult.totalRows}</strong>
              </div>
              <div className="h-4 w-[1px] bg-gold-500/30 hidden sm:block" />

              <button
                type="button"
                onClick={() => setStagingActiveTab("valid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  stagingActiveTab === "valid"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{validationResult.validGuests.length} Kontak Valid (Siap Disimpan)</span>
              </button>

              {validationResult.invalidRows.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStagingActiveTab("invalid")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    stagingActiveTab === "invalid"
                      ? "bg-rose-700 text-white shadow-xs"
                      : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{validationResult.invalidRows.length} Baris Bermasalah (Dilewati)</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {stagingActiveTab === "valid" && (
                <div>
                  <div className="text-xs text-muted mb-2">
                    Berikut daftar nama dan nomor WhatsApp yang telah lolos validasi format dan verifikasi duplikat:
                  </div>

                  {validationResult.validGuests.length === 0 ? (
                    <div className="py-8 text-center text-rose-800 text-xs bg-rose-50 rounded-2xl border border-rose-200">
                      Tidak ada data yang valid untuk disimpan dari berkas ini. Silakan periksa tab Baris Bermasalah.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gold-500/25">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-cream/80 border-b border-gold-500/25 text-rose-900 font-semibold text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 w-16">Baris</th>
                            <th className="py-2.5 px-3">Nama Tamu</th>
                            <th className="py-2.5 px-3">Nomor WhatsApp</th>
                            <th className="py-2.5 px-3">Kategori</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-500/15">
                          {validationResult.validGuests.map((v) => (
                            <tr key={v.rowNumber} className="hover:bg-cream/40">
                              <td className="py-2.5 px-3 font-mono text-muted tabular-nums">
                                #{v.rowNumber}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-rose-900">{v.name}</td>
                              <td className="py-2.5 px-3 font-mono text-muted tabular-nums">
                                {v.whatsappNumber ? `+${v.whatsappNumber}` : "—"}
                              </td>
                              <td className="py-2.5 px-3">{v.category}</td>
                              <td className="py-2.5 px-3 text-right">
                                {v.isUpdate ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200" title="Nama tamu sudah ada di database, kontak/kategori akan diperbarui tanpa merusak link undangan">
                                    <Check className="w-3 h-3 text-blue-700" />
                                    <span>Perbarui Data</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    <Check className="w-3 h-3" />
                                    <span>Tamu Baru</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {stagingActiveTab === "invalid" && (
                <div>
                  <div className="text-xs text-muted mb-2">
                    Baris di bawah ini mengandung kesalahan format atau duplikasi dan akan otomatis dilewati saat disimpan:
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-rose-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-rose-50 border-b border-rose-200 text-rose-900 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3 w-16">Baris</th>
                          <th className="py-2.5 px-3">Data Asal (Nama)</th>
                          <th className="py-2.5 px-3">Data Asal (WA)</th>
                          <th className="py-2.5 px-3">Alasan Masalah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100">
                        {validationResult.invalidRows.map((inv) => (
                          <tr key={inv.rowNumber} className="hover:bg-rose-50/50">
                            <td className="py-2.5 px-3 font-mono text-rose-800 font-bold tabular-nums">
                              #{inv.rowNumber}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-ink">{inv.rawName}</td>
                            <td className="py-2.5 px-3 font-mono text-muted tabular-nums">
                              {inv.rawPhone}
                            </td>
                            <td className="py-2.5 px-3 text-rose-700 font-medium flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                              <span>{inv.reason}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-gold-500/20 bg-cream/40 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsStagingModalOpen(false)}
                className="px-4 py-2 rounded-full border border-gold-500/40 bg-surface-white text-xs font-semibold text-muted hover:text-ink hover:bg-rose-50 cursor-pointer"
              >
                Batal / Perbaiki Berkas
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmSaveValidGuests}
                  disabled={isImportingValid || validationResult.validGuests.length === 0}
                  className="px-6 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold tracking-wider hover:bg-emerald-800 cursor-pointer disabled:opacity-50 shadow-sm flex items-center gap-1.5"
                >
                  {isImportingValid ? (
                    <span>Menyimpan ke Database...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Simpan {validationResult.validGuests.length} Tamu Valid ke Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBulkTextModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-text-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-2xl max-h-[90vh] bg-surface-white rounded-3xl border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 border-b border-gold-500/20 bg-cream/50 flex items-start justify-between gap-4">
              <div>
                <h3
                  id="bulk-text-modal-title"
                  className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5 text-gold-600" />
                  <span>Tambah Tamu Massal (Teks)</span>
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Tempelkan daftar tamu banyak baris sekaligus. Format yang didukung: <code>Nama | 08123...</code>, <code>Nama - 08123...</code>, atau nama saja.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkTextModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-rose-100 text-muted hover:text-rose-900 cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1.5">
                  Kategori untuk Tamu yang Diimpor:
                </label>
                <select
                  value={bulkTextCategory}
                  onChange={(e) => setBulkTextCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500"
                >
                  <option value="Keluarga Fauzan">Keluarga Fauzan</option>
                  <option value="Keluarga Sinta">Keluarga Sinta</option>
                  <option value="VIP">VIP</option>
                  <option value="Sahabat">Sahabat</option>
                  <option value="Teman Kantor">Teman Kantor</option>
                  <option value="Tetangga">Tetangga</option>
                  <option value="Reguler">Reguler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1.5">
                  Daftar Tamu (Satu Tamu Per Baris):
                </label>
                <textarea
                  rows={7}
                  value={bulkTextInput}
                  onChange={(e) => setBulkTextInput(e.target.value)}
                  placeholder={"Contoh:\nBpk. H. Joko Widodo | 081234567890\nIbu Hj. Siti Aminah - 081398765432\nDr. Hendra, 081287654321\nKeluarga Besar Bpk. Rahmat"}
                  className="w-full p-3.5 rounded-2xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink font-mono leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-y"
                />
              </div>

              {parsedBulkGuests.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      Pratinjau Hasil Pembacaan: <strong>{parsedBulkGuests.length} baris</strong>
                    </span>
                    <span>
                      Nomor WA Valid: <strong className="text-emerald-700">{parsedBulkGuests.filter((g) => g.normalizedPhone).length}</strong>
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto rounded-xl border border-gold-500/25">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-cream/80 border-b border-gold-500/25 text-rose-900 font-semibold text-[11px] sticky top-0">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Nama Tamu</th>
                          <th className="py-2 px-3">Nomor WhatsApp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-500/15">
                        {parsedBulkGuests.map((g, idx) => (
                          <tr key={idx} className="hover:bg-cream/40">
                            <td className="py-2 px-3 font-mono text-muted tabular-nums">#{idx + 1}</td>
                            <td className="py-2 px-3 font-medium text-rose-900">{g.name}</td>
                            <td className="py-2 px-3 font-mono tabular-nums">
                              {g.normalizedPhone ? (
                                <span className="text-emerald-800 font-semibold">+{g.normalizedPhone}</span>
                              ) : (
                                <span className="text-slate-400">Tanpa nomor WA</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-gold-500/20 bg-cream/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsBulkTextModalOpen(false)}
                className="px-4 py-2 rounded-full border border-gold-500/40 bg-surface-white text-xs font-semibold text-muted hover:text-ink hover:bg-rose-50 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmBulkTextImport}
                disabled={isImportingBulkText || parsedBulkGuests.length === 0}
                className="px-6 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold tracking-wider hover:bg-emerald-800 cursor-pointer disabled:opacity-50 shadow-sm flex items-center gap-1.5 active:scale-[0.96] transition-transform duration-150"
              >
                {isImportingBulkText ? (
                  <span>Menyimpan ke Database...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Simpan {parsedBulkGuests.length} Tamu ke Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isQueueModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="queue-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-xl bg-surface-white rounded-3xl border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 border-b border-gold-500/20 bg-cream/50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    id="queue-modal-title"
                    className="font-serif font-bold text-xl text-rose-900"
                  >
                    Antrean Kirim WhatsApp Web
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                    {typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                      <>
                        <Smartphone className="w-3 h-3" />
                        <span>Mode Mobile</span>
                      </>
                    ) : (
                      <>
                        <Laptop className="w-3 h-3" />
                        <span>Mode WhatsApp Web</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">
                  Target tab tunggal (<code>undangan_wa_sender</code>) &mdash; browser hanya memperbarui 1 tab.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQueueModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-rose-100 text-muted hover:text-rose-900 cursor-pointer"
                aria-label="Tutup antrean"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 sm:px-6 py-3 bg-cream/30 border-b border-gold-500/15 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-950">
                  {currentQueueIndex < queueList.length
                    ? `Tamu ke-${currentQueueIndex + 1} dari ${queueList.length}`
                    : `Selesai (${queueList.length} dari ${queueList.length} tamu)`}
                </span>
                <span className="text-muted tabular-nums font-mono text-[11px]">
                  {Math.round((Math.min(currentQueueIndex, queueList.length) / (queueList.length || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream border border-gold-500/20 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-[width] duration-300 ease-out"
                  style={{
                    width: `${Math.round((Math.min(currentQueueIndex, queueList.length) / (queueList.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              {currentQueueIndex < queueList.length ? (
                (() => {
                  const currentGuest = queueList[currentQueueIndex];
                  const token = currentGuest.slugQuery;
                  const message = renderMessageForGuest(currentGuest.name, token);
                  const phone = normalizePhoneNumber(currentGuest.whatsappNumber) || currentGuest.whatsappNumber;

                  return (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-cream/50 border border-gold-500/25 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 block mb-0.5">
                            Penerima Undangan:
                          </span>
                          <h4 className="font-serif font-bold text-lg text-rose-950 break-words">
                            {currentGuest.name}
                          </h4>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white border border-gold-500/30 text-[10px] font-medium text-gold-800">
                            {currentGuest.category || "Reguler"}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
                            Nomor WhatsApp:
                          </span>
                          <span className="font-mono text-sm font-bold text-emerald-800 tabular-nums">
                            +{phone}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-rose-900">
                            Pratinjau Pesan yang Akan Dikirim:
                          </span>
                          <span className="text-[10px] text-muted font-mono">
                            Link: ?kpd={token || "..."}
                          </span>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-3.5 rounded-2xl bg-white border border-gold-500/30 text-xs text-ink whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                          {message}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto grid place-items-center">
                    <CheckCircle2 className="w-8 h-8 stroke-[2]" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-emerald-950">
                    Pengiriman Antrean Selesai!
                  </h4>
                  <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                    Seluruh <strong>{queueList.length} tamu</strong> dalam antrean ini telah selesai diproses. Status masing-masing tamu telah tercatat di riwayat terkirim.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-gold-500/20 bg-cream/40 flex items-center justify-between gap-3">
              {currentQueueIndex < queueList.length ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQueueModalOpen(false)}
                      className="px-3.5 py-2 rounded-full border border-rose-300 text-rose-800 bg-white hover:bg-rose-50 text-xs font-medium cursor-pointer"
                    >
                      Hentikan Antrean
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentQueueIndex((prev) => prev + 1)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-gold-500/40 text-rose-950 bg-white hover:bg-cream text-xs font-medium cursor-pointer"
                    >
                      <SkipForward className="w-3.5 h-3.5 text-gold-600" />
                      <span>Lewati Tamu Ini</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleQueueSendCurrent}
                    disabled={cooldownRemaining > 0 || isQueueSending}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 disabled:opacity-60 shadow-md cursor-pointer active:scale-[0.96] transition-transform duration-150"
                  >
                    {cooldownRemaining > 0 ? (
                      <span>Menunggu Jeda Aman ({cooldownRemaining}s)...</span>
                    ) : isQueueSending ? (
                      <span>Membuka WhatsApp...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>Kirim Sekarang &amp; Lanjut</span>
                        <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-emerald-900/60 text-[10px] font-mono border border-emerald-500/40">
                          Enter ↵
                        </kbd>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsQueueModalOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 cursor-pointer shadow-xs"
                  >
                    Tutup Antrean
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
