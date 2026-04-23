import { HeaderSection } from "@/components/HeaderSection";
import { NavLinks } from "@/components/NavLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { TimelineGrid } from "@/components/TimelineGrid";

export default function HomePage() {
  return (
    <main className="site-container">
      <div className="space-y-12 sm:space-y-14">
        <HeaderSection />
        <TimelineGrid />
        <NavLinks />
      </div>
      <SiteFooter />
    </main>
  );
}
