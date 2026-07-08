import Link from "next/link";
import { SITE } from "@/lib/site-data";
import { GalleryTile } from "@/components/GalleryTile";
import { ImageSlot } from "@/components/ImageSlot";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <main id="main" className="container">
      <Link className="back-link rv" href="/">
        <span>[&lt;]</span> back
      </Link>

      <div className={`${styles.head} rv`} style={{ "--d": ".05s" } as React.CSSProperties}>
        <h1 className={`gradient-title ${styles.title}`}>about me</h1>
      </div>

      <p className={`${styles.lede} rv`} style={{ "--d": ".12s" } as React.CSSProperties}>
        {SITE.bio[0]}
      </p>

      <div className={`${styles.sec} rv`} style={{ "--d": ".2s" } as React.CSSProperties}>
        <div className={styles.gallery}>
          {SITE.gallery.map((g) => (
            <GalleryTile item={g} key={g.id} />
          ))}
        </div>
      </div>

      <div className={`${styles.sec} rv`} style={{ "--d": ".28s" } as React.CSSProperties}>
        <div className={styles.seclabel}>greatest albums of all time</div>
        <div className={styles.albums}>
          {SITE.albums.map((a) => (
            <div className={styles.album} key={a.id}>
              <ImageSlot
                className={styles.albumThumb}
                src={a.cover}
                alt={a.title}
                placeholder={a.title}
                shape="rounded"
                radius={10}
                zoom={1.02}
              />
              <div className={styles.acap}>
                <span className={styles.at}>{a.title}</span>
                <span className={styles.ar}>{a.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
