import { dirname } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Every page in this repo is served under rupel.xyz/music/ by its own worker (see
// wrangler.jsonc). One HTML entry per page; Vite builds them together and shares chunks.
const pages = ['index', 'songmap/index', 'modes/index', 'tubs/index', 'singify/index']

// The site chrome every page shares, stamped in at <!--site-nav--> and <!--site-foot-->. The nav is
// the same markup as on the rest of rupel.xyz (`nav` in the rupelxyz repo's build.ts), so change
// both together; the hub marks "music" as the current page, every other page as the current
// section. Pages inside /music/ end with a link back to the hub; the hub itself has no footer.
function siteChrome(): Plugin {
  let root = ''
  return {
    name: 'site-chrome',
    configResolved(config) {
      root = config.root
    },
    transformIndexHtml(html, ctx) {
      if (!html.includes('<!--site-nav-->')) throw new Error(`${ctx.filename}: missing <!--site-nav-->`)
      const current = dirname(ctx.filename) === root ? 'page' : 'true'
      return html
        .replace(
          '<!--site-nav-->',
          `<nav class="topnav"><a href="/">&larr; rupel.xyz</a><a href="/writing/">writing</a><a href="/music/" aria-current="${current}">music</a></nav>`,
        )
        .replace('<!--site-foot-->', '<footer class="post-foot"><a href="/music/">&larr; all music</a></footer>')
    },
  }
}

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
  server: {
    // Pages link the site's stylesheet and fonts under /assets/, which the main rupel.xyz worker
    // serves. There's no main worker in dev, so borrow the live one. The dev server rewrites
    // the links with `base` (the build leaves them alone), hence the /music prefix here.
    proxy: {
      '^/music/assets/(blog\\.css|fonts)': {
        target: 'https://rupel.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/music/, ''),
      },
    },
  },
  plugins: [svelte(), siteChrome()],
})
