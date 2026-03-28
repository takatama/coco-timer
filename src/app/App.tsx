import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header } from "../shared/components/Header";
import { IntroPage } from "./routes/IntroPage";
import { SetupPage } from "./routes/SetupPage";
import { TimerPage } from "./routes/TimerPage";
import { useSessionStore } from "../features/timer/store";
import { useSettingsStore } from "../features/settings/store";
import { getDebugBgmTracks } from "../features/timer/data/bgm";
import { FloatingMiniPlayer } from "../features/timer/components/FloatingMiniPlayer";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import styles from "./App.module.css";

function RootRedirect() {
  const introSeen = useSessionStore((s) => s.introSeen);
  return <Navigate to={introSeen ? "/setup" : "/intro"} replace />;
}

function AppShell() {
  const { pathname } = useLocation();
  const hasStartedTimer = useSessionStore((s) => s.hasStartedTimer);
  const bgmEnabled = useSettingsStore((s) => s.bgmEnabled);
  const debugBgmDayType = useSettingsStore((s) => s.debugBgmDayType);
  const tracks = useMemo(() => getDebugBgmTracks(debugBgmDayType), [debugBgmDayType]);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = tracks[trackIndex] ?? tracks[0];
  const isSetupPage = pathname === "/setup";
  const isTimerPage = pathname === "/timer";

  const shouldShowMiniPlayer =
    Boolean(currentTrack) &&
    bgmEnabled &&
    hasStartedTimer &&
    (isTimerPage || isSetupPage);

  const handleNextTrack = () => {
    if (tracks.length <= 1) {
      return;
    }

    setTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  return (
    <div className={`${styles.app} ${shouldShowMiniPlayer ? styles.withMiniPlayer : ""}`}>
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
      {shouldShowMiniPlayer && currentTrack && (
        <FloatingMiniPlayer track={currentTrack} onNextTrack={handleNextTrack} />
      )}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
