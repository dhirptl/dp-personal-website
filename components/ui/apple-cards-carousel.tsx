"use client";
import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ImgHTMLAttributes } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { WithLiquidMetal } from "@/components/WithLiquidMetal";
import styles from "@/components/ProjectsCarousel.module.css";

/* matches --ease-premium in globals.css (CSS custom properties aren't
   readable inside JS animation configs, so the bezier is inlined) */
const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* site convention: 760px primary breakpoint (not Tailwind's 768px md:) */
const MOBILE_BREAKPOINT = 760;

/* must match .cardFace sizes + .track gap in ProjectsCarousel.module.css */
const CARD_WIDTH = 384;
const CARD_WIDTH_MOBILE = 224;
const CARD_GAP = 16;

/* the modal portals to document.body, which only exists client-side.
   useSyncExternalStore (server snapshot false, client snapshot true) reports
   "mounted" without a setState-in-effect render cascade. */
const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
  /* root element of the carousel — inerted while a card's modal is open */
  rootRef: React.RefObject<HTMLDivElement | null> | null;
}>({
  onCardClose: () => {},
  currentIndex: 0,
  rootRef: null,
});

/* id for the modal's description paragraph — the modal's `content` node
   should put this on its overview/lede paragraph (see ProjectCardContent) */
export const ModalDescriptionContext = createContext<string | undefined>(
  undefined,
);

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll, checkScrollability]);

  const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

  const cardStep = () =>
    (isMobile() ? CARD_WIDTH_MOBILE : CARD_WIDTH) + CARD_GAP;

  const scrollBehavior = (): ScrollBehavior =>
    reduceMotion ? "auto" : "smooth";

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -cardStep(),
      behavior: scrollBehavior(),
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: cardStep(),
      behavior: scrollBehavior(),
    });
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: cardStep() * (index + 1),
        behavior: scrollBehavior(),
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex, rootRef }}
    >
      <div className={styles.carousel} ref={rootRef}>
        <div
          className={styles.scroller}
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={styles.track}>
            {items.map((item, index) => (
              <motion.div
                key={"card" + index}
                className={styles.cell}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.5,
                        delay: Math.min(0.08 * index, 0.4),
                        ease: EASE_PREMIUM,
                      },
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className={styles.controls}>
          <WithLiquidMetal
            type="button"
            className={styles.navBtn}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="scroll to previous projects"
          >
            <IconArrowNarrowLeft aria-hidden="true" />
          </WithLiquidMetal>
          <WithLiquidMetal
            type="button"
            className={styles.navBtn}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="scroll to next projects"
          >
            <IconArrowNarrowRight aria-hidden="true" />
          </WithLiquidMetal>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const containerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLButtonElement>(null);
  const { onCardClose, rootRef } = useContext(CarouselContext);
  const reduceMotion = useReducedMotion();

  const uid = useId();
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-desc`;

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  /* body scroll lock — only while the modal is open */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  /* Focus trap owns Tab cycling, Escape -> handleClose, and focus restore.
     It is only active while `open`, so Escape pressed elsewhere on the page
     no longer scrolls the carousel (previously the keydown listener was
     attached unconditionally). Declared BEFORE the inert effect below so it
     captures the trigger's focus before the carousel is inerted. */
  useFocusTrap(containerRef, open, handleClose);
  useOutsideClick(containerRef, handleClose, open);

  /* Defense-in-depth: inert the carousel behind the (portaled) modal.
     Imperative rather than React-rendered so cleanup ordering is exact:
     the trap's focus-restore runs first (a no-op while the root is still
     inert), then this cleanup un-inerts and re-asserts focus on the card. */
  useEffect(() => {
    if (!open) return;
    // `inert` is an imperative DOM property, not part of React's render
    // output, so writing it on a node reached via a context-provided ref
    // is a safe escape hatch despite the immutability rule below.
    const root = rootRef?.current ?? null;
    const face = faceRef.current;
    if (root) {
      // eslint-disable-next-line react-hooks/immutability
      root.inert = true;
    }
    return () => {
      if (root) root.inert = false;
      face?.focus();
    };
  }, [open, rootRef]);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className={styles.modalRoot}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: EASE_PREMIUM }
                  }
                  className={styles.modalScrim}
                />
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.4, ease: EASE_PREMIUM }
                  }
                  ref={containerRef}
                  layoutId={layout ? `card-${card.title}` : undefined}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  aria-describedby={descriptionId}
                  className={styles.modalPanel}
                >
                  <WithLiquidMetal
                    type="button"
                    className={styles.modalClose}
                    onClick={handleClose}
                    aria-label="close project details"
                  >
                    <IconX aria-hidden="true" />
                  </WithLiquidMetal>
                  <motion.p
                    layoutId={layout ? `category-${card.title}` : undefined}
                    className={styles.modalCategory}
                  >
                    {card.category}
                  </motion.p>
                  <motion.h2
                    layoutId={layout ? `title-${card.title}` : undefined}
                    id={titleId}
                    className={styles.modalTitle}
                  >
                    {card.title}
                  </motion.h2>
                  <ModalDescriptionContext.Provider value={descriptionId}>
                    <div className={styles.modalContent}>{card.content}</div>
                  </ModalDescriptionContext.Provider>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      <motion.button
        type="button"
        ref={faceRef}
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className={styles.cardFace}
        aria-haspopup="dialog"
      >
        <span className={styles.cardInner}>
          <BlurImage
            src={card.src}
            alt={card.title}
            className={styles.cardImage}
          />
          <span className={styles.cardScrim} aria-hidden="true" />
          <span className={styles.cardText}>
            <motion.span
              layoutId={layout ? `category-${card.category}` : undefined}
              className={styles.cardCategory}
            >
              {card.category}
            </motion.span>
            <motion.span
              layoutId={layout ? `title-${card.title}` : undefined}
              className={styles.cardTitle}
            >
              {card.title}
            </motion.span>
          </span>
          <span className={styles.cardSeam} aria-hidden="true" />
        </span>
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
}: ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
  const isDataUri = typeof src === "string" && src.startsWith("data:");
  const [isLoading, setLoading] = useState(!isDataUri);
  return (
    <img
      className={cn(
        styles.blurImage,
        isLoading && styles.blurImageLoading,
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt ?? "Background of a beautiful view"}
    />
  );
};
