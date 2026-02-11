(() => {
  const getBasePath = () =>
    window.location.pathname.replace(/\/[^/]*$/, '/');
  const getDefaultLang = () =>
    navigator.language.startsWith("ja") ? "ja" : "en";
  const description = {
    ja:
      "粕谷哲氏の新しいハイブリッドメソッドは、Hario Switchで抽出方法の良いとこ取りを実現。他の抽出法と異なり、最初に粉全体をしっかり浸すことで自然な甘みを引き出し、その後ドリップで華やかな風味を、最後に低温浸漬でまろやかさをプラス。結果、濃厚なボディと抜群の甘み、クリアな味わいが楽しめる一杯に。ぜひこのレシピを試してみてください。",
    en:
      "Tetsu Kasaya’s evolved hybrid recipe for the Hario Switch brilliantly combines the best of both worlds. It begins with a full-immersion bloom to draw out deep sweetness, shifts to a pour-over to highlight aromatic notes, and finishes with a cool immersion that smooths the cup. The result is a coffee with a robust body, exquisite sweetness, and crystal-clear flavor.",
  };

  const labels = {
    ja: {
      title: "新しいハイブリッドメソッド",
      youtube: "動画で確認",
      start: "始める",
      skip: "スキップ",
    },
    en: {
      title: "New Hybrid Method",
      youtube: "Watch on YouTube",
      start: "Start",
      skip: "Skip",
    },
  };

  const elements = {
    title: document.getElementById("recipe-title"),
    desc: document.getElementById("recipe-desc"),
    youtube: document.getElementById("label-youtube"),
    start: document.getElementById("start-btn"),
    skip: document.getElementById("skip-btn"),
    langChoices: document.getElementById("lang-choices"),
    notifyChoices: document.getElementById("notify-choices"),
    voiceChoices: document.getElementById("voice-choices"),
    openSettings: document.getElementById("open-settings"),
    settingsModal: document.getElementById("settings-modal"),
    closeSettings: document.getElementById("close-settings"),
    saveSettings: document.getElementById("save-settings"),
    labelSettings: document.getElementById("label-settings"),
    labelLanguage: document.getElementById("label-language"),
    labelNotify: document.getElementById("label-notify"),
    labelNotifyHint: document.getElementById("label-notify-hint"),
    labelVoice: document.getElementById("label-voice"),
  };

  const getSettings = () => {
    const stored = localStorage.getItem("coco-timer-settings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return {};
  };

  const defaultLang = getDefaultLang();

  const setLang = (lang) => {
    const t = labels[lang];
    document.documentElement.lang = lang;
    elements.title.textContent = t.title;
    elements.desc.textContent = description[lang];
    elements.youtube.textContent = t.youtube;
    elements.start.textContent = t.start;
    elements.skip.textContent = t.skip;
    Array.from(elements.langChoices.querySelectorAll(".choice")).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === lang);
    });
    elements.labelSettings.textContent = lang === "ja" ? "設定" : "Settings";
    elements.labelLanguage.textContent = lang === "ja" ? "言語" : "Language";
    elements.labelNotify.textContent = lang === "ja" ? "通知" : "Notification";
    elements.labelNotifyHint.textContent = lang === "ja" ? "5秒前に通知します" : "Notify 5 seconds before";
    elements.labelVoice.textContent = lang === "ja" ? "音声" : "Voice";
    elements.saveSettings.textContent = lang === "ja" ? "保存" : "Save";
    elements.closeSettings.textContent = lang === "ja" ? "閉じる" : "Close";
  };

  const setActive = (container, value) => {
    Array.from(container.querySelectorAll(".choice")).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === value);
    });
  };

  const applySettings = (settings) => {
    const lang = settings.language || settings.lang || defaultLang;
    setLang(lang);
    setActive(elements.langChoices, lang);
    setActive(elements.notifyChoices, settings.notifyMode || "sound");
    setActive(elements.voiceChoices, settings.voice || "male");

    elements.notifyChoices.querySelectorAll(".choice").forEach((btn) => {
      if (btn.dataset.value === "sound") btn.textContent = lang === "ja" ? "音声" : "Sound";
      if (btn.dataset.value === "vibrate") btn.textContent = lang === "ja" ? "バイブ" : "Vibrate";
      if (btn.dataset.value === "none") btn.textContent = lang === "ja" ? "なし" : "None";
    });
    elements.voiceChoices.querySelectorAll(".choice").forEach((btn) => {
      if (btn.dataset.value === "male") btn.textContent = lang === "ja" ? "男性" : "Male";
      if (btn.dataset.value === "female") btn.textContent = lang === "ja" ? "女性" : "Female";
    });
  };

  const saveSettings = (settings) => {
    localStorage.setItem("coco-timer-settings", JSON.stringify(settings));
  };

  const markSeen = () => {
    localStorage.setItem("brewsteps_intro_seen", "1");
  };

  const init = () => {
    const settings = getSettings();
    applySettings(settings);

    elements.langChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      const current = getSettings();
      current.language = value;
      saveSettings(current);
      applySettings(current);
    });

    elements.notifyChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      const current = getSettings();
      current.notifyMode = value;
      saveSettings(current);
      applySettings(current);
    });

    elements.voiceChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      const current = getSettings();
      current.voice = value;
      saveSettings(current);
      applySettings(current);
    });

    elements.openSettings.addEventListener("click", () => {
      elements.settingsModal.classList.add("active");
    });
    elements.closeSettings.addEventListener("click", () => {
      elements.settingsModal.classList.remove("active");
    });
    elements.saveSettings.addEventListener("click", () => {
      elements.settingsModal.classList.remove("active");
    });

    elements.start.addEventListener("click", () => {
      markSeen();
      window.location.href = `${getBasePath()}setup.html`;
    });

    elements.skip.addEventListener("click", () => {
      markSeen();
      window.location.href = `${getBasePath()}setup.html`;
    });
  };

  init();
})();
