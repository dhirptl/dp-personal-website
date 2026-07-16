import Link from "next/link";
import { SITE } from "@/lib/site-data";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import styles from "./portfolio.module.css";

export const dynamic = "force-static";

export default function PortfolioPage() {
  return (
    <main id="main" className={styles.wrap}>
      <PortfolioBrowser
        categories={SITE.projectCategories}
        projects={SITE.projects}
        heading={
          <>
            <div className={`${styles.topbar} rv`}></div>
            <div className={`${styles.head} rv`} style={{ "--d": ".06s" } as React.CSSProperties}>
              <h1 className={`gradient-title ${styles.title}`}>projects</h1>
            </div>
          </>
        }
      />

      <div className={styles.foot}>
        <Link className="arrow-link" href="/">
          home
        </Link>
        <Link className="arrow-link" href="/about">
          about me
        </Link>
      </div>
    </main>
  );
}
