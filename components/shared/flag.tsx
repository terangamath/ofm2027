import Image from "next/image";

/**
 * Drapeau en SVG (fichiers `public/flags/{code}.svg`, issus de flag-icons, MIT).
 * Les drapeaux emoji ne rendent pas sous Windows : on ne les utilise plus.
 * Purement décoratif : le nom du pays est toujours écrit à côté.
 */
export function Flag({
  countryCode,
  size = 20,
  className,
}: {
  countryCode: string;
  size?: number;
  className?: string;
}) {
  const height = Math.round(size * 0.75);
  return (
    <Image
      src={`/flags/${countryCode.toLowerCase()}.svg`}
      alt=""
      aria-hidden
      width={size}
      height={height}
      className={`inline-block shrink-0 rounded-[2px] ${className ?? ""}`}
      style={{ width: size, height }}
    />
  );
}
