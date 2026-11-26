"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  UserPlus,
  Shield,
  Users,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface DashboardUserItem {
  id: number;
  username: string;
  role: string;
  displayName: string;
  guestScope: string;
  waTemplate?: string | null;
  isActive: boolean;
  createdAt?: string | Date;
}

interface AksesAkunTabProps {
  initialUsers?: DashboardUserItem[];
}

export function AksesAkunTab({ initialUsers = [] }: AksesAkunTabProps) {
  const [users, setUsers] = useState<DashboardUserItem[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);

  // Create User Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"parent" | "admin">("parent");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Reset Password Modal State
  const [resetTargetUser, setResetTargetUser] = useState<DashboardUserItem | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // Delete User Dialog State
  const [deleteTargetUser, setDeleteTargetUser] = useState<DashboardUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.data);
      }
    } catch {
      toast.error("Gagal memuat daftar akun akses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialUsers.length === 0) {
      fetchUsers();
    }
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newDisplayName.trim() || !newPassword.trim()) {
      toast.error("Semua kolom formulir akun wajib diisi.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsSubmittingCreate(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim().toLowerCase(),
          displayName: newDisplayName.trim(),
          password: newPassword.trim(),
          role: newRole,
          guestScope: newRole === "parent" ? "parent" : "couple",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat akun.");
      }

      toast.success(`Akun "${newDisplayName}" berhasil dibuat.`);
      setIsCreateOpen(false);
      setNewUsername("");
      setNewDisplayName("");
      setNewPassword("");
      setNewRole("parent");
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat akun baru.");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !resetNewPassword.trim()) return;

    if (resetNewPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }

    setIsSubmittingReset(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resetTargetUser.id,
          password: resetNewPassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui kata sandi.");
      }

      toast.success(`Kata sandi akun "${resetTargetUser.displayName}" berhasil diperbarui.`);
      setResetTargetUser(null);
      setResetNewPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui kata sandi.");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteTargetUser) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users?id=${deleteTargetUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus akun.");
      }

      toast.success(`Akun "${deleteTargetUser.displayName}" berhasil dihapus.`);
      setDeleteTargetUser(null);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus akun.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#6B1222]" />
                <span>Akun Akses Dashboard</span>
              </CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm text-slate-600">
                Kelola hak akses terpisah untuk Mempelai (Admin) dan Orang Tua. Akun Orang Tua hanya memiliki wewenang mengelola daftar tamu keluarga dan mengirim pesan WhatsApp.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={isLoading}
                title="Muat ulang daftar akun"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Segarkan</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="bg-[#6B1222] hover:bg-[#520D1A] text-white font-semibold"
              >
                <UserPlus className="h-4 w-4" />
                <span>Tambah Akun</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {users.map((u) => {
              const isAdmin = u.role === "admin";
              return (
                <div
                  key={u.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                        isAdmin
                          ? "bg-rose-100 text-[#6B1222]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isAdmin ? <Shield className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm truncate">
                          {u.displayName}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                            isAdmin
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          {isAdmin ? "Admin Mempelai" : "Akun Orang Tua"}
                        </Badge>
                        {u.isActive ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                            Nonaktif
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-slate-600">@{u.username}</span>
                        <span>•</span>
                        <span>
                          Lingkup tamu: <strong>{u.guestScope === "couple" ? "Tamu Mempelai" : "Tamu Orang Tua"}</strong>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setResetTargetUser(u);
                        setResetNewPassword("");
                      }}
                      className="text-xs h-8"
                    >
                      <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                      <span>Ubah sandi</span>
                    </Button>

                    {u.username !== "admin" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteTargetUser(u)}
                        className="text-xs h-8 text-rose-700 hover:text-rose-800 hover:bg-rose-50 border-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Tambah Akun Baru */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">Tambah Akun Dashboard</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Buat akun kredensial terpisah untuk Orang Tua atau Mempelai dengan hak akses terisolasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="displayName">Nama Tampilan *</Label>
              <Input
                id="displayName"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Misal: Orang Tua Fauzan / Orang Tua Sinta"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Nama yang akan muncul di pojok dashboard akun ini.
              </p>
            </div>

            <div>
              <Label htmlFor="newUsername">Nama Pengguna (Username) *</Label>
              <Input
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Misal: orangtua, keluarga, sinta-parent"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Digunakan untuk login di halaman /dashboard/login (huruf kecil dan angka).
              </p>
            </div>

            <div>
              <Label htmlFor="newPassword">Kata Sandi (Password) *</Label>
              <Input
                id="newPassword"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div>
              <Label htmlFor="newRole">Peran Akun *</Label>
              <select
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "parent" | "admin")}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B1222]"
              >
                <option value="parent">Akun Orang Tua (Khusus Tamu &amp; Kirim WhatsApp)</option>
                <option value="admin">Admin Mempelai (Akses Lengkap Seluruh Fitur)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Akun Orang Tua hanya dapat melihat dan mengelola daftar tamu miliknya sendiri.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isSubmittingCreate}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingCreate}
                className="bg-[#6B1222] hover:bg-[#520D1A] text-white font-semibold"
              >
                {isSubmittingCreate ? "Menyimpan..." : "Buat Akun"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Ubah Kata Sandi */}
      <Dialog open={Boolean(resetTargetUser)} onOpenChange={(open) => !open && setResetTargetUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">Ubah Kata Sandi</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Perbarui kata sandi untuk akun <strong>{resetTargetUser?.displayName}</strong> (@{resetTargetUser?.username}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="resetNewPassword">Kata Sandi Baru *</Label>
              <Input
                id="resetNewPassword"
                type="text"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetTargetUser(null)}
                disabled={isSubmittingReset}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingReset}
                className="bg-[#6B1222] hover:bg-[#520D1A] text-white font-semibold"
              >
                {isSubmittingReset ? "Menyimpan..." : "Simpan Sandi Baru"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog: Konfirmasi Hapus Akun */}
      <AlertDialog open={Boolean(deleteTargetUser)} onOpenChange={(open) => !open && setDeleteTargetUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun <strong>{deleteTargetUser?.displayName}</strong> (@{deleteTargetUser?.username}) akan dihapus secara permanen. Pengguna tidak akan dapat masuk kembali ke dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Menghapus..." : "Hapus Akun"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
