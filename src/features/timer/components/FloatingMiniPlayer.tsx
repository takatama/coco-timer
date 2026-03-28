import type { AudioTrack } from "../data/debugMondayTracks";
import { MiniAudioPlayer } from "./MiniAudioPlayer";
import styles from "./FloatingMiniPlayer.module.css";

interface FloatingMiniPlayerProps {
  track: AudioTrack;
  onNextTrack: () => void;
}

export function FloatingMiniPlayer({ track, onNextTrack }: FloatingMiniPlayerProps) {
  return (
    <div className={styles.shell}>
      <MiniAudioPlayer
        className={styles.player}
        track={track}
        onNextTrack={onNextTrack}
      />
    </div>
  );
}
