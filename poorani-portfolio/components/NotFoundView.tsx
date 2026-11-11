"use client";
import { CHANNELS } from "@/lib/data";
import TLink from "./TLink";

/** 404: the channel the visitor tuned to doesn't exist. */
export default function NotFoundView() {
  return (
    <section className="min-h-[100svh] bg-ink text-paper gutter pt-32 pb-36 flex flex-col justify-center relative overflow-hidden">
      <div className="static absolute inset-0 pointer-events-none opacity-60" aria-hidden="true" />
      <p className="label opacity-90 relative">Error 404 · No signal</p>
      <h1 className="display text-[clamp(110px,26vw,440px)] relative">Off <span className="outline-paper">air</span></h1>
      <p className="serif-i text-[clamp(26px,3.4vw,52px)] max-w-[22ch] relative">This channel isn&apos;t broadcasting. Pick one that is:</p>
      <ul className="mt-8 flex flex-wrap gap-3 relative">
        {CHANNELS.map((c) => (
          <li key={c.slug}>
            <TLink to={c.path} className="inline-flex items-center gap-3 rounded-full border border-white/25 px-5 py-3 hover:bg-paper hover:text-ink transition-colors">
              <span className="label">{c.ch}</span><span className="display text-2xl">{c.name}</span>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
