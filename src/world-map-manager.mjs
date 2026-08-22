const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

export const PLAYER_HOME_PROFILES = Object.freeze({
  balanced: Object.freeze({
    districtId:"dongsu",
    districtName:"동수동",
    homeName:"동수동 작은 빌라방",
    background:"assets/backgrounds/home/BG_HOME_BASIC_VILLA_NIGHT_001.png",
    description:"단독주택과 저층 빌라가 보이는 소박한 방"
  }),
  handsome: Object.freeze({
    districtId:"dongsu",
    districtName:"동수동",
    homeName:"동수동 고급 오피스텔",
    background:"assets/backgrounds/home/BG_HOME_HANDSOME_NIGHT_001.png",
    description:"패션과 야경이 어우러진 세련된 오피스텔"
  }),
  wealthy: Object.freeze({
    districtId:"geumsu",
    districtName:"금수동",
    homeName:"금수동 한강 펜트하우스",
    background:"assets/backgrounds/home/BG_HOME_WEALTHY_RIVER_NIGHT_001.png",
    description:"한강이 한눈에 보이는 넓은 고급 거실"
  })
});

export const WORLD_MAPS = Object.freeze({
  dongsu:Object.freeze({
    id:"dongsu",cityId:"seoul",name:"동수동",subtitle:"생활과 사람이 가까운 서울의 오래된 동네",theme:"local",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"dongsu-home",name:"나의 방",icon:"⌂",category:"home",x:6,y:6,description:"오늘 하루를 정리하는 익숙한 집"},
      {id:"gimbap-village",name:"김밥마을",icon:"🍙",category:"korean",x:2,y:2,description:"김밥·라면·떡볶이를 파는 동네 분식집"},
      {id:"sundae-house",name:"동수순댓국",icon:"🍲",category:"korean",x:5,y:1,description:"뜨끈한 순댓국과 국밥이 유명한 식당"},
      {id:"small-cafe",name:"카페 모퉁이",icon:"☕",category:"cafe",x:9,y:2,description:"연인과 조용히 대화하기 좋은 작은 카페"},
      {id:"alley-pub",name:"골목포차",icon:"🍺",category:"bar",x:10,y:5,description:"퇴근 후 사람들이 모이는 소박한 술집",adultOnly:true},
      {id:"ramen-shop",name:"하루라멘",icon:"🍜",category:"japanese",x:3,y:5,description:"돈코츠 라멘과 가라아게를 파는 일식집"},
      {id:"china-diner",name:"홍등반점",icon:"🥟",category:"chinese",x:1,y:6,description:"짜장면·짬뽕·딤섬을 파는 중식당"},
      {id:"fitness-food",name:"밸런스 키친",icon:"🥗",category:"diet",x:8,y:6,description:"샐러드·포케·단백질 식단 전문점"},
      {id:"dongsu-station",name:"동수역",icon:"🚇",category:"transport",x:6,y:3,description:"서울 곳곳으로 이어지는 지하철역"}
    ])
  }),
  geumsu:Object.freeze({
    id:"geumsu",cityId:"seoul",name:"금수동",subtitle:"한강과 고급 상권이 이어지는 서울의 부촌",theme:"premium",width:12,height:8,start:{x:3,y:6},
    locations:Object.freeze([
      {id:"geumsu-home",name:"한강 펜트하우스",icon:"⌂",category:"home",x:3,y:6,description:"한강을 내려다보는 넓은 집"},
      {id:"river-cafe",name:"리버뷰 카페",icon:"☕",category:"cafe",x:2,y:2,description:"한강 전망과 디저트가 유명한 카페"},
      {id:"fine-dining",name:"라 메종",icon:"🍽",category:"western",x:6,y:2,description:"기념일에 어울리는 고급 레스토랑"},
      {id:"premium-sushi",name:"스시 세이",icon:"🍣",category:"japanese",x:9,y:1,description:"예약제로 운영되는 고급 스시 다이닝"},
      {id:"department",name:"금수백화점",icon:"🛍",category:"shopping",x:9,y:5,description:"패션·선물·명품 매장이 모인 백화점"},
      {id:"rooftop",name:"루프탑 라운지",icon:"🍸",category:"bar",x:6,y:5,description:"야경을 보며 대화하는 성인 전용 라운지",adultOnly:true},
      {id:"gallery",name:"한강 갤러리",icon:"🖼",category:"culture",x:1,y:5,description:"전시와 사교 이벤트가 열리는 갤러리"},
      {id:"geumsu-station",name:"금수역",icon:"🚇",category:"transport",x:5,y:7,description:"서울 중심부와 연결되는 지하철역"}
    ])
  }),
  busan:Object.freeze({
    id:"busan",cityId:"busan",name:"해운동",subtitle:"바다와 여행의 설렘이 이어지는 부산 해안 지구",theme:"coast",width:12,height:8,start:{x:5,y:6},
    locations:Object.freeze([
      {id:"busan-station",name:"부산역",icon:"🚄",category:"transport",x:5,y:6,description:"서울과 부산을 잇는 장거리 교통 거점"},
      {id:"haeundae-beach",name:"해운대 해변",icon:"🌊",category:"travel",x:2,y:2,description:"연인과 바다를 걸을 수 있는 대표 여행지"},
      {id:"marine-cafe",name:"마린뷰 카페",icon:"☕",category:"cafe",x:5,y:2,description:"푸른 바다를 바라보는 창가 카페"},
      {id:"milmyun-house",name:"부산 밀면집",icon:"🍜",category:"korean",x:8,y:2,description:"시원한 밀면과 만두를 파는 부산 맛집"},
      {id:"gwangalli",name:"광안리 야경",icon:"🌉",category:"travel",x:9,y:5,description:"다리 불빛과 바다를 함께 보는 밤 산책길"},
      {id:"jagalchi",name:"자갈치 시장",icon:"🐟",category:"shopping",x:2,y:5,description:"활기찬 시장과 해산물 식당이 모인 곳"},
      {id:"seomyeon",name:"서면 거리",icon:"🎵",category:"culture",x:6,y:4,description:"쇼핑과 공연, 젊은 분위기가 이어지는 거리"}
    ])
  })
});

