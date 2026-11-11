"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import FluidBG from "../gl/FluidBG";
import Reveal from "../Reveal";
import Marquee from "../Marquee";
import Magnetic from "../Magnetic";
import TLink from "../TLink";
import NextChannel from "../NextChannel";
import { CHANNELS, STATS } from "@/lib/data";
import { asset } from "@/lib/router";
import { introDelay, prefersReduced } from "@/lib/motion";

const ROTATE = ["impossible to scroll past", "easy to find on Google", "worth clicking", "measurable"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => setI((v) => (v + 1) % ROTATE.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative grid overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          className="serif-i text-volt whitespace-nowrap"
          initial={{ y: "100%", rotate: 4 }}
          animate={{ y: "0%", rotate: 0 }}
          exit={{ y: "-100%", rotate: -4 }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        >
          {ROTATE[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Counter({ n, suffix, suffixClass = "" }: { n: number; suffix: string; suffixClass?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const o = { v: prefersReduced() ? n : 0 };
    gsap.to(o, {
      v: n, duration: 1.8, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
      onUpdate: () => { if (ref.current) ref.current.textContent = String(Math.round(o.v)); },
    });
  });
  return <><span ref={ref}>{n}</span><span className={suffixClass}>{suffix}</span></>;
}

/** Shared section header so every block on the page uses the same scale and spacing. */
function SectionHead({ eyebrow, title, aside }: { eyebrow: string; title: React.ReactNode; aside?: string }) {
  return (
    <div className="sec-head grid md:grid-cols-[1fr_auto] gap-x-12 gap-y-4 items-end mb-12 md:mb-16">
      <div className="min-w-0">
        <p className="label text-volt">{eyebrow}</p>
        <h2 className="display text-[clamp(52px,7vw,112px)] mt-3">{title}</h2>
      </div>
      {aside && <p className="max-w-[34ch] text-base md:text-lg leading-relaxed opacity-90 md:text-right md:pb-2">{aside}</p>}
    </div>
  );
}

const PITCH =
  "Every brand is fighting for three seconds of attention. I plan the content that wins them, run the ads that turn them into leads, read the numbers that prove it, and teach other marketers to do the same.";

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduce = prefersReduced();
    const d = introDelay();
    if (!reduce) {
      gsap.from([".hero-meta-top", ".hero-meta", ".hero-facts > *"], { y: 24, opacity: 0, stagger: 0.08, delay: d + 0.5, duration: 0.9, ease: "power3.out" });
      gsap.from(".hero-img", { clipPath: "inset(100% 0 0 0 round 200px 200px 28px 28px)", duration: 1.4, delay: d + 0.1, ease: "expo.inOut" });
      gsap.from(".hero-photo", { scale: 1.25, duration: 1.8, delay: d + 0.1, ease: "expo.out" });
      // gentle parallax on scroll
      const st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-l1", { xPercent: -6, scrollTrigger: st });
      gsap.to(".hero-img", { yPercent: 12, scrollTrigger: st });
    }
    // scrubbed word-by-word highlight of the pitch
    gsap.fromTo(".pitch .pw", { opacity: 0.3 }, {
      opacity: 1, stagger: 0.05, ease: "none",
      scrollTrigger: { trigger: ".pitch", start: "top 75%", end: "bottom 45%", scrub: true },
    });
    gsap.from(".stat", {
      y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".stats", start: "top 80%" },
    });
    gsap.from(".tile", {
      y: 80, opacity: 0, stagger: 0.07, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".tiles", start: "top 85%" },
    });
  }, { scope: root });

  return (
    <div ref={root} className="bg-ink text-paper overflow-x-clip">
      {/* HERO — hierarchy: 1 name · 2 positioning line · 3 summary + actions · 4 quick facts */}
      <section className="hero relative overflow-hidden">
        <FluidBG className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink pointer-events-none" />

        <div className="relative gutter pt-24 md:pt-28">
          {/* name + message on the left, portrait on the right spanning the same height */}
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(240px,30%)] gap-8 md:gap-10 lg:gap-14 md:items-stretch">
            <div className="@container min-w-0 flex flex-col order-2 md:order-1">
              <p className="hero-meta-top label text-volt">Digital Marketing Analyst &amp; Trainer · Bengaluru</p>
              <div className="hero-l1 mt-2 md:mt-1">
                <Reveal as="h1" by="chars" text="Poorani" className="display text-[min(32cqw,400px)] tracking-[-0.025em] leading-[.8]" />
              </div>
              <p className="hero-meta mt-8 md:mt-10 text-[clamp(26px,3vw,46px)] leading-[1.08] font-medium">
                I make brands <RotatingWord />
              </p>
              <p className="hero-meta mt-5 text-base md:text-lg leading-relaxed opacity-90 max-w-[46ch]">
                SEO, social media, performance ads and Google Analytics, planned and measured end to end. I also train new marketers to do the same.
              </p>
              <div className="hero-meta mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <TLink to="/projects" data-cursor="View" className="inline-flex items-center gap-2 rounded-full bg-volt text-ink px-6 py-3.5 font-semibold hover:bg-paper transition-colors">
                    See campaigns <span aria-hidden="true">→</span>
                  </TLink>
                </Magnetic>
                <TLink to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-semibold hover:bg-paper hover:text-ink transition-colors">
                  Get in touch
                </TLink>
              </div>
            </div>
            <div className="order-1 md:order-2 flex md:block">
              <div className="hero-img relative w-[56vw] max-w-[240px] aspect-[4/5] md:aspect-auto md:w-full md:max-w-none md:h-full md:min-h-[440px] rounded-[999px_999px_28px_28px] overflow-hidden bg-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("poorani.jpg")} alt="Poorani K, digital marketer, in a black blazer" className="hero-photo absolute inset-0 w-full h-full object-cover object-[50%_18%]" fetchPriority="high" />
              </div>
            </div>
          </div>

          <dl className="hero-facts mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5 border-t border-white/15 pt-6 pb-20 md:pb-24">
            <div><dt className="label opacity-80">Focus</dt><dd className="mt-1.5 text-lg font-medium">SEO · Social · Paid · Analytics</dd></div>
            <div><dt className="label opacity-80">Certified</dt><dd className="mt-1.5 text-lg font-medium">Google Analytics IQ</dd></div>
            <div><dt className="label opacity-80">Also</dt><dd className="mt-1.5 text-lg font-medium">Trainer to 20+ learners per batch</dd></div>
          </dl>
        </div>
      </section>

      {/* MARQUEE BAND */}
      <div className="bg-volt text-ink -rotate-1 scale-[1.02] py-3 md:py-4 relative z-10 border-y-2 border-ink">
        <Marquee speed={1.5}>
          {["SEO", "Social media", "Performance ads", "Content strategy", "Google Analytics", "Lead generation", "Training"].map((w) => (
            <span key={w} className="flex items-center">
              <span className="display text-[clamp(36px,5vw,72px)] px-6">{w}</span>
              <span className="text-3xl" aria-hidden="true">✺</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* PITCH */}
      <section className="gutter py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-6">
          <p className="label text-volt md:col-span-3 md:pt-3">The pitch · 3 seconds</p>
          <p className="pitch md:col-span-9 display normal-case !font-bold text-[clamp(34px,4.8vw,80px)] !leading-[1] max-w-[22ch]">
            <span className="sr-only">{PITCH}</span>
            {PITCH.split(" ").map((w, i) => (
              <span key={i} aria-hidden="true" className={`pw inline-block mr-[.22em] ${["three", "seconds", "leads,", "prove", "teach"].includes(w) ? "serif-i !font-normal text-hot" : ""}`}>{w}</span>
            ))}
          </p>
        </div>
      </section>

      {/* PROOF IN NUMBERS — one featured figure, four supporting ones, all sourced */}
      <section className="stats gutter pb-24 md:pb-36">
        <SectionHead
          eyebrow="Track record"
          title={<>Proof <span className="serif-i normal-case text-hot">in numbers</span></>}
          aside="Every figure comes from a real role, and each card names where it was earned."
        />
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
          {STATS.map((s, i) => {
            const featured = i === 0;
            return (
              <article
                key={s.label}
                className={`stat flex flex-col rounded-[28px] p-6 md:p-8 transition-transform duration-500 hover:-translate-y-1 ${
                  featured
                    ? "col-span-2 lg:col-span-6 lg:row-span-2 bg-volt text-ink min-h-[320px]"
                    : "col-span-1 lg:col-span-3 bg-white/[.04] border border-white/12 min-h-[230px] md:min-h-[260px]"
                }`}
              >
                <p className={`label ${featured ? "opacity-80" : "opacity-80"}`}>{s.tag}</p>
                <div className="mt-auto pt-8">
                  <p className={`display tabular-nums leading-[.85] ${featured ? "text-[clamp(120px,15vw,240px)]" : "text-[clamp(64px,6vw,104px)]"}`}>
                    <Counter n={s.n} suffix={s.suffix} suffixClass={featured ? "" : "text-volt"} />
                  </p>
                  <p className={`font-medium leading-snug mt-3 ${featured ? "text-2xl md:text-3xl max-w-[16ch]" : "text-base md:text-lg"}`}>{s.label}</p>
                </div>
                <p className={`label mt-6 pt-4 border-t ${featured ? "border-ink/20" : "border-white/12 opacity-80"}`}>{s.src}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* CHANNEL GUIDE */}
      <section className="gutter pb-12 md:pb-16">
        <SectionHead eyebrow="Explore" title={<>Now <span className="outline-paper">showing</span></>} aside="Five more channels. Pick one, or use the dial at the bottom of the screen." />
        <div className="tiles grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
          {CHANNELS.slice(1).map((c, i) => {
            const span = i < 2 ? "lg:col-span-3" : "lg:col-span-2";
            const fill = c.bg === "#0C0A12" || c.bg === "#07070B" ? "#F3EEE6" : c.bg;
            return (
              <TLink key={c.slug} to={c.path} data-cursor="Tune in" className={`tile group relative overflow-hidden rounded-[28px] border border-white/15 p-6 md:p-8 min-h-[170px] md:min-h-[260px] flex flex-col justify-between ${span} ${i === 4 ? "sm:col-span-2" : ""}`}>
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)]" style={{ background: fill }} />
                <div className="relative flex justify-between label group-hover:text-ink transition-colors duration-500"><span>CH {c.ch}</span><span aria-hidden="true">→</span></div>
                <div className="relative group-hover:text-ink transition-colors duration-500">
                  <p className="display text-[clamp(52px,5vw,88px)] group-hover:translate-x-2 transition-transform duration-500">{c.name}</p>
                  <p className="serif-i text-2xl opacity-80 mt-1">{c.blurb}</p>
                </div>
              </TLink>
            );
          })}
        </div>
      </section>

      <NextChannel />
    </div>
  );
}
