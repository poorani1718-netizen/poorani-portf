"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "../Reveal";
import NextChannel from "../NextChannel";
import { ROLES, TYPE_COLOR } from "@/lib/data";
import { prefersReduced } from "@/lib/motion";

const START = 2021, END = 2027;
const pct = (y: number) => ((y - START) / (END - START)) * 100;

const NOW = 2026 + 10 / 12;
const YEARS = Array.from({ length: END - START + 1 }, (_, i) => START + i);
const textOn = (t: keyof typeof TYPE_COLOR) => (t === "Marketing" || t === "Training" ? "#F3EEE6" : "#0C0A12");

/** Career "flight plan": a Gantt-style dashboard with a details panel. */
function MediaPlan() {
  const [sel, setSel] = useState(ROLES.length - 1);
  const r = ROLES[sel];
  return (
    <div className="rounded-[32px] bg-ink text-paper p-5 sm:p-7 md:p-10">
      {/* header: title + legend */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 pb-6 md:pb-8 border-b border-white/12">
        <div>
          <p className="label text-volt">Flight plan</p>
          <h3 className="display text-4xl md:text-5xl mt-2">Career timeline</h3>
          <p className="text-sm md:text-base opacity-80 mt-2">Select a bar to see what each role involved.</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legend">
          {Object.entries(TYPE_COLOR).map(([k, c]) => (
            <li key={k} className="flex items-center gap-2 label"><i className="w-3.5 h-3.5 rounded-[4px] border border-white/30" style={{ background: c }} />{k}</li>
          ))}
        </ul>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-6 md:gap-8 pt-6 md:pt-8">
        {/* chart */}
        <div className="min-w-0">
          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0" data-lenis-prevent>
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[170px_minmax(0,1fr)] md:grid-cols-[240px_minmax(0,1fr)]">
                {/* axis */}
                <div />
                <div className="relative h-8 border-b border-white/12">
                  {YEARS.map((y, i) => (
                    <span
                      key={y}
                      className="label absolute top-0 opacity-80"
                      style={{ left: `${pct(y)}%`, transform: i === 0 ? "none" : i === YEARS.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}
                    >
                      {y}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative grid grid-cols-[170px_minmax(0,1fr)] md:grid-cols-[240px_minmax(0,1fr)]">
                {/* gridlines + now marker, behind the rows */}
                <div className="col-start-2 relative pointer-events-none" style={{ gridRow: `1 / ${ROLES.length + 1}` }} aria-hidden="true">
                  {YEARS.map((y) => <span key={y} className="absolute top-0 bottom-0 border-l border-white/[.08]" style={{ left: `${pct(y)}%` }} />)}
                  <span className="absolute top-0 bottom-0 border-l-2 border-dashed border-volt" style={{ left: `${pct(NOW)}%` }}>
                    <span className="label text-volt absolute top-1 right-2 whitespace-nowrap">Now</span>
                  </span>
                </div>
                {ROLES.map((role, i) => (
                  <div key={role.title} className="contents">
                    <div className="col-start-1 py-3 pr-4 flex flex-col justify-center min-w-0" style={{ gridRow: i + 1 }}>
                      <span className="font-semibold leading-tight truncate">{role.org}</span>
                      <span className="text-xs opacity-75 mt-0.5 truncate">{role.title}</span>
                      <span className="text-xs opacity-60 mt-0.5 tabular-nums">{role.label}</span>
                    </div>
                    <div className="col-start-2 relative py-3 border-b border-white/[.06]" style={{ gridRow: i + 1 }}>
                      <button
                        onClick={() => setSel(i)}
                        onPointerEnter={() => setSel(i)}
                        onFocus={() => setSel(i)}
                        aria-pressed={sel === i}
                        aria-label={`${role.title}, ${role.org}, ${role.label}`}
                        data-cursor="Details"
                        className="gantt-bar relative h-12 rounded-xl origin-left block transition-shadow"
                        style={{
                          marginLeft: `${pct(role.start)}%`,
                          width: `${pct(role.end) - pct(role.start)}%`,
                          background: TYPE_COLOR[role.type],
                          color: textOn(role.type),
                          boxShadow: sel === i ? "0 0 0 2px #0C0A12, 0 0 0 4px #E3FF3B" : role.type === "Training" ? "inset 0 0 0 1px rgba(255,255,255,.35)" : "none",
                        }}
                      >
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="label opacity-70 mt-3 sm:hidden">Swipe sideways to see the full timeline</p>
        </div>

        {/* details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sel}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-[24px] bg-paper text-ink p-6 md:p-7 flex flex-col gap-5 self-start"
            aria-live="polite"
          >
            <div>
              <span className="inline-flex items-center gap-2 label"><i className="w-3 h-3 rounded-[3px] border border-ink/30" style={{ background: TYPE_COLOR[r.type] }} />{r.type}</span>
              <h4 className="display text-4xl md:text-5xl mt-3 leading-[.9]">{r.title}</h4>
              <p className="serif-i text-2xl mt-1">{r.org}</p>
              <p className="label opacity-80 mt-2">{r.label} · {r.place}</p>
            </div>
            <ul className="space-y-3 border-t border-ink/15 pt-5">
              {r.points.map((p) => <li key={p} className="flex gap-3 text-base md:text-lg leading-snug"><span className="text-flame" aria-hidden="true">✺</span>{p}</li>)}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const ordered = [...ROLES].reverse();

  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.from(".gantt-bar", { scaleX: 0, duration: 1.2, ease: "expo.inOut", stagger: 0.12, scrollTrigger: { trigger: ".plan", start: "top 70%" } });
    // stacking cards: each card eases back slightly as the next one slides over it (no dimming)
    const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card.querySelector(".stack-inner"), {
        scale: 0.96, ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className="bg-flame text-ink overflow-x-clip">
      <section className="gutter pt-32 md:pt-40 pb-16">
        <div className="label mb-4 flex gap-6"><span>CH 05</span><span>2021 — 2026</span></div>
        <Reveal as="h1" by="chars" text="Media" className="display text-[clamp(100px,22vw,380px)]" />
        <div className="flex items-end gap-6 flex-wrap -mt-[2vw]">
          <Reveal as="div" by="chars" text="plan." className="display outline-ink text-[clamp(100px,22vw,380px)]" delay={0.12} />
          <p className="serif-i text-[clamp(26px,3.4vw,54px)] leading-[1.02] max-w-[16ch] pb-[2vw]">Five years of flights, from logistics floors to live campaigns.</p>
        </div>
      </section>

      <section className="plan gutter pb-28" aria-labelledby="plan-h">
        <h2 id="plan-h" className="sr-only">Career flight plan</h2>
        <MediaPlan />
      </section>

      <section className="gutter pb-10">
        <h2 className="display text-[clamp(56px,9vw,150px)] mb-10">The <span className="serif-i normal-case">roles</span></h2>
        <div>
          {ordered.map((r, i) => {
            const bg = ["bg-ink text-paper", "bg-volt text-ink", "bg-cobalt text-paper", "bg-paper text-ink", "bg-hot text-ink"][i];
            return (
              <div key={r.title} className="stack-card sticky pb-6" style={{ top: `calc(84px + ${i * 22}px)` }}>
                <article className={`stack-inner origin-top rounded-[36px] ${bg} p-7 md:p-12 min-h-[56vh] grid md:grid-cols-[1.1fr_1fr] gap-8 shadow-[0_-20px_60px_-30px_rgba(0,0,0,.5)]`}>
                  <div className="flex flex-col justify-between gap-6">
                    <div className="flex gap-3 flex-wrap label opacity-90"><span>{r.label}</span><span>·</span><span>{r.place}</span><span>·</span><span>{r.type}</span></div>
                    <div>
                      <h3 className="display text-[clamp(48px,6.4vw,104px)]">{r.title}</h3>
                      <p className="serif-i text-[clamp(28px,3vw,48px)] mt-1">{r.org}</p>
                    </div>
                  </div>
                  <ul className="self-end space-y-4">
                    {r.points.map((p) => <li key={p} className="text-xl md:text-2xl leading-snug border-t border-current/25 pt-4">{p}</li>)}
                  </ul>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <NextChannel ink />
    </div>
  );
}
