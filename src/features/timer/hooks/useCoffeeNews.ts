import { useEffect, useState } from "react";
import type { Language } from "../../settings/types";

export interface NewsItem {
  id: string;
  short_title: string;
  summary: string;
  url: string;
  source: string;
}

function decodeHtml(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export function useCoffeeNews(language: Language, enabled = true) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    fetch(`https://daily-brew.takatama.workers.dev/news?lang=${language}`)
      .then((r) => r.json())
      .then((data) => {
        const item = data.item;
        setNews({
          ...item,
          short_title: decodeHtml(item.short_title),
          summary: decodeHtml(item.summary),
          source: decodeHtml(item.source),
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [language, enabled]);

  return { news, loading };
}
