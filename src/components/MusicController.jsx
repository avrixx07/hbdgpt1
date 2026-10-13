import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { Volume2, VolumeX } from "lucide-react";
export const MusicController = forwardRef(function MusicController(
  { config },
  ref,
) {
  const audio = useRef(),
    frame = useRef(),
    context = useRef(),
    muted = useRef(false);
  const [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  const play = async () => {
    if (!config.enableMusic || muted.current) return;
    try {
      audio.current.volume = 0;
      await audio.current.play();
      setPlaying(true);
      setFailed(false);
      cancelAnimationFrame(frame.current);
      const start = performance.now();
      const fade = (now) => {
        if (!audio.current) return;
        audio.current.volume = Math.min(0.3, ((now - start) / 2500) * 0.3);
        if (now - start < 2500) frame.current = requestAnimationFrame(fade);
      };
      frame.current = requestAnimationFrame(fade);
    } catch {
      setFailed(true);
      setPlaying(false);
    }
  };
  useImperativeHandle(ref, () => ({
    start: play,
    sound: () => {
      if (!config.enableMusic || muted.current) return;
      try {
        context.current ??= new (
          window.AudioContext || window.webkitAudioContext
        )();
        const c = context.current;
        c.resume().catch(() => {});
        const o = c.createOscillator(),
          g = c.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(660, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.18);
        g.gain.setValueAtTime(0.035, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        o.connect(g);
        g.connect(c.destination);
        o.start();
        o.stop(c.currentTime + 0.32);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      } catch {
        /* Audio is optional. */
      }
    },
  }));
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      context.current?.close();
    },
    [],
  );
  if (!config.enableMusic) return null;
  return (
    <>
      <audio
        ref={audio}
        src={config.backgroundMusic}
        loop
        preload="none"
        onError={() => {
          setFailed(true);
          setPlaying(false);
        }}
      />
      <button
        className="music-control"
        aria-label={playing ? "Matikan musik" : "Putar musik"}
        aria-pressed={playing}
        onClick={() => {
          if (playing) {
            muted.current = true;
            cancelAnimationFrame(frame.current);
            audio.current.pause();
            setPlaying(false);
          } else {
            muted.current = false;
            play();
          }
        }}
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>
          {failed
            ? "Musik tidak tersedia"
            : playing
              ? "Musik menyala"
              : "Sedikit musik?"}
        </span>
      </button>
    </>
  );
});
