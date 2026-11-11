"use client";
import { useEffect } from "react";

// Route-level error boundary: shows a friendly screen instead of a blank page, never a stack trace.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hook point for an error tracker (e.g. Sentry). Only the digest is logged, not user data.
    console.error("Page error", error.digest ?? "");
  }, [error]);
  return (
    <section className="min-h-[100svh] bg-ink text-paper gutter pt-32 pb-36 flex flex-col justify-center">
      <p className="label opacity-70">Technical difficulties</p>
      <h1 className="display text-[clamp(90px,20vw,340px)]">Please <span className="outline-paper">stand by</span></h1>
      <p className="serif-i text-[clamp(24px,3vw,44px)] max-w-[26ch]">Something on this page failed to load. Try again, or switch channels with the dial below.</p>
      <button onClick={reset} className="mt-8 self-start rounded-full bg-volt text-ink px-7 py-4 display text-2xl">Try again</button>
    </section>
  );
}
