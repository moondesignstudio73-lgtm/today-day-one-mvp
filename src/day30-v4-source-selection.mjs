import {DAY30_V4_SOURCE_SCENES} from './day30-v4-source-registry.mjs';

export function day30V4SourceRef(sceneNumber,exactLine){const scene=DAY30_V4_SOURCE_SCENES.find(item=>item.number===sceneNumber);if(!scene||!scene.body.split('\n').includes(exactLine))throw new Error(`DAY30_SOURCE_LINE_MISSING:${sceneNumber}`);return Object.freeze({day:30,sceneNumber,exact:exactLine});}
export function validateDay30V4SourceStep(step){if(!step?.source||step.source.day!==30)return false;try{return day30V4SourceRef(step.source.sceneNumber,step.source.exact).exact===step.source.exact;}catch{return false;}}
