"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "../Reveal";
import Visual from "../Visuals";
import Magnetic from "../Magnetic";
import NextChannel from "../NextChannel";
import { PROJECTS, type Project } from "@/lib/data";
import { useFocusTrap } from "@/lib/useFocusTrap";

const ACTS: { k: keyof Project; t: string }[] = [
  { k: "strategy", t: "Strategy" },
  { k: "execution", t: "Execution" },
  { k: "measurement", t: "Measurement" },
];

function CaseStudy({ p, onClose, onNext }: { p: Project; onClose: () => void; onNext: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useFocusTrap(dialog, true, closeBtn);
  useEffect(() => {
    window.__lenis?.stop();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => { window.__lenis?.start(); window.removeEventListener("keydown", k); };
  }, [onClose]);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [p.id]);

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${p.client} case study`}
      className="fixed inset-0 z-[85]"
      style={{ background: p.color, color: p.ink }}
      initial={{ clipPath: "inset(50% 8% 50% 8% round 40px)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      exit={{ clipPath: "inset(50% 8% 50% 8% round 40px)" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      <div ref={scroller} tabIndex={-1} data-lenis-prevent className="h-full overflow-y-auto outline-none">
        <div className="sticky top-0 z-10 gutter pt-[max(20px,env(safe-area-inset-top,0px))] pb-3 flex justify-between items-center label" style={{ background: p.color }}>
          <span>Case study · {p.kind}</span>
          <button ref={closeBtn} onClick={onClose} className="rounded-full px-4 py-2 border-2" style={{ borderColor: p.ink }}>Close · Esc</button>
        </div>
        <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <section className="gutter pt-10 pb-16 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <div className="min-w-0">
              <h2 className="display text-[clamp(72px,13vw,220px)]">{p.client}</h2>
              <p className="serif-i text-[clamp(30px,4vw,60px)] leading-[1.05] mt-4 max-w-[20ch]">{p.headline}</p>
            </div>
            <div className="flex justify-center"><Visual kind={p.visual} /></div>
          </section>
          <section className="gutter grid md:grid-cols-2 gap-4 pb-6">
            <div className="rounded-[28px] p-7 border-2" style={{ borderColor: p.ink }}>
              <span className="label opacity-90">The brief</span>
              <p className="text-2xl md:text-3xl font-medium mt-3 leading-snug">{p.brief}</p>
            </div>
            <div className="rounded-[28px] p-7" style={{ background: p.ink, color: p.color }}>
              <span className="label opacity-90">The audience</span>
              <p className="text-2xl md:text-3xl font-medium mt-3 leading-snug">{p.audience}</p>
            </div>
          </section>
          <section className="gutter pb-16">
            {ACTS.map((a, i) => (
              <div key={a.t} className="grid md:grid-cols-[260px_1fr] gap-4 md:gap-10 py-10 border-t-2" style={{ borderColor: p.ink }}>
                <div>
                  <span className="label opacity-90">Act {i + 1}</span>
                  <h3 className="display text-6xl md:text-7xl">{a.t}</h3>
                </div>
                <ul className="space-y-4">
                  {(p[a.k] as string[]).map((s) => (
                    <li key={s} className="flex gap-4 text-xl md:text-3xl leading-snug font-medium"><span aria-hidden="true">✺</span>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-6">
              {p.tags.map((t) => <span key={t} className="label px-4 py-2 rounded-full border-2" style={{ borderColor: p.ink }}>{t}</span>)}
              {p.link && (
                <a href={p.link.href} target="_blank" rel="noopener noreferrer" className="label px-4 py-2 rounded-full font-semibold" style={{ background: p.ink, color: p.color }}>{p.link.label} ↗</a>
              )}
            </div>
          </section>
          <button onClick={onNext} className="w-full gutter py-16 text-left border-t-2 group" style={{ borderColor: p.ink }} data-cursor="Next case">
            <span className="label opacity-90">Next case</span>
            <span className="display block text-[clamp(56px,10vw,160px)] group-hover:translate-x-6 transition-transform duration-500">
              {PROJECTS[(PROJECTS.findIndex((x) => x.id === p.id) + 1) % PROJECTS.length].client} →
            </span>
          </button>
          <div className="h-24" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = PROJECTS.find((p) => p.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const track = root.current!.querySelector<HTMLElement>(".pj-track")!;
      const dist = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: ".pj-pin", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      // inner parallax per poster, driven by the horizontal tween
      gsap.utils.toArray<HTMLElement>(".pj-visual").forEach((v) => {
        gsap.fromTo(v, { xPercent: 25, rotate: 6 }, {
          xPercent: -25, rotate: -6, ease: "none",
          scrollTrigger: { trigger: v.closest(".pj-poster"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      gsap.to(".pj-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".pj-pin", start: "top top", end: () => "+=" + dist(), scrub: true } });
    });
    mm.add("(max-width: 899px)", () => {
      gsap.utils.toArray<HTMLElement>(".pj-poster").forEach((el) => {
        gsap.from(el, { y: 80, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className="bg-hot text-ink overflow-x-clip">
      <section className="gutter pt-32 md:pt-40 pb-16">
        <div className="label mb-4 flex gap-6"><span>CH 04</span><span>Campaigns, case by case</span></div>
        <div className="flex items-start gap-4">
          <Reveal as="h1" by="chars" text="Campaigns" className="display text-[clamp(84px,18.5vw,320px)]" />
          <span className="serif-i text-[clamp(30px,5vw,80px)] mt-[1vw]">({String(PROJECTS.length).padStart(2, "0")})</span>
        </div>
        <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-6 items-end">
          <p className="text-[clamp(20px,2.4vw,34px)] font-medium leading-snug max-w-[34ch]">
            Organic social on Instagram and YouTube, paid performance, in-house brand work and a full training programme. Scroll through the posters, then open any case.
          </p>
          <span className="label">Bhuvan Nritya and Viswakesh show the real profiles · other visuals are mockups</span>
        </div>
      </section>

      <section className="pj-pin relative min-[900px]:h-[100svh] min-[900px]:overflow-hidden">
        <div className="pj-track flex flex-col min-[900px]:flex-row min-[900px]:h-full min-[900px]:w-max gap-4 min-[900px]:gap-0 gutter min-[900px]:p-0">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className="pj-poster group relative min-[900px]:w-[100vw] min-[900px]:h-full rounded-[32px] min-[900px]:rounded-none overflow-hidden grid min-[900px]:grid-cols-[1.1fr_1fr] items-center gap-8 p-6 md:p-10 min-[900px]:pl-[max(40px,env(safe-area-inset-left,0px))] min-[900px]:pr-[max(40px,env(safe-area-inset-right,0px))] min-[900px]:pt-24 min-[900px]:pb-28"
              style={{ background: p.color, color: p.ink }}
            >
              <div className="absolute -right-[4vw] -bottom-[6vw] display text-[clamp(200px,38vw,640px)] opacity-[.12] pointer-events-none select-none" aria-hidden="true">0{i + 1}</div>
              <div className="relative min-w-0">
                <div className="label flex gap-4 opacity-90"><span>Case 0{i + 1}</span><span>{p.kind}</span><span className="hidden sm:inline">{p.year}</span></div>
                <h2 className="display text-[clamp(64px,10vw,180px)] mt-4">{p.client}</h2>
                <p className="serif-i text-[clamp(26px,3vw,48px)] leading-[1.05] mt-3 max-w-[18ch]">{p.headline}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Magnetic>
                    <button
                      onClick={() => setOpenId(p.id)}
                      aria-haspopup="dialog"
                      data-cursor="Open"
                      className="rounded-full px-7 py-4 text-lg font-semibold transition-transform hover:scale-105"
                      style={{ background: p.ink, color: p.color }}
                    >
                      Open case study ↗
                    </button>
                  </Magnetic>
                  {p.link && (
                    <a href={p.link.href} target="_blank" rel="noopener noreferrer" data-cursor="Watch" className="rounded-full px-6 py-4 text-lg font-semibold border-2 hover:scale-105 transition-transform" style={{ borderColor: p.ink }}>
                      {p.link.label} ↗
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="label px-3 py-1.5 rounded-full border" style={{ borderColor: p.ink }}>{t}</span>)}</div>
                </div>
              </div>
              <div className="pj-visual relative flex justify-center items-center py-6">
                <Visual kind={p.visual} />
              </div>
            </article>
          ))}
        </div>
        <div className="hidden min-[900px]:block absolute left-10 right-10 bottom-24 h-[3px] bg-ink/20 rounded-full">
          <div className="pj-progress h-full bg-ink origin-left scale-x-0 rounded-full" />
        </div>
      </section>

      <NextChannel ink />

      <AnimatePresence>
        {open && (
          <CaseStudy
            key="case"
            p={open}
            onClose={close}
            onNext={() => setOpenId(PROJECTS[(PROJECTS.findIndex((x) => x.id === open.id) + 1) % PROJECTS.length].id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
