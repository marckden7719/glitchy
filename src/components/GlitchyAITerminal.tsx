import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bbGreen from "@/assets/bb-green.png";
import bbPurple from "@/assets/bb-purple.png";
import bbBlue from "@/assets/bb-blue.png";
import bbOrange from "@/assets/bb-orange.png";
import bbWhite from "@/assets/bb-white.png";

type Mode = "meme" | "reply" | "token" | "lore" | "shitpost";
type Persona = "green" | "purple" | "blue" | "orange" | "white";

const PERSONAS: {
  key: Persona;
  label: string;
  sub: string;
  color: string;
  img: string;
}[] = [
  { key: "green", label: "MEME", sub: "default chaos", color: "#C6FF00", img: bbGreen },
  { key: "purple", label: "CHAOS", sub: "unhinged void", color: "#8B3DFF", img: bbPurple },
  { key: "blue", label: "LOGIC", sub: "cold ops", color: "#00A3FF", img: bbBlue },
  { key: "orange", label: "VIRAL", sub: "ct optimizer", color: "#FF9D00", img: bbOrange },
  { key: "white", label: "GENESIS", sub: "primordial", color: "#FFFFFF", img: bbWhite },
];

const MODES: { key: Mode; label: string; placeholder: string; example: string }[] = [
  {
    key: "meme",
    label: "MEME GEN",
    placeholder: "monad meme about fomo…",
    example: "degens watching the chart at 4am",
  },
  {
    key: "reply",
    label: "CT REPLY",
    placeholder: "paste a tweet or topic…",
    example: "someone shilling a new L2",
  },
  {
    key: "token",
    label: "TOKEN GEN",
    placeholder: "narrative or vibe…",
    example: "abandoned wallet dust cult",
  },
  { key: "lore", label: "LORE", placeholder: "lore subject…", example: "the origin of glitchy" },
  { key: "shitpost", label: "SHITPOST", placeholder: "topic…", example: "utility tokens" },
];

