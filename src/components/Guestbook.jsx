import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownRight, Heart } from "lucide-react";
import { supabase } from "../lib/supabase";

const PENDING_KEY = "wedding_pending_notes_v1";
const COOLDOWN_KEY = "wedding_last_submit_v1";
const COOLDOWN_MS = 30 * 1000;
const PENDING_TTL_MS = 14 * 24 * 60 * 60 * 1000;

function readJSON(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be blocked (private mode); the wall still works */
  }
}

function freshPending() {
  const now = Date.now();
  const list = readJSON(PENDING_KEY, []);
  return Array.isArray(list)
    ? list.filter((n) => n && now - (n.savedAt ?? 0) < PENDING_TTL_MS)
    : [];
}

const cardStyles = ["paper-ivory", "paper-sage", "paper-blush"];

export default function GuestbookPreview() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [notice, setNotice] = useState("");
  const [notes, setNotes] = useState([]);
  const [pending, setPending] = useState(() => freshPending());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadNotes = useCallback(async () => {
    if (!supabase) {
      if (mounted.current) {
        setNotice("The guestbook isn't connected yet.");
        setLoading(false);
      }
      return;
    }

    const { data, error } = await supabase
      .from("wedding_notes")
      .select("id, guest_name, message, created_at")
      .order("created_at", { ascending: false });

    if (!mounted.current) return;

    if (error) {
      console.error("Could not load wishes:", error);
      setLoadError(true);
      setLoading(false);
      return;
    }

    const approved = data ?? [];
    setNotes(approved);
    setLoadError(false);

    // Once a note is approved it shows up in the real list, so drop the
    // local "awaiting approval" copy of it.
    const stillPending = freshPending().filter(
      (p) =>
        !approved.some(
          (n) => n.guest_name === p.guest_name && n.message === p.message
        )
    );
    writeJSON(PENDING_KEY, stillPending);
    setPending(stillPending);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  function retryLoad() {
    setLoading(true);
    setLoadError(false);
    loadNotes();
  }

  async function submitWish(event) {
    event.preventDefault();
    setNotice("");

    if (!supabase) {
      setNotice("The guestbook isn't connected yet.");
      return;
    }

    const guestName = name.trim();
    const guestMessage = message.trim();

    if (!guestName || !guestMessage) {
      setNotice("Please add your name and a little message.");
      return;
    }

    // Bots fill hidden fields; pretend it worked and drop it.
    if (honeypot) {
      setName("");
      setMessage("");
      setFormOpen(false);
      return;
    }

    const last = Number(readJSON(COOLDOWN_KEY, 0)) || 0;
    const wait = COOLDOWN_MS - (Date.now() - last);
    if (wait > 0) {
      setNotice(
        `Lovely! Please give it ${Math.ceil(wait / 1000)} seconds before sending another note.`
      );
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("wedding_notes").insert({
      guest_name: guestName,
      message: guestMessage,
    });

    if (!mounted.current) return;
    setSubmitting(false);

    if (error) {
      console.error("Could not submit wish:", error);
      setNotice(
        "Your note couldn't be sent just now. Your words are still here, so please try again."
      );
      return;
    }

    writeJSON(COOLDOWN_KEY, Date.now());

    const localCopy = {
      id: `local-${Date.now()}`,
      guest_name: guestName,
      message: guestMessage,
      savedAt: Date.now(),
    };
    const nextPending = [localCopy, ...freshPending()].slice(0, 5);
    writeJSON(PENDING_KEY, nextPending);
    setPending(nextPending);

    setName("");
    setMessage("");
    setFormOpen(false);
    setNotice(
      "Your love note has been sent for approval. Until then it's pinned here, just for you ♡"
    );
  }

  const featuredNote = notes[0];
  const wallNotes = notes.slice(1);
  const hasAnything = notes.length > 0 || pending.length > 0;

  return (
    <div className="wall-love">
      <div className="wall-love-intro">
        <div className="wall-love-flower" aria-hidden="true">
          ❀
        </div>

        <p className="eyebrow">A LITTLE LOVE, LEFT HERE FOREVER</p>

        <h3>
          A wall of
          <br />
          <em>warm wishes.</em>
        </h3>

        <p className="wall-love-description">
          Little notes, big feelings, and all the love you send their way.
          Every blessing becomes a part of Ankita and Durgesh's story.
        </p>

        <div className="wall-love-count">
          <span className="wall-love-count-number">
            {loading ? "…" : notes.length}
          </span>
          <span>
            {notes.length === 1
              ? "blessing on the wall"
              : "blessings on the wall"}
          </span>
          <span className="wall-count-heart">♡</span>
        </div>

        <button
          type="button"
          className="wall-write-button"
          onClick={() => {
            setFormOpen((value) => !value);
            setNotice("");
          }}
          aria-expanded={formOpen}
          aria-controls="wall-love-form"
        >
          <Heart size={17} />
          {formOpen ? "Close your note" : "Leave a little love"}
          <span aria-hidden="true">{formOpen ? "−" : "+"}</span>
        </button>

        <p className="wall-love-footnote">
          Every message is reviewed before it joins the wall.
        </p>
      </div>

      {/* Everything on the right lives in one column, so opening the form or
          showing a status message can no longer push the notes into the
          narrow left column. */}
      <div className="wall-love-main">
        {formOpen && (
          <div className="wall-form-backdrop">
            <form
              id="wall-love-form"
              className="wall-love-form"
              onSubmit={submitWish}
            >
              <div className="wall-form-heading">
                <span className="wall-form-stamp" aria-hidden="true">
                  ♡
                </span>
                <div>
                  <p className="eyebrow">A NOTE FOR THE HAPPY COUPLE</p>
                  <h4>Write from the heart.</h4>
                </div>
              </div>

              <label htmlFor="wall-guest-name">Your name</label>
              <input
                id="wall-guest-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                placeholder="Who is sending the love?"
                autoComplete="name"
                required
                disabled={submitting}
              />

              <label htmlFor="wall-guest-message">Your blessing</label>
              <textarea
                id="wall-guest-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={1000}
                rows={5}
                placeholder="A wish, a memory, or a few words for their forever…"
                required
                disabled={submitting}
              />

              {/* Hidden spam trap. Real guests never see or fill this. */}
              <input
                className="wall-hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                name="website"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />

              <div className="wall-form-bottom">
                <span>{message.length}/1000 characters</span>
                <button
                  type="submit"
                  className="wall-submit-button"
                  disabled={submitting}
                >
                  {submitting ? "Sending love…" : "Send your blessing"}
                  <Heart size={15} />
                </button>
              </div>

              {notice && (
                <p
                  className="wall-form-notice"
                  role="status"
                  aria-live="polite"
                >
                  {notice}
                </p>
              )}
            </form>
          </div>
        )}

        {!formOpen && notice && (
          <p className="wall-status-message" role="status" aria-live="polite">
            {notice}
          </p>
        )}

        <div className="wall-love-content">
          <div className="wall-love-section-heading">
            <div>
              <p className="eyebrow">FROM THE PEOPLE WE LOVE</p>
              <h4>
                Little notes, <em>lasting memories.</em>
              </h4>
            </div>

            <span className="wall-love-decor" aria-hidden="true">
              ✳
            </span>
          </div>

          {loading ? (
            <div className="wall-love-empty">
              <span className="wall-empty-flower">✿</span>
              <p>Gathering all the lovely wishes…</p>
            </div>
          ) : loadError && !hasAnything ? (
            <div className="wall-love-empty">
              <span className="wall-empty-flower">❀</span>
              <h4>The wall is resting for a moment.</h4>
              <p>We couldn't fetch the wishes just now. Please try again.</p>
              <button
                type="button"
                className="wall-empty-button"
                onClick={retryLoad}
              >
                Try again <ArrowDownRight size={15} />
              </button>
            </div>
          ) : !hasAnything ? (
            <div className="wall-love-empty">
              <span className="wall-empty-flower">❀</span>
              <h4>The wall is waiting for its first wish.</h4>
              <p>
                Leave a blessing for Ankita and Durgesh and help their wall
                of love begin.
              </p>
              <button
                type="button"
                className="wall-empty-button"
                onClick={() => setFormOpen(true)}
              >
                Write the first note <ArrowDownRight size={15} />
              </button>
            </div>
          ) : (
            <div className="wall-love-grid">
              {pending.map((note) => (
                <article
                  className="wall-note wall-note-pending paper-ivory"
                  key={note.id}
                >
                  <div className="wall-note-topline">
                    <span>✦ AWAITING APPROVAL</span>
                    <span className="wall-note-flower" aria-hidden="true">
                      ❀
                    </span>
                  </div>

                  <span className="wall-note-quote" aria-hidden="true">
                    “
                  </span>

                  <p className="wall-note-message">{note.message}</p>

                  <div className="wall-note-footer">
                    <span className="wall-note-rule" />
                    <span className="wall-note-author">
                      {note.guest_name}
                    </span>
                  </div>

                  <span className="wall-note-badge">
                    Only you can see this for now
                  </span>
                </article>
              ))}

              {featuredNote && (
                <article className="wall-note wall-note-featured paper-ivory">
                  <div className="wall-note-topline">
                    <span>✦ A SPECIAL WISH</span>
                    <span className="wall-note-flower" aria-hidden="true">
                      ❀
                    </span>
                  </div>

                  <span className="wall-note-quote" aria-hidden="true">
                    “
                  </span>

                  <p className="wall-note-message">{featuredNote.message}</p>

                  <div className="wall-note-footer">
                    <span className="wall-note-rule" />
                    <span className="wall-note-author">
                      With love, {featuredNote.guest_name}
                    </span>
                    <span className="wall-note-heart">♡</span>
                  </div>

                  <span className="wall-note-postmark" aria-hidden="true">
                    MADE WITH LOVE
                    <br />
                    DECEMBER 2026
                  </span>
                </article>
              )}

              {wallNotes.map((note, index) => (
                <article
                  className={`wall-note ${
                    cardStyles[index % cardStyles.length]
                  }`}
                  key={note.id}
                >
                  <div className="wall-note-topline">
                    <span>WITH LOVE ♡</span>
                    <span className="wall-note-flower" aria-hidden="true">
                      {index % 2 === 0 ? "✿" : "❀"}
                    </span>
                  </div>

                  <span className="wall-note-quote" aria-hidden="true">
                    “
                  </span>

                  <p className="wall-note-message">{note.message}</p>

                  <div className="wall-note-footer">
                    <span className="wall-note-rule" />
                    <span className="wall-note-author">
                      {note.guest_name}
                    </span>
                  </div>

                  <span className="wall-note-heart" aria-hidden="true">
                    ♡
                  </span>
                </article>
              ))}

              <button
                type="button"
                className="wall-add-card"
                onClick={() => {
                  setFormOpen(true);
                  setNotice("");
                }}
              >
                <span className="wall-add-card-icon">+</span>
                <span className="wall-add-card-title">
                  Your words belong here.
                </span>
                <span className="wall-add-card-copy">
                  Add another little piece of love to their story.
                </span>
                <span className="wall-add-card-link">
                  Leave a blessing <ArrowDownRight size={15} />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
