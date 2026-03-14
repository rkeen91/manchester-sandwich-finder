import Link from "next/link";
import placesData from "@/data/places.json";

export const metadata = {
  title: "Vegan sandwiches in Manchester | Manchester Sandwich Finder",
  description:
    "A practical guide to vegan-friendly sandwich and deli options in Manchester, based on open directory data and clear usability notes.",
};

function sortPlaces(a, b) {
  return (a.name || "").localeCompare(b.name || "");
}

function looksPossiblyVeganFriendly(place) {
  const text = `${place.name || ""} ${place.address || ""} ${place.website || ""}`.toLowerCase();

  return (
    text.includes("vegan") ||
    text.includes("deli") ||
    text.includes("bakery") ||
    text.includes("bakes") ||
    text.includes("middle eastern") ||
    text.includes("falafel") ||
    text.includes("salad") ||
    text.includes("artisan")
  );
}

export default function VeganSandwichesManchesterPage() {
  const allPlaces = placesData.places || [];
  const likelyPlaces = allPlaces
    .filter(looksPossiblyVeganFriendly)
    .sort(sortPlaces)
    .slice(0, 25);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are all listings on this page fully vegan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This is a practical shortlist of places that may be useful when searching for vegan sandwich options in Manchester. Always confirm the current menu directly with the business.",
        },
      },
      {
        "@type": "Question",
        name: "Why are some listings included even if vegan is not in the business name?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This page uses open directory data and practical matching signals such as deli, bakery or likely menu relevance. It is intended as a discovery aid rather than a certified vegan directory.",
        },
      },
      {
        "@type": "Question",
        name: "What should I check before visiting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check the latest menu, opening hours and whether vegan substitutions are still available before travelling.",
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

      <h1>Vegan sandwiches in Manchester</h1>

      <p>
        This page is a practical guide for people looking for{" "}
        <strong>vegan-friendly sandwich options in Manchester</strong>. It is not a
        perfect or official vegan directory. Instead, it is designed to help you
        build a shortlist faster and then check the final menu details directly
        with the business.
      </p>

      <p>
        Because the base listings come from open data, the best way to use this
        page is to treat it as a <strong>starting point</strong>. If you need
        strict vegan options, always confirm ingredients, substitutions and
        preparation practices before ordering.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2>How to use this page</h2>
        <ul>
          <li>Start with the shortlist below.</li>
          <li>Check whether the business website mentions vegan menu items.</li>
          <li>Call ahead if you need certainty about substitutions or allergens.</li>
          <li>
            Use the city-centre guide as a second step if you also care about
            location.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Manchester shortlist</h2>

        {likelyPlaces.length === 0 ? (
          <p>
            No likely matches were found in the current dataset. You can still
            browse the full directory on the homepage.
          </p>
        ) : (
          <>
            <p>
              These listings are included because they look more likely than
              average to be useful for vegan sandwich searches based on available
              open-data signals.
            </p>

            <ul style={{ paddingLeft: 18 }}>
              {likelyPlaces.map((place) => (
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
        <h2>What makes a place useful for vegan sandwich searches?</h2>
        <p>
          The most useful places are usually ones that either explicitly mention
          vegan options, offer flexible menu substitutions, or operate in
          categories where vegan fillings are more common, such as deli, bakery,
          falafel or salad-led lunch spots.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Related pages</h2>
        <p>
          Looking for central locations as well? Visit{" "}
          <Link href="/sandwich-shops-manchester-city-centre">
            Sandwich shops in Manchester city centre
          </Link>
          .
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Frequently asked questions</h2>

        <h3>Are all listings on this page fully vegan?</h3>
        <p>No. This is a practical shortlist, not a certified vegan directory.</p>

        <h3>Why are some listings included even if vegan is not in the name?</h3>
        <p>
          Because open directory data is limited, this page uses practical
          relevance signals rather than strict category labels alone.
        </p>

        <h3>Should I still check the menu before visiting?</h3>
        <p>Yes. Menus, substitutions and opening hours can change.</p>
      </section>

      <section style={{ marginTop: 32, fontSize: 14, opacity: 0.85 }}>
        <p>
          <strong>Method note:</strong> this page is built from open directory
          data and light relevance filtering. It is intended as a useful
          shortlist, not a final judgement or ranking.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
