import { useId } from "react";

/**
 * Texture secondaire : grille triangulée très fine façon « papier millimétré
 * élégant », en filets or à très faible opacité. Purement statique et
 * décorative — aucune animation, aucun impact sur les performances.
 */
export function IsometricGrid({ className }: { className?: string }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const patternId = `iso-grid-${rawId}`;
  const size = 64;
  const height = size * 0.866;

  return (
    <svg aria-hidden="true" className={className} width="100%" height="100%">
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M0 ${height} L${size / 2} 0 L${size} ${height} M0 0 L${size} 0`}
            fill="none"
            stroke="var(--hairline)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
