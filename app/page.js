import Link from "next/link";
import { getAllPlaces } from "@/lib/places";

export const metadata = {
  title: "Manchester Sandwich Finder",
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

      <section
        style={{
          margin: "24px 0",
          padding: "16px",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Start with the guides</h2>
        <p>
          Use the guide pages first if you want something more focused than the
          full directory.
        </p>
        <p>
          <Link href="/sandwich-shops-manchester-city-centre">
            Sandwich shops in Manchester city centre →
          </Link>
        </p>
        <p>
          <Link href="/vegan-sandwiches-manchester">
            Vegan sandwiches in Manchester →
          </Link>
        </p>
      </section>

      <ul style={{ paddingLeft: 18 }}>
        {places.map((p) => (
          <li key={p.id} style={{ marginBottom: 14 }}>
            <strong>{p.name}</strong>
            {p.address ? <div style={{ opacity: 0.8 }}>{p.address}</div> : null}
            {p.website ? (
              <div>
                <a href={p.website} rel="nofollow">
                  Website
                </a>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <hr />
      <p style={{ fontSize: 14, opacity: 0.8 }}>
        This is a test bed for AI-ready local pages and data.
      </p>
    </main>
  );
}
