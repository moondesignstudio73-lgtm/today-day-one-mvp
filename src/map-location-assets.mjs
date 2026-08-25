const BASE = "assets/backgrounds/map-locations";

export const MAP_LOCATION_ASSETS = Object.freeze({
  "dongsu-home":`${BASE}/001_dongsu-home.png`, "gimbap-village":`${BASE}/002_gimbap-village.png`, "sundae-house":`${BASE}/003_sundae-house.png`,
  "small-cafe":`${BASE}/004_small-cafe.png`, "alley-pub":`${BASE}/005_alley-pub.png`, "ramen-shop":`${BASE}/006_ramen-shop.png`,
  "china-diner":`${BASE}/007_china-diner.png`, "fitness-food":`${BASE}/008_fitness-food.png`, "dongsu-station":`${BASE}/009_dongsu-station.png`,
  "geumsu-home":`${BASE}/010_geumsu-home.png`, "river-cafe":`${BASE}/011_river-cafe.png`, "fine-dining":`${BASE}/012_fine-dining.png`,
  "premium-sushi":`${BASE}/013_premium-sushi.png`, department:`${BASE}/014_department.png`, rooftop:`${BASE}/015_rooftop.png`,
  gallery:`${BASE}/016_gallery.png`, "geumsu-station":`${BASE}/017_geumsu-station.png`, "yeonhui-station":`${BASE}/018_yeonhui-station.png`,
  "girlfriend-home":`${BASE}/019_girlfriend-home.png`, "flower-cafe":`${BASE}/020_flower-cafe.png`, "yeonhui-bakery":`${BASE}/021_yeonhui-bakery.png`,
  "memory-park":`${BASE}/022_memory-park.png`, "vinyl-store":`${BASE}/023_vinyl-store.png`, "rose-bistro":`${BASE}/024_rose-bistro.png`,
  "hongdae-station":`${BASE}/025_hongdae-station.png`, "neon-club":`${BASE}/026_neon-club.png`, "live-house":`${BASE}/027_live-house.png`,
  "rooftop-pub":`${BASE}/028_rooftop-pub.png`, "street-fashion":`${BASE}/029_street-fashion.png`, "night-food":`${BASE}/030_night-food.png`,
  "seongsu-station":`${BASE}/031_seongsu-station.png`, "prime-gym":`${BASE}/032_prime-gym.png`, "boxing-studio":`${BASE}/033_boxing-studio.png`,
  "climbing-lab":`${BASE}/034_climbing-lab.png`, "running-park":`${BASE}/035_running-park.png`, "protein-cafe":`${BASE}/036_protein-cafe.png`,
  "jamsil-station":`${BASE}/037_jamsil-station.png`, "dream-castle":`${BASE}/038_dream-castle.png`, "roller-coaster":`${BASE}/039_roller-coaster.png`,
  "ferris-wheel":`${BASE}/040_ferris-wheel.png`, carousel:`${BASE}/041_carousel.png`, "lake-promenade":`${BASE}/042_lake-promenade.png`,
  "myeongdong-station":`${BASE}/043_myeongdong-station.png`, "central-department":`${BASE}/044_central-department.png`, "fashion-mall":`${BASE}/045_fashion-mall.png`,
  "beauty-street":`${BASE}/046_beauty-street.png`, "city-cinema":`${BASE}/047_city-cinema.png`, "department-food":`${BASE}/048_department-food.png`,
  "namsan-station":`${BASE}/049_namsan-station.png`, "k-tower":`${BASE}/050_k-tower.png`, "sky-observatory":`${BASE}/051_sky-observatory.png`,
  "tower-restaurant":`${BASE}/052_tower-restaurant.png`, "love-terrace":`${BASE}/053_love-terrace.png`, "mountain-trail":`${BASE}/054_mountain-trail.png`,
  "busan-station":`${BASE}/055_busan-station.png`, "haeundae-beach":`${BASE}/056_haeundae-beach.png`, "marine-cafe":`${BASE}/057_marine-cafe.png`,
  "milmyun-house":`${BASE}/058_milmyun-house.png`, gwangalli:`${BASE}/059_gwangalli.png`, jagalchi:`${BASE}/060_jagalchi.png`, seomyeon:`${BASE}/061_seomyeon.png`
});

export function getMapLocationAsset(locationId) {
  return MAP_LOCATION_ASSETS[locationId] ?? null;
}

export function validateMapLocationAssets(locationIds) {
  return Array.isArray(locationIds) && locationIds.length === Object.keys(MAP_LOCATION_ASSETS).length && locationIds.every(id => typeof MAP_LOCATION_ASSETS[id] === "string");
}
