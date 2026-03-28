import { useEffect, useMemo, useRef, useState } from "react";
import type { AudioTrack } from "../data/debugMondayTracks";
import styles from "./MiniAudioPlayer.module.css";

interface MiniAudioPlayerProps {
  track: AudioTrack;
  className?: string;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
}

export function MiniAudioPlayer({
  track,
  className,
  onNextTrack,
  onPrevTrack,
}: MiniAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const shouldResumePlayback = isPlayingRef.current;
    const audio = new Audio(track.audioUrl);
    audio.preload = "metadata";

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    if (isPlaying) {
      audio.play().catch((error: unknown) => {
        console.error("[MiniAudioPlayer] Failed to resume audio", error);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [track.audioUrl]);

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
      <img className={styles.artwork} src={track.artworkUrl} alt="" />
      <div className={styles.meta}>
        <div className={styles.title} title={track.title}>{track.title}</div>
        <div className={styles.subtitle}>{track.subtitle}</div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause BGM" : "Play BGM"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        {onPrevTrack && (
          <button
            type="button"
            className={styles.navButton}
            onClick={onPrevTrack}
            aria-label="Previous track"
          >
            Prev
          </button>
        )}
        {onNextTrack && (
          <button
            type="button"
            className={styles.navButton}
            onClick={onNextTrack}
            aria-label="Next track"
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
}
