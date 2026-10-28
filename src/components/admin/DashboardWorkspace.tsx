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

  // Synchronized state across all 4 modules
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
      icon: LayoutDashboard,
      badge: wishes.length > 0 ? wishes.length : undefined,
    },
    {
      id: "media" as AdminTab,
      label: "Foto & Galeri",
      icon: ImageIcon,
      badge: gallery.length > 0 ? gallery.length : undefined,
    },
    {
      id: "guests" as AdminTab,
      label: "Tamu & WhatsApp",
      icon: Users,
      badge: guests.length > 0 ? guests.length : undefined,
    },
    {
      id: "settings" as AdminTab,
      label: "Pengaturan Acara",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-bg-dark flex flex-col md:flex-row text-slate-800 dark:text-slate-100">
      {/* DESKTOP LEFT SIDENAV */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-card-dark border-r border-gold-500/20 shadow-sm shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Sidenav Header */}
        <div className="p-6 border-b border-gold-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-600 dark:text-gold-400 shadow-sm">
              <Heart className="w-5 h-5 fill-gold-500/30" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-slate-900 dark:text-cream leading-tight">
                Dian & Iqbal
              </h1>
              <p className="text-[11px] text-gold-600 dark:text-gold-400 font-medium flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Dashboard Mempelai</span>
              </p>
            </div>
          </div>
          <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-100/70 dark:bg-black/30 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-600" />
              <span>10 Januari 2027</span>
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Sidenav Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1" aria-label="Menu Admin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold-500 text-white font-semibold shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-mono tabular-nums ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidenav Footer Actions */}
        <div className="p-4 border-t border-gold-500/15 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-slate-200/60 dark:border-white/5"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
              <span>Lihat Undangan Publik</span>
            </span>
            <span className="text-[10px] text-slate-400">Baru</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 active:scale-[0.96] transition-transform"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar / Logout"}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-20 bg-white/95 dark:bg-card-dark/95 border-b border-gold-500/20 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-600 dark:text-gold-400">
            <Heart className="w-4 h-4 fill-gold-500/30" />
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold text-slate-900 dark:text-cream leading-none">
              Dian & Iqbal
            </h1>
            <p className="text-[10px] text-gold-600 dark:text-gold-400 mt-0.5">
              Dashboard Mempelai
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/10"
          >
            <span>Undangan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10"
            title="Keluar / Logout"
            aria-label="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-12">
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

      {/* MOBILE BOTTOM DOCK NAVIGATION */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-card-dark/95 border-t border-gold-500/20 backdrop-blur-md px-2 py-1.5 flex justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]"
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
              className={`flex flex-col items-center justify-center min-w-16 min-h-12 px-2 py-1 rounded-xl transition-transform active:scale-[0.96] ${
                isActive
                  ? "text-gold-600 dark:text-gold-400 font-semibold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-gold-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 line-clamp-1">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
