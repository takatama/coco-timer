import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NewsItem } from "../hooks/useCoffeeNews";
import styles from "./CoffeeNews.module.css";
import { getNewsAdLinks, type SupportedLanguage } from "../../../shared/affiliate/amazon";

interface Props {
  news: NewsItem[];
  loading: boolean;
}

interface AdItem {
  titleKey: string;
  descriptionKey: string;
  url: string;
}

const AD_CYCLE_KEY = "coco-timer-news-ad-cycle";

function pickAd(cycle: number, language: SupportedLanguage): AdItem | null {
  if (cycle % 2 !== 0) {
    return null;
  }

  const links = getNewsAdLinks(language);

  if (cycle % 4 === 0 || cycle % 6 === 0) {
    return {
      titleKey: "news.ads.filter.title",
      descriptionKey: "news.ads.filter.description",
      url: links.filter,
    };
  }

  return {
    titleKey: "news.ads.dripper.title",
    descriptionKey: "news.ads.dripper.description",
    url: links.dripper,
  };
}

function nextAdCycle(): number {
  const raw = Number(localStorage.getItem(AD_CYCLE_KEY) ?? "0");
  const safe = Number.isFinite(raw) && raw > 0 ? raw : 0;
  const next = safe + 1;
  localStorage.setItem(AD_CYCLE_KEY, String(next));
  return next;
}

export function CoffeeNews({ news, loading }: Props) {
  const { t, i18n } = useTranslation();
  const [ad, setAd] = useState<AdItem | null>(null);

  const language: SupportedLanguage = i18n.language === "ja" ? "ja" : "en";

  const adCycleSeed = useMemo(() => {
    if (loading || news.length === 0) {
      return null;
    }

    return `${language}:${news.map((item) => item.id).join(":")}`;
  }, [language, loading, news]);

  useEffect(() => {
    if (!adCycleSeed) {
      setAd(null);
      return;
    }

    setAd(pickAd(nextAdCycle(), language));
  }, [adCycleSeed, language]);

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
      {ad ? (
        <aside className={styles.adSection}>
          <div className={styles.adLabel}>{t("news.ads.label")}</div>
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.adLink}
          >
            <span className={styles.adTitle}>{t(ad.titleKey)}</span>
            <span className={styles.adDescription}>{t(ad.descriptionKey)}</span>
          </a>
          <div className="hint">{t("setup.affiliate")}</div>
        </aside>
      ) : null}
    </>
  );
}
