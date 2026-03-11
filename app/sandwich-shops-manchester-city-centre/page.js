import Link from "next/link";
import placesData from "@/data/places.json";

const SITE = "https://manchester-sandwich-finder.vercel.app";

export const metadata = {
  title: "Sandwich shops in Manchester city centre | Manchester Sandwich Finder",
  description:
    "A practical guide to sandwich and deli spots in Manchester city centre, with a live directory pulled from open data.",
};

function isCityCentrePlace(place) {
  const address = (place.address || "").toLowerCase();

  // Main city-centre postcode prefixes
  const cityCentrePostcode = /\bm[1-4]\b/i.test(place.address || "");

  // Backup area keywords in case postcode is missing
  const cityCentreArea =
    address.includes("manchester") &&
    (
      address.includes("piccadilly") ||
      address.includes("deansgate") ||
      address.includes("northern quarter") ||
      address.includes("spinningfields") ||
      address.includes("oxford road") ||
      address.includes("ancoats") ||
      address.includes("castlefield")
    );

  return cityCentrePostcode || cityCentreArea;
}

function sortPlaces(a, b) {
  return (a.name || "").localeCompare(b.name || "");
}

export default function ManchesterCityCentreSandwichGuidePage() {
  const allPlaces = placesData.places || [];
  const cityCentrePlaces = allPlaces.filter(isCityCentrePlace).sort(sortPlaces);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What counts as Manchester city centre on this page?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This guide mainly uses listings with Manchester city-centre postcodes such as M1, M2, M3 and M4, plus nearby central areas when the address clearly suggests a city-centre location.",
        },
      },
      {
        "@type": "Question",
        name: "Are these listings ranked from best to worst?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This page is a practical directory-style guide, not a rating table. It is designed to help people quickly find relevant sandwich and deli options in central Manchester.",
        },
      },
      {
        "@type": "Question",
        name: "Where does the listing data come from?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The base listing data is pulled from OpenStreetMap and may be incomplete or outdated. Always check a business website, phone number or maps listing before travelling.",
        },
      },
    ],
  };

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "system-ui",
        lineHeight: 1.6,
      }}
    >
      <nav style={{ marginBottom: 20, fontSize: 14 }}>
        <Link href="/">← Back to homepage</Link>
      </nav>

      <h1>Sandwich shops in Manchester city centre</h1>

      <p>
        This page is a practical guide to finding sandwich and deli spots in
        Manchester city centre. Instead of trying to make exaggerated “best of”
        claims, it focuses on a cleaner question: <strong>where can you find
        relevant sandwich options in central Manchester?</strong>
      </p>

      <p>
        For this guide, city centre mainly means businesses with addresses in
        core Manchester postcodes such as <strong>M1, M2, M3 and M4</strong>,
        plus nearby central areas when the address clearly points to a
        city-centre location.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2>Quick tips before you choose</h2>
        <ul>
          <li>Need something fast? Check spots close to stations and main office areas.</li>
          <li>Need lunch on foot? Focus on M1–M4 addresses first.</li>
          <li>Need dietary options? Always confirm directly with the business before travelling.</li>
          <li>Need catering? A direct website or phone number is the fastest next step.</li>
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>City-centre listings</h2>

        {cityCentrePlaces.length === 0 ? (
          <p>
            No city-centre matches were found in the current dataset. You can
            still browse the full directory on the homepage.
          </p>
        ) : (
          <>
            <p>
              The listings below are filtered from the current directory data.
              Because the underlying data is open-source and automatically
              collected, it should be treated as a starting point rather than a
              final recommendation.
            </p>

            <ul style={{ paddingLeft: 18 }}>
              {cityCentrePlaces.map((place) => (
                <li key={place.id} style={{ marginBottom: 16 }}>
                  <strong>{place.name}</strong>
                  {place.address ? (
                    <div style={{ opacity: 0.85 }}>{place.address}</div>
                  ) : null}
                  {place.website ? (
                    <div>
                      <a href={place.website} rel="nofollow">
                        Visit website
                      </a>
                    </div>
                  ) : null}
                  {place.phone ? (
                    <div style={{ opacity: 0.85 }}>{place.phone}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>How to use this guide</h2>
        <p>
          This page works best as a fast shortlist. Find a central location that
          suits your route, then double-check opening hours, menu details and
          dietary options with the business directly.
        </p>
        <p>
          Browse the full directory here: <Link href="/">Manchester Sandwich Finder homepage</Link>.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Frequently asked questions</h2>

        <h3>What counts as Manchester city centre on this page?</h3>
        <p>
          Mainly M1, M2, M3 and M4 addresses, plus clearly central areas where
          the address strongly suggests a city-centre location.
        </p>

        <h3>Are these businesses ranked?</h3>
        <p>
          No. This is a practical discovery page, not a scored ranking.
        </p>

        <h3>Is the data always up to date?</h3>
        <p>
          Not always. The page uses open data and should be treated as a
          starting point. Always confirm details before visiting.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}