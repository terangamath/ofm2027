import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("container-main py-3", className)}
    >
      <ol className="flex items-center flex-wrap gap-1.5 text-sm text-gris" role="list">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-vert transition-colors"
            aria-label="Accueil"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" aria-hidden="true" />
            {item.href && idx < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-vert transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-anthracite font-medium"
                aria-current={idx === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
