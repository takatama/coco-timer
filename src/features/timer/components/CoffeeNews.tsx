import { useTranslation } from "react-i18next";
import type { NewsItem } from "../hooks/useCoffeeNews";
import styles from "./CoffeeNews.module.css";

interface Props {
  news: NewsItem | null;
  loading: boolean;
}

export function CoffeeNews({ news, loading }: Props) {
  const { t } = useTranslation();

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
