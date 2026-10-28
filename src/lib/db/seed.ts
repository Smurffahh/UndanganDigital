import { getDb, schema } from "./index";
import {
  DEFAULT_WEDDING_SETTINGS,
  DEFAULT_GALLERY_PHOTOS,
  DEFAULT_RSVP_WISHES,
} from "./seed-data";
import {
  encryptField,
  encryptGuestRecord,
  encryptWishRecord,
} from "../crypto";

export async function seedDatabase(): Promise<{
  success: boolean;
  message: string;
  details?: {
    settingsInserted: boolean;
    galleryCount: number;
    guestsCount: number;
    wishesCount: number;
  };
}> {
  const db = getDb();
  if (!db) {
    return {
      success: false,
      message: "Database Neon Postgres tidak terkonfigurasi (DATABASE_URL kosong).",
    };
  }

  try {
    console.log("[DB Seed] Memulai sinkronisasi & verifikasi data awal di Neon Postgres...");
    let settingsInserted = false;
    let galleryCount = 0;
    let guestsCount = 0;
    let wishesCount = 0;

    // 1. Seed wedding_settings
    const existingSettings = await db.select().from(schema.weddingSettings).limit(1);
    if (existingSettings.length === 0) {
      console.log("[DB Seed] Mengisi data default wedding_settings (Fauzan & Sinta)...");
      await db.insert(schema.weddingSettings).values({
        brideName: DEFAULT_WEDDING_SETTINGS.brideName,
        brideBirth: DEFAULT_WEDDING_SETTINGS.brideBirth,
        brideBio: DEFAULT_WEDDING_SETTINGS.brideBio,
        bridePhotoUrl: DEFAULT_WEDDING_SETTINGS.bridePhotoUrl,
        groomName: DEFAULT_WEDDING_SETTINGS.groomName,
        groomBirth: DEFAULT_WEDDING_SETTINGS.groomBirth,
        groomBio: DEFAULT_WEDDING_SETTINGS.groomBio,
        groomPhotoUrl: DEFAULT_WEDDING_SETTINGS.groomPhotoUrl,
        coverPhotoUrl: DEFAULT_WEDDING_SETTINGS.coverPhotoUrl,
        heroPhotoUrl: DEFAULT_WEDDING_SETTINGS.heroPhotoUrl,
        weddingDateIso: DEFAULT_WEDDING_SETTINGS.weddingDateIso,
        eventDateLabel: DEFAULT_WEDDING_SETTINGS.eventDateLabel,
        akadTime: DEFAULT_WEDDING_SETTINGS.akadTime,
        resepsiTime: DEFAULT_WEDDING_SETTINGS.resepsiTime,
        venueName: DEFAULT_WEDDING_SETTINGS.venueName,
        venueAddress: DEFAULT_WEDDING_SETTINGS.venueAddress,
        venuePlusCode: DEFAULT_WEDDING_SETTINGS.venuePlusCode,
        googleMapsUrl: DEFAULT_WEDDING_SETTINGS.googleMapsUrl,
        googleMapsEmbed: DEFAULT_WEDDING_SETTINGS.googleMapsEmbed,
        mapsLatitude: DEFAULT_WEDDING_SETTINGS.mapsLatitude,
        mapsLongitude: DEFAULT_WEDDING_SETTINGS.mapsLongitude,
        youtubeVideoId: DEFAULT_WEDDING_SETTINGS.youtubeVideoId,
        musicEnabled: DEFAULT_WEDDING_SETTINGS.musicEnabled,
        musicTitle: DEFAULT_WEDDING_SETTINGS.musicTitle,
        musicSourceType: DEFAULT_WEDDING_SETTINGS.musicSourceType,
        musicUrl: DEFAULT_WEDDING_SETTINGS.musicUrl,
        bankAccounts: encryptField(JSON.stringify(DEFAULT_WEDDING_SETTINGS.bankAccounts)),
        ewallets: encryptField(JSON.stringify(DEFAULT_WEDDING_SETTINGS.ewallets)),
        giftAddress: encryptField(JSON.stringify(DEFAULT_WEDDING_SETTINGS.giftAddress)),
        qrisImageUrl: DEFAULT_WEDDING_SETTINGS.qrisImageUrl,
        waMessageTemplate: DEFAULT_WEDDING_SETTINGS.waMessageTemplate,
      });
      settingsInserted = true;
      console.log("[DB Seed] wedding_settings berhasil diisi ✓");
    } else {
      console.log("[DB Seed] wedding_settings sudah memiliki data (lewati insert)");
    }

    // 2. Seed gallery_photos
    const existingGallery = await db.select().from(schema.galleryPhotos);
    if (existingGallery.length === 0) {
      console.log("[DB Seed] Mengisi 11 foto default gallery_photos...");
      const galleryValues = DEFAULT_GALLERY_PHOTOS.map((photo) => ({
        imageUrl: photo.imageUrl,
        caption: photo.caption,
        aspectRatio: photo.aspectRatio,
        sortOrder: photo.sortOrder,
      }));
      await db.insert(schema.galleryPhotos).values(galleryValues);
      galleryCount = galleryValues.length;
      console.log(`[DB Seed] ${galleryCount} foto galeri berhasil dimasukkan ✓`);
    } else {
      galleryCount = existingGallery.length;
      console.log(`[DB Seed] gallery_photos sudah memiliki ${galleryCount} foto`);
    }

    // 3. Seed guests
    const existingGuests = await db.select().from(schema.guests);
    if (existingGuests.length === 0) {
      console.log("[DB Seed] Mengisi sampel daftar tamu undangan...");
      const initialGuests = [
        encryptGuestRecord({
          name: "Budi Santoso",
          whatsappNumber: "6281234567890",
          category: "Keluarga",
          waSentStatus: false,
        }),
        encryptGuestRecord({
          name: "Siti Rahma",
          whatsappNumber: "6289876543210",
          category: "Sahabat",
          waSentStatus: true,
          waSentAt: new Date(),
        }),
      ];
      await db.insert(schema.guests).values(initialGuests);
      guestsCount = initialGuests.length;
      console.log(`[DB Seed] ${guestsCount} sampel tamu berhasil dimasukkan (terenkripsi) ✓`);
    } else {
      guestsCount = existingGuests.length;
      console.log(`[DB Seed] guests sudah memiliki ${guestsCount} tamu`);
    }

    // 4. Seed rsvp_wishes
    const existingWishes = await db.select().from(schema.rsvpWishes);
    if (existingWishes.length === 0) {
      console.log("[DB Seed] Mengisi sampel ucapan buku tamu...");
      const initialWishes = DEFAULT_RSVP_WISHES.map((w) =>
        encryptWishRecord({
          guestName: w.guestName,
          attendanceStatus: w.attendanceStatus,
          paxCount: w.paxCount,
          message: w.message,
          isApproved: true,
        })
      );
      await db.insert(schema.rsvpWishes).values(initialWishes);
      wishesCount = initialWishes.length;
      console.log(`[DB Seed] ${wishesCount} sampel ucapan doa berhasil dimasukkan (terenkripsi) ✓`);
    } else {
      wishesCount = existingWishes.length;
      console.log(`[DB Seed] rsvp_wishes sudah memiliki ${wishesCount} ucapan`);
    }

    console.log("[DB Seed] Sinkronisasi awal database Neon Postgres selesai!");
    return {
      success: true,
      message: "Database Neon Postgres berhasil disinkronkan & diisi data awal.",
      details: {
        settingsInserted,
        galleryCount,
        guestsCount,
        wishesCount,
      },
    };
  } catch (error) {
    console.error("[DB Seed] Error saat seeding database:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal seeding database",
    };
  }
}

// Auto-run if executed directly via node/tsx
if (process.argv[1]?.replace(/\\/g, "/").includes("src/lib/db/seed")) {
  seedDatabase()
    .then((res) => {
      console.log("Seed Result:", JSON.stringify(res, null, 2));
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error("Fatal Seed Error:", err);
      process.exit(1);
    });
}
