"use client";
import type { Project } from "@/lib/data";
import { asset } from "@/lib/router";

/* Campaign visuals: real screenshots for Bhuvan Nritya and Viswakesh, code-drawn mockups for the rest. */

function InstagramProfile() {
  return (
    <div className="relative w-[min(300px,68vw)] rounded-[40px] bg-ink p-2.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,.6)] -rotate-3 group-hover:rotate-0 transition-transform duration-700">
      <div className="rounded-[32px] overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("bhuvan-nritya.jpg")} alt="" width={600} height={1179} className="block w-full h-auto" loading="lazy" />
      </div>
    </div>
  );
}

function YouTubeChannel() {
  return (
    <div className="relative w-[min(560px,86vw)] rounded-[22px] bg-ink p-2 shadow-[0_50px_120px_-30px_rgba(0,0,0,.55)] rotate-2 group-hover:rotate-0 transition-transform duration-700">
      <div className="flex items-center gap-1.5 px-3 py-2" aria-hidden="true">
        <i className="w-2.5 h-2.5 rounded-full bg-flame" /><i className="w-2.5 h-2.5 rounded-full bg-amber" /><i className="w-2.5 h-2.5 rounded-full bg-mint" />
        <span className="ml-3 flex-1 rounded-full bg-white/10 text-[11px] text-paper/80 px-3 py-1 truncate">youtube.com/@viswakesh</span>
      </div>
      <div className="rounded-[16px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("viswakesh-youtube.jpg")} alt="" width={1000} height={570} className="block w-full h-auto" loading="lazy" />
      </div>
    </div>
  );
}

function Ads() {
  return (
    <div className="relative w-[min(440px,80vw)] aspect-square">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-x-[8%] rounded-[28px] bg-ink text-paper p-5 shadow-2xl transition-transform duration-700"
          style={{ top: `${i * 14}%`, transform: `rotate(${(i - 1) * 7}deg) translateX(${(i - 1) * 18}px)`, zIndex: 3 - i }}
        >
          <div className="flex justify-between label opacity-90"><span>Sponsored</span><span>Ad set {String.fromCharCode(65 + i)}</span></div>
          <div className="display text-4xl mt-6 text-volt">{["Learn by doing.", "Book a free demo.", "Start this month."][i]}</div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-1">{[0, 1, 2, 3].map((k) => <span key={k} className="w-6 h-6 rounded-md" style={{ background: ["#FF2E7E", "#2433FF", "#FF4A1C", "#4FE3D0"][(k + i) % 4] }} />)}</div>
            <span className="rounded-full bg-volt text-ink px-4 py-2 text-sm font-semibold">Sign up</span>
          </div>
        </div>
      ))}
      <div className="absolute -bottom-2 right-0 bg-paper text-ink rounded-2xl p-4 w-48 rotate-6 shadow-xl">
        <div className="label opacity-90">Funnel view</div>
        {[100, 64, 38, 18].map((w, k) => <div key={k} className="h-3 mt-2 rounded-full bg-ink mx-auto" style={{ width: `${w}%`, opacity: 1 - k * 0.18 }} />)}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="relative w-[min(480px,84vw)] aspect-[5/4] grid grid-cols-6 grid-rows-5 gap-2">
      <div className="col-span-4 row-span-3 rounded-3xl bg-paper text-ink p-5 flex flex-col justify-between">
        <span className="label opacity-90">Campaign board</span>
        <svg viewBox="0 0 200 80" className="w-full" aria-hidden="true">
          <polyline fill="none" stroke="#2433FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points="0,70 30,62 60,64 90,45 120,48 150,28 180,20 200,8" />
          {[[90, 45], [150, 28], [200, 8]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="6" fill="#FF2E7E" />)}
        </svg>
        <span className="display text-3xl">Awareness → Leads</span>
      </div>
      <div className="col-span-2 row-span-2 rounded-3xl bg-hot grid place-items-center display text-5xl text-ink">Ads</div>
      <div className="col-span-2 row-span-3 rounded-3xl bg-volt text-ink p-4 flex flex-col justify-end"><span className="label">Competitor</span><span className="display text-3xl">Matrix</span></div>
      <div className="col-span-2 row-span-2 rounded-3xl bg-ink text-paper p-4 flex flex-col justify-end"><span className="label opacity-90">Weekly</span><span className="display text-3xl">Report</span></div>
      <div className="col-span-2 row-span-2 rounded-3xl bg-flame text-ink p-4 flex flex-col justify-end"><span className="display text-3xl">Social</span></div>
    </div>
  );
}

function Classroom() {
  const mods = ["SEO", "SEM", "GA", "Social", "Content", "Lead gen"];
  return (
    <div className="relative w-[min(480px,84vw)]">
      <div className="rounded-[28px] bg-ink text-paper p-6 shadow-2xl -rotate-2">
        <div className="flex justify-between label opacity-90"><span>Curriculum</span><span>Batch · 20+ learners</span></div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {mods.map((m, i) => (
            <div key={m} className="rounded-2xl p-3 aspect-[4/3] flex flex-col justify-between" style={{ background: ["#FF2E7E", "#E3FF3B", "#4FE3D0", "#F3EEE6", "#FFB21C", "#2433FF"][i], color: i === 5 ? "#F3EEE6" : "#0C0A12" }}>
              <span className="label !text-[12px]">M{i + 1}</span>
              <span className="display text-2xl">{m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-10 -right-4 rounded-2xl bg-paper text-ink p-4 w-56 rotate-3 shadow-xl">
        <div className="label opacity-90">Learner KPIs</div>
        {[0, 1, 2].map((k) => (
          <div key={k} className="flex items-center gap-2 mt-2"><span className="w-5 h-5 rounded-full bg-ink" /><div className="h-2 flex-1 rounded-full bg-ink/15"><div className="h-full rounded-full bg-flame" style={{ width: `${55 + k * 15}%` }} /></div></div>
        ))}
      </div>
    </div>
  );
}

const LABEL: Record<Project["visual"], string> = {
  instagram: "Screenshot of the bhuvan_nritya Instagram profile: 10 posts, 130 followers, and 14.7K views in the last 30 days",
  youtube: "Screenshot of the Viswakesh YouTube channel: 1.18K subscribers and 57 videos",
  ads: "Illustrative mockup of stacked social ad creatives and a funnel chart",
  brand: "Illustrative mockup of a campaign planning board",
  classroom: "Illustrative mockup of a training curriculum and learner progress",
};

export default function Visual({ kind }: { kind: Project["visual"] }) {
  const inner = kind === "instagram" ? <InstagramProfile /> : kind === "youtube" ? <YouTubeChannel /> : kind === "ads" ? <Ads /> : kind === "brand" ? <Brand /> : <Classroom />;
  return <div role="img" aria-label={LABEL[kind]}>{inner}</div>;
}
