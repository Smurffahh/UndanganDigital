"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, User, ArrowRight, Loader2, Heart } from "lucide-react";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan kata sandi wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login gagal");
      }

      toast.success("Login berhasil! Mengalihkan ke dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat login";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("fauzan-sinta-2027");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-cream via-[#fdf5f1] to-rose-100 p-4">
      <div className="w-full max-w-md bg-surface-white border border-gold-500/35 rounded-3xl shadow-[0_24px_50px_-18px_rgba(93,58,65,0.25)] p-7 sm:p-9 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-300/30 to-transparent rounded-bl-full pointer-events-none" />

        <div className="text-center mb-7">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-br from-rose-700 to-rose-900 text-gold-300 grid place-items-center shadow-md mb-3.5">
            <Heart className="w-6 h-6 fill-gold-300 stroke-none" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-rose-900 leading-tight">
            Dashboard Mempelai
          </h1>
          <p className="text-xs text-muted mt-1 font-light tracking-wide">
            The Wedding of Fauzan &amp; Sinta &middot; Portal Admin
          </p>
        </div>

        {errorMessage && (
          <div
            id="login-error-msg"
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-rose-100/90 border border-rose-300 text-rose-900 text-xs flex items-center gap-2 animate-in fade-in duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-rose-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 mb-1.5"
            >
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "login-error-msg" : undefined}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "login-error-msg" : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-gold-500/35 bg-surface-white text-base sm:text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-semibold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-[transform,background-color,box-shadow] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gold-500/20 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] text-gold-700 hover:text-rose-900 font-medium underline underline-offset-4 cursor-pointer transition-colors"
          >
            Gunakan Akun Kredensial Default
          </button>
          <a
            href="/"
            className="text-[11px] text-muted hover:text-rose-800 transition-colors"
          >
            &larr; Kembali ke Halaman Undangan
          </a>
        </div>
      </div>
    </div>
  );
}
