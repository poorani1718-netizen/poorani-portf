"use client";
import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/** Keeps Tab focus inside an open overlay and returns focus to the opener when it closes. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, initial?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => (initial?.current ?? el.querySelector<HTMLElement>(FOCUSABLE))?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); opener?.focus?.({ preventScroll: true }); };
  }, [active, ref, initial]);
}
