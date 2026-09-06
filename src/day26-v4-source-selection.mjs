import {DAY26_V4_SOURCE_SCENES} from './day26-v4-source-registry.mjs';

export function day26V4SourceRef(sceneNumber, exactLine) {
  const scene=DAY26_V4_SOURCE_SCENES.find(item=>item.number===sceneNumber);
  if(!scene||!scene.body.split('\n').includes(exactLine))throw new Error(`DAY26_SOURCE_LINE_MISSING:${sceneNumber}`);
  return Object.freeze({day:26,sceneNumber,exact:exactLine});
}

export function validateDay26V4SourceStep(step) {
  if(!step?.source||step.source.day!==26)return false;
  try{return day26V4SourceRef(step.source.sceneNumber,step.source.exact).exact===step.source.exact;}
  catch{return false;}
}
