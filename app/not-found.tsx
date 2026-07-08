import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container">
      <Link className="back-link" href="/">
        <span>[&lt;]</span> back
      </Link>
      <h1 className="gradient-title" style={{ fontSize: "clamp(52px, 7vw, 88px)", marginTop: 40 }}>
        not found
      </h1>
      <p style={{ color: "#9a9a95", fontSize: 15, marginTop: 16 }}>
        there&apos;s nothing at this address.
      </p>
    </main>
  );
}
