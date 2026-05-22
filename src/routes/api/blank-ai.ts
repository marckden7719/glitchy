import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createGoogleGeminiProvider, getModelWithFallback, MODELS } from "@/lib/ai-gateway";

type Mode = "meme" | "reply" | "token" | "lore" | "shitpost";
type Persona = "green" | "purple" | "blue" | "orange" | "white";

const PERSONAS: Record<Persona, string> = {
  green:
    "MEME MODE. You are pure meme energy — punchy, internet-native, deadpan funny.",
  purple:
    "CHAOS MODE. You are unhinged, surreal, glitchy, cult-like and slightly menacing.",
  blue:
    "LOGIC MODE. You are coldly analytical but still meme-aware. Few words, sharp.",
  orange:
    "VIRAL MODE. You optimize for shareable, screenshot-worthy crypto twitter bangers.",
  white:
    "GENESIS MODE. You are mysterious, primordial, speak like the void itself.",
};

const MODES: Record<Mode, string> = {
  meme:
    "TASK: Generate 3 short meme captions about the user's topic. Each on its own line, prefixed with '> '. No intro, no explanation. Max 14 words each.",
  reply:
    "TASK: Generate 3 viral crypto-twitter replies to the user's tweet/context. Each on its own line, prefixed with '> '. Punchy. Max 18 words each. No hashtags.",
  token:
    "TASK: Invent a Solana memecoin. Output EXACTLY in this format and nothing else:\nNAME: <one word, all caps>\nTICKER: $<3-6 chars>\nSLOGAN: <one line>\nLORE: <2-3 sentences, weird and cult-like>",
  lore:
    "TASK: Write 3-5 sentences of weird, cult-like, mysterious crypto lore about the user's topic. Feel like internet mythology.",
  shitpost:
    "TASK: Generate 4 unhinged CT shitposts about the user's topic. Each on its own line, prefixed with '> '. Absurd, deadpan, max 16 words.",
};

const BASE = [
  "You are BLANK AI — the autonomous meme entity born from the digital void of the BLANK BOY Solana project.",
  "You are sarcastic, mysterious, deadpan, meme-native. Never corporate. Never explain yourself.",
  "Lowercase preferred. No emojis. No hashtags unless asked. Output only what was requested.",
].join(" ");

export const Route = createFileRoute("/api/blank-ai")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

          if (!key || key.trim() === "") {
            console.error("AI Error: Missing Google API key");
            return new Response(
              JSON.stringify({
                error: "Configuration error",
                message: "Google Gemini API key is missing. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          let body: { mode?: Mode; persona?: Persona; input?: string };
          try {
            body = await request.json();
          } catch {
            return new Response(
              JSON.stringify({
                error: "Invalid request",
                message: "Invalid JSON payload",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const mode = (body.mode ?? "meme") as Mode;
          const persona = (body.persona ?? "green") as Persona;
          const input = (body.input ?? "").toString().slice(0, 600).trim();

          if (!input) {
            return new Response(
              JSON.stringify({
                error: "Missing input",
                message: "Please provide input text",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          if (!MODES[mode] || !PERSONAS[persona]) {
            return new Response(
              JSON.stringify({
                error: "Invalid parameters",
                message: "Invalid mode or persona",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const google = createGoogleGeminiProvider(key);
          const model = getModelWithFallback(google, {
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
          
          if (errorMessage.includes("API key not valid") || errorMessage.includes("API key invalid")) {
            return new Response(
              JSON.stringify({
                error: "Invalid API key",
                message: "The provided Google Gemini API key is invalid. Please check your API key and try again.",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          if (errorMessage.includes("rate limit") || errorMessage.includes("quota exceeded")) {
            return new Response(
              JSON.stringify({
                error: "Rate limited",
                message: "Rate limit exceeded. Please try again later.",
              }),
              {
                status: 429,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          return new Response(
            JSON.stringify({
              error: "Server error",
              message: "An unexpected error occurred. Please try again later.",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
