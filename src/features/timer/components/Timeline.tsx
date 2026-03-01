import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState } from "react";
import type { ComputedStep } from "../../recipe/types";
import { formatTime } from "../../recipe/waterCalc";

interface Props {
  steps: ComputedStep[];
  currentStepIndex: number;
  currentTime: number;
}

export function Timeline({ steps, currentStepIndex, currentTime }: Props) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const totalTime = steps.length > 0 ? steps[steps.length - 1].timeSec : 0;
  const pad = 18;
  const lineWidth = Math.max(0, width - pad * 2);
  const stepLabels: string[] = t("stepLabels", { returnObjects: true }) as string[];

  const nowRatio = totalTime ? currentTime / totalTime : 0;
  const nowLeft = pad + lineWidth * nowRatio;

  return (
    <section className="card timeline-card">
      <div className="card-title">{t("timer.timeline")}</div>
      <div className="stepper" ref={containerRef}>
        <div className="timeline-line" />
        <div
          className="timeline-now"
          style={{ left: `${nowLeft}px` }}
        >
          ▶
        </div>
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const classes = [
            "step",
            index % 2 === 0 ? "odd" : "even",
            isCurrent ? "current" : "",
            isCompleted ? "completed" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const ratio = totalTime ? step.timeSec / totalTime : 0;
          const leftPx = pad + lineWidth * ratio;
          return (
            <div key={index} className={classes} style={{ left: `${leftPx}px` }}>
              <div className="timeline-time">{formatTime(step.timeSec)}</div>
              <div className="timeline-label">
                {stepLabels[index] ?? ""}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
