export function formatGuestSlug(name: string): string {
  const clean = name.trim();
  if (!clean) return "";
  return encodeURIComponent(clean).replace(/%20/g, "+");
}
