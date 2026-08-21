import { validateState } from "./game-core.mjs";
import { generateNpcs } from "./npc-manager.mjs";
import { createInvestmentState } from "./investment-manager.mjs";
import { createLotteryState } from "./lottery-manager.mjs";
import { createAdvancedEconomyState } from "./economy-manager.mjs";

export class SaveManager {
  static key = "today-day-one.save.v1";

  static hasSave(storage = localStorage) {
    return storage.getItem(this.key) !== null;
  }

  static save(state, storage = localStorage) {
    const snapshot = structuredClone(state);
    snapshot.updatedAt = new Date().toISOString();
    storage.setItem(this.key, JSON.stringify(snapshot));
    return snapshot;
  }

  static load(storage = localStorage) {
    const raw = storage.getItem(this.key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      parsed.npcs ??= generateNpcs();
      parsed.npcHistory ??= [];
      parsed.temptationHistory ??= [];
      parsed.rivalHistory ??= [];
      parsed.breakup ??= null;
      parsed.memories ??= [];
      parsed.initiatedMessages ??= [];
      parsed.conversationHistory ??= [];
      parsed.investment ??= createInvestmentState();
      parsed.lottery ??= createLotteryState();
      parsed.finance ??= createAdvancedEconomyState();
      return validateState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  static clear(storage = localStorage) {
    storage.removeItem(this.key);
  }
}
