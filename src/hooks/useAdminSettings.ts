"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { WeddingSettingsData } from "@/lib/db/store";
import { normalizeUrlOrPath, isValidUrlOrLocalPath } from "@/lib/urlUtils";
import { normalizeFontTheme } from "@/lib/fontThemes";

function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, idx) => isDeepEqual(item, b[idx]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keysA = Object.keys(objA).filter((k) => objA[k] !== undefined);
    const keysB = Object.keys(objB).filter((k) => objB[k] !== undefined);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => isDeepEqual(objA[key], objB[key]));
  }
  return false;
}

function normalizeInitialSettings(raw: WeddingSettingsData): WeddingSettingsData {
  return {
    ...raw,
    fontTheme: normalizeFontTheme(raw.fontTheme),
  };
}

export interface SaveSettingsOptions {
  overridePatch?: Partial<WeddingSettingsData>;
  successMessage?: string;
}

export function useAdminSettings(initialSettings: WeddingSettingsData) {
  const initialNormalized = useMemo(() => normalizeInitialSettings(initialSettings), [initialSettings]);
  const [settings, setSettings] = useState<WeddingSettingsData>(initialNormalized);
  const [draftSettings, setDraftSettings] = useState<WeddingSettingsData>(initialNormalized);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(initialNormalized);
    setDraftSettings(initialNormalized);
  }, [initialNormalized]);

  const isDirty = useMemo(() => !isDeepEqual(draftSettings, settings), [draftSettings, settings]);

  const updateField = useCallback((field: string, value: unknown) => {
    setDraftSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateFields = useCallback((patch: Partial<WeddingSettingsData>) => {
    setDraftSettings((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const discardChanges = useCallback(() => {
    setDraftSettings(settings);
  }, [settings]);

  // Keep draft aligned when Media or Guest modules persist changes directly through dedicated endpoints.
  const syncSavedSettings = useCallback((updated: WeddingSettingsData) => {
    const normalized = normalizeInitialSettings(updated);
    setSettings(normalized);
    setDraftSettings(normalized);
  }, []);

  const saveSettings = useCallback(
    async (options?: SaveSettingsOptions): Promise<boolean> => {
      const target: WeddingSettingsData = options?.overridePatch
        ? { ...draftSettings, ...options.overridePatch }
        : draftSettings;

      const normalizedMusicUrl = normalizeUrlOrPath(target.musicUrl, "asset");
      const normalizedMapsUrl = normalizeUrlOrPath(target.googleMapsUrl, "maps");
      const normalizedBridePhoto = normalizeUrlOrPath(target.bridePhotoUrl, "asset");
      const normalizedGroomPhoto = normalizeUrlOrPath(target.groomPhotoUrl, "asset");
      const normalizedTasyakuranMapsUrl = target.tasyakuranMapsUrl
        ? normalizeUrlOrPath(target.tasyakuranMapsUrl, "maps")
        : "";

      if (target.musicUrl && !isValidUrlOrLocalPath(normalizedMusicUrl)) {
        toast.error("Format tautan audio tidak valid.");
        return false;
      }
      if (target.googleMapsUrl && !isValidUrlOrLocalPath(normalizedMapsUrl)) {
        toast.error("Format tautan Google Maps tidak valid.");
        return false;
      }
      if (target.tasyakuranMapsUrl && !isValidUrlOrLocalPath(normalizedTasyakuranMapsUrl)) {
        toast.error("Format tautan Google Maps Tasyakuran tidak valid.");
        return false;
      }
      if (target.bridePhotoUrl && !isValidUrlOrLocalPath(normalizedBridePhoto)) {
        toast.error("Format tautan foto mempelai wanita tidak valid.");
        return false;
      }
      if (target.groomPhotoUrl && !isValidUrlOrLocalPath(normalizedGroomPhoto)) {
        toast.error("Format tautan foto mempelai pria tidak valid.");
        return false;
      }

      const payload: WeddingSettingsData = {
        ...target,
        fontTheme: normalizeFontTheme(target.fontTheme),
        musicUrl: normalizedMusicUrl,
        googleMapsUrl: normalizedMapsUrl,
        bridePhotoUrl: normalizedBridePhoto,
        groomPhotoUrl: normalizedGroomPhoto,
        tasyakuranMapsUrl: normalizedTasyakuranMapsUrl,
      };

      setIsSaving(true);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal menyimpan pengaturan.");
        }
        const saved = data.data ? normalizeInitialSettings(data.data as WeddingSettingsData) : payload;
        setSettings(saved);
        setDraftSettings(saved);
        toast.success(options?.successMessage ?? "Pengaturan undangan berhasil disimpan.");
        return true;
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [draftSettings]
  );

  return {
    settings,
    draftSettings,
    isDirty,
    isSaving,
    updateField,
    updateFields,
    discardChanges,
    syncSavedSettings,
    saveSettings,
  };
}
