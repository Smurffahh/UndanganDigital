import fs from "fs";
import path from "path";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "./index";
import * as schema from "./schema";
import {
  DEFAULT_WEDDING_SETTINGS,
  DEFAULT_GALLERY_PHOTOS,
  DEFAULT_RSVP_WISHES,
} from "./seed-data";
import {
  encryptField,
  decryptField,
  createBlindIndex,
  createPhoneBlindIndex,
} from "../crypto";
import { formatGuestSlug } from "../guestUtils";
import { seedDatabase } from "./seed";

export type WeddingSettingsData = typeof DEFAULT_WEDDING_SETTINGS;
export type GalleryPhotoData = typeof DEFAULT_GALLERY_PHOTOS[number];
export type RsvpWishData = {
  id: number;
  guestName: string;
  attendanceStatus: string;
  paxCount: number | null;
  message: string;
  isApproved?: boolean | null;
  createdAt: Date | string;
};
export type GuestData = {
  id: number;
  name: string;
  slugQuery: string;
  whatsappNumber: string | null;
  category: string | null;
  nameBindex?: string | null;
  waBindex?: string | null;
  waSentStatus: boolean | null;
  waSentAt: Date | string | null;
  ownerScope?: string;
  createdBy?: string | null;
  createdAt: Date | string;
};

interface LocalDatabase {
  settings: {
    [key: string]: any;
    bankAccounts: any;
    giftAddress: any;
  };
  gallery: GalleryPhotoData[];
  wishes: any[];
  guests: any[];
  musicTracks?: schema.MusicTrack[];
  users?: any[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "wedding-db.json");

function decryptGuestRecord(r: any): GuestData {
  const decryptedName = decryptField(r.name);
  const slug = r.slugQuery || formatGuestSlug(decryptedName);

  return {
    id: r.id,
    name: decryptedName,
    slugQuery: slug,
    whatsappNumber: r.whatsappNumber ? decryptField(r.whatsappNumber) : null,
    category: r.category ? decryptField(r.category) : "Reguler",
    nameBindex: r.nameBindex || createBlindIndex(decryptedName),
    waBindex: r.waBindex || (r.whatsappNumber ? createPhoneBlindIndex(decryptField(r.whatsappNumber)) : null),
    waSentStatus: Boolean(r.waSentStatus),
    waSentAt: r.waSentAt || null,
    ownerScope: r.ownerScope || "couple",
    createdBy: r.createdBy || null,
    createdAt: r.createdAt || new Date(),
  };
}

function sanitizeArabicOrthography<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/وَجَعELَ/g, "وَجَعَلَ") as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeArabicOrthography(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeArabicOrthography(val);
    }
    return sanitized as T;
  }
  return value;
}

function decryptWishRecord(r: any): RsvpWishData {
  return {
    id: r.id,
    guestName: sanitizeArabicOrthography(decryptField(r.guestName)),
    attendanceStatus: r.attendanceStatus,
    paxCount: r.paxCount,
    message: sanitizeArabicOrthography(decryptField(r.message)),
    isApproved: r.isApproved ?? true,
    createdAt: r.createdAt || new Date(),
  };
}

