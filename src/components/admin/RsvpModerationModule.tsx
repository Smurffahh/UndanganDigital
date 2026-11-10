"use client";

import { useState, useMemo } from "react";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import {
  Users,
  CheckCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Trash2,
  PieChart,
  HelpCircle,
  Tag,
} from "lucide-react";
import type { RsvpWishData, GuestData } from "@/lib/db/store";

interface RsvpModerationModuleProps {
  wishes: RsvpWishData[];
  guests: GuestData[];
  onWishesChange: (updated: RsvpWishData[]) => void;
}

export function RsvpModerationModule({
  wishes,
  guests,
  onWishesChange,
}: RsvpModerationModuleProps) {
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const sentGuests = guests.filter((g) => g.waSentStatus).length;
    const hadirWishes = wishes.filter((w) => w.attendanceStatus === "Hadir");
    const hadirCount = hadirWishes.length;
    const totalPax = hadirWishes.reduce((sum, w) => sum + (w.paxCount || 1), 0);
    const berhalanganCount = wishes.filter((w) => w.attendanceStatus === "Berhalangan").length;
    const raguCount = wishes.filter((w) => w.attendanceStatus === "Masih Ragu").length;
    const totalWishes = wishes.length;

    const unconfirmedCount = Math.max(0, totalGuests - (hadirCount + berhalanganCount + raguCount));

    const totalDenominator = totalGuests > 0 ? totalGuests : (totalWishes > 0 ? totalWishes : 1);
    const hadirPct = Math.round((hadirCount / totalDenominator) * 100);
    const raguPct = Math.round((raguCount / totalDenominator) * 100);
    const berhalanganPct = Math.round((berhalanganCount / totalDenominator) * 100);
    const unconfirmedPct = Math.max(0, 100 - (hadirPct + raguPct + berhalanganPct));

    const categories = guests.reduce<Record<string, number>>((acc, g) => {
      const cat = g.category || "Umum";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      totalGuests,
      sentGuests,
      hadirCount,
      totalPax,
      berhalanganCount,
      raguCount,
      totalWishes,
      unconfirmedCount,
      hadirPct,
      raguPct,
      berhalanganPct,
      unconfirmedPct,
      categories,
    };
  }, [guests, wishes]);

  const filteredWishes = useMemo(() => {
    return wishes.filter((item) => {
      const matchFilter = filterStatus === "Semua" || item.attendanceStatus === filterStatus;
      const matchSearch =
        item.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [wishes, filterStatus, searchQuery]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/admin/wishes?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus ucapan");
      }

      const nextWishes = wishes.filter((w) => w.id !== id);
      onWishesChange(nextWishes);
      toast.success("Ucapan berhasil dihapus dari Buku Tamu");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus ucapan";
      toast.error(msg);
    } finally {
      setIsDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hadir":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "Berhalangan":
        return "bg-rose-50 text-rose-800 border-rose-300";
      default:
        return "bg-amber-50 text-amber-800 border-amber-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Tamu</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tabular-nums">
            <NumberFlow value={stats.totalGuests} />
          </p>
          <span className="text-[10px] text-stone-500">Kontak terdaftar</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Terkirim WA</span>
            <CheckCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700 tabular-nums">
            <NumberFlow value={stats.sentGuests} />
          </p>
          <span className="text-[10px] text-stone-500 tabular-nums">
            {stats.totalGuests > 0
              ? `${Math.round((stats.sentGuests / stats.totalGuests) * 100)}% dari target`
              : "0%"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Konfirmasi Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-800 tabular-nums">
            <NumberFlow value={stats.hadirCount} />
          </p>
          <span className="text-[10px] font-semibold text-emerald-700 tabular-nums">
            Total estimasi {stats.totalPax} pax
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Berhalangan/Ragu</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-800 tabular-nums">
            <NumberFlow value={stats.berhalanganCount + stats.raguCount} />
          </p>
          <span className="text-[10px] text-stone-500 tabular-nums">
            {stats.berhalanganCount} berhalangan, {stats.raguCount} ragu
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Buku Tamu</span>
            <MessageSquare className="w-4 h-4 text-stone-400" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tabular-nums">
            <NumberFlow value={stats.totalWishes} />
          </p>
          <span className="text-[10px] text-stone-500">Doa restu masuk</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#5d3a41]" />
            <h3 className="font-sans font-bold text-sm sm:text-base text-stone-900">
              Visualisasi Distribusi Kehadiran Tamu
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono tabular-nums">
            Total Responden: {stats.totalWishes} / {stats.totalGuests} Tamu
          </span>
        </div>

        <div className="w-full">
          <div className="w-full h-4 rounded-full bg-stone-100 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${stats.hadirPct}%` }}
              className="h-full bg-emerald-600 transition-all duration-500"
              title={`Hadir: ${stats.hadirCount} (${stats.hadirPct}%)`}
            />
            <div
              style={{ width: `${stats.raguPct}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`Masih Ragu: ${stats.raguCount} (${stats.raguPct}%)`}
            />
            <div
              style={{ width: `${stats.berhalanganPct}%` }}
              className="h-full bg-rose-500 transition-all duration-500"
              title={`Berhalangan: ${stats.berhalanganCount} (${stats.berhalanganPct}%)`}
            />
            <div
              style={{ width: `${stats.unconfirmedPct}%` }}
              className="h-full bg-stone-300 transition-all duration-500"
              title={`Belum Konfirmasi: ${stats.unconfirmedCount} (${stats.unconfirmedPct}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-y-2 mt-3 pt-2 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="font-medium text-stone-700">Hadir</span>
              <span className="text-stone-400 font-mono tabular-nums">({stats.hadirPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="font-medium text-stone-700">Ragu</span>
              <span className="text-stone-400 font-mono tabular-nums">({stats.raguPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="font-medium text-stone-700">Berhalangan</span>
              <span className="text-stone-400 font-mono tabular-nums">({stats.berhalanganPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 shrink-0" />
              <span className="font-medium text-stone-700">Belum Konfirmasi</span>
              <span className="text-stone-400 font-mono tabular-nums">({stats.unconfirmedPct}%)</span>
            </div>
          </div>
        </div>

        {Object.keys(stats.categories).length > 0 && (
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Kategori:
            </span>
            {Object.entries(stats.categories).map(([cat, count]) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium tabular-nums"
              >
                {cat}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Moderasi Buku Tamu (RSVP)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 font-sans">
              Pantau seluruh ucapan yang masuk dan hapus pesan yang tidak pantas atau spam.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim / doa..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 bg-white text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#5d3a41] focus:ring-1 focus:ring-[#5d3a41]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(["Semua", "Hadir", "Berhalangan", "Masih Ragu"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === status
                  ? "bg-[#5d3a41] text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredWishes.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
              Tidak ada data ucapan yang sesuai dengan kriteria pencarian.
            </div>
          ) : (
            filteredWishes.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-stone-900 break-words">
                      {item.guestName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        item.attendanceStatus
                      )}`}
                    >
                      {item.attendanceStatus}
                    </span>
                    {item.paxCount && item.paxCount > 0 && (
                      <span className="text-[10px] text-stone-500 tabular-nums">
                        &middot; {item.paxCount} Orang
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400 tabular-nums ml-auto">
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 font-light leading-relaxed break-words mt-1">
                    {item.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeletingId === item.id}
                  aria-label={`Hapus ucapan dari ${item.guestName}`}
                  className="p-2 rounded-xl text-rose-600 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
