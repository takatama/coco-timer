import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../features/timer/store";
const heroImage = "/assets/images/goran-ivos-1JsjRW6Sbwg-unsplash.jpg";

export function IntroPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setIntroSeen = useSessionStore((s) => s.setIntroSeen);

  const handleStart = () => {
    setIntroSeen(true);
    navigate("/setup");
  };

  return (
    <main className="content">
      <section className="card hero-card">
        <img
          className="hero-image"
          src={heroImage}
          alt="New Hybrid Method"
        />
        <div className="hero-title">{t("intro.title")}</div>
        <div className="hero-desc">{t("intro.description")}</div>
      </section>

      <section className="card">
        <div className="card-title">{t("intro.youtube")}</div>
        <div className="video-wrap">
          <iframe
            src="https://www.youtube.com/embed/4FeUp_zNiiY"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <div className="actions">
        <button className="btn primary" onClick={handleStart}>
          {t("intro.start")}
        </button>
        <button className="btn ghost" onClick={handleStart}>
          {t("intro.skip")}
        </button>
      </div>
    </main>
  );
}