function decryptSettingsRecord(row: any): WeddingSettingsData {
  let bankAccounts = DEFAULT_WEDDING_SETTINGS.bankAccounts;
  if (row.bankAccounts) {
    if (typeof row.bankAccounts === "string") {
      try {
        const decryptedStr = decryptField(row.bankAccounts);
        bankAccounts = JSON.parse(decryptedStr);
      } catch {
        bankAccounts = DEFAULT_WEDDING_SETTINGS.bankAccounts;
      }
    } else {
      bankAccounts = row.bankAccounts;
    }
  }

  let giftAddress = DEFAULT_WEDDING_SETTINGS.giftAddress;
  if (row.giftAddress) {
    if (typeof row.giftAddress === "string") {
      try {
        const decryptedStr = decryptField(row.giftAddress);
        giftAddress = JSON.parse(decryptedStr);
      } catch {
        giftAddress = DEFAULT_WEDDING_SETTINGS.giftAddress;
      }
    } else {
      giftAddress = row.giftAddress;
    }
  }

  let ewallets = DEFAULT_WEDDING_SETTINGS.ewallets;
  if (row.ewallets) {
    if (typeof row.ewallets === "string") {
      try {
        const decryptedStr = decryptField(row.ewallets);
        ewallets = JSON.parse(decryptedStr);
      } catch {
        ewallets = DEFAULT_WEDDING_SETTINGS.ewallets;
      }
    } else {
      ewallets = row.ewallets;
    }
  }

  const strOrFallback = (val: any, fallback: string): string => {
    if (val === null || val === undefined) return fallback;
    return String(val);
  };

  const boolOrFallback = (val: any, fallback: boolean): boolean => {
    if (val === null || val === undefined) return fallback;
    return Boolean(val);
  };

  return sanitizeArabicOrthography({
    brideName: (strOrFallback(row.brideName, DEFAULT_WEDDING_SETTINGS.brideName)).trim() || DEFAULT_WEDDING_SETTINGS.brideName,
    brideBio: strOrFallback(row.brideBio, DEFAULT_WEDDING_SETTINGS.brideBio),
    bridePhotoUrl: strOrFallback(row.bridePhotoUrl, DEFAULT_WEDDING_SETTINGS.bridePhotoUrl),
    groomName: (strOrFallback(row.groomName, DEFAULT_WEDDING_SETTINGS.groomName)).trim() || DEFAULT_WEDDING_SETTINGS.groomName,
    groomBio: strOrFallback(row.groomBio, DEFAULT_WEDDING_SETTINGS.groomBio),
    groomPhotoUrl: strOrFallback(row.groomPhotoUrl, DEFAULT_WEDDING_SETTINGS.groomPhotoUrl),
    coverPhotoUrl: strOrFallback(row.coverPhotoUrl, DEFAULT_WEDDING_SETTINGS.coverPhotoUrl),
    heroPhotoUrl: strOrFallback(row.heroPhotoUrl, DEFAULT_WEDDING_SETTINGS.heroPhotoUrl),
    weddingDateIso: (strOrFallback(row.weddingDateIso, DEFAULT_WEDDING_SETTINGS.weddingDateIso)).trim() || DEFAULT_WEDDING_SETTINGS.weddingDateIso,
    eventDateLabel: strOrFallback(row.eventDateLabel, DEFAULT_WEDDING_SETTINGS.eventDateLabel),
    akadTime: strOrFallback(row.akadTime, DEFAULT_WEDDING_SETTINGS.akadTime),
    resepsiTime: strOrFallback(row.resepsiTime, DEFAULT_WEDDING_SETTINGS.resepsiTime),
    venueName: strOrFallback(row.venueName, DEFAULT_WEDDING_SETTINGS.venueName),
    venueAddress: strOrFallback(row.venueAddress, DEFAULT_WEDDING_SETTINGS.venueAddress),
    venuePlusCode: strOrFallback(row.venuePlusCode, DEFAULT_WEDDING_SETTINGS.venuePlusCode),
    googleMapsUrl: strOrFallback(row.googleMapsUrl, DEFAULT_WEDDING_SETTINGS.googleMapsUrl),
    googleMapsEmbed: strOrFallback(row.googleMapsEmbed, DEFAULT_WEDDING_SETTINGS.googleMapsEmbed),
    mapsLatitude: strOrFallback(row.mapsLatitude, DEFAULT_WEDDING_SETTINGS.mapsLatitude),
    mapsLongitude: strOrFallback(row.mapsLongitude, DEFAULT_WEDDING_SETTINGS.mapsLongitude),
    youtubeVideoId: strOrFallback(row.youtubeVideoId, DEFAULT_WEDDING_SETTINGS.youtubeVideoId),
    musicEnabled: boolOrFallback(row.musicEnabled, DEFAULT_WEDDING_SETTINGS.musicEnabled),
    musicTitle: strOrFallback(row.musicTitle, DEFAULT_WEDDING_SETTINGS.musicTitle),
    musicSourceType: (row.musicSourceType ?? DEFAULT_WEDDING_SETTINGS.musicSourceType) as any,
    musicUrl: strOrFallback(row.musicUrl, DEFAULT_WEDDING_SETTINGS.musicUrl),
    bankAccounts,
    ewallets,
    giftAddress,
    qrisImageUrl: strOrFallback(row.qrisImageUrl, DEFAULT_WEDDING_SETTINGS.qrisImageUrl),
    loveStoryText: strOrFallback(row.loveStoryText, DEFAULT_WEDDING_SETTINGS.loveStoryText),
    storyHashtag: strOrFallback(row.storyHashtag, DEFAULT_WEDDING_SETTINGS.storyHashtag),
    coupleVisualMode: (row.coupleVisualMode ?? DEFAULT_WEDDING_SETTINGS.coupleVisualMode) as any,
    svgCharacterPreset: (row.svgCharacterPreset ?? DEFAULT_WEDDING_SETTINGS.svgCharacterPreset) as any,
    isGalleryEnabled: boolOrFallback(row.isGalleryEnabled, DEFAULT_WEDDING_SETTINGS.isGalleryEnabled),
    isLoveStoryEnabled: boolOrFallback(row.isLoveStoryEnabled, DEFAULT_WEDDING_SETTINGS.isLoveStoryEnabled),
    groomChildOrder: strOrFallback(row.groomChildOrder, DEFAULT_WEDDING_SETTINGS.groomChildOrder),
    groomParents: strOrFallback(row.groomParents, DEFAULT_WEDDING_SETTINGS.groomParents),
    brideChildOrder: strOrFallback(row.brideChildOrder, DEFAULT_WEDDING_SETTINGS.brideChildOrder),
    brideParents: strOrFallback(row.brideParents, DEFAULT_WEDDING_SETTINGS.brideParents),
    waMessageTemplate: strOrFallback(row.waMessageTemplate, DEFAULT_WEDDING_SETTINGS.waMessageTemplate),
    showTasyakuran: boolOrFallback(row.showTasyakuran, DEFAULT_WEDDING_SETTINGS.showTasyakuran),
    tasyakuranTitle: strOrFallback(row.tasyakuranTitle, DEFAULT_WEDDING_SETTINGS.tasyakuranTitle),
    tasyakuranStartDate: strOrFallback(row.tasyakuranStartDate, DEFAULT_WEDDING_SETTINGS.tasyakuranStartDate),
    tasyakuranEndDate: strOrFallback(row.tasyakuranEndDate, DEFAULT_WEDDING_SETTINGS.tasyakuranEndDate),
    tasyakuranTime: strOrFallback(row.tasyakuranTime, DEFAULT_WEDDING_SETTINGS.tasyakuranTime),
    tasyakuranSameLocation: boolOrFallback(row.tasyakuranSameLocation, DEFAULT_WEDDING_SETTINGS.tasyakuranSameLocation),
    tasyakuranVenue: strOrFallback(row.tasyakuranVenue, DEFAULT_WEDDING_SETTINGS.tasyakuranVenue),
    tasyakuranAddress: strOrFallback(row.tasyakuranAddress, DEFAULT_WEDDING_SETTINGS.tasyakuranAddress),
    tasyakuranMapsUrl: strOrFallback(row.tasyakuranMapsUrl, DEFAULT_WEDDING_SETTINGS.tasyakuranMapsUrl),
  });
}

