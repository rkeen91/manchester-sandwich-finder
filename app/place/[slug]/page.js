export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { notFound } from "next/navigation";
import { getAllPlaces, getPlaceBySlug } from "@/lib/places";

export async function generateStaticParams() {
  const places = await getAllPlaces();
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const place = await getPlaceBySlug(params.slug);
  if (!place) return {};
  return {
    title: `${place.name} | Manchester Sandwich Finder`,
    description: place.address ? `${place.name} — ${place.address}` : `${place.name} in Manchester`,
  };
}

export default async function PlacePage({ params }) {
  const place = await getPlaceBySlug(params.slug);
  if (!place) notFound();

  const mapsUrl =
    place.lat && place.lon ? `https://www.google.com/maps?q=${place.lat},${place.lon}` : null;

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
        <p>
          <strong>Website:</strong> <a href={place.website}>{place.website}</a>
        </p>
      ) : null}
      {mapsUrl ? <p><a href={mapsUrl}>Open in Google Maps</a></p> : null}

      <p style={{ fontSize: 14, opacity: 0.8 }}>
        Source: <a href={place.source}>OpenStreetMap</a>
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}