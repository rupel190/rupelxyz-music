<script lang="ts">
  import { DEFAULT_SETTINGS, TubsBlock, TubsErrorView, parseTubs } from 'tubs-renderer/web';

  // The same blocks as the plugin's demo note, so what plays here is what plays in Obsidian.
  const EXAMPLES = [
    {
      name: 'Two-Step',
      src: `@ bpm=174 div=4 title="Two-Step"
> from Two-Step: remove a kick
        1 e & a  2 e & a  3 e & a  4 e & a
Hihat | x . x .  x . x .  x . x .  x . x .
Snare | . . . .  x . . .  . . . .  x . . .
Kick  | x . . .  . . . .  . x . .  . . . .`,
    },
    {
      name: 'Two bars, accents & ghosts',
      src: `@ bpm=140 div=4 beats=4 title="Two bars"
Hat   | x x x x x x x x x x x x x x x x  x x x x x x x x x x x x x x x x
Snare | . . . . X . . . . . . . X . . .  . . . . X . . . . . . g X . g .
Kick  | x . . . . . x . x . . . . . . .  x . . . . . x . x . . . x . . .`,
    },
    {
      name: 'Triplet feel',
      src: `@ bpm=120 div=3 title="Triplet ride"
Ride  | x . .  x . .  x . .  x . .
Snare | . . .  x . .  . . .  x . .
Kick  | x . .  . . .  x . .  . . .`,
    },
    {
      name: 'Held bass',
      src: `@ bpm=96 div=4 root=C2 title="Held bass"
Hat  | x . o .  x . x .  x . o .  x . x .
Bass | F1 _ _ _  . . A1 .  C2 _ . .  x . . .`,
    },
  ];

  let source = $state(EXAMPLES[0].src);

  // Same defaults the plugin passes, so a block without @ bpm= behaves identically.
  const parsed = $derived.by(() => {
    try {
      return {
        model: parseTubs(source, { bpm: DEFAULT_SETTINGS.defaultBpm, root: DEFAULT_SETTINGS.defaultRoot }),
        error: null,
      };
    } catch (e) {
      return { model: null, error: e instanceof Error ? e.message : String(e) };
    }
  });
</script>

<div class="examples" role="group" aria-label="Examples">
  {#each EXAMPLES as ex}
    <button type="button" aria-pressed={source === ex.src} onclick={() => (source = ex.src)}>{ex.name}</button>
  {/each}
</div>

<label class="label" for="tubs-src">The text you'd keep in a <code>tubs</code> code block</label>
<textarea id="tubs-src" bind:value={source} rows="6" spellcheck="false" wrap="off"></textarea>

<div class="rendered" aria-live="polite">
  {#if parsed.model}
    <!-- The block reads its model once, so every edit mounts a fresh one (and stops playback). -->
    {#key parsed.model}
      <TubsBlock model={parsed.model} settings={DEFAULT_SETTINGS} />
    {/key}
  {:else}
    <TubsErrorView message={parsed.error ?? ''} />
  {/if}
</div>

<style>
  .examples {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .examples button {
    border: 1px solid var(--line);
    background: var(--surface);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 15px;
  }
  .examples button[aria-pressed='true'] {
    background: var(--ink);
    color: var(--bg);
    border-color: var(--ink);
  }
  .label {
    display: block;
    margin-top: 18px;
  }
  .label code {
    text-transform: none;
    letter-spacing: 0;
  }
  textarea {
    display: block;
    width: 100%;
    margin-top: 7px;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--surface);
    color: var(--ink);
    font-family: var(--f-mono);
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    overflow-x: auto;
  }
  textarea:focus-visible {
    outline: 2px solid var(--warm);
    outline-offset: 2px;
  }
  .rendered {
    margin-top: 18px;
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--surface);
    font-family: var(--font-interface);
    font-size: 16px;
  }
</style>
