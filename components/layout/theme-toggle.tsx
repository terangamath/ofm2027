"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Sélecteur de thème : clair (par défaut) ou sombre. L'icône et le libellé
 * suivent la classe `.dark` posée par next-themes avant la peinture, en CSS :
 * le rendu serveur et le premier rendu client sont identiques, sans attendre
 * l'hydratation pour afficher le bon état.
 */
export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex size-11 items-center justify-center rounded-full border border-nav-capsule-bord text-nav-texte transition-[background-color] duration-100 hover:bg-nav-survol active:bg-nav-survol"
    >
      <Moon aria-hidden className="size-[1.125rem] dark:hidden" />
      <Sun aria-hidden className="hidden size-[1.125rem] dark:block" />
      <span className="sr-only dark:hidden">{labels.toDark}</span>
      <span className="sr-only hidden dark:inline">{labels.toLight}</span>
    </button>
  );
}
