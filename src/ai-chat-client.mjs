import { generateContextualReply } from "./conversation-manager.mjs";

export async function requestGirlfriendReply({ endpoint, context, message, fetchImpl = globalThis.fetch }) {
  const fallback = () => ({ ...generateContextualReply(context, message), source:"local" });
  if (!endpoint || typeof fetchImpl !== "function") return fallback();
  try {
    const response = await fetchImpl(endpoint, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ context, message }) });
    if (!response.ok) return fallback();
    const data = await response.json();
    if (typeof data.reply !== "string" || !data.reply.trim()) return fallback();
    const effects = data.effects && typeof data.effects === "object" ? data.effects : {};
    return { text:data.reply.trim(), effects, source:"remote" };
  } catch {
    return fallback();
  }
}
