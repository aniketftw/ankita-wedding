import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { events } from "../data/events";
import "./Baraat.css";

const wedding = events.find((e) => e.id === "wedding");
const venueName = (wedding?.shortVenue ?? "the hall").split(" · ")[0];

// [starts at, title, subtitle] — "starts at" is how far the baraat has travelled (0 to 1).
const STAGES = [
  [0, "The baraat sets out", "Durgesh's family is on its way to the hall."],
  [0.22, "The dhol is warming up", "Can you hear it? The road is getting louder."],
  [0.5, "Dancing all the way", "Nobody on this road is standing still."],
  [0.78, "Almost at the gates", "Hold your breath. The doors are just ahead."],
  [0.995, "The baraat has arrived!", "Let the celebrations begin."],
];

const PETALS = ["✿", "❀", "✾", "❁"];
const PETAL_COLORS = ["#e3a7ae", "#f0c987", "#d98f9a", "#f4dba4", "#b9c9a8"];
const rand = (min, max) => min + Math.random() * (max - min);

/* ---------- little illustrated people ---------- */

function Baraati({ role, kurta, pants, hat, skin = "#d9a98a" }) {
  return (
    <svg viewBox="0 0 70 120" aria-hidden="true" className="baraati-svg">
      {/* legs */}
      <rect x="24" y="76" width="9" height="36" rx="4" fill={pants} />
      <rect x="37" y="76" width="9" height="36" rx="4" fill={pants} />
      <ellipse cx="28.5" cy="113" rx="7" ry="3.2" fill="#5a4636" />
      <ellipse cx="41.5" cy="113" rx="7" ry="3.2" fill="#5a4636" />

      {/* kurta */}
      <path
        d="M19 36 Q35 29 51 36 L53 84 H17Z"
        fill={kurta}
        stroke="rgba(80,62,73,.25)"
        strokeWidth=".8"
      />
      <path d="M35 33 V84" stroke="#d8bd80" strokeWidth="1.2" />
      <circle cx="35" cy="46" r="1.4" fill="#d8bd80" />
      <circle cx="35" cy="58" r="1.4" fill="#d8bd80" />
      <circle cx="35" cy="70" r="1.4" fill="#d8bd80" />

      {/* arms and props, by role */}
      {role === "dhol" && (
        <g>
          <ellipse cx="35" cy="66" rx="25" ry="12" fill="#b4703c" />
          <ellipse cx="12" cy="66" rx="4.5" ry="11" fill="#e9d3a8" />
          <ellipse cx="58" cy="66" rx="4.5" ry="11" fill="#e9d3a8" />
          <path d="M20 58 Q35 62 50 58 M20 74 Q35 78 50 74" stroke="#e0bf72" strokeWidth="1.6" fill="none" />
          <path d="M26 36 L33 60 M44 36 L38 60" stroke="#c9a05a" strokeWidth="2" />
          <g className="stick-r" style={{ transformOrigin: "46px 40px" }}>
            <path d="M46 40 L60 48" stroke={skin} strokeWidth="5" strokeLinecap="round" />
            <path d="M60 48 L68 36" stroke="#8a5a30" strokeWidth="2" strokeLinecap="round" />
          </g>
          <path d="M24 40 L14 56" stroke={skin} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {role === "trumpet" && (
        <g>
          <path d="M24 40 L18 58" stroke={skin} strokeWidth="5" strokeLinecap="round" />
          <path d="M46 40 L44 26" stroke={skin} strokeWidth="5" strokeLinecap="round" />
          <path d="M40 24 L58 22 L68 12 L70 32 L58 26 L40 28Z" fill="#e2b94c" stroke="#b58d2e" strokeWidth=".8" />
        </g>
      )}

      {role === "dance" && (
        <g>
          <g className="arm-l" style={{ transformOrigin: "24px 40px" }}>
            <path d="M24 40 L9 14" stroke={skin} strokeWidth="5" strokeLinecap="round" />
            <circle cx="8" cy="12" r="3.4" fill={skin} />
          </g>
          <g className="arm-r" style={{ transformOrigin: "46px 40px" }}>
            <path d="M46 40 L61 14" stroke={skin} strokeWidth="5" strokeLinecap="round" />
            <circle cx="62" cy="12" r="3.4" fill={skin} />
          </g>
        </g>
      )}

      {/* head */}
      <circle cx="35" cy="22" r="10" fill={skin} />
      <circle cx="31.5" cy="21" r="1.1" fill="#4a3a3a" />
      <circle cx="38.5" cy="21" r="1.1" fill="#4a3a3a" />
      <path d="M31.5 26.5 Q35 29 38.5 26.5" stroke="#8a5a4a" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* turban / safa */}
      <path d="M24 19 Q35 2 46 19 Q35 12 24 19Z" fill={hat} />
      <path d="M24 19 Q35 14 46 19" stroke="#e2c77f" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function GroomOnHorse() {
  return (
    <svg viewBox="0 -16 230 190" aria-hidden="true" className="groom-svg">
      {/* tail */}
      <path d="M50 78 C26 84 20 112 34 138 C30 110 40 96 56 92Z" fill="#cdb995" />

      {/* far legs, then body, then near legs */}
      <g className="leg leg-b" style={{ transformOrigin: "70px 104px" }}>
        <rect x="64" y="104" width="11" height="52" rx="5" fill="#ece1cc" />
        <rect x="64" y="150" width="11" height="8" rx="3" fill="#7a6650" />
      </g>
      <g className="leg leg-a" style={{ transformOrigin: "136px 104px" }}>
        <rect x="130" y="104" width="11" height="52" rx="5" fill="#ece1cc" />
        <rect x="130" y="150" width="11" height="8" rx="3" fill="#7a6650" />
      </g>

      <ellipse cx="106" cy="88" rx="60" ry="29" fill="#f8f1e4" stroke="#cbb89a" strokeWidth="1" />

      {/* neck, head, mane */}
      <path d="M140 74 L160 34 L184 42 L170 90Z" fill="#f8f1e4" stroke="#cbb89a" strokeWidth="1" />
      <path d="M166 36 L184 26 L210 58 L202 66 L186 54 L170 52Z" fill="#f8f1e4" stroke="#cbb89a" strokeWidth="1" />
      <path d="M170 30 L172 14 L181 28Z" fill="#f8f1e4" stroke="#cbb89a" strokeWidth="1" />
      <path d="M158 36 C150 50 146 62 140 76 L150 74 C152 62 156 50 164 38Z" fill="#cdb995" />
      <circle cx="187" cy="38" r="2.2" fill="#3f3330" />
      <circle cx="204" cy="60" r="1.5" fill="#a89478" />
      <path d="M174 52 L204 62" stroke="#d6b45c" strokeWidth="1.6" />

      <g className="leg leg-a" style={{ transformOrigin: "86px 104px" }}>
        <rect x="80" y="104" width="11" height="52" rx="5" fill="#f8f1e4" stroke="#cbb89a" strokeWidth=".8" />
        <rect x="80" y="150" width="11" height="8" rx="3" fill="#7a6650" />
      </g>
      <g className="leg leg-b" style={{ transformOrigin: "152px 104px" }}>
        <rect x="146" y="104" width="11" height="52" rx="5" fill="#f8f1e4" stroke="#cbb89a" strokeWidth=".8" />
        <rect x="146" y="150" width="11" height="8" rx="3" fill="#7a6650" />
      </g>

      {/* embroidered cloth */}
      <path
        d="M64 66 Q106 54 148 66 L152 112 q-6 9 -12 0 q-6 9 -12 0 q-6 9 -12 0 q-6 9 -12 0 q-6 9 -12 0 q-6 9 -12 0 Z"
        fill="#e8b9bd"
        stroke="#d3a14f"
        strokeWidth="1.3"
      />
      {[78, 92, 106, 120, 134].map((x) => (
        <circle key={x} cx={x} cy="96" r="2.4" fill="#e9c55e" />
      ))}

      {/* groom */}
      <rect x="98" y="62" width="12" height="42" rx="6" fill="#f3e6cb" transform="rotate(10 104 62)" />
      <rect x="104" y="62" width="12" height="42" rx="6" fill="#f3e6cb" transform="rotate(-6 110 62)" />
      <path d="M88 28 Q106 20 124 28 L127 72 H85Z" fill="#ecc7b4" stroke="#d3a14f" strokeWidth="1" />
      <path d="M106 26 V72" stroke="#d3a14f" strokeWidth="1.2" />
      {[38, 48, 58].map((y) => (
        <circle key={y} cx="106" cy={y} r="1.7" fill="#d3a14f" />
      ))}
      <path d="M92 36 L112 62" stroke="#d9a98a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="106" cy="14" r="11" fill="#d9a98a" />
      <path d="M90 12 Q106 -10 122 12 Q106 2 90 12Z" fill="#c9667a" />
      <path d="M92 11 Q106 5 120 11" stroke="#e8c46a" strokeWidth="2" fill="none" />
      <path d="M106 -2 Q112 -12 118 -8" stroke="#e8c46a" strokeWidth="1.6" fill="none" />
      <circle cx="119" cy="-9" r="2.6" fill="#e8c46a" />
      {/* sehra, the marigold veil */}
      {[94, 99, 104, 109, 114, 119].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 10 V${22 + (i % 2) * 5}`} stroke="#e8c46a" strokeWidth="1" />
          <circle cx={x} cy={22 + (i % 2) * 5} r="2.3" fill={i % 2 ? "#f08a3c" : "#f2b632"} />
        </g>
      ))}
    </svg>
  );
}

/* ---------- the hall ---------- */

function Hall() {
  return (
    <svg viewBox="0 0 260 300" aria-hidden="true" className="hall-svg">
      <rect x="20" y="118" width="220" height="182" fill="#fffaf0" stroke="#c9a864" strokeWidth="1.5" />
      <path d="M82 118 C82 50 178 50 178 118Z" fill="#f6ead2" stroke="#c9a864" strokeWidth="1.5" />
      <path d="M130 56 V30" stroke="#c9a864" strokeWidth="2" />
      <circle cx="130" cy="27" r="5" fill="#e2b94c" />
      {[32, 214].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 20} 118 C${cx - 20} 82 ${cx + 20} 82 ${cx + 20} 118Z`} fill="#f6ead2" stroke="#c9a864" strokeWidth="1.2" />
          <path d={`M${cx} 90 V76`} stroke="#c9a864" strokeWidth="1.5" />
          <circle cx={cx} cy="74" r="3.4" fill="#e2b94c" />
        </g>
      ))}
      <rect x="64" y="132" width="132" height="20" rx="3" fill="#f3e2bd" stroke="#c9a864" />
      <text
        x="130"
        y="146"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2.4"
        fill="#7b6540"
        fontFamily="DM Sans, sans-serif"
        fontWeight="600"
      >
        {venueName.toUpperCase()}
      </text>
      {[40, 70, 190, 220].map((x) => (
        <g key={x}>
          <path d={`M${x - 8} 230 V190 a8 8 0 0 1 16 0 V230Z`} fill="#f7d98b" stroke="#c9a864" />
          <path d={`M${x} 182 V230`} stroke="#c9a864" strokeWidth=".7" />
        </g>
      ))}
      <path d="M96 300 V206 a34 34 0 0 1 68 0 V300Z" fill="#c9a864" opacity=".35" />
      {Array.from({ length: 17 }, (_, i) => (
        <circle key={i} cx={22 + i * 14} cy={i % 2 ? 162 : 158} r="3.6" fill={i % 3 ? "#f2a73a" : "#f6cc4d"} />
      ))}
    </svg>
  );
}

