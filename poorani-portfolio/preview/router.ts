import { useEffect, useState } from "react";
import { CHANNELS, channelFor } from "../lib/data";

const current = () => {
  const h = typeof location !== "undefined" ? location.hash.slice(1) : "";
  return CHANNELS.find((c) => c.slug === h)?.path ?? "/";
};

export function useRoute() {
  const [path, setPath] = useState(current);
  useEffect(() => {
    const f = () => setPath(current());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return { path, push: (p: string) => { location.hash = channelFor(p).slug; } };
}

export const hrefFor = (p: string) => "#" + channelFor(p).slug;
export const asset = (name: string) => `./${name}`;
