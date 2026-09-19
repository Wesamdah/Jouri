"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useRef, useState } from "react";

type BloomState = "idle" | "blooming" | "bloomed";

const roses = [
  [50, 19, 88, 2, 1.02],
  [38, 24, 86, -10, 0.98],
  [62, 24, 86, 12, 0.99],
  [28, 31, 82, -20, 0.94],
  [50, 33, 106, -2, 1.08],
  [72, 31, 82, 20, 0.94],
  [20, 42, 78, -27, 0.9],
  [35, 42, 96, -13, 1.02],
  [65, 42, 96, 14, 1.03],
  [80, 42, 78, 27, 0.9],
  [14, 54, 74, -31, 0.84],
  [27, 54, 90, -20, 0.96],
  [50, 49, 116, 3, 1.15],
  [73, 54, 90, 20, 0.96],
  [86, 54, 74, 31, 0.84],
  [20, 66, 78, -25, 0.88],
  [36, 64, 98, -9, 1.04],
  [64, 64, 98, 10, 1.04],
  [80, 66, 78, 25, 0.88],
  [29, 76, 82, -18, 0.92],
  [50, 72, 108, 0, 1.12],
  [71, 76, 82, 18, 0.92],
  [40, 81, 86, -8, 0.98],
  [60, 81, 86, 8, 0.98],
] as const;

const ambientPetals = [9, 24, 58, 79, 91];

function FlowerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 21v-7m0 3c-2.8 0-5-1.4-6-4 3-.4 5 .5 6 2.6m0 .3c2.8 0 5-1.4 6-4-3-.4-5 .5-6 2.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M12 12c-3.3 0-5.7-2.1-5.7-4.9 2.7-.8 4.8.1 5.7 2.6.9-2.5 3-3.4 5.7-2.6 0 2.8-2.4 4.9-5.7 4.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11 5 6.5 9H3v6h3.5L11 19V5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {!muted && (
        <path
          d="M15 9.2c.8.8 1.2 1.7 1.2 2.8s-.4 2-1.2 2.8m2.8-8.4a7.8 7.8 0 0 1 0 11.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      {muted && (
        <path
          d="m15.5 9 5 5m0-5-5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function playHarpChord() {
  try {
    const context = new window.AudioContext();
    [261.63, 329.63, 392, 493.88, 659.25].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * 0.09;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.11, start + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.65);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 1.7);
    });
    window.setTimeout(() => context.close(), 2500);
  } catch {
    // Audio is an enhancement and may be blocked by browser policy.
  }
}

