import { CineNav } from "@/components/cine/cine-nav";
import { CineFooter } from "@/components/cine/cine-footer";
import { SmoothScroll } from "@/components/cine/smooth-scroll";
import { LocationGate } from "@/components/cine/location-gate";
import { AnnouncementBar } from "@/components/cine/announcement-bar";
import { getSiteContent } from "@/lib/menu-data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { promoBanner } = await getSiteContent();
  return (
    <div className="cine flex min-h-screen flex-col">
      <LocationGate />
      <SmoothScroll />
      <CineNav />
      <main className="flex-1">{children}</main>
      <CineFooter />
      <AnnouncementBar text={promoBanner} />
    </div>
  );
}
