import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const weddingSettings = pgTable("wedding_settings", {
  id: serial("id").primaryKey(),
  brideName: varchar("bride_name", { length: 100 }).notNull(),
  brideBirth: varchar("bride_birth", { length: 150 }),
  brideBio: text("bride_bio"),
  bridePhotoUrl: text("bride_photo_url"),
  groomName: varchar("groom_name", { length: 100 }).notNull(),
  groomBirth: varchar("groom_birth", { length: 150 }),
  groomBio: text("groom_bio"),
  groomPhotoUrl: text("groom_photo_url"),
  coverPhotoUrl: text("cover_photo_url"),
  heroPhotoUrl: text("hero_photo_url"),
  weddingDateIso: varchar("wedding_date_iso", { length: 50 }).notNull(),
  eventDateLabel: varchar("event_date_label", { length: 100 }),
  akadTime: varchar("akad_time", { length: 100 }),
  resepsiTime: varchar("resepsi_time", { length: 100 }),
  venueName: varchar("venue_name", { length: 255 }),
  venueAddress: text("venue_address"),
  venuePlusCode: varchar("venue_plus_code", { length: 100 }),
  googleMapsUrl: text("google_maps_url"),
  googleMapsEmbed: text("google_maps_embed"),
  mapsLatitude: varchar("maps_latitude", { length: 50 }),
  mapsLongitude: varchar("maps_longitude", { length: 50 }),
  youtubeVideoId: varchar("youtube_video_id", { length: 50 }),
  musicEnabled: boolean("music_enabled").default(true),
  musicTitle: varchar("music_title", { length: 255 }),
  musicSourceType: varchar("music_source_type", { length: 50 }).default("preset"),
  musicUrl: text("music_url"),
  bankAccounts: text("bank_accounts"),
  ewallets: text("ewallets"),
  giftAddress: text("gift_address"),
  qrisImageUrl: text("qris_image_url"),
  waMessageTemplate: text("wa_message_template"),
  loveStoryText: text("love_story_text"),
  storyHashtag: varchar("story_hashtag", { length: 100 }).default("#SINgkatceritaFAUZAN"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  aspectRatio: varchar("aspect_ratio", { length: 20 }).default("3/4"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const guests = pgTable(
  "guests",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slugQuery: varchar("slug_query", { length: 120 }).notNull(),
    whatsappNumber: text("whatsapp_number"),
    category: text("category").default("Reguler"),
    nameBindex: varchar("name_bindex", { length: 64 }),
    waBindex: varchar("wa_bindex", { length: 64 }),
    waSentStatus: boolean("wa_sent_status").default(false),
    waSentAt: timestamp("wa_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_guests_slug_query").on(table.slugQuery),
    index("idx_guests_wa_bindex").on(table.waBindex),
    index("idx_guests_name_bindex").on(table.nameBindex),
  ]
);

export const rsvpWishes = pgTable(
  "rsvp_wishes",
  {
    id: serial("id").primaryKey(),
    guestName: text("guest_name").notNull(),
    attendanceStatus: varchar("attendance_status", { length: 30 }).notNull(),
    paxCount: integer("pax_count").default(1),
    message: text("message").notNull(),
    isApproved: boolean("is_approved").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_rsvp_created_at").on(table.createdAt),
    index("idx_rsvp_is_approved").on(table.isApproved),
  ]
);

export type WeddingSettings = typeof weddingSettings.$inferSelect;
export type NewWeddingSettings = typeof weddingSettings.$inferInsert;

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type NewGalleryPhoto = typeof galleryPhotos.$inferInsert;

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;

export type RsvpWish = typeof rsvpWishes.$inferSelect;
export type NewRsvpWish = typeof rsvpWishes.$inferInsert;
