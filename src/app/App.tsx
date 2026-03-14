import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../shared/components/Header";
import { IntroPage } from "./routes/IntroPage";
import { SetupPage } from "./routes/SetupPage";
import { TimerPage } from "./routes/TimerPage";
import { useSessionStore } from "../features/timer/store";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import styles from "./App.module.css";

function RootRedirect() {
  const introSeen = useSessionStore((s) => s.introSeen);
  return <Navigate to={introSeen ? "/setup" : "/intro"} replace />;
}

export function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
        <footer className={styles.footer}>{t("setup.affiliate")}</footer>
      </div>
    </BrowserRouter>
  );
}
