"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Calendar,
  Save,
  CheckCheck,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type {
  WeddingSettingsData,
  GalleryPhotoData,
  GuestData,
  RsvpWishData,
} from "@/lib/db/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RsvpModerationModule } from "./RsvpModerationModule";
import { MediaManagementModule } from "./MediaManagementModule";
import { GuestManagementModule } from "./GuestManagementModule";
import { WeddingSettingsModule } from "./WeddingSettingsModule";
import { formatEventCardDate } from "@/lib/dateFormat";

type AdminTab = "rsvp" | "media" | "guests" | "settings";

interface DashboardWorkspaceProps {
  initialSettings: WeddingSettingsData;
  initialGallery: GalleryPhotoData[];
  initialGuests: GuestData[];
  initialWishes: RsvpWishData[];
}

export function DashboardWorkspace({
  initialSettings,
  initialGallery,
  initialGuests,
  initialWishes,
}: DashboardWorkspaceProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("rsvp");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [settings, setSettings] = useState<WeddingSettingsData>(initialSettings);
  const [gallery, setGallery] = useState<GalleryPhotoData[]>(initialGallery);
  const [guests, setGuests] = useState<GuestData[]>(initialGuests);
  const [wishes, setWishes] = useState<RsvpWishData[]>(initialWishes);

  const kpis = useMemo(() => {
    const totalGuests = guests.length;
    const sentGuests = guests.filter((g) => g.waSentStatus).length;
    const sentPct = totalGuests > 0 ? Math.round((sentGuests / totalGuests) * 100) : 0;
    const hadirWishes = wishes.filter((w) => w.attendanceStatus === "Hadir");
    const hadirCount = hadirWishes.length;
    const totalPax = hadirWishes.reduce((sum, w) => sum + (w.paxCount || 1), 0);
    const totalWishes = wishes.length;

    return {
      totalGuests,
      sentGuests,
      sentPct,
      hadirCount,
      totalPax,
      totalWishes,
    };
  }, [guests, wishes]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Sesi admin berhasil diakhiri.");
      router.push("/dashboard/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar dari sesi admin. Coba beberapa saat lagi.");
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      id: "rsvp" as AdminTab,
      label: "Ringkasan & RSVP",
      mobileLabel: "RSVP",
      icon: LayoutDashboard,
      badge: wishes.length > 0 ? wishes.length : undefined,
    },
    {
      id: "guests" as AdminTab,
      label: "Tamu & WhatsApp",
      mobileLabel: "Tamu",
      icon: Users,
      badge: guests.length > 0 ? guests.length : undefined,
    },
    {
      id: "media" as AdminTab,
      label: "Foto & Galeri",
      mobileLabel: "Galeri",
      icon: ImageIcon,
      badge: gallery.length > 0 ? gallery.length : undefined,
    },
    {
      id: "settings" as AdminTab,
      label: "Pengaturan Acara",
      mobileLabel: "Pengaturan",
      icon: Settings,
    },
  ];

  const currentTabTitle = navItems.find((item) => item.id === activeTab)?.label || "Dashboard";

  return (
    <div className="admin-theme min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 antialiased">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B1222]/10 text-[#6B1222] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-snug truncate">
                Fauzan &amp; Sinta
              </h1>
              <p className="text-xs text-slate-500 font-medium">Dashboard Acara</p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5 truncate">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {formatEventCardDate(settings.weddingDateIso, settings.eventDateLabel)}
              </span>
            </span>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Sistem Aktif" />
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1" aria-label="Menu Utama Admin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-[background-color,color] duration-150 cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? "bg-[#6B1222] text-white font-semibold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono tabular-nums ${
                      isActive
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200/80 space-y-1.5">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Lihat halaman undangan</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar dari sesi"}</span>
          </button>
        </div>
      </aside>

      <header className="lg:hidden sticky top-0 z-30 bg-white/95 border-b border-slate-200/80 backdrop-blur-md px-3.5 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B1222]/10 text-[#6B1222] shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">
              Fauzan &amp; Sinta
            </h1>
            <p className="text-[11px] text-slate-500 leading-none truncate mt-0.5">
              {currentTabTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {activeTab === "settings" && (
            <button
              type="submit"
              form="wedding-settings-form"
              className="inline-flex items-center gap-1.5 px-3 min-h-9 rounded-lg text-xs font-semibold bg-[#6B1222] text-white hover:bg-[#520D1A] active:scale-[0.96] transition-transform shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan</span>
            </button>
          )}

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 min-h-9 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Web publik</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1 px-2.5 min-h-9 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
            aria-label="Keluar dari sesi"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/95 border-b border-slate-200/80 backdrop-blur-md px-8 py-3.5 items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {currentTabTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === "rsvp" && "Pantau ringkasan konfirmasi kehadiran dan moderasi buku tamu"}
              {activeTab === "guests" && "Kelola daftar kontak tamu, status link, dan pengiriman pesan WhatsApp"}
              {activeTab === "media" && "Kelola foto utama, galeri dokumentasi, dan audio latar belakang"}
              {activeTab === "settings" && "Atur profil mempelai, jadwal acara, lokasi peta, dan rekening"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "settings" && (
              <button
                type="submit"
                form="wedding-settings-form"
                className="inline-flex items-center gap-1.5 px-4 min-h-10 rounded-xl text-xs font-semibold bg-[#6B1222] text-white hover:bg-[#520D1A] active:scale-[0.96] transition-transform shadow-xs cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Simpan perubahan</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 min-h-10 rounded-xl text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Buka undangan publik</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-28 lg:pb-12 min-w-0 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-slate-200/80 shadow-xs">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Total Tamu
                  </span>
                  <Users className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  <NumberFlow value={kpis.totalGuests} />
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">Kontak terdaftar</span>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-xs">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Terkirim WA
                  </span>
                  <CheckCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
                  <NumberFlow value={kpis.sentGuests} />
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block font-mono tabular-nums">
                  {kpis.totalGuests > 0 ? `${kpis.sentPct}% dari total tamu` : "0%"}
                </span>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-xs">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Konfirmasi Hadir
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-800 font-mono tabular-nums">
                  <NumberFlow value={kpis.hadirCount} />
                </p>
                <span className="text-[11px] font-medium text-emerald-700 mt-1 block font-mono tabular-nums">
                  Estimasi {kpis.totalPax} orang hadir
                </span>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 shadow-xs">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Ucapan Masuk
                  </span>
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  <NumberFlow value={kpis.totalWishes} />
                </p>
                <span className="text-[11px] text-slate-500 mt-1 block">Doa restu tersimpan</span>
              </CardContent>
            </Card>
          </div>

          {activeTab === "rsvp" && (
            <RsvpModerationModule
              wishes={wishes}
              guests={guests}
              onWishesChange={(updated) => setWishes(updated)}
            />
          )}

          {activeTab === "guests" && (
            <GuestManagementModule
              guests={guests}
              settings={settings}
              onGuestsChange={(updated) => setGuests(updated)}
              onSettingsChange={(updated) => setSettings(updated)}
            />
          )}

          {activeTab === "media" && (
            <MediaManagementModule
              settings={settings}
              gallery={gallery}
              onSettingsChange={(updated) => setSettings(updated)}
              onGalleryChange={(updated) => setGallery(updated)}
            />
          )}

          {activeTab === "settings" && (
            <WeddingSettingsModule
              initialSettings={settings}
              onSettingsUpdate={(updated) => setSettings(updated)}
            />
          )}
        </main>
      </div>

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 border-t border-slate-200/90 backdrop-blur-md px-2 py-1.5 flex justify-around shadow-lg pb-[max(0.6rem,env(safe-area-inset-bottom))]"
        aria-label="Navigasi Bawah Mobile"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[50px] py-1 px-1 rounded-xl transition-colors duration-150 active:scale-[0.96] cursor-pointer ${
                isActive
                  ? "bg-slate-100 text-[#6B1222] font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-[#6B1222] stroke-[2.2]" : "text-slate-400"}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#6B1222] text-white text-[9px] font-bold flex items-center justify-center font-mono tabular-nums shadow-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 font-medium whitespace-nowrap tracking-tight">
                {item.mobileLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
