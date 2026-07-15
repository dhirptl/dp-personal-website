import type { CSSProperties } from "react";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";

const ICONS = {
  linkedin: "/images/icons/linkedin.png",
  github: "/images/icons/github.png",
  x: "/images/icons/x.png",
  email: "/images/icons/mail.png",
} as const;

export type SocialLabel = keyof typeof ICONS;

export function hasSocialIcon(label: string) {
  return label.toLowerCase() in ICONS;
}

type ChromeSize = "sm" | "md" | "lg";

const GLYPH_PX: Record<ChromeSize, number> = {
  sm: 15,
  md: 17,
  lg: 19,
};

function iconSrc(label: string) {
  return ICONS[label.toLowerCase() as SocialLabel];
}

export function SocialIcon({
  label,
  size = 22,
  className,
}: {
  label: string;
  size?: number;
  className?: string;
}) {
  const src = iconSrc(label);
  if (!src) return null;

  return (
    <span
      className={["social-chrome-glyph", className].filter(Boolean).join(" ")}
      style={
        {
          width: size,
          height: size,
          "--social-icon": `url(${src})`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

export function SocialChromeLink({
  href,
  label,
  size = "md",
  onClick,
}: {
  href: string;
  label: string;
  size?: ChromeSize;
  onClick?: () => void;
}) {
  const external = href.startsWith("http");
  const chromeClass = ["social-chrome", size === "md" ? "" : size]
    .filter(Boolean)
    .join(" ");

  return (
    <WithLiquidMetal
      as="a"
      href={href}
      className={chromeClass}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
    >
      <SocialIcon label={label} size={GLYPH_PX[size]} />
    </WithLiquidMetal>
  );
}
