"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react";
import type { LucideIcon } from "lucide-react";
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
  Send,
  Heart,
  Palette,
  Menu,
  ArrowRight,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  WeddingSettingsData,
  GalleryPhotoData,
  GuestData,
  RsvpWishData,
} from "@/lib/db/store";
import { FONT_THEME_OPTIONS, normalizeFontTheme } from "@/lib/fontThemes";
import { formatEventCardDate } from "@/lib/dateFormat";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import { RsvpModerationModule } from "./RsvpModerationModule";
import { MediaManagementModule } from "./MediaManagementModule";
import { GuestManagementModule } from "./GuestManagementModule";
import { CoupleDataModule } from "./CoupleDataModule";
import { EventLogisticsModule } from "./EventLogisticsModule";
import { ThemeStudioModule } from "./ThemeStudioModule";
import { SystemSettingsModule } from "./SystemSettingsModule";
import { DashboardSplashScreen } from "./DashboardSplashScreen";
import {
  getSplashTransition,
  clearSplashTransition,
  type SplashTransitionData,
} from "@/lib/splashTransition";

type AdminSection =
  | "overview"
  | "guests"
  | "wishes"
  | "couple"
  | "event"
  | "media"
  | "theme"
  | "settings";

interface NavItemConfig {
  id: AdminSection;
  label: string;
  description: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavGroupConfig {
  groupLabel: string;
  items: NavItemConfig[];
}

interface DashboardWorkspaceProps {
  currentUser?: {
    userId: number;
    username: string;
    role: "admin" | "parent";
    displayName: string;
    guestScope: string;
    waTemplate?: string;
  };
  initialSettings: WeddingSettingsData;
  initialGallery: GalleryPhotoData[];
  initialGuests: GuestData[];
  initialWishes: RsvpWishData[];
  initialUsers?: any[];
}

export function DashboardWorkspace({
  currentUser,
  initialSettings,
  initialGallery,
  initialGuests,
  initialWishes,
  initialUsers,
}: DashboardWorkspaceProps) {
  const router = useRouter();
  const isParent = currentUser?.role === "parent";

  const [activeSection, setActiveSection] = useState<AdminSection>(
    isParent ? "guests" : "overview"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingSection, setPendingSection] = useState<AdminSection | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    settings,
    draftSettings,
    isDirty,
    isSaving,
    updateField,
    updateFields,
    discardChanges,
    syncSavedSettings,
    saveSettings,
  } = useAdminSettings(initialSettings);

  const [gallery, setGallery] = useState<GalleryPhotoData[]>(initialGallery);
  const [guests, setGuests] = useState<GuestData[]>(initialGuests);
  const [wishes, setWishes] = useState<RsvpWishData[]>(initialWishes);

  const groomFirstName = settings.groomName?.trim().split(/\s+/)[0] || "Fauzan";
  const brideFirstName = settings.brideName?.trim().split(/\s+/)[0] || "Sinta";

  const [welcomeTransition, setWelcomeTransition] = useState<SplashTransitionData | null>(null);
  const [isTransitionExiting, setIsTransitionExiting] = useState(false);

