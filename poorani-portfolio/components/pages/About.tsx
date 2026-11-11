"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Reveal from "../Reveal";
import Marquee from "../Marquee";
import NextChannel from "../NextChannel";
import { asset } from "@/lib/router";
import { CERTS, EDUCATION } from "@/lib/data";
import { introDelay, prefersReduced } from "@/lib/motion";

const JOURNEY = [
  { y: "2018", t: "B.Com begins", d: "B.Com Corporate Secretaryship at Sri Jeyendra Saraswathi College. Graduated 2021 with 71%." },
  { y: "2021", t: "Logistics, Blue Dart", d: "Shipment tracking, backend data and first-contact query resolution." },
  { y: "2022", t: "Leading a floor, Domino's", d: "Ran a 15+ person team. Wrote the training docs that cut ramp-up by 30%." },
  { y: "2024", t: "Teaching marketing, Qtree", d: "Mentored batches of 20+ learners in SEO, SEM, GA and social. Started an MBA." },
  { y: "2025", t: "CRM, Red Taxi", d: "60+ partner queries a day at 95%+ SLA, with weekly dashboards for leadership." },
  { y: "2026", t: "Bengaluru, Pumo", d: "Digital Marketing Analyst & Trainer: running campaigns and training the next batch." },
];

const PILLARS = [
  { k: "Data-led", v: "Google Analytics certified. Decisions come from reports, not hunches." },
  { k: "Mentor", v: "Has turned batches of beginners into job-ready marketers." },
  { k: "Operator", v: "Five years of SLAs, teams and dashboards behind every campaign plan." },
  { k: "Storyteller", v: "Content calendars and copy that give a brand a voice people follow." },
];

const SWATCHES = [
  { n: "Cobalt", h: "#2433FF", c: "text-paper" },
  { n: "Hot pink", h: "#FF2E7E", c: "text-ink" },
  { n: "Flame", h: "#FF4A1C", c: "text-ink" },
  { n: "Volt", h: "#E3FF3B", c: "text-ink" },
  { n: "Ink", h: "#0C0A12", c: "text-paper" },
];

