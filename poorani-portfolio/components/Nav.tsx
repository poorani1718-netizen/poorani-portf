"use client";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { CHANNELS, channelFor } from "@/lib/data";
import { hrefFor } from "@/lib/router";
import { useGo, usePath } from "./Shell";
import Magnetic from "./Magnetic";

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () =>
      setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--:--"}</span>;
}

/** Broadcast-style navigation: a channel dial at the bottom and a full-screen programme guide. */
export default function Nav() {
  const path = usePath();
  const go = useGo();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const guide = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useFocusTrap(guide, open, closeBtn);
  const idx = CHANNELS.findIndex((c) => c.path === path);
  const c = channelFor(path);
  const step = (d: number) => go(CHANNELS[(idx + d + CHANNELS.length) % CHANNELS.length].path);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
  }, [open]);

  // floating preview card that follows the pointer inside the guide
  useEffect(() => {
    if (!open || !preview.current) return;
    const xTo = gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3" });
    const m = (e: PointerEvent) => { xTo(e.clientX + 24); yTo(e.clientY - 80); };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [open]);

  const pick = (p: string) => { setOpen(false); setTimeout(() => go(p), 350); };

  return (
    <>
      {/* top bar: mark + on-air clock, blended so it reads on every channel colour */}
      <header className="fixed inset-x-0 top-0 z-[60] gutter pt-[max(18px,env(safe-area-inset-top,0px))] flex items-start justify-between pointer-events-none transition-colors duration-500" style={{ color: c.fg }}>
        <Magnetic className="pointer-events-auto">
          <a
            href={hrefFor("/")}
            onClick={(e) => { e.preventDefault(); go("/"); }}
            className="display text-[34px] leading-none block"
            aria-label="P, Poorani K, home"
          >
            P
          </a>
        </Magnetic>
        <div className="label text-right leading-relaxed hidden sm:block">
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-[#ff3b3b] animate-pulse" /> On air · BLR <Clock /> IST
          </div>
          <div>Digital Marketing Analyst &amp; Trainer</div>
        </div>
      </header>

      {/* channel dial */}
      <nav
        aria-label="Channels"
        className="fixed left-1/2 -translate-x-1/2 z-[60] bottom-[max(16px,env(safe-area-inset-bottom,0px))] flex items-center gap-1 rounded-full bg-ink/85 backdrop-blur-md border border-white/15 p-1.5 text-paper shadow-[0_20px_60px_-20px_rgba(0,0,0,.6)]"
      >
        <button onClick={() => step(-1)} aria-label="Previous channel" className="w-10 h-10 rounded-full grid place-items-center hover:bg-white/10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex items-center gap-3 px-2 min-w-[150px] sm:min-w-[210px]">
          <span className="w-9 h-9 rounded-full grid place-items-center label !text-[12px] !tracking-normal shrink-0" style={{ background: c.bg === "#0C0A12" || c.bg === "#07070B" ? "#F3EEE6" : c.bg, color: c.bg === "#0C0A12" || c.bg === "#07070B" ? "#0C0A12" : c.fg }} aria-hidden="true">
            {c.ch}
          </span>
          <div className="leading-tight overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={path} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="display text-[20px]">{c.name}</div>
                <div className="label !text-[12px] opacity-90 hidden sm:block">{c.blurb}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-[3px] px-2" aria-hidden="true">
          {CHANNELS.map((ch, i) => (
            <span key={ch.slug} className="w-[3px] rounded-full transition-all duration-500" style={{ height: i === idx ? 18 : 8, background: i === idx ? "#E3FF3B" : "rgba(255,255,255,.3)" }} />
          ))}
        </div>
        <button onClick={() => step(1)} aria-label="Next channel" className="w-10 h-10 rounded-full grid place-items-center hover:bg-white/10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <button onClick={() => setOpen(true)} className="h-10 px-4 rounded-full bg-volt text-ink font-semibold text-sm flex items-center gap-2 hover:bg-paper transition-colors" aria-expanded={open}>
          <span className="grid grid-cols-2 gap-[2px]" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} className="w-[4px] h-[4px] bg-ink rounded-[1px]" />)}</span>
          Guide
        </button>
      </nav>

      {/* programme guide */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={guide}
            role="dialog"
            aria-modal="true"
            aria-label="Programme guide"
            className="fixed inset-0 z-[80] bg-ink text-paper overflow-y-auto"
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at 50% 100%)" }}
            animate={{ clipPath: "circle(150% at 50% 100%)" }}
            exit={{ clipPath: "circle(0% at 50% 100%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="gutter pt-[max(22px,env(safe-area-inset-top,0px))] pb-32 min-h-full flex flex-col">
              <div className="flex justify-between items-center label">
                <h2 className="label">Programme guide · 7 channels</h2>
                <button ref={closeBtn} onClick={() => setOpen(false)} className="label border border-white/30 rounded-full px-4 py-2 hover:bg-paper hover:text-ink transition-colors">Close · Esc</button>
              </div>
              <ul className="mt-10 flex-1 flex flex-col justify-center" onPointerLeave={() => setHover(null)}>
                {CHANNELS.map((ch, i) => (
                  <motion.li
                    key={ch.slug}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="border-t border-white/15 last:border-b"
                  >
                    <a
                      href={hrefFor(ch.path)}
                      onClick={(e) => { e.preventDefault(); pick(ch.path); }}
                      onPointerEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      className="group relative flex items-baseline gap-4 sm:gap-8 py-2 sm:py-3 overflow-hidden"
                    >
                      <span className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)]" style={{ background: ch.bg === "#0C0A12" || ch.bg === "#07070B" ? "#F3EEE6" : ch.bg }} />
                      <span className="relative label w-8 shrink-0 transition-colors group-hover:text-ink" aria-hidden="true">{ch.ch}</span>
                      <span className={`relative display text-[clamp(44px,9.5vw,136px)] transition-all duration-500 group-hover:text-ink group-hover:translate-x-4 ${ch.path === path ? "text-volt" : ""}`}>
                        {ch.name}
                      </span>
                      <span className="relative serif-i text-xl lg:text-3xl ml-auto hidden md:block opacity-60 group-hover:opacity-100 group-hover:text-ink transition">{ch.blurb}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="label opacity-90 mt-8">Tip · press 1–6 to switch channels, [ and ] to surf</p>
            </div>
            <div ref={preview} className="hidden [@media(hover:hover)]:block fixed left-0 top-0 pointer-events-none z-10">
              <AnimatePresence>
                {hover !== null && (
                  <motion.div
                    key={hover}
                    initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
                    animate={{ scale: 1, opacity: 1, rotate: -3 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-48 h-28 rounded-xl p-3 flex flex-col justify-between border border-white/20 shadow-2xl"
                    style={{ background: CHANNELS[hover].bg, color: CHANNELS[hover].fg }}
                  >
                    <span className="label">CH {CHANNELS[hover].ch} · live</span>
                    <span className="display text-3xl">{CHANNELS[hover].name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
