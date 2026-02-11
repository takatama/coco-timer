const SUPPORTED_LANGS = ["ja", "en"];
const PAGE_CANDIDATES = new Set(["", "intro", "setup", "coco-timer"]);
const NON_LOCALIZED_PAGES = new Set(["intro", "setup", "coco-timer"]);

const stripTrailingSlash = (value) => (value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value);

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const normalized = stripTrailingSlash(url.pathname);
  const segments = normalized.split("/").filter(Boolean);

  if (normalized === "/") {
    return env.ASSETS.fetch(request);
  }

  const first = segments[0] || "";
  const firstPage = first.replace(/\.html$/i, "");

  // Force non-localized app routes to language-prefixed URLs.
  if (!SUPPORTED_LANGS.includes(first) && NON_LOCALIZED_PAGES.has(firstPage)) {
    const target = `/${"en"}/${firstPage}${url.search}${url.hash}`;
    return Response.redirect(`${url.origin}${target}`, 302);
  }

  if (!SUPPORTED_LANGS.includes(first)) {
    return env.ASSETS.fetch(request);
  }

  const rawPage = segments[1] || "";
  const page = rawPage.replace(/\.html$/i, "");
  if (!PAGE_CANDIDATES.has(page)) {
    return env.ASSETS.fetch(request);
  }

  // Serve setup at language root directly to avoid extra redirect hops.
  const filePath = page === "" ? "/setup.html" : `/${page}.html`;
  const assetUrl = new URL(filePath + url.search, url.origin);
  const rewrittenRequest = new Request(assetUrl.toString(), request);
  return env.ASSETS.fetch(rewrittenRequest);
}
