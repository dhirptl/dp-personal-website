import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn(bricolageGrotesque.variable, ibmPlexMono.variable, "font-sans dark", geist.variable)}>
      <body style={{ fontFamily: "var(--font-display), sans-serif" }}>
        <a href="#main" className="skip-link">
          skip to content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
