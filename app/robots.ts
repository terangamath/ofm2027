import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { reglesRobots } from "@/lib/indexation";

export default function robots(): MetadataRoute.Robots {
  return reglesRobots(SITE_URL);
}
