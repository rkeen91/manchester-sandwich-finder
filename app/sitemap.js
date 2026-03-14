const SITE = "https://manchester-sandwich-finder.vercel.app";

export default async function sitemap() {
  const now = new Date();

  return [
    {
      url: SITE,
      lastModified: now,
    },
    {
      url: `${SITE}/sandwich-shops-manchester-city-centre`,
      lastModified: now,
    },
    {
      url: `${SITE}/vegan-sandwiches-manchester`,
      lastModified: now,
    },
  ];
}
