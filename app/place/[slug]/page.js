export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAllPlaces, getPlaceBySlug } from "@/lib/places";

export async function generateMetadata({ params }) {
  const slug = decodeURIComponent(params.slug || "");
  const place = await getPlaceBySlug(slug);

  return {
    title: place ? `${place.name} | Manchester Sandwich Finder` : `Not found | Manchester Sandwich Finder`,
    description: place?.address ? `${place.name} — ${place.address}` : "Place listing in Manchester Sandwich Finder",
  };
}

export default async function PlacePage({ params }) {
  const slug = decodeURIComponent(params.slug || "");
  const place = await getPlaceBySlug(slug);

  // IMPORTANT: do NOT call notFound() yet — show a debug page instead
  if (!place) {
    const places = await getAllPlaces();
    return (
      <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
        <h1>Debug: place not found</h1>
        <p><strong>Requested slug:</strong> {slug}</p>
        <p><strong>Places loaded:</strong> {places.length}</p>
        <p>First 10 slugs:</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(places.slice(0, 10).map(p => p.slug), null, 2)}
        </pre>
      </main>
    );
  }

  const mapsUrl =
    place.lat && place.lon ? `https://www.google.com/maps?q=${place.lat},${place.lon}` : null;

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1>{place.name}</h1>
      {place.address ? <p><strong>Address:</strong> {place.address}</p> : null}
      {place.opening_hours ? <p><strong>Hours:</strong> {place.opening_hours}</p> : null}
      {place.phone ? <p><strong>Phone:</strong> {place.phone}</p> : null}
      {place.website ? (
        <p><strong>Website:</strong> <a href={place.website}>{place.website}</a></p>
      ) : null}
      {mapsUrl ? <p><a href={mapsUrl}>Open in Google Maps</a></p> : null}

      <p style={{ fontSize: 14, opacity: 0.8 }}>
        Source: <a href={place.source}>OpenStreetMap</a>
      </p>
    </main>
  );
}