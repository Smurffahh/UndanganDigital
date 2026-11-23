import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import {
  getWeddingSettings,
  getGalleryPhotos,
  getGuests,
  getRsvpWishes,
  getDashboardUsers,
} from "@/lib/db/store";
import { DashboardWorkspace } from "@/components/admin/DashboardWorkspace";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/dashboard/login");
  }

  const isParent = session.role === "parent";

  if (isParent) {
    const [settings, guests] = await Promise.all([
      getWeddingSettings(),
      getGuests(session.guestScope),
    ]);

    return (
      <DashboardWorkspace
        currentUser={session}
        initialSettings={settings}
        initialGallery={[]}
        initialGuests={guests}
        initialWishes={[]}
        initialUsers={[]}
      />
    );
  }

  const [settings, galleryPhotos, guests, wishes, users] = await Promise.all([
    getWeddingSettings(),
    getGalleryPhotos(),
    getGuests(),
    getRsvpWishes(),
    getDashboardUsers(),
  ]);

  return (
    <DashboardWorkspace
      currentUser={session}
      initialSettings={settings}
      initialGallery={galleryPhotos}
      initialGuests={guests}
      initialWishes={wishes}
      initialUsers={users}
    />
  );
}
