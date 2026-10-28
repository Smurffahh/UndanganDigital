"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  Check,
} from "lucide-react";
import type { GalleryPhotoData, WeddingSettingsData } from "@/lib/db/store";

interface MediaManagementModuleProps {
  settings: WeddingSettingsData;
  gallery: GalleryPhotoData[];
  onSettingsChange: (updated: WeddingSettingsData) => void;
  onGalleryChange: (updated: GalleryPhotoData[]) => void;
}

export function MediaManagementModule({
  settings,
  gallery,
  onSettingsChange,
  onGalleryChange,
}: MediaManagementModuleProps) {
  // Main Photos state
  const [mainPhotos, setMainPhotos] = useState({
    coverPhotoUrl: settings.coverPhotoUrl,
    heroPhotoUrl: settings.heroPhotoUrl,
    bridePhotoUrl: settings.bridePhotoUrl,
    groomPhotoUrl: settings.groomPhotoUrl,
    qrisImageUrl: settings.qrisImageUrl,
  });
  const [isSavingMain, setIsSavingMain] = useState(false);

  // Gallery Photo modal / form state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [newGalleryAspect, setNewGalleryAspect] = useState("3/4");
  const [isSubmittingGallery, setIsSubmittingGallery] = useState(false);

  // File upload helper converting file to data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof mainPhotos | "gallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (field === "gallery") {
        setNewGalleryUrl(result);
      } else {
        setMainPhotos((prev) => ({ ...prev, [field]: result }));
        toast.info("Gambar berhasil dimuat, jangan lupa klik 'Simpan Foto Utama'");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Main Photos
  const handleSaveMainPhotos = async () => {
    setIsSavingMain(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainPhotos }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan foto utama");
      }

      onSettingsChange({ ...settings, ...mainPhotos });
      toast.success("Foto utama berhasil diperbarui dan disinkronkan ke halaman publik! ✓");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      toast.error(msg);
    } finally {
      setIsSavingMain(false);
    }
  };

  // Add new gallery photo
  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) {
      toast.error("URL gambar atau file foto wajib diisi");
      return;
    }

    setIsSubmittingGallery(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: newGalleryUrl.trim(),
          caption: newGalleryCaption.trim(),
          aspectRatio: newGalleryAspect,
          sortOrder: gallery.length + 1,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menambahkan foto galeri");
      }

      onGalleryChange([...gallery, data.data]);
      setNewGalleryUrl("");
      setNewGalleryCaption("");
      setIsAddingGallery(false);
      toast.success("Foto galeri baru berhasil ditambahkan! ✓");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan foto";
      toast.error(msg);
    } finally {
      setIsSubmittingGallery(false);
    }
  };

  // Delete gallery photo
  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri?")) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus foto");
      }

      onGalleryChange(gallery.filter((g) => g.id !== id));
      toast.success("Foto galeri berhasil dihapus ✓");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus";
      toast.error(msg);
    }
  };

  // Reorder gallery photo
  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const copy = [...gallery];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    onGalleryChange(copy);
    toast.info("Urutan foto diperbarui");
  };

  return (
    <div className="space-y-10">
      {/* ============================================================ */}
      {/* 1. Pengaturan Foto Utama */}
      {/* ============================================================ */}
      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gold-600" />
              Foto Utama &amp; Profil Mempelai
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Atur foto sampul, foto mihrab, potret kedua mempelai, dan kode QRIS. Perubahan langsung tampil di halaman publik.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveMainPhotos}
            disabled={isSavingMain}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#b98a35] via-[#e9d3a3] to-[#c9a24b] text-[#443114] text-xs font-bold tracking-[0.16em] uppercase shadow-sm transition-transform active:scale-[0.96] hover:brightness-105 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSavingMain ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2]" />
                <span>Simpan Foto Utama</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Foto Sampul (01-cover) */}
          <div className="p-4 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#fffcf9] to-cream/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 block mb-1">
                Seksi 01-Cover
              </span>
              <h3 className="font-serif font-semibold text-base text-rose-900 mb-3">
                Foto Sampul Utama
              </h3>

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-rose-100 border border-gold-500/30 mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPhotos.coverPhotoUrl}
                  alt="Sampul"
                  className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              </div>

              <label className="block text-[11px] font-medium text-muted mb-1">
                URL Gambar:
              </label>
              <input
                type="text"
                value={mainPhotos.coverPhotoUrl}
                onChange={(e) =>
                  setMainPhotos((p) => ({ ...p, coverPhotoUrl: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500 mb-2"
              />
            </div>

            <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "coverPhotoUrl")}
                className="hidden"
              />
            </label>
          </div>

          {/* Card: Foto Mempelai Wanita (03-mempelai) */}
          <div className="p-4 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#fffcf9] to-cream/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 block mb-1">
                Seksi 03-Mempelai
              </span>
              <h3 className="font-serif font-semibold text-base text-rose-900 mb-3">
                Foto Dian (Mempelai Wanita)
              </h3>

              <div className="aspect-[3/4] max-w-[180px] mx-auto rounded-xl overflow-hidden bg-rose-100 border border-gold-500/30 mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPhotos.bridePhotoUrl}
                  alt="Dian"
                  className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              </div>

              <label className="block text-[11px] font-medium text-muted mb-1">
                URL Gambar:
              </label>
              <input
                type="text"
                value={mainPhotos.bridePhotoUrl}
                onChange={(e) =>
                  setMainPhotos((p) => ({ ...p, bridePhotoUrl: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500 mb-2"
              />
            </div>

            <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "bridePhotoUrl")}
                className="hidden"
              />
            </label>
          </div>

          {/* Card: Foto Mempelai Pria (03-mempelai) */}
          <div className="p-4 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#fffcf9] to-cream/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 block mb-1">
                Seksi 03-Mempelai
              </span>
              <h3 className="font-serif font-semibold text-base text-rose-900 mb-3">
                Foto Iqbal (Mempelai Pria)
              </h3>

              <div className="aspect-[3/4] max-w-[180px] mx-auto rounded-xl overflow-hidden bg-rose-100 border border-gold-500/30 mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPhotos.groomPhotoUrl}
                  alt="Iqbal"
                  className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              </div>

              <label className="block text-[11px] font-medium text-muted mb-1">
                URL Gambar:
              </label>
              <input
                type="text"
                value={mainPhotos.groomPhotoUrl}
                onChange={(e) =>
                  setMainPhotos((p) => ({ ...p, groomPhotoUrl: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500 mb-2"
              />
            </div>

            <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "groomPhotoUrl")}
                className="hidden"
              />
            </label>
          </div>

          {/* Card: Foto Mihrab Hitung Mundur (02-hitung-mundur) */}
          <div className="p-4 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#fffcf9] to-cream/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 block mb-1">
                Seksi 02-Hitung Mundur
              </span>
              <h3 className="font-serif font-semibold text-base text-rose-900 mb-3">
                Foto Hero Mihrab
              </h3>

              <div className="aspect-[4/5] max-w-[180px] mx-auto rounded-xl overflow-hidden bg-rose-100 border border-gold-500/30 mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPhotos.heroPhotoUrl}
                  alt="Hero Mihrab"
                  className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              </div>

              <label className="block text-[11px] font-medium text-muted mb-1">
                URL Gambar:
              </label>
              <input
                type="text"
                value={mainPhotos.heroPhotoUrl}
                onChange={(e) =>
                  setMainPhotos((p) => ({ ...p, heroPhotoUrl: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500 mb-2"
              />
            </div>

            <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "heroPhotoUrl")}
                className="hidden"
              />
            </label>
          </div>

          {/* Card: Gambar Kode QRIS (07-amplop) */}
          <div className="p-4 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#fffcf9] to-cream/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 block mb-1">
                Seksi 07-Amplop
              </span>
              <h3 className="font-serif font-semibold text-base text-rose-900 mb-3">
                Kode QRIS Amplop Digital
              </h3>

              <div className="aspect-square max-w-[180px] mx-auto rounded-xl overflow-hidden bg-white p-2 border border-gold-500/30 mb-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPhotos.qrisImageUrl}
                  alt="QRIS"
                  className="w-full h-full object-contain outline outline-1 -outline-offset-1 outline-black/10"
                />
              </div>

              <label className="block text-[11px] font-medium text-muted mb-1">
                URL Gambar:
              </label>
              <input
                type="text"
                value={mainPhotos.qrisImageUrl}
                onChange={(e) =>
                  setMainPhotos((p) => ({ ...p, qrisImageUrl: e.target.value }))
                }
                className="w-full px-3 py-1.5 rounded-lg border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500 mb-2"
              />
            </div>

            <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File QRIS</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "qrisImageUrl")}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. Manajemen Koleksi Foto Galeri (05-galeri) */}
      {/* ============================================================ */}
      <section className="p-5 sm:p-7 rounded-3xl bg-surface-white border border-gold-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif font-bold text-xl text-rose-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gold-600" />
              Koleksi Galeri Momen ({gallery.length} Foto)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Tambah, susun urutan, edit caption, atau hapus foto galeri pre-wedding.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingGallery(!isAddingGallery)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-700 text-white text-xs font-semibold tracking-wider transition-transform active:scale-[0.96] hover:bg-rose-800 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Tambah Foto Galeri</span>
          </button>
        </div>

        {/* Add photo form modal / inline panel */}
        {isAddingGallery && (
          <form
            onSubmit={handleAddGalleryPhoto}
            className="p-5 mb-7 rounded-2xl border border-gold-500/40 bg-cream/60 space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="font-serif font-bold text-base text-rose-900">
              Unggah / Tambah Foto Galeri Baru
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mb-1">
                  URL Gambar:
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500"
                />
                <div className="mt-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/40 bg-surface-white text-xs font-medium text-gold-600 hover:bg-rose-100 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Atau Pilih File Komputer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "gallery")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mb-1">
                  Caption / Keterangan Foto:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dian &amp; Iqbal berbaring di padang rumput"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500"
                />

                <label className="block text-[11px] font-semibold tracking-wider uppercase text-gold-600 mt-3 mb-1">
                  Rasio Aspek:
                </label>
                <select
                  value={newGalleryAspect}
                  onChange={(e) => setNewGalleryAspect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold-500/35 bg-surface-white text-xs text-ink focus:outline-none focus:border-rose-500"
                >
                  <option value="3/4">Portrait (3:4)</option>
                  <option value="1/1">Square (1:1)</option>
                  <option value="4/5">Portrait Lebar (4:5)</option>
                  <option value="16/9">Landscape (16:9)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingGallery(false)}
                className="px-4 py-2 rounded-full border border-gold-500/30 text-muted text-xs hover:bg-rose-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmittingGallery}
                className="px-5 py-2 rounded-full bg-rose-700 text-white text-xs font-bold tracking-wider hover:bg-rose-800 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingGallery ? "Menambahkan..." : "Tambahkan ke Galeri"}
              </button>
            </div>
          </form>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map((item, idx) => (
            <div
              key={item.id}
              className="p-2.5 rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#fffcf9] to-cream/30 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-rose-100 border border-gold-500/30 mb-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.caption || ""}
                    className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                    loading="lazy"
                  />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                </div>

                <p className="text-[10px] text-muted line-clamp-2 mb-2 italic" title={item.caption || ""}>
                  {item.caption || "(Tanpa keterangan)"}
                </p>
              </div>

              {/* Actions: Reorder & Delete */}
              <div className="flex items-center justify-between border-t border-gold-500/20 pt-2 mt-auto">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    aria-label="Pindahkan ke atas"
                    className="p-1 rounded-md text-gold-600 hover:bg-rose-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === gallery.length - 1}
                    aria-label="Pindahkan ke bawah"
                    className="p-1 rounded-md text-gold-600 hover:bg-rose-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteGallery(item.id)}
                  aria-label="Hapus foto dari galeri"
                  className="p-1 rounded-md text-rose-600 hover:bg-rose-100 hover:text-rose-800 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
