"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReduced } from "@/lib/motion";

/** Infinite marquee whose speed and direction follow scroll velocity. */
export default function Marquee({ children, speed = 1, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    let x = 0, dir = 1;
    const tick = () => {
      const v = window.__lenis?.velocity ?? 0;
      if (v > 0.5) dir = 1; else if (v < -0.5) dir = -1;
      x -= (speed * 0.06 + Math.min(Math.abs(v), 40) * 0.012) * dir;
      if (x <= -50) x += 50;
      if (x > 0) x -= 50;
      if (track.current) track.current.style.transform = `translate3d(${x}%,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed]);
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="marquee">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
