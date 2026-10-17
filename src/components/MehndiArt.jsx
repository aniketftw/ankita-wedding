import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Eraser, PenLine, Check } from "lucide-react";

const MAX_STROKES = 60;
const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const OUTER_ANGLES = PETAL_ANGLES.map((a) => a + 22.5);
const DOTS = Array.from({ length: 16 }, (_, i) => {
  const rad = (i * 22.5 * Math.PI) / 180;
  return [100 + 94 * Math.cos(rad), 100 + 94 * Math.sin(rad)];
});

const INNER_PETAL = "M100 70 C92 56 92 44 100 34 C108 44 108 56 100 70Z";
const OUTER_PETAL = "M100 38 C93 28 93 20 100 12 C107 20 107 28 100 38Z";

function toPath(points) {
  if (points.length === 1) {
    const [x, y] = points[0];
    return `M${x} ${y}l0.01 0`;
  }

  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const mx = (points[i][0] + points[i + 1][0]) / 2;
    const my = (points[i][1] + points[i + 1][1]) / 2;
    d += ` Q${points[i][0]} ${points[i][1]} ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last[0]} ${last[1]}`;
}

export default function MehndiArt() {
  const reduceMotion = useReducedMotion();
  const surfaceRef = useRef(null);
  const drawingRef = useRef(false);
  const currentRef = useRef(null);

  const [drawMode, setDrawMode] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [current, setCurrent] = useState(null);

  // The mandala draws itself line by line as it scrolls into view.
  const draw = (delay = 0, duration = 1.1) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration, delay, ease: "easeInOut" },
        };

  const pointFromEvent = (event) => {
    const rect = surfaceRef.current.getBoundingClientRect();
    return [
      Math.round((event.clientX - rect.left) * 10) / 10,
      Math.round((event.clientY - rect.top) * 10) / 10,
    ];
  };

  function handlePointerDown(event) {
    if (!drawMode) return;
    if (event.target.closest?.(".mehndi-controls")) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    currentRef.current = [pointFromEvent(event)];
    setCurrent([...currentRef.current]);
  }

  function handlePointerMove(event) {
    if (!drawingRef.current || !currentRef.current) return;

    const point = pointFromEvent(event);
    const last = currentRef.current[currentRef.current.length - 1];
    if (Math.hypot(point[0] - last[0], point[1] - last[1]) < 2) return;

    currentRef.current.push(point);
    setCurrent([...currentRef.current]);
  }

  function finishStroke() {
    if (!drawingRef.current) return;
    drawingRef.current = false;

    const finished = currentRef.current;
    currentRef.current = null;
    setCurrent(null);

    if (finished && finished.length) {
      setStrokes((all) => [...all.slice(-(MAX_STROKES - 1)), finished]);
    }
  }

  const message =
    strokes.length >= 2
      ? "Beautiful! That henna suits you 🌿"
      : drawMode && strokes.length === 0
      ? "Draw anything. It dries darker, like real henna"
      : null;

  return (
    <div
      ref={surfaceRef}
      className={`event-art event-art-mehndi mehndi-art ${
        drawMode ? "is-drawing" : ""
      }`}
      role="group"
      aria-label="Henna playground. Turn on drawing, then draw with your finger or mouse."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishStroke}
      onPointerCancel={finishStroke}
    >
      <span className="art-sun" aria-hidden="true" />

      <svg
        className={`mehndi-mandala ${drawMode ? "is-faded" : ""}`}
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <motion.circle cx="100" cy="100" r="92" {...draw(0, 1.4)} />
          <motion.circle cx="100" cy="100" r="30" {...draw(0.2, 1.1)} />
          <motion.circle cx="100" cy="100" r="14" {...draw(0.35, 0.9)} />

          {PETAL_ANGLES.map((angle, i) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <motion.path d={INNER_PETAL} {...draw(0.5 + i * 0.08)} />
            </g>
          ))}

          {OUTER_ANGLES.map((angle, i) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <motion.path d={OUTER_PETAL} {...draw(0.9 + i * 0.08)} />
            </g>
          ))}
        </g>

        {DOTS.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.7"
            fill="currentColor"
            {...(reduceMotion
              ? { initial: false }
              : {
                  initial: { opacity: 0, scale: 0 },
                  whileInView: { opacity: 1, scale: 1 },
                  viewport: { once: true, amount: 0.3 },
                  transition: { delay: 1.5 + i * 0.04, duration: 0.3 },
                })}
          />
        ))}
      </svg>

      <svg className="mehndi-strokes" aria-hidden="true">
        {strokes.map((points, i) => (
          <path key={i} className="henna-stroke" d={toPath(points)} />
        ))}
        {current && (
          <path className="henna-stroke" d={toPath(current)} />
        )}
      </svg>

      {message && (
        <span className="art-magic-message" aria-live="polite">
          {message}
        </span>
      )}

      <div className="mehndi-controls">
        <button
          type="button"
          className={`mehndi-btn ${drawMode ? "is-active" : ""}`}
          aria-pressed={drawMode}
          onClick={() => setDrawMode((value) => !value)}
        >
          {drawMode ? <Check size={14} /> : <PenLine size={14} />}
          {drawMode ? "Done drawing" : "Draw henna"}
        </button>

        {strokes.length > 0 && (
          <button
            type="button"
            className="mehndi-btn"
            onClick={() => {
              setStrokes([]);
              setCurrent(null);
            }}
          >
            <Eraser size={14} />
            Wipe clean
          </button>
        )}
      </div>
    </div>
  );
}
