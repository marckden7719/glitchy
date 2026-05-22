import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const MODELS = {
  PRIMARY: "gemini-2.0-flash",
  FALLBACK: "gemini-1.5-flash",
} as const;

export type ModelKey = keyof typeof MODELS;

export const createGoogleGeminiProvider = (apiKey: string) => {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("Google Gemini API key is required");
  }

  return createGoogleGenerativeAI({
    apiKey: apiKey.trim(),
  });
};

export const getModelWithFallback = (
  provider: ReturnType<typeof createGoogleGeminiProvider>,
  options: {
    primaryModel?: string;
    fallbackModel?: string;
  } = {}
) => {
  const primaryModel = options.primaryModel || MODELS.PRIMARY;
  const fallbackModel = options.fallbackModel || MODELS.FALLBACK;

  try {
    return provider(primaryModel);
  } catch (error) {
    console.warn(`Failed to load primary model (${primaryModel}), falling back to ${fallbackModel}`, error);
    return provider(fallbackModel);
  }
};