export default function About() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const reduce = prefersReduced();
    if (!reduce) {
      gsap.from(".ab-sub", { y: 30, opacity: 0, delay: introDelay() + 0.5, duration: 1, ease: "expo.out" });
      gsap.fromTo(".ab-photo", { clipPath: "inset(30% 30% 30% 30% round 40px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 40px)", ease: "none",
        scrollTrigger: { trigger: ".ab-photo-wrap", start: "top 90%", end: "center center", scrub: true },
      });
      gsap.fromTo(".ab-photo img", { scale: 1.35, yPercent: -8 }, {
        scale: 1, yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".ab-photo-wrap", start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    // pinned horizontal journey on wide screens
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const track = document.querySelector<HTMLElement>(".jr-track")!;
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: ".jr", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
      });
    });
    gsap.from(".pillar", {
      y: 80, opacity: 0, rotate: (i) => [-4, 3, -2, 5][i], stagger: 0.1, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".pillars", start: "top 80%" },
    });
  }, { scope: root });

  return (
    <div ref={root} className="bg-cobalt text-paper overflow-x-clip">
      {/* HERO */}
      <section className="gutter pt-32 md:pt-40 pb-16 relative">
        <div className="label mb-6 flex gap-6"><span>CH 02</span><span>The brand behind the brand</span></div>
        <Reveal as="p" text="Hello, I'm" className="serif-i text-[clamp(40px,7vw,120px)] leading-none" />
        <Reveal as="h1" by="chars" text="Poorani." className="display text-[clamp(110px,27vw,460px)] mt-[1vw]" delay={0.15} />
        <p className="ab-sub mt-6 text-[clamp(20px,2.4vw,34px)] leading-snug max-w-[34ch] font-medium">
          Digital marketing analyst and trainer from Tamil Nadu, now in Bengaluru. I plan campaigns, run them, measure them, and teach people how to do all three.
        </p>
      </section>

      {/* PHOTO + POSITIONING */}
      <section className="gutter pb-28 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
        <div className="ab-photo-wrap relative">
          <div className="ab-photo relative aspect-[4/5] overflow-hidden rounded-[40px] bg-ink" data-cursor="That's me">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("poorani.jpg")} alt="Portrait of Poorani K" className="w-full h-full object-cover object-[50%_20%]" />
          </div>
          <span className="absolute -bottom-6 -right-2 md:-right-8 bg-volt text-ink rounded-full px-5 py-3 label rotate-[-6deg] shadow-xl">Brand asset 01 · Founder photo</span>
        </div>
        <div className="min-w-0">
          <span className="label opacity-90">Positioning statement</span>
          <p className="serif-i text-[clamp(32px,4.2vw,64px)] leading-[1.05] mt-4">
            For brands that need attention and teams that need skills, Poorani is the digital marketer who plans the campaign, runs it, measures it, and trains people to repeat it.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-4 border-t border-white/25 pt-6">
            <div><span className="label opacity-90">Based in</span><p className="text-xl font-medium">Bengaluru, India</p></div>
            <div><span className="label opacity-90">Roots</span><p className="text-xl font-medium">Coimbatore, Tamil Nadu</p></div>
            <div><span className="label opacity-90">Languages</span><p className="text-xl font-medium">English · Tamil (native)</p></div>
            <div><span className="label opacity-90">Qualification</span><p className="text-xl font-medium">MBA</p></div>
          </div>
        </div>
      </section>

      <div className="bg-ink text-paper py-5 rotate-1 scale-[1.03]">
        <Marquee speed={1.2}>
          {["Data", "→", "Story", "→", "Campaign", "→", "Results", "→", "Repeat", "→"].map((w, i) => (
            <span key={i} className={`display text-[clamp(44px,6vw,96px)] px-5 ${w === "→" ? "text-hot" : i % 4 === 2 ? "outline-paper" : ""}`}>{w}</span>
          ))}
        </Marquee>
      </div>

      {/* JOURNEY — pinned horizontal */}
      <section className="jr relative md:min-h-[100svh] flex flex-col justify-center py-24 overflow-hidden">
        <div className="gutter mb-10 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="display text-[clamp(56px,9vw,150px)]">Origin <span className="serif-i normal-case text-volt">story</span></h2>
          <span className="label opacity-90">2018 → 2026 · scroll →</span>
        </div>
        <div className="jr-track flex flex-col min-[900px]:flex-row gap-5 gutter min-[900px]:w-max">
          {JOURNEY.map((j, i) => (
            <article key={j.y} className={`relative shrink-0 min-[900px]:w-[38vw] max-w-[560px] rounded-[32px] p-7 md:p-9 flex flex-col justify-between min-h-[300px] min-[900px]:min-h-[52vh] ${i % 2 ? "bg-paper text-ink min-[900px]:translate-y-10" : "bg-ink text-paper"}`}>
              <span className="label opacity-90">Chapter {i + 1}</span>
              <div>
                <div className={`display text-[clamp(80px,10vw,170px)] ${i % 2 ? "outline-ink" : "outline-paper"}`}>{j.y}</div>
                <h3 className="display text-4xl md:text-5xl mt-2">{j.t}</h3>
                <p className="mt-3 text-lg leading-snug opacity-80 max-w-[34ch]">{j.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BRAND BOOK */}
      <section className="gutter py-28 bg-paper text-ink rounded-t-[48px]">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <h2 className="display text-[clamp(56px,9vw,150px)]">Brand <span className="serif-i normal-case text-cobalt">book</span></h2>
          <span className="label opacity-90 max-w-[30ch]">If Poorani were a brand, these would be the guidelines.</span>
        </div>

        <div className="pillars grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((p, i) => (
            <div key={p.k} className={`pillar rounded-[28px] p-6 min-h-[240px] flex flex-col justify-between ${["bg-cobalt text-paper", "bg-hot", "bg-ink text-paper", "bg-volt"][i]}`}>
              <span className="label opacity-90">Pillar 0{i + 1}</span>
              <div>
                <h3 className="display text-5xl">{p.k}</h3>
                <p className="mt-2 text-[17px] leading-snug">{p.v}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-4">
          <div className="rounded-[28px] border-2 border-ink p-6 md:p-8">
            <span className="label opacity-90">Tone of voice</span>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Clear", "Practical", "Encouraging", "Numbers-backed"].map((t) => (
                <span key={t} className="display text-4xl md:text-5xl px-5 py-2 rounded-full border-2 border-ink hover:bg-ink hover:text-paper transition-colors">{t}</span>
              ))}
            </div>
            <span className="label opacity-90 block mt-10">Palette</span>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {SWATCHES.map((s) => (
                <div key={s.n} className={`group rounded-2xl h-32 md:h-40 p-3 flex flex-col justify-end ${s.c} hover:-translate-y-3 transition-transform duration-500`} style={{ background: s.h }}>
                  <span className="label !text-[12px] !tracking-normal leading-tight">{s.n}<br /><span className="opacity-0 group-hover:opacity-100 transition-opacity">{s.h}</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] bg-ink text-paper p-6 md:p-8 flex flex-col gap-8">
            <div>
              <span className="label opacity-90">Credentials</span>
              <ul className="mt-4 space-y-3">
                {CERTS.map((c) => (
                  <li key={c} className="flex gap-3 text-lg leading-snug"><span className="text-volt">✺</span>{c}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-white/20 pt-6 space-y-4">
              <span className="label opacity-90">Education</span>
              {EDUCATION.map((e) => (
                <div key={e.what}>
                  <div className="display text-3xl">{e.what}</div>
                  <div className="opacity-80">{e.where}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-paper"><NextChannel ink /></div>
    </div>
  );
}
