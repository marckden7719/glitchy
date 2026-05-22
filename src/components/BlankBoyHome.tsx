import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BlankAITerminal from "@/components/BlankAITerminal";
import banner from "@/assets/banner.jpeg";
import bbGreen from "@/assets/bb-green.png";
import bbPurple from "@/assets/bb-purple.png";
import bbOrange from "@/assets/bb-orange.png";
import bbBlue from "@/assets/bb-blue.png";
import bbWhite from "@/assets/bb-white.png";

const characters = [
  { src: bbGreen, name: "VOID MODE", color: "#C6FF00", glow: "glow-green" },
  { src: bbPurple, name: "GENESIS", color: "#8B3DFF", glow: "glow-purple" },
  { src: bbBlue, name: "SOL SHIFT", color: "#00A3FF", glow: "glow-blue" },
  { src: bbOrange, name: "HYPE CORE", color: "#FF9D00", glow: "glow-orange" },
  { src: bbWhite, name: "NULL FORM", color: "#FFFFFF", glow: "" },
];

function Pixels({ count = 30, color = "#C6FF00" }: { count?: number; color?: string }) {
  const [isClient, setIsClient] = useState(false);
  const [pixels, setPixels] = useState<Array<{ size: number; left: number; top: number; delay: number; dur: number }>>([]);

  useEffect(() => {
    setIsClient(true);
    const newPixels = Array.from({ length: count }).map(() => ({
      size: 4 + Math.random() * 8,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      dur: 4 + Math.random() * 6,
    }));
    setPixels(newPixels);
  }, [count]);

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
            opacity: 0.5,
            animation: `pixel-drift ${p.dur}s ease-in ${p.delay}s infinite`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

function Loader({ done }: { done: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.7 }}
      style={{ pointerEvents: done ? "none" : "auto" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
    >
      <motion.img
        src={bbBlue}
        alt="BlankBoy"
        className="h-40 w-40 object-contain animate-flicker"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      />
      <p className="mt-6 font-display text-sm tracking-[0.4em] text-neon-green text-glow-green">
        EMERGING FROM THE VOID…
      </p>
    </motion.div>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-50 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: pos.x,
        top: pos.y,
        background:
          "radial-gradient(circle, rgba(198,255,0,0.12), rgba(139,61,255,0.06) 40%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full glass px-4 py-2.5 md:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={bbBlue} alt="BLANK BOY" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-sm tracking-widest text-white">BLANK BOY</span>
        </a>
        <nav className="hidden gap-7 text-xs uppercase tracking-[0.2em] text-white/70 md:flex">
          <a href="#about" className="hover:text-neon-green">About</a>
          <a href="#blank-ai" className="hover:text-neon-green">Blank AI</a>
          <a href="#gallery" className="hover:text-neon-green">Gallery</a>
          <a href="#tokenomics" className="hover:text-neon-green">Tokenomics</a>
          <a href="#roadmap" className="hover:text-neon-green">Roadmap</a>
          <a href="#community" className="hover:text-neon-green">Community</a>
        </nav>
        <a
          href="#community"
          className="rounded-full bg-[var(--neon-green)] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-black hover:opacity-90"
        >
          Buy $BLANKBOY
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden pt-28">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 noise" />
      <Pixels count={40} color="#C6FF00" />
      <Pixels count={20} color="#8B3DFF" />

      {/* rotating neon glow */}
      <div className="pointer-events-none absolute left-1/2 top-[55%] -z-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-full w-full animate-spin-slow rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(198,255,0,0.18) 60deg, transparent 120deg, rgba(139,61,255,0.18) 200deg, transparent 260deg, rgba(0,163,255,0.18) 320deg, transparent 360deg)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <motion.div style={{ y }} className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-10 text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={banner}
          alt="BLANK BOY"
          className="w-full max-w-3xl mix-blend-screen"
          style={{ filter: "drop-shadow(0 0 40px rgba(198,255,0,0.35))" }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display mt-2 text-6xl leading-none tracking-tight md:text-8xl"
        >
          <span className="text-white text-glow-white animate-glitch inline-block">FILL</span>{" "}
          <span className="text-neon-green text-glow-green inline-block">THE VOID.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base"
        >
          BlankBoy, the enigmatic icon from Blank.Build, emerges from the digital void —
          inviting creators, degens, and dreamers to write their own story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#community"
            className="group relative overflow-hidden rounded-full bg-[var(--neon-green)] px-8 py-4 font-display text-sm tracking-widest text-black glow-green transition hover:scale-105"
          >
            BUY $BLANKBOY
          </a>
          <a
            href="https://t.me/BlankBoyOnSol"
            target="_blank"
            rel="noreferrer"
            className="rounded-full glass px-8 py-4 font-display text-sm tracking-widest text-white transition hover:scale-105 hover:text-neon-green"
          >
            JOIN COMMUNITY
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-20 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/40"
        >
          <span>Scroll</span>
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-neon-green to-transparent" />
        </motion.div>
      </motion.div>

      {/* floating mascot */}
      <motion.img
        src={bbBlue}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-10 hidden h-48 animate-float md:block"
        style={{ filter: "drop-shadow(0 0 30px rgba(0,163,255,0.5))" }}
      />
      <motion.img
        src={bbPurple}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-20 hidden h-48 animate-float md:block"
        style={{ animationDelay: "1.5s", filter: "drop-shadow(0 0 30px rgba(139,61,255,0.5))" }}
      />
    </section>
  );
}

function Section({ id, children, className = "" }: any) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-6 py-28 ${className}`}>
      {children}
    </section>
  );
}

function About() {
  const lines = [
    "BlankBoy stands alone in the endless void.",
    "Expressionless. Mysterious. Minimal.",
    "A blank canvas for internet culture itself.",
    "Nobody knows where he came from.",
    "Nobody knows what he's thinking.",
    "And maybe that's the point.",
    "In a world overloaded with noise,",
    "BlankBoy proves that less is more.",
  ];
  return (
    <Section id="about">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-10 -z-10 rounded-full bg-white/5 blur-3xl" />
          <Pixels count={15} color="#FFFFFF" />
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            src={bbWhite}
            alt="BlankBoy white hoodie"
            className="mx-auto h-[460px] animate-float object-contain"
            style={{ filter: "drop-shadow(0 0 40px rgba(255,255,255,0.3))" }}
          />
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.5em] text-neon-green">// 01 · ORIGIN</p>
          <h2 className="font-display mt-3 text-5xl leading-none text-white md:text-6xl">
            WHO IS <span className="text-neon-green text-glow-green">BLANKBOY</span>?
          </h2>
          <div className="mt-8 space-y-3">
            {lines.map((l, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-lg text-white/75"
              >
                {l}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Gallery() {
  return (
    <Section id="gallery">
      <div className="mb-16 text-center">
        <p className="font-display text-xs tracking-[0.5em] text-neon-purple">// 02 · FORMS</p>
        <h2 className="font-display mt-3 text-5xl text-white md:text-6xl">CHARACTER VAULT</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Five forms. One void. Choose your BlankBoy.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ rotateX: 6, rotateY: -6, scale: 1.04 }}
            style={{ transformStyle: "preserve-3d" }}
            className={`group relative overflow-hidden rounded-3xl glass p-6 transition-shadow hover:${c.glow}`}
          >
            <Pixels count={10} color={c.color} />
            <div className="relative flex h-72 items-center justify-center">
              <img
                src={c.src}
                alt={c.name}
                className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
                style={{ filter: `drop-shadow(0 0 30px ${c.color}88)` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">FORM #00{i + 1}</p>
                <p className="font-display text-2xl text-white" style={{ textShadow: `0 0 18px ${c.color}99` }}>
                  {c.name}
                </p>
              </div>
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: c.color, boxShadow: `0 0 12px ${c.color}` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Tokenomics() {
  const stats = [
    { k: "Total Supply", v: "1,000,000,000", c: "#C6FF00" },
    { k: "Tax", v: "0 / 0", c: "#00A3FF" },
    { k: "Liquidity", v: "BURNED", c: "#FF9D00" },
    { k: "Contract", v: "RENOUNCED", c: "#8B3DFF" },
    { k: "Network", v: "SOLANA", c: "#00A3FF" },
    { k: "Ticker", v: "$BLANKBOY", c: "#C6FF00" },
  ];
  
  const [isClient, setIsClient] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    setIsClient(true);
    setWidths(stats.map(() => 60 + Math.random() * 35));
  }, []);

  return (
    <Section id="tokenomics">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="mb-14 text-center">
        <p className="font-display text-xs tracking-[0.5em] text-neon-blue">// 03 · NUMBERS</p>
        <h2 className="font-display mt-3 text-5xl text-white md:text-6xl">TOKENOMICS</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="relative overflow-hidden rounded-2xl glass p-6"
            style={{ boxShadow: `inset 0 0 0 1px ${s.c}33` }}
          >
            <div
              className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30"
              style={{ background: s.c, filter: "blur(40px)" }}
            />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{s.k}</p>
            <p
              className="font-display mt-3 text-3xl"
              style={{ color: s.c, textShadow: `0 0 18px ${s.c}88` }}
            >
              {s.v}
            </p>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              {isClient && widths[i] !== undefined && (
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${widths[i]}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.06 }}
                  className="h-full"
                  style={{ background: s.c, boxShadow: `0 0 12px ${s.c}` }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Roadmap() {
  const phases = [
    { p: "PHASE 1", color: "#C6FF00", items: ["Enter The Void", "Community Formation", "Meme Expansion"] },
    { p: "PHASE 2", color: "#00A3FF", items: ["Viral Marketing", "Solana Trending", "Influencer Push"] },
    { p: "PHASE 3", color: "#8B3DFF", items: ["Ecosystem Growth", "BlankBoy Universe", "Community Events"] },
    { p: "PHASE 4", color: "#FF9D00", items: ["Become The Meme", "Internet Domination"] },
  ];
  return (
    <Section id="roadmap">
      <div className="mb-14 text-center">
        <p className="font-display text-xs tracking-[0.5em] text-neon-orange">// 04 · PATH</p>
        <h2 className="font-display mt-3 text-5xl text-white md:text-6xl">THE ROADMAP</h2>
      </div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/30 to-transparent md:block" />
        <div className="grid gap-6 md:grid-cols-4">
          {phases.map((ph, i) => (
            <motion.div
              key={ph.p}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative"
            >
              <div
                className="mx-auto mb-6 h-12 w-12 rounded-full glass flex items-center justify-center font-display text-sm"
                style={{ color: ph.color, boxShadow: `0 0 24px ${ph.color}88` }}
              >
                0{i + 1}
              </div>
              <div
                className="rounded-2xl glass p-5"
                style={{ boxShadow: `inset 0 0 0 1px ${ph.color}33` }}
              >
                <p
                  className="font-display text-lg"
                  style={{ color: ph.color, textShadow: `0 0 14px ${ph.color}88` }}
                >
                  {ph.p}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {ph.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: ph.color, boxShadow: `0 0 8px ${ph.color}` }}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Community() {
  const socials = [
    { label: "X / TWITTER", href: "https://x.com/Blankboyonsol", c: "#FFFFFF" },
    { label: "TELEGRAM", href: "https://t.me/BlankBoyOnSol", c: "#00A3FF" },
    { label: "DEXSCREENER", href: "#", c: "#C6FF00" },
    { label: "Blank.Build", href: "#", c: "#8B3DFF" },
  ];
  return (
    <Section id="community">
      <div className="relative overflow-hidden rounded-3xl glass p-10 md:p-16">
        <Pixels count={25} color="#C6FF00" />
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-green)] opacity-20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--electric-purple)] opacity-20 blur-3xl" />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="font-display text-xs tracking-[0.5em] text-neon-green">// 05 · JOIN</p>
            <h2 className="font-display mt-3 text-5xl text-white md:text-6xl">
              ENTER THE <span className="text-neon-green text-glow-green">VOID.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/65">
              The blank canvas is waiting. Become part of the BlankBoy collective.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-xl glass px-5 py-4 text-center font-display text-xs tracking-widest text-white transition hover:scale-105"
                  style={{ boxShadow: `inset 0 0 0 1px ${s.c}55` }}
                >
                  <span className="relative z-10">{s.label}</span>
                  <span
                    className="absolute inset-0 -z-0 opacity-0 transition-opacity group-hover:opacity-40"
                    style={{ background: s.c }}
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src={bbGreen}
              alt=""
              className="mx-auto h-80 animate-float object-contain"
              style={{ filter: "drop-shadow(0 0 40px rgba(198,255,0,0.5))" }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function MemeWall() {
  const items = [bbGreen, bbPurple, bbOrange, bbBlue, bbWhite, bbGreen, bbPurple, bbOrange];
  const bubbles = ["wen moon?", "gm void", "fill it.", "ngmi → wagmi", "blank > everything", "0 thoughts.", "𝒱 𝒪 𝐼 𝒟"];
  return (
    <Section id="memewall">
      <div className="mb-14 text-center">
        <p className="font-display text-xs tracking-[0.5em] text-neon-purple">// 06 · CULTURE</p>
        <h2 className="font-display mt-3 text-5xl text-white md:text-6xl">THE MEME WALL</h2>
      </div>
      <div className="relative overflow-hidden rounded-3xl glass p-6">
        <div className="flex w-[200%] animate-marquee gap-6">
          {[...items, ...items].map((src, i) => (
            <div
              key={i}
              className="relative h-56 w-56 shrink-0 rounded-2xl glass p-3"
              style={{
                transform: `rotate(${(i % 5) - 2}deg)`,
              }}
            >
              <img src={src} className="h-full w-full object-contain" alt="" />
              {i % 2 === 0 && (
                <span className="font-graffiti absolute -top-3 -right-3 rounded-full bg-[var(--neon-green)] px-3 py-1 text-xs text-black">
                  {bubbles[i % bubbles.length]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={bbBlue} alt="BLANK BOY" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="font-display text-sm tracking-widest text-white">BLANK BOY</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Built on Solana</p>
          </div>
        </div>
        <div className="flex gap-5 text-xs uppercase tracking-[0.25em] text-white/60">
          <a href="https://x.com/Blankboyonsol" target="_blank" rel="noreferrer" className="hover:text-neon-green">Twitter</a>
          <a href="https://t.me/BlankBoyOnSol" target="_blank" rel="noreferrer" className="hover:text-neon-green">Telegram</a>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          © {new Date().getFullYear()} BlankBoy · The Void
        </p>
      </div>
    </footer>
  );
}

export default function BlankBoyHome() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <main className="relative min-h-screen text-white">
      <Loader done={loaded} />
      <CursorGlow />
      <Nav />
      <Hero />
      <About />
      <BlankAITerminal />
      <Gallery />
      <Tokenomics />
      <Roadmap />
      <Community />
      <MemeWall />
      <Footer />
    </main>
  );
}