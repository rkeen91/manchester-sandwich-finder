import fs from "node:fs/promises";
import path from "node:path";

const OUT_FILE = path.join(process.cwd(), "data", "places.json");

// Manchester center
const LAT = 53.4808;
const LON = -2.2426;
const RADIUS = 15000; // 15km (reliable)

// Try multiple Overpass instances (some will be down/slow)
const ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function runOverpass(query) {
  let lastErr = null;

  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "text/plain",
          // helps some servers treat you nicely
          "user-agent": "manchester-sandwich-finder/1.0 (test project)",
        },
        body: query,
      });

      if (!res.ok) {
        const t = await res.text();
        lastErr = new Error(`Overpass ${res.status} from ${url}: ${t.slice(0, 120)}`);
        continue;
      }

      const json = await res.json();
      console.log(`OK from ${url} | elements: ${json.elements?.length ?? 0}`);
      if (json.remark) console.log("Remark:", json.remark);
      return json;
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All Overpass endpoints failed");
}

function toKey(el) {
  return `${el.type}-${el.id}`;
}

function elementToPlace(el) {
  const t = el.tags || {};
  const name = t.name?.trim();
  if (!name) return null;

  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;

  const addrParts = [
    t["addr:housenumber"],
    t["addr:street"],
    t["addr:city"],
    t["addr:postcode"],
  ].filter(Boolean);

  return {
    id: toKey(el),
    slug: `${slugify(name)}-${el.id}`,
    name,
    lat,
    lon,
    address: addrParts.join(", "),
    website: t.website || t["contact:website"] || "",
    phone: t.phone || t["contact:phone"] || "",
    opening_hours: t.opening_hours || "",
    source: `https://www.openstreetmap.org/${el.type}/${el.id}`,
  };
}

async function main() {
  // Split into smaller queries (less likely to 504)
  const queries = [
    // 1) deli shops
    `
[out:json][timeout:40];
nwr(around:${RADIUS},${LAT},${LON})["shop"="deli"];
out center tags;
`,
    // 2) cuisine tagged sandwich-ish
    `
[out:json][timeout:40];
nwr(around:${RADIUS},${LAT},${LON})["amenity"~"restaurant|cafe|fast_food"]["cuisine"~"sandwich|bagel|deli|subs",i];
out center tags;
`,
    // 3) name keywords fallback
    `
[out:json][timeout:40];
nwr(around:${RADIUS},${LAT},${LON})["amenity"~"restaurant|cafe|fast_food"]["name"~"sandwich|deli|bagel|panini|bap|butty|subs|toastie",i];
out center tags;
`,
  ];

  const merged = new Map();

  for (const q of queries) {
    const json = await runOverpass(q);
    for (const el of json.elements || []) {
      merged.set(toKey(el), el);
    }
  }

  const places = [...merged.values()]
    .map(elementToPlace)
    .filter(Boolean)
    .slice(0, 80);

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(
    OUT_FILE,
    JSON.stringify({ updatedAt: new Date().toISOString(), places }, null, 2)
  );

  console.log(`Saved ${places.length} places to ${OUT_FILE}`);
}

main().catch((e) => {
  console.error("FETCH FAILED:", e.message);
  process.exit(1);
});