# currnt-unpacked

A static showcase of the **Currnt** platform — a B2B expert-network and market-research product (originally **Convetit**, briefly **Expertboards**) that ran from ~2015 until its codebase was frozen in December 2024. This site is a portfolio archive: what was built, what was sunset, what was still planned.

Not affiliated with the operating Currnt company. Built from public archaeological recon of a dormant production system the author owned access to.

Live at: <https://myascendai.github.io/currnt-unpacked>

## Stack

- [Astro 5](https://astro.build) with content collections and MDX
- [Svelte 5](https://svelte.dev) runes for interactive islands
- [Tailwind v4](https://tailwindcss.com) (CSS-first config)
- [Shiki](https://shiki.style) for code highlighting (server-side, no client JS)
- [Mermaid](https://mermaid.js.org) for text-based diagrams (rendered to SVG at build via `rehype-mermaid`)
- [Pagefind](https://pagefind.app) for client-side full-text search
- Deployed to GitHub Pages via GitHub Actions

## Local dev

```bash
bun install
bun run dev          # http://localhost:4321
bun run build        # static output to dist/, then pagefind indexes it
bun run preview      # serve dist/
bun run check        # astro + svelte + tsc
```

## License

Dual-licensed for clarity:

- **Code** (anything that isn't prose or content): [PolyForm Noncommercial 1.0.0](./LICENSE). Free to use, modify, and redistribute for non-commercial purposes with attribution.
- **Content** (MDX prose, diagrams, screenshots, the writing itself): [CC BY-NC 4.0](./LICENSE-content). Attribution required, non-commercial only.

If you want to reproduce or build on this, attribution is required and commercial use is not permitted under either license. Contact the author for other arrangements.

## Repo layout

```
src/
  components/           Astro and Svelte components
    mdx/                Components available inline in MDX (RouteTable, StatStrip, ...)
  content/
    domains/            One MDX file per Currnt product domain
  layouts/              BaseLayout.astro
  pages/                Routes
  styles/               global.css with Tailwind v4 @theme tokens
.ralph/                 Plan-of-record (prd.json) for the build phase
.github/workflows/      CI: deploy to GH Pages on push to main
```
