import { formatTime } from "../../recipe/waterCalc";

interface Props {
  remainingSeconds: number;
  progress: number;
  isImminent: boolean;
}

export function Countdown({ remainingSeconds, progress, isImminent }: Props) {
  return (
    <>
      <div className="step-time">
        {formatTime(Math.max(0, Math.ceil(remainingSeconds)))}
      </div>
      <div className="progress">
        <div
          className={`progress-fill${isImminent ? " imminent" : ""}`}
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>
    </>
  );
}
