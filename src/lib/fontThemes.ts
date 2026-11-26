export const FONT_THEME_VALUES = ["classic", "javanese", "latin"] as const;

export type FontTheme = (typeof FONT_THEME_VALUES)[number];

export const DEFAULT_FONT_THEME: FontTheme = "classic";

export function normalizeFontTheme(value: unknown): FontTheme {
  if (typeof value !== "string") return DEFAULT_FONT_THEME;
  const normalized = value.trim().toLowerCase();
  if ((FONT_THEME_VALUES as readonly string[]).includes(normalized)) {
    return normalized as FontTheme;
  }
  return DEFAULT_FONT_THEME;
}

export const JAVANESE_SCRIPT_ACCENTS = {
  cover: "ꦱꦸꦒꦼꦁꦫꦮꦸꦃ",
  hero: "ꦥꦮꦶꦮꦲꦤ꧀",
  couple: "ꦥꦁꦒꦶꦃ",
  event: "ꦲꦕꦫ",
  envelope: "ꦠꦭꦶꦲꦱꦶꦃ",
  rsvp: "ꦢꦺꦴꦔꦥꦔꦺꦱ꧀ꦠꦸ",
  closing: "ꦩꦠꦸꦂꦤꦸꦮꦸꦤ꧀",
} as const;

export type JavaneseAccentKey = keyof typeof JAVANESE_SCRIPT_ACCENTS;

export interface FontThemeOption {
  id: FontTheme;
  label: string;
  badge: string;
  fontSummary: string;
  description: string;
  previewDisplay: string;
  previewSubtitle: string;
  previewJavanese?: string;
}

export const FONT_THEME_OPTIONS: readonly FontThemeOption[] = [
  {
    id: "classic",
    label: "Klasik Jawa",
    badge: "Bawaan",
    fontSummary: "Cormorant Garamond · Plus Jakarta Sans",
    description:
      "Komposisi bawaan undangan dengan huruf serif tegas untuk judul serta sans-serif bersih untuk teks informasi.",
    previewDisplay: "Fauzan & Sinta",
    previewSubtitle: "Akad Nikah · Minggu, 03 Jan 2027",
  },
  {
    id: "javanese",
    label: "Aksara Jawa & Keraton",
    badge: "Tradisional",
    fontSummary: "Aksara Jawa · Philosopher · Lora",
    description:
      "Menambahkan aksen Aksara Jawa asli di pembuka setiap bagian, dipadukan huruf Philosopher dan Lora.",
    previewDisplay: "Fauzan & Sinta",
    previewSubtitle: "Akad Nikah · Minggu, 03 Jan 2027",
    previewJavanese: JAVANESE_SCRIPT_ACCENTS.cover,
  },
  {
    id: "latin",
    label: "Kaligrafi Latin",
    badge: "Romantis",
    fontSummary: "Great Vibes · Playfair Display",
    description:
      "Menampilkan nama mempelai dan judul bagian bergaya huruf sambung kaligrafi, dengan subjudul serif editorial.",
    previewDisplay: "Fauzan & Sinta",
    previewSubtitle: "Akad Nikah · Minggu, 03 Jan 2027",
  },
] as const;
