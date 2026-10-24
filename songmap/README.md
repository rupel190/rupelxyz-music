# Songmap

A client-side tool for mapping the structure of a track: load an audio file, see its
waveform, lay a BPM bar-grid over it, drop color-coded **section markers** (intro / verse /
chorus / drop …), and sketch an **arrangement** of instrument lanes with blocks
and fades. Everything runs in the browser — no backend, no upload. Markers and arrangement
persist per file via `localStorage`, and you can copy the whole map out as TSV.

Live: https://rupel.xyz/music/songmap/

## Features

- Waveform rendering via the Web Audio API (`decodeAudioData` + downsampled peaks).
- BPM control with tap-tempo, adjustable bar-1 offset, and a toggleable bar grid.
- Transport: play/pause plus `«bar` / `bar»` buttons that jump the playhead one whole bar at
  a time (snapped to bar starts) for quick re-listening.
- Section markers: tap a section to place one (auto-selected). A marker is grabbed only by its
  label, so tapping elsewhere on the waveform just seeks — even while a marker is selected, so
  you can re-listen mid-edit. Edit from a popup pinned to the marker: move it by the bar,
  rename, delete.
- Arrangement lanes: tap an empty lane for a default block, or **drag from where you press to
  size one** (bar-snapped). Tap a block to select it; a popup above sets start / end and one
  below sets fade-in / fade-out. Hold a +/− stepper to repeat it.
- Start / end move that edge and carry the fade rigidly — the fade length (and the block's
  shape) never changes, and no fade is invented where there wasn't one.
- Per-file persistence (keyed by name + size); copy the whole map to the clipboard as TSV, and
  import it back the same way (marker times round to whole seconds, block bars are exact).
- Touch-first: vertical drags scroll and pinch zooms as normal; a horizontal drag on a lane
  sizes a new block. Edit popups stay anchored to whatever you've selected (built for mobile).