function migrateLocalDbIfNecessary(data: LocalDatabase): boolean {
  let modified = false;

  if (data.settings) {
    if (data.settings.bankAccounts && typeof data.settings.bankAccounts !== "string") {
      data.settings.bankAccounts = encryptField(JSON.stringify(data.settings.bankAccounts));
      modified = true;
    }
    if (data.settings.ewallets && typeof data.settings.ewallets !== "string") {
      data.settings.ewallets = encryptField(JSON.stringify(data.settings.ewallets));
      modified = true;
    }
    if (data.settings.giftAddress && typeof data.settings.giftAddress !== "string") {
      data.settings.giftAddress = encryptField(JSON.stringify(data.settings.giftAddress));
      modified = true;
    }
    if (data.settings.weddingDateIso === "2027-01-10T08:00:00+07:00") {
      data.settings.weddingDateIso = "2027-01-03T08:00:00+07:00";
      data.settings.eventDateLabel = "Minggu · 03 · Januari · 2027";
      modified = true;
    }
    if (data.settings.googleMapsUrl && data.settings.googleMapsUrl.includes("Bang+Zali")) {
      data.settings.googleMapsUrl = "https://maps.app.goo.gl/HFXpTdshy7Vhwoxs8";
      data.settings.mapsLatitude = "-7.310076";
      data.settings.mapsLongitude = "109.296186";
      data.settings.googleMapsEmbed = "https://maps.google.com/maps?q=-7.310076,109.296186&z=17&output=embed";
      modified = true;
    }
    if (!data.settings.musicSourceType) {
      data.settings.musicEnabled = true;
      data.settings.musicTitle = "Raim Laode — Komang (Official Romantic Wedding Theme)";
      data.settings.musicSourceType = "preset";
      data.settings.musicUrl = "/audio/raim-laode-komang.mp3";
      modified = true;
    }
    const settingsStr = JSON.stringify(data.settings);
    if (settingsStr.includes("وَجَعELَ")) {
      data.settings = sanitizeArabicOrthography(data.settings);
      modified = true;
    }
  }

  if (data.guests && Array.isArray(data.guests)) {
    for (const g of data.guests) {
      if (g.name && !String(g.name).startsWith("enc:v1:")) {
        const plainName = String(g.name);
        const plainPhone = g.whatsappNumber ? String(g.whatsappNumber) : "";
        g.name = encryptField(plainName);
        g.nameBindex = createBlindIndex(plainName);
        if (plainPhone) {
          g.whatsappNumber = encryptField(plainPhone);
          g.waBindex = createPhoneBlindIndex(plainPhone);
        }
        if (g.category && !String(g.category).startsWith("enc:v1:")) {
          g.category = encryptField(String(g.category));
        }
        modified = true;
      }
    }
  }

  if (data.wishes && Array.isArray(data.wishes)) {
    for (const w of data.wishes) {
      if (w.guestName && !String(w.guestName).startsWith("enc:v1:")) {
        w.guestName = encryptField(w.guestName);
        w.message = encryptField(w.message);
        modified = true;
      }
    }
  }

  return modified;
}

function getLocalDb(): LocalDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed: LocalDatabase = JSON.parse(content);
      const wasMigrated = migrateLocalDbIfNecessary(parsed);
      if (wasMigrated) {
        saveLocalDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to read local wedding-db.json, re-initializing:", err);
  }

  const initialData: LocalDatabase = {
    settings: {
      ...DEFAULT_WEDDING_SETTINGS,
      bankAccounts: encryptField(JSON.stringify(DEFAULT_WEDDING_SETTINGS.bankAccounts)),
      ewallets: encryptField(JSON.stringify(DEFAULT_WEDDING_SETTINGS.ewallets)),
      giftAddress: encryptField(JSON.stringify(DEFAULT_WEDDING_SETTINGS.giftAddress)),
    },
    gallery: [...DEFAULT_GALLERY_PHOTOS],
    wishes: DEFAULT_RSVP_WISHES.map((w) => ({
      ...w,
      guestName: encryptField(w.guestName),
      message: encryptField(w.message),
    })),
    guests: [
      {
        id: 1,
        name: encryptField("Budi Santoso"),
        slugQuery: "Budi+Santoso",
        whatsappNumber: encryptField("6281234567890"),
        category: encryptField("Keluarga"),
        nameBindex: createBlindIndex("Budi Santoso"),
        waBindex: createPhoneBlindIndex("6281234567890"),
        waSentStatus: false,
        waSentAt: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: encryptField("Siti Rahma"),
        slugQuery: "Siti+Rahma",
        whatsappNumber: encryptField("6289876543210"),
        category: encryptField("Sahabat"),
        nameBindex: createBlindIndex("Siti Rahma"),
        waBindex: createPhoneBlindIndex("6289876543210"),
        waSentStatus: true,
        waSentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
  };

  saveLocalDb(initialData);
  return initialData;
}

function saveLocalDb(data: LocalDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to local wedding-db.json:", err);
  }
}

function getPostgresDb() {
  return getDb();
}