function Status({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/60">
      <span
        className="h-2 w-2 rounded-full animate-flicker"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      <span>{label}:</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}

export default function GlitchyAITerminal() {
  const [persona, setPersona] = useState<Persona>("green");
  const [mode, setMode] = useState<Mode>("meme");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activePersona = PERSONAS.find((p) => p.key === persona)!;
  const activeMode = MODES.find((m) => m.key === mode)!;

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [output]);

  async function run(promptOverride?: string) {
    setError("AI terminal is temporarily disabled. Check back soon!");
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section id="glitchy-ai" className="relative mx-auto w-full max-w-6xl px-6 py-28">
      <Pixels color={activePersona.color} />

      {/* Header */}
      <div className="relative z-10 mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-green)] animate-flicker" />
          GLITCHY AI // v0.void
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400 border border-orange-500/30">
            BETA
          </span>
        </div>
        <h2 className="font-display text-4xl leading-none text-white text-glow-white md:text-6xl">
          TALK TO THE <span className="text-neon-green">VOID</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 md:text-base">
          glitchy ai assistant transforms nothing into culture. memes, lore, tickers, shitposts —
          summoned from the abyss in real time.
        </p>
      </div>

      {/* Terminal */}
      <div
        className="relative z-10 overflow-hidden rounded-2xl border border-white/10 glass noise"
        style={{
          boxShadow: `0 0 1px ${activePersona.color}, 0 0 40px -10px ${activePersona.color}66, inset 0 0 80px -40px ${activePersona.color}44`,
        }}
      >
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
              glitchy_ai // {activePersona.label.toLowerCase()}@void:~$
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Status label="void" value="online" color="#C6FF00" />
            <Status label="engine" value="active" color={activePersona.color} />
            <Status label="chaos" value={loading ? "rising" : "stable"} color="#8B3DFF" />
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[220px_1fr]">
          {/* Persona rail */}
          <div className="border-b border-white/10 bg-black/30 p-3 md:border-b-0 md:border-r">
            <div className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              persona
            </div>
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible scrollbar-hide">
              {PERSONAS.map((p) => {
                const active = p.key === persona;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPersona(p.key)}
                    className={`group flex shrink-0 items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition ${
                      active ? "border-white/30 bg-white/5" : "border-white/5 hover:border-white/15"
                    }`}
                    style={active ? { boxShadow: `0 0 18px -4px ${p.color}88` } : undefined}
                  >
                    <img
                      src={p.img}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                      style={active ? { boxShadow: `0 0 14px ${p.color}` } : undefined}
                    />
                    <div className="leading-tight">
                      <div className="font-display text-xs" style={{ color: p.color }}>
                        {p.label}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">
                        {p.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main column */}
          <div className="relative">
            {/* scanline */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)",
              }}
            />

            {/* Mode tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-white/10 bg-black/20 p-2">
              {MODES.map((m) => {
                const active = m.key === mode;
                return (
                  <button
                    key={m.key}
                    onClick={() => {
                      setMode(m.key);
                      setOutput("");
                      setError(null);
                    }}
                    className={`rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition ${
                      active ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                    }`}
                    style={
                      active ? { boxShadow: `inset 0 -2px 0 0 ${activePersona.color}` } : undefined
                    }
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Output */}
            <div
              ref={outRef}
              className="relative max-h-[340px] min-h-[220px] overflow-y-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-white/90"
            >
              <AnimatePresence mode="wait">
                {!output && !loading && !error && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/40"
                  >
                    <div className="mb-2 text-white/60">
                      &gt; glitchy_ai initialized. persona:{" "}
                      <span style={{ color: activePersona.color }}>{activePersona.label}</span>.
                      mode: {activeMode.label}.
                    </div>
                    <div className="mb-1">&gt; awaiting input from the void_</div>
                    <button
                      onClick={() => {
                        setInput(activeMode.example);
                        run(activeMode.example);
                      }}
                      className="mt-3 text-left text-white/50 underline-offset-4 hover:text-white hover:underline"
                    >
                      &gt; try: "{activeMode.example}"
                    </button>
                  </motion.div>
                )}
                {loading && !output && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/60"
                  >
                    <span className="animate-flicker">&gt; transmitting from the abyss</span>
                    <span className="ml-1 animate-pulse">▮</span>
                  </motion.div>
                )}
                {output && (
                  <motion.pre
                    key="out"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="whitespace-pre-wrap break-words font-mono"
                  >
                    {output}
                    {loading && <span className="ml-0.5 animate-pulse">▮</span>}
                  </motion.pre>
                )}
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400"
                  >
                    &gt; ERROR // {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div className="border-t border-white/10 bg-black/40 p-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs" style={{ color: activePersona.color }}>
                  &gt;
                </span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      run();
                    }
                  }}
                  placeholder={activeMode.placeholder}
                  className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
                  maxLength={500}
                />
                <button
                  onClick={copy}
                  disabled={!output}
                  className="rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:border-white/30 hover:text-white disabled:opacity-30"
                >
                  {copied ? "copied" : "copy"}
                </button>
                <button
                  onClick={() => run()}
                  disabled={loading || !input.trim()}
                  className="rounded-md px-3 py-1.5 font-display text-[11px] tracking-widest text-black transition disabled:opacity-40"
                  style={{
                    background: activePersona.color,
                    boxShadow: `0 0 18px -2px ${activePersona.color}aa`,
                  }}
                >
                  {loading ? "..." : output ? "regen" : "summon"}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                  {activeMode.label} // {activePersona.label} // press enter to summon
                </div>
                <div className="font-mono text-[10px] text-white/30">{input.length}/500</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick prompt chips */}
      <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-2">
        {[
          "another rug pull",
          "ai meme coin season",
          "wif vs popcat",
          "the abyss watches",
          "exit liquidity",
        ].map((p) => (
          <button
            key={p}
            onClick={() => {
              setInput(p);
              run(p);
            }}
            className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white/60 transition hover:border-white/30 hover:text-white"
          >
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}

function Pixels({ color }: { color: string }) {
  const [isClient, setIsClient] = useState(false);
  const [pixels, setPixels] = useState<
    Array<{ size: number; left: number; top: number; delay: number; dur: number }>
  >([]);

  useEffect(() => {
    setIsClient(true);
    const newPixels = Array.from({ length: 18 }).map(() => ({
      size: 3 + Math.random() * 6,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      dur: 4 + Math.random() * 6,
    }));
    setPixels(newPixels);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pixels.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: color,
            opacity: 0.35,
            animation: `pixel-drift ${p.dur}s ease-in ${p.delay}s infinite`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}
    </div>
  );
}
