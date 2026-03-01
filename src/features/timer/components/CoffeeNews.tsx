import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../settings/store";
import styles from "./CoffeeNews.module.css";

interface NewsItem {
  id: string;
  short_title: string;
  summary: string;
  url: string;
  source: string;
}

export function CoffeeNews() {
  const { t } = useTranslation();
  const { language } = useSettingsStore();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://daily-brew.takatama.workers.dev/news?lang=${language}`)
      .then((r) => r.json())
      .then((data) => {
        setNews(data.item);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [language]);

  if (loading) {
    return (
      <section className="card">
        <div className="card-title">{t("news.title")}</div>
        <div className="hint">{t("news.loading")}</div>
      </section>
    );
  }

  if (!news) return null;

  return (
    <section className="card">
      <div className="card-title">{t("news.title")}</div>
      <div className={styles.newsTitle}>{news.short_title}</div>
      <div className={styles.newsSummary}>{news.summary}</div>
      <div className={styles.newsFooter}>
        <span className="hint">{news.source}</span>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.readMore}
        >
          {t("news.readMore")}
        </a>
      </div>
    </section>
  );
}
