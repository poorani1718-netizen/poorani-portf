"use client";
import { CHANNELS } from "@/lib/data";
import { usePath } from "./Shell";
import TLink from "./TLink";
import Marquee from "./Marquee";

/** End-of-page "up next" bumper that hands off to the next channel. */
export default function NextChannel({ ink = false }: { ink?: boolean }) {
  const path = usePath();
  const i = CHANNELS.findIndex((c) => c.path === path);
  const next = CHANNELS[(i + 1) % CHANNELS.length];
  const fg = ink ? "text-ink" : "text-paper";
  return (
    <section className={`relative pt-24 pb-36 ${fg}`}>
      <div className="gutter label flex justify-between opacity-90"><span>Up next</span><span>CH {next.ch}</span></div>
      <TLink to={next.path} data-cursor="Switch" className="group block mt-6 relative overflow-hidden">
        <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)]" style={{ background: next.bg === "#0C0A12" || next.bg === "#07070B" ? "#F3EEE6" : next.bg }} />
        <Marquee speed={2} className="relative py-4 group-hover:text-ink transition-colors duration-500">
          {[0, 1, 2].map((k) => (
            <span key={k} className="flex items-center gap-[4vw] pr-[4vw]">
              <span className="display text-[clamp(72px,14vw,220px)]">{next.name}</span>
              <span className="serif-i text-[clamp(32px,5vw,80px)]">{next.blurb}</span>
              <svg className="w-[clamp(48px,7vw,110px)] h-auto shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          ))}
        </Marquee>
      </TLink>
      <div className="gutter mt-10 flex flex-wrap justify-between gap-4 label opacity-90">
        <span>© 2026 Poorani K</span>
        <span>Digital Marketing Analyst &amp; Trainer · Bengaluru</span>
      </div>
    </section>
  );
}
