const SUPPORTED_LANGS = ["ja", "en"];
const STORAGE_KEY = "coco-timer-settings";

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const parseSettings = () => {
  const raw = safeStorageGet(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const persistLanguage = (lang) => {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  const settings = parseSettings();
  settings.language = lang;
  settings.lang = lang;
  safeStorageSet(STORAGE_KEY, JSON.stringify(settings));
};

const getStoredLanguage = () => {
  const settings = parseSettings();
  const lang = settings.language || settings.lang;
  return SUPPORTED_LANGS.includes(lang) ? lang : null;
};

const hasJapanese = () => {
  if (Array.isArray(navigator.languages)) {
    return navigator.languages.some((entry) => String(entry).toLowerCase().startsWith("ja"));
  }
  return String(navigator.language || "").toLowerCase().startsWith("ja");
};

export const extractLangFromPath = (pathname = window.location.pathname) => {
  const [, firstSegment] = pathname.split("/");
  return SUPPORTED_LANGS.includes(firstSegment) ? firstSegment : null;
};

export const getPathWithoutLang = (pathname = window.location.pathname) => {
  const lang = extractLangFromPath(pathname);
  if (!lang) return pathname;
  const stripped = pathname.replace(new RegExp(`^/${lang}`), "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
};

export const buildLanguagePath = (targetLang, pathname = window.location.pathname) => {
  const normalizedLang = SUPPORTED_LANGS.includes(targetLang) ? targetLang : "en";
  const contentPath = getPathWithoutLang(pathname);
  if (contentPath === "/") return `/${normalizedLang}/`;
  return `/${normalizedLang}${contentPath}`;
};

const redirect = (target) => {
  if (window.location.pathname + window.location.search + window.location.hash === target) return;
  window.location.replace(target);
};

export const detectLanguage = () => {
  const { pathname, search, hash } = window.location;

  if (pathname === "/") {
    const storedLang = getStoredLanguage();
    if (storedLang) {
      redirect(`/${storedLang}/${search}${hash}`);
      return null;
    }

    const detected = hasJapanese() ? "ja" : "en";
    redirect(`/${detected}/${search}${hash}`);
    return null;
  }

  const langFromUrl = extractLangFromPath(pathname);
  if (!langFromUrl) {
    const fallback = getStoredLanguage() || (hasJapanese() ? "ja" : "en");
    const target = buildLanguagePath(fallback, pathname);
    redirect(`${target}${search}${hash}`);
    return null;
  }

  persistLanguage(langFromUrl);
  document.documentElement.lang = langFromUrl;
  return langFromUrl;
};

export const switchLanguage = (targetLang) => {
  if (!SUPPORTED_LANGS.includes(targetLang)) return;
  const nextPath = buildLanguagePath(targetLang, window.location.pathname);
  persistLanguage(targetLang);
  window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
};

export const applySeoMetaTags = ({ origin = window.location.origin } = {}) => {
  const lang = extractLangFromPath(window.location.pathname);
  if (!lang) return;

  const normalizedOrigin = origin.replace(/\/$/, "");
  const pathWithoutLang = getPathWithoutLang(window.location.pathname);
  const suffix = pathWithoutLang === "/" ? "/" : pathWithoutLang;

  const urls = {
    ja: `${normalizedOrigin}/ja${suffix}`,
    en: `${normalizedOrigin}/en${suffix}`,
    canonical: `${normalizedOrigin}/${lang}${suffix}`,
    xDefault: `${normalizedOrigin}/`,
  };

  const upsertLink = (rel, href, hreflang) => {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;
    let link = document.head.querySelector(selector);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      if (hreflang) link.setAttribute("hreflang", hreflang);
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  };

  upsertLink("canonical", urls.canonical);
  upsertLink("alternate", urls.ja, "ja");
  upsertLink("alternate", urls.en, "en");
  upsertLink("alternate", urls.xDefault, "x-default");
};
