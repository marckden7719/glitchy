import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

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
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        let body: { mode?: Mode; persona?: Persona; input?: string };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const mode = (body.mode ?? "meme") as Mode;
        const persona = (body.persona ?? "green") as Persona;
        const input = (body.input ?? "").toString().slice(0, 600).trim();
        if (!input) return new Response("Empty input", { status: 400 });
        if (!MODES[mode] || !PERSONAS[persona])
          return new Response("Invalid mode/persona", { status: 400 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const system = `${BASE}\n\nPERSONA: ${PERSONAS[persona]}\n\n${MODES[mode]}`;

        const result = streamText({
          model,
          system,
          prompt: input,
        });

        return result.toTextStreamResponse();
      },
    },
  },
});