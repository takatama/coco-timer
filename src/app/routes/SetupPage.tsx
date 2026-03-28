import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSessionStore } from "../../features/timer/store";
import { useSettingsStore } from "../../features/settings/store";
import { newHybridMethod, computeSteps, getTotalWater } from "../../features/recipe";
import type { FlavorProfile } from "../../features/recipe";
import { CoffeeNews } from "../../features/timer/components/CoffeeNews";
import { MiniAudioPlayer } from "../../features/timer/components/MiniAudioPlayer";
import { Timeline } from "../../features/timer/components/Timeline";
import { useCoffeeNews } from "../../features/timer/hooks/useCoffeeNews";
import { getDebugWeekdayTracks } from "../../features/timer/data/debugMondayTracks";
import styles from "./SetupPage.module.css";
import { getEquipmentItems, type SupportedLanguage } from "../../shared/affiliate/amazon";
const heroImage = "/assets/images/goran-ivos-1JsjRW6Sbwg-unsplash.jpg";

const validFlavors: FlavorProfile[] = ["sweet", "neutral", "sour"];

export function SetupPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { beans, flavor, setBeans, setFlavor } = useSessionStore();
  const { debugEnabled, bgmEnabled, language } = useSettingsStore();
  const { news, loading: newsLoading } = useCoffeeNews(language, debugEnabled);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Apply URL parameters on mount (e.g. ?beans=25&flavor=sweet)
  useEffect(() => {
    const beansParam = searchParams.get("beans");
    if (beansParam) {
      const n = parseInt(beansParam, 10);
      if (!isNaN(n) && n > 0) setBeans(n);
    }
    const flavorParam = searchParams.get("flavor");
    if (flavorParam && validFlavors.includes(flavorParam as FlavorProfile)) {
      setFlavor(flavorParam as FlavorProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang: SupportedLanguage = i18n.language === "ja" ? "ja" : "en";
  const steps = computeSteps(newHybridMethod, beans, flavor);
  const totalWater = getTotalWater(beans, newHybridMethod.waterRatio);
  const stepLabels: string[] = t("stepLabels", { returnObjects: true }) as string[];
  const equipment = getEquipmentItems(lang);

  const handleStart = () => {
    navigate("/timer?autostart=1");
  };

  const flavorOptions: FlavorProfile[] = ["sweet", "neutral", "sour"];
  const debugMondayTrack = getDebugWeekdayTracks()[0];

  return (
    <main className="content">
      <section className="card">
        <div className="card-title">{t("setup.beans")}</div>
        <div className={styles.stepperRow}>
          <button
            className={styles.btnIcon}
            onClick={() => setBeans(Math.max(1, beans - 1))}
            aria-label="decrease"
          >
            −
          </button>
          <div className={styles.beansValue}>{beans}g</div>
          <button
            className={styles.btnIcon}
            onClick={() => setBeans(beans + 1)}
            aria-label="increase"
          >
            ＋
          </button>
        </div>
      </section>

      <section className="card">
        <div className="card-title">{t("setup.flavor")}</div>
        <div className="choice-row">
          {flavorOptions.map((f) => (
            <button
              key={f}
              className={`choice${flavor === f ? " active" : ""}`}
              onClick={() => setFlavor(f)}
            >
              {t(`setup.${f}`)}
            </button>
          ))}
        </div>
      </section>

      <button className={styles.btnPrimary} onClick={handleStart}>
        {t("setup.start")}
      </button>

      <section className={`card ${styles.timelineCard}`}>
        <div className="card-title">{t("timer.timeline")}</div>
        <div className={styles.timelineHint}>
          {t("setup.water")}: {totalWater}g
        </div>
        <Timeline
          steps={steps}
          currentStepIndex={0}
          currentTime={0}
          hideCard
        />
      </section>

      <details className="card" open={detailsOpen} onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}>
        <summary className={styles.detailsSummary}>
          <span>{t("setup.details")}</span>
          <span className={styles.detailsSummaryLink}>
            {detailsOpen ? t("setup.closeAction") : t("setup.detailsAction")}
          </span>
        </summary>
        <div className={styles.detailsBody}>
          <img
            className={styles.detailsImage}
            src={heroImage}
            alt="New Hybrid Method"
          />
          <div className={styles.detailsText}>{t("intro.description")}</div>
          <div>
            <div className={styles.detailsSubTitle}>{t("setup.steps")}</div>
            <div className={styles.stepList}>
              {steps.map((step, idx) => (
                <div key={`${step.timeSec}-${step.actionType}`} className={styles.stepItem}>
                  <span>
                    Step {idx + 1}: {stepLabels[idx] ?? ""}
                  </span>
                  <span>{step.cumulative}g</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.detailsVideo}>
            <iframe
              src="https://www.youtube.com/embed/4FeUp_zNiiY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </details>

      <section className={`card ${styles.equipmentCard}`} aria-labelledby="label-equipment">
        <div className={styles.equipmentHeader}>
          <h2 className={`card-title ${styles.equipmentTitle}`}>{t("setup.equipment")}</h2>
        </div>
        <ul className={styles.equipmentList}>
          {equipment.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {debugEnabled && (
        <>
          {bgmEnabled && debugMondayTrack && (
            <section className="card">
              <MiniAudioPlayer track={debugMondayTrack} />
            </section>
          )}
          <section className="card">
            <CoffeeNews news={news} loading={newsLoading} />
          </section>
        </>
      )}

    </main>
  );
}
