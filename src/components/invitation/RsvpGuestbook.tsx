"use client";

import { useState, useMemo } from "react";
import { SongketRibbon } from "./Ornaments";
import { toast } from "sonner";
import { MessageSquare, Send, Search, Users, CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";

interface WishItem {
  id: number;
  guestName: string;
  attendanceStatus: string;
  paxCount: number | null;
  message: string;
  createdAt: Date | string;
}

interface RsvpGuestbookProps {
  initialWishes: WishItem[];
  defaultGuestName?: string;
}

export function RsvpGuestbook({ initialWishes, defaultGuestName = "" }: RsvpGuestbookProps) {
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [nama, setNama] = useState(defaultGuestName);
  const [hadir, setHadir] = useState<"Hadir" | "Berhalangan" | "Masih Ragu">("Hadir");
  const [jumlah, setJumlah] = useState("1");
  const [pesan, setPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter state
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      toast.error("Mohon isi nama Anda terlebih dahulu.");
      return;
    }
    if (!pesan.trim()) {
      toast.error("Tuliskan ucapan & doa terbaik Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nama.trim(),
          attend: hadir,
          guests: parseInt(jumlah, 10),
          message: pesan.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengirim ucapan");
      }

      setWishes((prev) => [json.data, ...prev]);
      setPesan("");
      toast.success("Terima kasih atas doa & konfirmasi kehadiran Anda 🤍");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal mengirim ucapan";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status badge styling helper
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Hadir":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Berhalangan":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Hadir":
        return <CheckCircle2 className="w-3 h-3 text-emerald-600 inline mr-1" />;
      case "Berhalangan":
        return <XCircle className="w-3 h-3 text-rose-600 inline mr-1" />;
      default:
        return <HelpCircle className="w-3 h-3 text-amber-600 inline mr-1" />;
    }
  };

  // Filtered wishes
  const filteredWishes = useMemo(() => {
    return wishes.filter((item) => {
      const matchesFilter = filterStatus === "Semua" || item.attendanceStatus === filterStatus;
      const matchesSearch =
        item.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [wishes, filterStatus, searchQuery]);

  // Counts for pills
  const counts = useMemo(() => {
    return {
      Semua: wishes.length,
      Hadir: wishes.filter((w) => w.attendanceStatus === "Hadir").length,
      Berhalangan: wishes.filter((w) => w.attendanceStatus === "Berhalangan").length,
      "Masih Ragu": wishes.filter((w) => w.attendanceStatus === "Masih Ragu").length,
    };
  }, [wishes]);

  return (
    <section id="rsvp" className="py-20 relative bg-gradient-to-b from-rose-100/0 via-rose-100/50 to-rose-100/0" aria-label="Konfirmasi Kehadiran dan Buku Tamu">
      <div className="w-[min(100%-2.75rem,560px)] mx-auto">
        <header className="text-center mb-9">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-600 mb-2 font-medium">
            RSVP &amp; Prayers
          </p>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-rose-900 leading-tight">
            Konfirmasi &amp; Ucapan
          </h2>
          <SongketRibbon />
          <p className="text-xs sm:text-sm text-muted max-w-[400px] mx-auto mt-3">
            Mohon konfirmasi kehadiran Anda dan tinggalkan doa terbaik untuk kedua mempelai.
          </p>
        </header>

        {/* RSVP Form Card */}
        <form
          onSubmit={handleSubmit}
          className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-6 sm:p-7 space-y-4"
        >
          {/* Field: Nama */}
          <div>
            <label htmlFor="f-nama" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 mb-1.5">
              Nama Anda
            </label>
            <input
              id="f-nama"
              type="text"
              required
              aria-required="true"
              maxLength={60}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Bpk. Budi Santoso"
              className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white text-base sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Row: Kehadiran & Jumlah Tamu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="f-hadir" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 mb-1.5">
                Konfirmasi Kehadiran
              </label>
              <select
                id="f-hadir"
                value={hadir}
                onChange={(e) => setHadir(e.target.value as "Hadir" | "Berhalangan" | "Masih Ragu")}
                className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow] cursor-pointer"
              >
                <option value="Hadir">Hadir</option>
                <option value="Berhalangan">Berhalangan</option>
                <option value="Masih Ragu">Masih Ragu</option>
              </select>
            </div>

            <div>
              <label htmlFor="f-jumlah" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 mb-1.5">
                Jumlah Tamu
              </label>
              <select
                id="f-jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white text-base sm:text-sm text-ink focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow] cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Orang
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field: Ucapan & Doa */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="f-pesan" className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600">
                Ucapan &amp; Doa Restu
              </label>
              <span className="text-[10px] text-muted tabular-nums">
                {pesan.length}/500
              </span>
            </div>
            <textarea
              id="f-pesan"
              required
              aria-required="true"
              rows={4}
              maxLength={500}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
              className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white text-base sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow] resize-y min-h-[96px]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b98a35] via-[#e9d3a3] to-[#c9a24b] text-[#443114] text-xs font-bold tracking-[0.2em] uppercase shadow-[0_14px_30px_-10px_rgba(169,130,58,0.55)] transition-transform duration-150 active:scale-[0.96] hover:brightness-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 stroke-[1.8]" />
                <span>Kirim Ucapan</span>
              </>
            )}
          </button>
        </form>

        {/* Section: Daftar Ucapan & Doa */}
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-serif font-semibold text-xl text-rose-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold-600" />
              Doa &amp; Harapan <span className="text-gold-600 italic text-base">({wishes.length})</span>
            </h3>

            {/* Live Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari doa pengirim..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full border border-gold-500/35 bg-surface-white text-xs text-ink placeholder:text-muted focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Filter Status Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(["Semua", "Hadir", "Berhalangan", "Masih Ragu"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-rose-700 text-white shadow-xs"
                    : "bg-surface-white text-muted border border-gold-500/30 hover:bg-rose-100"
                }`}
              >
                {st} <span className="tabular-nums text-[10px] ml-1 opacity-80">({counts[st]})</span>
              </button>
            ))}
          </div>

          {/* Wishes Scrollable Container */}
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {filteredWishes.length === 0 ? (
              <div className="text-center py-8 bg-surface-white rounded-2xl border border-gold-500/20 text-muted text-xs">
                Belum ada ucapan yang sesuai filter pencarian.
              </div>
            ) : (
              filteredWishes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 bg-surface-white border border-gold-500/25 rounded-2xl p-4 shadow-xs"
                >
                  {/* Initial Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white font-serif font-bold text-base grid place-items-center shrink-0 shadow-xs">
                    {(item.guestName || "?").trim().charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-xs sm:text-sm text-rose-900 break-words">
                          {item.guestName}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                            item.attendanceStatus
                          )}`}
                        >
                          {getStatusIcon(item.attendanceStatus)}
                          {item.attendanceStatus}
                        </span>
                      </div>

                      <span className="text-[10px] text-muted tabular-nums">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {item.paxCount && item.paxCount > 0 && (
                      <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-gold-600" />
                        {item.paxCount} Tamu
                      </p>
                    )}

                    <p className="mt-2 text-xs sm:text-sm text-ink font-light leading-relaxed break-words">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
