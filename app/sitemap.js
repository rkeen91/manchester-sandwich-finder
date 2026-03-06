import { getAllPlaces } from "@/lib/places";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const places = await getAllPlaces();
  const now = new Date();

  return [
    { url: SITE, lastModified: now },
    ...places.map((p) => ({
      url: `${SITE}/place/${p.slug}`,
      lastModified: now,
    })),
  ];
}