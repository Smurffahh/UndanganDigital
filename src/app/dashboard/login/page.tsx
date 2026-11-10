"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, User, ArrowRight, Loader2, Heart, Eye, EyeOff, ShieldCheck } from "lucide-react";

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

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Silakan masukkan username dan kata sandi Anda.");
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
        throw new Error(data.error || "Username atau kata sandi tidak sesuai.");
      }

      toast.success("Login berhasil! Mengalihkan ke dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kendala saat memverifikasi kredensial.";
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
    <div className="min-h-screen grid place-items-center bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-100 via-stone-50 to-stone-200 p-4">
      <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-3xl shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] p-7 sm:p-9 relative overflow-hidden">
        <div className="text-center mb-7">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-[#5d3a41] text-[#fffdfa] grid place-items-center shadow-md mb-3.5 border border-[#c9a24b]/40">
            <Heart className="w-6 h-6 fill-[#c9a24b] stroke-none" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
            Dashboard Mempelai
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-sans tracking-wide">
            The Wedding of Fauzan &amp; Sinta &middot; Portal Administrasi
          </p>
        </div>

        {errorMessage && (
          <div
            id="login-error-msg"
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-stone-600 mb-1.5"
            >
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 bg-white text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#5d3a41] focus:ring-2 focus:ring-[#5d3a41]/15 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-stone-600 mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "login-error-msg" : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 bg-white text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#5d3a41] focus:ring-2 focus:ring-[#5d3a41]/15 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer transition-colors"
                title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#5d3a41] hover:bg-[#4b2f34] text-white font-semibold text-xs tracking-wider uppercase shadow-sm hover:shadow-md transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-11"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Sesi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] text-stone-600 hover:text-[#5d3a41] font-medium underline underline-offset-4 cursor-pointer transition-colors"
          >
            Gunakan Akun Kredensial Default
          </button>
          <a
            href="/"
            className="text-[11px] text-stone-400 hover:text-stone-700 transition-colors"
          >
            &larr; Kembali ke Halaman Undangan
          </a>
        </div>
      </div>
    </div>
  );
}
