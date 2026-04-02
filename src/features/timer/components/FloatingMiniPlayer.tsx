import type { AudioTrack } from "../data/bgm";
import { MiniAudioPlayer } from "./MiniAudioPlayer";
import styles from "./FloatingMiniPlayer.module.css";

interface FloatingMiniPlayerProps {
  track: AudioTrack;
  onNextTrack: (trigger: "manual" | "ended") => void;
  onTrackPlaybackStarted: () => void;
}

export function FloatingMiniPlayer({
  track,
  onNextTrack,
  onTrackPlaybackStarted,
}: FloatingMiniPlayerProps) {
  return (
    <div className={styles.shell}>
      <MiniAudioPlayer
        className={styles.player}
        track={track}
        onNextTrack={onNextTrack}
        onTrackPlaybackStarted={onTrackPlaybackStarted}
      />
    </div>
  );
}
