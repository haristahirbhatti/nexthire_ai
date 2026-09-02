import OpenAI from "openai";

// Lazy singleton — only created when first used, so missing key doesn't crash on startup
let _client = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

// Default export for convenience (may be null if no key set)
export default getOpenAIClient;
