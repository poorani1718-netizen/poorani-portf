"use client";
// Next.js routing adapter. The preview build swaps this file for preview/router.ts (hash routing).
import { usePathname, useRouter } from "next/navigation";

export function useRoute() {
  // normalise "/about/" (static export uses trailing slashes) to "/about" so channel lookups match
  const raw = usePathname() || "/";
  const path = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;
  const router = useRouter();
  return { path, push: (p: string) => router.push(p, { scroll: false }) };
}

export const hrefFor = (p: string) => p;
export const asset = (name: string) => `/${name}`;
