import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { NewsItem } from "../hooks/useCoffeeNews";
import { getDebugWeekdayTracks } from "../data/debugMondayTracks";
import { CoffeeNews } from "./CoffeeNews";
import { MiniAudioPlayer } from "./MiniAudioPlayer";
import styles from "./FinishCard.module.css";

interface Props {
  stepIndex: number;
  totalSteps: number;
  news: NewsItem[];
  newsLoading: boolean;
  showDebugBgmPlayer: boolean;
}

const debugTracks = getDebugWeekdayTracks();

export function FinishCard({
  stepIndex,
  totalSteps,
  news,
  newsLoading,
  showDebugBgmPlayer,
}: Props) {
  const { t } = useTranslation();
  const [trackIndex, setTrackIndex] = useState(0);
  const currentTrack = debugTracks[trackIndex] ?? debugTracks[0];

  const handleNextTrack = () => {
    if (debugTracks.length <= 1) {
      return;
    }

    setTrackIndex((prevIndex) => (prevIndex + 1) % debugTracks.length);
  };

  return (
    <section className={`card ${styles.finishCard}`}>
      <div className={styles.stepMeta}>
        STEP {stepIndex + 1} / {totalSteps}
      </div>
      <div className={styles.stepVerb}>{t("timer.finish")}</div>
      <div className={styles.stepSub}>{t("timer.enjoyCoffee")}</div>
      {showDebugBgmPlayer && currentTrack && (
        <MiniAudioPlayer
          className={styles.bgmPlayer}
          track={currentTrack}
          onNextTrack={handleNextTrack}
        />
      )}
      <div className={styles.extras}>
        <CoffeeNews news={news} loading={newsLoading} />
      </div>
    </section>
  );
}
