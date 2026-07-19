"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  ".concept-hero",
  ".collection-story",
  ".page-hero",
  ".section-heading",
  ".home-quick-buy",
  ".quick-buy-item",
  ".quick-buy-alex",
  ".intent-grid > *",
  ".decision-grid > *",
  ".brand-proof-copy",
  ".brand-proof-card",
  ".product-grid > *",
  ".catalog-intent-bar",
  ".catalog-guidance > *",
  ".checkout-grid > *",
  ".product-story",
  ".product-buy",
  ".builder-panel",
  ".quote-panel",
  ".b2b-steps > *",
].join(", ");

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const body = document.body;

    const setupMotion = () => {
      const reduced = mediaQuery.matches;
      body.dataset.motion = reduced ? "reduce" : "ready";

      const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

      elements.forEach((element, index) => {
        element.style.setProperty("--motion-index", String(index % 6));
        if (reduced) {
          element.dataset.motionVisible = "true";
        } else {
          delete element.dataset.motionVisible;
        }
      });

      if (reduced) {
        return () => undefined;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-motion-visible", "true");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -10% 0px",
        },
      );

      elements.forEach((element, index) => {
        if (index < 3) {
          element.dataset.motionVisible = "true";
          return;
        }

        observer.observe(element);
      });

      return () => observer.disconnect();
    };

    let cleanup = setupMotion();
    const handleChange = () => {
      cleanup();
      cleanup = setupMotion();
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      cleanup();
      delete body.dataset.motion;
    };
  }, [pathname]);

  return null;
}