/* ---------- audio: a tiny synthesised dhol, only ever played on a tap ---------- */

function playDhol(ctxRef) {
  try {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      ctxRef.current = new Ctx();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(68, t + 0.2);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.85, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);

    const len = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    noiseGain.gain.value = 0.25;
    noise.buffer = buffer;
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(t);
  } catch {
    /* sound is a bonus; never break the page over it */
  }
}

/* ---------- the section ---------- */

export default function BaraatSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const marchRef = useRef(null);
  const audioRef = useRef(null);
  const timers = useRef([]);
  const idRef = useRef(0);

  const [stage, setStage] = useState(reduceMotion ? STAGES.length - 1 : 0);
  const [meters, setMeters] = useState(reduceMotion ? 0 : 400);
  const [beats, setBeats] = useState(0);
  const [rings, setRings] = useState([]);
  const [showers, setShowers] = useState([]);
  const [shout, setShout] = useState("");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const move = useTransform(scrollYProgress, [0.03, 0.92], [0, 1]);
  const door = useTransform(scrollYProgress, [0.86, 0.97], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  useMotionValueEvent(move, "change", (value) => {
    let index = 0;
    STAGES.forEach(([at], i) => {
      if (value >= at) index = i;
    });
    setStage(index);
    setMeters(Math.max(0, Math.ceil(((1 - value) * 400) / 10) * 10));
  });

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const arrived = stage === STAGES.length - 1;
  const [, title, subtitle] = STAGES[stage];

  function later(fn, ms) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function shower() {
    idRef.current += 1;
    const id = idRef.current;
    const pieces = Array.from({ length: 28 }, (_, i) => ({
      key: i,
      left: rand(2, 98),
      delay: rand(0, 1.4),
      duration: rand(2.6, 4.4),
      size: rand(14, 26),
      sway: rand(-60, 60),
      glyph: PETALS[Math.floor(rand(0, PETALS.length))],
      color: PETAL_COLORS[Math.floor(rand(0, PETAL_COLORS.length))],
    }));
    setShowers((all) => [...all, { id, pieces }]);
    later(() => setShowers((all) => all.filter((s) => s.id !== id)), 6200);
  }

  function beat() {
    playDhol(audioRef);

    const next = beats + 1;
    setBeats(next);

    if (!reduceMotion) {
      idRef.current += 1;
      const id = idRef.current;
      setRings((all) => [...all, id]);
      later(() => setRings((all) => all.filter((r) => r !== id)), 800);

      marchRef.current?.querySelectorAll("[data-hop]").forEach((el, i) => {
        el.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-14px) rotate(-2deg)" },
            { transform: "translateY(0)" },
          ],
          { duration: 320, delay: i * 35, easing: "ease-out" }
        );
      });
    }

    if (next % 8 === 0) {
      setShout("Now THAT is a baraat! 🎉");
      shower();
      later(() => setShout(""), 2600);
    }
  }

  const stageStyle = reduceMotion
    ? { "--move": 1, "--door": 1 }
    : { "--move": move, "--door": door };

  return (
    <section
      ref={sectionRef}
      id="baraat"
      className={`baraat-section ${reduceMotion ? "is-static" : ""}`}
      aria-label="The baraat arrives"
    >
      <motion.div className="baraat-stage" style={stageStyle}>
        <div className="baraat-sky" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="baraat-star"
              style={{
                left: `${(i * 37 + 11) % 97}%`,
                top: `${(i * 23 + 7) % 38}%`,
                animationDelay: `${(i % 5) * -0.8}s`,
              }}
            >
              ✦
            </span>
          ))}
          <div className="baraat-lights">
            {Array.from({ length: 22 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i % 6) * -0.5}s` }} />
            ))}
          </div>
        </div>

        <div className="baraat-caption" aria-live="polite">
          <p className="eyebrow">
            <Sparkles size={13} /> THE BARAAT
          </p>
          <h3>{title}</h3>
          <p className="baraat-sub">{subtitle}</p>

          {arrived ? (
            <a className="baraat-cta" href="#blessings">
              Leave your blessings <ArrowDown size={15} />
            </a>
          ) : (
            <span className="baraat-distance">
              {meters > 0 ? `${meters} m to ${venueName}` : `At the gates of ${venueName}`}
            </span>
          )}
        </div>

        {shout && (
          <div className="baraat-shout" role="status">
            {shout}
          </div>
        )}

        <div className="baraat-hall">
          <Hall />
          <div className="baraat-glow" />
          <div className="baraat-door baraat-door-l" />
          <div className="baraat-door baraat-door-r" />
        </div>

        <div className="baraat-ground" aria-hidden="true">
          <div className="baraat-road">
            <span className="baraat-dashes" />
          </div>
          {[8, 32, 56].map((left) => (
            <span key={left} className="baraat-lamp" style={{ left: `${left}%` }} />
          ))}
        </div>

        <div className="baraat-march" ref={marchRef}>
          <div className="baraat-procession">
            <div className="baraati" data-hop>
              <Baraati role="dance" kurta="#d9a3ae" pants="#f3e8d0" hat="#e0a45f" />
            </div>
            <div className="baraati baraati-b" data-hop>
              <Baraati role="dance" kurta="#a8bb98" pants="#f3e8d0" hat="#c9667a" skin="#c99577" />
            </div>
            <div className="baraati" data-hop>
              <Baraati role="trumpet" kurta="#e6c47a" pants="#fff7e6" hat="#8a9b78" />
            </div>

            <div className="baraati baraati-dhol" data-hop>
              <button
                type="button"
                className="dhol-button"
                onClick={beat}
                aria-label="Play the dhol"
              >
                <Baraati role="dhol" kurta="#d3a0a8" pants="#f3e8d0" hat="#b4703c" skin="#c99577" />
                {rings.map((id) => (
                  <span key={id} className="dhol-ring" aria-hidden="true" />
                ))}
              </button>
              {beats === 0 && (
                <span className="dhol-cue" aria-hidden="true">
                  Tap the dhol!
                </span>
              )}
            </div>

            <div className="baraati-groom" data-hop>
              <GroomOnHorse />
            </div>
          </div>
        </div>

        {!reduceMotion && (
          <motion.div className="baraat-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
            Scroll to bring the baraat home <ArrowDown size={14} />
          </motion.div>
        )}

        <div className="baraat-controls">
          <button type="button" className="baraat-btn" onClick={shower}>
            <span aria-hidden="true">✿</span> Shower petals
          </button>
          {beats > 0 && (
            <span className="baraat-count" aria-live="polite">
              {beats} {beats === 1 ? "beat" : "beats"} played
            </span>
          )}
        </div>

        {showers.map((s) => (
          <div key={s.id} className="baraat-shower" aria-hidden="true">
            {s.pieces.map((p) => (
              <span
                key={p.key}
                style={{
                  left: `${p.left}%`,
                  fontSize: p.size,
                  color: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  "--sway": `${p.sway}px`,
                }}
              >
                {p.glyph}
              </span>
            ))}
          </div>
        ))}

        {arrived && !reduceMotion && (
          <div className="baraat-fireworks" aria-hidden="true">
            {[
              ["62%", "26%", "#e6b94c", 0],
              ["80%", "18%", "#d98f9a", 0.35],
              ["46%", "16%", "#9fb58f", 0.7],
            ].map(([left, top, color, delay], b) => (
              <span key={b} className="firework" style={{ left, top, color, animationDelay: `${delay}s` }}>
                {Array.from({ length: 14 }, (_, i) => (
                  <i key={i} style={{ "--a": `${(360 / 14) * i}deg`, animationDelay: `${delay}s` }} />
                ))}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
