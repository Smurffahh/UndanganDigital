import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
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

  const tracksToSync: AudioTrackRecord[] = [];

  for (const file of files) {
    const url = `/audio/${file}`;
    const slug = file.replace(/\.(mp3|wav|ogg)$/i, "");

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
      url,
      isActive: true,
    });
  }

  const count = await syncMusicTracks(tracksToSync);
  return {
    success: true,
    totalFiles: files.length,
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
      console.log(`[Audio Sync] Berhasil sinkronisasi ${res.syncedCount} lagu ke PostgreSQL & store!`);
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
