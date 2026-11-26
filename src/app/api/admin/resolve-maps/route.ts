import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { NO_CACHE_HEADERS } from "@/lib/httpHeaders";

const resolveMapsBodySchema = z
  .object({
    url: z.string().trim().min(1, "Field url Google Maps diperlukan").max(2048),
  })
  .strict();

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl || !rawUrl.trim() || rawUrl.length > 2048) {
    return NextResponse.json(
      { success: false, error: "Parameter url Google Maps diperlukan" },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  return resolveGoogleMapsUrl(rawUrl.trim());
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, code: "FORBIDDEN", error: "Akses ditolak. Fitur ini hanya tersedia untuk admin." },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const body = await request.json();
    const parsed = resolveMapsBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Field url Google Maps tidak valid" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    return resolveGoogleMapsUrl(parsed.data.url);
  } catch {
    return NextResponse.json({ success: false, error: "Format request tidak valid" }, { status: 400, headers: NO_CACHE_HEADERS });
  }
}

const ALLOWED_MAPS_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "maps.google.com",
  "www.google.com",
  "google.com",
]);

function isPrivateIpOrHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  // IPv4 Private & Link-Local / Metadata
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [_, o1, o2] = ipv4Match.map(Number);
    if (o1 === 127) return true; // 127.0.0.0/8
    if (o1 === 10) return true; // 10.0.0.0/8
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true; // 172.16.0.0/12
    if (o1 === 192 && o2 === 168) return true; // 192.168.0.0/16
    if (o1 === 169 && o2 === 254) return true; // 169.254.0.0/16 (AWS/cloud metadata)
    if (o1 === 0) return true;
    return true; // Reject all raw IP addresses
  }

  // IPv6 check
  if (host.includes(":")) {
    return true; // Reject all IPv6 hostnames to prevent private bypass
  }

  return false;
}

function validateMapsUrl(urlString: string): URL | null {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") {
      return null;
    }
    if (isPrivateIpOrHost(parsed.hostname)) {
      return null;
    }
    if (!ALLOWED_MAPS_HOSTS.has(parsed.hostname.toLowerCase())) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function resolveGoogleMapsUrl(targetUrl: string) {
  const initialUrl = validateMapsUrl(targetUrl);
  if (!initialUrl) {
    return NextResponse.json(
      { success: false, error: "URL harus berupa protokol https:// dan mengarah ke domain resmi Google Maps." },
      { status: 400 }
    );
  }

  try {
    let currentUrl = initialUrl.toString();
    let hops = 0;
    const maxHops = 3;

    while (hops < maxHops) {
      const parsedCurrent = validateMapsUrl(currentUrl);
      if (!parsedCurrent) {
        return NextResponse.json(
          { success: false, error: "Redirect mengarah ke host yang tidak diizinkan." },
          { status: 400 }
        );
      }

      // If already a rich Google Maps URL with coordinates, stop following
      if (
        currentUrl.includes("/search/") ||
        currentUrl.includes("@") ||
        currentUrl.includes("query=") ||
        currentUrl.includes("ll=")
      ) {
        break;
      }

      const response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      const location = response.headers.get("location");
      if (!location || (response.status !== 301 && response.status !== 302 && response.status !== 307 && response.status !== 308)) {
        break;
      }

      const nextUrl = new URL(location, currentUrl);
      currentUrl = nextUrl.toString();
      hops++;
    }

    const finalUrl = currentUrl;
    let lat: string | null = null;
    let lng: string | null = null;

    const searchMatch = finalUrl.match(/\/search\/([+-]?\d+\.?\d*)[,\+]+([+-]?\d+\.?\d*)/);
    if (searchMatch) {
      lat = searchMatch[1];
      lng = searchMatch[2];
    }

    if (!lat || !lng) {
      const atMatch = finalUrl.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
      if (atMatch) {
        lat = atMatch[1];
        lng = atMatch[2];
      }
    }

    if (!lat || !lng) {
      const qMatch = finalUrl.match(/[?&](?:q|query)=([+-]?\d+\.?\d*)[,\+]+([+-]?\d+\.?\d*)/);
      if (qMatch) {
        lat = qMatch[1];
        lng = qMatch[2];
      }
    }

    if (!lat || !lng) {
      const llMatch = finalUrl.match(/[?&]ll=([+-]?\d+\.?\d*)[,\+]+([+-]?\d+\.?\d*)/);
      if (llMatch) {
        lat = llMatch[1];
        lng = llMatch[2];
      }
    }

    if (lat && lng) {
      const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
      return NextResponse.json(
        {
          success: true,
          latitude: lat,
          longitude: lng,
          embedUrl,
          finalUrl,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    const fallbackEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(targetUrl)}&z=17&output=embed`;
    return NextResponse.json(
      {
        success: true,
        latitude: null,
        longitude: null,
        embedUrl: fallbackEmbed,
        finalUrl,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Failed to resolve Google Maps link:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses tautan Google Maps. Periksa koneksi atau URL." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
