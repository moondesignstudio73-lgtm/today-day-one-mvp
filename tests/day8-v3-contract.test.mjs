import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const contract=readFileSync(new URL("../docs/day8/DAY8_V3_CHAPTER_CONTRACT.md",import.meta.url),"utf8");

for(const marker of [
  "m30-day8-jihoon-present-afternoon-v3","m30-day8-independent-errand","day8ScenarioVersion=\"V3\"",
  "V1_LEGACY","S15","live house, quiet cafe, or home/rest","day9ClothingColorInvitationPending",
  "Private cut client work and public credited work are separate artifacts","DAY 9 work remains blocked"
])assert.ok(contract.includes(marker),marker);

for(let scene=1;scene<=24;scene++)assert.match(contract,new RegExp(`\\b${scene}\\. S${String(scene).padStart(2,"0")}\\b`),`S${scene}`);
for(let choice=1;choice<=10;choice++)assert.ok(contract.includes(`- C${choice} `+"`day8V3"),`choice ${choice}`);
for(const ledger of ["KNOWS","BELIEVES","SUSPECTS","DOES_NOT_KNOW","HIDES","LIES_ABOUT","MISREMEMBERS","WANTS","FEARS"])assert.match(contract,new RegExp(ledger,"g"),ledger);
for(const forbidden of ["accident culprit is","fake Haeun is","vehicle was manipulated by"])assert.ok(!contract.toLowerCase().includes(forbidden),forbidden);

console.log("✓ DAY 8 V3 챕터 계약·Voice Profile·지식 장부·24 Scene·10선택·레거시 이행 계약 PASS");