export const WORLD_ATLAS = Object.freeze({
  nationwide:Object.freeze({id:"nationwide",name:"전국",subtitle:"서울과 부산을 잇는 여행 지도",destinations:["seoul","busan"]}),
  seoul:Object.freeze({id:"seoul",name:"서울",subtitle:"동수동 생활권과 금수동 한강 상권",districts:["dongsu","geumsu"]}),
  busan:Object.freeze({id:"busan",name:"부산",subtitle:"해운대·광안리·서면 여행 생활권",districts:["busan"]})
});

export const TRANSPORT_OPTIONS = Object.freeze([
  Object.freeze({id:"walk",name:"도보",icon:"🚶",cost:0,description:"천천히 골목을 걸어 이동"}),
  Object.freeze({id:"bus",name:"버스",icon:"🚌",cost:1500,description:"정류장을 따라 편하게 이동"}),
  Object.freeze({id:"subway",name:"지하철",icon:"🚇",cost:1400,description:"역세권을 빠르게 이동"}),
  Object.freeze({id:"taxi",name:"택시",icon:"🚕",cost:8000,description:"원하는 장소 가까이 이동"}),
  Object.freeze({id:"car",name:"고급 자가용",icon:"🚘",cost:0,requiresVehicle:true,description:"보유한 고급 세단으로 이동"})
]);

export function getRoadCells(mapOrId) {
  const map=typeof mapOrId==="string"?WORLD_MAPS[mapOrId]:mapOrId;
  if(!map)return [];
  const cells=new Map();
  const add=(x,y)=>cells.set(`${x},${y}`,Object.freeze({x,y}));
  add(map.start.x,map.start.y);
  map.locations.forEach((location,index)=>{
    let x=map.start.x,y=map.start.y;
    const horizontalFirst=index%2===0;
    const walkX=()=>{while(x!==location.x){x+=Math.sign(location.x-x);add(x,y);}};
    const walkY=()=>{while(y!==location.y){y+=Math.sign(location.y-y);add(x,y);}};
    if(horizontalFirst){walkX();walkY();}else{walkY();walkX();}
  });
  return [...cells.values()];
}

export function isRoadCell(mapOrId,x,y) {
  return getRoadCells(mapOrId).some(cell=>cell.x===x&&cell.y===y);
}

export function getPlayerHomeProfile(archetypeId="balanced") {
  return PLAYER_HOME_PROFILES[archetypeId] ?? PLAYER_HOME_PROFILES.balanced;
}

export function createWorldState(player={}) {
  const home=getPlayerHomeProfile(player.archetypeId);
  const map=WORLD_MAPS[home.districtId];
  return {
    version:1,mode:"home",cityId:"seoul",districtId:home.districtId,
    x:map.start.x,y:map.start.y,unlockedCities:["seoul"],
    discoveredLocations:[map.locations.find(location=>location.category==="home")?.id].filter(Boolean),
    visitHistory:[],travelHistory:[],atlasView:"nationwide",
    transport:player.archetypeId==="wealthy"?"car":"walk",
    transportConfirmed:player.archetypeId==="wealthy",
    ownedVehicleId:player.archetypeId==="wealthy"?"wealthy-sedan":null
  };
}

