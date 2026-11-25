import * as XLSX from "xlsx";
import { toast } from "sonner";
import type { GuestData } from "./db/store";
import { sanitizeCellForSpreadsheet } from "./phoneUtils";
import { formatWaEventDate } from "./dateFormat";

export interface TemplateGuestSample {
  Nama_Tamu: string;
  Nomor_WhatsApp: string;
  Kategori: string;
}

export const DEFAULT_COUPLE_WA_TEMPLATE = `Kepada Yth.
*{nama_tamu}*

_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *{nama_tamu}* untuk menghadiri acara pernikahan kami:

*Fauzan & Sinta*

Untuk informasi lengkap mengenai waktu dan lokasi acara, silakan kunjungi tautan berikut:
{link_undangan}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Mohon maaf apabila undangan hanya dapat dibagikan melalui pesan ini.

Terima kasih banyak atas perhatian dan doanya.

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_

Kami yang berbahagia,
*Fauzan & Sinta*`;

export const DEFAULT_PARENT_WA_TEMPLATE = `Kepada Yth.
*{nama_tamu}*

_Assalamu'alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami sekeluarga mengundang Bapak/Ibu/Saudara/i *{nama_tamu}* untuk menghadiri acara pernikahan putra-putri kami:

*Fauzan & Sinta*

Untuk informasi lengkap mengenai waktu dan lokasi acara, silakan kunjungi tautan berikut:
{link_undangan}

Merupakan suatu kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Mohon maaf apabila undangan hanya dapat dibagikan melalui pesan ini.

Terima kasih banyak atas perhatian dan doanya.

_Wassalamu'alaikum Warahmatullahi Wabarakatuh_

Kami yang berbahagia,
*{pengirim}*`;

export function getDefaultWaTemplate(role?: string, coupleDefaultTemplate?: string): string {
  if (role === "parent") {
    return DEFAULT_PARENT_WA_TEMPLATE;
  }
  return coupleDefaultTemplate || DEFAULT_COUPLE_WA_TEMPLATE;
}

export interface RenderWaMessageOptions {
  template: string;
  guestName: string;
  guestToken?: string | null;
  baseUrl?: string;
  groomName?: string;
  brideName?: string;
  weddingDateIso?: string;
  venueName?: string;
  venueAddress?: string;
  displayName?: string;
  role?: string;
}

export function renderWaMessage(options: RenderWaMessageOptions): string {
  const {
    template,
    guestName,
    guestToken,
    baseUrl = "https://www.fauzansinta.my.id",
    groomName = "Fauzan",
    brideName = "Sinta",
    weddingDateIso,
    venueName = "",
    venueAddress = "",
    displayName,
    role,
  } = options;

  const token = guestToken || "";
  const link = token ? `${baseUrl}/?kpd=${token}` : baseUrl;
  const groomShort = groomName.trim().split(" ")[0] || "Fauzan";
  const brideShort = brideName.trim().split(" ")[0] || "Sinta";
  const mempelai = `${groomShort} & ${brideShort}`;
  const isParent = role === "parent";
  const defaultSender = isParent
    ? displayName?.trim() || "Keluarga Besar Orang Tua Mempelai"
    : mempelai;

  const eventDate = weddingDateIso ? formatWaEventDate(weddingDateIso) : "";
  const eventVenue = [venueName, venueAddress].filter(Boolean).join(", ");

  return template
    .replace(/{nama_tamu}/g, guestName)
    .replace(/{nama}/g, guestName)
    .replace(/{link_undangan}/g, link)
    .replace(/{link}/g, link)
    .replace(/{nama_mempelai}/g, mempelai)
    .replace(/{mempelai}/g, mempelai)
    .replace(/{tanggal_acara}/g, eventDate)
    .replace(/{lokasi_acara}/g, eventVenue)
    .replace(/{pengirim}/g, defaultSender);
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
  ["Nomor_WhatsApp", "Opsional. Nomor WhatsApp aktif (10-15 digit). Boleh diawali 08..., 628..., atau +628... Boleh dikosongkan.", "081234567890"],
  ["Kategori", "Opsional. Kelompok tamu (Keluarga Fauzan, Keluarga Sinta, VIP, Sahabat, dll). Default: Reguler", "Keluarga Fauzan"],
  ["Tips Excel", "Kolom Nomor_WhatsApp sudah dikunci format Teks (@) agar angka 0 di depan tidak hilang otomatis.", "Ketik langsung nomor tanpa tanda kutip"],
];

