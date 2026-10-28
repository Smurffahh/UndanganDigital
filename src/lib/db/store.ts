import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { desc, eq } from "drizzle-orm";
import * as schema from "./schema";
import {
  DEFAULT_WEDDING_SETTINGS,
  DEFAULT_GALLERY_PHOTOS,
  DEFAULT_RSVP_WISHES,
} from "./seed-data";

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
  waSentStatus: boolean | null;
  waSentAt: Date | string | null;
  createdAt: Date | string;
};

interface LocalDatabase {
  settings: WeddingSettingsData;
  gallery: GalleryPhotoData[];
  wishes: RsvpWishData[];
  guests: GuestData[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "wedding-db.json");

// Helper to get or initialize local JSON database file
function getLocalDb(): LocalDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Failed to read local wedding-db.json, re-initializing:", err);
  }

  const initialData: LocalDatabase = {
    settings: { ...DEFAULT_WEDDING_SETTINGS },
    gallery: [...DEFAULT_GALLERY_PHOTOS],
    wishes: [...DEFAULT_RSVP_WISHES],
    guests: [
      {
        id: 1,
        name: "Budi Santoso",
        slugQuery: "Budi+Santoso",
        whatsappNumber: "6281234567890",
        category: "Keluarga",
        waSentStatus: false,
        waSentAt: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Siti Rahma",
        slugQuery: "Siti+Rahma",
        whatsappNumber: "6289876543210",
        category: "Sahabat",
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
let dbInstance: ReturnType<typeof drizzle> | null = null;
function getPostgresDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!dbInstance) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      dbInstance = drizzle(sql, { schema });
    } catch {
      dbInstance = null;
    }
  }
  return dbInstance;
}

// -------------------------------------------------------------
// Data-Access Methods with Local JSON Fallback
// -------------------------------------------------------------

export async function getWeddingSettings(): Promise<WeddingSettingsData> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.weddingSettings).limit(1);
      if (rows.length > 0) {
        const row = rows[0];
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
          akadTime: row.akadTime || DEFAULT_WEDDING_SETTINGS.akadTime,
          resepsiTime: row.resepsiTime || DEFAULT_WEDDING_SETTINGS.resepsiTime,
          venueName: row.venueName || DEFAULT_WEDDING_SETTINGS.venueName,
          venueAddress: row.venueAddress || DEFAULT_WEDDING_SETTINGS.venueAddress,
          venuePlusCode: row.venuePlusCode || DEFAULT_WEDDING_SETTINGS.venuePlusCode,
          googleMapsUrl: row.googleMapsUrl || DEFAULT_WEDDING_SETTINGS.googleMapsUrl,
          googleMapsEmbed: row.googleMapsEmbed || DEFAULT_WEDDING_SETTINGS.googleMapsEmbed,
          youtubeVideoId: row.youtubeVideoId || DEFAULT_WEDDING_SETTINGS.youtubeVideoId,
          bankAccounts: (row.bankAccounts as typeof DEFAULT_WEDDING_SETTINGS.bankAccounts) || DEFAULT_WEDDING_SETTINGS.bankAccounts,
          ewallets: (row.ewallets as typeof DEFAULT_WEDDING_SETTINGS.ewallets) || DEFAULT_WEDDING_SETTINGS.ewallets,
          giftAddress: (row.giftAddress as typeof DEFAULT_WEDDING_SETTINGS.giftAddress) || DEFAULT_WEDDING_SETTINGS.giftAddress,
          qrisImageUrl: row.qrisImageUrl || DEFAULT_WEDDING_SETTINGS.qrisImageUrl,
          waMessageTemplate: row.waMessageTemplate || DEFAULT_WEDDING_SETTINGS.waMessageTemplate,
        };
      }
    } catch (e) {
      console.warn("DB query failed, using local JSON fallback:", e);
    }
  }
  return getLocalDb().settings;
}

export async function updateWeddingSettings(updates: Partial<WeddingSettingsData>): Promise<WeddingSettingsData> {
  const db = getPostgresDb();
  if (db) {
    try {
      const existing = await db.select().from(schema.weddingSettings).limit(1);
      if (existing.length > 0) {
        await db
          .update(schema.weddingSettings)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(schema.weddingSettings.id, existing[0].id));
      }
    } catch (e) {
      console.warn("DB update failed, updating local JSON:", e);
    }
  }

  const local = getLocalDb();
  local.settings = { ...local.settings, ...updates };
  saveLocalDb(local);
  return local.settings;
}

