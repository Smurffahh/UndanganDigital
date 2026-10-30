import * as XLSX from "xlsx";
import { toast } from "sonner";

export interface TemplateGuestSample {
  Nama_Tamu: string;
  Nomor_WhatsApp: string;
  Kategori: string;
}

export const SAMPLE_GUEST_DATA: TemplateGuestSample[] = [
  {
    Nama_Tamu: "Bpk. H. Budi Santoso & Keluarga",
    Nomor_WhatsApp: "081234567890",
    Kategori: "Keluarga Fauzan",
  },
  {
    Nama_Tamu: "Ibu Siti Rahmawati, S.Pd",
    Nomor_WhatsApp: "6281398765432",
    Kategori: "Keluarga Sinta",
  },
  {
    Nama_Tamu: "Andi Wijaya & Partner",
    Nomor_WhatsApp: "085711223344",
    Kategori: "Sahabat / Rekan Kerja",
  },
];

export const PANDUAN_PENGISIAN_ROWS = [
  ["Kolom", "Ketentuan & Format", "Contoh Pengisian"],
  ["Nama_Tamu", "Wajib diisi (minimal 2 karakter). Boleh menyertakan gelar atau '& Keluarga'.", "Bpk. H. Budi Santoso & Keluarga"],
  ["Nomor_WhatsApp", "Wajib diisi nomor WhatsApp aktif (10-15 digit). Boleh diawali 08..., 628..., atau +628...", "081234567890"],
  ["Kategori", "Opsional. Kelompok tamu (Keluarga Fauzan, Keluarga Sinta, VIP, Sahabat, dll). Default: Reguler", "Keluarga Fauzan"],
  ["Tips Excel", "Kolom Nomor_WhatsApp sudah dikunci format Teks (@) agar angka 0 di depan tidak hilang otomatis.", "Ketik langsung nomor tanpa tanda kutip"],
];

export function downloadExcelTemplate(): void {
  try {
    const wb = XLSX.utils.book_new();

    const dataRows = [
      ["Nama_Tamu", "Nomor_WhatsApp", "Kategori"],
      ...SAMPLE_GUEST_DATA.map((item) => [item.Nama_Tamu, item.Nomor_WhatsApp, item.Kategori]),
    ];

    const wsData = XLSX.utils.aoa_to_sheet(dataRows);

    wsData["!cols"] = [
      { wch: 35 },
      { wch: 22 },
      { wch: 25 },
    ];

    // Locking text format '@' on phone column prevents Excel from trimming leading zero or converting to scientific notation
    for (let r = 0; r < dataRows.length; r++) {
      const cellRef = XLSX.utils.encode_cell({ c: 1, r });
      if (wsData[cellRef]) {
        wsData[cellRef].t = "s";
        wsData[cellRef].z = "@";
      }
    }

    XLSX.utils.book_append_sheet(wb, wsData, "Daftar_Tamu");

    const wsPanduan = XLSX.utils.aoa_to_sheet(PANDUAN_PENGISIAN_ROWS);
    wsPanduan["!cols"] = [
      { wch: 20 },
      { wch: 65 },
      { wch: 35 },
    ];
    XLSX.utils.book_append_sheet(wb, wsPanduan, "Panduan_Pengisian");

    XLSX.writeFile(wb, "template-tamu-fauzan-sinta.xlsx");
    toast.success("Template Excel daftar tamu berhasil diunduh! ✓");
  } catch (error) {
    console.error("Gagal mengunduh template Excel:", error);
    toast.error("Gagal mengunduh template Excel. Silakan coba kembali.");
  }
}

export function downloadCsvTemplate(): void {
  try {
    const headers = ["Nama_Tamu", "Nomor_WhatsApp", "Kategori"];
    const rows = SAMPLE_GUEST_DATA.map((item) => [
      `"${item.Nama_Tamu.replace(/"/g, '""')}"`,
      item.Nomor_WhatsApp,
      `"${item.Kategori.replace(/"/g, '""')}"`,
    ]);

    const csvBody = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    // UTF-8 Byte Order Mark (\uFEFF) ensures Excel on Windows renders UTF-8 characters properly
    const blob = new Blob(["\uFEFF" + csvBody], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template-tamu-fauzan-sinta.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Template CSV daftar tamu berhasil diunduh! ✓");
  } catch (error) {
    console.error("Gagal mengunduh template CSV:", error);
    toast.error("Gagal mengunduh template CSV. Silakan coba kembali.");
  }
}
