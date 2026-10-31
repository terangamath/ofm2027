export function ComingSoonPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-alt px-10 py-16 text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="font-semibold text-4xl text-link" aria-hidden>
          Σ
        </span>
        <h2 className="text-h3 text-primary">{title}</h2>
        <p className="max-w-md text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
