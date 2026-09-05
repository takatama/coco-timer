import { formatTime } from "../../recipe/waterCalc";
import { TimerProgress } from "../../../shared/brew-timer";
import styles from "./Countdown.module.css";

interface Props {
  remainingSeconds: number;
  progress: number;
  isImminent: boolean;
}

export function Countdown({ remainingSeconds, progress, isImminent }: Props) {
  return (
    <>
      <div className={styles.stepTime} role="timer" aria-live="polite">
        {formatTime(Math.max(0, Math.ceil(remainingSeconds)))}
      </div>
      <TimerProgress progress={progress} isImminent={isImminent} />
    </>
  );
}
