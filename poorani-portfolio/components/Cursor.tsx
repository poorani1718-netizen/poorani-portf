"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isFinePointer } from "@/lib/motion";

/** Dot + ring cursor. Elements with data-cursor="Label" turn the ring into a labelled disc. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    gsap.set([dot.current, ring.current], { opacity: 0 });
    const move = (e: PointerEvent) => {
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2, overwrite: "auto" });
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const r = ring.current!;
      if (labelled) {
        text.current!.textContent = labelled.dataset.cursor || "";
        r.classList.add("is-label"); r.classList.remove("is-hover");
      } else {
        r.classList.remove("is-label");
        r.classList.toggle("is-hover", !!t.closest("a,button,input,textarea,label,[role=button]"));
      }
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring hidden [@media(hover:hover)_and_(pointer:fine)]:grid" aria-hidden="true"><span ref={text} /></div>
      <div ref={dot} className="cursor-dot hidden [@media(hover:hover)_and_(pointer:fine)]:block" aria-hidden="true" />
    </>
  );
}
