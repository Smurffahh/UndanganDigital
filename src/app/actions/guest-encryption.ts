"use server";

import { createShortGuestToken } from "@/lib/guest-crypto";

export async function generateEncryptedGuestToken(guestName: string): Promise<string> {
  const cleanName = guestName.trim();
  if (!cleanName) {
    throw new Error("Nama tamu tidak boleh kosong.");
  }
  const result = await createShortGuestToken(cleanName);
  return result.code;
}

export async function generateBulkEncryptedGuestTokens(
  guestNames: string[]
): Promise<Record<string, string>> {
  const tokenMap: Record<string, string> = {};

  for (const rawName of guestNames) {
    const cleanName = rawName.trim();
    if (!cleanName || tokenMap[cleanName]) continue;

    try {
      const result = await createShortGuestToken(cleanName);
      tokenMap[cleanName] = result.code;
    } catch {
      continue;
    }
  }

  return tokenMap;
}
