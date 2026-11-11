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
} from "lucide-react";
import type { GuestData, WeddingSettingsData } from "@/lib/db/store";
import {
  validateGuestImport,
  type GuestValidationResult,
  normalizePhoneNumber,
} from "@/lib/guestValidator";
import {
  downloadExcelTemplate,
  downloadCsvTemplate,
} from "@/lib/guestTemplate";
import { formatWaEventDate } from "@/lib/dateFormat";
import {
  generateEncryptedGuestToken,
  generateBulkEncryptedGuestTokens,
} from "@/app/actions/guest-encryption";

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
  const [statusFilter, setStatusFilter] = useState<"all" | "unsent" | "sent">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedGuestId, setCopiedGuestId] = useState<number | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const unencrypted = guests.filter((g) => !g.slugQuery || !g.slugQuery.startsWith("v1."));
    if (unencrypted.length === 0) return;

    generateBulkEncryptedGuestTokens(unencrypted.map((g) => g.name))
      .then((map) => {
        onGuestsChange(
          guests.map((g) => {
            if ((!g.slugQuery || !g.slugQuery.startsWith("v1.")) && map[g.name]) {
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

  const renderMessageForGuest = (guestName: string, guestToken?: string | null) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id";
    const token = guestToken || "";
    const link = token ? `${origin}/?to=${token}` : origin;

    return template
      .replace(/{nama_tamu}/g, guestName)
      .replace(/{link_undangan}/g, link)
      .replace(
        /{nama_mempelai}/g,
        `${settings.brideName.split(" ")[0]} & ${settings.groomName.split(" ")[0]}`
      )
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
        if (!token || !token.startsWith("v1.")) {
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
    const waWindow = window.open("about:blank", "_blank");

    try {
      let token = guest.slugQuery;
      if (!token || !token.startsWith("v1.")) {
        token = await generateEncryptedGuestToken(guest.name);
      }
      const message = renderMessageForGuest(guest.name, token);
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      if (waWindow) {
        waWindow.location.href = waUrl;
      } else {
        window.open(waUrl, "_blank");
      }

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
      if (waWindow) waWindow.close();
      toast.error("Gagal membuka tautan WhatsApp.");
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
    if (!token || !token.startsWith("v1.")) {
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
      if (invalidCount > 0) {
        toast.success(
          `Berhasil menyimpan ${json.count} tamu valid! (${invalidCount} baris bermasalah dilewati)`
        );
      } else {
        toast.success(`Seluruh ${json.count} tamu berhasil diimpor ke database! ✓`);
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
        (statusFilter === "unsent" && !g.waSentStatus);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStagingModalOpen) {
        setIsStagingModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStagingModalOpen]);

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
            { tag: "{nama_tamu}", label: "+ Nama Tamu" },
            { tag: "{link_undangan}", label: "+ Link Undangan" },
            { tag: "{nama_mempelai}", label: "+ Nama Mempelai" },
            { tag: "{tanggal_acara}", label: "+ Tanggal Acara" },
            { tag: "{lokasi_acara}", label: "+ Lokasi Acara" },
          ].map((v) => (
            <button
              key={v.tag}
              type="button"
              onClick={() => handleInsertTag(v.tag)}
              className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-medium hover:bg-rose-200 transition-colors cursor-pointer"
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
                {renderMessageForGuest("Bpk. H. Ahmad Fauzi & Keluarga", "v1.contoh-token-enkripsi")}
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
              onClick={downloadExcelTemplate}
              aria-label="Unduh Template Excel resmi .xlsx"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-600/40 bg-emerald-50/80 text-emerald-900 text-xs font-semibold hover:bg-emerald-100/90 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Unduh Template Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={downloadCsvTemplate}
              aria-label="Unduh Contoh CSV resmi .csv"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gold-500/40 bg-cream/70 text-rose-950 text-xs font-semibold hover:bg-rose-100/80 active:scale-[0.96] transition-transform duration-150 ease-out cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Unduh Contoh CSV (.csv)</span>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama, WhatsApp, kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-full border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink focus:outline-none focus:border-rose-500"
                />
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

            <div className="md:hidden space-y-3">
              {filteredGuests.length === 0 ? (
                <div className="py-8 text-center text-muted text-xs bg-surface-white rounded-2xl border border-gold-500/25 p-4">
                  Tidak ada tamu yang cocok dengan filter atau pencarian.
                </div>
              ) : (
                filteredGuests.map((guest) => {
                  const isCopied = copiedGuestId === guest.id;

                  return (
                    <article
                      key={guest.id}
                      className="p-4 rounded-2xl bg-surface-white border border-gold-500/25 shadow-xs space-y-3"
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
                        <div className="shrink-0">
                          {guest.waSentStatus ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Terkirim</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Belum Dikirim</span>
                            </span>
                          )}
                        </div>
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
                          onClick={() => handleCopyMessage(guest)}
                          title="Salin Pesan Pengantar"
                          aria-label={`Salin pesan pengantar untuk ${guest.name}`}
                          className={`min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl border text-xs transition-colors duration-150 active:scale-[0.96] cursor-pointer ${
                            isCopied
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-surface-white text-muted border-gold-500/30 hover:bg-rose-100 hover:text-rose-900"
                          }`}
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <a
                          href={guest.slugQuery ? `/?to=${guest.slugQuery}` : "/"}
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
                      <td colSpan={5} className="py-8 text-center text-muted text-xs">
                        Tidak ada tamu yang cocok dengan filter atau pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => {
                      const isCopied = copiedGuestId === guest.id;

                      return (
                        <tr key={guest.id} className="hover:bg-rose-50/50 transition-colors">
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
                            {guest.waSentStatus ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>Sudah Dikirim</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold border border-amber-300">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Belum Dikirim</span>
                              </span>
                            )}
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
                                onClick={() => handleCopyMessage(guest)}
                                title="Salin Teks Pengantar & Link"
                                aria-label={`Salin pesan pengantar untuk ${guest.name}`}
                                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  isCopied
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : "bg-surface-white text-muted border-gold-500/30 hover:bg-rose-100 hover:text-rose-900"
                                }`}
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <a
                                href={guest.slugQuery ? `/?to=${guest.slugQuery}` : "/"}
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
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3" />
                                  <span>Valid</span>
                                </span>
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
    </div>
  );
}
