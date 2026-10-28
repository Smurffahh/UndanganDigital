"use client";

import { useState, useMemo } from "react";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import {
  Users,
  CheckCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Search,
  Trash2,
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

  // KPI Calculations
  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const sentGuests = guests.filter((g) => g.waSentStatus).length;
    const hadirWishes = wishes.filter((w) => w.attendanceStatus === "Hadir");
    const hadirCount = hadirWishes.length;
    const totalPax = hadirWishes.reduce((sum, w) => sum + (w.paxCount || 1), 0);
    const berhalanganCount = wishes.filter((w) => w.attendanceStatus === "Berhalangan").length;
    const raguCount = wishes.filter((w) => w.attendanceStatus === "Masih Ragu").length;
    const totalWishes = wishes.length;

    return {
      totalGuests,
      sentGuests,
      hadirCount,
      totalPax,
      berhalanganCount,
      raguCount,
      totalWishes,
    };
  }, [guests, wishes]);

  // Filter & Search
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
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Berhalangan":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <div className="space-y-7">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-surface-white border border-gold-500/30 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Diundang</span>
            <Users className="w-4 h-4 text-gold-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-rose-900 tabular-nums">
            <NumberFlow value={stats.totalGuests} />
          </p>
          <span className="text-[10px] text-muted">Kontak tamu terdaftar</span>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-surface-white border border-gold-500/30 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Terkirim WA</span>
            <CheckCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700 tabular-nums">
            <NumberFlow value={stats.sentGuests} />
          </p>
          <span className="text-[10px] text-muted">
            {stats.totalGuests > 0
              ? `${Math.round((stats.sentGuests / stats.totalGuests) * 100)}% dari target`
              : "0%"}
          </span>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-surface-white border border-gold-500/30 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Konfirmasi Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-800 tabular-nums">
            <NumberFlow value={stats.hadirCount} />
          </p>
          <span className="text-[10px] font-semibold text-emerald-700">
            Total {stats.totalPax} Orang
          </span>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-surface-white border border-gold-500/30 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Berhalangan/Ragu</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-rose-800 tabular-nums">
            <NumberFlow value={stats.berhalanganCount + stats.raguCount} />
          </p>
          <span className="text-[10px] text-muted">
            {stats.berhalanganCount} berhalangan, {stats.raguCount} ragu
          </span>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-2xl bg-surface-white border border-gold-500/30 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Ucapan</span>
            <MessageSquare className="w-4 h-4 text-gold-600" />
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-rose-900 tabular-nums">
            <NumberFlow value={stats.totalWishes} />
          </p>
          <span className="text-[10px] text-muted">Doa restu masuk</span>
        </div>
      </div>

      {/* Moderation List Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900">
              Moderasi Buku Tamu (RSVP)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Pantau seluruh ucapan yang masuk dan hapus pesan yang tidak pantas atau spam.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim / pesan..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-xs text-ink placeholder:text-muted focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["Semua", "Hadir", "Berhalangan", "Masih Ragu"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === status
                  ? "bg-rose-700 text-white shadow-xs"
                  : "bg-surface-white text-muted border border-gold-500/30 hover:bg-rose-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Wishes List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredWishes.length === 0 ? (
            <div className="text-center py-10 text-muted text-xs bg-cream/50 rounded-2xl border border-dashed border-gold-500/30">
              Tidak ada data ucapan yang sesuai.
            </div>
          ) : (
            filteredWishes.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-4 rounded-2xl border border-gold-500/25 bg-gradient-to-r from-surface-white to-[#fffcf9] hover:border-gold-500/40 transition-colors shadow-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-rose-900 break-words">
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
                      <span className="text-[10px] text-muted">
                        &middot; {item.paxCount} Orang
                      </span>
                    )}
                    <span className="text-[10px] text-muted tabular-nums ml-auto">
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-ink font-light leading-relaxed break-words mt-1">
                    {item.message}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeletingId === item.id}
                  aria-label={`Hapus ucapan dari ${item.guestName}`}
                  className="p-2 rounded-xl text-rose-600 hover:text-white hover:bg-rose-700 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
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
