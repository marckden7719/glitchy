import { createOpenAI } from "@ai-sdk/openai";

export const MODELS = {
  PRIMARY: "deepseek/deepseek-chat-v3-0324:free",
  FALLBACK: "meta-llama/llama-3.3-70b-instruct:free",
} as const;

export type ModelKey = keyof typeof MODELS;

export const createOpenRouterProvider = (apiKey: string) => {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("OpenRouter API key is required");
  }

  return createOpenAI({
    apiKey: apiKey.trim(),
    baseURL: "https://openrouter.ai/api/v1",
  });
};

export const getModelWithFallback = (
  provider: ReturnType<typeof createOpenRouterProvider>,
  options: {
    primaryModel?: string;
    fallbackModel?: string;
  } = {},
) => {
  const primaryModel = options.primaryModel || MODELS.PRIMARY;
  const fallbackModel = options.fallbackModel || MODELS.FALLBACK;

  try {
    return provider(primaryModel);
  } catch (error) {
    console.warn(
      `Failed to load primary model (${primaryModel}), falling back to ${fallbackModel}`,
      error,
    );
    return provider(fallbackModel);
  }
};
