"use client";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { hrefFor } from "@/lib/router";
import { useGo } from "./Shell";

/** Link that plays the channel-change transition before routing. */
export default function TLink({ to, children, ...rest }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const go = useGo();
  return (
    <a
      href={hrefFor(to)}
      {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        go(to);
      }}
    >
      {children}
    </a>
  );
}
