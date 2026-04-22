import { HeaderSection } from "@/components/HeaderSection";
import { NavLinks } from "@/components/NavLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimelineGrid } from "@/components/TimelineGrid";

export default function HomePage() {
  return (
    <main className="site-container">
      <div className="mb-10 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="space-y-14">
        <HeaderSection />
        <TimelineGrid />
        <NavLinks />
      </div>
      <SiteFooter />
    </main>
  );
}
