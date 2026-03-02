import { useTranslation } from "react-i18next";
import type { NewsItem } from "../hooks/useCoffeeNews";
import styles from "./CoffeeNews.module.css";

interface Props {
  news: NewsItem[];
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

  if (news.length === 0) return null;

  return (
    <>
      <div className="card-title">{t("news.title")}</div>
      <ul className={styles.newsList}>
        {news.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.newsItem}
            >
              <span className={styles.newsItemTitle}>{item.short_title}</span>
              <span className={styles.newsItemSource}>{item.source}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
