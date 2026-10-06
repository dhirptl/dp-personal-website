import type { Metadata } from "next";

export const SITE_URL = "https://www.dhirpatel.ca";
export const SITE_NAME = "dhir patel";
export const SITE_LOCALE = "en_CA";
/* the generated card from app/opengraph-image.tsx */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

type OgImage = { url: string; alt?: string };

type PageMetadataInput = {
  /** page title without the site suffix, e.g. "about me" */
  title: string;
  description: string;
  /** site-relative path, e.g. "/about" (resolved against metadataBase) */
  path: string;
  /** share image; falls back to the generated site card */
  image?: OgImage;
};

/**
 * complete metadata for a sub-page. a page-level openGraph / twitter object
 * replaces the root layout's wholesale (no deep merge), so every field is
 * restated here instead of in each page.
 */
export function pageMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
  // <title> gets the suffix from the root layout's title template; share
  // titles don't go through the template, so add it here
  const shareTitle = `${title} · ${SITE_NAME}`;
  const images: OgImage[] = [image ?? { url: DEFAULT_OG_IMAGE, alt: SITE_NAME }];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: path,
      title: shareTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images,
    },
  };
}
