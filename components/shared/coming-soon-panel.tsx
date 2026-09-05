export function ComingSoonPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-ivoire px-10 py-16 text-anthracite">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="font-display text-4xl text-or-encre" aria-hidden>
          Σ
        </span>
        <h2 className="font-display text-h3 text-vert">{title}</h2>
        <p className="max-w-md text-encre">{body}</p>
      </div>
    </div>
  );
}
