import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "places.json");

export async function getAllPlaces() {
  const raw = await fs.readFile(FILE, "utf8");
  const data = JSON.parse(raw);
  return data.places || [];
}

export async function getPlaceBySlug(slug) {
  const places = await getAllPlaces();
  return places.find((p) => p.slug === slug) || null;
}