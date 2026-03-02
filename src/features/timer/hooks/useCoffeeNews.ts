import { useEffect, useState } from "react";
import type { Language } from "../../settings/types";

export interface NewsItem {
  id: string;
  short_title: string;
  url: string;
  source: string;
}

function decodeHtml(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export function useCoffeeNews(language: Language, enabled = true) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    fetch(`https://daily-brew.takatama.workers.dev/news?lang=${language}`)
      .then((r) => r.json())
      .then((data) => {
        const items: NewsItem[] = (data.items ?? []).map((item: NewsItem) => ({
          id: item.id,
          short_title: decodeHtml(item.short_title),
          url: item.url,
          source: decodeHtml(item.source),
        }));
        setNews(items);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [language, enabled]);

  return { news, loading };
}
