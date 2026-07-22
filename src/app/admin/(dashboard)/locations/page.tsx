import { getLocations } from "@/lib/menu-data";
import { LocationsEditor } from "./locations-editor";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const locations = await getLocations();
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Locations</h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Update contact details, preparation time, and pause online ordering when you’re slammed.
        </p>
      </header>
      <LocationsEditor
        locations={locations.map((l) => ({
          slug: l.slug,
          name: l.name,
          phone: l.phone,
          email: l.email ?? "",
          addressLine1: l.addressLine1,
          addressLine2: l.addressLine2 ?? "",
          city: l.city,
          province: l.province,
          postalCode: l.postalCode,
          prepTimeMinutes: l.prepTimeMinutes,
          payAtPickupEnabled: l.payAtPickupEnabled,
          minimumOrderCents: l.minimumOrderCents ?? 0,
          orderingPaused: l.orderingPaused ?? false,
          closedNote: l.closedNote ?? "",
          hours: l.hours,
        }))}
      />
    </div>
  );
}
