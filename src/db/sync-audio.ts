import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { put, list } from "@vercel/blob";
import { WEDDING_MUSIC_PRESETS } from "../lib/db/seed-data";
import { syncMusicTracks } from "../lib/db/store";

interface AudioTrackRecord {
  slug: string;
  title: string;
  artist: string;
  url: string;
  isActive: boolean;
}

function parseFilenameToMetadata(filename: string): { title: string; artist: string } {
  const nameWithoutExt = filename.replace(/\.(mp3|wav|ogg|m4a)$/i, "");
  const parts = nameWithoutExt.split("-");

  const toTitleCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const formattedWords = parts.map(toTitleCase).join(" ");
  return {
    title: formattedWords,
    artist: "Wedding Collection",
  };
}

export async function runAudioSync() {
  const audioDir = path.join(process.cwd(), "public", "audio");
  if (!fs.existsSync(audioDir)) {
    throw new Error(`Folder audio tidak ditemukan di: ${audioDir}`);
  }

  const files = fs
    .readdirSync(audioDir)
    .filter((f) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".ogg"));

  const presetMap = new Map<string, { title: string; artist: string }>();
  for (const preset of WEDDING_MUSIC_PRESETS) {
    if (preset.sourceType === "audio_url" && preset.url.startsWith("/audio/")) {
      const filename = preset.url.replace(/^\/audio\//, "");
      presetMap.set(filename, {
        title: preset.title,
        artist: preset.artist,
      });
    }
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const existingBlobMap = new Map<string, string>();

  if (token) {
    try {
      console.log("[Audio Sync] Memeriksa daftar audio yang telah ada di Vercel Blob...");
      const blobList = await list({ prefix: "audio/", token });
      for (const blob of blobList.blobs) {
        const basename = path.basename(blob.pathname);
        existingBlobMap.set(basename, blob.url);
      }
      console.log(`[Audio Sync] Ditemukan ${existingBlobMap.size} audio yang sudah ada di Vercel Blob.`);
    } catch (err) {
      console.warn("[Audio Sync Warning] Gagal memeriksa Vercel Blob:", err);
    }
  }

  const tracksToSync: AudioTrackRecord[] = [];
  let uploadedCount = 0;

  for (const file of files) {
    const slug = file.replace(/\.(mp3|wav|ogg)$/i, "");
    let finalUrl = `/audio/${file}`;

    // If Vercel Blob token is available, ensure uploaded to Blob
    if (token) {
      if (existingBlobMap.has(file)) {
        finalUrl = existingBlobMap.get(file)!;
      } else {
        const filePath = path.join(audioDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const contentType = file.endsWith(".wav") ? "audio/wav" : "audio/mpeg";

        console.log(`[Audio Sync] Mengunggah ${file} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) ke Vercel Blob...`);
        try {
          const blob = await put(`audio/${file}`, fileBuffer, {
            access: "public",
            addRandomSuffix: false,
            contentType,
            token,
          });
          finalUrl = blob.url;
          existingBlobMap.set(file, blob.url);
          uploadedCount++;
          console.log(`[Audio Sync] Berhasil diunggah: ${blob.url}`);
        } catch (uploadErr) {
          console.error(`[Audio Sync Error] Gagal mengunggah ${file}:`, uploadErr);
        }
      }
    }

    const matchedPreset = presetMap.get(file);
    let title = "";
    let artist = "";

    if (matchedPreset) {
      title = matchedPreset.title;
      artist = matchedPreset.artist;
    } else {
      const fallback = parseFilenameToMetadata(file);
      title = fallback.title;
      artist = fallback.artist;
    }

    tracksToSync.push({
      slug,
      title,
      artist,
      url: finalUrl,
      isActive: true,
    });
  }

  const count = await syncMusicTracks(tracksToSync);

  // Sync wedding_settings.music_url to Blob URL if matching
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      const settingsRows = await sql`SELECT id, music_url FROM wedding_settings LIMIT 1`;
      if (settingsRows.length > 0) {
        const currentMusicUrl = settingsRows[0].music_url as string;
        if (currentMusicUrl && currentMusicUrl.startsWith("/audio/")) {
          const targetFilename = currentMusicUrl.replace(/^\/audio\//, "");
          const targetBlobUrl = existingBlobMap.get(targetFilename);
          if (targetBlobUrl) {
            await sql`UPDATE wedding_settings SET music_url = ${targetBlobUrl} WHERE id = ${settingsRows[0].id}`;
            console.log(`[Audio Sync] Diperbarui wedding_settings.music_url -> ${targetBlobUrl}`);
          }
        }
      }
    } catch (e) {
      console.warn("[Audio Sync Warning] Gagal sinkronisasi settings music_url:", e);
    }
  }

  return {
    success: true,
    totalFiles: files.length,
    uploadedCount,
    syncedCount: count,
    tracks: tracksToSync,
  };
}

export async function queryAllMusicTracks() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL tidak disetel");
  const sql = neon(dbUrl);
  return await sql`SELECT id, slug, title, artist, url, is_active FROM music_tracks ORDER BY id ASC`;
}

if (process.argv[1]?.replace(/\\/g, "/").includes("sync-audio")) {
  runAudioSync()
    .then(async (res) => {
      console.log(`[Audio Sync] Selesai. Total files: ${res.totalFiles}, baru diunggah ke Blob: ${res.uploadedCount}, disinkronkan ke DB: ${res.syncedCount}`);
      const rows = await queryAllMusicTracks();
      console.log(`[Audio Verify] Total baris di tabel music_tracks: ${rows.length}`);
      for (const r of rows) {
        console.log(`- [#${r.id}] ${r.title} | ${r.artist} (${r.url})`);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Audio Sync Error]", err);
      process.exit(1);
    });
}
