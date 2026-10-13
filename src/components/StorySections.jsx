import { TypedLetter } from "./TypedLetter";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Section, Button, Next, Modal, Photo } from "./Shared";
import { Cake, Bow, Gift, Hug } from "./Illustrations";
function Title({ lines }) {
  return (
    <>
      {lines[0]}
      <br />
      <em>{lines[1]}</em>
    </>
  );
}
export function HeroSection({ config, onStart }) {
  return (
    <section
      id="opening"
      className="story-section hero"
      aria-labelledby="hero-title"
    >
      <div className="hero-side left-note">
        a little more love,
        <br />a little more you.<span>↘</span>
      </div>
      <div className="hero-content">
        <div className="eyebrow hero-eyebrow">
          <span /> A TINY SURPRISE, MADE WITH LOVE <span />
        </div>
        <div className="hero-title">
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {config.heroTitle.split("\n").map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </motion.h1>
          <span className="title-star">✧</span>
        </div>
        <p className="hero-subtitle">
          {config.heroSubtitle} <span>♡</span>
        </p>
        <div className="hero-art">
          {/* GSAP owns the outer scroll layer; Motion owns only this entrance. */}
          <motion.div
            className="hero-art-entrance"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1.5, delay: 0.2 }}
          >
            <span className="art-ring" />
            <Bow className="hero-bow" />
            <Cake lit />
            <span className="cake-note">
              dibuat dengan cinta
              <br />
              <span>↖</span> khusus buat kamu
            </span>
            <span className="birthday-stamp">
              HAPPY
              <br />
              <b>BIRTHDAY</b>
              <br />
              TO YOU ♡
            </span>
          </motion.div>
        </div>
        <Button onClick={onStart}>
          Buka Kejutan Kecilmu <Heart size={15} />
        </Button>
        <p className="handwritten tiny-note">
          psst… ada banyak sayang di dalamnya.
        </p>
      </div>
      <div className="hero-side right-note">
        <span className="sticker-flower">✿</span>untuk manusia
        <br />
        favoritku.
      </div>
      <div className="hero-bottom">
        <span>SEBUAH CERITA KECIL TENTANG KITA</span>
        <a href="#birthday">
          Gulir pelan-pelan <span>↓</span>
        </a>
        <span>01 — 07</span>
      </div>
    </section>
  );
}
export function BirthdayCalendar({ config, sound }) {
  const [surprise, setSurprise] = useState(false);
  const [flips, setFlips] = useState(0);
  const ref = useRef();
  const reduced = useReducedMotion();
  const date = new Date(`${config.birthdayDate}T12:00:00`);
  const valid = !Number.isNaN(date.getTime());
  const d = valid ? date : new Date(2005, 0, 1);
  const year = d.getFullYear(),
    month = d.getMonth(),
    day = d.getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  useEffect(() => {
    if (reduced) return;
    let timer;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let n = 0;
          timer = setInterval(() => {
            setFlips(++n);
            if (n === 8) clearInterval(timer);
          }, 95);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [reduced]);
  return (
    <Section
      id="birthday"
      index={2}
      label="HARI DUNIA JADI LEBIH MANIS"
      title={<Title lines={config.copy.birthdayTitle} />}
      className="calendar-section"
    >
      <p className="section-copy reveal">{config.calendarMessage}</p>
      <div className="calendar-wrap" ref={ref}>
        <div
          className="calendar-paper"
          style={{ transform: `rotate(${flips % 2 ? "-2" : "-3"}deg)` }}
        >
          <span className="tape" />
          <div className="calendar-heading">
            <span>
              {new Intl.DateTimeFormat("id-ID", { month: "long" }).format(d)}
            </span>
            <span>{year}</span>
          </div>
          <div className="calendar-grid">
            {["S", "S", "R", "K", "J", "S", "M"].map((v, i) => (
              <b key={i}>{v}</b>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`space${i}`} />
            ))}
            {Array.from({ length: count }, (_, i) => (
              <span className={i + 1 === day ? "special-date" : ""} key={i}>
                {i + 1 === day ? (
                  <>
                    <svg viewBox="0 0 60 55" aria-hidden="true">
                      <path d="M30 48C-13 22 9-5 29 12 49-10 74 22 30 48Z" />
                    </svg>
                    {flips > 0 && flips < 8 ? flips : day}
                  </>
                ) : (
                  i + 1
                )}
              </span>
            ))}
          </div>
          <div className="calendar-footer">
            <span className="calendar-doodle">ini harinya! ♡</span>
            <span className="special-stamp">SPECIAL DAY ✧</span>
          </div>
        </div>
      </div>
      <Button
        className="secondary"
        onClick={() => {
          setSurprise(true);
          sound();
        }}
      >
        Ternyata itu kamu! <Heart size={15} />
      </Button>
      <p className="small-feedback" role="status">
        {surprise
          ? "Selamat ya, kamu resmi naik level jadi makin gemesin!"
          : "Satu tanggal kecil. Seseorang yang berarti besar."}
      </p>
      <Next to="reasons" />
    </Section>
  );
}
export function LoveReasons({ config, sound }) {
  const [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false);
  const move = (direction) => {
    setIndex(
      (v) => (v + direction + config.reasons.length) % config.reasons.length,
    );
    setFlipped(false);
    sound();
  };
  return (
    <Section
      id="reasons"
      index={3}
      label="HAL-HAL KECIL TENTANG KAMU"
      title={<Title lines={config.copy.reasonsTitle} />}
      className="reasons-section"
    >
      <p className="section-copy reveal">{config.copy.reasonsIntro}</p>
      <div className="reason-stack">
        <div className="stack-paper back-one" />
        <div className="stack-paper back-two" />
        <AnimatePresence mode="wait">
          <motion.button
            className={`reason-card ${flipped ? "flipped" : ""}`}
            key={`${index}-${flipped}`}
            initial={{ opacity: 0, rotate: -7, x: 30 }}
            animate={{ opacity: 1, rotate: flipped ? 2 : -2, x: 0 }}
            exit={{ opacity: 0, x: -45, rotate: 5 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 40)
                move(info.offset.x < 0 ? 1 : -1);
            }}
            onClick={() => {
              setFlipped((v) => !v);
              sound();
            }}
            aria-label={`Balik kartu alasan ${index + 1}`}
          >
            <span className="reason-number">
              ALASAN NO. {String(index + 1).padStart(2, "0")}
            </span>
            {flipped ? (
              <>
                <Hug />
                <span className="handwritten">kamu + aku = rumah ♡</span>
              </>
            ) : (
              <>
                <Heart className="reason-heart" strokeWidth={1} />
                <p>“{config.reasons[index]}”</p>
              </>
            )}
            <span className="card-hint">sentuh untuk membalik ↻</span>
          </motion.button>
        </AnimatePresence>
        <span className="reason-sticker">
          100%
          <br />
          sayang
        </span>
      </div>
      <div className="card-navigation">
        <button aria-label="Alasan sebelumnya" onClick={() => move(-1)}>
          <ArrowLeft size={18} />
        </button>
        <div
          className="dots"
          aria-label={`Kartu ${index + 1} dari ${config.reasons.length}`}
        >
          {config.reasons.map((_, i) => (
            <button
              key={i}
              className={i === index ? "active" : ""}
              aria-label={`Alasan ${i + 1}`}
              aria-current={i === index ? "step" : undefined}
              onClick={() => {
                setIndex(i);
                setFlipped(false);
              }}
            />
          ))}
        </div>
        <button aria-label="Alasan berikutnya" onClick={() => move(1)}>
          <ArrowRight size={18} />
        </button>
      </div>
      <Next to="memories" />
    </Section>
  );
}
export function MemoryGallery({ config }) {
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);
  const photos = config.photos.length
    ? config.photos
    : ["/images/fallback.svg"];
  const move = (n) =>
    setSelected((v) => (v + n + photos.length) % photos.length);
  return (
    <Section
      id="memories"
      index={4}
      label="POTONGAN CERITA KITA"
      title={<Title lines={config.copy.memoriesTitle} />}
      className="memory-section"
    >
      <p className="section-copy reveal">{config.copy.memoriesIntro}</p>
      <div className="polaroid-gallery">
        {photos.map((photo, i) => (
          <motion.button
            whileHover={{ y: -12, rotate: 0, zIndex: 5 }}
            whileTap={{ scale: 0.97 }}
            key={`${photo}-${i}`}
            className={`polaroid photo-${i % 4}`}
            onClick={() => setSelected(i)}
            aria-label={`Buka kenangan ${i + 1}`}
          >
            <span className="tape" />
            <Photo
              src={photo}
              alt={config.captions[i] || `Kenangan ${i + 1}`}
            />
            <span>{config.captions[i] || "Cerita kecil kita."}</span>
            <small>0{i + 1} / disimpan di hati</small>
          </motion.button>
        ))}
      </div>
      <p className="handwritten gallery-note">
        beberapa detik yang ingin aku simpan selamanya ♡
      </p>
      <Next to="wish" />
      {selected !== null && (
        <Modal label="Galeri kenangan" onClose={close}>
          <motion.div
            className="memory-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, i) => {
              if (Math.abs(i.offset.x) > 40) move(i.offset.x < 0 ? 1 : -1);
            }}
          >
            <Photo
              src={photos[selected]}
              alt={config.captions[selected] || "Kenangan kita"}
            />
            <p className="handwritten">{config.captions[selected]}</p>
          </motion.div>
          <div className="viewer-nav">
            <button aria-label="Foto sebelumnya" onClick={() => move(-1)}>
              <ArrowLeft />
            </button>
            <span>
              {selected + 1} / {photos.length}
            </span>
            <button aria-label="Foto berikutnya" onClick={() => move(1)}>
              <ArrowRight />
            </button>
          </div>
        </Modal>
      )}
    </Section>
  );
}
export function WishGame({ config, celebrate, sound }) {
  const [step, setStep] = useState(0);
  return (
    <Section
      id="wish"
      index={5}
      label="SATU DOA BAIK UNTUKMU"
      title={
        step === 3 ? (
          <>
            Selamat ulang tahun,
            <br />
            <em>{config.recipientName}!</em>
          </>
        ) : (
          <Title lines={config.copy.wishTitle} />
        )
      }
      className={`wish-section ${step === 3 ? "wished" : ""}`}
    >
      <p className="section-copy" aria-live="polite">
        {step === 0
          ? "Ada satu tugas penting nih… nyalain dulu lilinnya, yuk!"
          : step === 1
            ? "Tutup mata sebentar, terus bikin satu permohonan. Jangan kasih tahu aku ya, nanti nggak jadi kenyataan!"
            : step === 2
              ? "Sudah? Simpan doanya baik-baik. Sekarang, tiup pelan-pelan…"
              : config.wishMessage}
      </p>
      <div className="wish-cake">
        <Cake lit={step === 1 || step === 2} blown={step === 3} />
        <span className="wish-sparkle">✧</span>
      </div>
      <div className="wish-actions">
        {step === 0 ? (
          <Button
            onClick={() => {
              setStep(1);
              sound();
            }}
          >
            Nyalakan Lilinnya <Sparkles size={16} />
          </Button>
        ) : step === 1 ? (
          <Button onClick={() => setStep(2)}>Aku Sudah Bikin Permohonan</Button>
        ) : step === 2 ? (
          <Button
            onClick={() => {
              setStep(3);
              sound();
              celebrate();
            }}
          >
            Tiup Lilinnya!
          </Button>
        ) : (
          <Button className="secondary" onClick={() => setStep(0)}>
            Sekali lagi? <RotateCcw size={15} />
          </Button>
        )}
        <div className="wish-steps">
          {["Nyalakan", "Berdoa", "Tiup"].map((s, i) => (
            <span className={step > i ? "done" : ""} key={s}>
              {i + 1}. {s}
            </span>
          ))}
        </div>
      </div>
      <Next to="letter" />
    </Section>
  );
}
export function LoveLetter({ config, sound }) {
  const [opened, setOpened] = useState(false),
    [visible, setVisible] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const close = useCallback(() => {
    setVisible(false);
    setOpened(false);
  }, []);
  return (
    <Section
      id="letter"
      index={6}
      label="DARI HATIKU, UNTUK HATIMU"
      title={<Title lines={config.copy.letterTitle} />}
      className="letter-section"
    >
      <p className="section-copy reveal">{config.copy.letterIntro}</p>
      <div className={`envelope ${opened ? "opened" : ""}`} aria-hidden="true">
        <div className="letter-paper">
          Untuk {config.recipientName},<br />
          <span>manusia favoritku ♡</span>
        </div>
        <div className="envelope-back" />
        <div className="envelope-flap" />
        <div className="envelope-front" />
        <span className="wax-seal">♡</span>
        <span className="envelope-address">
          dengan segenap sayang,
          <br />
          {config.senderName}
        </span>
      </div>
      <Button
        disabled={opened}
        onClick={() => {
          setOpened(true);
          sound();
          timer.current = setTimeout(() => setVisible(true), 750);
        }}
      >
        Buka Suratnya <Heart size={15} />
      </Button>
      <p className="handwritten tiny-note">dibaca pelan-pelan, ya.</p>
      <Next to="final" />
      {visible && (
        <Modal label="Surat cinta untukmu" onClose={close}>
          <TypedLetter config={config} />
        </Modal>
      )}
    </Section>
  );
}
export function FinalSurprise({ config, celebrate, sound, onReplay }) {
  const [open, setOpen] = useState(false),
    [hug, setHug] = useState(false);
  return (
    <Section
      id="final"
      index={7}
      label="AKHIR CERITA? BELUM TENTU."
      title={
        open ? (
          <>
            {config.finalTitle.split("\n")[0]}
            <br />
            <em>{config.finalTitle.split("\n")[1]}</em>
          </>
        ) : (
          <Title lines={config.copy.giftTitle} />
        )
      }
      className={`final-section ${open ? "final-open" : ""}`}
    >
      <p className="section-copy">
        {open ? config.finalMessage : config.copy.giftIntro}
      </p>
      {!open ? (
        <>
          <Gift />
          <Button
            onClick={() => {
              setOpen(true);
              celebrate();
              sound();
            }}
          >
            Buka Hadiah Terakhirmu
          </Button>
        </>
      ) : (
        <>
          <div className="final-keepsake">
            <Gift open />
            {hug ? (
              <Hug />
            ) : (
              <motion.div
                className="final-photo"
                initial={{ opacity: 0, y: 70, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, type: "spring" }}
              >
                <Photo src={config.photos[0]} alt="Manusia favoritku" />
                <span>kamu adalah hadiah terindah ♡</span>
              </motion.div>
            )}
          </div>
          <div className="ending-actions">
            <Button
              onClick={() => {
                setHug((v) => !v);
                sound();
                celebrate();
              }}
            >
              {hug ? "Simpan Peluknya ♡" : "Peluk Virtual Dulu!"}{" "}
              <Heart size={15} />
            </Button>
            <button
              className="text-button"
              onClick={() => {
                setOpen(false);
                setHug(false);
                onReplay();
              }}
            >
              Ulangi Cerita Kita <RotateCcw size={14} />
            </button>
          </div>
          <span className="sr-only" role="status">
            {hug
              ? "Peluk hangat untukmu. Kamu disayang!"
              : "Hadiah terakhir terbuka."}
          </span>
        </>
      )}
      <p className="handwritten final-signature">{config.copy.closingNote}</p>
    </Section>
  );
}
