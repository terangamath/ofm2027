import type { Root, Text } from "mdast";
import { visit } from "unist-util-visit";
import { composerFrancais } from "@/lib/typographie";

/**
 * Plugin remark : compose le texte français des documents MDX.
 * À placer après remark-math : les formules sont alors des nœuds `math` /
 * `inlineMath` distincts des nœuds `text`, et ne sont jamais visitées.
 * Le code (`inlineCode`, `code`) n'est pas non plus un nœud `text`.
 */
export function remarkTypographie() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text) => {
      node.value = composerFrancais(node.value);
    });
  };
}
