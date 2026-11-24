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
  brideBio: text("bride_bio"),
  bridePhotoUrl: text("bride_photo_url"),
  groomName: varchar("groom_name", { length: 100 }).notNull(),
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
  coupleVisualMode: varchar("couple_visual_mode", { length: 20 }).default("svg"),
  svgCharacterPreset: varchar("svg_character_preset", { length: 50 }).default("javanese-royal"),
  isGalleryEnabled: boolean("is_gallery_enabled").default(true),
  isLoveStoryEnabled: boolean("is_love_story_enabled").default(true),
  groomChildOrder: varchar("groom_child_order", { length: 100 }).default("Putra Pertama"),
  brideChildOrder: varchar("bride_child_order", { length: 100 }).default("Putri Pertama"),
  groomParents: varchar("groom_parents", { length: 255 }).default("Bapak H. Ma'ruf & Ibu Hj. Siti Aminah"),
  brideParents: varchar("bride_parents", { length: 255 }).default("Bapak H. Utami & Ibu Hj. Maria"),
  showTasyakuran: boolean("show_tasyakuran").default(true),
  tasyakuranTitle: varchar("tasyakuran_title", { length: 100 }).default("Tasyakuran"),
  tasyakuranStartDate: varchar("tasyakuran_start_date", { length: 50 }).default("2027-01-01"),
  tasyakuranEndDate: varchar("tasyakuran_end_date", { length: 50 }).default("2027-01-02"),
  tasyakuranTime: varchar("tasyakuran_time", { length: 100 }).default(""),
  tasyakuranSameLocation: boolean("tasyakuran_same_location").default(true),
  tasyakuranVenue: varchar("tasyakuran_venue", { length: 255 }).default(""),
  tasyakuranAddress: text("tasyakuran_address").default(""),
  tasyakuranMapsUrl: text("tasyakuran_maps_url").default(""),
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
    slugQuery: text("slug_query").notNull(),
    whatsappNumber: text("whatsapp_number"),
    category: text("category").default("Reguler"),
    nameBindex: varchar("name_bindex", { length: 64 }),
    waBindex: varchar("wa_bindex", { length: 64 }),
    waSentStatus: boolean("wa_sent_status").default(false),
    waSentAt: timestamp("wa_sent_at", { withTimezone: true }),
    ownerScope: varchar("owner_scope", { length: 50 }).default("couple").notNull(),
    createdBy: varchar("created_by", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_guests_slug_query").on(table.slugQuery),
    index("idx_guests_wa_bindex").on(table.waBindex),
    index("idx_guests_name_bindex").on(table.nameBindex),
    index("idx_guests_owner_scope").on(table.ownerScope),
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

export const guestTokens = pgTable("guest_tokens", {
  code: varchar("code", { length: 12 }).primaryKey(),
  guestName: text("guest_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const musicTracks = pgTable(
  "music_tracks",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: varchar("title", { length: 150 }).notNull(),
    artist: varchar("artist", { length: 150 }).notNull(),
    url: text("url").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_music_tracks_slug").on(table.slug),
    index("idx_music_tracks_is_active").on(table.isActive),
  ]
);

export const dashboardUsers = pgTable(
  "dashboard_users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: varchar("role", { length: 20 }).notNull().default("parent"),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    guestScope: varchar("guest_scope", { length: 50 }).notNull().default("parent"),
    waTemplate: text("wa_template").default(""),
    isActive: boolean("is_active").default(true).notNull(),
    tokenVersion: integer("token_version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_dashboard_users_username").on(table.username),
    index("idx_dashboard_users_role").on(table.role),
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

export type GuestToken = typeof guestTokens.$inferSelect;
export type NewGuestToken = typeof guestTokens.$inferInsert;

export type MusicTrack = typeof musicTracks.$inferSelect;
export type NewMusicTrack = typeof musicTracks.$inferInsert;

export type DashboardUser = typeof dashboardUsers.$inferSelect;
export type NewDashboardUser = typeof dashboardUsers.$inferInsert;
