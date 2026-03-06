import { getAllPlaces } from "@/lib/places";
import PlacesSearch from "./components/PlacesSearch";

export const metadata = {
  title: "Manchester Sandwich Finder (Open Data Directory)",
  description:
    "A simple directory of sandwich and deli spots around Manchester, built from OpenStreetMap data.",
};

export default async function Home() {
  const places = await getAllPlaces();

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "system-ui",
      }}
    >
      <h1>Manchester Sandwich Finder</h1>
      <p>
        Open-data directory built from OpenStreetMap. Listings may be incomplete
        or outdated.
      </p>

      <PlacesSearch places={places} />

      <hr />
      <p style={{ fontSize: 14, opacity: 0.8 }}>
        This is a test bed for “AI-ready” local pages + data.
      </p>
    </main>
  );
}