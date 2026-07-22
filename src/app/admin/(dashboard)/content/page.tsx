import { getSiteContent, getBrandCopy } from "@/lib/menu-data";
import { ContentEditor } from "./content-editor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [content, copy] = await Promise.all([getSiteContent(), getBrandCopy()]);
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl">Site Text</h1>
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Edit the words guests see — the promo banner, your About story, catering intro
          and Event Hall packages. Changes go live right away.
        </p>
      </header>
      <ContentEditor
        initial={{
          promoBanner: content.promoBanner,
          mottoHeadlineEn: copy.mottoHeadline,
          mottoLeadEn: copy.mottoLead,
          mottoBodyEn: copy.mottoBody.join("\n\n"),
          chefIntroEn: copy.chefIntro,
          cateringIntroEn: copy.cateringIntro,
          eventCapacity: copy.eventCapacity,
          eventPackages: copy.eventPackages,
        }}
      />
    </div>
  );
}
