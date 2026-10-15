import { useEffect, useRef, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { birthdayConfig as config } from "./data/birthdayConfig";
import {
  HeroSection,
  BirthdayCalendar,
  LoveReasons,
  MemoryGallery,
  WishGame,
  LoveLetter,
  FinalSurprise,
} from "./components/StorySections";
import { FloatingDecorations, Confetti } from "./components/Shared";
import { MusicController } from "./components/MusicController";
gsap.registerPlugin(ScrollTrigger);
const ids = [
  "opening",
  "birthday",
  "reasons",
  "memories",
  "wish",
  "letter",
  "final",
];
export default function BirthdayApp() {
  const root = useRef(),
    music = useRef();
  const [chapter, setChapter] = useState(0),
    [burst, setBurst] = useState(0),
    [story, setStory] = useState(0);
  const reduced = useReducedMotion();
  const go = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  const sound = () => music.current?.sound();
  const celebrate = () => setBurst((v) => v + 1);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter(ids.indexOf(e.target.id));
        }),
      { threshold: 0.55 },
    );
    root.current
      .querySelectorAll(".story-section")
      .forEach((el) => observer.observe(el));
    const ctx = gsap.context(() => {
      if (reduced || !config.enableScrollAnimations) return;
      gsap.utils.toArray(".story-section:not(.hero)").forEach((section) => {
        gsap.from(section.querySelectorAll(".reveal"), {
          y: 28,
          opacity: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
      gsap.utils.toArray(".polaroid").forEach((el, i) =>
        gsap.fromTo(
          el,
          { y: 35 + i * 8 },
          {
            y: -12 - i * 5,
            ease: "none",
            scrollTrigger: {
              trigger: "#memories",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        ),
      );
      gsap.to(".hero-art", {
        y: -45,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);
    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, [reduced, story]);
  return (
    <MotionConfig reducedMotion="user">
      <div ref={root} className="birthday-app">
        <a className="skip-link" href="#birthday">
          Lewati pembuka
        </a>
        <header className="site-header">
          <a className="wordmark" href="#opening">
            <img
              className="wordmark-bow"
              src="/images/bow.svg"
              width="32"
              height="28"
              alt=""
            />{" "}
            our little
            <br />
            <i>birthday story.</i>
          </a>
          <span className="header-note">a keepsake, just for you ♡</span>
          <MusicController config={config} ref={music} />
        </header>
        <FloatingDecorations />
        <main key={story}>
          <HeroSection
            config={config}
            onStart={() => {
              music.current?.start();
              celebrate();
              go("birthday");
            }}
          />
          <BirthdayCalendar config={config} sound={sound} />
          <LoveReasons config={config} sound={sound} />
          <MemoryGallery config={config} />
          <WishGame config={config} sound={sound} celebrate={celebrate} />
          <LoveLetter config={config} sound={sound} />
          <FinalSurprise
            config={config}
            sound={sound}
            celebrate={celebrate}
            onReplay={() => {
              setStory((v) => v + 1);
              setBurst(0);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          />
        </main>
        <nav className="chapter-nav" aria-label="Halaman cerita">
          {config.chapters.map((label, i) => (
            <button
              key={label}
              className={chapter === i ? "current" : ""}
              onClick={() => go(ids[i])}
              aria-label={`Bab ${i + 1}: ${label}`}
              aria-current={chapter === i ? "step" : undefined}
            >
              <span>{label}</span>
              <i />
            </button>
          ))}
        </nav>
        <div
          className="scroll-progress"
          style={{ width: `${((chapter + 1) / 7) * 100}%` }}
        />
        <Confetti burst={burst} enabled={config.enableConfetti && !reduced} />
      </div>
    </MotionConfig>
  );
}
