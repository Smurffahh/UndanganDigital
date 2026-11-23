"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMessage("Masukkan nama pengguna dan kata sandi untuk melanjutkan.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Nama pengguna atau kata sandi tidak cocok. Periksa kembali.");
      }

      toast.success("Login berhasil. Mengalihkan ke dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memverifikasi akun. Coba beberapa saat lagi.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="admin-theme min-h-screen grid place-items-center p-4 bg-slate-50">
      <Card className="w-full max-w-md border-slate-200/90 shadow-xs">
        <CardHeader className="text-center pb-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B1222]/10 text-[#6B1222]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Masuk ke Dashboard
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Fauzan &amp; Sinta — Kelola data undangan, tamu, dan acara
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div
              id="login-error-msg"
              role="alert"
              className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Nama pengguna</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  error={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? "login-error-msg" : undefined}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama pengguna"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Kata sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  error={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? "login-error-msg" : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-semibold"
              isLoading={isLoading}
            >
              {isLoading ? (
                "Memeriksa akun..."
              ) : (
                <>
                  <span>Masuk ke dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col items-center gap-2.5">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              &larr; Lihat halaman undangan
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
