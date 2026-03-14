export type SupportedLanguage = "ja" | "en";

interface EquipmentItem {
  name: string;
  href: string;
}

interface NewsAdLinks {
  filter: string;
  dripper: string;
}

const AMAZON_ASSOCIATE_TAG: Record<SupportedLanguage, string> = {
  ja: "tktm-22",
  en: "tktm-20",
};

const AMAZON_BASE_URL: Record<SupportedLanguage, string> = {
  ja: "https://www.amazon.co.jp/s",
  en: "https://www.amazon.com/s",
};

function toUrlQuery(query: string): string {
  return encodeURIComponent(query);
}

export function buildAmazonSearchUrl(language: SupportedLanguage, query: string): string {
  const baseUrl = AMAZON_BASE_URL[language];
  const tag = AMAZON_ASSOCIATE_TAG[language];
  return `${baseUrl}?k=${toUrlQuery(query)}&tag=${tag}`;
}

export function getEquipmentItems(language: SupportedLanguage): EquipmentItem[] {
  if (language === "ja") {
    return [
      { name: "Hario Switch", href: buildAmazonSearchUrl("ja", "Hario Switch") },
      { name: "V60 フィルター", href: buildAmazonSearchUrl("ja", "V60 フィルター") },
      { name: "スケール", href: buildAmazonSearchUrl("ja", "コーヒー スケール") },
      { name: "ケトル", href: buildAmazonSearchUrl("ja", "コーヒー 電気ケトル") },
    ];
  }

  return [
    { name: "Hario Switch", href: buildAmazonSearchUrl("en", "Hario Switch") },
    { name: "V60 Filters", href: buildAmazonSearchUrl("en", "V60 filters") },
    { name: "Coffee Scale", href: buildAmazonSearchUrl("en", "coffee scale") },
    { name: "Pour-over kettle", href: buildAmazonSearchUrl("en", "pour over electric kettle") },
  ];
}

export function getNewsAdLinks(language: SupportedLanguage): NewsAdLinks {
  return {
    filter: buildAmazonSearchUrl(language, language === "ja" ? "コーヒー ペーパーフィルター" : "coffee paper filters"),
    dripper: buildAmazonSearchUrl(language, "Hario Switch"),
  };
}
