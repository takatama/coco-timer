import "./recipe-data.js";
import { mountSharedLayout } from "./shared-layout.js";

const audioAssetMap = {
  "ja-male-next-step": new URL("./assets/audio/ja-male-next-step.wav", import.meta.url).href,
  "ja-male-finish": new URL("./assets/audio/ja-male-finish.wav", import.meta.url).href,
  "ja-female-next-step": new URL("./assets/audio/ja-female-next-step.wav", import.meta.url).href,
  "ja-female-finish": new URL("./assets/audio/ja-female-finish.wav", import.meta.url).href,
  "en-male-next-step": new URL("./assets/audio/en-male-next-step.wav", import.meta.url).href,
  "en-male-finish": new URL("./assets/audio/en-male-finish.wav", import.meta.url).href,
  "en-female-next-step": new URL("./assets/audio/en-female-next-step.wav", import.meta.url).href,
  "en-female-finish": new URL("./assets/audio/en-female-finish.wav", import.meta.url).href,
};

const lottieAssetMap = {
  switch_open: new URL("./assets/lottie/switch_open.json", import.meta.url).href,
  switch_close: new URL("./assets/lottie/switch_close.json", import.meta.url).href,
  pour: new URL("./assets/lottie/pour.json", import.meta.url).href,
  cool: new URL("./assets/lottie/cool.json", import.meta.url).href,
};

