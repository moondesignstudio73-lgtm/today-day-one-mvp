import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ORDINARY_READING_CPM = 340;
export const TARGET_MINUTES = { min: 20, max: 25 };

const scriptPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs/day4/DAY4_SCENARIO_REBUILD_V3.md");
const source = fs.readFileSync(scriptPath, "utf8");
const playable = source.slice(source.indexOf("# SCENE 01."), source.indexOf("# V3 구현 연결 부록"));
const lines = playable.split(/\r?\n/);

const cleanLine = line => line
  .replace(/^>\s?/, "")
  .replace(/[*_`]/g, "")
  .replace(/^\s*[①②③]\s*/, "")
  .trim();

const isPlayableText = line => {
  const value = line.trim();
  if (!value || /^#{1,4}\s/.test(value) || /^---+$/.test(value)) return false;
  if (/^>/.test(value) || /^-\s/.test(value)) return false;
  if (/^\[[^\]]+\]$/.test(value)) return false;
  if (/^\*\*[^*]+\*\*$/.test(value)) return false;
  return cleanLine(value).length > 0;
};

const metrics = block => {
  const textSteps = block.filter(isPlayableText).map(cleanLine);
  const characters = textSteps.reduce((total, text) => total + text.length, 0);
  const readingMs = textSteps.reduce(
    (total, text) => total + Math.max(1400, (text.length / ORDINARY_READING_CPM) * 60000 + 500),
    0
  );
  return { textSteps: textSteps.length, characters, readingMs };
};

const add = (...values) => values.reduce((total, value) => ({
  textSteps: total.textSteps + value.textSteps,
  characters: total.characters + value.characters,
  readingMs: total.readingMs + value.readingMs
}), { textSteps: 0, characters: 0, readingMs: 0 });

const choices = [];
const common = [];
for (let index = 0; index < lines.length;) {
  if (!/^# \[선택지/.test(lines[index])) {
    common.push(lines[index++]);
    continue;
  }
  const choiceLines = [];
  index += 1;
  while (index < lines.length && !/^# SCENE/.test(lines[index])) choiceLines.push(lines[index++]);
  const optionStarts = choiceLines
    .map((line, optionIndex) => /^### [①②③]/.test(line) ? optionIndex : -1)
    .filter(optionIndex => optionIndex >= 0);
  const options = optionStarts.map((start, optionIndex) => {
    const end = optionStarts[optionIndex + 1] ?? choiceLines.length;
    const option = choiceLines.slice(start + 1, end);
    const nestedStarts = option
      .map((line, nestedIndex) => /^#### [ABC]\./.test(line) ? nestedIndex : -1)
      .filter(nestedIndex => nestedIndex >= 0);
    if (!nestedStarts.length) return [metrics(option)];
    const prefix = metrics(option.slice(0, nestedStarts[0]));
    return nestedStarts.map((nestedStart, nestedIndex) => {
      const nestedEnd = nestedStarts[nestedIndex + 1] ?? option.length;
      return add(prefix, metrics(option.slice(nestedStart + 1, nestedEnd)));
    });
  }).flat();
  choices.push(options);
}

const commonMetrics = metrics(common);
const shortest = add(commonMetrics, ...choices.map(options => options.reduce((best, option) => option.readingMs < best.readingMs ? option : best)));
const longest = add(commonMetrics, ...choices.map(options => options.reduce((best, option) => option.readingMs > best.readingMs ? option : best)));
const presentationMs = 16 * 1080;
const decisionMs = 9 * 5000;
const mandatoryInteractionMs = 120000;
const vnPageAdvanceMs = value => value.textSteps * 250;
const finish = value => ({
  ...value,
  activeReadingMinutes: Number(((value.readingMs + presentationMs + decisionMs) / 60000).toFixed(2)),
  playableMinutes: Number(((value.readingMs + presentationMs + decisionMs + mandatoryInteractionMs + vnPageAdvanceMs(value)) / 60000).toFixed(2))
});

const result = {
  model: `${ORDINARY_READING_CPM} Korean characters/min; 0.5s base dialogue advance allowance; 1.4s minimum page; 5s/choice; 1.08s/scene transition; 0.25s VN page presentation; 120s mandatory object/phone/map/order/payment/system interactions`,
  targetMinutes: TARGET_MINUTES,
  choices: choices.length,
  shortest: finish(shortest),
  longest: finish(longest)
};

console.log(JSON.stringify(result, null, 2));
