import placesData from "../data/places.json";

function normalizeSlug(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    // remove trailing punctuation + invisible whitespace that sometimes gets copied
    .replace(/[\s\u200B-\u200D\uFEFF]+$/g, "")
    .replace(/[.,;:!?]+$/g, "");
}

export async function getAllPlaces() {
  return placesData.places || [];
}

export async function getPlaceBySlug(slug) {
  const places = placesData.places || [];
  const clean = normalizeSlug(slug);

  // 1) exact match
  let place = places.find((p) => normalizeSlug(p.slug) === clean);
  if (place) return place;

  // 2) fallback: match by trailing numeric id (slug format: name-<id>)
  // works even if the name differs or extra chars exist
  const m = clean.match(/-(\d+)\D*$/);
  if (m) {
    const id = m[1];
    place = places.find((p) => (p.slug || "").endsWith(`-${id}`));
    if (place) return place;
  }

  return null;
}