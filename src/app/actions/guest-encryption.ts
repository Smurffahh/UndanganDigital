"use server";

import { encryptGuestName } from "@/lib/guest-crypto";

export async function generateEncryptedGuestToken(guestName: string): Promise<string> {
  const cleanName = guestName.trim();
  if (!cleanName) {
    throw new Error("Nama tamu tidak boleh kosong.");
  }
  return encryptGuestName(cleanName);
}

export async function generateBulkEncryptedGuestTokens(
  guestNames: string[]
): Promise<Record<string, string>> {
  const tokenMap: Record<string, string> = {};

  for (const rawName of guestNames) {
    const cleanName = rawName.trim();
    if (!cleanName || tokenMap[cleanName]) continue;

    try {
      tokenMap[cleanName] = encryptGuestName(cleanName);
    } catch {
      continue;
    }
  }

  return tokenMap;
}
