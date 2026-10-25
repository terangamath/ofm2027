import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Callout } from "@/components/mdx/callout";
import { remarkTypographie } from "@/lib/remark-typographie";
import type { Locale } from "@/content/types";

const components = { Callout };

export function MdxContent({ source, locale }: { source: string; locale: Locale }) {
  return (
    <div
      className="flex flex-col gap-5 text-body text-foreground/90
        [&_h2]:mt-4 [&_h2]:text-h3 [&_h2]:[&_h2]:text-foreground
        [&_h3]:mt-2 [&_h3]:text-h4 [&_h3]:[&_h3]:text-foreground
        [&_strong]:font-semibold [&_strong]:text-foreground
        [&_blockquote]:border-l-2 [&_blockquote]:border-hairline [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
        [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
        [&_a]:text-link [&_a]:underline [&_a]:decoration-hairline [&_a]:underline-offset-4"
    >
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            // La composition française vient après remark-math : les formules sont déjà
            // des nœuds distincts et ne sont jamais touchées.
            remarkPlugins: locale === "fr" ? [remarkMath, remarkTypographie] : [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
      />
    </div>
  );
}
