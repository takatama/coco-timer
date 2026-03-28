import { useEffect, useMemo, useRef, useState } from "react";
import type { AudioTrack } from "../data/debugMondayTracks";
import styles from "./MiniAudioPlayer.module.css";

interface MiniAudioPlayerProps {
  track: AudioTrack;
  className?: string;
  onNextTrack?: () => void;
}

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

function PlayIcon({ size = 18, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <polygon
        points="6 3 20 12 6 21 6 3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon({ size = 18, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <line x1="8" y1="4" x2="8" y2="20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="16" y1="4" x2="16" y2="20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function SkipForwardIcon({ size = 18, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <polygon
        points="5 4 15 12 5 20 5 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function MiniAudioPlayer({
  track,
  className,
  onNextTrack,
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

    if (shouldResumePlayback) {
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
          className={styles.iconButton}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause BGM" : "Play BGM"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        {onNextTrack && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={onNextTrack}
            aria-label="Next track"
          >
            <SkipForwardIcon />
          </button>
        )}
      </div>
    </section>
  );
}
