import { create } from "zustand";
import type { FlavorProfile } from "../recipe/types";

interface SessionStore {
  beans: number;
  flavor: FlavorProfile;
  introSeen: boolean;
  hasStartedTimer: boolean;
  setBeans: (beans: number) => void;
  setFlavor: (flavor: FlavorProfile) => void;
  setIntroSeen: (seen: boolean) => void;
  setHasStartedTimer: (started: boolean) => void;
}

function loadIntroSeen(): boolean {
  try {
    return localStorage.getItem("brewsteps_intro_seen") === "1";
  } catch {
    return false;
  }
}

export const useSessionStore = create<SessionStore>((set) => ({
  beans: 20,
  flavor: "neutral",
  introSeen: loadIntroSeen(),
  hasStartedTimer: false,
  setBeans: (beans) => set({ beans }),
  setFlavor: (flavor) => set({ flavor }),
  setHasStartedTimer: (hasStartedTimer) => set({ hasStartedTimer }),
  setIntroSeen: (seen) => {
    try {
      if (seen) localStorage.setItem("brewsteps_intro_seen", "1");
    } catch {
      // ignore
    }
    set({ introSeen: seen });
  },
}));
