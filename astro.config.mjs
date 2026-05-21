import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import rehypeMermaid from "rehype-mermaid";

// GitHub Pages: serve at https://myascendai.github.io/currnt-unpacked
export default defineConfig({
  site: "https://myascendai.github.io",
  base: "/currnt-unpacked",
  trailingSlash: "ignore",
  integrations: [
    mdx({
      rehypePlugins: [[rehypeMermaid, { strategy: "img-svg", dark: true }]],
    }),
    svelte(),
    icon({
      include: {
        lucide: ["*"],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
      wrap: true,
    },
    rehypePlugins: [[rehypeMermaid, { strategy: "img-svg", dark: true }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
