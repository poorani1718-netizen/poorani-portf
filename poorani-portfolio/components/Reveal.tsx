"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { introDelay, prefersReduced } from "@/lib/motion";

type Props = {
  text: string;
  as?: "h1" | "h2" | "div" | "p" | "span";
  className?: string;
  by?: "words" | "chars";
  scroll?: boolean; // reveal on scroll instead of on mount
  stagger?: number;
  delay?: number;
};

/** Masked kinetic text reveal. Text is fully visible without JS; GSAP animates it in. */
export default function Reveal({ text, as = "div", className = "", by = "words", scroll = false, stagger, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (prefersReduced()) return;
    const items = ref.current!.querySelectorAll(".w-in");
    gsap.from(items, {
      yPercent: 115,
      rotate: by === "chars" ? 8 : 3,
      duration: 1.05,
      ease: "expo.out",
      stagger: stagger ?? (by === "chars" ? 0.035 : 0.06),
      delay: scroll ? delay : introDelay() + delay,
      scrollTrigger: scroll ? { trigger: ref.current, start: "top 88%" } : undefined,
    });
  }, { scope: ref });

  const words = text.split(" ");
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          {by === "chars" ? (
            <span className="inline-block whitespace-nowrap">
              {w.split("").map((c, j) => (
                <span key={j} className="w-mask"><span className="w-in">{c}</span></span>
              ))}
            </span>
          ) : (
            <span className="w-mask"><span className="w-in">{w}</span></span>
          )}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
