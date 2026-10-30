"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
  Heart,
  Calendar,
  Save,
} from "lucide-react";
import type {
  WeddingSettingsData,
  GalleryPhotoData,
  GuestData,
  RsvpWishData,
} from "@/lib/db/store";
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Sesi admin berhasil diakhiri");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar dari sesi admin");
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
      id: "media" as AdminTab,
      label: "Foto & Galeri",
      mobileLabel: "Galeri",
      icon: ImageIcon,
      badge: gallery.length > 0 ? gallery.length : undefined,
    },
    {
      id: "guests" as AdminTab,
      label: "Tamu & WhatsApp",
      mobileLabel: "Tamu WA",
      icon: Users,
      badge: guests.length > 0 ? guests.length : undefined,
    },
    {
      id: "settings" as AdminTab,
      label: "Pengaturan Acara",
      mobileLabel: "Acara",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col lg:flex-row text-[#4b3a3e]">
      <aside className="hidden lg:flex flex-col w-72 bg-[#fffdfa] border-r border-[#e9d3a3]/60 shadow-sm shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-[#e9d3a3]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#fdf8f3] border border-[#e9d3a3] flex items-center justify-center text-[#a9823a] shadow-xs shrink-0">
              <Heart className="w-5 h-5 fill-[#a9823a]/25 text-[#a9823a]" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-[#5d3a41] leading-tight">
                Fauzan &amp; Sinta
              </h1>
              <p className="text-xs text-[#9c5f66] font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#a9823a]" />
                <span>Dashboard Mempelai</span>
              </p>
            </div>
          </div>

          <div className="mt-4 bg-[#fdf8f3] border border-[#e9d3a3] text-[#4b3a3e] font-medium text-xs px-3 py-2 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#a9823a]" />
              <span>{formatEventCardDate(settings.weddingDateIso, settings.eventDateLabel)}</span>
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sistem Aktif" />
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1" aria-label="Menu Admin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-colors duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-[#5d3a41] text-white font-semibold shadow-xs"
                    : "text-[#4b3a3e] font-medium hover:bg-[#f7e9e5] hover:text-[#5d3a41]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-white"
                        : "text-[#8d757c] group-hover:text-[#5d3a41] transition-colors duration-150"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums ${
                      isActive
                        ? "bg-white/25 text-white font-bold"
                        : "bg-[#f7e9e5] text-[#5d3a41]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e9d3a3]/40 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#4b3a3e] hover:bg-[#f7e9e5] hover:text-[#5d3a41] transition-colors duration-150 border border-[#e9d3a3]/70 bg-[#fffdfa]"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#a9823a]" />
              <span>Lihat Undangan Publik</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f7e9e5] text-[#5d3a41] font-semibold text-[10px]">
              Baru
            </span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 active:scale-[0.96] transition-colors duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar / Logout"}</span>
          </button>
        </div>
      </aside>

      <header className="lg:hidden sticky top-0 z-20 bg-[#fffdfa]/95 border-b border-[#e9d3a3]/60 backdrop-blur-md px-3 sm:px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#fdf8f3] border border-[#e9d3a3] flex items-center justify-center text-[#a9823a] shrink-0 shadow-xs">
            <Heart className="w-4 h-4 fill-[#a9823a]/25 text-[#a9823a]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-sm sm:text-base font-bold text-[#5d3a41] leading-tight truncate">
              Fauzan &amp; Sinta
            </h1>
            <p className="text-[10px] sm:text-xs text-[#9c5f66] font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#a9823a]" />
              <span>{formatEventCardDate(settings.weddingDateIso, settings.eventDateLabel)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {activeTab === "settings" && (
            <button
              type="submit"
              form="wedding-settings-form"
              className="inline-flex items-center gap-1.5 px-3 min-h-10 rounded-xl text-xs font-bold bg-[#5d3a41] text-white hover:bg-[#4b3a3e] active:scale-[0.96] transition-transform shadow-xs cursor-pointer"
              title="Simpan Pengaturan Acara & Musik"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          )}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 min-h-10 rounded-xl text-xs font-medium bg-[#fdf8f3] text-[#4b3a3e] hover:bg-[#f7e9e5] hover:text-[#5d3a41] border border-[#e9d3a3] transition-colors active:scale-[0.96]"
            title="Lihat Web Undangan Publik"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#a9823a]" />
            <span className="hidden sm:inline">Web Publik</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 min-h-10 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 border border-rose-200 transition-colors active:scale-[0.96] cursor-pointer"
            title="Keluar / Logout"
            aria-label="Keluar / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-12 min-w-0">
        {activeTab === "rsvp" && (
          <RsvpModerationModule
            wishes={wishes}
            guests={guests}
            onWishesChange={(updated) => setWishes(updated)}
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

        {activeTab === "guests" && (
          <GuestManagementModule
            guests={guests}
            settings={settings}
            onGuestsChange={(updated) => setGuests(updated)}
            onSettingsChange={(updated) => setSettings(updated)}
          />
        )}

        {activeTab === "settings" && (
          <WeddingSettingsModule
            initialSettings={settings}
            onSettingsUpdate={(updated) => setSettings(updated)}
          />
        )}
      </main>

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#fffdfa]/95 border-t border-[#e9d3a3]/60 backdrop-blur-md px-2 py-1 flex justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]"
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
              className={`flex flex-col items-center justify-center flex-1 min-h-[56px] py-1.5 px-1 rounded-xl transition-transform duration-150 active:scale-[0.96] cursor-pointer ${
                isActive
                  ? "bg-[#f7e9e5] text-[#5d3a41] font-bold"
                  : "text-[#8d757c] hover:text-[#5d3a41] font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-[#5d3a41] stroke-[2.3]" : "text-[#8d757c]"}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#5d3a41] text-white text-[9px] font-bold flex items-center justify-center font-mono tabular-nums shadow-xs">
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
