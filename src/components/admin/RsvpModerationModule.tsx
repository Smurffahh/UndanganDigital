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
  Tag,
} from "lucide-react";
import type { RsvpWishData, GuestData } from "@/lib/db/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [wishToDelete, setWishToDelete] = useState<RsvpWishData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const cat = g.category || "Reguler";
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
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.guestName.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query);
      return matchFilter && matchSearch;
    });
  }, [wishes, filterStatus, searchQuery]);

  const confirmDeleteWish = async () => {
    if (!wishToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/wishes?id=${wishToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus ucapan.");
      }

      const nextWishes = wishes.filter((w) => w.id !== wishToDelete.id);
      onWishesChange(nextWishes);
      toast.success(`Ucapan dari ${wishToDelete.guestName} berhasil dihapus.`);
      setWishToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus ucapan. Coba lagi.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const getAttendanceBadgeVariant = (status: string) => {
    switch (status) {
      case "Hadir":
        return "success";
      case "Berhalangan":
        return "destructive";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-[#6B1222]" />
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                Distribusi Konfirmasi Kehadiran
              </CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Total Responden: {stats.totalWishes} / {stats.totalGuests} Tamu
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full">
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${stats.hadirPct}%` }}
                className="h-full bg-emerald-600 transition-[width] duration-300"
                title={`Hadir: ${stats.hadirCount} (${stats.hadirPct}%)`}
              />
              <div
                style={{ width: `${stats.raguPct}%` }}
                className="h-full bg-amber-500 transition-[width] duration-300"
                title={`Masih Ragu: ${stats.raguCount} (${stats.raguPct}%)`}
              />
              <div
                style={{ width: `${stats.berhalanganPct}%` }}
                className="h-full bg-rose-500 transition-[width] duration-300"
                title={`Berhalangan: ${stats.berhalanganCount} (${stats.berhalanganPct}%)`}
              />
              <div
                style={{ width: `${stats.unconfirmedPct}%` }}
                className="h-full bg-slate-200 transition-[width] duration-300"
                title={`Belum Konfirmasi: ${stats.unconfirmedCount} (${stats.unconfirmedPct}%)`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-y-2 mt-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700">Hadir</span>
                <span className="text-slate-400 font-mono tabular-nums">({stats.hadirPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span className="font-medium text-slate-700">Ragu</span>
                <span className="text-slate-400 font-mono tabular-nums">({stats.raguPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span className="font-medium text-slate-700">Berhalangan</span>
                <span className="text-slate-400 font-mono tabular-nums">({stats.berhalanganPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
                <span className="font-medium text-slate-700">Belum konfirmasi</span>
                <span className="text-slate-400 font-mono tabular-nums">({stats.unconfirmedPct}%)</span>
              </div>
            </div>
          </div>

          {Object.keys(stats.categories).length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Tag className="h-3 w-3" />
                Kategori:
              </span>
              {Object.entries(stats.categories).map(([cat, count]) => (
                <Badge key={cat} variant="outline" size="sm" className="bg-slate-50">
                  {cat}: <strong className="ml-1">{count}</strong>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                Moderasi Buku Tamu
              </CardTitle>
              <CardDescription className="mt-0.5">
                Daftar ucapan dan doa restu yang masuk dari tamu undangan.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau isi doa..."
                className="pl-9 h-10 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
            {(["Semua", "Hadir", "Berhalangan", "Masih Ragu"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filterStatus === status
                    ? "bg-[#6B1222] text-white shadow-xs font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredWishes.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Tidak ada data ucapan yang sesuai dengan filter atau kata kunci pencarian.
              </div>
            ) : (
              filteredWishes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 break-words">
                        {item.guestName}
                      </span>
                      <Badge variant={getAttendanceBadgeVariant(item.attendanceStatus)} size="sm">
                        {item.attendanceStatus}
                      </Badge>
                      {item.paxCount && item.paxCount > 0 && (
                        <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {item.paxCount} orang
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums ml-auto">
                        {new Date(item.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-normal leading-relaxed break-words mt-1">
                      {item.message}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setWishToDelete(item)}
                    aria-label={`Hapus ucapan dari ${item.guestName}`}
                    className="text-slate-400 hover:text-rose-700 hover:bg-rose-50 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(wishToDelete)} onOpenChange={(open) => !open && setWishToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus ucapan tamu?</AlertDialogTitle>
            <AlertDialogDescription>
              Ucapan dari <strong>{wishToDelete?.guestName}</strong> akan dihapus secara permanen dari buku tamu publik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWish}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Menghapus..." : "Hapus ucapan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
