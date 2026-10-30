import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  getWeddingSettings,
  getGalleryPhotos,
  getGuests,
  getRsvpWishes,
} from "@/lib/db/store";
import { DashboardWorkspace } from "@/components/admin/DashboardWorkspace";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/dashboard/login");
  }

  const [settings, galleryPhotos, guests, wishes] = await Promise.all([
    getWeddingSettings(),
    getGalleryPhotos(),
    getGuests(),
    getRsvpWishes(),
  ]);

  return (
    <DashboardWorkspace
      initialSettings={settings}
      initialGallery={galleryPhotos}
      initialGuests={guests}
      initialWishes={wishes}
    />
  );
}
