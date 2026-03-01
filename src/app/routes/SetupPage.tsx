import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../features/timer/store";
import { newHybridMethod, computeSteps, getTotalWater } from "../../features/recipe";
import type { FlavorProfile } from "../../features/recipe";
const heroImage = "/assets/images/goran-ivos-1JsjRW6Sbwg-unsplash.jpg";

const equipmentData = {
  ja: [
    { name: "Hario Switch", href: "https://www.amazon.co.jp/s?k=Hario+Switch&tag=tktm-22" },
    { name: "V60 02 フィルター", href: "https://www.amazon.co.jp/s?k=V60+02+フィルター&tag=tktm-22" },
    { name: "スケール", href: "https://www.amazon.co.jp/s?k=コーヒー+スケール&tag=tktm-22" },
    { name: "ケトル", href: "https://www.amazon.co.jp/s?k=コーヒー+ケトル&tag=tktm-22" },
  ],
  en: [
    { name: "Hario Switch", href: "https://www.amazon.com/s?k=Hario+Switch&tag=tktm-20" },
    { name: "V60 02 Filters", href: "https://www.amazon.com/s?k=V60+02+filters&tag=tktm-20" },
    { name: "Coffee Scale", href: "https://www.amazon.com/s?k=coffee+scale&tag=tktm-20" },
    { name: "Pour-over Kettle", href: "https://www.amazon.com/s?k=pour+over+kettle&tag=tktm-20" },
  ],
};

export function SetupPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { beans, flavor, setBeans, setFlavor } = useSessionStore();
  const [detailsOpen, setDetailsOpen] = useState(false);

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
        <div className="stepper-row">
          <button
            className="btn-icon"
            onClick={() => setBeans(Math.max(1, beans - 1))}
            aria-label="decrease"
          >
            −
          </button>
          <div className="beans-value">{beans}g</div>
          <button
            className="btn-icon"
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

      <button className="btn-primary" onClick={handleStart}>
        {t("setup.start")}
      </button>

      <details
        className="card"
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="details-summary">
          <span>{t("setup.details")}</span>
          <span className="details-summary-link">
            {detailsOpen ? t("setup.closeAction") : t("setup.detailsAction")}
          </span>
        </summary>
        <div className="details-body">
          <img
            className="details-image"
            src={heroImage}
            alt="New Hybrid Method"
          />
          <div className="details-text">{t("intro.description")}</div>
          <div className="details-video">
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

      <section className="card equipment-card" aria-labelledby="label-equipment">
        <div className="equipment-header">
          <h2 className="card-title equipment-title">{t("setup.equipment")}</h2>
        </div>
        <ul className="equipment-list">
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
        <div className="step-list">
          {steps.map((step, idx) => (
            <div key={idx} className="step-item">
              <span>
                Step {idx + 1}: {stepLabels[idx] ?? ""}
              </span>
              <span>{step.cumulative}g</span>
            </div>
          ))}
        </div>
      </section>

      <p className="affiliate-note">{t("setup.affiliate")}</p>
    </main>
  );
}
