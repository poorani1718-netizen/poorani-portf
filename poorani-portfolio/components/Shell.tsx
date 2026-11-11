"use client";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "motion";
import { useRoute } from "@/lib/router";
import { CHANNELS, channelFor } from "@/lib/data";
import { setTransitioning, prefersReduced } from "@/lib/motion";
import Cursor from "./Cursor";
import Nav from "./Nav";
import WhatsAppFab from "./WhatsAppFab";

gsap.registerPlugin(ScrollTrigger);

type Ctx = { go: (path: string) => void; path: string };
const TransitionCtx = createContext<Ctx>({ go: () => {}, path: "/" });
export const useGo = () => useContext(TransitionCtx).go;
export const usePath = () => useContext(TransitionCtx).path;

declare global {
  interface Window { __lenis?: Lenis }
}

export default function Shell({ children }: { children: ReactNode }) {
  const { path, push } = useRoute();
  const curtain = useRef<HTMLDivElement>(null);
  const chRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const blurbRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pending = useRef(false);
  const pathRef = useRef(path);
  pathRef.current = path;

  // Smooth scroll (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: !prefersReduced() });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); window.__lenis = undefined; };
  }, []);

  const go = useCallback(async (to: string) => {
    if (busy.current || to === pathRef.current) return;
    busy.current = true;
    setTransitioning(true);
    const c = channelFor(to);
    const el = curtain.current!;
    el.style.background = c.bg;
    el.style.color = c.fg;
    chRef.current!.textContent = `CH ${c.ch}`;
    nameRef.current!.textContent = c.name;
    blurbRef.current!.textContent = c.blurb;
    el.style.visibility = "visible";
    const reduce = prefersReduced();
    await animate(el, { clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] }, { duration: reduce ? 0.01 : 0.6, ease: [0.76, 0, 0.24, 1] });
    animate(nameRef.current!, { y: ["60%", "0%"], opacity: [0, 1] }, { duration: reduce ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] });
    pending.current = true;
    push(to);
  }, [push]);

  // When the route changes: reset scroll, then lift the curtain
  useEffect(() => {
    document.body.style.backgroundColor = channelFor(path).bg;
    document.title = path === "/" ? "Poorani K — Digital Marketer" : `${channelFor(path).name} — Poorani K`;
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    if (!pending.current) { requestAnimationFrame(() => ScrollTrigger.refresh()); return; }
    pending.current = false;
    // move focus to the new page so keyboard and screen-reader users start at the top of it
    document.getElementById("main")?.focus({ preventScroll: true });
    const el = curtain.current!;
    const t = setTimeout(async () => {
      ScrollTrigger.refresh();
      await animate(el, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] }, { duration: prefersReduced() ? 0.01 : 0.7, ease: [0.76, 0, 0.24, 1] });
      el.style.visibility = "hidden";
      busy.current = false;
      setTransitioning(false);
    }, 380);
    return () => clearTimeout(t);
  }, [path]);

  // Keyboard channel surfing: number keys jump to a channel, [ and ] step
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const i = CHANNELS.findIndex((c) => c.path === pathRef.current);
      if (/^[1-9]$/.test(e.key) && +e.key <= CHANNELS.length) go(CHANNELS[+e.key - 1].path);
      if (e.key === "]") go(CHANNELS[(i + 1) % CHANNELS.length].path);
      if (e.key === "[") go(CHANNELS[(i - 1 + CHANNELS.length) % CHANNELS.length].path);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <TransitionCtx.Provider value={{ go, path }}>
      <Cursor />
      <Nav />
      <WhatsAppFab />
      <main key={path} id="main" tabIndex={-1} className="outline-none">{children}</main>
      <div className="grain" aria-hidden="true" />
      <div
        ref={curtain}
        aria-hidden="true"
        className="fixed inset-0 z-[100] flex flex-col justify-between gutter py-10"
        style={{ clipPath: "inset(100% 0% 0% 0%)", visibility: "hidden" }}
      >
        <div className="static absolute inset-0 pointer-events-none" />
        <div className="relative flex justify-between label"><span ref={chRef}>CH 01</span><span>Tuning in…</span></div>
        <div className="relative">
          <span ref={nameRef} className="display block text-[clamp(80px,22vw,360px)]">Home</span>
          <span ref={blurbRef} className="serif-i block text-[clamp(22px,3vw,44px)] mt-2">The campaign launch</span>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
