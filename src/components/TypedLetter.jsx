import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Keep Unicode characters (including combined emoji) together while revealing text.
function characters(text) {
  if (typeof Intl.Segmenter === "function") {
    return Array.from(
      new Intl.Segmenter("id", { granularity: "grapheme" }).segment(text),
      (part) => part.segment,
    );
  }
  return Array.from(text);
}

export function TypedLetter({ config }) {
  const reduced = useReducedMotion();
  const paragraphs = useMemo(
    () => config.letter.map(characters),
    [config.letter],
  );
  const total = paragraphs.reduce(
    (sum, paragraph) => sum + paragraph.length,
    0,
  );
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const complete = reduced || skipped || count >= total;
  const configuredSpeed = Number(config.letterTypingSpeed);
  const speed = Number.isFinite(configuredSpeed)
    ? Math.max(8, Math.min(120, configuredSpeed))
    : 24;

  useEffect(() => {
    if (complete) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.max(0, performance.now() - start - 350);
      setCount(Math.min(total, Math.floor(elapsed / speed)));
    }, 32);
    return () => window.clearInterval(timer);
  }, [complete, speed, total]);

  let offset = 0;
  return (
    <article className="readable-letter">
      <span className="eyebrow">SEBUAH SURAT KECIL ♡</span>
      <h3>Untuk {config.recipientName},</h3>
      {!reduced && (
        <div className="letter-typing-controls">
          <span role="status">
            {complete
              ? "Semua kata sudah sampai ke kamu ♡"
              : "Sedang menulis untukmu…"}
          </span>
          <button
            type="button"
            className="text-button"
            onClick={() => setSkipped(true)}
            disabled={complete}
          >
            {complete ? "Surat lengkap" : "Tampilkan semua"}
          </button>
        </div>
      )}
      {/* Assistive readers get the complete letter without announcements per character. */}
      <div className="sr-only">
        {config.letter.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
      <div
        className="typed-letter-body"
        aria-hidden="true"
        data-complete={Boolean(complete)}
      >
        {paragraphs.map((chars, i) => {
          const start = offset;
          offset += chars.length;
          const shown = complete
            ? chars.length
            : Math.max(0, Math.min(chars.length, count - start));
          const active = !complete && count >= start && count < offset;
          return (
            <p key={i} className="typed-paragraph">
              <span className="typed-visible">
                {chars.slice(0, shown).join("")}
              </span>
              {active && <span className="typing-caret" />}
              <span className="typed-pending">
                {chars.slice(shown).join("")}
              </span>
            </p>
          );
        })}
      </div>
      <p
        className={`signature ${complete ? "" : "signature-pending"}`}
        aria-hidden={!complete}
      >
        Dengan seluruh cintaku,
        <br />
        {config.senderName} ♡
      </p>
    </article>
  );
}
