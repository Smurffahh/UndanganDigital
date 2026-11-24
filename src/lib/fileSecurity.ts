import crypto from "crypto";

export interface FileValidationResult {
  valid: boolean;
  detectedType?: string;
  error?: string;
}

export interface SecurityScanResult {
  safe: boolean;
  reason?: string;
}

export function sanitizeUploadFileName(fileName: string): string {
  const sanitized = fileName
    .replace(/\\/g, "/")
    .split("/")
    .pop() || "upload";

  const cleaned = sanitized.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = cleaned.includes(".") ? cleaned.split(".").pop()?.toLowerCase() || "" : "";
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const baseName = cleaned.replace(/\.[^/.]+$/, "").slice(0, 32);

  return ext ? `${baseName}-${randomSuffix}.${ext}` : `${baseName}-${randomSuffix}`;
}

export function validateFileMagicBytes(
  buffer: Buffer,
  category: "image" | "audio" | "excel" | "csv"
): FileValidationResult {
  if (!buffer || buffer.length < 4) {
    return { valid: false, error: "Ukuran file terlalu kecil atau file kosong." };
  }

  // 1. Image checks: JPEG, PNG, WebP (BLOCK SVG/HTML/PHP/EXE)
  if (category === "image") {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { valid: true, detectedType: "image/jpeg" };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return { valid: true, detectedType: "image/png" };
    }

    // WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
    if (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
      return { valid: true, detectedType: "image/webp" };
    }

    return {
      valid: false,
      error: "Format biner gambar tidak valid. Hanya menerima file asli JPG, PNG, atau WebP (SVG dan format lainnya diblokir).",
    };
  }

  // 2. Audio checks: MP3, M4A, OGG, WAV
  if (category === "audio") {
    // MP3 with ID3 tag: ID3
    if (buffer.toString("ascii", 0, 3) === "ID3") {
      return { valid: true, detectedType: "audio/mpeg" };
    }

    // MP3 raw frame sync: FF FB, FF F3, FF F2
    if (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xf3 || buffer[1] === 0xf2)) {
      return { valid: true, detectedType: "audio/mpeg" };
    }

    // M4A / MP4 Audio: ftyp at offset 4
    if (buffer.length >= 8 && buffer.toString("ascii", 4, 8) === "ftyp") {
      return { valid: true, detectedType: "audio/mp4" };
    }

    // Ogg container: OggS
    if (buffer.toString("ascii", 0, 4) === "OggS") {
      return { valid: true, detectedType: "audio/ogg" };
    }

    // WAV: RIFF at 0 + WAVE at 8
    if (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WAVE"
    ) {
      return { valid: true, detectedType: "audio/wav" };
    }

    return {
      valid: false,
      error: "Format biner audio tidak valid. Hanya menerima file asli MP3, M4A, OGG, atau WAV.",
    };
  }

  // 3. Excel check: XLSX (PK 03 04 zip container)
  if (category === "excel") {
    if (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    ) {
      return { valid: true, detectedType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
    }
    return {
      valid: false,
      error: "Format biner Excel (.xlsx) tidak valid.",
    };
  }

  // 4. CSV check: text UTF-8 without null bytes
  if (category === "csv") {
    for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
      if (buffer[i] === 0x00) {
        return { valid: false, error: "File CSV tidak valid karena memuat karakter null byte." };
      }
    }
    return { valid: true, detectedType: "text/csv" };
  }

  return { valid: false, error: "Kategori file tidak didukung." };
}

export function scanFileForMaliciousPayload(buffer: Buffer): SecurityScanResult {
  if (!buffer || buffer.length === 0) {
    return { safe: false, reason: "File kosong" };
  }

  // Check executable headers (MZ for DOS/Windows PE, \x7fELF for Linux)
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return { safe: false, reason: "Terdeteksi executable binary header (MZ/PE)." };
  }
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x7f &&
    buffer[1] === 0x45 &&
    buffer[2] === 0x4c &&
    buffer[3] === 0x46
  ) {
    return { safe: false, reason: "Terdeteksi executable binary header (ELF)." };
  }

  // Check dangerous polyglot/script strings in initial chunk (or full buffer up to 64KB)
  const sampleSize = Math.min(buffer.length, 65536);
  const sampleText = buffer.toString("utf-8", 0, sampleSize).toLowerCase();

  const dangerousPatterns = [
    "<script",
    "<?php",
    "<!doctype html",
    "<html",
    "<svg",
    "javascript:",
    "onerror=",
    "onload=",
    "eval(",
    "base64_decode(",
    "system(",
    "passthru(",
    "shell_exec(",
  ];

  for (const pattern of dangerousPatterns) {
    if (sampleText.includes(pattern)) {
      return {
        safe: false,
        reason: `Terdeteksi payload berbahaya atau pola script terlarang: "${pattern}".`,
      };
    }
  }

  return { safe: true };
}
