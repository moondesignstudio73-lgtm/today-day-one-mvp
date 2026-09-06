import {DAY29_V4_SOURCE_SCENES} from './day29-v4-source-registry.mjs';

export function day29V4SourceRef(sceneNumber,exactLine){const scene=DAY29_V4_SOURCE_SCENES.find(item=>item.number===sceneNumber);if(!scene||!scene.body.split('\n').includes(exactLine))throw new Error(`DAY29_SOURCE_LINE_MISSING:${sceneNumber}`);return Object.freeze({day:29,sceneNumber,exact:exactLine});}
export function validateDay29V4SourceStep(step){if(!step?.source||step.source.day!==29)return false;try{return day29V4SourceRef(step.source.sceneNumber,step.source.exact).exact===step.source.exact;}catch{return false;}}
