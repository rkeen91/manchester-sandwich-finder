import { getAllPlaces } from "@/lib/places";
import { headers } from "next/headers";

export const revalidate = 0;

function getSiteUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export default async function sitemap() {
  const SITE = getSiteUrl();
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