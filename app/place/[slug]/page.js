export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import { notFound } from "next/navigation";
import placesData from "@/data/places.json";

function cleanSlug(raw) {
  return decodeURIComponent(raw || "")
    .trim()
    // strip invisible whitespace + trailing punctuation that can sneak in
    .replace(/[\s\u200B-\u200D\uFEFF]+$/g, "")
    .replace(/[.,;:!?]+$/g, "");
}

function getPlaceBySlugRobust(slug) {
  const places = placesData.places || [];
  const clean = cleanSlug(slug);

  // 1) exact match
  let p = places.find((x) => x.slug === clean);
  if (p) return p;

  // 2) case-insensitive match
  const cleanLower = clean.toLowerCase();
  p = places.find((x) => (x.slug || "").toLowerCase() === cleanLower);
  if (p) return p;

  // 3) fallback: match by numeric id at end of slug: name-<id>
  const m = clean.match(/-(\d+)$/);
  if (m) {
    const id = m[1];
    p = places.find((x) => (x.slug || "").endsWith(`-${id}`));
    if (p) return p;
  }

  return null;
}

export async function generateMetadata({ params }) {
  const place = getPlaceBySlugRobust(params.slug);
  if (!place) return {};

  return {
    title: `${place.name} | Manchester Sandwich Finder`,
    description: place.address
      ? `${place.name} — ${place.address}`
      : `${place.name} in Manchester`,
  };
}

export default async function PlacePage({ params }) {
  const place = getPlaceBySlugRobust(params.slug);
  if (!place) notFound();

  const mapsUrl =
    place.lat && place.lon
      ? `https://www.google.com/maps?q=${place.lat},${place.lon}`
      : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    address: place.address || undefined,
    geo:
      place.lat && place.lon
        ? { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lon }
        : undefined,
    url: place.website || undefined,
  };

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1>{place.name}</h1>

      {place.address ? <p><strong>Address:</strong> {place.address}</p> : null}
      {place.opening_hours ? <p><strong>Hours:</strong> {place.opening_hours}</p> : null}
      {place.phone ? <p><strong>Phone:</strong> {place.phone}</p> : null}
      {place.website ? (
        <p><strong>Website:</strong> <a href={place.website} rel="nofollow">{place.website}</a></p>
      ) : null}
      {mapsUrl ? <p><a href={mapsUrl} rel="nofollow">Open in Google Maps</a></p> : null}

      <p style={{ fontSize: 14, opacity: 0.8 }}>
        Source: <a href={place.source} rel="nofollow">OpenStreetMap</a>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}