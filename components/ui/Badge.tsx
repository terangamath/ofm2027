import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { PublicationStatus } from "@/types/content";

type BadgeVariant = "vert" | "or" | "rouge" | "gris" | "status";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  status?: PublicationStatus;
}

const variantStyles: Record<BadgeVariant, string> = {
  vert: "bg-vert-pale text-vert border border-vert-pale/60",
  or: "bg-or-pale text-or border border-or-clair",
  rouge: "bg-red-50 text-rouge border border-red-100",
  gris: "bg-gray-100 text-gris border border-gray-200",
  status: "",
};

const statusStyles: Record<PublicationStatus, string> = {
  published: "bg-vert-pale text-vert border border-vert-pale/60",
  coming_soon: "bg-or-pale text-or border border-or-clair",
  draft: "bg-gray-100 text-gris border border-gray-200",
};

const statusLabels: Record<PublicationStatus, string> = {
  published: "Publié",
  coming_soon: "Bientôt disponible",
  draft: "À venir",
};

export function Badge({ variant = "gris", status, className, children, ...props }: BadgeProps) {
  const isStatus = variant === "status" && status != null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        isStatus ? statusStyles[status] : variantStyles[variant],
        className
      )}
      {...props}
    >
      {isStatus ? statusLabels[status] : children}
    </span>
  );
}

/** Badge de statut de publication */
export function StatusBadge({ status }: { status: PublicationStatus }) {
  return <Badge variant="status" status={status} />;
}
