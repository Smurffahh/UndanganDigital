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
} from "lucide-react";
import type { GalleryPhotoData, WeddingSettingsData } from "@/lib/db/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  const [mainPhotos, setMainPhotos] = useState({
    coverPhotoUrl: settings.coverPhotoUrl,
    heroPhotoUrl: settings.heroPhotoUrl,
    bridePhotoUrl: settings.bridePhotoUrl,
    groomPhotoUrl: settings.groomPhotoUrl,
    qrisImageUrl: settings.qrisImageUrl,
  });
  const [isSavingMain, setIsSavingMain] = useState(false);

  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [newGalleryAspect, setNewGalleryAspect] = useState("3/4");
  const [isSubmittingGallery, setIsSubmittingGallery] = useState(false);
  const [isTogglingGallery, setIsTogglingGallery] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhotoData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isGalleryEnabled = settings.isGalleryEnabled !== false;

  const handleToggleGallery = async (checked: boolean) => {
    setIsTogglingGallery(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isGalleryEnabled: checked }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah status galeri.");
      }
      onSettingsChange({ ...settings, isGalleryEnabled: checked });
      toast.success(
        checked
          ? "Galeri foto diaktifkan pada undangan publik."
          : "Galeri foto disembunyikan dari undangan publik."
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status galeri.");
    } finally {
      setIsTogglingGallery(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof mainPhotos | "gallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (field === "gallery") {
        setNewGalleryUrl(result);
      } else {
        setMainPhotos((prev) => ({ ...prev, [field]: result }));
        toast.info("Gambar dimuat. Klik 'Simpan foto utama' untuk menyimpan.");
      }
    };
    reader.readAsDataURL(file);
  };

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
        throw new Error(data.error || "Gagal menyimpan foto utama.");
      }

      onSettingsChange({ ...settings, ...mainPhotos });
      toast.success("Foto utama berhasil disimpan.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan foto utama.";
      toast.error(msg);
    } finally {
      setIsSavingMain(false);
    }
  };

  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) {
      toast.error("URL atau file foto wajib diisi.");
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
        throw new Error(data.error || "Gagal menambahkan foto ke galeri.");
      }

      onGalleryChange([...gallery, data.data]);
      setNewGalleryUrl("");
      setNewGalleryCaption("");
      setIsAddingGallery(false);
      toast.success("Foto baru berhasil ditambahkan ke galeri.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan foto.";
      toast.error(msg);
    } finally {
      setIsSubmittingGallery(false);
    }
  };

  const confirmDeleteGallery = async () => {
    if (!photoToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media?id=${photoToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus foto.");
      }

      onGalleryChange(gallery.filter((g) => g.id !== photoToDelete.id));
      toast.success("Foto berhasil dihapus dari galeri.");
      setPhotoToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus foto.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const copy = [...gallery];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    onGalleryChange(copy);
    toast.info("Urutan foto diperbarui.");
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#6B1222]" />
                Foto Utama &amp; Profil Mempelai
              </CardTitle>
              <CardDescription className="mt-0.5">
                Atur foto sampul, foto kedua mempelai, dan kode QRIS tanda kasih.
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={handleSaveMainPhotos}
              isLoading={isSavingMain}
              size="sm"
              className="font-semibold self-start sm:self-auto"
            >
              <Save className="h-4 w-4" />
              <span>Simpan foto utama</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Sampul Depan
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Foto Sampul Utama
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Ditampilkan pada latar awal saat tamu pertama kali menerima undangan.
                </p>

                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainPhotos.coverPhotoUrl}
                    alt="Foto Sampul"
                    className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                  />
                </div>

                <Label htmlFor="coverPhotoUrl" className="text-[11px] text-slate-600 mb-1 block">
                  URL gambar
                </Label>
                <Input
                  id="coverPhotoUrl"
                  type="text"
                  value={mainPhotos.coverPhotoUrl}
                  onChange={(e) =>
                    setMainPhotos((p) => ({ ...p, coverPhotoUrl: e.target.value }))
                  }
                  className="mb-2 h-9 text-xs"
                />
              </div>

              <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-slate-400" />
                <span>Pilih file gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "coverPhotoUrl")}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Mempelai Pria
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Foto Fauzan Ma&apos;ruf
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Ditampilkan pada profil mempelai pria.
                </p>

                <div className="aspect-[3/4] max-w-[160px] mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainPhotos.groomPhotoUrl}
                    alt="Fauzan"
                    className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                  />
                </div>

                <Label htmlFor="groomPhotoUrl" className="text-[11px] text-slate-600 mb-1 block">
                  URL gambar
                </Label>
                <Input
                  id="groomPhotoUrl"
                  type="text"
                  value={mainPhotos.groomPhotoUrl}
                  onChange={(e) =>
                    setMainPhotos((p) => ({ ...p, groomPhotoUrl: e.target.value }))
                  }
                  className="mb-2 h-9 text-xs"
                />
              </div>

              <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-slate-400" />
                <span>Pilih file gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "groomPhotoUrl")}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Mempelai Wanita
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Foto Sinta Maria Utami
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Ditampilkan pada profil mempelai wanita.
                </p>

                <div className="aspect-[3/4] max-w-[160px] mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainPhotos.bridePhotoUrl}
                    alt="Sinta"
                    className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                  />
                </div>

                <Label htmlFor="bridePhotoUrl" className="text-[11px] text-slate-600 mb-1 block">
                  URL gambar
                </Label>
                <Input
                  id="bridePhotoUrl"
                  type="text"
                  value={mainPhotos.bridePhotoUrl}
                  onChange={(e) =>
                    setMainPhotos((p) => ({ ...p, bridePhotoUrl: e.target.value }))
                  }
                  className="mb-2 h-9 text-xs"
                />
              </div>

              <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-slate-400" />
                <span>Pilih file gambar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "bridePhotoUrl")}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Tanda Kasih
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Kode QRIS
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Ditampilkan pada modal QRIS amplop digital saat tamu memberi tanda kasih.
                </p>

                <div className="aspect-square max-w-[160px] mx-auto rounded-xl overflow-hidden bg-white p-2 border border-slate-200 mb-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainPhotos.qrisImageUrl}
                    alt="QRIS"
                    className="w-full h-full object-contain outline outline-1 -outline-offset-1 outline-black/10"
                  />
                </div>

                <Label htmlFor="qrisImageUrl" className="text-[11px] text-slate-600 mb-1 block">
                  URL gambar
                </Label>
                <Input
                  id="qrisImageUrl"
                  type="text"
                  value={mainPhotos.qrisImageUrl}
                  onChange={(e) =>
                    setMainPhotos((p) => ({ ...p, qrisImageUrl: e.target.value }))
                  }
                  className="mb-2 h-9 text-xs"
                />
              </div>

              <label className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-slate-400" />
                <span>Pilih file QRIS</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "qrisImageUrl")}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#6B1222]" />
                Koleksi Galeri Foto ({gallery.length} Foto)
              </CardTitle>
              <CardDescription className="mt-0.5">
                Koleksi momen bahagia pada seksi Galeri di undangan publik.
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={() => setIsAddingGallery(!isAddingGallery)}
              size="sm"
              variant="outline"
              className="self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah foto galeri</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900">
                  Tampilkan seksi Galeri pada undangan publik
                </h4>
                <Badge variant={isGalleryEnabled ? "success" : "outline"} size="sm">
                  {isGalleryEnabled ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 max-w-[560px] leading-relaxed">
                {isGalleryEnabled
                  ? "Seksi galeri foto dan tombol navigasi Galeri ditampilkan pada halaman publik."
                  : "Seksi galeri foto disembunyikan dari halaman publik (foto yang sudah diunggah tetap tersimpan aman)."}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={isGalleryEnabled}
                onCheckedChange={handleToggleGallery}
                disabled={isTogglingGallery}
                aria-label="Tampilkan seksi Galeri"
              />
            </div>
          </div>

          {isAddingGallery && (
            <form
              onSubmit={handleAddGalleryPhoto}
              className="p-4 rounded-xl border border-slate-300 bg-white space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-900">
                Tambah Foto Galeri Baru
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="galleryUrl">URL gambar</Label>
                  <Input
                    id="galleryUrl"
                    type="text"
                    placeholder="https://..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="mb-2"
                  />
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer">
                      <Upload className="h-3.5 w-3.5 text-slate-400" />
                      <span>Pilih file komputer</span>
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
                  <Label htmlFor="galleryCaption">Keterangan foto</Label>
                  <Input
                    id="galleryCaption"
                    type="text"
                    placeholder="Contoh: Momen pre-wedding di studio"
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    className="mb-3"
                  />

                  <Label htmlFor="galleryAspect">Rasio aspek</Label>
                  <select
                    id="galleryAspect"
                    value={newGalleryAspect}
                    onChange={(e) => setNewGalleryAspect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-base md:text-sm text-slate-900 focus:outline-none focus:border-[#6B1222] focus:ring-2 focus:ring-[#6B1222]/15"
                  >
                    <option value="3/4">Portrait (3:4)</option>
                    <option value="1/1">Persegi (1:1)</option>
                    <option value="4/5">Portrait Lebar (4:5)</option>
                    <option value="16/9">Landscape (16:9)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingGallery(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSubmittingGallery}
                >
                  {isSubmittingGallery ? "Menambahkan..." : "Tambahkan ke galeri"}
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {gallery.map((item, idx) => (
              <div
                key={item.id}
                className="p-2 rounded-xl border border-slate-200 bg-white flex flex-col justify-between group shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 mb-2 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.caption || ""}
                      className="w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                      loading="lazy"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-2" title={item.caption || ""}>
                    {item.caption || "(Tanpa keterangan)"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 mt-auto">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      aria-label="Pindahkan ke atas"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === gallery.length - 1}
                      aria-label="Pindahkan ke bawah"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPhotoToDelete(item)}
                    aria-label="Hapus foto dari galeri"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(photoToDelete)} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus foto dari galeri?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto ini akan dihapus dari koleksi galeri dan tidak akan lagi ditampilkan pada halaman undangan publik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteGallery}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isDeleting ? "Menghapus..." : "Hapus foto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
