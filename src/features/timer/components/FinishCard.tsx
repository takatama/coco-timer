import { useTranslation } from "react-i18next";
import type { NewsItem } from "../hooks/useCoffeeNews";
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

const DEBUG_BGM_ARTWORK_URL =
  "https://pub-dafc6a76fed548fc9d46bd2db7bc61b5.r2.dev/artwork/weekday/mon/weekday_mon_clear_01_piano_upbeat.webp";
const DEBUG_BGM_AUDIO_URL =
  "https://pub-dafc6a76fed548fc9d46bd2db7bc61b5.r2.dev/audio/weekday/mon/weekday_mon_clear_01_piano_upbeat.mp3";

export function FinishCard({
  stepIndex,
  totalSteps,
  news,
  newsLoading,
  showDebugBgmPlayer,
}: Props) {
  const { t } = useTranslation();

  return (
    <section className={`card ${styles.finishCard}`}>
      <div className={styles.stepMeta}>
        STEP {stepIndex + 1} / {totalSteps}
      </div>
      <div className={styles.stepVerb}>{t("timer.finish")}</div>
      <div className={styles.stepSub}>{t("timer.enjoyCoffee")}</div>
      {showDebugBgmPlayer && (
        <MiniAudioPlayer
          className={styles.bgmPlayer}
          title="Monday Morning Piano Upbeat"
          subtitle="Monday / Piano / Upbeat"
          artworkUrl={DEBUG_BGM_ARTWORK_URL}
          audioUrl={DEBUG_BGM_AUDIO_URL}
        />
      )}
      <div className={styles.extras}>
        <CoffeeNews news={news} loading={newsLoading} />
      </div>
    </section>
  );
}