  useEffect(() => {
    const transition = getSplashTransition();
    if (!transition) return;

    setWelcomeTransition(transition);

    const elapsed = Date.now() - transition.startedAt;
    const MIN_DISPLAY_MS = 900;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const exitTimer = setTimeout(() => {
      setIsTransitionExiting(true);
      const cleanupTimer = setTimeout(() => {
        setWelcomeTransition(null);
        clearSplashTransition();
      }, 300);

      return () => clearTimeout(cleanupTimer);
    }, remaining);

    return () => clearTimeout(exitTimer);
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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

  const navGroups: NavGroupConfig[] = useMemo(() => {
    if (isParent) {
      return [
        {
          groupLabel: "Utama & Tamu",
          items: [
            {
              id: "guests",
              label: "Daftar Tamu",
              description:
                "Kelola daftar kontak keluarga, tautan personal, dan pengiriman pesan WhatsApp.",
              icon: Users,
              badge: guests.length > 0 ? guests.length : undefined,
            },
          ],
        },
      ];
    }

    return [
      {
        groupLabel: "Utama & Tamu",
        items: [
          {
            id: "overview",
            label: "Ringkasan",
            description:
              "Pantau statistik tamu undangan, konfirmasi kehadiran, dan status tampilan aktif.",
            icon: LayoutDashboard,
          },
          {
            id: "guests",
            label: "Daftar Tamu",
            description:
              "Kelola daftar kontak tamu, buat tautan personal, dan pantau pesan WhatsApp.",
            icon: Users,
            badge: guests.length > 0 ? guests.length : undefined,
          },
          {
            id: "wishes",
            label: "Buku Tamu",
            description:
              "Moderasi doa restu serta pantau status konfirmasi kehadiran yang masuk.",
            icon: MessageSquare,
            badge: wishes.length > 0 ? wishes.length : undefined,
          },
        ],
      },
      {
        groupLabel: "Konten Undangan",
        items: [
          {
            id: "couple",
            label: "Data Mempelai",
            description:
              "Atur nama lengkap, urutan anak, nama orang tua, dan kutipan profil mempelai.",
            icon: Heart,
          },
          {
            id: "event",
            label: "Acara & Amplop",
            description:
              "Kelola jadwal akad, resepsi, koordinat peta lokasi, serta rekening amplop digital.",
            icon: Calendar,
          },
          {
            id: "media",
            label: "Galeri & Media",
            description:
              "Kelola foto sampul, potret utama mempelai, foto QRIS, dan galeri dokumentasi.",
            icon: ImageIcon,
            badge: gallery.length > 0 ? gallery.length : undefined,
          },
        ],
      },
      {
        groupLabel: "Kustomisasi & Sistem",
        items: [
          {
            id: "theme",
            label: "Tema & Tampilan",
            description:
              "Pilih tema huruf undangan, mode visual mempelai, dan musik latar.",
            icon: Palette,
          },
          {
            id: "settings",
            label: "Pengaturan & Akses",
            description:
              "Atur visibilitas buku tamu publik, cerita cinta, template WhatsApp, dan akun pengelola.",
            icon: Settings,
          },
        ],
      },
    ];
  }, [isParent, guests.length, wishes.length, gallery.length]);

  const flatNavItems = useMemo(
    () => navGroups.flatMap((group) => group.items),
    [navGroups]
  );

  const currentSectionMeta =
    flatNavItems.find((item) => item.id === activeSection) ?? flatNavItems[0];

  const handleRequestSectionChange = useCallback(
    (target: AdminSection) => {
      if (isParent && target !== "guests") return;
      setIsMobileMenuOpen(false);
      if (target === activeSection) return;
      if (isDirty) {
        setPendingSection(target);
        return;
      }
      setActiveSection(target);
    },
    [isParent, activeSection, isDirty]
  );

  const handleDiscardAndNavigate = () => {
    const next = pendingSection;
    discardChanges();
    setPendingSection(null);
    if (next) setActiveSection(next);
  };

  const handleSaveAndNavigate = async () => {
    const next = pendingSection;
    const ok = await saveSettings();
    if (ok) {
      setPendingSection(null);
      if (next) setActiveSection(next);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Sesi berhasil diakhiri.");
      router.push("/dashboard/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar dari sesi. Coba beberapa saat lagi.");
      setIsLoggingOut(false);
    }
  };

  const savedFontMeta =
    FONT_THEME_OPTIONS.find((item) => item.id === normalizeFontTheme(settings.fontTheme)) ??
    FONT_THEME_OPTIONS[0];

  const renderNavGroups = (variant: "desktop" | "mobile") => (
    <div className="space-y-4">
      {navGroups.map((group) => (
        <div key={group.groupLabel} className="space-y-1">
          {!isParent && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.groupLabel}
            </p>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`${variant}-nav-${item.id}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleRequestSectionChange(item.id)}
                  className={`w-full min-h-11 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-[background-color,color,transform] duration-150 cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? "bg-[#6B1222] text-white font-semibold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-mono tabular-nums shrink-0 ${
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
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="admin-theme min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 antialiased">
      {welcomeTransition && (
        <DashboardSplashScreen
          variant="welcome"
          groomFirstName={groomFirstName}
          brideFirstName={brideFirstName}
          displayName={welcomeTransition.displayName || currentUser?.displayName}
          role={welcomeTransition.role || currentUser?.role}
          isExiting={isTransitionExiting}
        />
      )}

      {/* Navigation Guard Dialog */}
      <AlertDialog
        open={pendingSection !== null}
        onOpenChange={(open) => {
          if (!open) setPendingSection(null);
        }}
      >
        <AlertDialogContent className="admin-theme">
          <AlertDialogHeader>
            <AlertDialogTitle>Simpan perubahan sebelum berpindah?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda memiliki perubahan pengaturan yang belum disimpan. Simpan perubahan terlebih dahulu atau buang perubahan agar tetap konsisten.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => setPendingSection(null)}
              disabled={isSaving}
              className="min-h-11"
            >
              Tetap di sini
            </AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscardAndNavigate}
              disabled={isSaving}
              className="min-h-11 text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              Buang perubahan
            </Button>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleSaveAndNavigate();
              }}
              disabled={isSaving}
              className="min-h-11 bg-[#6B1222] hover:bg-[#520D1A] text-white"
            >
              {isSaving ? "Menyimpan..." : "Simpan & lanjut"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Navigation Drawer */}
      {!isParent && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="left"
            className="admin-theme w-[280px] sm:w-[300px] p-0 bg-white flex flex-col"
          >
            <SheetHeader className="p-4 pr-12 border-b border-slate-200/80 text-left space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B1222]/10 text-[#6B1222] shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <SheetTitle className="text-sm font-bold text-slate-900 leading-snug truncate">
                    {groomFirstName} &amp; {brideFirstName}
                  </SheetTitle>
                  <SheetDescription className="text-[11px] text-slate-500">
                    Panel Pengelola Undangan
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5 truncate">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {formatEventCardDate(settings.weddingDateIso, settings.eventDateLabel)}
                  </span>
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              </div>
            </SheetHeader>

            <nav
              className="p-3 flex-1 overflow-y-auto"
              aria-label="Navigasi Mobile Admin"
            >
              {renderNavGroups("mobile")}
            </nav>

            <div className="p-3 border-t border-slate-200/80 space-y-1.5">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-11 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>Lihat Undangan</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full min-h-11 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span>{isLoggingOut ? "Keluar..." : "Keluar dari sesi"}</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-200/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B1222]/10 text-[#6B1222] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-snug truncate">
                {groomFirstName} &amp; {brideFirstName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 rounded-md font-medium ${
                    isParent
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {isParent ? "Akun Orang Tua" : "Admin Mempelai"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5 truncate">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {formatEventCardDate(settings.weddingDateIso, settings.eventDateLabel)}
              </span>
            </span>
            <span
              className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0"
              title="Sistem Aktif"
            />
          </div>
        </div>

        <nav
          className="p-3 flex-1 overflow-y-auto"
          aria-label="Menu Utama Admin"
        >
          {renderNavGroups("desktop")}
        </nav>

        <div className="p-3 border-t border-slate-200/80 space-y-1.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full min-h-11 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Lihat Undangan</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full min-h-11 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar dari sesi"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 border-b border-slate-200/80 backdrop-blur-md px-3 py-2 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          {!isParent ? (
            <button
              type="button"
              data-testid="mobile-drawer-trigger"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.96] transition-[background-color,transform] cursor-pointer shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B1222]/10 text-[#6B1222] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">
                {currentSectionMeta.label}
              </h1>
              {isParent && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-800 border-amber-300 shrink-0"
                >
                  Orang Tua
                </Badge>
              )}
              {isDirty && (
                <span
                  className="inline-block h-2 w-2 rounded-full bg-amber-500 shrink-0"
                  title="Perubahan belum disimpan"
                />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
              {isParent
                ? currentUser?.displayName || "Daftar Tamu"
                : `${groomFirstName} & ${brideFirstName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isDirty && (
            <button
              type="button"
              onClick={() => void saveSettings()}
              disabled={isSaving}
              className="inline-flex items-center gap-1 px-2.5 min-h-11 rounded-xl text-xs font-semibold bg-[#6B1222] text-white hover:bg-[#520D1A] active:scale-[0.96] transition-[background-color,transform] cursor-pointer disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "..." : "Simpan"}</span>
            </button>
          )}

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 min-h-11 rounded-xl text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            aria-label="Lihat Undangan"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden min-[380px]:inline">Lihat</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Keluar dari sesi"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Contextual Header */}
        <header className="hidden lg:flex items-center justify-between gap-4 bg-white border-b border-slate-200/80 px-8 py-4 sticky top-0 z-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                {currentSectionMeta.label}
              </h2>
              {isParent && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-800 border-amber-300 text-xs font-medium"
                >
                  Akses Terbatas: {currentUser?.displayName || "Orang Tua"}
                </Badge>
              )}
              {isDirty && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-800 border-amber-300 text-xs font-medium"
                >
                  Ada perubahan belum disimpan
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {currentSectionMeta.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isDirty && (
              <Button
                type="button"
                onClick={() => void saveSettings()}
                isLoading={isSaving}
                className="min-h-11 px-4 text-xs font-semibold bg-[#6B1222] hover:bg-[#520D1A] text-white active:not-disabled:scale-[0.96] transition-[background-color,transform]"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </Button>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 min-h-11 rounded-xl text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Lihat Undangan</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto min-w-0 space-y-6 pb-12">
          {/* Parent Role View: Guests Only */}
          {isParent && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="border-slate-200/80 shadow-xs">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-slate-500 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Total Tamu Saya
                      </span>
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
                      <NumberFlow value={kpis.totalGuests} />
                    </p>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Kontak keluarga terdaftar
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 shadow-xs">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-slate-500 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Undangan Terkirim
                      </span>
                      <CheckCheck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
                      <NumberFlow value={kpis.sentGuests} />
                    </p>
                    <span className="text-[11px] text-slate-500 mt-1 block font-mono tabular-nums">
                      {kpis.totalGuests > 0 ? `${kpis.sentPct}% dari total tamu saya` : "0%"}
                    </span>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 shadow-xs">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-slate-500 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Belum Dikirim
                      </span>
                      <Send className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-800 font-mono tabular-nums">
                      <NumberFlow value={kpis.totalGuests - kpis.sentGuests} />
                    </p>
                    <span className="text-[11px] text-slate-500 mt-1 block font-mono tabular-nums">
                      {kpis.totalGuests > 0
                        ? `${100 - kpis.sentPct}% perlu dikirimkan`
                        : "0 tamu"}
                    </span>
                  </CardContent>
                </Card>
              </div>

              <GuestManagementModule
                guests={guests}
                settings={settings}
                currentUser={currentUser}
                onGuestsChange={(updated) => setGuests(updated)}
                onSettingsChange={(updated) => syncSavedSettings(updated)}
              />
            </>
          )}

          {/* Admin Role View */}
          {!isParent && activeSection === "overview" && (
            <div className="space-y-6">
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
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Kontak terdaftar
                    </span>
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
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Doa restu tersimpan
                    </span>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <Card className="lg:col-span-7 border-slate-200/80 shadow-xs">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Ucapan &amp; Konfirmasi Terbaru
                      </CardTitle>
                      <CardDescription>
                        Ringkasan pesan tamu terbaru dari buku tamu undangan.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRequestSectionChange("wishes")}
                      className="min-h-11 px-3 text-xs font-medium shrink-0"
                    >
                      <span>Buka Buku Tamu</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {wishes.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center space-y-2">
                        <MessageSquare className="h-6 w-6 text-slate-400 mx-auto" />
                        <p className="text-sm font-medium text-slate-700">
                          Belum ada ucapan masuk
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Ucapan dan konfirmasi kehadiran akan tampil di sini setelah tamu mengisi buku tamu melalui tautan undangan pribadi.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {wishes.slice(0, 4).map((wish) => (
                          <div
                            key={wish.id}
                            className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-900 truncate">
                                {wish.guestName}
                              </span>
                              <Badge
                                variant={
                                  wish.attendanceStatus === "Hadir"
                                    ? "success"
                                    : wish.attendanceStatus === "Tidak Hadir"
                                    ? "outline"
                                    : "outline"
                                }
                                size="sm"
                                className="text-[10px] shrink-0"
                              >
                                {wish.attendanceStatus}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {wish.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-5 border-slate-200/80 shadow-xs">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-slate-900">
                      Status Undangan Aktif
                    </CardTitle>
                    <CardDescription>
                      Ringkasan pengaturan tampilan dan akses halaman publik saat ini.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 divide-y divide-slate-200/70 text-xs">
                      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <span className="text-slate-500 inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Tanggal Acara
                        </span>
                        <span className="font-semibold text-slate-900 tabular-nums text-right">
                          {formatEventCardDate(settings.weddingDateIso, settings.eventDateLabel)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <span className="text-slate-500 inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          Lokasi
                        </span>
                        <span className="font-medium text-slate-900 truncate max-w-[180px] text-right">
                          {settings.venueName || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <span className="text-slate-500 inline-flex items-center gap-1.5">
                          <Palette className="h-3.5 w-3.5 text-slate-400" />
                          Tema Huruf
                        </span>
                        <span className="font-semibold text-[#6B1222]">
                          {savedFontMeta.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                        <span className="text-slate-500 inline-flex items-center gap-1.5">
                          {settings.showPublicPreviewWishes !== false ? (
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          Ucapan Pratinjau Publik
                        </span>
                        <span className="font-medium text-slate-900">
                          {settings.showPublicPreviewWishes !== false
                            ? "Ditampilkan"
                            : "Disembunyikan"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRequestSectionChange("theme")}
                        className="min-h-11 text-xs font-medium justify-between"
                      >
                        <span>Studio Tema</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRequestSectionChange("guests")}
                        className="min-h-11 text-xs font-medium justify-between"
                      >
                        <span>Kelola Tamu</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRequestSectionChange("couple")}
                        className="min-h-11 text-xs font-medium justify-between"
                      >
                        <span>Data Mempelai</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRequestSectionChange("event")}
                        className="min-h-11 text-xs font-medium justify-between"
                      >
                        <span>Acara &amp; Amplop</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!isParent && activeSection === "guests" && (
            <GuestManagementModule
              guests={guests}
              settings={settings}
              currentUser={currentUser}
              onGuestsChange={(updated) => setGuests(updated)}
              onSettingsChange={(updated) => syncSavedSettings(updated)}
            />
          )}

          {!isParent && activeSection === "wishes" && (
            <RsvpModerationModule
              wishes={wishes}
              guests={guests}
              onWishesChange={(updated) => setWishes(updated)}
            />
          )}

          {!isParent && activeSection === "couple" && (
            <CoupleDataModule
              formData={draftSettings}
              onChange={updateField}
              isDirty={isDirty}
              isSaving={isSaving}
              onSave={() => saveSettings()}
              onDiscard={discardChanges}
            />
          )}

          {!isParent && activeSection === "event" && (
            <EventLogisticsModule
              formData={draftSettings}
              onChange={updateField}
              onUpdateFields={updateFields}
              isDirty={isDirty}
              isSaving={isSaving}
              onSave={() => saveSettings()}
              onDiscard={discardChanges}
            />
          )}

          {!isParent && activeSection === "media" && (
            <MediaManagementModule
              settings={settings}
              gallery={gallery}
              onSettingsChange={(updated) => syncSavedSettings(updated)}
              onGalleryChange={(updated) => setGallery(updated)}
            />
          )}

          {!isParent && activeSection === "theme" && (
            <ThemeStudioModule
              formData={draftSettings}
              onChange={updateField}
              onUpdateFields={updateFields}
              isDirty={isDirty}
              isSaving={isSaving}
              onSave={() => saveSettings()}
              onDiscard={discardChanges}
            />
          )}

          {!isParent && activeSection === "settings" && (
            <SystemSettingsModule
              formData={draftSettings}
              onChange={updateField}
              initialUsers={initialUsers}
              isDirty={isDirty}
              isSaving={isSaving}
              onSave={() => saveSettings()}
              onDiscard={discardChanges}
            />
          )}
        </main>
      </div>
    </div>
  );
}
