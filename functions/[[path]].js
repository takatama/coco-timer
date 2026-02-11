const SUPPORTED_LANGS = ["ja", "en"];
const PAGE_CANDIDATES = new Set(["intro", "setup", "coco-timer"]);

const stripTrailingSlash = (value) => (value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value);

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const normalized = stripTrailingSlash(url.pathname);
  const segments = normalized.split("/").filter(Boolean);

  // Canonical entry URL (Edge decides):
  // / -> /en/setup
  if (normalized === "/") {
    return Response.redirect(`${url.origin}/en/setup${url.search}${url.hash}`, 302);
  }

  const first = segments[0] || "";
  const firstPage = first.replace(/\.html$/i, "");

  // Non-localized app routes -> /en/<page>
  if (!SUPPORTED_LANGS.includes(first) && PAGE_CANDIDATES.has(firstPage)) {
    return Response.redirect(`${url.origin}/en/${firstPage}${url.search}${url.hash}`, 302);
  }

  // Language root -> /<lang>/setup
  if (SUPPORTED_LANGS.includes(first) && segments.length === 1) {
    return Response.redirect(`${url.origin}/${first}/setup${url.search}${url.hash}`, 302);
  }

  if (!SUPPORTED_LANGS.includes(first)) {
    return env.ASSETS.fetch(request);
  }

  const rawPage = segments[1] || "";
  const page = rawPage.replace(/\.html$/i, "");
  if (!PAGE_CANDIDATES.has(page)) {
    return env.ASSETS.fetch(request);
  }

  const filePath = `/${page}.html`;
  const assetUrl = new URL(filePath + url.search, url.origin);
  const rewrittenRequest = new Request(assetUrl.toString(), request);
  return env.ASSETS.fetch(rewrittenRequest);
}
