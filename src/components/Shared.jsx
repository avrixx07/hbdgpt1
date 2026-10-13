import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
export function Button({ children, onClick, className = "", ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      className={`button ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
      <ArrowUpRight size={16} />
    </motion.button>
  );
}
export function Section({ id, index, label, title, children, className = "" }) {
  return (
    <section
      id={id}
      className={`story-section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="section-inner">
        <div className="eyebrow reveal">
          BAB {String(index).padStart(2, "0")} <span /> {label}
        </div>
        <h2 id={`${id}-title`} className="reveal">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
export function Next({ to, text = "Lanjut ke halaman berikutnya" }) {
  return (
    <a className="next-page" href={`#${to}`} aria-label={text}>
      <span>{text}</span>
      <ArrowDown size={15} />
    </a>
  );
}
export function Modal({ children, onClose, label }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const all = ref.current.querySelectorAll(
          'button:not(:disabled),a[href],input:not(:disabled),[tabindex="0"]',
        );
        if (!all.length) {
          e.preventDefault();
          return;
        }
        const first = all[0],
          last = all[all.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose} aria-label="Tutup">
          <X />
        </button>
        {children}
      </motion.div>
    </div>,
    document.body,
  );
}
export function Photo({ src, alt, ...props }) {
  return (
    <img
      src={src || "/images/fallback.svg"}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/images/fallback.svg";
      }}
      loading="lazy"
      {...props}
    />
  );
}
export function FloatingDecorations() {
  return (
    <div className="decorations" aria-hidden="true">
      <span className="float heart one">♡</span>
      <span className="float star two">✧</span>
      <span className="float flower three">✿</span>
      <span className="float heart four">♡</span>
      <span className="float star five">✧</span>
      <span className="float flower six">✧</span>
    </div>
  );
}
export function Confetti({ burst, enabled }) {
  if (!burst || !enabled) return null;
  return (
    <div className="confetti" key={burst} aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => (
        <i
          key={i}
          style={{
            "--x": `${((i * 37) % 101) - 50}vw`,
            "--r": `${i * 53}deg`,
            "--d": `${(i % 6) * 0.06}s`,
            background: ["#d991af", "#f3d8a7", "#bba5c8", "#e8a7ba"][i % 4],
          }}
        />
      ))}
    </div>
  );
}
