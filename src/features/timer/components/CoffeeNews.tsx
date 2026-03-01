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
        const item = data.item;
        const decode = (s: string) => {
          const el = document.createElement("textarea");
          el.innerHTML = s;
          return el.value;
        };
        setNews({
          ...item,
          short_title: decode(item.short_title),
          summary: decode(item.summary),
          source: decode(item.source),
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [language]);

  if (loading) {
    return (
      <>
        <div className="card-title">{t("news.title")}</div>
        <div className="hint">{t("news.loading")}</div>
      </>
    );
  }

  if (!news) return null;

  return (
    <>
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
    </>
  );
}
