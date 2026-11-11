"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import FunnelScene from "../gl/FunnelScene";
import Reveal from "../Reveal";
import NextChannel from "../NextChannel";
import { FUNNEL, RECEIPTS, TOOLS } from "@/lib/data";
import { prefersReduced } from "@/lib/motion";

function Toolbox() {
  const area = useRef<HTMLDivElement>(null);
  const colors = ["#FF2E7E", "#E3FF3B", "#2433FF", "#FF4A1C", "#4FE3D0", "#F3EEE6", "#FFB21C", "#FF2E7E", "#E3FF3B"];
  return (
    <div ref={area} className="relative rounded-[36px] border border-white/15 min-h-[420px] md:min-h-[460px] overflow-hidden p-6 flex flex-wrap content-center justify-center gap-3 md:gap-4" data-cursor="Drag">
      <span className="absolute top-5 left-6 label opacity-90">Toolbox · drag anything</span>
      {TOOLS.map((t, i) => (
        <motion.span
          key={t}
          drag
          dragConstraints={area}
          dragElastic={0.25}
          whileDrag={{ scale: 1.12, rotate: 0, zIndex: 10 }}
          whileHover={{ scale: 1.05 }}
          initial={{ rotate: (i % 2 ? 1 : -1) * (3 + (i % 4) * 2) }}
          className="display text-[clamp(28px,3.6vw,52px)] px-5 py-2 rounded-full select-none touch-none text-ink"
          style={{ background: colors[i], color: colors[i] === "#2433FF" ? "#F3EEE6" : "#0C0A12" }}
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
}

export default function Skills() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const stage = FUNNEL[active];

  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.from(".stage-btn", { x: -40, opacity: 0, stagger: 0.08, delay: 0.9, duration: 0.9, ease: "expo.out" });
    gsap.from(".rcpt", { y: 60, opacity: 0, stagger: 0.06, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".rcpts", start: "top 80%" } });
    gsap.to(".sk-big", { xPercent: -30, ease: "none", scrollTrigger: { trigger: ".sk-big", start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: root });

  return (
    <div ref={root} className="bg-[#07070B] text-paper overflow-x-clip">
      {/* HERO: 3D funnel */}
      <section className="relative min-h-[100svh] pt-28 pb-28 grid lg:grid-cols-[1fr_1.1fr] items-center">
        <div className="gutter relative z-10 min-w-0">
          <div className="label mb-4 flex gap-6"><span>CH 03</span><span>Hover the rings</span></div>
          <Reveal as="h1" by="chars" text="Full" className="display text-[clamp(90px,15vw,240px)]" />
          <Reveal as="div" by="chars" text="funnel." className="display outline-paper text-[clamp(90px,15vw,240px)] -mt-[1vw]" delay={0.1} />

          <ol className="mt-10 space-y-1 max-w-[520px]">
            {FUNNEL.map((f, i) => (
              <li key={f.stage}>
                <button
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="stage-btn w-full flex items-center gap-4 py-3 border-b border-white/10 text-left group"
                  aria-pressed={active === i}
                >
                  <span className="label w-6 opacity-90">0{i + 1}</span>
                  <span className="display text-4xl md:text-5xl transition-all duration-500" style={{ color: active === i ? f.color : undefined, transform: active === i ? "translateX(12px)" : "none" }}>{f.stage}</span>
                  <span className="ml-auto w-3 h-3 rounded-full transition-transform duration-500" style={{ background: f.color, transform: active === i ? "scale(1.6)" : "scale(.6)" }} />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative h-[62vh] lg:h-[88vh] min-w-0" data-cursor="Explore">
          <FunnelScene active={active} onActive={setActive} />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 lg:bottom-24 w-[min(92%,440px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl p-5 bg-white/[.06] backdrop-blur-xl border border-white/15"
              >
                <div className="serif-i text-3xl" style={{ color: stage.color }}>{stage.line}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stage.skills.map((s, i) => (
                    <motion.span key={s} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.08 * i }} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ background: stage.color, color: "#0C0A12" }}>
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="sk-big display whitespace-nowrap text-[clamp(120px,22vw,380px)] outline-paper opacity-40 py-6" aria-hidden="true">
        Strategy · Content · Ads · Analytics · Training ·
      </div>

      {/* RECEIPTS */}
      <section className="rcpts gutter py-24">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <h2 className="display text-[clamp(56px,9vw,150px)]">Skills, <span className="serif-i normal-case text-volt">with receipts</span></h2>
          <span className="label opacity-90 max-w-[30ch]">Open a skill to see where it was used on the job.</span>
        </div>
        <ul className="border-t border-white/15">
          {RECEIPTS.map((r, i) => {
            const on = open === i;
            const col = ["#FF2E7E", "#E3FF3B", "#4FE3D0", "#FFB21C", "#2433FF", "#FF4A1C", "#F3EEE6"][i];
            return (
              <li key={r.skill} className="rcpt border-b border-white/15">
                <button
                  className="w-full group flex items-center gap-4 md:gap-8 py-4 md:py-5 text-left"
                  onPointerEnter={() => window.matchMedia("(hover:hover)").matches && setOpen(i)}
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                >
                  <span className="label opacity-90 w-8">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[clamp(44px,7vw,110px)] transition-all duration-500" style={{ color: on ? col : undefined, transform: on ? "translateX(1.5vw) skewX(-6deg)" : "none" }}>{r.skill}</span>
                  <span className="ml-auto text-3xl transition-transform duration-500" style={{ transform: on ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }} className="overflow-hidden">
                      <div className="pb-6 md:pl-16 flex flex-wrap gap-3">
                        {r.where.map((w) => (
                          <span key={w} className="serif-i text-2xl md:text-3xl px-5 py-2 rounded-full" style={{ background: col, color: col === "#2433FF" ? "#F3EEE6" : "#0C0A12" }}>{w}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="gutter pb-12">
        <h2 className="display text-[clamp(56px,9vw,150px)] mb-8">The <span className="outline-paper">stack</span></h2>
        <Toolbox />
      </section>

      <NextChannel />
    </div>
  );
}
