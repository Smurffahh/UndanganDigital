"use client";

import { useState, useMemo, type FormEvent } from "react";
import { WayangDivider } from "./Ornaments";
import { Send, CheckCircle2, XCircle, HelpCircle, MessageSquare, Users, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScrollLinkedItem } from "./ScrollLinkedItem";

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

  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      toast.error("Nama wajib diisi.");
      return;
    }
    if (!pesan.trim()) {
      toast.error("Pesan dan doa wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: nama.trim(),
          attendanceStatus: hadir,
          paxCount: hadir === "Hadir" ? parseInt(jumlah, 10) : 0,
          message: pesan.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengirim RSVP");
      }

      const newWish: WishItem = {
        id: json.data?.id || Date.now(),
        guestName: nama.trim(),
        attendanceStatus: hadir,
        paxCount: hadir === "Hadir" ? parseInt(jumlah, 10) : null,
        message: pesan.trim(),
        createdAt: new Date().toISOString(),
      };

      setWishes((prev) => [newWish, ...prev]);
      setPesan("");
      toast.success("Terima kasih atas doa & konfirmasi kehadiran Anda! 🤍");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />;
      case "Berhalangan":
        return <XCircle className="w-3.5 h-3.5 text-rose-600 inline mr-1" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />;
    }
  };

  const filteredWishes = useMemo(() => {
    return wishes.filter((item) => {
      const matchesFilter = filterStatus === "Semua" || item.attendanceStatus === filterStatus;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [wishes, filterStatus, searchQuery]);

  const counts = useMemo(() => {
    return {
      Semua: wishes.length,
      Hadir: wishes.filter((w) => w.attendanceStatus === "Hadir").length,
      Berhalangan: wishes.filter((w) => w.attendanceStatus === "Berhalangan").length,
      "Masih Ragu": wishes.filter((w) => w.attendanceStatus === "Masih Ragu").length,
    };
  }, [wishes]);

  return (
    <section id="rsvp" className="py-20 relative bg-transparent" aria-label="Konfirmasi Kehadiran dan Buku Tamu">
      <div className="w-[min(100%-2.75rem,560px)] mx-auto">
        <header className="text-center mb-10">
          <ScrollLinkedItem offsetY={36}>
            <p className="typo-eyebrow text-[#a9823a] mb-2">
              RSVP &amp; Prayers
            </p>
          </ScrollLinkedItem>

          <ScrollLinkedItem offsetY={36}>
            <h2 className="typo-section-title">
              Konfirmasi &amp; Ucapan
            </h2>
            <WayangDivider />
            <p className="typo-body text-center max-w-[400px] mx-auto mt-3 text-[#4b3a3e]">
              Mohon konfirmasi kehadiran Anda dan tinggalkan doa terbaik untuk kedua mempelai.
            </p>
          </ScrollLinkedItem>
        </header>

        <ScrollLinkedItem offsetY={36}>
          <form
            onSubmit={handleSubmit}
            className="card-ornament bg-gradient-to-b from-surface-white to-[#fdf5f1] border border-gold-500/35 rounded-2xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.22)] p-6 sm:p-7 space-y-4"
          >
            <div>
              <label htmlFor="f-nama" className="block font-sans text-sm font-semibold text-[#4b3a3e] mb-1.5">
                Nama Anda
              </label>
              {/* iOS Safari auto-zooms inputs under 16px (text-base) */}
              <input
                id="f-nama"
                type="text"
                required
                aria-required="true"
                maxLength={60}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Bpk. Budi Santoso"
                className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white font-sans text-base sm:text-sm text-[#4b3a3e] placeholder:text-muted/60 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="f-hadir" className="block font-sans text-sm font-semibold text-[#4b3a3e] mb-1.5">
                  Konfirmasi Kehadiran
                </label>
                <select
                  id="f-hadir"
                  value={hadir}
                  onChange={(e) => setHadir(e.target.value as "Hadir" | "Berhalangan" | "Masih Ragu")}
                  className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white font-sans text-base sm:text-sm text-[#4b3a3e] focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow] cursor-pointer"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Berhalangan">Berhalangan</option>
                  <option value="Masih Ragu">Masih Ragu</option>
                </select>
              </div>

              <div>
                <label htmlFor="f-jumlah" className="block font-sans text-sm font-semibold text-[#4b3a3e] mb-1.5">
                  Jumlah Tamu
                </label>
                <select
                  id="f-jumlah"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white font-sans text-base sm:text-sm text-[#4b3a3e] focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow] cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Orang
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="f-pesan" className="block font-sans text-sm font-semibold text-[#4b3a3e]">
                  Ucapan &amp; Doa Restu
                </label>
                <span className="font-sans text-xs text-[#8d757c] tabular-nums">
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
                className="w-full px-3.5 py-3 border border-gold-500/45 rounded-xl bg-surface-white font-sans text-base sm:text-sm text-[#4b3a3e] placeholder:text-muted/60 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-[border-color,box-shadow] resize-y min-h-[96px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="typo-button w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b98a35] via-[#e9d3a3] to-[#c9a24b] text-[#443114] uppercase shadow-[0_14px_30px_-10px_rgba(169,130,58,0.55)] transition-transform duration-150 active:scale-[0.96] hover:brightness-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        </ScrollLinkedItem>

        <ScrollLinkedItem offsetY={36}>
          <div className="mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="typo-card-title flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold-600" />
                Doa &amp; Harapan <span className="text-gold-600 italic text-base">({wishes.length})</span>
              </h3>

              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari doa pengirim..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-full border border-gold-500/35 bg-surface-white font-sans text-xs text-ink placeholder:text-muted focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {(["Semua", "Hadir", "Berhalangan", "Masih Ragu"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                    filterStatus === st
                      ? "bg-rose-700 text-white shadow-xs"
                      : "bg-surface-white text-muted border border-gold-500/30 hover:bg-rose-100"
                  }`}
                >
                  {st} <span className="tabular-nums text-xs ml-1 opacity-90">({counts[st]})</span>
                </button>
              ))}
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {filteredWishes.length === 0 ? (
                <div className="text-center py-8 bg-surface-white rounded-2xl border border-gold-500/20 text-muted font-sans text-xs">
                  Belum ada ucapan yang sesuai filter pencarian.
                </div>
              ) : (
                filteredWishes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 bg-surface-white border border-gold-500/25 rounded-2xl p-4 shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white font-serif font-bold text-base grid place-items-center shrink-0 shadow-xs">
                      {(item.guestName || "?").trim().charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-sans text-[15px] font-semibold text-[#5d3a41] break-words">
                            {item.guestName}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                              item.attendanceStatus
                            )}`}
                          >
                            {getStatusIcon(item.attendanceStatus)}
                            {item.attendanceStatus}
                          </span>
                        </div>

                        <span className="font-sans text-xs text-[#8d757c] tabular-nums">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {item.paxCount && item.paxCount > 0 && (
                        <p className="font-sans text-xs text-[#8d757c] flex items-center gap-1 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-gold-600" />
                          {item.paxCount} Tamu
                        </p>
                      )}

                      <p className="mt-2 typo-body leading-relaxed break-words font-normal">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollLinkedItem>
      </div>
    </section>
  );
}
