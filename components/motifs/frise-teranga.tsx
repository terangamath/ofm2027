/**
 * Frise Teranga — le seul motif de la variante B.
 *
 * Des triangles isocèles posés sur la limite entre deux sections, pointe vers
 * le haut, dans l'ordre du drapeau sénégalais (vert, jaune, rouge), espacés
 * pour donner un rythme plutôt qu'une guirlande. Elle a une fonction : marquer
 * la fin du hero et l'entrée dans la partition de la simultanéité, à la place
 * du filet. Elle reste dans la largeur du contenu, pas collée au bord de
 * l'écran. Dessin : classe .frise-teranga (globals.css), SVG de 300 octets.
 */
export function FriseTeranga() {
  return (
    <div aria-hidden className="bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="frise-teranga" />
      </div>
    </div>
  );
}