export async function getGalleryPhotos(): Promise<GalleryPhotoData[]> {
  const db = getPostgresDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.galleryPhotos)
        .orderBy(schema.galleryPhotos.sortOrder);
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
      const rows = await db
        .select()
        .from(schema.rsvpWishes)
        .orderBy(desc(schema.rsvpWishes.createdAt));
      return rows.map((r) => ({
        id: r.id,
        guestName: r.guestName,
        attendanceStatus: r.attendanceStatus,
        paxCount: r.paxCount,
        message: r.message,
        isApproved: r.isApproved,
        createdAt: r.createdAt || new Date(),
      }));
    } catch (e) {
      console.warn("DB wishes query failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  return [...local.wishes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createRsvpWish(data: {
  guestName: string;
  attendanceStatus: string;
  paxCount: number;
  message: string;
}): Promise<RsvpWishData> {
  const db = getPostgresDb();
  if (db) {
    try {
      const [inserted] = await db
        .insert(schema.rsvpWishes)
        .values({
          guestName: data.guestName,
          attendanceStatus: data.attendanceStatus,
          paxCount: data.paxCount,
          message: data.message,
        })
        .returning();
      return {
        id: inserted.id,
        guestName: inserted.guestName,
        attendanceStatus: inserted.attendanceStatus,
        paxCount: inserted.paxCount,
        message: inserted.message,
        isApproved: inserted.isApproved,
        createdAt: inserted.createdAt || new Date(),
      };
    } catch (e) {
      console.warn("DB insert wish failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const nextId = local.wishes.reduce((max, w) => Math.max(max, w.id), 0) + 1;
  const newWish: RsvpWishData = {
    id: nextId,
    guestName: data.guestName,
    attendanceStatus: data.attendanceStatus,
    paxCount: data.paxCount,
    message: data.message,
    isApproved: true,
    createdAt: new Date().toISOString(),
  };
  local.wishes.unshift(newWish);
  saveLocalDb(local);
  return newWish;
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
      const rows = await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slugQuery: r.slugQuery,
        whatsappNumber: r.whatsappNumber,
        category: r.category,
        waSentStatus: r.waSentStatus,
        waSentAt: r.waSentAt,
        createdAt: r.createdAt || new Date(),
      }));
    } catch (e) {
      console.warn("DB guests query failed, using local JSON fallback:", e);
    }
  }
  return getLocalDb().guests;
}

export async function createGuest(data: {
  name: string;
  whatsappNumber?: string | null;
  category?: string;
}): Promise<GuestData> {
  const slugQuery = encodeURIComponent(data.name.trim().replace(/\s+/g, "+"));
  const db = getPostgresDb();
  if (db) {
    try {
      const [inserted] = await db
        .insert(schema.guests)
        .values({
          name: data.name.trim(),
          slugQuery,
          whatsappNumber: data.whatsappNumber || null,
          category: data.category || "Reguler",
        })
        .returning();
      return {
        id: inserted.id,
        name: inserted.name,
        slugQuery: inserted.slugQuery,
        whatsappNumber: inserted.whatsappNumber,
        category: inserted.category,
        waSentStatus: inserted.waSentStatus,
        waSentAt: inserted.waSentAt,
        createdAt: inserted.createdAt || new Date(),
      };
    } catch (e) {
      console.warn("DB insert guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const nextId = local.guests.reduce((max, g) => Math.max(max, g.id), 0) + 1;
  const newGuest: GuestData = {
    id: nextId,
    name: data.name.trim(),
    slugQuery,
    whatsappNumber: data.whatsappNumber || null,
    category: data.category || "Reguler",
    waSentStatus: false,
    waSentAt: null,
    createdAt: new Date().toISOString(),
  };
  local.guests.unshift(newGuest);
  saveLocalDb(local);
  return newGuest;
}

export async function updateGuest(
  id: number,
  updates: Partial<Omit<GuestData, "id" | "createdAt">>
): Promise<GuestData | null> {
  const db = getPostgresDb();
  if (db) {
    try {
      const dbUpdates = {
        ...updates,
        waSentAt: typeof updates.waSentAt === "string" ? new Date(updates.waSentAt) : updates.waSentAt,
      };
      const [updated] = await db
        .update(schema.guests)
        .set(dbUpdates)
        .where(eq(schema.guests.id, id))
        .returning();
      return {
        id: updated.id,
        name: updated.name,
        slugQuery: updated.slugQuery,
        whatsappNumber: updated.whatsappNumber,
        category: updated.category,
        waSentStatus: updated.waSentStatus,
        waSentAt: updated.waSentAt,
        createdAt: updated.createdAt || new Date(),
      };
    } catch (e) {
      console.warn("DB update guest failed, using local JSON fallback:", e);
    }
  }

  const local = getLocalDb();
  const idx = local.guests.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  local.guests[idx] = { ...local.guests[idx], ...updates };
  saveLocalDb(local);
  return local.guests[idx];
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
