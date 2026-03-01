import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSessionStore } from "../../features/timer/store";
import { useSettingsStore } from "../../features/settings/store";
import { newHybridMethod, computeSteps, getTotalWater } from "../../features/recipe";
import type { FlavorProfile } from "../../features/recipe";
import { CoffeeNews } from "../../features/timer/components/CoffeeNews";
import styles from "./SetupPage.module.css";
const heroImage = "/assets/images/goran-ivos-1JsjRW6Sbwg-unsplash.jpg";

const validFlavors: FlavorProfile[] = ["sweet", "neutral", "sour"];

const equipmentData = {
  ja: [
    { name: "Hario Switch", href: "https://www.amazon.co.jp/s?k=Hario+Switch&tag=tktm-22" },
    { name: "V60 フィルター", href: "https://www.amazon.co.jp/s?k=V60+フィルター&tag=tktm-22" },
    { name: "スケール", href: "https://www.amazon.co.jp/s?k=コーヒー+スケール&tag=tktm-22" },
    { name: "ケトル", href: "https://www.amazon.co.jp/s?k=コーヒー+電気ケトル&tag=tktm-22" },
  ],
  en: [
    { name: "Hario Switch", href: "https://www.amazon.com/s?k=Hario+Switch&tag=tktm-20" },
    { name: "V60 Filters", href: "https://www.amazon.com/s?k=V60+filters&tag=tktm-20" },
    { name: "Coffee Scale", href: "https://www.amazon.com/s?k=coffee+scale&tag=tktm-20" },
    { name: "Pour-over kettle", href: "https://www.amazon.com/s?k=pour+over+electric+kettle&tag=tktm-20" },
  ],
};

export function SetupPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { beans, flavor, setBeans, setFlavor } = useSessionStore();
  const { debugEnabled } = useSettingsStore();
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

  const lang = i18n.language as "ja" | "en";
  const steps = computeSteps(newHybridMethod, beans, flavor);
  const totalWater = getTotalWater(beans, newHybridMethod.waterRatio);
  const stepLabels: string[] = t("stepLabels", { returnObjects: true }) as string[];
  const equipment = equipmentData[lang] || equipmentData.en;

  const handleStart = () => {
    navigate("/timer?autostart=1");
  };

  const flavorOptions: FlavorProfile[] = ["sweet", "neutral", "sour"];

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

      <details
        className="card"
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
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

      <section className="card">
        <div className="card-title">{t("setup.steps")}</div>
        <div className="hint">
          {t("setup.total")}: {totalWater}g
        </div>
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
      </section>

      {debugEnabled && <CoffeeNews />}

      <p className={styles.affiliateNote}>{t("setup.affiliate")}</p>
    </main>
  );
}
