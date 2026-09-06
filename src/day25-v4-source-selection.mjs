import {DAY25_V4_SOURCE_SCENES} from './day25-v4-source-registry.mjs';

export function day25V4SourceRef(sceneNumber, exactLine) {
  const scene = DAY25_V4_SOURCE_SCENES.find(item => item.number === sceneNumber);
  if (!scene || !scene.body.split('\n').includes(exactLine)) throw new Error(`DAY25_SOURCE_LINE_MISSING:${sceneNumber}`);
  return Object.freeze({day:25, sceneNumber, exact:exactLine});
}

export function validateDay25V4SourceStep(step) {
  if (!step?.source || step.source.day !== 25) return false;
  try { return day25V4SourceRef(step.source.sceneNumber, step.source.exact).exact === step.source.exact; }
  catch { return false; }
}
