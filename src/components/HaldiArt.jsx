import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { RotateCcw, Sparkles } from "lucide-react";

const COLORS = ["#e8a317", "#f2c230", "#d98a0b", "#f6d55c", "#c77b05"];
const GLYPHS = ["✿", "❀", "●", "✦"];
const MAX_STAINS = 14;

const rand = (min, max) => min + Math.random() * (max - min);

function makeBurst(id, x, y) {
  return {
    id,
    x,
    y,
    particles: Array.from({ length: 16 }, (_, i) => {
      const angle = rand(0, Math.PI * 2);
      const distance = rand(45, 125);
      return {
        key: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance + rand(10, 40), // a little gravity
        size: rand(12, 24),
        rotate: rand(-220, 220),
        duration: rand(0.8, 1.3),
        color: COLORS[Math.floor(rand(0, COLORS.length))],
        glyph: GLYPHS[Math.floor(rand(0, GLYPHS.length))],
      };
    }),
  };
}

export default function HaldiArt({ event }) {
  const reduceMotion = useReducedMotion();
  const artRef = useRef(null);
  const idRef = useRef(0);
  const timers = useRef([]);

  const [bursts, setBursts] = useState([]);
  const [stains, setStains] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  function splash(clickEvent) {
    const rect = artRef.current.getBoundingClientRect();

    // Keyboard activation has no pointer position, so splash in the middle.
    const x =
      clickEvent.detail === 0
        ? rect.width / 2
        : clickEvent.clientX - rect.left;
    const y =
      clickEvent.detail === 0
        ? rect.height / 2
        : clickEvent.clientY - rect.top;

    idRef.current += 1;
    const id = idRef.current;

    setCount((value) => value + 1);

    setStains((all) => [
      ...all.slice(-(MAX_STAINS - 1)),
      { id, x, y, size: rand(90, 150) },
    ]);

    if (!reduceMotion) {
      setBursts((all) => [...all, makeBurst(id, x, y)]);
      timers.current.push(
        window.setTimeout(
          () => setBursts((all) => all.filter((b) => b.id !== id)),
          1500
        )
      );
    }
  }

  function reset() {
    setStains([]);
    setBursts([]);
    setCount(0);
  }

  const message =
    count === 0
      ? null
      : count < 5
      ? "Splash! Keep going…"
      : count < 12
      ? "Sunshine mode: ON ☀️"
      : "Fully haldi-fied! Time to dance 💛";

  return (
    <div className="haldi-wrap">
      <button
        ref={artRef}
        type="button"
        className="event-art event-art-haldi haldi-art"
        onClick={splash}
        aria-label="Splash some haldi"
      >
        <span className="haldi-layer haldi-stains" aria-hidden="true">
          {stains.map((stain) => (
            <motion.span
              key={stain.id}
              className="haldi-stain"
              style={{
                left: stain.x - stain.size / 2,
                top: stain.y - stain.size / 2,
                width: stain.size,
                height: stain.size,
              }}
              initial={reduceMotion ? false : { scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </span>

        <span className="art-sun" aria-hidden="true" />
        <span className="art-vine art-vine-left" aria-hidden="true">
          ❧
        </span>
        <span className="art-vine art-vine-right" aria-hidden="true">
          ❧
        </span>

        <span
          key={count}
          className={`event-art-center haldi-center ${
            count > 0 ? "is-bumped" : ""
          }`}
          aria-hidden="true"
        >
          {event.symbol}
        </span>

        <span className="art-ribbon" aria-hidden="true">
          SUNSHINE &amp; HALDI
        </span>

        <span className="haldi-layer haldi-bursts" aria-hidden="true">
          {bursts.map((burst) =>
            burst.particles.map((p) => (
              <motion.span
                key={`${burst.id}-${p.key}`}
                className="haldi-particle"
                style={{
                  left: burst.x,
                  top: burst.y,
                  fontSize: p.size,
                  color: p.color,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{
                  x: p.dx,
                  y: p.dy,
                  opacity: 0,
                  scale: 1.1,
                  rotate: p.rotate,
                }}
                transition={{ duration: p.duration, ease: "easeOut" }}
              >
                {p.glyph}
              </motion.span>
            ))
          )}
        </span>

        {message && (
          <span className="art-magic-message" aria-live="polite">
            {message}
          </span>
        )}

        <span className="art-tap-cue">
          <Sparkles size={12} />
          {count === 0
            ? "Tap anywhere to splash haldi"
            : `${count} splash${count === 1 ? "" : "es"} of sunshine`}
        </span>
      </button>

      {count > 0 && (
        <button
          type="button"
          className="haldi-reset"
          onClick={reset}
          aria-label="Wash the haldi off and start again"
        >
          <RotateCcw size={13} />
          Start over
        </button>
      )}
    </div>
  );
}
