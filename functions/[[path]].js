const SUPPORTED_LANGS = ["ja", "en"];
const PAGE_CANDIDATES = new Set(["", "intro", "setup", "coco-timer"]);

const detectFromAcceptLanguage = (headerValue) => {
  if (!headerValue) return "en";
  return /(^|,|;)\s*ja(-|;|,|$)/i.test(headerValue) ? "ja" : "en";
};

const stripTrailingSlash = (value) => (value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value);

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.pathname === "/") {
    const lang = detectFromAcceptLanguage(request.headers.get("accept-language"));
    return Response.redirect(`${url.origin}/${lang}/`, 302);
  }

  const normalized = stripTrailingSlash(url.pathname);
  const segments = normalized.split("/").filter(Boolean);
  const lang = segments[0];

  if (!SUPPORTED_LANGS.includes(lang)) {
    return env.ASSETS.fetch(request);
  }

  const rawPage = segments[1] || "";
  const page = rawPage.replace(/\.html$/i, "");
  if (!PAGE_CANDIDATES.has(page)) {
    return env.ASSETS.fetch(request);
  }

  const filePath = page ? `/${page}.html` : "/index.html";
  const assetUrl = new URL(filePath + url.search, url.origin);
  const rewrittenRequest = new Request(assetUrl.toString(), request);
  return env.ASSETS.fetch(rewrittenRequest);
}
