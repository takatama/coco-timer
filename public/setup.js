import "./recipe-data.js";
import { mountSharedLayout } from "./shared-layout.js";

(() => {
  mountSharedLayout();
  const getBasePath = () =>
    window.location.pathname.replace(/\/[^/]*$/, '/');
  const getDefaultLang = () =>
    navigator.language.startsWith("ja") ? "ja" : "en";

  const safeStorageGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeStorageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };
  const state = {
    beans: 20,
    flavor: "neutral",
    waterRatio: 15,
    lang: "ja",
  };

  const elements = {
    beansValue: document.getElementById("beans-value"),
    beansMinus: document.getElementById("beans-minus"),
    beansPlus: document.getElementById("beans-plus"),
    flavorChoices: document.getElementById("flavor-choices"),
    totalWater: document.getElementById("total-water"),
    stepList: document.getElementById("step-list"),
    startBtn: document.getElementById("start-btn"),
    detailsText: document.getElementById("details-text"),
    detailsLabel: document.getElementById("label-details"),
    labelEquipment: document.getElementById("label-equipment"),
    equipmentList: document.getElementById("equipment-list"),
    recipeDetailsLink: document.getElementById("recipe-details-link"),
    affiliateNote: document.getElementById("affiliate-note"),
    labelBeans: document.getElementById("label-beans"),
    labelFlavor: document.getElementById("label-flavor"),
    labelSteps: document.getElementById("label-steps"),
    openSettings: document.getElementById("open-settings"),
    settingsModal: document.getElementById("settings-modal"),
    closeSettings: document.getElementById("close-settings"),
    saveSettings: document.getElementById("save-settings"),
    labelSettings: document.getElementById("label-settings"),
    labelLanguage: document.getElementById("label-language"),
    labelNotify: document.getElementById("label-notify"),
    labelNotifyHint: document.getElementById("label-notify-hint"),
    labelVoice: document.getElementById("label-voice"),
    langChoices: document.getElementById("lang-choices"),
    notifyChoices: document.getElementById("notify-choices"),
    voiceChoices: document.getElementById("voice-choices"),
    debugChoices: document.getElementById("debug-choices"),
    labelDebug: document.getElementById("label-debug"),
    labelDebugHint: document.getElementById("label-debug-hint"),
    animationChoices: document.getElementById("animation-choices"),
    labelAnimation: document.getElementById("label-animation"),
  };

  const description = {
    ja:
      "粕谷哲氏の新しいハイブリッドメソッドは、Hario Switchで抽出方法の良いとこ取りを実現。他の抽出法と異なり、最初に粉全体をしっかり浸すことで自然な甘みを引き出し、その後ドリップで華やかな風味を、最後に低温浸漬でまろやかさをプラス。結果、濃厚なボディと抜群の甘み、クリアな味わいが楽しめる一杯に。ぜひこのレシピを試してみてください。",
    en:
      "Tetsu Kasaya’s evolved hybrid recipe for the Hario Switch brilliantly combines the best of both worlds. It begins with a full-immersion bloom to draw out deep sweetness, shifts to a pour-over to highlight aromatic notes, and finishes with a cool immersion that smooths the cup. The result is a coffee with a robust body, exquisite sweetness, and crystal-clear flavor.",
  };
  const equipment = {
    ja: [
      { name: "Hario Switch", href: "https://www.amazon.co.jp/s?k=Hario+Switch&tag=tktm-22" },
      { name: "V60 02 フィルター", href: "https://www.amazon.co.jp/s?k=V60+02+フィルター&tag=tktm-22" },
      { name: "スケール", href: "https://www.amazon.co.jp/s?k=コーヒー+スケール&tag=tktm-22" },
      { name: "ケトル", href: "https://www.amazon.co.jp/s?k=コーヒー+ケトル&tag=tktm-22" },
    ],
    en: [
      { name: "Hario Switch", href: "https://www.amazon.com/s?k=Hario+Switch&tag=tktm-20" },
      { name: "V60 02 Filters", href: "https://www.amazon.com/s?k=V60+02+filters&tag=tktm-20" },
      { name: "Coffee Scale", href: "https://www.amazon.com/s?k=coffee+scale&tag=tktm-20" },
      { name: "Pour-over Kettle", href: "https://www.amazon.com/s?k=pour+over+kettle&tag=tktm-20" },
    ],
  };


  const labels = {
    ja: {
      beans: "豆の量",
      flavor: "味わい",
      sweet: "甘味",
      neutral: "バランス",
      sour: "酸味",
      total: "合計",
      steps: "ステップごとの湯量",
      start: "タイマーを開始",
      details: "レシピの説明",
      equipment: "必要な器具",
      detailsAction: "見る",
      affiliate: "Amazonのアソシエイトとして、COCO Timerは適格販売により収入を得ています。",
    },
    en: {
      beans: "Beans",
      flavor: "Flavor",
      sweet: "Sweet",
      neutral: "Balance",
      sour: "Sour",
      total: "Total",
      steps: "Water per step",
      start: "Start Timer",
      details: "Recipe details",
      equipment: "Required gear",
      detailsAction: "View",
      affiliate: "As an Amazon Associate, COCO Timer earns from qualifying purchases.",
    },
  };

  const getLang = () => {
    const stored = safeStorageGet("coco-timer-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.language) return parsed.language;
        if (parsed.lang) return parsed.lang;
      } catch {}
    }
    return getDefaultLang();
  };

  const stepLabels = window.RECIPE_STEP_LABELS || {
    ja: [
      "閉じて蒸らし",
      "開けて1湯目",
      "2湯目",
      "閉じて低温の3湯目",
      "開ける",
      "完成",
    ],
    en: [
      "Close & Bloom",
      "Open: 1st pour",
      "2nd pour",
      "Close: cool 3rd pour",
      "Open",
      "Finish",
    ],
  };

  const calcFlavor1 = (total, flavor) =>
    total * 0.4 * (flavor === "sweet" ? 0.42 : flavor === "sour" ? 0.58 : 0.5);

  const calcFlavor2 = (total, flavor) =>
    total * 0.4 * (flavor === "sweet" ? 0.58 : flavor === "sour" ? 0.42 : 0.5);

  const calcStrength = (total) => (total * 0.6) / 2;

  const normalizeNotifyMode = (mode) => {
    if (mode === "both") return "both";
    if (mode === "sound" || mode === "vibrate" || mode === "none") return mode;
    return "both";
  };

  const notifyModeToFlags = (mode) => {
    const normalized = normalizeNotifyMode(mode);
    return {
      sound: normalized === "sound" || normalized === "both",
      vibrate: normalized === "vibrate" || normalized === "both",
    };
  };

  const flagsToNotifyMode = ({ sound, vibrate }) => {
    if (sound && vibrate) return "both";
    if (sound) return "sound";
    if (vibrate) return "vibrate";
    return "none";
  };

  const computeSteps = () => {
    const total = Math.round(state.beans * state.waterRatio);
    const increments = [
      calcFlavor1(total, state.flavor),
      calcFlavor2(total, state.flavor),
      calcStrength(total),
      calcStrength(total),
    ].map((v) => Math.floor(Math.round(v)));

    let cumulative = 0;
    const labelsByLang = stepLabels[state.lang] || stepLabels.ja;
    const steps = increments.map((inc, idx) => {
      cumulative += inc;
      return { label: labelsByLang[idx], cumulative };
    });
    steps.push({ label: labelsByLang[4], cumulative });
    steps.push({ label: labelsByLang[5], cumulative });
    return { total, steps };
  };

  const render = () => {
    const t = labels[state.lang];
    elements.beansValue.textContent = `${state.beans}g`;

    Array.from(elements.flavorChoices.querySelectorAll(".choice")).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === state.flavor);
    });

    const { total, steps } = computeSteps();
    elements.totalWater.textContent = `${t.total}: ${total}g`;
    elements.stepList.innerHTML = steps
      .map(
        (step, idx) =>
          `<div class="step-item"><span>Step ${idx + 1}: ${step.label}</span><span>${step.cumulative}g</span></div>`
      )
      .join("");

    elements.detailsText.textContent = description[state.lang];
    const equipmentItems = (equipment[state.lang] || equipment.ja)
      .slice(0, 4)
      .map((item) => `<li><a href="${item.href}" target="_blank" rel="noopener noreferrer sponsored">${item.name}</a></li>`)
      .join("");
    elements.equipmentList.innerHTML = equipmentItems;
    elements.detailsLabel.textContent = t.details;
    elements.labelEquipment.textContent = t.equipment;
    elements.recipeDetailsLink.textContent = t.detailsAction;
    elements.affiliateNote.textContent = t.affiliate;
    elements.labelBeans.textContent = t.beans;
    elements.labelFlavor.textContent = t.flavor;
    elements.labelSteps.textContent = t.steps;
    elements.startBtn.textContent = t.start;

    elements.labelSettings.textContent = state.lang === "ja" ? "設定" : "Settings";
    elements.labelLanguage.textContent = state.lang === "ja" ? "言語" : "Language";
    elements.labelNotify.textContent = state.lang === "ja" ? "通知" : "Notification";
    elements.labelNotifyHint.textContent =
      state.lang === "ja" ? "5秒前に通知します（複数選択可）" : "Notify 5 seconds before (multiple selection)";
    elements.labelVoice.textContent = state.lang === "ja" ? "音声" : "Voice";
    elements.labelDebug.textContent = state.lang === "ja" ? "デバッグ" : "Debug";
    elements.labelDebugHint.textContent =
      state.lang === "ja" ? "タイマーを高速再生します" : "Speed up timer playback";
    elements.labelAnimation.textContent = state.lang === "ja" ? "アニメーション表示" : "Animation";
    elements.saveSettings.textContent = state.lang === "ja" ? "保存" : "Save";
    elements.closeSettings.textContent = state.lang === "ja" ? "閉じる" : "Close";

    const notifyButtons = elements.notifyChoices.querySelectorAll(".choice");
    notifyButtons.forEach((btn) => {
      if (btn.dataset.value === "sound") btn.textContent = state.lang === "ja" ? "音声" : "Sound";
      if (btn.dataset.value === "vibrate") btn.textContent = state.lang === "ja" ? "バイブ" : "Vibrate";
    });

    const voiceButtons = elements.voiceChoices.querySelectorAll(".choice");
    voiceButtons.forEach((btn) => {
      if (btn.dataset.value === "male") btn.textContent = state.lang === "ja" ? "男性" : "Male";
      if (btn.dataset.value === "female") btn.textContent = state.lang === "ja" ? "女性" : "Female";
    });

    const debugButtons = elements.debugChoices.querySelectorAll(".choice");
    debugButtons.forEach((btn) => {
      if (btn.dataset.value === "off") btn.textContent = state.lang === "ja" ? "オフ" : "Off";
      if (btn.dataset.value === "x5") btn.textContent = state.lang === "ja" ? "x5倍速" : "x5 Speed";
    });

    const animationButtons = elements.animationChoices.querySelectorAll(".choice");
    animationButtons.forEach((btn) => {
      if (btn.dataset.value === "on") btn.textContent = state.lang === "ja" ? "表示" : "Show";
      if (btn.dataset.value === "off") btn.textContent = state.lang === "ja" ? "非表示" : "Hide";
    });

    const buttons = elements.flavorChoices.querySelectorAll(".choice");
    buttons.forEach((btn) => {
      if (btn.dataset.value === "sweet") btn.textContent = t.sweet;
      if (btn.dataset.value === "neutral") btn.textContent = t.neutral;
      if (btn.dataset.value === "sour") btn.textContent = t.sour;
    });
  };

  const init = () => {
    state.lang = getLang();
    const params = new URLSearchParams(window.location.search);
    const introSeenByParam = params.get("intro_seen") === "1";
    const introSeenByStorage = safeStorageGet("brewsteps_intro_seen");

    if (introSeenByParam) {
      safeStorageSet("brewsteps_intro_seen", "1");
    }

    if (!introSeenByStorage && !introSeenByParam) {
      window.location.href = `${getBasePath()}intro.html`;
      return;
    }

    const beansParam = Number(params.get("beans"));
    const flavorParam = params.get("flavor");
    if (beansParam && !Number.isNaN(beansParam)) {
      state.beans = beansParam;
    }
    if (["sweet", "neutral", "sour"].includes(flavorParam)) {
      state.flavor = flavorParam;
    }
    render();

    const getSettings = () => {
      const raw = safeStorageGet("coco-timer-settings");
      if (!raw) return { notifyMode: "both", voice: "male", language: state.lang, debugSpeed: 1, animation: true };
      try {
        const parsed = JSON.parse(raw);
        parsed.notifyMode = normalizeNotifyMode(parsed.notifyMode);
        return parsed;
      } catch {
        return { notifyMode: "both", voice: "male", language: state.lang, debugSpeed: 1, animation: true };
      }
    };

    const applySettings = (settings) => {
      Array.from(elements.langChoices.querySelectorAll(".choice")).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === state.lang);
      });
      const notifyFlags = notifyModeToFlags(settings.notifyMode);
      Array.from(elements.notifyChoices.querySelectorAll(".choice")).forEach((btn) => {
        btn.classList.toggle("active", Boolean(notifyFlags[btn.dataset.value]));
      });
      Array.from(elements.voiceChoices.querySelectorAll(".choice")).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === settings.voice);
      });
      Array.from(elements.debugChoices.querySelectorAll(".choice")).forEach((btn) => {
        const selected = settings.debugSpeed === 5 ? "x5" : "off";
        btn.classList.toggle("active", btn.dataset.value === selected);
      });
      Array.from(elements.animationChoices.querySelectorAll(".choice")).forEach((btn) => {
        const selected = settings.animation === false ? "off" : "on";
        btn.classList.toggle("active", btn.dataset.value === selected);
      });
    };

    let settings = getSettings();
    applySettings(settings);

    elements.beansMinus.addEventListener("click", () => {
      state.beans = Math.max(1, state.beans - 1);
      render();
    });

    elements.beansPlus.addEventListener("click", () => {
      state.beans += 1;
      render();
    });

    elements.flavorChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      state.flavor = value;
      render();
    });

    elements.startBtn.addEventListener("click", () => {
      const params = new URLSearchParams({
        beans: String(state.beans),
        flavor: state.flavor,
        autostart: "1",
      });
      window.location.href = `${getBasePath()}coco-timer.html?${params.toString()}`;
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

    elements.langChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      settings.language = value;
      state.lang = value;
      safeStorageSet("coco-timer-settings", JSON.stringify(settings));
      render();
      applySettings(settings);
    });

    elements.notifyChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      const notifyFlags = notifyModeToFlags(settings.notifyMode);
      if (value !== "sound" && value !== "vibrate") return;
      notifyFlags[value] = !notifyFlags[value];
      settings.notifyMode = flagsToNotifyMode(notifyFlags);
      safeStorageSet("coco-timer-settings", JSON.stringify(settings));
      applySettings(settings);
    });

    elements.voiceChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      settings.voice = value;
      safeStorageSet("coco-timer-settings", JSON.stringify(settings));
      applySettings(settings);
    });

    elements.animationChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      settings.animation = value !== "off";
      safeStorageSet("coco-timer-settings", JSON.stringify(settings));
      applySettings(settings);
    });

    elements.debugChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      settings.debugSpeed = value === "x5" ? 5 : 1;
      safeStorageSet("coco-timer-settings", JSON.stringify(settings));
      applySettings(settings);
    });
  };

  init();
})();

