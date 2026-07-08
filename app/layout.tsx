import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "dhir patel",
  description: "dhir patel — bsc engineering, university of alberta. robotics, ml, and product design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${ibmPlexMono.variable}`}>
      <body style={{ fontFamily: "var(--font-display), sans-serif" }}>
        <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <mask id="eng-river-mask" maskUnits="objectBoundingBox">
              <rect width="1" height="1" fill="#000" />
              <ellipse cx="0.5" cy="0.84" rx="0.56" ry="0.52" fill="#fff" />
              <ellipse cx="0.5" cy="0.2" rx="0.5" ry="0.46" fill="#000" />
            </mask>
            <filter id="eng-iri-strands" colorInterpolationFilters="sRGB">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.014 0.11"
                numOctaves="4"
                seed="7"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="2.6s"
                  values="0.014 0.11;0.022 0.14;0.014 0.11"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="9"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <a href="#main" className="skip-link">
          skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
