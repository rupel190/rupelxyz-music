# rupelxyz-music

Everything music on [rupel.xyz](https://rupel.xyz), served at
[rupel.xyz/music/](https://rupel.xyz/music/). One repo, one build, one Cloudflare worker.

| Page | URL | What it is |
|---|---|---|
| `index.html` | [/music/](https://rupel.xyz/music/) | The hub: one line per thing below |
| `modes/` | [/music/modes/](https://rupel.xyz/music/modes/) | Fretboard Mode Lab: every guitar mode in every key, played with the five major-scale patterns. Vanilla JS in one file. |
| `songmap/` | [/music/songmap/](https://rupel.xyz/music/songmap/) | Songmap: map a track's sections and arrangement over its waveform. Svelte 5. See [songmap/README.md](songmap/README.md). |
| `tubs/` | [/music/tubs/](https://rupel.xyz/music/tubs/) | Playable demo of the [TUBS Renderer](https://github.com/rupel190/tubs-renderer) Obsidian plugin |
| `singify/` | [/music/singify/](https://rupel.xyz/music/singify/) | Write-up of [Singify](https://github.com/rupel190/singify), karaoke inside Spotify |

Things that have to live elsewhere keep their own repos: the TUBS plugin (Obsidian's plugin
list reads `manifest.json` from the repo root) and Singify (a Spotify extension). This repo
shows them.

## Layout

```
index.html, <page>/index.html   one Vite entry per page (listed in vite.config.ts)
src/songmap/                    Songmap app
src/tubs/                       TUBS demo; imports the plugin's own renderer from tubs-renderer/web
public/<page>/                  files that need a stable URL, e.g. og:image
```

Each page marks where the shared nav goes with `<!--site-nav-->`, and pages inside /music/ mark
their footer with `<!--site-foot-->`; `vite.config.ts` stamps both in, so every page gets the same
nav as the rest of rupel.xyz. A page without the nav marker fails the build.

Every page links the site's stylesheet, `/assets/blog.css`, which the main rupel.xyz worker
serves; that's where the nav and base styles come from. Fonts are DM Serif Display, Newsreader
and DM Mono; the colour tokens sit at the top of each page's `<style>`, with a dark-mode
block under `prefers-color-scheme`.

The TUBS demo depends on `github:rupel190/tubs-renderer`, pinned by `bun.lock`. After a change
there, push it and run `bun update tubs-renderer` here.

## Development

The toolchain is pinned in a Nix flake and loaded automatically by direnv:

```sh
direnv allow          # one-time: loads bun + node from the flake on cd
bun install
bun run dev           # http://localhost:5173/music/
```

Without direnv, enter the shell explicitly: `nix develop -c bun run dev`. In dev, Vite proxies
the shared stylesheet from the live rupel.xyz so it loads.

Other scripts:

```sh
bun run check         # svelte-check (TypeScript)
bun run build         # production build → dist/music/
bun run preview       # serve the built dist/ locally
```

## Deployment

A static-assets **Cloudflare Worker** named `rupelxyz-music`, deployed by Cloudflare's git-connected
build on push (`bun run build`, then `npx wrangler deploy`). Its only entry point is the zone
route `rupel.xyz/music*`, declared in `wrangler.jsonc`. The build nests its output under
`dist/music/` so the files line up with that route.

The site-wide sitemap at rupel.xyz/sitemap.xml lists these pages. It's generated in the
rupelxyz repo (`APP_PAGES` in `build.ts`), so add a new page there too.

## Stack

Svelte 5 (runes) · Vite · TypeScript · Tone.js (via tubs-renderer) · bun · Nix flake + direnv
