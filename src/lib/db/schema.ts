import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const weddingSettings = pgTable("wedding_settings", {
  id: serial("id").primaryKey(),
  brideName: varchar("bride_name", { length: 100 }).notNull(),
  brideBirth: varchar("bride_birth", { length: 100 }),
  brideBio: text("bride_bio"),
  bridePhotoUrl: text("bride_photo_url"),
  groomName: varchar("groom_name", { length: 100 }).notNull(),
  groomBirth: varchar("groom_birth", { length: 100 }),
  groomBio: text("groom_bio"),
  groomPhotoUrl: text("groom_photo_url"),
  coverPhotoUrl: text("cover_photo_url"),
  heroPhotoUrl: text("hero_photo_url"),
  weddingDateIso: varchar("wedding_date_iso", { length: 50 }).notNull(),
  akadTime: varchar("akad_time", { length: 100 }),
  resepsiTime: varchar("resepsi_time", { length: 100 }),
  venueName: varchar("venue_name", { length: 255 }),
  venueAddress: text("venue_address"),
  venuePlusCode: varchar("venue_plus_code", { length: 100 }),
  googleMapsUrl: text("google_maps_url"),
  googleMapsEmbed: text("google_maps_embed"),
  youtubeVideoId: varchar("youtube_video_id", { length: 50 }),
  bankAccounts: text("bank_accounts"),
  ewallets: text("ewallets"),
  giftAddress: text("gift_address"),
  qrisImageUrl: text("qris_image_url"),
  waMessageTemplate: text("wa_message_template"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  aspectRatio: varchar("aspect_ratio", { length: 20 }).default("3/4"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slugQuery: varchar("slug_query", { length: 100 }).notNull(),
  whatsappNumber: text("whatsapp_number"),
  category: text("category").default("Reguler"),
  nameBindex: varchar("name_bindex", { length: 64 }),
  waBindex: varchar("wa_bindex", { length: 64 }),
  waSentStatus: boolean("wa_sent_status").default(false),
  waSentAt: timestamp("wa_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rsvpWishes = pgTable("rsvp_wishes", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  attendanceStatus: varchar("attendance_status", { length: 20 }).notNull(),
  paxCount: integer("pax_count").default(1),
  message: text("message").notNull(),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WeddingSettings = typeof weddingSettings.$inferSelect;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type RsvpWish = typeof rsvpWishes.$inferSelect;