function formatExportDate(dateVal: Date | string | null | undefined): string {
  if (!dateVal) return "-";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(dateVal);
  }
}

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
      `"'${item.Nomor_WhatsApp}"`,
      `"${item.Kategori.replace(/"/g, '""')}"`,
    ]);

    const csvBody = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

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

export function exportGuestsToExcel(guests: GuestData[], baseUrl?: string): Buffer | void {
  try {
    if (guests.length === 0) {
      toast.error("Daftar tamu kosong, tidak ada data untuk diekspor.");
      return;
    }

    const origin =
      baseUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id");

    const wb = XLSX.utils.book_new();

    const headers = [
      "Nama Tamu",
      "No WhatsApp",
      "Kategori",
      "Link Undangan",
      "Status Kirim WA",
      "Waktu Kirim",
    ];

    const dataRows = [
      headers,
      ...guests.map((g) => {
        const link = g.slugQuery ? `${origin}/?kpd=${g.slugQuery}` : origin;
        const phone = g.whatsappNumber ? String(g.whatsappNumber) : "-";
        return [
          sanitizeCellForSpreadsheet(g.name),
          phone,
          sanitizeCellForSpreadsheet(g.category || "Reguler"),
          link,
          g.waSentStatus ? "Terkirim" : "Belum Dikirim",
          formatExportDate(g.waSentAt),
        ];
      }),
    ];

    const wsData = XLSX.utils.aoa_to_sheet(dataRows);

    wsData["!cols"] = [
      { wch: 32 },
      { wch: 20 },
      { wch: 20 },
      { wch: 45 },
      { wch: 18 },
      { wch: 22 },
    ];

    for (let r = 0; r < dataRows.length; r++) {
      const cellRef = XLSX.utils.encode_cell({ c: 1, r });
      if (wsData[cellRef]) {
        wsData[cellRef].t = "s";
        wsData[cellRef].z = "@";
      }
    }

    XLSX.utils.book_append_sheet(wb, wsData, "Daftar_Tamu");

    if (typeof window === "undefined" || typeof document === "undefined") {
      return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `daftar-tamu-undangan-${dateStr}.xlsx`);
    toast.success(`Berhasil mengekspor ${guests.length} data tamu ke Excel (.xlsx)! ✓`);
  } catch (error) {
    console.error("Gagal mengekspor data Excel:", error);
    toast.error("Gagal mengekspor data tamu ke Excel.");
  }
}

export function exportGuestsToCsv(guests: GuestData[], baseUrl?: string): Buffer | void {
  try {
    if (guests.length === 0) {
      toast.error("Daftar tamu kosong, tidak ada data untuk diekspor.");
      return;
    }

    const origin =
      baseUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://www.fauzansinta.my.id");

    const headers = [
      "Nama Tamu",
      "No WhatsApp",
      "Kategori",
      "Link Undangan",
      "Status Kirim WA",
      "Waktu Kirim",
    ];

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = guests.map((g) => {
      const link = g.slugQuery ? `${origin}/?kpd=${g.slugQuery}` : origin;
      const phone = g.whatsappNumber ? String(g.whatsappNumber) : "-";
      return [
        escapeCsv(sanitizeCellForSpreadsheet(g.name)),
        phone !== "-" ? `"'${phone}"` : `"-"`,
        escapeCsv(sanitizeCellForSpreadsheet(g.category || "Reguler")),
        escapeCsv(link),
        escapeCsv(g.waSentStatus ? "Terkirim" : "Belum Dikirim"),
        escapeCsv(formatExportDate(g.waSentAt)),
      ];
    });

    const csvBody = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    if (typeof window === "undefined" || typeof document === "undefined") {
      return Buffer.from("\uFEFF" + csvBody, "utf-8");
    }

    const blob = new Blob(["\uFEFF" + csvBody], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `daftar-tamu-undangan-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Berhasil mengekspor ${guests.length} data tamu ke CSV (.csv)! ✓`);
  } catch (error) {
    console.error("Gagal mengekspor data CSV:", error);
    toast.error("Gagal mengekspor data tamu ke CSV.");
  }
}
