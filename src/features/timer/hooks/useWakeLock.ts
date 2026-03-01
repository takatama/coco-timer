import { useCallback, useEffect, useRef, useState } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [isActive, setIsActive] = useState(false);

  const request = useCallback(async () => {
    setIsActive(true);
    if (!("wakeLock" in navigator)) return;
    try {
      if (!wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const release = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isActive) {
        request();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      release();
    };
  }, [isActive, request, release]);

  return { isActive, request, release };
}
