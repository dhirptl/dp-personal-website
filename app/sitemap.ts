import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";

const BASE = "https://www.dhirpatel.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/portfolio",
    ...SITE.projects.map((p) => `/portfolio/${p.slug}`),
    ...Object.keys(SITE.expDetail).map((slug) => `/experience/${slug}`),
  ];
  return paths.map((path) => ({ url: `${BASE}${path === "/" ? "" : path}` }));
}
