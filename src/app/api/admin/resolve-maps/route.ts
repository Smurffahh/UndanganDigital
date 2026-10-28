import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl || !rawUrl.trim()) {
    return NextResponse.json(
      { success: false, error: "Parameter url Google Maps diperlukan" },
      { status: 400 }
    );
  }

  return resolveGoogleMapsUrl(rawUrl.trim());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Field url Google Maps diperlukan" },
        { status: 400 }
      );
    }

    return resolveGoogleMapsUrl(rawUrl.trim());
  } catch {
    return NextResponse.json({ success: false, error: "Format request tidak valid" }, { status: 400 });
  }
}

async function resolveGoogleMapsUrl(targetUrl: string) {
  try {
    let finalUrl = targetUrl;

    // Follow redirects for short links (e.g. maps.app.goo.gl, goo.gl)
    if (targetUrl.includes("goo.gl") || targetUrl.includes("maps.app")) {
      const response = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      finalUrl = response.url || targetUrl;
    }

    let lat: string | null = null;
    let lng: string | null = null;

    // Regex 1: /search/-7.310076,+109.296186 or /search/-7.310076,109.296186
    const searchMatch = finalUrl.match(/\/search\/([+-]?\d+\.?\d*)[,\+]+([+-]?\d+\.?\d*)/);
    if (searchMatch) {
      lat = searchMatch[1];
      lng = searchMatch[2];
    }

    // Regex 2: @-7.310076,109.296186
    if (!lat || !lng) {
      const atMatch = finalUrl.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
      if (atMatch) {
        lat = atMatch[1];
        lng = atMatch[2];
      }
    }

    // Regex 3: q=-7.310076,109.296186 or query=-7.310076,109.296186
    if (!lat || !lng) {
      const qMatch = finalUrl.match(/[?&](?:q|query)=([+-]?\d+\.?\d*)[,\+]+([+-]?\d+\.?\d*)/);
      if (qMatch) {
        lat = qMatch[1];
        lng = qMatch[2];
      }
    }

    // Regex 4: ll=-7.310076,109.296186
    if (!lat || !lng) {
      const llMatch = finalUrl.match(/[?&]ll=([+-]?\d+\.?\d*)[,\+]+([+-]?\d+\.?\d*)/);
      if (llMatch) {
        lat = llMatch[1];
        lng = llMatch[2];
      }
    }

    if (lat && lng) {
      const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
      return NextResponse.json({
        success: true,
        latitude: lat,
        longitude: lng,
        embedUrl,
        finalUrl,
      });
    }

    // Fallback if exact coordinates cannot be parsed
    const fallbackEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(targetUrl)}&z=17&output=embed`;
    return NextResponse.json({
      success: true,
      latitude: null,
      longitude: null,
      embedUrl: fallbackEmbed,
      finalUrl,
    });
  } catch (error) {
    console.error("Failed to resolve Google Maps link:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses tautan Google Maps. Periksa koneksi atau URL." },
      { status: 500 }
    );
  }
}
