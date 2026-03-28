import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MiniAudioPlayer.module.css";

interface MiniAudioPlayerProps {
  title: string;
  subtitle?: string;
  artworkUrl: string;
  audioUrl: string;
  className?: string;
}

export function MiniAudioPlayer({
  title,
  subtitle,
  artworkUrl,
  audioUrl,
  className,
}: MiniAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.preload = "metadata";

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [audioUrl]);

  const rootClassName = useMemo(
    () => [styles.player, className].filter(Boolean).join(" "),
    [className],
  );

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("[MiniAudioPlayer] Failed to play audio", error);
      setIsPlaying(false);
    }
  };

  return (
    <section className={rootClassName}>
      <img className={styles.artwork} src={artworkUrl} alt="" />
      <div className={styles.meta}>
        <div className={styles.title} title={title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={handleTogglePlay}
        aria-label={isPlaying ? "Pause BGM" : "Play BGM"}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </section>
  );
}
