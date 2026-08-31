const f=Object.freeze;
const freezeDeep=value=>{
  if(value&&typeof value==="object"&&!Object.isFrozen(value)){
    for(const nested of Object.values(value))freezeDeep(nested);
    Object.freeze(value);
  }
  return value;
};
const clean=value=>value.replace(/^\\\[|\\\]$/g,"").replace(/^“|”$/g,"").trim();

export function parseDay16V4SourceSteps(markdown){
  const lines=markdown.split("\n"),steps=[];
  for(let index=0;index<lines.length;index+=1){
    const value=lines[index].trim();
    if(!value)continue;
    if(/^### /.test(value)){steps.push(f({type:"section",text:value.slice(4)}));continue;}
    if(/^#/.test(value)||/^- \*\*/.test(value))continue;
    const speaker=value.match(/^\*\*(.+?)\*\*$/);
    if(speaker){
      let next=index+1;
      while(next<lines.length&&!lines[next].trim())next+=1;
      const spoken=lines[next]?.trim();
      if(spoken&&/^“[\s\S]*”$/.test(spoken)){
        steps.push(f({type:"dialogue",speaker:speaker[1],text:clean(spoken)}));
        index=next;
      }
      continue;
    }
    const location=value.match(/^\\?\[([^\\\]]+)\\?\]$/);
    if(location){steps.push(f({type:"stageDirection",text:location[1].replace(/\\\\$/,"")}));continue;}
    steps.push(f({type:"narration",text:clean(value)}));
  }
  return f(steps);
}

export function buildDay16V4Scenes(raw,{choiceScenes,routeContracts}){
  const scenes=raw.split(/(?=^## SCENE \d+)/gm).filter(chunk=>/^## SCENE \d+/m.test(chunk)).map(chunk=>{
    const heading=chunk.match(/^## SCENE (\d+) — ([^\n]+)/m);
    if(!heading)throw new Error("Malformed DAY16 V4 scene heading");
    const number=Number(heading[1]),title=heading[2].trim(),body=chunk.slice(heading[0].length).trim();
    return f({
      number,
      id:`D16V4_S${String(number).padStart(2,"0")}`,
      title,
      choiceNumber:choiceScenes[number]??null,
      routeContract:freezeDeep(routeContracts[number]),
      steps:parseDay16V4SourceSteps(body),
      sourceMarkdown:chunk.trim()
    });
  });
  const numbers=scenes.map(scene=>scene.number);
  if(numbers.length===0||new Set(numbers).size!==numbers.length||numbers.some((number,index)=>index>0&&number<=numbers[index-1])){
    throw new Error("DAY16 V4 scene numbers must be unique and ascending");
  }
  return f(scenes);
}
