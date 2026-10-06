import { ImageResponse } from "next/og";

export const alt = "dhir patel - mechatronics & robotics, university of alberta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// uses next/og's bundled default font, so nothing is fetched at build time
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px 88px",
          background: "#0a0a0a",
          color: "#f3f3f0",
        }}
      >
        <div style={{ fontSize: 120, letterSpacing: "-0.04em", lineHeight: 1 }}>dhir patel</div>
        <div style={{ marginTop: 28, fontSize: 36, color: "#8c8c87" }}>
          mechatronics & robotics · university of alberta
        </div>
        <div
          style={{
            marginTop: 56,
            width: 120,
            height: 2,
            background: "rgba(255, 255, 255, 0.16)",
          }}
        />
      </div>
    ),
    size,
  );
}
