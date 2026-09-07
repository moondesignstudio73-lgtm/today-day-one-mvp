// Resolve reviewed hand-art replacements at the rendering boundary as well as in scripts.
// This also covers older persisted scene steps without rewriting the player's save.
const directory = 'assets/events/day18-v4/';
const groups = {
  'yuri-menu-wait-water': 10,
  'food-sharing': 3,
  'haeun-tasting': 3,
  'own-meals': 3,
  'table-space': 2,
  'vegetable-bite': 2,
  'haeun-menu-slide': 2,
  'menu-open': 2,
  'menu-closed': 2,
  'washing-cup-night': 2,
  'morning-alarm-off': 2,
  'wallet-open': 2,
  'wallet-closed': 2,
  'solo-bag-seat-move': 2,
};

export const STORY_CG_APPROVED_REPLACEMENTS = Object.freeze(Object.fromEntries(
  Object.entries(groups).flatMap(([name, latest]) => Array.from({length: latest}, (_, index) => [
    `${directory}${name}-v${index + 1}.png`, `${directory}${name}-v${latest}.png`,
  ])),
));

export function resolveStoryCgAsset(source, baseUrl) {
  if (typeof source !== 'string' || !baseUrl) return source;
  try {
    const base = new URL('.', baseUrl);
    const input = new URL(source, base);
    if (input.origin !== base.origin || !input.pathname.startsWith(base.pathname)) return source;
    const relative = input.pathname.slice(base.pathname.length);
    const approved = STORY_CG_APPROVED_REPLACEMENTS[relative];
    if (!approved) return source;
    const result = new URL(approved, base);
    // A new cache key also bypasses cached bytes under an already-correct filename.
    result.searchParams.set('art', 'hand-review-20260907-2');
    return result.href;
  } catch {
    return source;
  }
}
