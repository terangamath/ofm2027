/** Index visé par une touche, selon le motif ARIA des onglets ; null sinon. */
export function cibleClavier(key: string, index: number, total: number): number | null {
  if (key === "ArrowRight") return (index + 1) % total;
  if (key === "ArrowLeft") return (index - 1 + total) % total;
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  return null;
}