(() => {
  mountSharedLayout();
  const getBasePath = () =>
    window.location.pathname.replace(/\/[^/]*$/, '/');
  const getDefaultLang = () => {
    const htmlLang = document.documentElement.lang;
    if (htmlLang === 'ja' || htmlLang === 'en') return htmlLang;
    return navigator.language.startsWith('ja') ? 'ja' : 'en';
  };

  const stepLabels = window.RECIPE_STEP_LABELS || {
    ja: [
      '閉じて蒸らし',
      '開けて1湯目',
      '2湯目',
      '閉じて低温の3湯目',
      '開ける',
      '完成',
    ],
    en: [
      'Close & Bloom',
      'Open: 1st pour',
      '2nd pour',
      'Close: cool 3rd pour',
      'Open',
      'Finish',
    ],
  };

  const recipe = {
    id: 'new-hybrid-method',
    name: { ja: '新しいハイブリッドメソッド', en: 'New Hybrid Method' },
    waterRatio: 15,
    waterTemp: 90,
    steps: [
      {
        timeSec: 0,
        actionType: 'switch_close_pour',
        name: { ja: stepLabels.ja[0], en: stepLabels.en[0] },
        waterAmountType: 'flavor1',
      },
      {
        timeSec: 40,
        actionType: 'switch_open_pour',
        name: { ja: stepLabels.ja[1], en: stepLabels.en[1] },
        waterAmountType: 'flavor2',
      },
      {
        timeSec: 90,
        actionType: 'pour_cool',
        name: { ja: stepLabels.ja[2], en: stepLabels.en[2] },
        waterAmountType: 'strength',
      },
      {
        timeSec: 130,
        actionType: 'switch_close_pour',
        name: { ja: stepLabels.ja[3], en: stepLabels.en[3] },
        waterAmountType: 'strength',
      },
      {
        timeSec: 165,
        actionType: 'switch_open',
        name: { ja: stepLabels.ja[4], en: stepLabels.en[4] },
        waterAmountType: null,
      },
      {
        timeSec: 210,
        actionType: 'none',
        name: { ja: stepLabels.ja[5], en: stepLabels.en[5] },
        waterAmountType: null,
      },
    ],
  };

  const texts = {
    ja: {
      currentStep: '今のステップ',
      nextStep: '次のステップは...',
      remaining: '残り時間',
      play: '再生',
      pause: '一時停止',
      reset: 'リセット',
      recipe: '新しいハイブリッドメソッド',
      editParams: '設定を変更',
      timeline: 'タイムライン',
      settings: '設定',
      notifyHint: '5秒前に通知します',
      save: '保存',
      close: '閉じる',
      notifySound: '音声',
      notifyVibrate: 'バイブ',
      notifyNone: 'なし',
      animOn: '表示',
      animOff: '非表示',
      debugTitle: 'デバッグ',
      debugHint: 'タイマーを高速再生します',
      debugOff: 'オフ',
      debugX5: 'x5倍速',
      waitNoPour: '待つ（注がない）',
      pourUntil: 'まで注ぐ',
      closeUp: '閉じる',
      openUp: '開ける',
      openDown: '開ける',
      up: '上',
      down: '下',
      enjoyCoffee: '美味しいコーヒーをどうぞ☕️',
      coolTo: '70℃まで下げる',
      finishLabel: '完成',
      waitLabel: '待つ',
    },
    en: {
      currentStep: 'Current Step',
      nextStep: 'Next Step is...',
      remaining: 'Remaining',
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset',
      recipe: 'New Hybrid Method',
      editParams: 'Edit settings',
      timeline: 'Timeline',
      settings: 'Settings',
      notifyHint: 'Notify 5 seconds before',
      save: 'Save',
      close: 'Close',
      notifySound: 'Sound',
      notifyVibrate: 'Vibrate',
      notifyNone: 'None',
      animOn: 'Show',
      animOff: 'Hide',
      debugTitle: 'Debug',
      debugHint: 'Speed up timer playback',
      debugOff: 'Off',
      debugX5: 'x5 Speed',
      waitNoPour: 'Wait (no pour)',
      pourUntil: 'Pour until',
      closeUp: 'CLOSE',
      openUp: 'OPEN',
      openDown: 'OPEN',
      up: 'UP',
      down: 'Down',
      enjoyCoffee: 'Enjoy your coffee☕️',
      coolTo: 'Cool to 70℃',
      finishLabel: 'FINISH',
      waitLabel: 'WAIT',
    },
  };

  const state = {
    running: false,
    currentTime: 0,
    intervalId: null,
    beansAmount: 20,
    flavor: 'neutral',
    lang: 'ja',
    notifyMode: 'sound',
    animation: true,
    voice: 'male',
    debugSpeed: 1,
    lastAnnouncedStep: -1,
    lastFinishAnnounced: false,
    overlayStepIndex: null,
    animationCountActive: false,
    animationCountStart: 0,
    animationCountFrom: 0,
    animationCountTo: 0,
    animationCountRaf: null,
    animationCountStep: null,
    wakeLock: null,
    keepScreenOn: false,
  };

  const elements = {
    playBtn: document.getElementById('play-btn'),
    resetBtn: document.getElementById('reset-btn'),
    stepMeta: document.getElementById('step-meta'),
    stepVerb: document.getElementById('step-verb'),
    stepSub: document.getElementById('step-sub'),
    waterAmount: document.getElementById('water-amount'),
    remainingTime: document.getElementById('remaining-time'),
    remainingProgress: document.getElementById('remaining-progress'),
    recipeSummary: document.getElementById('recipe-summary'),
    recipeParams: document.getElementById('recipe-params'),
    editParams: document.getElementById('edit-params'),
    timeline: document.getElementById('timeline'),
    animationCard: document.getElementById('animation-card'),
    labelNextStep: document.getElementById('label-next-step'),
    animationText: document.getElementById('animation-text'),
    animationNote: document.getElementById('animation-note'),
    lottieContainer: document.getElementById('lottie-container'),
    openSettings: document.getElementById('open-settings'),
    settingsModal: document.getElementById('settings-modal'),
    langChoices: document.getElementById('lang-choices'),
    notifyChoices: document.getElementById('notify-choices'),
    voiceChoices: document.getElementById('voice-choices'),
    debugChoices: document.getElementById('debug-choices'),
    labelTimeline: document.getElementById('label-timeline'),
    labelSettings: document.getElementById('label-settings'),
    labelLanguage: document.getElementById('label-language'),
    labelNotify: document.getElementById('label-notify'),
    labelNotifyHint: document.getElementById('label-notify-hint'),
    labelVoice: document.getElementById('label-voice'),
    labelDebug: document.getElementById('label-debug'),
    labelDebugHint: document.getElementById('label-debug-hint'),
    saveSettings: document.getElementById('save-settings'),
    closeSettingsBtn: document.getElementById('close-settings'),
    summaryCard: document.getElementById('summary-card'),
    currentStepCard: document.getElementById('current-step-card'),
    timelineCard: document.getElementById('timeline-card'),
    controlsCard: document.getElementById('controls-card'),
    screenStatus: document.getElementById('screen-status'),
  };

  const getAudio = (type) => {
    const lang = state.lang;
    const voice = state.voice;
    const file = audioAssetMap[`${lang}-${voice}-${type}`];
    if (!file) return null;
    return new Audio(file);
  };

  const lottieMap = lottieAssetMap;

  let lottieInstance = null;
  let lottieQueue = [];

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTotalWater = () => Math.round(state.beansAmount * recipe.waterRatio);

  const calcFlavor1 = () => {
    const total = getTotalWater();
    const factor =
      state.flavor === 'sweet' ? 0.42 : state.flavor === 'sour' ? 0.58 : 0.5;
    return Math.round(total * 0.4 * factor);
  };

  const calcFlavor2 = () => {
    const total = getTotalWater();
    const factor =
      state.flavor === 'sweet' ? 0.58 : state.flavor === 'sour' ? 0.42 : 0.5;
    return Math.round(total * 0.4 * factor);
  };

  const calcStrength = () => {
    const total = getTotalWater();
    return Math.round((total * 0.6) / 2);
  };

  const buildSteps = () => {
    let cumulative = 0;
    return recipe.steps.map((step) => {
      let increment = 0;
      if (step.waterAmountType === 'flavor1') increment = calcFlavor1();
      if (step.waterAmountType === 'flavor2') increment = calcFlavor2();
      if (step.waterAmountType === 'strength') increment = calcStrength();
      cumulative += increment;
      return { ...step, cumulative, increment };
    });
  };

  let computedSteps = buildSteps();

  const getCurrentStepIndex = () => {
    for (let i = computedSteps.length - 1; i >= 0; i -= 1) {
      if (state.currentTime >= computedSteps[i].timeSec) return i;
    }
    return 0;
  };

  const getStepName = (step) => (step?.name ? step.name[state.lang] : '-');

  const updateTimeline = () => {
    const currentIndex = getCurrentStepIndex();
    const totalTime = computedSteps[computedSteps.length - 1].timeSec;
    const pad = 18;
    const width = elements.timeline.clientWidth || 0;
    const lineWidth = Math.max(0, width - pad * 2);
    const html = computedSteps
      .map((step, index) => {
        const isCurrent = index === currentIndex;
        const isNext = index === currentIndex + 1;
        const isCompleted = index < currentIndex;
        const classes = ['step', index % 2 === 0 ? 'odd' : 'even'];
        if (isCurrent) classes.push('current');
        if (isNext) classes.push('next');
        if (isCompleted) classes.push('completed');
        const ratio = totalTime ? step.timeSec / totalTime : 0;
        const leftPx = pad + lineWidth * ratio;
        return `
          <div class="${classes.join(' ')}" style="left: ${leftPx}px">
            <div class="timeline-time">${formatTime(step.timeSec)}</div>
            <div class="timeline-label">${getStepName(step)}</div>
          </div>
        `;
      })
      .join('');
    const nowRatio = totalTime ? state.currentTime / totalTime : 0;
    const leftPx = pad + lineWidth * nowRatio;
    elements.timeline.innerHTML = `<div class="timeline-line"></div><div class="timeline-now" style="left:${leftPx}px">▶</div>${html}`;
  };

  const getRemainingToNext = () => {
    const currentIndex = getCurrentStepIndex();
    const nextStep = computedSteps[currentIndex + 1];
    if (!nextStep) {
      const finalTime = computedSteps[computedSteps.length - 1].timeSec;
      return Math.max(0, finalTime - state.currentTime);
    }
    return Math.max(0, nextStep.timeSec - state.currentTime);
  };

  const withParenNote = (label, note) => {
    const open = state.lang === 'ja' ? '（' : '(';
    const close = state.lang === 'ja' ? '）' : ')';
    return `${label}<span class="verb-note">${open}${note}${close}</span>`;
  };

  const getVerbText = (step) => {
    if (!step) return '-';
    const t = texts[state.lang];
    if (step.actionType === 'switch_close_pour') {
      return withParenNote(t.closeUp, t.up);
    }
    if (step.actionType === 'switch_open_pour' || step.actionType === 'pour_cool') {
      return withParenNote(t.openDown, t.down);
    }
    if (step.actionType === 'switch_open') {
      return withParenNote(t.openUp, t.up);
    }
    if (step.actionType === 'none') {
      return t.finishLabel;
    }
    return t.waitLabel;
  };

  const actionText = (step) => {
    return getVerbText(step);
  };

  const getInstructionText = (step, amountOverride = null) => {
    if (!step) return '-';
    const t = texts[state.lang];
    const amount = amountOverride ?? step.cumulative ?? 0;
    if (step.actionType === 'none') {
      return t.enjoyCoffee;
    }
    if (step.actionType === 'switch_close_pour') {
      return state.lang === 'ja'
        ? `<span class="pour-amount">${amount}g</span> まで注ぐ`
        : `Pour to <span class="pour-amount">${amount}g</span>`;
    }
    if (step.actionType === 'switch_open_pour') {
      return state.lang === 'ja'
        ? `<span class="pour-amount">${amount}g</span> まで注ぐ`
        : `Pour to <span class="pour-amount">${amount}g</span>`;
    }
    if (step.actionType === 'pour_cool') {
      return state.lang === 'ja'
        ? `<span class="pour-amount">${amount}g</span> まで注ぎ、<span class="pour-amount">70℃</span> まで下げる`
        : `Pour to <span class="pour-amount">${amount}g</span>, cool to <span class="pour-amount">70℃</span>`;
    }
    if (step.actionType === 'switch_open') {
      return t.waitNoPour;
    }
    return t.waitNoPour;
  };

  const getAnimationInstructionText = (step, amountOverride = null) => {
    if (!step) return '-';
    const amount = amountOverride ?? step.cumulative ?? 0;
    if (step.actionType === 'switch_close_pour') {
      return state.lang === 'ja'
        ? `閉じて <span class="pour-amount">${amount}g</span> まで注ぐ`
        : `Close, pour to <span class="pour-amount">${amount}g</span>`;
    }
    if (step.actionType === 'switch_open_pour') {
      return state.lang === 'ja'
        ? `開けて <span class="pour-amount">${amount}g</span> まで注ぐ`
        : `Open, pour to <span class="pour-amount">${amount}g</span>`;
    }
    if (step.actionType === 'pour_cool') {
      return state.lang === 'ja'
        ? `<span class="pour-amount">${amount}g</span> まで注ぎ、<span class="pour-amount">70℃</span> まで下げる`
        : `Pour to <span class="pour-amount">${amount}g</span>, cool to <span class="pour-amount">70℃</span>`;
    }
    if (step.actionType === 'switch_open') {
      return texts[state.lang].waitNoPour;
    }
    if (step.actionType === 'none') {
      return texts[state.lang].enjoyCoffee;
    }
    return texts[state.lang].waitNoPour;
  };

  const subActionText = (step) => getInstructionText(step);

  const updateMainCard = () => {
    const currentIndex = getCurrentStepIndex();
    const currentStep = computedSteps[currentIndex];
    const remainingToNext = getRemainingToNext();
    const nextStep = computedSteps[currentIndex + 1];
    const stepStart = currentStep?.timeSec ?? 0;
    const stepEnd = nextStep
      ? nextStep.timeSec
      : computedSteps[computedSteps.length - 1].timeSec;
    const stepDuration = Math.max(1, stepEnd - stepStart);
    const elapsed = Math.max(0, state.currentTime - stepStart);
    const progress = Math.min(1, elapsed / stepDuration);
    elements.stepMeta.textContent = `STEP ${currentIndex + 1} / ${computedSteps.length}`;
    elements.stepVerb.innerHTML = actionText(currentStep);
    elements.stepSub.innerHTML = subActionText(currentStep);
    elements.remainingTime.textContent = formatTime(remainingToNext);
    elements.remainingProgress.style.width = `${Math.round(progress * 100)}%`;
    const isImminent = remainingToNext > 0 && remainingToNext <= 5;
    const card = document.getElementById('current-step-card');
    card.classList.toggle('imminent', isImminent);
  };

  const updateSummary = () => {
    elements.recipeSummary.textContent = recipe.name[state.lang];
    const flavorLabelJa =
      state.flavor === 'sweet'
        ? '甘味'
        : state.flavor === 'sour'
          ? '酸味'
          : 'バランス';
    const flavorLabelEn =
      state.flavor === 'sweet'
        ? 'Sweet'
        : state.flavor === 'sour'
          ? 'Sour'
          : 'Balance';
    const flavorLabel = state.lang === 'ja' ? flavorLabelJa : flavorLabelEn;
    elements.recipeParams.textContent =
      state.lang === 'ja'
        ? `豆量 ${state.beansAmount}g / 味わい ${flavorLabel} / 抽出量 ${getTotalWater()}g`
        : `Beans ${state.beansAmount}g / Flavor ${flavorLabel} / Water ${getTotalWater()}g`;
  };

  const updateCompleteScreen = () => {
    const finalTime = computedSteps[computedSteps.length - 1].timeSec;
    const isComplete = state.currentTime >= finalTime;
    if (isComplete) {
      hideOverlay();
      elements.playBtn.textContent = texts[state.lang].play;
      releaseWakeLock();
    }
  };

  const requestWakeLock = async () => {
    state.keepScreenOn = true;
    elements.screenStatus.hidden = false;
    if (!('wakeLock' in navigator)) return;
    try {
      if (!state.wakeLock) {
        state.wakeLock = await navigator.wakeLock.request('screen');
        state.wakeLock.addEventListener('release', () => {
          state.wakeLock = null;
        });
      }
    } catch {}
  };

  const releaseWakeLock = () => {
    if (state.wakeLock) {
      state.wakeLock.release().catch(() => {});
      state.wakeLock = null;
    }
    state.keepScreenOn = false;
    elements.screenStatus.hidden = true;
  };

  const triggerNotification = (isFinish) => {
    if (state.notifyMode === 'vibrate' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150]);
    }
    if (state.notifyMode === 'sound') {
      const audioEl = getAudio(isFinish ? 'finish' : 'next-step');
      if (!audioEl) return;
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    }
  };

  const buildLottieQueue = (actionType) => {
    if (actionType === 'switch_close_pour') return ['switch_close', 'pour'];
    if (actionType === 'switch_open_pour') return ['switch_open', 'pour'];
    if (actionType === 'pour_cool') return ['pour', 'cool'];
    if (actionType === 'switch_close') return ['switch_close'];
    if (actionType === 'switch_open') return ['switch_open'];
    if (actionType === 'pour') return ['pour'];
    return [];
  };

  const playLottieQueue = (queue, onDone) => {
    lottieQueue = queue.slice();
    if (!lottieQueue.length) return;
    if (lottieInstance) {
      lottieInstance.destroy();
      lottieInstance = null;
    }
    const next = lottieQueue.shift();
    if (next === 'pour') {
      startAnimationCounting();
    }

    if (!window.lottie || typeof window.lottie.loadAnimation !== 'function') {
      onDone();
      return;
    }

    lottieInstance = window.lottie.loadAnimation({
      container: elements.lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: lottieMap[next],
    });
    lottieInstance.addEventListener('complete', () => {
      if (!lottieQueue.length) {
        stopAnimationCounting(true);
        if (onDone) onDone();
        return;
      }
      playLottieQueue(lottieQueue, onDone);
    });
  };

  const showOverlayForStep = (step, stepIndex = null) => {
    if (!state.animation) return;
    state.overlayStepIndex = stepIndex;
    elements.animationCard.hidden = false;
    elements.labelNextStep.textContent = texts[state.lang].nextStep;
    elements.animationText.innerHTML = getAnimationInstructionText(step);
    const isPour =
      step.actionType === 'switch_close_pour' ||
      step.actionType === 'switch_open_pour' ||
      step.actionType === 'pour_cool';
    const prevAmount =
      stepIndex && stepIndex > 0 ? computedSteps[stepIndex - 1].cumulative : 0;
    state.animationCountFrom = prevAmount;
    state.animationCountTo = step.cumulative || prevAmount;
    state.animationCountStep = step;
    elements.animationText.dataset.isPour = isPour ? '1' : '0';
    elements.animationText.dataset.template = getAnimationInstructionText(step);
    elements.animationText.innerHTML = isPour
      ? getAnimationInstructionText(step, prevAmount)
      : getAnimationInstructionText(step);
    elements.animationNote.textContent = '';
    playLottieQueue(buildLottieQueue(step.actionType));
  };

  const hideOverlay = () => {
    elements.animationCard.hidden = true;
    state.overlayStepIndex = null;
    stopAnimationCounting(true);
    if (lottieInstance) {
      lottieInstance.destroy();
      lottieInstance = null;
    }
  };

  const startAnimationCounting = () => {
    stopAnimationCounting();
    const from = state.animationCountFrom;
    const to = state.animationCountTo;
    const step = state.animationCountStep;
    if (from === to) return;
    state.animationCountActive = true;
    state.animationCountStart = performance.now();
    const duration = 1000;
    const tickCount = (ts) => {
      if (!state.animationCountActive) return;
      const elapsed = ts - state.animationCountStart;
      const progress = Math.min(1, elapsed / duration);
      const value = Math.round(from + (to - from) * progress);
      elements.animationText.innerHTML = getAnimationInstructionText(
        step,
        value,
      );
      if (progress < 1) {
        state.animationCountRaf = requestAnimationFrame(tickCount);
      } else {
        elements.animationText.innerHTML = getAnimationInstructionText(
          step,
          to,
        );
      }
    };
    state.animationCountRaf = requestAnimationFrame(tickCount);
  };

  const stopAnimationCounting = (snapToTarget = false) => {
    state.animationCountActive = false;
    if (state.animationCountRaf) {
      cancelAnimationFrame(state.animationCountRaf);
      state.animationCountRaf = null;
    }
    if (snapToTarget) {
      elements.animationText.innerHTML = getAnimationInstructionText(
        state.animationCountStep,
        state.animationCountTo,
      );
    }
  };

  const tick = () => {
    if (!state.running) return;
    const speed = Math.max(1, state.debugSpeed);
    for (let i = 0; i < speed; i += 1) {
      state.currentTime += 1;
      const currentIndex = getCurrentStepIndex();
      const nextStep = computedSteps[currentIndex + 1];
      const remainingToNext = getRemainingToNext();
      const finalTime = computedSteps[computedSteps.length - 1].timeSec;

      if (
        nextStep &&
        remainingToNext === 5 &&
        state.lastAnnouncedStep !== currentIndex + 1
      ) {
        state.lastAnnouncedStep = currentIndex + 1;
        const isFinishStep = nextStep.actionType === 'none';
        triggerNotification(isFinishStep);
        if (!isFinishStep) {
          showOverlayForStep(nextStep, currentIndex + 1);
        }
      }

      if (
        !nextStep &&
        finalTime - state.currentTime === 5 &&
        !state.lastFinishAnnounced
      ) {
        state.lastFinishAnnounced = true;
        triggerNotification(true);
      }

      if (state.overlayStepIndex !== null) {
        const overlayStep = computedSteps[state.overlayStepIndex];
        if (overlayStep && state.currentTime >= overlayStep.timeSec) {
          hideOverlay();
        }
      }

      if (state.currentTime >= finalTime) {
        state.running = false;
        clearInterval(state.intervalId);
        state.intervalId = null;
        break;
      }
    }
    updateMainCard();
    updateTimeline();
    updateCompleteScreen();
  };

  const startTimer = () => {
    if (state.running) return;
    const beginCountdown = () => {
      state.running = true;
      elements.playBtn.textContent = texts[state.lang].pause;
      requestWakeLock();
      state.intervalId = setInterval(tick, 1000);
    };

    if (state.currentTime === 0 && state.animation) {
      showOverlayForStep(computedSteps[0], 0);
      setTimeout(() => {
  mountSharedLayout();
        hideOverlay();
        beginCountdown();
      }, 5000);
      return;
    }

    beginCountdown();
  };

  const pauseTimer = () => {
    state.running = false;
    elements.playBtn.textContent = texts[state.lang].play;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    state.currentTime = 0;
    state.lastAnnouncedStep = -1;
    state.lastFinishAnnounced = false;
    state.overlayStepIndex = null;
    hideOverlay();
    releaseWakeLock();
    updateMainCard();
    updateTimeline();
    updateCompleteScreen();
  };

  const applySettingsUI = () => {
    const setActive = (container, value) => {
      if (!container) return;
      Array.from(container.querySelectorAll('.choice')).forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.value === value);
      });
    };
    setActive(elements.langChoices, state.lang);
    setActive(elements.notifyChoices, state.notifyMode);
    setActive(elements.voiceChoices, state.voice);
    setActive(elements.debugChoices, state.debugSpeed === 5 ? 'x5' : 'off');
  };

  const applyLanguage = () => {
    const t = texts[state.lang];
    document.documentElement.lang = state.lang;
    elements.labelTimeline.textContent = t.timeline;
    elements.editParams.textContent = t.editParams;
    elements.labelSettings.textContent = t.settings;
    elements.labelLanguage.textContent =
      state.lang === 'ja' ? '言語' : 'Language';
    elements.labelNotify.textContent =
      state.lang === 'ja' ? '通知' : 'Notification';
    elements.labelNotifyHint.textContent = t.notifyHint;
    elements.labelVoice.textContent = state.lang === 'ja' ? '音声' : 'Voice';
    elements.labelDebug.textContent = t.debugTitle;
    elements.labelDebugHint.textContent = t.debugHint;
    elements.playBtn.textContent = state.running ? t.pause : t.play;
    elements.resetBtn.textContent = t.reset;
    elements.labelNextStep.textContent = t.nextStep;
    elements.saveSettings.textContent = t.save;
    elements.closeSettingsBtn.textContent = t.close;
    elements.screenStatus.textContent =
      state.lang === 'ja' ? '画面はオンのままです' : 'Screen will stay on';

    const notifyButtons = elements.notifyChoices.querySelectorAll('.choice');
    notifyButtons.forEach((btn) => {
      if (btn.dataset.value === 'sound') btn.textContent = t.notifySound;
      if (btn.dataset.value === 'vibrate') btn.textContent = t.notifyVibrate;
      if (btn.dataset.value === 'none') btn.textContent = t.notifyNone;
    });

    const voiceButtons = elements.voiceChoices.querySelectorAll('.choice');
    voiceButtons.forEach((btn) => {
      if (btn.dataset.value === 'male')
        btn.textContent = state.lang === 'ja' ? '男性' : 'Male';
      if (btn.dataset.value === 'female')
        btn.textContent = state.lang === 'ja' ? '女性' : 'Female';
    });

    const debugButtons = elements.debugChoices.querySelectorAll('.choice');
    debugButtons.forEach((btn) => {
      if (btn.dataset.value === 'off') btn.textContent = t.debugOff;
      if (btn.dataset.value === 'x5') btn.textContent = t.debugX5;
    });
  };

  const saveSettings = () => {
    localStorage.setItem(
      'coco-timer-settings',
      JSON.stringify({
        language: state.lang,
        notifyMode: state.notifyMode,
        voice: state.voice,
        debugSpeed: state.debugSpeed,
      }),
    );
  };

  const loadSettings = () => {
    const raw = localStorage.getItem('coco-timer-settings');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.language) state.lang = parsed.language;
      if (parsed.lang) state.lang = parsed.lang;
      if (parsed.notifyMode) state.notifyMode = parsed.notifyMode;
      if (parsed.voice) state.voice = parsed.voice;
      if (typeof parsed.debugSpeed === 'number')
        state.debugSpeed = parsed.debugSpeed;
    } catch {}
  };

  const bindChoiceButtons = (container, onSelect) => {
    container.querySelectorAll('.choice').forEach((btn) => {
      btn.addEventListener('click', () => onSelect(btn.dataset.value));
    });
  };

  const init = () => {
    state.lang = getDefaultLang();
    const params = new URLSearchParams(window.location.search);
    const beansParam = Number(params.get('beans'));
    const flavorParam = params.get('flavor');
    if (beansParam && !Number.isNaN(beansParam)) state.beansAmount = beansParam;
    if (['sweet', 'neutral', 'sour'].includes(flavorParam))
      state.flavor = flavorParam;

    loadSettings();
    applySettingsUI();
    applyLanguage();
    computedSteps = buildSteps();
    updateSummary();
    updateMainCard();
    updateTimeline();
    updateCompleteScreen();

    elements.playBtn.addEventListener('click', () => {
      if (state.running) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
    elements.resetBtn.addEventListener('click', resetTimer);

    elements.editParams.addEventListener('click', () => {
      const params = new URLSearchParams({
        beans: String(state.beansAmount),
        flavor: state.flavor,
      });
      window.location.href = `${getBasePath()}setup.html?${params.toString()}`;
    });

    elements.openSettings.addEventListener('click', () => {
      elements.settingsModal.classList.add('active');
    });
    elements.closeSettingsBtn.addEventListener('click', () => {
      elements.settingsModal.classList.remove('active');
    });
    elements.saveSettings.addEventListener('click', () => {
      saveSettings();
      elements.settingsModal.classList.remove('active');
    });

    bindChoiceButtons(elements.langChoices, (value) => {
      state.lang = value;
      applyLanguage();
      updateSummary();
      updateMainCard();
      updateTimeline();
      updateCompleteScreen();
      applySettingsUI();
    });
    bindChoiceButtons(elements.notifyChoices, (value) => {
      state.notifyMode = value;
      applySettingsUI();
    });
    bindChoiceButtons(elements.voiceChoices, (value) => {
      state.voice = value;
      applySettingsUI();
    });

    bindChoiceButtons(elements.debugChoices, (value) => {
      state.debugSpeed = value === 'x5' ? 5 : 1;
      applySettingsUI();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && state.keepScreenOn) {
        requestWakeLock();
      }
    });

    window.addEventListener('beforeunload', saveSettings);
  };

  init();
})();
