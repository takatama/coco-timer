(() => {
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
  };

  const description = {
    ja:
      "粕谷哲氏の新しいハイブリッドメソッドは、Hario Switchで抽出方法の良いとこ取りを実現。他の抽出法と異なり、最初に粉全体をしっかり浸すことで自然な甘みを引き出し、その後ドリップで華やかな風味を、最後に低温浸漬でまろやかさをプラス。結果、濃厚なボディと抜群の甘み、クリアな味わいが楽しめる一杯に。ぜひこのレシピを試してみてください。",
    en:
      "Tetsu Kasaya’s evolved hybrid recipe for the Hario Switch brilliantly combines the best of both worlds. It begins with a full-immersion bloom to draw out deep sweetness, shifts to a pour-over to highlight aromatic notes, and finishes with a cool immersion that smooths the cup. The result is a coffee with a robust body, exquisite sweetness, and crystal-clear flavor.",
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
    },
  };

  const getLang = () => {
    const stored = localStorage.getItem("coco-timer-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.language) return parsed.language;
        if (parsed.lang) return parsed.lang;
      } catch {}
    }
    return navigator.language.startsWith("ja") ? "ja" : "en";
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
    elements.detailsLabel.textContent = t.details;
    elements.labelBeans.textContent = t.beans;
    elements.labelFlavor.textContent = t.flavor;
    elements.labelSteps.textContent = t.steps;
    elements.startBtn.textContent = t.start;

    elements.labelSettings.textContent = state.lang === "ja" ? "設定" : "Settings";
    elements.labelLanguage.textContent = state.lang === "ja" ? "言語" : "Language";
    elements.labelNotify.textContent = state.lang === "ja" ? "通知" : "Notification";
    elements.labelNotifyHint.textContent =
      state.lang === "ja" ? "5秒前に通知します" : "Notify 5 seconds before";
    elements.labelVoice.textContent = state.lang === "ja" ? "音声" : "Voice";
    elements.saveSettings.textContent = state.lang === "ja" ? "保存" : "Save";
    elements.closeSettings.textContent = state.lang === "ja" ? "閉じる" : "Close";

    const notifyButtons = elements.notifyChoices.querySelectorAll(".choice");
    notifyButtons.forEach((btn) => {
      if (btn.dataset.value === "sound") btn.textContent = state.lang === "ja" ? "音声" : "Sound";
      if (btn.dataset.value === "vibrate") btn.textContent = state.lang === "ja" ? "バイブ" : "Vibrate";
      if (btn.dataset.value === "none") btn.textContent = state.lang === "ja" ? "なし" : "None";
    });

    const voiceButtons = elements.voiceChoices.querySelectorAll(".choice");
    voiceButtons.forEach((btn) => {
      if (btn.dataset.value === "male") btn.textContent = state.lang === "ja" ? "男性" : "Male";
      if (btn.dataset.value === "female") btn.textContent = state.lang === "ja" ? "女性" : "Female";
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
    if (!localStorage.getItem("brewsteps_intro_seen")) {
      window.location.href = "./intro.html";
      return;
    }
    const params = new URLSearchParams(window.location.search);
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
      const raw = localStorage.getItem("coco-timer-settings");
      if (!raw) return { notifyMode: "sound", voice: "male", language: state.lang };
      try {
        return JSON.parse(raw);
      } catch {
        return { notifyMode: "sound", voice: "male", language: state.lang };
      }
    };

    const applySettings = (settings) => {
      Array.from(elements.langChoices.querySelectorAll(".choice")).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === state.lang);
      });
      Array.from(elements.notifyChoices.querySelectorAll(".choice")).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === settings.notifyMode);
      });
      Array.from(elements.voiceChoices.querySelectorAll(".choice")).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.value === settings.voice);
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
      });
      window.location.href = `./coco-timer.html?${params.toString()}`;
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
      localStorage.setItem("coco-timer-settings", JSON.stringify(settings));
      render();
      applySettings(settings);
    });

    elements.notifyChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      settings.notifyMode = value;
      localStorage.setItem("coco-timer-settings", JSON.stringify(settings));
      applySettings(settings);
    });

    elements.voiceChoices.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.dataset.value;
      if (!value) return;
      settings.voice = value;
      localStorage.setItem("coco-timer-settings", JSON.stringify(settings));
      applySettings(settings);
    });
  };

  init();
})();
