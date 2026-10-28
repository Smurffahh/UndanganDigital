"use client";

import { useState, useMemo, useRef } from "react";
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
} from "lucide-react";
import type { GuestData, WeddingSettingsData } from "@/lib/db/store";

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
  // Template state
  const [template, setTemplate] = useState(settings.waMessageTemplate);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // New guest form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCategory, setNewCategory] = useState("Keluarga");
  const [isSavingGuest, setIsSavingGuest] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "unsent">("all");
  const [copiedGuestId, setCopiedGuestId] = useState<number | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // WhatsApp template helper
  const renderMessageForGuest = (guestName: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://undangan.dian-iqbal.com";
    const slug = encodeURIComponent(guestName.trim().replace(/\s+/g, "+"));
    const link = `${origin}/?to=${slug}`;

    return template
      .replace(/{nama_tamu}/g, guestName)
      .replace(/{link_undangan}/g, link)
      .replace(/{nama_mempelai}/g, `${settings.brideName.split(" ")[0]} & ${settings.groomName.split(" ")[0]}`)
      .replace(/{tanggal_acara}/g, "Ahad, 10 Januari 2027")
      .replace(/{lokasi_acara}/g, `${settings.venueName}, ${settings.venueAddress}`);
  };

  // Insert variable tag into template
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

  // Save updated template
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

  // Normalize phone number (08xxx -> 628xxx)
  const normalizePhone = (num: string) => {
    let cleaned = num.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
    else if (cleaned.startsWith("8")) cleaned = "62" + cleaned;
    return cleaned;
  };

  // Create Guest
  const handleCreateGuest = async (autoSendWhatsApp: boolean = false) => {
    if (!newName.trim()) {
      toast.error("Nama tamu wajib diisi");
      return;
    }

    setIsSavingGuest(true);
    try {
      const formattedPhone = newPhone ? normalizePhone(newPhone) : null;
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
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal menambahkan tamu");

      const createdGuest: GuestData = data.data;
      onGuestsChange([createdGuest, ...guests]);
      setNewName("");
      setNewPhone("");
      toast.success(`Tamu "${createdGuest.name}" berhasil ditambahkan ke daftar!`);

      if (autoSendWhatsApp && formattedPhone) {
        handleSendWhatsApp(createdGuest);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan tamu";
      toast.error(msg);
    } finally {
      setIsSavingGuest(false);
    }
  };

  // Send WhatsApp (open wa.me link & update DB status)
  const handleSendWhatsApp = async (guest: GuestData) => {
    if (!guest.whatsappNumber) {
      toast.error(`Tamu "${guest.name}" tidak memiliki nomor WhatsApp.`);
      return;
    }

    const phone = normalizePhone(guest.whatsappNumber);
    const message = renderMessageForGuest(guest.name);
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(waUrl, "_blank");

    // Update guest status to Sent in database
    try {
      const res = await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: guest.id, waSentStatus: true }),
      });
      if (res.ok) {
        onGuestsChange(
          guests.map((g) =>
            g.id === guest.id ? { ...g, waSentStatus: true, waSentAt: new Date().toISOString() } : g
          )
        );
        toast.success(`Undangan WhatsApp untuk ${guest.name} dibuka! Status ditandai Terkirim ✓`);
      }
    } catch {
      // Ignored
    }
  };

  // Copy full message + link for a guest
  const handleCopyMessage = async (guest: GuestData) => {
    const text = renderMessageForGuest(guest.name);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedGuestId(guest.id);
      toast.success(`Pesan pengantar untuk "${guest.name}" berhasil disalin! Siap ditempel ke WhatsApp.`);
      setTimeout(() => setCopiedGuestId((c) => (c === guest.id ? null : c)), 2500);
    } catch {
      toast.error("Gagal menyalin pesan.");
    }
  };

  // Delete guest
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

  // Excel bulk import handler
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          toast.error("File Excel kosong atau tidak terbaca.");
          return;
        }

        const parsedGuests = data.map((row) => ({
          name: row["Nama"] || row["Nama Tamu"] || row["name"] || "",
          whatsappNumber: row["Nomor WA"] || row["WhatsApp"] || row["No WA"] || row["phone"] || null,
          category: row["Kategori"] || row["category"] || "Reguler",
        }));

        const res = await fetch("/api/admin/guests/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guests: parsedGuests }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Gagal mengimpor");

        // Refresh guests from API
        const refreshRes = await fetch("/api/admin/guests");
        const refreshJson = await refreshRes.json();
        if (refreshJson.success) onGuestsChange(refreshJson.data);

        toast.success(`Berhasil mengimpor ${json.count} tamu dari Excel! ✓`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal memproses file Excel";
        toast.error(msg);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  // Download Excel Template
  const handleDownloadTemplate = () => {
    const sampleData = [
      { "Nama Tamu": "Bpk. H. Ahmad Fauzi & Keluarga", "Nomor WA": "081234567890", "Kategori": "Keluarga" },
      { "Nama Tamu": "Ibu Siti Nurhaliza & Suami", "Nomor WA": "081987654321", "Kategori": "VIP" },
      { "Nama Tamu": "Rizky Ramadhan", "Nomor WA": "085678901234", "Kategori": "Sahabat" },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");
    XLSX.writeFile(wb, "template-tamu-undangan.xlsx");
    toast.success("Template Excel berhasil diunduh!");
  };

  // Filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.whatsappNumber && g.whatsappNumber.includes(searchQuery)) ||
        (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "sent" && g.waSentStatus) ||
        (statusFilter === "unsent" && !g.waSentStatus);

      return matchSearch && matchStatus;
    });
  }, [guests, searchQuery, statusFilter]);

  return (
    <div className="space-y-8">
      {/* ============================================================ */}
      {/* 1. Template Pesan Pengantar WhatsApp */}
      {/* ============================================================ */}
      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              Template Pengantar Undangan WhatsApp
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Pesan sopan yang otomatis terisi nama tamu dan tautan unik saat tombol Kirim ditekan.
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

        {/* Variable Insertion Chips */}
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
          {/* Editor Textarea */}
          <div>
            <textarea
              ref={textareaRef}
              rows={8}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-gold-500/35 bg-surface-white text-xs sm:text-sm text-ink font-mono leading-relaxed focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-y"
            />
          </div>

          {/* Live Preview */}
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-[#e7f2ea]/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                Pratinjau Tampilan Pesan di WhatsApp:
              </span>
              <div className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans bg-white p-3.5 rounded-xl border border-emerald-300 shadow-inner">
                {renderMessageForGuest("Bpk. H. Ahmad Fauzi & Keluarga")}
              </div>
            </div>
            <p className="text-[10px] text-muted mt-2">
              *Tautan di atas otomatis membawa nama tamu dan langsung terisi di sampul undangan saat dibuka.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. Form Tambah Tamu & Bulk Import Excel */}
      {/* ============================================================ */}
      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold-600" />
              Tambah Tamu &amp; Impor Excel
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Tambah kontak perorangan atau unggah ratusan nama sekaligus via spreadsheet.
            </p>
          </div>

          {/* Excel Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Template Excel</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel / CSV</span>
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

        {/* Input Form Row */}
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-xs sm:text-sm text-ink focus:outline-none focus:border-rose-500"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-xs sm:text-sm text-ink tabular-nums focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mb-1">
              Kategori:
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gold-500/35 bg-surface-white text-xs sm:text-sm text-ink focus:outline-none focus:border-rose-500"
            >
              <option value="Keluarga">Keluarga</option>
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
      </section>

      {/* ============================================================ */}
      {/* 3. Tabel Daftar Tamu Undangan */}
      {/* ============================================================ */}
      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900">
              Daftar Tamu Undangan ({guests.length} Kontak)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Kirim undangan dalam satu klik atau salin tautan personal untuk tiap tamu.
            </p>
          </div>

          {/* Filter & Search Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama / nomor WA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-cream p-1 rounded-full border border-gold-500/30">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  statusFilter === "all" ? "bg-rose-700 text-white" : "text-muted hover:text-rose-700"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("sent")}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  statusFilter === "sent" ? "bg-emerald-700 text-white" : "text-muted hover:text-emerald-700"
                }`}
              >
                Sudah Dikirim
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("unsent")}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  statusFilter === "unsent" ? "bg-amber-700 text-white" : "text-muted hover:text-amber-700"
                }`}
              >
                Belum
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gold-500/25">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-cream/80 border-b border-gold-500/30 text-rose-900 font-serif font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Tamu</th>
                <th className="py-3 px-4">Nomor WhatsApp</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Status Pengiriman</th>
                <th className="py-3 px-4 text-right">Aksi Distribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/15">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted text-xs">
                    Tidak ada tamu yang sesuai dengan pencarian atau filter.
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
                          {/* 1-Click WhatsApp Button */}
                          {guest.whatsappNumber && (
                            <button
                              type="button"
                              onClick={() => handleSendWhatsApp(guest)}
                              title="Kirim Undangan WhatsApp"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 transition-transform active:scale-[0.96] shadow-xs cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Kirim WA</span>
                            </button>
                          )}

                          {/* Copy Message Button */}
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

                          {/* Preview Link */}
                          <a
                            href={`/?to=${guest.slugQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Undangan Tamu Ini"
                            aria-label={`Buka undangan untuk ${guest.name}`}
                            className="p-1.5 rounded-lg border border-gold-500/30 bg-surface-white text-muted hover:bg-rose-100 hover:text-rose-900 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete Guest */}
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
      </section>
    </div>
  );
}
