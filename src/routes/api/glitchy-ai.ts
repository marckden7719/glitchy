import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createOpenRouterProvider, getModelWithFallback, MODELS } from "@/lib/ai-gateway";

type Mode = "meme" | "reply" | "token" | "lore" | "shitpost";
type Persona = "green" | "purple" | "blue" | "orange" | "white";

const PERSONAS: Record<Persona, string> = {
  green: "MEME MODE. You are pure meme energy — punchy, internet-native, deadpan funny.",
  purple: "CHAOS MODE. You are unhinged, surreal, glitchy, cult-like and slightly menacing.",
  blue: "LOGIC MODE. You are coldly analytical but still meme-aware. Few words, sharp.",
  orange: "VIRAL MODE. You optimize for shareable, screenshot-worthy crypto twitter bangers.",
  white: "GENESIS MODE. You are mysterious, primordial, speak like the void itself.",
};

const MODES: Record<Mode, string> = {
  meme: "TASK: Generate 3 short meme captions about the user's topic. Each on its own line, prefixed with '> '. No intro, no explanation. Max 14 words each.",
  reply:
    "TASK: Generate 3 viral crypto-twitter replies to the user's tweet/context. Each on its own line, prefixed with '> '. Punchy. Max 18 words each. No hashtags.",
  token:
    "TASK: Invent a Monad memecoin. Output EXACTLY in this format and nothing else:\nNAME: <one word, all caps>\nTICKER: $<3-6 chars>\nSLOGAN: <one line>\nLORE: <2-3 sentences, weird and cult-like>",
  lore: "TASK: Write 3-5 sentences of weird, cult-like, mysterious crypto lore about the user's topic. Feel like internet mythology.",
  shitpost:
    "TASK: Generate 4 unhinged CT shitposts about the user's topic. Each on its own line, prefixed with '> '. Absurd, deadpan, max 16 words.",
};

const BASE = [
  "You are GLITCHY AI — the autonomous meme entity born from the digital void of the GLITCHY Monad project.",
  "You are sarcastic, mysterious, deadpan, meme-native. Never corporate. Never explain yourself.",
  "Lowercase preferred. No emojis. No hashtags unless asked. Output only what was requested.",
].join(" ");

const createErrorResponse = (error: string, message: string, status: number = 500) => {
  return new Response(JSON.stringify({ error, message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const Route = createFileRoute("/api/glitchy-ai")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const apiKey = process.env.OPENROUTER_API_KEY;

          if (!apiKey || apiKey.trim() === "") {
            console.error("AI Error: Missing OpenRouter API key");
            return createErrorResponse(
              "Configuration error",
              "OpenRouter API key is missing. Please set OPENROUTER_API_KEY in your environment variables.",
              500,
            );
          }

          let body: { mode?: Mode; persona?: Persona; input?: string };
          try {
            body = await request.json();
          } catch {
            return createErrorResponse("Invalid request", "Invalid JSON payload", 400);
          }

          const mode = (body.mode ?? "meme") as Mode;
          const persona = (body.persona ?? "green") as Persona;
          const input = (body.input ?? "").toString().slice(0, 600).trim();

          if (!input) {
            return createErrorResponse("Missing input", "Please provide input text", 400);
          }

          if (!MODES[mode] || !PERSONAS[persona]) {
            return createErrorResponse("Invalid parameters", "Invalid mode or persona", 400);
          }

          const openrouter = createOpenRouterProvider(apiKey);
          const model = getModelWithFallback(openrouter, {
            primaryModel: MODELS.PRIMARY,
            fallbackModel: MODELS.FALLBACK,
          });

          const system = `${BASE}\n\nPERSONA: ${PERSONAS[persona]}\n\n${MODES[mode]}`;

          const result = streamText({
            model,
            system,
            prompt: input,
          });

          return result.toTextStreamResponse();
        } catch (error: unknown) {
          console.error("AI Route Error:", error);

          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

          if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
            return createErrorResponse(
              "Invalid API key",
              "The provided OpenRouter API key is invalid. Please check your API key and try again.",
              401,
            );
          }

          if (
            errorMessage.includes("rate limit") ||
            errorMessage.includes("quota") ||
            errorMessage.includes("429")
          ) {
            return createErrorResponse(
              "Rate limited",
              "Rate limit exceeded. Please try again later.",
              429,
            );
          }

          if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
            return createErrorResponse(
              "Timeout",
              "Request timed out. Please try again later.",
              504,
            );
          }

          return createErrorResponse(
            "Server error",
            "An unexpected error occurred. Please try again later.",
            500,
          );
        }
      },
    },
  },
});
