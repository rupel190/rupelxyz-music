import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Every page in this repo is served under rupel.xyz/music/ by its own worker (see
// wrangler.jsonc). One HTML entry per page; Vite builds them together and shares chunks.
const pages = ['songmap/index']

// https://vite.dev/config/
export default defineConfig({
  // Every emitted asset URL has to carry the prefix. Vite rewrites the entry scripts and
  // asset links in the HTML from this; anything hardcoded absolute (og:image, canonical)
  // does not go through Vite and has to spell the prefix out.
  base: '/music/',
  build: {
    // `base` only rewrites the URLs Vite emits — it does NOT move the files. The Cloudflare
    // route resolves /music/assets/x.js against the assets directory as dist/music/…, so
    // the build has to physically nest too or every asset 404s. (SvelteKit's adapter does
    // this nesting for you; Vite does not.) wrangler still points at ./dist.
    outDir: 'dist/music',
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, `${p}.html`])),
    },
  },
  plugins: [svelte()],
})