export function migrateWorldState(value,player={}) {
  const initial=createWorldState(player);
  const source=value&&typeof value==="object"?value:{};
  const merged={...initial,...source};
  if(!WORLD_MAPS[merged.districtId])merged.districtId=initial.districtId;
  const map=WORLD_MAPS[merged.districtId];
  merged.x=clamp(merged.x,0,map.width-1);
  merged.y=clamp(merged.y,0,map.height-1);
  merged.unlockedCities=Array.isArray(merged.unlockedCities)?merged.unlockedCities:["seoul"];
  merged.discoveredLocations=Array.isArray(merged.discoveredLocations)?merged.discoveredLocations:[];
  merged.visitHistory=Array.isArray(merged.visitHistory)?merged.visitHistory:[];
  merged.travelHistory=Array.isArray(merged.travelHistory)?merged.travelHistory:[];
  merged.atlasView=WORLD_ATLAS[merged.atlasView]?merged.atlasView:"nationwide";
  if(source.transportConfirmed==null&&player.archetypeId==="wealthy"&&merged.ownedVehicleId){merged.transport="car";merged.transportConfirmed=true;}
  else merged.transportConfirmed=Boolean(merged.transportConfirmed);
  if(!TRANSPORT_OPTIONS.some(option=>option.id===merged.transport))merged.transport="walk";
  if(merged.transport==="car"&&!merged.ownedVehicleId)merged.transport="walk";
  if(!isRoadCell(map,merged.x,merged.y)){merged.x=map.start.x;merged.y=map.start.y;}
  return merged;
}

export function moveWorldPlayer(world,dx,dy) {
  const map=WORLD_MAPS[world.districtId]??WORLD_MAPS.dongsu;
  const stepX=Math.sign(Number(dx)||0),stepY=stepX?0:Math.sign(Number(dy)||0);
  const nextX=clamp(world.x+stepX,0,map.width-1),nextY=clamp(world.y+stepY,0,map.height-1);
  const moved=isRoadCell(map,nextX,nextY);
  if(moved){world.x=nextX;world.y=nextY;}
  return {x:world.x,y:world.y,moved};
}

export function selectWorldTransport(world,transportId) {
  const option=TRANSPORT_OPTIONS.find(item=>item.id===transportId);
  if(!option)return {ok:false,reason:"지원하지 않는 이동수단입니다."};
  if(option.requiresVehicle&&!world.ownedVehicleId)return {ok:false,reason:"보유한 자동차가 없습니다."};
  world.transport=option.id;world.transportConfirmed=true;
  return {ok:true,option};
}

export function travelToCity(world,cityId,homeDistrictId="dongsu") {
  const districtId=cityId==="busan"?"busan":homeDistrictId;
  const map=WORLD_MAPS[districtId];
  if(!map)return {ok:false,reason:"아직 이동할 수 없는 지역입니다."};
  world.cityId=map.cityId;world.districtId=map.id;world.x=map.start.x;world.y=map.start.y;
  world.travelHistory.push({cityId:map.cityId,districtId:map.id,transport:world.transport});
  if(world.travelHistory.length>40)world.travelHistory.shift();
  return {ok:true,map};
}

export function getNearbyLocation(world,maxDistance=1.15) {
  const map=WORLD_MAPS[world.districtId]??WORLD_MAPS.dongsu;
  return map.locations
    .map(location=>({...location,distance:Math.hypot(location.x-world.x,location.y-world.y)}))
    .filter(location=>location.distance<=maxDistance)
    .sort((a,b)=>a.distance-b.distance)[0]??null;
}

export function discoverLocation(world,locationId,day=1) {
  if(!world.discoveredLocations.includes(locationId))world.discoveredLocations.push(locationId);
  world.visitHistory.push({locationId,day});
  if(world.visitHistory.length>80)world.visitHistory.shift();
  return world;
}

export function validateWorldState(world) {
  return Boolean(world&&world.version===1&&["home","district"].includes(world.mode)&&WORLD_MAPS[world.districtId]
    &&Number.isFinite(world.x)&&Number.isFinite(world.y)&&Array.isArray(world.unlockedCities)
    &&Array.isArray(world.discoveredLocations)&&Array.isArray(world.visitHistory)&&Array.isArray(world.travelHistory)
    &&typeof world.transport==="string"&&typeof world.transportConfirmed==="boolean"&&isRoadCell(world.districtId,world.x,world.y));
}
