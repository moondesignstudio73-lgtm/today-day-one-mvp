import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveStoryCgAsset, STORY_CG_APPROVED_REPLACEMENTS} from '../src/story-cg-asset-policy.mjs';

const base = 'https://example.test/game/index.html';
test('all reviewed hand-art URLs resolve to approved bytes with a fresh cache key', () => {
  for (const [old, approved] of Object.entries(STORY_CG_APPROVED_REPLACEMENTS)) {
    for (const source of [old, `./${old}?old=1#cg`, new URL(old, base).href]) {
      assert.equal(resolveStoryCgAsset(source, base), `https://example.test/game/${approved}?art=hand-review-20260907-1`);
    }
    assert.deepEqual(readFileSync(new URL(`../${old}`, import.meta.url)), readFileSync(new URL(`../${approved}`, import.meta.url)));
  }
});
test('unrelated and external sources are not rewritten', () => {
  for (const source of [null, undefined, '', 'assets/events/other.png', 'data:image/png;base64,AA', 'https://external.test/game/assets/events/day18-v4/yuri-menu-wait-water-v1.png']) {
    assert.equal(resolveStoryCgAsset(source, base), source);
  }
});
test('normalization is idempotent, base-aware, and installed at the CG rendering boundary', () => {
  const source = 'assets/events/day18-v4/yuri-menu-wait-water-v1.png';
  for (const page of [base, 'http://localhost:8000/index.html']) {
    const once = resolveStoryCgAsset(source, page);
    assert.equal(resolveStoryCgAsset(once, page), once);
  }
  const game = readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  assert.match(game, /if\(step.type==="cgShow"\)\{[^]*?layer.src=resolveStoryCgAsset\(step.source,document.baseURI\)/);
});

test('the published site keeps the environment-approved promotion branch and a fresh entry revision', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(workflow, /push:\s*\n\s*branches:\s*\n\s*- gh-pages\b/);
  assert.match(html, /game\.js\?v=291/);
});