let hasEnsuredColumns = false;
async function ensureSettingsColumns() {
  if (hasEnsuredColumns) return;
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return;
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(rawUrl);
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS couple_visual_mode VARCHAR(20) DEFAULT 'photo'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS svg_character_preset VARCHAR(50) DEFAULT 'javanese-royal'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS is_gallery_enabled BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS is_love_story_enabled BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS groom_child_order VARCHAR(100) DEFAULT 'Putra Pertama'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS bride_child_order VARCHAR(100) DEFAULT 'Putri Pertama'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS groom_parents VARCHAR(255) DEFAULT 'Bapak H. Ma''ruf & Ibu Hj. Siti Aminah'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS bride_parents VARCHAR(255) DEFAULT 'Bapak H. Utami & Ibu Hj. Maria'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS show_tasyakuran BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_title VARCHAR(100) DEFAULT 'Tasyakuran'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_start_date VARCHAR(50) DEFAULT '2027-01-01'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_end_date VARCHAR(50) DEFAULT '2027-01-02'`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_time VARCHAR(100) DEFAULT ''`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_same_location BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_venue VARCHAR(255) DEFAULT ''`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_address TEXT DEFAULT ''`;
    await sql`ALTER TABLE wedding_settings ADD COLUMN IF NOT EXISTS tasyakuran_maps_url TEXT DEFAULT ''`;
    await sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS owner_scope VARCHAR(50) NOT NULL DEFAULT 'couple'`;
    await sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS created_by VARCHAR(50)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_owner_scope ON guests(owner_scope)`;
    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'parent',
        display_name VARCHAR(100) NOT NULL,
        guest_scope VARCHAR(50) NOT NULL DEFAULT 'parent',
        wa_template TEXT DEFAULT '',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_dashboard_users_username ON dashboard_users(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_dashboard_users_role ON dashboard_users(role)`;
    hasEnsuredColumns = true;
  } catch (err) {
    console.warn("Could not ensure wedding_settings columns:", err);
  }
}

export async function getWeddingSettings(): Promise<WeddingSettingsData> {
  const db = getPostgresDb();
  if (db) {
    try {
      await ensureSettingsColumns();
      const rows = await db.select().from(schema.weddingSettings).limit(1);
      if (rows.length > 0) {
        return decryptSettingsRecord(rows[0]);
      }
      await seedDatabase();
      const seeded = await db.select().from(schema.weddingSettings).limit(1);
      if (seeded.length > 0) {
        return decryptSettingsRecord(seeded[0]);
      }
    } catch (e) {
      console.warn("DB query failed, using local JSON fallback:", e);
    }
  }
  return decryptSettingsRecord(getLocalDb().settings);
}

export async function updateWeddingSettings(updates: Partial<WeddingSettingsData>): Promise<WeddingSettingsData> {
  const dbUpdates: any = sanitizeArabicOrthography({ ...updates });

  if (updates.bankAccounts !== undefined) {
    dbUpdates.bankAccounts = encryptField(JSON.stringify(updates.bankAccounts));
  }
  if (updates.ewallets !== undefined) {
    dbUpdates.ewallets = encryptField(JSON.stringify(updates.ewallets));
  }
  if (updates.giftAddress !== undefined) {
    dbUpdates.giftAddress = encryptField(JSON.stringify(updates.giftAddress));
  }

  const db = getPostgresDb();
  if (db) {
    try {
      await ensureSettingsColumns();
      const existing = await db.select().from(schema.weddingSettings).limit(1);
      let updatedRow: any = null;

      if (existing.length > 0) {
        const rows = await db
          .update(schema.weddingSettings)
          .set({ ...dbUpdates, updatedAt: new Date() })
          .where(eq(schema.weddingSettings.id, existing[0].id))
          .returning();
        if (rows.length > 0) {
          updatedRow = rows[0];
        }
      } else {
        const rows = await db.insert(schema.weddingSettings).values(dbUpdates).returning();
        if (rows.length > 0) {
          updatedRow = rows[0];
        }
      }

      const local = getLocalDb();
      local.settings = { ...local.settings, ...dbUpdates };
      saveLocalDb(local);

      if (updatedRow) {
        return decryptSettingsRecord(updatedRow);
      }
    } catch (e) {
      console.warn("DB update failed, updating local JSON:", e);
    }
  }

  const local = getLocalDb();
  local.settings = { ...local.settings, ...dbUpdates };
  saveLocalDb(local);
  return decryptSettingsRecord(local.settings);
}

export async function getGalleryPhotos(): Promise<GalleryPhotoData[]> {
  const db = getPostgresDb();
  if (db) {
    try {
      let rows = await db
        .select()
        .from(schema.galleryPhotos)
        .orderBy(schema.galleryPhotos.sortOrder);
      if (rows.length === 0) {
        await seedDatabase();
        rows = await db
          .select()
          .from(schema.galleryPhotos)
          .orderBy(schema.galleryPhotos.sortOrder);
      }
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          imageUrl: r.imageUrl,
          caption: r.caption || "",
          aspectRatio: r.aspectRatio || "3/4",
          sortOrder: r.sortOrder ?? 0,
        }));
      }
    } catch (e) {
      console.warn("DB gallery query failed, using local JSON fallback:", e);
    }
  }
  return getLocalDb().gallery;
}

export async function createGalleryPhoto(item: Omit<GalleryPhotoData, "id">): Promise<GalleryPhotoData> {
  const db = getPostgresDb();
  if (db) {
    try {
      const [inserted] = await db
        .insert(schema.galleryPhotos)
        .values({
          imageUrl: item.imageUrl,
          caption: item.caption,
          aspectRatio: item.aspectRatio,
          sortOrder: item.sortOrder,
        })
        .returning();
      return {
        id: inserted.id,
        imageUrl: inserted.imageUrl,
        caption: inserted.caption || "",
        aspectRatio: inserted.aspectRatio || "3/4",
        sortOrder: inserted.sortOrder ?? 0,
      };
    } catch (e) {
      console.warn("DB gallery insert failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const nextId = local.gallery.reduce((max, g) => Math.max(max, g.id), 0) + 1;
  const newPhoto: GalleryPhotoData = { id: nextId, ...item };
  local.gallery.push(newPhoto);
  saveLocalDb(local);
  return newPhoto;
}

export async function deleteGalleryPhoto(id: number): Promise<boolean> {
  const db = getPostgresDb();
  if (db) {
    try {
      await db.delete(schema.galleryPhotos).where(eq(schema.galleryPhotos.id, id));
      return true;
    } catch (e) {
      console.warn("DB gallery delete failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  local.gallery = local.gallery.filter((g) => g.id !== id);
  saveLocalDb(local);
  return true;
}

export async function getRsvpWishes(): Promise<RsvpWishData[]> {
  const db = getPostgresDb();
  if (db) {
    try {
      let rows = await db
        .select()
        .from(schema.rsvpWishes)
        .orderBy(desc(schema.rsvpWishes.createdAt));
      if (rows.length === 0) {
        await seedDatabase();
        rows = await db
          .select()
          .from(schema.rsvpWishes)
          .orderBy(desc(schema.rsvpWishes.createdAt));
      }
      return rows.map(decryptWishRecord);
    } catch (e) {
      console.warn("DB wishes query failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  return local.wishes
    .map(decryptWishRecord)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createRsvpWish(data: {
  guestName: string;
  attendanceStatus: string;
  paxCount: number;
  message: string;
}): Promise<RsvpWishData> {
  const encryptedName = encryptField(data.guestName.trim());
  const encryptedMsg = encryptField(data.message.trim());

  const db = getPostgresDb();
  if (db) {
    try {
      const [inserted] = await db
        .insert(schema.rsvpWishes)
        .values({
          guestName: encryptedName,
          attendanceStatus: data.attendanceStatus,
          paxCount: data.paxCount,
          message: encryptedMsg,
        })
        .returning();
      return decryptWishRecord(inserted);
    } catch (e) {
      console.warn("DB insert wish failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const nextId = local.wishes.reduce((max, w) => Math.max(max, w.id), 0) + 1;
  const newRawWish = {
    id: nextId,
    guestName: encryptedName,
    attendanceStatus: data.attendanceStatus,
    paxCount: data.paxCount,
    message: encryptedMsg,
    isApproved: true,
    createdAt: new Date().toISOString(),
  };
  local.wishes.unshift(newRawWish);
  saveLocalDb(local);
  return decryptWishRecord(newRawWish);
}

export async function deleteRsvpWish(id: number): Promise<boolean> {
  const db = getPostgresDb();
  if (db) {
    try {
      await db.delete(schema.rsvpWishes).where(eq(schema.rsvpWishes.id, id));
      return true;
    } catch (e) {
      console.warn("DB delete wish failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  local.wishes = local.wishes.filter((w) => w.id !== id);
  saveLocalDb(local);
  return true;
}

export async function getGuests(scope?: string): Promise<GuestData[]> {
  const db = getPostgresDb();
  if (db) {
    try {
      let rows;
      if (scope && scope !== "all") {
        rows = await db
          .select()
          .from(schema.guests)
          .where(eq(schema.guests.ownerScope, scope))
          .orderBy(desc(schema.guests.createdAt));
      } else {
        rows = await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
      }
      if (rows.length === 0 && (!scope || scope === "all" || scope === "couple")) {
        await seedDatabase();
        if (scope && scope !== "all") {
          rows = await db
            .select()
            .from(schema.guests)
            .where(eq(schema.guests.ownerScope, scope))
            .orderBy(desc(schema.guests.createdAt));
        } else {
          rows = await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
        }
      }
      return rows.map(decryptGuestRecord);
    } catch (e) {
      console.warn("DB guests query failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  let list = local.guests.map(decryptGuestRecord);
  if (scope && scope !== "all") {
    list = list.filter((g) => (g.ownerScope || "couple") === scope);
  }
  return list;
}

export async function createGuest(data: {
  name: string;
  whatsappNumber?: string | null;
  category?: string;
  ownerScope?: string;
  createdBy?: string | null;
}): Promise<GuestData> {
  const cleanName = data.name.trim();
  const slugQuery = formatGuestSlug(cleanName);
  const cleanPhone = data.whatsappNumber?.trim() || null;
  const category = data.category?.trim() || "Reguler";
  const ownerScope = data.ownerScope?.trim() || "couple";
  const createdBy = data.createdBy?.trim() || null;

  const encName = encryptField(cleanName);
  const encPhone = cleanPhone ? encryptField(cleanPhone) : null;
  const encCategory = encryptField(category);
  const nameBindex = createBlindIndex(cleanName);
  const waBindex = cleanPhone ? createPhoneBlindIndex(cleanPhone) : null;

  const db = getPostgresDb();
  if (db) {
    try {
      // HMAC-SHA256 blind index enables deduplication within the same scope
      if (waBindex) {
        const existing = await db
          .select()
          .from(schema.guests)
          .where(and(eq(schema.guests.waBindex, waBindex), eq(schema.guests.ownerScope, ownerScope)))
          .limit(1);
        if (existing.length > 0) {
          const [updated] = await db
            .update(schema.guests)
            .set({ name: encName, category: encCategory, createdBy })
            .where(eq(schema.guests.id, existing[0].id))
            .returning();
          return decryptGuestRecord(updated);
        }
      }
      if (nameBindex) {
        const existing = await db
          .select()
          .from(schema.guests)
          .where(and(eq(schema.guests.nameBindex, nameBindex), eq(schema.guests.ownerScope, ownerScope)))
          .limit(1);
        if (existing.length > 0) {
          const updates: any = {};
          if (cleanPhone) {
            updates.whatsappNumber = encPhone;
            updates.waBindex = waBindex;
          }
          if (category) {
            updates.category = encCategory;
          }
          if (createdBy) {
            updates.createdBy = createdBy;
          }
          if (Object.keys(updates).length > 0) {
            const [updated] = await db
              .update(schema.guests)
              .set(updates)
              .where(eq(schema.guests.id, existing[0].id))
              .returning();
            return decryptGuestRecord(updated);
          }
          return decryptGuestRecord(existing[0]);
        }
      }

      const [inserted] = await db
        .insert(schema.guests)
        .values({
          name: encName,
          slugQuery,
          whatsappNumber: encPhone,
          category: encCategory,
          nameBindex,
          waBindex,
          waSentStatus: false,
          waSentAt: null,
          ownerScope,
          createdBy,
        })
        .returning();
      return decryptGuestRecord(inserted);
    } catch (e) {
      console.warn("DB insert guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();

  if (waBindex) {
    const existingIdx = local.guests.findIndex(
      (g) => g.waBindex === waBindex && (g.ownerScope || "couple") === ownerScope
    );
    if (existingIdx !== -1) {
      local.guests[existingIdx] = {
        ...local.guests[existingIdx],
        name: encName,
        category: encCategory,
        createdBy,
      };
      saveLocalDb(local);
      return decryptGuestRecord(local.guests[existingIdx]);
    }
  }
  if (nameBindex) {
    const existingIdx = local.guests.findIndex(
      (g) => g.nameBindex === nameBindex && (g.ownerScope || "couple") === ownerScope
    );
    if (existingIdx !== -1) {
      if (cleanPhone) {
        local.guests[existingIdx].whatsappNumber = encPhone;
        local.guests[existingIdx].waBindex = waBindex;
      }
      if (category) {
        local.guests[existingIdx].category = encCategory;
      }
      if (createdBy) {
        local.guests[existingIdx].createdBy = createdBy;
      }
      saveLocalDb(local);
      return decryptGuestRecord(local.guests[existingIdx]);
    }
  }

  const nextId = local.guests.reduce((max, g) => Math.max(max, g.id), 0) + 1;
  const newRawGuest = {
    id: nextId,
    name: encName,
    slugQuery,
    whatsappNumber: encPhone,
    category: encCategory,
    nameBindex,
    waBindex,
    waSentStatus: false,
    waSentAt: null,
    ownerScope,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  local.guests.unshift(newRawGuest);
  saveLocalDb(local);
  return decryptGuestRecord(newRawGuest);
}

export async function updateGuest(
  id: number,
  updates: Partial<Omit<GuestData, "id" | "createdAt">>,
  expectedScope?: string
): Promise<GuestData | null> {
  const dbUpdates: any = { ...updates };

  if (updates.name !== undefined) {
    const cleanName = updates.name.trim();
    dbUpdates.name = encryptField(cleanName);
    dbUpdates.slugQuery = formatGuestSlug(cleanName);
    dbUpdates.nameBindex = createBlindIndex(cleanName);
  }
  if (updates.whatsappNumber !== undefined) {
    const cleanPhone = updates.whatsappNumber?.trim() || null;
    dbUpdates.whatsappNumber = cleanPhone ? encryptField(cleanPhone) : null;
    dbUpdates.waBindex = cleanPhone ? createPhoneBlindIndex(cleanPhone) : null;
  }
  if (updates.category !== undefined) {
    dbUpdates.category = encryptField(updates.category?.trim() || "Reguler");
  }

  const db = getPostgresDb();
  if (db) {
    try {
      const condition = expectedScope
        ? and(eq(schema.guests.id, id), eq(schema.guests.ownerScope, expectedScope))
        : eq(schema.guests.id, id);

      const [updated] = await db
        .update(schema.guests)
        .set(dbUpdates)
        .where(condition)
        .returning();
      if (!updated) return null;
      return decryptGuestRecord(updated);
    } catch (e) {
      console.warn("DB update guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const idx = local.guests.findIndex((g) => {
    if (g.id !== id) return false;
    if (expectedScope && (g.ownerScope || "couple") !== expectedScope) return false;
    return true;
  });
  if (idx === -1) return null;

  local.guests[idx] = {
    ...local.guests[idx],
    ...dbUpdates,
    waSentAt:
      updates.waSentAt instanceof Date
        ? updates.waSentAt.toISOString()
        : updates.waSentAt !== undefined
        ? updates.waSentAt
        : local.guests[idx].waSentAt,
  };
  saveLocalDb(local);
  return decryptGuestRecord(local.guests[idx]);
}

export async function deleteGuest(id: number, expectedScope?: string): Promise<boolean> {
  const db = getPostgresDb();
  if (db) {
    try {
      const condition = expectedScope
        ? and(eq(schema.guests.id, id), eq(schema.guests.ownerScope, expectedScope))
        : eq(schema.guests.id, id);
      const res = await db.delete(schema.guests).where(condition).returning();
      return res.length > 0;
    } catch (e) {
      console.warn("DB delete guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const initialLength = local.guests.length;
  local.guests = local.guests.filter((g) => {
    if (g.id !== id) return true;
    if (expectedScope && (g.ownerScope || "couple") !== expectedScope) return true;
    return false;
  });
  saveLocalDb(local);
  return local.guests.length < initialLength;
}

export async function bulkUpdateGuestStatus(
  ids: number[],
  waSentStatus: boolean,
  waSentAt?: string | null,
  expectedScope?: string
): Promise<number> {
  if (!ids || ids.length === 0) return 0;

  const sentAtVal =
    waSentAt !== undefined
      ? waSentAt
        ? new Date(waSentAt)
        : null
      : waSentStatus
      ? new Date()
      : null;

  const db = getPostgresDb();
  if (db) {
    try {
      const condition = expectedScope
        ? and(inArray(schema.guests.id, ids), eq(schema.guests.ownerScope, expectedScope))
        : inArray(schema.guests.id, ids);

      const updated = await db
        .update(schema.guests)
        .set({
          waSentStatus,
          waSentAt: sentAtVal,
        })
        .where(condition)
        .returning();
      return updated.length;
    } catch (e) {
      console.warn("DB bulk update guest status failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const idSet = new Set(ids);
  let updatedCount = 0;
  local.guests = local.guests.map((g) => {
    if (idSet.has(g.id)) {
      if (!expectedScope || (g.ownerScope || "couple") === expectedScope) {
        updatedCount++;
        return {
          ...g,
          waSentStatus,
          waSentAt: sentAtVal ? sentAtVal.toISOString() : null,
        };
      }
    }
    return g;
  });
  saveLocalDb(local);
  return updatedCount;
}

export async function bulkDeleteGuests(ids: number[], expectedScope?: string): Promise<number> {
  if (!ids || ids.length === 0) return 0;

  const db = getPostgresDb();
  if (db) {
    try {
      const condition = expectedScope
        ? and(inArray(schema.guests.id, ids), eq(schema.guests.ownerScope, expectedScope))
        : inArray(schema.guests.id, ids);
      const res = await db.delete(schema.guests).where(condition).returning();
      return res.length;
    } catch (e) {
      console.warn("DB bulk delete guests failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const idSet = new Set(ids);
  const initialLength = local.guests.length;
  local.guests = local.guests.filter((g) => {
    if (!idSet.has(g.id)) return true;
    if (expectedScope && (g.ownerScope || "couple") !== expectedScope) return true;
    return false;
  });
  saveLocalDb(local);
  return initialLength - local.guests.length;
}

export async function importGuests(
  guestList: Array<{ name: string; whatsappNumber?: string | null; category?: string }>,
  ownerScope?: string,
  createdBy?: string | null
): Promise<number> {
  let count = 0;
  for (const item of guestList) {
    if (item.name && item.name.trim()) {
      await createGuest({
        ...item,
        ownerScope: ownerScope || "couple",
        createdBy: createdBy || null,
      });
      count++;
    }
  }
  return count;
}

export async function getDashboardUserByUsername(
  username: string
): Promise<schema.DashboardUser | null> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.dashboardUsers)
        .where(eq(schema.dashboardUsers.username, username.trim().toLowerCase()))
        .limit(1);
      if (rows.length > 0) return rows[0];
    } catch (e) {
      console.warn("DB getDashboardUserByUsername failed:", e);
    }
  }

  const local = getLocalDb();
  const found = (local.users || []).find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  return found || null;
}

export async function getDashboardUserById(
  id: number
): Promise<schema.DashboardUser | null> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.dashboardUsers)
        .where(eq(schema.dashboardUsers.id, id))
        .limit(1);
      if (rows.length > 0) return rows[0];
    } catch (e) {
      console.warn("DB getDashboardUserById failed:", e);
    }
  }

  const local = getLocalDb();
  const found = (local.users || []).find((u) => u.id === id);
  return found || null;
}

export async function getDashboardUsers(): Promise<
  Array<Omit<schema.DashboardUser, "passwordHash">>
> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db
        .select({
          id: schema.dashboardUsers.id,
          username: schema.dashboardUsers.username,
          role: schema.dashboardUsers.role,
          displayName: schema.dashboardUsers.displayName,
          guestScope: schema.dashboardUsers.guestScope,
          waTemplate: schema.dashboardUsers.waTemplate,
          isActive: schema.dashboardUsers.isActive,
          tokenVersion: schema.dashboardUsers.tokenVersion,
          createdAt: schema.dashboardUsers.createdAt,
          updatedAt: schema.dashboardUsers.updatedAt,
        })
        .from(schema.dashboardUsers)
        .orderBy(schema.dashboardUsers.id);
      return rows;
    } catch (e) {
      console.warn("DB getDashboardUsers failed:", e);
    }
  }

  const local = getLocalDb();
  return (local.users || []).map(({ passwordHash, ...rest }) => ({
    tokenVersion: rest.tokenVersion || 1,
    ...rest,
  }));
}

export async function createDashboardUser(data: {
  username: string;
  passwordHash: string;
  role?: string;
  displayName: string;
  guestScope?: string;
  waTemplate?: string;
}): Promise<Omit<schema.DashboardUser, "passwordHash">> {
  const cleanUsername = data.username.trim().toLowerCase();
  const role = data.role?.trim() || "parent";
  const guestScope = data.guestScope?.trim() || "parent";

  const db = getPostgresDb();
  if (db) {
    try {
      const [inserted] = await db
        .insert(schema.dashboardUsers)
        .values({
          username: cleanUsername,
          passwordHash: data.passwordHash,
          role,
          displayName: data.displayName.trim(),
          guestScope,
          waTemplate: data.waTemplate || "",
          isActive: true,
        })
        .returning();
      const { passwordHash, ...safeUser } = inserted;
      return safeUser;
    } catch (e) {
      console.warn("DB createDashboardUser failed:", e);
      throw e;
    }
  }

  const local = getLocalDb();
  if (!local.users) local.users = [];
  const nextId = local.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser = {
    id: nextId,
    username: cleanUsername,
    passwordHash: data.passwordHash,
    role,
    displayName: data.displayName.trim(),
    guestScope,
    waTemplate: data.waTemplate || "",
    isActive: true,
    tokenVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  local.users.push(newUser);
  saveLocalDb(local);
  const { passwordHash, ...safeUser } = newUser;
  return safeUser;
}

export async function updateDashboardUser(
  id: number,
  updates: Partial<{
    passwordHash: string;
    displayName: string;
    role: string;
    guestScope: string;
    waTemplate: string;
    isActive: boolean;
    tokenVersion: number;
  }>
): Promise<Omit<schema.DashboardUser, "passwordHash"> | null> {
  const dbUpdates: any = { ...updates, updatedAt: new Date() };

  const db = getPostgresDb();
  if (db) {
    try {
      const [updated] = await db
        .update(schema.dashboardUsers)
        .set(dbUpdates)
        .where(eq(schema.dashboardUsers.id, id))
        .returning();
      if (!updated) return null;
      const { passwordHash, ...safeUser } = updated;
      return safeUser;
    } catch (e) {
      console.warn("DB updateDashboardUser failed:", e);
    }
  }

  const local = getLocalDb();
  if (!local.users) local.users = [];
  const idx = local.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  local.users[idx] = { ...local.users[idx], ...dbUpdates };
  saveLocalDb(local);
  const { passwordHash, ...safeUser } = local.users[idx];
  return safeUser;
}

export async function deleteDashboardUser(id: number): Promise<boolean> {
  const db = getPostgresDb();
  if (db) {
    try {
      const res = await db
        .delete(schema.dashboardUsers)
        .where(eq(schema.dashboardUsers.id, id))
        .returning();
      return res.length > 0;
    } catch (e) {
      console.warn("DB deleteDashboardUser failed:", e);
    }
  }

  const local = getLocalDb();
  if (!local.users) return false;
  const initialLength = local.users.length;
  local.users = local.users.filter((u) => u.id !== id);
  saveLocalDb(local);
  return local.users.length < initialLength;
}

export async function updateUserWaTemplate(username: string, waTemplate: string): Promise<boolean> {
  const db = getPostgresDb();
  if (db) {
    try {
      const [updated] = await db
        .update(schema.dashboardUsers)
        .set({ waTemplate, updatedAt: new Date() })
        .where(eq(schema.dashboardUsers.username, username.trim().toLowerCase()))
        .returning();
      return Boolean(updated);
    } catch (e) {
      console.warn("DB updateUserWaTemplate failed:", e);
    }
  }

  const local = getLocalDb();
  if (!local.users) return false;
  const idx = local.users.findIndex((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  if (idx === -1) return false;
  local.users[idx].waTemplate = waTemplate;
  local.users[idx].updatedAt = new Date();
  saveLocalDb(local);
  return true;
}

export async function getMusicTracks(): Promise<schema.MusicTrack[]> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.musicTracks)
        .where(eq(schema.musicTracks.isActive, true))
        .orderBy(schema.musicTracks.id);
      if (rows.length > 0) return rows;
    } catch {}
  }

  const local = getLocalDb();
  if (local.musicTracks && local.musicTracks.length > 0) {
    return local.musicTracks.filter((t) => t.isActive);
  }

  return [];
}

export async function syncMusicTracks(
  trackList: Array<{
    slug: string;
    title: string;
    artist: string;
    url: string;
    isActive?: boolean;
  }>
): Promise<number> {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS music_tracks (
          id SERIAL PRIMARY KEY,
          slug VARCHAR(120) NOT NULL UNIQUE,
          title VARCHAR(150) NOT NULL,
          artist VARCHAR(150) NOT NULL,
          url TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_music_tracks_slug ON music_tracks(slug);
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_music_tracks_is_active ON music_tracks(is_active);
      `;

      for (const track of trackList) {
        const isActive = track.isActive ?? true;
        await sql`
          INSERT INTO music_tracks (slug, title, artist, url, is_active, created_at)
          VALUES (${track.slug}, ${track.title}, ${track.artist}, ${track.url}, ${isActive}, NOW())
          ON CONFLICT (slug) DO UPDATE
          SET title = EXCLUDED.title,
              artist = EXCLUDED.artist,
              url = EXCLUDED.url,
              is_active = EXCLUDED.is_active;
        `;
      }
    } catch (e) {
      console.warn("DB music_tracks sync warning:", e);
    }
  }

  const local = getLocalDb();
  const existingMap = new Map<string, schema.MusicTrack>();
  if (Array.isArray(local.musicTracks)) {
    for (const t of local.musicTracks) {
      existingMap.set(t.slug, t);
    }
  }

  let nextId = Math.max(0, ...(local.musicTracks || []).map((t) => t.id)) + 1;
  for (const track of trackList) {
    const existing = existingMap.get(track.slug);
    if (existing) {
      existing.title = track.title;
      existing.artist = track.artist;
      existing.url = track.url;
      existing.isActive = track.isActive ?? true;
    } else {
      existingMap.set(track.slug, {
        id: nextId++,
        slug: track.slug,
        title: track.title,
        artist: track.artist,
        url: track.url,
        isActive: track.isActive ?? true,
        createdAt: new Date(),
      });
    }
  }

  local.musicTracks = Array.from(existingMap.values());
  saveLocalDb(local);

  return trackList.length;
}
