import {DAY27_V4_SOURCE_SCENES} from './day27-v4-source-registry.mjs';

export function day27V4SourceRef(sceneNumber,exactLine){const scene=DAY27_V4_SOURCE_SCENES.find(item=>item.number===sceneNumber);if(!scene||!scene.body.split('\n').includes(exactLine))throw new Error(`DAY27_SOURCE_LINE_MISSING:${sceneNumber}`);return Object.freeze({day:27,sceneNumber,exact:exactLine});}
export function validateDay27V4SourceStep(step){if(!step?.source||step.source.day!==27)return false;try{return day27V4SourceRef(step.source.sceneNumber,step.source.exact).exact===step.source.exact;}catch{return false;}}
