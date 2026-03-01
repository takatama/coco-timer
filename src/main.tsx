import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import i18n from "./shared/i18n/config";
import { App } from "./app/App";
import "./shared/styles/tokens.css";

// Sync i18n language with persisted settings before render
try {
  const stored = localStorage.getItem("coco-timer-settings");
  if (stored) {
    const parsed = JSON.parse(stored);
    const lang = parsed.state?.language;
    if (lang === "ja" || lang === "en") {
      i18n.changeLanguage(lang);
    }
  }
} catch {
  // ignore
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
