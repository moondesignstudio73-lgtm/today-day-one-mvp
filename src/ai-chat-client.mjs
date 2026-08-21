import { generateContextualReply } from "./conversation-manager.mjs";

const EFFECT_KEYS = new Set(["affection","trust","excitement","attachment","conflict","relationshipStress","stress","health","energy","fatigue","charm","fashion","confidence","work","social"]);

export function sanitizeRemoteEffects(effects) {
  if (!effects || typeof effects !== "object" || Array.isArray(effects)) return {};
  return Object.fromEntries(Object.entries(effects)
    .filter(([key,value]) => EFFECT_KEYS.has(key) && Number.isFinite(value))
    .map(([key,value]) => [key,Math.max(-100,Math.min(100,Math.round(value)))]));
}

export async function requestGirlfriendReply({ endpoint, context, message, fetchImpl = globalThis.fetch }) {
  const fallback = () => ({ ...generateContextualReply(context, message), source:"local" });
  if (!endpoint || typeof fetchImpl !== "function") return fallback();
  try {
    const response = await fetchImpl(endpoint, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ context, message }) });
    if (!response.ok) return fallback();
    const data = await response.json();
    if (typeof data.reply !== "string" || !data.reply.trim()) return fallback();
    const effects = sanitizeRemoteEffects(data.effects);
    return { text:data.reply.trim(), effects, source:"remote" };
  } catch {
    return fallback();
  }
}
