import placesData from "../data/places.json";

export async function getAllPlaces() {
  return placesData.places || [];
}

export async function getPlaceBySlug(slug) {
  const places = placesData.places || [];
  return places.find((p) => p.slug === slug) || null;
}