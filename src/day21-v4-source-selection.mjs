import {DAY21_V4_SOURCE_SCENES} from './day21-v4-source-registry.mjs';

export function day21V4SourceRef(sceneNumber, exactLine) {
  const scene = DAY21_V4_SOURCE_SCENES[sceneNumber - 1];
  if (!scene || scene.number !== sceneNumber) throw new Error(`DAY21_SOURCE_SCENE_MISSING:${sceneNumber}`);
  const lines = scene.body.split('\n');
  const line = lines.indexOf(exactLine);
  if (line < 0) throw new Error(`DAY21_SOURCE_LINE_MISSING:${sceneNumber}:${exactLine}`);
  return Object.freeze({scene: sceneNumber, line: line + 1, exact: exactLine});
}

export function validateDay21V4SourceStep(step) {
  if (!step?.source) return !['dialogue', 'message', 'monologue', 'stageAction'].includes(step?.type);
  const scene = DAY21_V4_SOURCE_SCENES[step.source.scene - 1];
  return scene?.body.split('\n')[step.source.line - 1] === step.source.exact;
}
