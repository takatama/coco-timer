import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSettingsStore } from "../../settings/store";
import { useNotification } from "./useNotification";

interface MockAudio {
  load: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  paused: boolean;
  currentTime: number;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

describe("useNotification", () => {
  const audioByPath = new Map<string, MockAudio>();

  beforeEach(() => {
    audioByPath.clear();
    class AudioStub implements MockAudio {
      load = vi.fn();
      pause = vi.fn();
      play = vi.fn(() => Promise.resolve());
      paused = false;
      currentTime = 0;
      addEventListener = vi.fn();
      removeEventListener = vi.fn();

      constructor(path: string) {
        audioByPath.set(path, this);
      }
    }
    vi.stubGlobal("Audio", AudioStub);
    useSettingsStore.setState({
      language: "ja",
      voice: "female",
      notifyMode: "sound",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses first-step only for the first message type", async () => {
    const { result } = renderHook(() => useNotification());
    const first = audioByPath.get("/assets/audio/ja-female-first-step.wav");
    const next = audioByPath.get("/assets/audio/ja-female-next-step.wav");
    const finish = audioByPath.get("/assets/audio/ja-female-finish.wav");

    expect(first).toBeDefined();
    expect(next).toBeDefined();
    expect(finish).toBeDefined();

    act(() => result.current.playFirstSound());
    await waitFor(() => expect(first!.play).toHaveBeenCalledOnce());
    expect(next!.play).not.toHaveBeenCalled();
    expect(finish!.play).not.toHaveBeenCalled();

    act(() => result.current.playSound(false));
    await waitFor(() => expect(next!.play).toHaveBeenCalledOnce());

    act(() => result.current.playSound(true));
    await waitFor(() => expect(finish!.play).toHaveBeenCalledOnce());
  });
});
