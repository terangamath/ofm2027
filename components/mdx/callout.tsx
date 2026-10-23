import type { ReactNode } from "react";
import type { ContentStatus } from "@/content/types";

const STATUS_STYLES: Record<ContentStatus, string> = {
  coming_soon: "border-hairline bg-surface-alt text-foreground",
  published: "border-accent/40 bg-accent/10 text-foreground",
};

export function Callout({
  status = "published",
  children,
}: {
  status?: ContentStatus;
  children: ReactNode;
}) {
  return (
    <div className={`my-2 rounded-lg border px-5 py-4 text-body ${STATUS_STYLES[status]}`}>
      {children}
    </div>
  );
}
