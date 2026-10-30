import fs from "fs";
import path from "path";
import { desc, eq } from "drizzle-orm";
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
import { seedDatabase } from "./seed";

// Type definitions
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
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "wedding-db.json");

// Helper to decrypt a guest record
function decryptGuestRecord(r: any): GuestData {
  return {
    id: r.id,
    name: decryptField(r.name),
    slugQuery: r.slugQuery,
    whatsappNumber: r.whatsappNumber ? decryptField(r.whatsappNumber) : null,
    category: r.category ? decryptField(r.category) : "Reguler",
    nameBindex: r.nameBindex || createBlindIndex(decryptField(r.name)),
    waBindex: r.waBindex || (r.whatsappNumber ? createPhoneBlindIndex(decryptField(r.whatsappNumber)) : null),
    waSentStatus: Boolean(r.waSentStatus),
    waSentAt: r.waSentAt || null,
    createdAt: r.createdAt || new Date(),
  };
}

// Helper to decrypt a wish record
function decryptWishRecord(r: any): RsvpWishData {
  return {
    id: r.id,
    guestName: decryptField(r.guestName),
    attendanceStatus: r.attendanceStatus,
    paxCount: r.paxCount,
    message: decryptField(r.message),
    isApproved: r.isApproved ?? true,
    createdAt: r.createdAt || new Date(),
  };
}

// Helper to decrypt settings
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

  return {
    brideName: row.brideName || DEFAULT_WEDDING_SETTINGS.brideName,
    brideBirth: row.brideBirth || DEFAULT_WEDDING_SETTINGS.brideBirth,
    brideBio: row.brideBio || DEFAULT_WEDDING_SETTINGS.brideBio,
    bridePhotoUrl: row.bridePhotoUrl || DEFAULT_WEDDING_SETTINGS.bridePhotoUrl,
    groomName: row.groomName || DEFAULT_WEDDING_SETTINGS.groomName,
    groomBirth: row.groomBirth || DEFAULT_WEDDING_SETTINGS.groomBirth,
    groomBio: row.groomBio || DEFAULT_WEDDING_SETTINGS.groomBio,
    groomPhotoUrl: row.groomPhotoUrl || DEFAULT_WEDDING_SETTINGS.groomPhotoUrl,
    coverPhotoUrl: row.coverPhotoUrl || DEFAULT_WEDDING_SETTINGS.coverPhotoUrl,
    heroPhotoUrl: row.heroPhotoUrl || DEFAULT_WEDDING_SETTINGS.heroPhotoUrl,
    weddingDateIso: row.weddingDateIso || DEFAULT_WEDDING_SETTINGS.weddingDateIso,
    eventDateLabel: row.eventDateLabel || DEFAULT_WEDDING_SETTINGS.eventDateLabel,
    akadTime: row.akadTime || DEFAULT_WEDDING_SETTINGS.akadTime,
    resepsiTime: row.resepsiTime || DEFAULT_WEDDING_SETTINGS.resepsiTime,
    venueName: row.venueName || DEFAULT_WEDDING_SETTINGS.venueName,
    venueAddress: row.venueAddress || DEFAULT_WEDDING_SETTINGS.venueAddress,
    venuePlusCode: row.venuePlusCode || DEFAULT_WEDDING_SETTINGS.venuePlusCode,
    googleMapsUrl: row.googleMapsUrl || DEFAULT_WEDDING_SETTINGS.googleMapsUrl,
    googleMapsEmbed: row.googleMapsEmbed || DEFAULT_WEDDING_SETTINGS.googleMapsEmbed,
    mapsLatitude: row.mapsLatitude || DEFAULT_WEDDING_SETTINGS.mapsLatitude,
    mapsLongitude: row.mapsLongitude || DEFAULT_WEDDING_SETTINGS.mapsLongitude,
    youtubeVideoId: row.youtubeVideoId || DEFAULT_WEDDING_SETTINGS.youtubeVideoId,
    musicEnabled: row.musicEnabled !== undefined ? Boolean(row.musicEnabled) : DEFAULT_WEDDING_SETTINGS.musicEnabled,
    musicTitle: row.musicTitle || DEFAULT_WEDDING_SETTINGS.musicTitle,
    musicSourceType: row.musicSourceType || DEFAULT_WEDDING_SETTINGS.musicSourceType,
    musicUrl: row.musicUrl || DEFAULT_WEDDING_SETTINGS.musicUrl,
    bankAccounts,
    ewallets,
    giftAddress,
    qrisImageUrl: row.qrisImageUrl || DEFAULT_WEDDING_SETTINGS.qrisImageUrl,
    loveStoryText: row.loveStoryText || DEFAULT_WEDDING_SETTINGS.loveStoryText,
    storyHashtag: row.storyHashtag || DEFAULT_WEDDING_SETTINGS.storyHashtag,
    waMessageTemplate: row.waMessageTemplate || DEFAULT_WEDDING_SETTINGS.waMessageTemplate,
  };
}

// Auto-migrate plaintext rows to AES-256-GCM ciphertexts
function migrateLocalDbIfNecessary(data: LocalDatabase): boolean {
  let modified = false;

  // 1. Settings migration
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
      data.settings.musicTitle = "Shane Filan - Beautiful In White (Romantic Instrumental)";
      data.settings.musicSourceType = "preset";
      data.settings.musicUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=romantic-wedding-piano-10899.mp3";
      modified = true;
    }
  }

  // 2. Guests migration
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

  // 3. Wishes migration
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

// Helper to get or initialize local JSON database file
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

  // Initial secure encrypted data
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

// PostgreSQL Connection Helper
function getPostgresDb() {
  return getDb();
}

