import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

// the root title template adds the "· dhir patel" suffix; next adds the
// noindex robots tag to not-found responses itself (setting robots here too
// would emit a second tag). own og / twitter tags with no path, so no
// canonical or og:url - a 404 never shares as the home page
export const metadata: Metadata = pageMetadata({
  title: "not found",
  description: "there's nothing at this address.",
});

export default function NotFound() {
  return (
    <main id="main" className="container">
      {/* block wrapper: .back-link and .gradient-title are both inline-level,
          so without it they sit side by side on wide viewports */}
      <div>
        <Link className="back-link" href="/">
          <span>[&lt;]</span> back
        </Link>
      </div>
      <h1 className="gradient-title" style={{ fontSize: "clamp(52px, 7vw, 88px)", marginTop: 40 }}>
        not found
      </h1>
      <p style={{ color: "#9a9a95", fontSize: 15, marginTop: 16 }}>
        there&apos;s nothing at this address.
      </p>
    </main>
  );
}
