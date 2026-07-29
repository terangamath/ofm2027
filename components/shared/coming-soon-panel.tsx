import { IsometricGrid } from "@/components/motifs/isometric-grid";

export function ComingSoonPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline bg-vert-nuit px-10 py-16 text-ivoire">
      <IsometricGrid className="pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative flex flex-col items-center gap-4 text-center">
        <span className="font-display text-4xl text-or-clair" aria-hidden>
          Σ
        </span>
        <h2 className="font-display text-h3">{title}</h2>
        <p className="max-w-md text-ivoire/75">{body}</p>
      </div>
    </div>
  );
}
