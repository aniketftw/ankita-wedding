
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowDownRight,
  CalendarDays,
  Clock3,
  Flower2,
  Hammer,
  LockKeyhole,
  MapPin,
  Music2,
  Pause,
  Sparkles,
} from "lucide-react";
import { events } from "./data/events";
import GuestbookPreview from "./components/Guestbook";
import MehndiArt from "./components/MehndiArt";
import HaldiArt from "./components/HaldiArt";
import BaraatSection from "./components/Baraat";
import Ganesha from "./components/Ganesha";

const weddingTarget = new Date("2026-12-11T20:00:00+05:30");

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const distance = Math.max(0, target.getTime() - now);

  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
    complete: distance === 0,
  };
}

function PetalField() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="petal-field" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          className={`petal petal-${i + 1}`}
          key={i}
          style={{ "--i": i }}
        />
      ))}
    </div>
  );
}

function Ornament({ className = "" }) {
  return (
    <svg
      className={`ornament ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth=".8" />
      <circle cx="60" cy="60" r="39" stroke="currentColor" strokeWidth=".6" />

      <path
        d="M60 13 C74 32 88 46 107 60 C88 74 74 88 60 107 C46 88 32 74 13 60 C32 46 46 32 60 13Z"
        stroke="currentColor"
        strokeWidth=".8"
      />

      <path
        d="M60 30 C69 44 76 51 90 60 C76 69 69 76 60 90 C51 76 44 69 30 60 C44 51 51 44 60 30Z"
        stroke="currentColor"
        strokeWidth=".8"
      />

      <circle cx="60" cy="60" r="7" fill="currentColor" opacity=".55" />

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="60"
          cy="22"
          rx="3.5"
          ry="7"
          stroke="currentColor"
          strokeWidth=".7"
          transform={`rotate(${angle} 60 60)`}
        />
      ))}
    </svg>
  );
}

function Countdown() {
  const countdown = useCountdown(weddingTarget);

  const units = [
    ["days", "Days"],
    ["hours", "Hours"],
    ["minutes", "Minutes"],
    ["seconds", "Seconds"],
  ];

  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {countdown.complete ? (
        <p className="countdown-complete">
          The wedding celebration is here ♡
        </p>
      ) : (
        units.map(([key, label]) => (
          <div className="countdown-unit" key={key}>
            <span className="countdown-number">
              {String(countdown[key]).padStart(2, "0")}
            </span>
            <span className="countdown-label">{label}</span>
          </div>
        ))
      )}
    </div>
  );
}

function EventCard({ event, index }) {
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [magicOn, setMagicOn] = useState(false);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.venue
  )}`;

  const boardCopy = {
    chowki: {
      prompt: "Tap to light a little blessing",
      active: "A little blessing, a lot of love ✨",
    },
    mehndi: {
      prompt: "Tap for henna magic",
      active: "Henna, giggles & a little magic 🌿",
    },
    haldi: {
      prompt: "Sprinkle some sunshine",
      active: "Sunshine mode: ON ☀️",
    },
    wedding: {
      prompt: "Make the stars sparkle",
      active: "Here's to their happily ever after ✨",
    },
  }[event.theme] || {
    prompt: "Tap for a little magic",
    active: "A little magic for a beautiful day ✨",
  };

  const ribbonText = {
    chowki: "BLESSINGS & LOVE",
    mehndi: "MEHNDI MAGIC",
    haldi: "SUNSHINE & HALDI",
    wedding: "THE BIG YES",
  }[event.theme] || "A DAY TO REMEMBER";

  return (
    <motion.article
      className={`event-card event-${event.theme} ${
        magicOn ? "is-magical" : ""
      }`}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 22,
              rotate: index % 2 ? 1.2 : -1.2,
            }
      }
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.62,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, rotate: index % 2 ? 0.35 : -0.35 }
      }
    >
      <div className="event-card-top">
        <span className="event-number">
          {event.number} / THE CELEBRATIONS
        </span>
        <span className="event-symbol" aria-hidden="true">
          {event.symbol}
        </span>
      </div>

      {event.theme === "mehndi" ? (
        <MehndiArt />
      ) : event.theme === "haldi" ? (
        <HaldiArt event={event} />
      ) : (
      <button
        className={`event-art event-art-${event.theme} ${
          magicOn ? "magic-on" : ""
        }`}
        type="button"
        onClick={() => setMagicOn((value) => !value)}
        aria-pressed={magicOn}
        aria-label={
          magicOn
            ? `Turn off ${event.title} animation`
            : boardCopy.prompt
        }
      >
        <span className="art-sun" aria-hidden="true" />
        <span className="art-vine art-vine-left" aria-hidden="true">
          ❧
        </span>
        <span className="art-vine art-vine-right" aria-hidden="true">
          ❧
        </span>
        <span className="event-art-center" aria-hidden="true">
          {event.symbol}
        </span>
        <span className="art-ribbon" aria-hidden="true">
          {ribbonText}
        </span>
        <span className="art-tap-cue">
          <Sparkles size={12} />
          {magicOn ? "Lovely! Tap again" : boardCopy.prompt}
        </span>

        {magicOn && (
          <span className="art-magic-message" aria-live="polite">
            {boardCopy.active}
          </span>
        )}

        {magicOn &&
          Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className={`magic-particle magic-particle-${i + 1}`}
              aria-hidden="true"
            >
              {event.theme === "haldi"
                ? "✿"
                : event.theme === "mehndi"
                ? "❧"
                : "✦"}
            </span>
          ))}
      </button>
      )}

      <p className="event-date">{event.dateLabel}</p>
      <h3>{event.title}</h3>
      <p className="event-description">{event.description}</p>

      <div className="event-meta">
        <span>
          <Clock3 size={15} />
          {event.time}
        </span>
        <span>
          <MapPin size={15} />
          {event.shortVenue}
        </span>
      </div>

      <button
        className="text-action"
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Tuck details away" : "Unfold the details"}
        <ArrowDownRight size={16} />
      </button>

      {expanded && (
        <motion.div
          className="event-details"
          initial={
            reduceMotion
              ? false
              : { opacity: 0, height: 0, y: -6 }
          }
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p>
            <strong>Where the magic happens</strong>
            <br />
            {event.venue}
          </p>

          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Get directions <ArrowDownRight size={15} />
          </a>

          <button
            type="button"
            onClick={() => downloadCalendarEvent(event)}
          >
            Add to calendar <CalendarDays size={15} />
          </button>
        </motion.div>
      )}
    </motion.article>
  );
}