export default function Home() {
  const [bloomState, setBloomState] = useState<BloomState>("idle");
  const [soundOn, setSoundOn] = useState(false);
  const [burst, setBurst] = useState<number[]>([]);
  const settleTimer = useRef<number | null>(null);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const moveAura = (event: PointerEvent) => {
      stage.style.setProperty("--pointer-x", `${event.clientX}px`);
      stage.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", moveAura, { passive: true });
    return () => {
      window.removeEventListener("pointermove", moveAura);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const bloom = () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    setBloomState("blooming");
    setBurst(Array.from({ length: 20 }, (_, index) => index));
    if (soundOn) playHarpChord();
    settleTimer.current = window.setTimeout(() => {
      setBloomState("bloomed");
      setBurst([]);
    }, 2600);
  };

  const replay = () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    setBloomState("idle");
    setBurst([]);
    window.setTimeout(bloom, 90);
  };

  const toggleSound = () => {
    setSoundOn((current) => {
      if (!current) playHarpChord();
      return !current;
    });
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a
            className="brand"
            href="#garden"
            aria-label="L’Éternel Jardin home"
          >
            <span className="brand-flower">
              <FlowerIcon />
            </span>
            <span>L’Éternel Jardin</span>
          </a>
          <div className="sanctuary-badge" aria-label="Sanctuary of devotion">
            <i />
            <span>Sanctuary of Devotion</span>
            <i />
          </div>
          <div className="header-actions">
            <button
              className={`sound-button ${soundOn ? "is-on" : ""}`}
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={
                soundOn ? "Mute harp soundscape" : "Play harp soundscape"
              }
            >
              <SpeakerIcon muted={!soundOn} />
              <span>Night Winds &amp; Harp</span>
            </button>
            <button
              className="replay-button"
              onClick={replay}
              aria-label="Replay bouquet bloom animation"
            >
              <span aria-hidden="true">↻</span>
              <span>Replay Bloom</span>
            </button>
          </div>
        </div>
      </header>

      <main id="garden" ref={stageRef} className={`garden-stage ${bloomState}`}>
        <div className="cursor-aura" aria-hidden="true" />
        <div className="ambient-light" aria-hidden="true" />
        <div className="petal-field" aria-hidden="true">
          {ambientPetals.map((left, index) => (
            <i
              key={left}
              style={
                {
                  "--left": `${left}%`,
                  "--delay": `${index * 1.35}s`,
                  "--duration": `${10 + index}s`,
                } as CSSProperties
              }
            />
          ))}
          {burst.map((index) => (
            <i
              className="burst-petal"
              key={index}
              style={
                {
                  "--left": `${6 + ((index * 29) % 88)}%`,
                  "--delay": `${(index % 6) * 0.08}s`,
                  "--duration": `${4.8 + (index % 4) * 0.55}s`,
                  "--drift": `${-60 + (index % 7) * 21}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="fireflies" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <i key={index} />
          ))}
        </div>

        <section className="hero-copy" aria-labelledby="devotion-title">
          <div className="eyebrow">
            <span>✦</span> Grand Royal Jouri Rose Dome
          </div>
          <h1 id="devotion-title">
            <em>Sedra Nammora</em>
          </h1>
          <p>“some wonders awaken only to mirror the grace you carry.”</p>
          <div
            className={`bloom-controls ${bloomState !== "idle" ? "is-hidden" : ""}`}
          >
            <button className="bloom-button" onClick={bloom}>
              <FlowerIcon size={20} />
              <span>Touch to Bloom</span>
              <span className="sparkle" aria-hidden="true">
                ✦
              </span>
            </button>
            <small>
              <span aria-hidden="true">◇</span> Tap to unveil your bespoke
              Damascus rose bouquet
            </small>
          </div>
          <div
            className={`devotion-status ${bloomState === "idle" ? "is-hidden" : ""}`}
            role="status"
            aria-live="polite"
          >
            <i /> 24 Damascus roses gathered in eternal devotion
          </div>
        </section>

        <section
          className="bouquet-stage"
          aria-label="A bouquet of 24 red Damascus roses tied with a golden ribbon"
        >
          <div className="bouquet-radiance" aria-hidden="true" />
          <div className="bouquet">
            <svg
              className="stems"
              aria-hidden="true"
              viewBox="0 0 600 560"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="stem" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#397850" />
                  <stop offset="1" stopColor="#071d12" />
                </linearGradient>
              </defs>
              {Array.from({ length: 15 }, (_, index) => {
                const topX = 92 + index * 30;
                return (
                  <path
                    key={index}
                    d={`M300 500 C ${260 + index * 5} 390, ${topX} 235, ${topX} 86`}
                  />
                );
              })}
            </svg>
            <div className="leaves" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <i
                  key={index}
                  style={
                    {
                      "--leaf-x": `${14 + ((index * 23) % 72)}%`,
                      "--leaf-y": `${32 + ((index * 17) % 48)}%`,
                      "--leaf-rotate": `${-62 + (index % 6) * 25}deg`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="roses" aria-hidden="true">
              {roses.map(([left, top, size, rotation, scale], index) => (
                <span
                  className="rose"
                  key={index}
                  style={
                    {
                      "--x": `${left}%`,
                      "--y": `${top}%`,
                      "--size": `${size}px`,
                      "--mobile-size": `${Math.round(size * 0.72)}px`,
                      "--rotation": `${rotation}deg`,
                      "--rose-scale": scale,
                      "--delay": `${0.72 + (index % 6) * 0.09}s`,
                      "--z": 20 + Math.round(scale * 10),
                    } as CSSProperties
                  }
                >
                  <Image
                    src="/rose.png"
                    alt=""
                    width={160}
                    height={160}
                    sizes="(max-width: 700px) 78px, 116px"
                    priority={index < 8}
                  />
                </span>
              ))}
            </div>
            <svg className="gold-bow" aria-hidden="true" viewBox="0 0 240 155">
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#fff3bd" />
                  <stop offset=".3" stopColor="#d9ae34" />
                  <stop offset=".68" stopColor="#8d6708" />
                  <stop offset="1" stopColor="#f3d875" />
                </linearGradient>
              </defs>
              <path
                d="M116 40C86 8 27 20 31 53c3 28 55 19 86-4Z"
                fill="url(#gold)"
                stroke="#8e6a10"
              />
              <path
                d="M124 40c30-32 89-20 85 13-3 28-55 19-86-4Z"
                fill="url(#gold)"
                stroke="#8e6a10"
              />
              <path
                d="M116 51C93 84 58 124 47 151c25-19 53-47 77-94Z"
                fill="url(#gold)"
                stroke="#8e6a10"
              />
              <path
                d="M124 51c23 33 58 73 69 100-25-19-53-47-77-94Z"
                fill="url(#gold)"
                stroke="#8e6a10"
              />
              <ellipse
                cx="120"
                cy="47"
                rx="13"
                ry="11"
                fill="url(#gold)"
                stroke="#795803"
              />
              <path
                d="M47 48c17-12 41-10 58-1M193 48c-17-12-41-10-58-1"
                stroke="#fff8d8"
                strokeWidth="2"
                opacity=".7"
              />
            </svg>
          </div>
        </section>
        <div className="garden-bed" aria-hidden="true" />
      </main>
    </div>
  );
}
