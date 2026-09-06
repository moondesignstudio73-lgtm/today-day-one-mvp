import {DAY28_V4_SOURCE_SCENES} from './day28-v4-source-registry.mjs';

export function day28V4SourceRef(sceneNumber,exactLine){const scene=DAY28_V4_SOURCE_SCENES.find(item=>item.number===sceneNumber);if(!scene||!scene.body.split('\n').includes(exactLine))throw new Error(`DAY28_SOURCE_LINE_MISSING:${sceneNumber}`);return Object.freeze({day:28,sceneNumber,exact:exactLine});}
export function validateDay28V4SourceStep(step){if(!step?.source||step.source.day!==28)return false;try{return day28V4SourceRef(step.source.sceneNumber,step.source.exact).exact===step.source.exact;}catch{return false;}}