// -------------------------------------------------------------
// Data-Access Methods with End-to-End Field Decryption/Encryption
// -------------------------------------------------------------

export async function getWeddingSettings(): Promise<WeddingSettingsData> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.weddingSettings).limit(1);
      if (rows.length > 0) {
        return decryptSettingsRecord(rows[0]);
      }
      // If table is empty, auto-seed and query again
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
  const dbUpdates: any = { ...updates };

  // Encrypt sensitive fields if provided
  if (updates.bankAccounts) {
    dbUpdates.bankAccounts = encryptField(JSON.stringify(updates.bankAccounts));
  }
  if (updates.ewallets) {
    dbUpdates.ewallets = encryptField(JSON.stringify(updates.ewallets));
  }
  if (updates.giftAddress) {
    dbUpdates.giftAddress = encryptField(JSON.stringify(updates.giftAddress));
  }

  const db = getPostgresDb();
  if (db) {
    try {
      const existing = await db.select().from(schema.weddingSettings).limit(1);
      if (existing.length > 0) {
        await db
          .update(schema.weddingSettings)
          .set({ ...dbUpdates, updatedAt: new Date() })
          .where(eq(schema.weddingSettings.id, existing[0].id));
      } else {
        await db.insert(schema.weddingSettings).values(dbUpdates);
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

export async function getGuests(): Promise<GuestData[]> {
  const db = getPostgresDb();
  if (db) {
    try {
      let rows = await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
      if (rows.length === 0) {
        await seedDatabase();
        rows = await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
      }
      return rows.map(decryptGuestRecord);
    } catch (e) {
      console.warn("DB guests query failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  return local.guests.map(decryptGuestRecord);
}

export async function createGuest(data: {
  name: string;
  whatsappNumber?: string | null;
  category?: string;
}): Promise<GuestData> {
  const cleanName = data.name.trim();
  const slugQuery = encodeURIComponent(cleanName.replace(/\s+/g, "+"));
  const cleanPhone = data.whatsappNumber?.trim() || null;
  const category = data.category?.trim() || "Reguler";

  const encName = encryptField(cleanName);
  const encPhone = cleanPhone ? encryptField(cleanPhone) : null;
  const encCategory = encryptField(category);
  const nameBindex = createBlindIndex(cleanName);
  const waBindex = cleanPhone ? createPhoneBlindIndex(cleanPhone) : null;

  const db = getPostgresDb();
  if (db) {
    try {
      // 1. Blind index duplicate detection (fast HMAC-SHA256 lookup without decrypting entire table)
      if (waBindex) {
        const existing = await db
          .select()
          .from(schema.guests)
          .where(eq(schema.guests.waBindex, waBindex))
          .limit(1);
        if (existing.length > 0) {
          // Update category/name if changed
          const [updated] = await db
            .update(schema.guests)
            .set({ name: encName, category: encCategory, slugQuery })
            .where(eq(schema.guests.id, existing[0].id))
            .returning();
          return decryptGuestRecord(updated);
        }
      } else if (nameBindex) {
        const existing = await db
          .select()
          .from(schema.guests)
          .where(eq(schema.guests.nameBindex, nameBindex))
          .limit(1);
        if (existing.length > 0) {
          return decryptGuestRecord(existing[0]);
        }
      }

      // 2. Insert new record
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
        })
        .returning();
      return decryptGuestRecord(inserted);
    } catch (e) {
      console.warn("DB insert guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();

  // Local duplicate check
  if (waBindex) {
    const existingIdx = local.guests.findIndex((g) => g.waBindex === waBindex);
    if (existingIdx !== -1) {
      local.guests[existingIdx] = {
        ...local.guests[existingIdx],
        name: encName,
        slugQuery,
        category: encCategory,
      };
      saveLocalDb(local);
      return decryptGuestRecord(local.guests[existingIdx]);
    }
  } else if (nameBindex) {
    const existingIdx = local.guests.findIndex((g) => g.nameBindex === nameBindex);
    if (existingIdx !== -1) {
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
    createdAt: new Date().toISOString(),
  };
  local.guests.unshift(newRawGuest);
  saveLocalDb(local);
  return decryptGuestRecord(newRawGuest);
}

export async function updateGuest(
  id: number,
  updates: Partial<Omit<GuestData, "id" | "createdAt">>
): Promise<GuestData | null> {
  const dbUpdates: any = { ...updates };

  if (updates.name !== undefined) {
    const cleanName = updates.name.trim();
    dbUpdates.name = encryptField(cleanName);
    dbUpdates.slugQuery = encodeURIComponent(cleanName.replace(/\s+/g, "+"));
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
      const [updated] = await db
        .update(schema.guests)
        .set(dbUpdates)
        .where(eq(schema.guests.id, id))
        .returning();
      return decryptGuestRecord(updated);
    } catch (e) {
      console.warn("DB update guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const idx = local.guests.findIndex((g) => g.id === id);
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

export async function deleteGuest(id: number): Promise<boolean> {
  const db = getPostgresDb();
  if (db) {
    try {
      await db.delete(schema.guests).where(eq(schema.guests.id, id));
      return true;
    } catch (e) {
      console.warn("DB delete guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  local.guests = local.guests.filter((g) => g.id !== id);
  saveLocalDb(local);
  return true;
}

export async function importGuests(
  guestList: Array<{ name: string; whatsappNumber?: string | null; category?: string }>
): Promise<number> {
  let count = 0;
  for (const item of guestList) {
    if (item.name && item.name.trim()) {
      await createGuest(item);
      count++;
    }
  }
  return count;
}
