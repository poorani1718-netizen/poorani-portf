"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import FluidBG from "../gl/FluidBG";
import Reveal from "../Reveal";
import Magnetic from "../Magnetic";
import Marquee from "../Marquee";
import { CONTACT, gmailLink, whatsappLink } from "@/lib/data";
import { WhatsAppIcon, MailIcon } from "../Icons";
import { prefersReduced } from "@/lib/motion";

const NEEDS = ["SEO", "Social media", "Paid ads", "Content", "Analytics & reporting", "Training / workshop", "Full-time role"];
const CONTACT_COLORS = ["#0C0A12", "#FF2E7E", "#2433FF", "#E3FF3B"];

function useCopy() {
  const [done, setDone] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setDone(key); setTimeout(() => setDone(null), 1800); }
    catch { setDone("select:" + key); }
  };
  return { done, copy };
}

export default function Contact() {
  const root = useRef<HTMLDivElement>(null);
  const { done, copy } = useCopy();
  const [form, setForm] = useState({ name: "", company: "", timeline: "This month", message: "" });
  const [needs, setNeeds] = useState<string[]>(["Social media"]);
  const [brief, setBrief] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; message?: string; needs?: string }>({});

  useGSAP(() => {
    if (prefersReduced()) return;
    gsap.from(".ct-row", { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".ct-rows", start: "top 85%" } });
    gsap.from(".brief", { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".brief", start: "top 85%" } });
  }, { scope: root });

  const build = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim(), message = form.message.trim();
    const next: typeof errors = {};
    if (name.length < 2) next.name = "Add your name so Poorani knows who the brief is from.";
    if (!needs.length) next.needs = "Pick at least one thing you need.";
    if (message.length < 10) next.message = "Add a sentence or two about the goal (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = next.name ? "b-name" : next.needs ? "b-needs" : "b-msg";
      document.getElementById(first)?.focus();
      return;
    }
    const lines = [
      `Campaign brief for Poorani K`,
      `From: ${name}${form.company.trim() ? `, ${form.company.trim()}` : ""}`,
      `Looking for: ${needs.length ? needs.join(", ") : "—"}`,
      `Timeline: ${form.timeline}`,
      ``,
      message,
    ];
    setBrief(lines.join("\n"));
  };

  return (
    <div ref={root} className="bg-ink text-paper overflow-x-clip">
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <FluidBG className="absolute inset-0" colors={CONTACT_COLORS} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent pointer-events-none" />
        <div className="relative gutter pt-32 pb-32">
          <div className="label mb-4 flex gap-6"><span>CH 06</span><span>Inbox open</span></div>
          <Reveal as="h1" by="chars" text="Let's" className="display text-[clamp(90px,17vw,300px)]" />
          <div className="flex flex-wrap items-end gap-x-8 -mt-[2vw]">
            <Reveal as="div" by="chars" text="launch" className="display outline-paper text-[clamp(90px,17vw,300px)]" delay={0.1} />
            <Reveal as="div" text="something." className="serif-i text-[clamp(48px,8vw,140px)] text-volt pb-[2vw]" delay={0.3} />
          </div>
        </div>
      </section>

      <div className="bg-hot text-ink py-4 -rotate-1 scale-[1.03] border-y-2 border-ink">
        <Marquee speed={1.6}>
          {["Campaigns", "Workshops", "Full-time roles", "Freelance projects"].map((w) => (
            <span key={w} className="flex items-center"><span className="display text-[clamp(40px,6vw,90px)] px-6">{w}</span><span className="serif-i text-5xl">welcome</span><span className="px-6 text-3xl">✺</span></span>
          ))}
        </Marquee>
      </div>

      <section className="ct-rows gutter py-24 grid md:grid-cols-3 gap-4">
        {[
          { k: "Email", v: CONTACT.email, key: "email", href: gmailLink(), cta: "Write in Gmail" },
          { k: "WhatsApp · Phone", v: CONTACT.phone, key: "phone", href: whatsappLink(), cta: "Chat on WhatsApp" },
        ].map((r) => (
          <div key={r.key} className="ct-row rounded-[28px] border border-white/15 p-6 flex flex-col justify-between gap-8 min-h-[200px]">
            <span className="label opacity-90">{r.k}</span>
            <div>
              <a href={r.href} target="_blank" rel="noopener noreferrer" className="display text-3xl md:text-4xl break-all hover:text-volt transition-colors">{r.v}</a>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={`label rounded-full px-4 py-2 transition-colors ${r.key === "phone" ? "bg-[#25D366] text-ink hover:bg-volt" : "bg-hot text-ink hover:bg-volt"}`}>{r.cta} ↗</a>
                <button onClick={() => copy(r.key, r.v)} className="label rounded-full border border-white/30 px-4 py-2 hover:bg-paper hover:text-ink transition-colors">
                  {done === r.key ? "Copied" : done === "select:" + r.key ? "Select the text above" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        ))}
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="ct-row group rounded-[28px] bg-cobalt p-6 flex flex-col justify-between gap-8 min-h-[200px] overflow-hidden relative">
          <span className="label opacity-90">LinkedIn</span>
          <div>
            <p className="display text-3xl md:text-4xl">{CONTACT.linkedinShort}</p>
            <span className="inline-block mt-4 text-4xl group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-500">↗</span>
          </div>
        </a>
      </section>

      <section className="brief gutter pb-28">
        <div className="rounded-[40px] bg-paper text-ink p-6 md:p-12 grid lg:grid-cols-[1.2fr_1fr] gap-10">
          <div className="min-w-0">
            <span className="label opacity-90">Brief builder</span>
            <h2 className="display text-[clamp(52px,7vw,120px)] mt-2">Write the <span className="serif-i normal-case text-hot">brief</span></h2>
            <form onSubmit={build} noValidate className="mt-8 grid sm:grid-cols-2 gap-4">
              <label><span className="label opacity-90">Your name</span>
                <input id="b-name" required maxLength={80} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "b-name-err" : undefined} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Priya S." className="mt-1 w-full rounded-2xl border-2 border-ink/20 focus:border-ink outline-none bg-transparent px-4 py-3 text-lg aria-[invalid=true]:border-flame" />{errors.name && <span id="b-name-err" className="block mt-1 text-sm font-semibold text-[#B3261E]">{errors.name}</span>}</label>
              <label><span className="label opacity-90">Company</span>
                <input id="b-company" maxLength={80} autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your brand" className="mt-1 w-full rounded-2xl border-2 border-ink/20 focus:border-ink outline-none bg-transparent px-4 py-3 text-lg" /></label>
              <fieldset className="sm:col-span-2" id="b-needs" tabIndex={-1} aria-describedby={errors.needs ? "b-needs-err" : undefined}>
                <legend className="label opacity-90">What do you need?</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {NEEDS.map((n) => {
                    const on = needs.includes(n);
                    return (
                      <button type="button" key={n} aria-pressed={on} onClick={() => setNeeds(on ? needs.filter((x) => x !== n) : [...needs, n])}
                        className={`rounded-full px-4 py-2 font-medium border-2 transition-all ${on ? "bg-ink text-volt border-ink scale-105" : "border-ink/25 hover:border-ink"}`}>
                        {on ? "✓ " : "+ "}{n}
                      </button>
                    );
                  })}
                </div>
                {errors.needs && <span id="b-needs-err" className="block mt-2 text-sm font-semibold text-[#B3261E]">{errors.needs}</span>}
              </fieldset>
              <label className="sm:col-span-2"><span className="label opacity-90">Timeline</span>
                <select id="b-time" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="mt-1 w-full rounded-2xl border-2 border-ink/20 focus:border-ink outline-none bg-transparent px-4 py-3 text-lg">
                  {["This month", "Next 1–3 months", "Just exploring"].map((t) => <option key={t}>{t}</option>)}
                </select></label>
              <label className="sm:col-span-2"><span className="label opacity-90">Message</span>
                <textarea id="b-msg" rows={4} required maxLength={1500} aria-invalid={!!errors.message} aria-describedby={errors.message ? "b-msg-err" : undefined} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about the brand, the goal and the audience." className="mt-1 w-full rounded-2xl border-2 border-ink/20 focus:border-ink outline-none bg-transparent px-4 py-3 text-lg resize-y aria-[invalid=true]:border-flame" />{errors.message && <span id="b-msg-err" className="block mt-1 text-sm font-semibold text-[#B3261E]">{errors.message}</span>}<span className="block mt-1 text-sm opacity-60 text-right">{form.message.length}/1500</span></label>
              <div className="sm:col-span-2">
                <Magnetic><button type="submit" className="rounded-full bg-ink text-paper px-8 py-4 display text-2xl hover:bg-hot hover:text-ink transition-colors" data-cursor="Build">Build my brief</button></Magnetic>
              </div>
            </form>
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="label opacity-90">Preview</span>
            <AnimatePresence mode="wait">
              {brief ? (
                <motion.div key="b" initial={{ rotateX: -70, opacity: 0, y: 40 }} animate={{ rotateX: 0, opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-2 flex-1 rounded-[28px] bg-ink text-paper p-6 flex flex-col [transform-origin:top]">
                  <pre className="whitespace-pre-wrap font-mono text-[15px] leading-relaxed flex-1">{brief}</pre>
                  <div className="mt-6 flex flex-wrap gap-3 items-center">
                    <a href={whatsappLink(brief)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] text-ink px-5 py-3 label inline-flex items-center gap-2"><WhatsAppIcon className="w-4 h-4" />Send on WhatsApp</a>
                    <a href={gmailLink(`Campaign brief from ${form.name.trim() || "the portfolio"}`, brief)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-hot text-ink px-5 py-3 label inline-flex items-center gap-2"><MailIcon className="w-4 h-4" />Send in Gmail</a>
                    <button onClick={() => copy("brief", brief)} className="rounded-full border border-white/30 px-5 py-3 label">{done === "brief" ? "Copied" : "Copy brief"}</button>
                    <span className="text-sm opacity-80 basis-full">Your brief is pre-filled in the message. Just press send.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 flex-1 rounded-[28px] border-2 border-dashed border-ink/30 p-6 grid place-items-center text-center min-h-[260px]">
                  <p className="serif-i text-3xl max-w-[16ch] opacity-60">Your brief appears here, ready to copy and send.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <footer className="gutter pb-36 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-6 items-end">
        <div className="display text-[clamp(64px,14vw,240px)] leading-none">Poorani<span className="text-hot">.</span></div>
        <div className="label opacity-90 text-right space-y-1"><div>Digital Marketing Analyst &amp; Trainer</div><div>{CONTACT.city}</div><div>© 2026</div></div>
      </footer>
    </div>
  );
}
