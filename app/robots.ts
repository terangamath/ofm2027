import type { MetadataRoute } from "next";
import { ENVIRONNEMENT_VERCEL, SITE_URL } from "@/lib/site";
import { reglesRobots } from "@/lib/indexation";

export default function robots(): MetadataRoute.Robots {
  return reglesRobots(SITE_URL, ENVIRONNEMENT_VERCEL);
}
