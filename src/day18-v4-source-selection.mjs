import {DAY18_V4_SOURCE_SCENES} from './day18-v4-source-registry.mjs';

// Selection boundaries are authored in the route resolver, not inferred from prose.
// Unlabelled prose deliberately remains non-renderable until explicitly directed.
export function selectDay18V4Source(number, {from, to} = {}) {
  const scene = DAY18_V4_SOURCE_SCENES.find(s => s.number === number);
  if (!scene) throw new Error(`DAY18_SOURCE_SCENE_MISSING:${number}`);
  let start = 0, end = scene.body.length;
  if (from != null) {
    start = scene.body.indexOf(from);
    if (start < 0) throw new Error(`DAY18_SOURCE_BOUNDARY_MISSING:${number}:${from}`);
  }
  if (to != null) {
    end = scene.body.indexOf(to, start + (from?.length ?? 0));
    if (end < 0) throw new Error(`DAY18_SOURCE_BOUNDARY_MISSING:${number}:${to}`);
  }
  let offset = 0;
  return scene.body.split('\n').flatMap((text, index) => {
    const at = offset; offset += text.length + 1;
    if (at < start || at >= end || !text.trim()) return [];
    const source = {scene: number, line: index + 1};
    const match = text.match(/^\*\*([^*]+)\*\* “(.*)”$/);
    if (match) return [{type: 'dialogue', speaker: match[1] === '주인공' ? '나' : match[1], text: match[2], source}];
    return [{type: 'sourceNote', text, source}];
  });
}

export function day18V4SourceDialogue(number, from, to) {
  return selectDay18V4Source(number, {from, to}).filter(step => step.type === 'dialogue');
}
