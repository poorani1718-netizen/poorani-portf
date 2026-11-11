export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { CHANNELS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return CHANNELS.map((c) => ({ url: `${SITE_URL}${c.path === "/" ? "" : c.path}`, changeFrequency: "monthly", priority: c.path === "/" ? 1 : 0.7 }));
}
