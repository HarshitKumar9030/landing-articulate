"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play } from "lucide-react";
import { CloudShader } from "./cloud-shader";

type GameGate = { id: number; x: number; gap: number; scored: boolean };

type PlaneGameProps = {
  open: boolean;
  onClose: () => void;
};

// --- STRICTLY PRESERVED PHYSICS & CONSTANTS ---
const GRAVITY = 0.85;
const GATE_SPEED = 1.25;
const CLIMB_AMOUNT = 8;
const COLLISION_X_MIN = 12;
const COLLISION_X_MAX = 24;
const SCORE_X = 12; // once a gate's leading edge passes this, it's been cleared
const GAP_TOLERANCE = 13;

const buildInitialGates = (): GameGate[] => [
  { id: 1, x: 72, gap: 34, scored: false },
  { id: 2, x: 112, gap: 62, scored: false },
];

export function PlaneGame({ open, onClose }: PlaneGameProps) {
  // --- STRICTLY PRESERVED LOGIC & STATE ---
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerY, setPlayerY] = useState(50);
  const [gates, setGates] = useState<GameGate[]>([]);
  const playerYRef = useRef(50);
  const gatesRef = useRef<GameGate[]>([]);
  const nextGateRef = useRef(3);

  const prepareGame = () => {
    const initialGates = buildInitialGates();
    playerYRef.current = 50;
    gatesRef.current = initialGates;
    nextGateRef.current = 3;
    setPlayerY(50);
    setGates(initialGates);
    setScore(0);
    setGameOver(false);
    setStarted(false);
  };

  const startGame = () => {
    prepareGame();
    setStarted(true);
  };

  useEffect(() => {
    if (!open) {
      setStarted(false);
      setGameOver(false);
      return;
    }
    prepareGame();
  }, [open]);

  useEffect(() => {
    if (!open || !started || gameOver) return;

    const timer = window.setInterval(() => {
      const nextY = playerYRef.current + GRAVITY;
      playerYRef.current = nextY;

      const movedGates = gatesRef.current
        .map((gate) => ({ ...gate, x: gate.x - GATE_SPEED }))
        .filter((gate) => gate.x > -12);

      const lastGate = movedGates[movedGates.length - 1];
      if (!lastGate || lastGate.x < 78) {
        const id = nextGateRef.current;
        nextGateRef.current += 1;
        movedGates.push({
          id,
          x: 112,
          gap: 24 + ((id * 17) % 52),
          scored: false,
        });
      }

      let hit = nextY < 4 || nextY > 96;
      let gained = 0;

      for (const gate of movedGates) {
        const inCollisionZone = gate.x > COLLISION_X_MIN && gate.x < COLLISION_X_MAX;
        if (inCollisionZone && Math.abs(nextY - gate.gap) > GAP_TOLERANCE) {
          hit = true;
        }
        if (!gate.scored && gate.x < SCORE_X) {
          gate.scored = true;
          gained += 1;
        }
      }

      gatesRef.current = movedGates;
      setGates(movedGates);
      setPlayerY(nextY);
      if (gained > 0) setScore((value) => value + gained);
      if (hit) setGameOver(true);
    }, 50);

    return () => window.clearInterval(timer);
  }, [gameOver, open, started]);

  const climb = () => {
    if (!started || gameOver) return;
    const nextY = Math.max(4, playerYRef.current - CLIMB_AMOUNT);
    playerYRef.current = nextY;
    setPlayerY(nextY);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] p-4 backdrop-blur-2xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plane-game-title"
            className="relative flex h-[min(720px,85svh)] w-full max-w-[1000px] flex-col overflow-hidden rounded-[2.5rem] bg-[var(--bg)] shadow-[0_40px_100px_color-mix(in_srgb,var(--ink)_30%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--ink)_10%,transparent)]"
            initial={{ y: 40, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Premium Header */}
            <div className="relative z-20 flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--bg)_80%,transparent)] px-6 py-5 backdrop-blur-md sm:px-8">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                  ArticulateX Airspace
                </p>
                <h2 id="plane-game-title" className="mt-1 font-sans text-xl font-semibold tracking-tight text-[var(--ink)]">
                  Fly the message.
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                    Signal
                  </span>
                  <span className="font-sans text-xl font-bold tabular-nums text-[var(--ink)]">
                    {score}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={onClose} 
                  aria-label="Close plane game" 
                  className="grid h-10 w-10 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] active:scale-95"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Immersive Game Canvas */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Fly upward"
              onPointerDown={climb}
              onKeyDown={(event) => { 
                if (event.key === "ArrowUp" || event.key === " ") { 
                  event.preventDefault(); 
                  climb(); 
                } 
              }}
              className="relative flex-1 cursor-pointer overflow-hidden bg-[#0a111a] text-white outline-none"
            >
              {/* Atmospheric Cloud Shader replacing the grid */}
              <CloudShader
                speed={1.5} // Faster speed simulates forward flight momentum
                count={5}
                cloudColor="#e2e8f0" // Cool, misty white clouds
                skyTopColor="#020617" // Deep cinematic night sky
                skyBottomColor="#334155" // Slate horizon
                className="pointer-events-none absolute inset-0 z-0 opacity-90"
              />

              {/* Architectural Glass Pillars */}
              {gates.map((gate) => (
                <div 
                  key={gate.id} 
                  className="absolute inset-y-0 z-10 w-16 md:w-20" 
                  style={{ left: `${gate.x}%`, transition: "left 50ms linear" }}
                >
                  {/* Top Pillar */}
                  <div 
                    className="absolute left-0 right-0 top-0 rounded-b-xl border border-t-0 border-white/10 bg-white/10 backdrop-blur-md" 
                    style={{ height: `${gate.gap - GAP_TOLERANCE}%` }} 
                  />
                  {/* Bottom Pillar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-t-xl border border-b-0 border-white/10 bg-white/10 backdrop-blur-md" 
                    style={{ height: `${100 - (gate.gap + GAP_TOLERANCE)}%` }} 
                  />
                  {/* Glowing Signal Orb */}
                  {!gate.scored && (
                    <div 
                      className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
                      style={{ top: `${gate.gap}%` }} 
                    />
                  )}
                </div>
              ))}

              {/* Plane */}
              <motion.div 
                className="absolute left-[12%] z-20 w-12 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] sm:w-16" 
                style={{ top: `${playerY}%`, transition: "top 50ms linear" }} 
                animate={{ rotate: gameOver ? 70 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-full w-full">
                  <path d="M21.9 11.1h-5.4L11 2H8l4 9.1H5L2.5 8h-1L3 12l-1.5 4h1L5 12.9h7L8 22h3l5.5-9.1h5.4c1.2 0 2.1-.4 2.1-.9s-.9-.9-2.1-.9Z" />
                </svg>
              </motion.div>

              {/* Start Screen Overlay */}
              {!started && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-6 text-center backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <p className="font-sans text-[clamp(40px,5vw,56px)] font-bold leading-none tracking-tighter text-white">
                      Clear the air.
                    </p>
                    <p className="mt-4 max-w-[280px] text-balance font-sans text-[15px] leading-relaxed text-white/80">
                      Tap anywhere or use the Spacebar to lift the plane through the signal gates.
                    </p>
                    <button 
                      type="button" 
                      onClick={(event) => { event.stopPropagation(); startGame(); }} 
                      className="group mt-8 flex h-14 items-center gap-3 rounded-full bg-white px-8 font-sans text-[14px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
                    >
                      <Play size={16} className="fill-current" />
                      Take off
                    </button>
                  </motion.div>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-6 text-center backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <p className="font-sans text-[clamp(40px,5vw,56px)] font-bold leading-none tracking-tighter text-white">
                      Grounded.
                    </p>
                    <p className="mt-4 font-sans text-[16px] text-white/80">
                      You delivered <span className="font-bold text-white">{score} signals</span>.
                    </p>
                    <button 
                      type="button" 
                      onClick={(event) => { event.stopPropagation(); startGame(); }} 
                      className="group mt-8 flex h-14 items-center gap-2 rounded-full bg-white px-8 font-sans text-[14px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
                    >
                      Fly again
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}