function downloadCalendarEvent(event) {
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = event.time.match(/\d+/g).map(Number);
  const isPM = event.time.toLowerCase().includes("pm");
  const hour24 = (hour % 12) + (isPM ? 12 : 0);

  // Convert India Standard Time (UTC+5:30) to UTC.
  const start = new Date(
    Date.UTC(year, month - 1, day, hour24 - 5, minute - 30)
  );

  const stamp = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  // Calendar entries currently last two hours.
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const escapeText = (value) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ankita and Durgesh//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@ankita-durgesh-wedding`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(event.title + " — Ankita & Durgesh")}`,
    `LOCATION:${escapeText(event.venue)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([calendar], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${event.id}.ics`;
  link.click();

  URL.revokeObjectURL(url);
}


function GateOpeningExperience({ onComplete, onStrike, reduceMotion }) {
  const [striking, setStriking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [opening, setOpening] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  const later = (callback, delay) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  const strikeLock = () => {
    if (striking || unlocked || opening) return;

    // Browsers only allow sound after a tap, and this is that tap.
    onStrike?.();

    setStriking(true);

    later(() => {
      setStriking(false);
      setUnlocked(true);

      later(() => {
        setOpening(true);
        later(onComplete, reduceMotion ? 80 : 2800);
      }, reduceMotion ? 100 : 900);
    }, reduceMotion ? 80 : 550);
  };

  return (
    <motion.div
      className="gate-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Ankita and Durgesh wedding invitation"
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{
        duration: reduceMotion ? 0.08 : 0.6,
        delay: opening && !reduceMotion ? 2.1 : 0,
      }}
    >
      <div className="gate-garden" aria-hidden="true">
        <span className="gate-garden-orb gate-orb-one" />
        <span className="gate-garden-orb gate-orb-two" />
        <span className="gate-ground-flower flower-a">✿</span>
        <span className="gate-ground-flower flower-b">❀</span>
        <span className="gate-ground-flower flower-c">✿</span>
        <span className="gate-ground-flower flower-d">❀</span>
      </div>

      <div className="gate-topline">
        <span>WITH LOVE FROM OUR FAMILIES</span>
        <i>✦</i>
        <span>DECEMBER 2026</span>
      </div>

      {/* Welcome text sits above the gates, not on top of them. */}
      <div className={`gate-welcome ${opening ? "is-leaving" : ""}`}>
        <span className="gate-eyebrow">
          <Sparkles size={13} />
          {unlocked ? "A LITTLE MAGIC UNLOCKED" : "YOU'RE INVITED"}
        </span>

        <h1>
          Come on in,
          <br />
          <em>love is waiting.</em>
        </h1>

        <p>
          {unlocked
            ? "The lock is open. Their forever awaits."
            : "One little tap stands between you and our celebration."}
        </p>
      </div>

      {/* The lock belongs to the gate itself. */}
      <div className="gate-scene">
        {/* Revealed behind the gates as they swing open. */}
        <div
          className={`gate-ganesh ${opening ? "is-revealed" : ""}`}
          aria-hidden="true"
        >
          <Ganesha className="gate-ganesh-art" />
          <p className="ganesha-mantra">॥ श्री गणेशाय नमः ॥</p>
        </div>

        <motion.div
          className="garden-gate garden-gate-left"
          animate={
            opening
              ? { x: "-105%", rotateY: -62 }
              : { x: "0%", rotateY: 0 }
          }
          transition={{
            duration: reduceMotion ? 0.08 : 1.4,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <div className="garden-gate-frame">
            <span className="gate-arch-line" />
            <span className="gate-gate-vine">❧</span>
            <span className="gate-monogram">A</span>
            <span className="gate-gate-flower gate-flower-top">✿</span>
            <span className="gate-gate-flower gate-flower-bottom">❀</span>
            <span className="gate-lattice-line lattice-a" />
            <span className="gate-lattice-line lattice-b" />
            <span className="gate-panel-seal">❦</span>
          </div>
        </motion.div>

        <motion.div
          className="garden-gate garden-gate-right"
          animate={
            opening
              ? { x: "105%", rotateY: 62 }
              : { x: "0%", rotateY: 0 }
          }
          transition={{
            duration: reduceMotion ? 0.08 : 1.4,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <div className="garden-gate-frame">
            <span className="gate-arch-line" />
            <span className="gate-gate-vine">❧</span>
            <span className="gate-monogram">D</span>
            <span className="gate-gate-flower gate-flower-top">❀</span>
            <span className="gate-gate-flower gate-flower-bottom">✿</span>
            <span className="gate-lattice-line lattice-a" />
            <span className="gate-lattice-line lattice-b" />
            <span className="gate-panel-seal">❦</span>
          </div>
        </motion.div>

        {/* Lock mounted directly over the central gate seam. */}
        <div className={`gate-lock-assembly ${opening ? "is-leaving" : ""}`}>
          <div
            className={`gate-mounted-lock ${
              striking ? "is-shaking" : ""
            } ${unlocked ? "is-unlocked" : ""}`}
            aria-hidden="true"
          >
            <span className="gate-lock-shackle" />
            <LockKeyhole size={32} strokeWidth={1.7} />
          </div>

          {!unlocked && (
            <motion.button
              type="button"
              className="gate-hammer-button"
              onClick={strikeLock}
              disabled={striking || opening}
              aria-label="Strike the gate lock with the hammer"
              animate={
                striking
                  ? { x: -25, y: 10, rotate: -38 }
                  : { x: 0, y: 0, rotate: 12 }
              }
              transition={{
                duration: reduceMotion ? 0.08 : 0.25,
                ease: [0.2, 0.8, 0.3, 1],
              }}
            >
              <Hammer size={36} strokeWidth={1.7} />
            </motion.button>
          )}

          {unlocked && (
            <div className="gate-lock-sparkles" aria-hidden="true">
              <span>✦</span>
              <span>✧</span>
              <span>✦</span>
              <span>❀</span>
            </div>
          )}
        </div>
      </div>

      <div className={`gate-instruction ${opening ? "is-leaving" : ""}`}>
        {unlocked ? (
          <span>
            <Sparkles size={15} /> Unlock complete — welcome!
          </span>
        ) : striking ? (
          <span>
            <Hammer size={15} /> Knock, knock!
          </span>
        ) : (
          <span>
            Tap the little hammer to unlock our gates
          </span>
        )}
      </div>

      {!striking && !unlocked && (
        <p className="gate-sound-note">♪ Music plays as the gates open</p>
      )}

      <div className="gate-bottom-note">
        <span />
        A CELEBRATION IN BLOOM
        <span />
      </div>

      <motion.div
        className="gate-light-burst"
        aria-hidden="true"
        animate={
          unlocked
            ? { opacity: [0, 0.7, 0.1], scale: [0.5, 1.4, 1.8] }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: reduceMotion ? 0.08 : 0.9,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}


export default function App() {
  const [showGateIntro, setShowGateIntro] = useState(true);
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);

  const audioRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const [musicAvailable, setMusicAvailable] = useState(true);
  const fadeTimer = useRef(null);

  const MUSIC_VOLUME = 0.55;

  function fadeTo(audio, target, duration, done) {
    window.clearInterval(fadeTimer.current);
    const from = audio.volume;
    const steps = Math.max(1, Math.round(duration / 50));
    let step = 0;

    fadeTimer.current = window.setInterval(() => {
      step += 1;
      audio.volume = Math.min(
        1,
        Math.max(0, from + (target - from) * (step / steps))
      );

      if (step >= steps) {
        window.clearInterval(fadeTimer.current);
        done?.();
      }
    }, 50);
  }

  async function playMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0; // fade in gently (phones ignore this and play at full volume)
      await audio.play();
      setMusicEnabled(true);
      fadeTo(audio, MUSIC_VOLUME, 2500);
    } catch {
      // No track added yet, or the browser said no. The site works fine without it.
      setMusicEnabled(false);
    }
  }

  function pauseMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    setMusicEnabled(false);
    fadeTo(audio, 0, 500, () => audio.pause());
  }

  function toggleMusic() {
    if (musicEnabled) pauseMusic();
    else playMusic();
  }

  // Be polite: pause when the guest switches app or tab, resume when they return.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    let resumeOnReturn = false;

    const onVisibility = () => {
      if (document.hidden) {
        if (!audio.paused) {
          resumeOnReturn = true;
          audio.pause();
        }
      } else if (resumeOnReturn) {
        resumeOnReturn = false;
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(fadeTimer.current);
    };
  }, []);

  const revealProps = reduceMotion
    ? {
        initial: false,
        whileInView: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.65 },
      };

  return (
    <main>
      {showGateIntro && (
        <GateOpeningExperience
          onComplete={() => setShowGateIntro(false)}
          onStrike={playMusic}
          reduceMotion={reduceMotion}
        />
      )}

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/wedding-instrumental.mp3`}
        loop
        preload="metadata"
        onError={() => {
          setMusicAvailable(false);
          setMusicEnabled(false);
        }}
      />

      <div className="announcement-bar">
        <span>WITH LOVE FROM OUR FAMILIES</span>
        <span className="announcement-dot">✦</span>
        <span>DECEMBER 2026</span>
      </div>

      <header className="site-header">
        <a
          className="wordmark"
          href="#home"
          aria-label="Ankita and Durgesh home"
        >
          <span className="wordmark-monogram">
            A<span>&</span>D
          </span>
          <span className="wordmark-caption">
            THE WEDDING CELEBRATION
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#story">Our invitation</a>
          <a href="#celebrations">Celebrations</a>
          <a href="#baraat">Baraat</a>
          <a href="#blessings">Blessings</a>
        </nav>

        {musicAvailable && (
          <button
            className={`music-toggle ${musicEnabled ? "is-playing" : ""}`}
            onClick={toggleMusic}
            type="button"
            aria-pressed={musicEnabled}
            aria-label={musicEnabled ? "Pause the music" : "Play the music"}
          >
            {musicEnabled ? <Pause size={15} /> : <Music2 size={15} />}
            <span>{musicEnabled ? "Pause music" : "Play music"}</span>
          </button>
        )}
      </header>

      <section className="hero" id="home">
        <PetalField />
        <div className="hero-halo" aria-hidden="true" />

        <div className="hero-copy">
          <motion.div
            className="hero-ganesh"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Ganesha className="hero-ganesh-art" />
            <p className="ganesha-mantra">॥ श्री गणेशाय नमः ॥</p>
          </motion.div>

          <motion.p
            className="eyebrow hero-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles size={14} /> TWO HEARTS, ONE BEAUTIFUL BEGINNING
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12 }}
          >
            Ankita <span className="ampersand">&</span>
            <br />
            Durgesh
          </motion.h1>

          <motion.div
            className="hero-divider"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <span />
            <Flower2 size={21} strokeWidth={1.2} />
            <span />
          </motion.div>

          <motion.p
            className="hero-subtitle"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            Together with our families, we invite you to celebrate
            the beginning of our forever.
          </motion.p>

          <motion.div
            className="hero-date"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <span>05</span>
            <i />
            <span>10</span>
            <i />
            <span>11</span>
            <small>DECEMBER · 2026</small>
          </motion.div>

          <button
            className="button button-primary hero-button"
            onClick={() => {
              setInvitationOpened(true);
              document.getElementById("story")?.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
              });
            }}
            type="button"
          >
            {invitationOpened
              ? "Revisit our invitation"
              : "Open the invitation"}
            <ArrowDown size={16} />
          </button>
        </div>

        <div className="hero-side-note" aria-hidden="true">
          A CELEBRATION IN BLOOM · 2026
        </div>

        <div className="hero-bottom-note">
          <span />
          MADE OF LOVE & LITTLE MOMENTS
          <span />
        </div>
      </section>

      <section className="story-section section-shell" id="story">
        <motion.div className="story-card" {...revealProps}>
          <div className="story-ornament story-ornament-left">
            <Ornament />
          </div>

          <div className="story-ornament story-ornament-right">
            <Ornament />
          </div>

          <p className="eyebrow">A NOTE FROM OUR FAMILIES</p>

          <h2>
            With hearts full of joy,
            <br />
            <em>we invite you.</em>
          </h2>

          <p className="story-copy">
            Some moments become memories. Some days become stories we tell
            forever. As Ankita and Durgesh begin a new chapter together, we
            would be delighted to have you with us for the prayers, laughter,
            traditions, and love that make this celebration so special.
          </p>

          <div className="story-signoff">
            With love, <span>Our Families</span>
          </div>

          <div className="story-countdown">
            <p className="eyebrow">COUNTING DOWN TO THE WEDDING</p>
            <Countdown />
          </div>
        </motion.div>
      </section>

      <section
        className="events-section section-shell"
        id="celebrations"
      >
        <motion.div className="section-heading" {...revealProps}>
          <p className="eyebrow">SAVE A LITTLE SPACE IN YOUR HEART</p>
          <h2>
            Our <em>celebrations</em>
          </h2>
          <p>Four beautiful moments. One unforgettable celebration.</p>
          <div className="heading-flower" aria-hidden="true">
            ✳
          </div>
        </motion.div>

        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard event={event} index={index} key={event.id} />
          ))}
        </div>
      </section>

      <BaraatSection />

      <section className="blessings-section" id="blessings">
        <div className="section-shell">
          <motion.div className="section-heading" {...revealProps}>
            <p className="eyebrow">WORDS WE WILL KEEP FOREVER</p>
            <h2>
              A wall of <em>warm wishes</em>
            </h2>
            <p>Your blessings will become part of our story.</p>
          </motion.div>

          <GuestbookPreview />
        </div>
      </section>

      <footer className="site-footer">
        <Ornament className="footer-ornament" />
        <div className="footer-monogram">
          A <span>&</span> D
        </div>
        <p>With love, today and always.</p>
        <p className="footer-small">
          ANKITA & DURGESH · DECEMBER 2026
        </p>
        <a href="#home" className="back-to-top">
          BACK TO THE BEGINNING ↑
        </a>
      </footer>
    </main>
  );
}
