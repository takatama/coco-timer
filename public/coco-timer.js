(() => {
  const recipe = {
    id: 'new-hybrid-method',
    name: { ja: '新しいハイブリッドメソッド', en: 'New Hybrid Method' },
    waterRatio: 15,
    waterTemp: 90,
    steps: [
      {
        timeSec: 0,
        actionType: 'switch_close_pour',
        name: { ja: '閉じて蒸らし', en: 'Initial Bloom' },
        waterAmountType: 'flavor1',
      },
      {
        timeSec: 40,
        actionType: 'switch_open_pour',
        name: { ja: '開けて1湯目', en: 'Flavor Extraction' },
        waterAmountType: 'flavor2',
      },
      {
        timeSec: 90,
        actionType: 'pour_cool',
        name: { ja: '2湯目', en: 'Percolation Extraction' },
        waterAmountType: 'strength',
      },
      {
        timeSec: 130,
        actionType: 'switch_close_pour',
        name: { ja: '閉じて低温の3湯目', en: 'Cool Immersion' },
        waterAmountType: 'strength',
      },
      {
        timeSec: 165,
        actionType: 'switch_open',
        name: { ja: 'スイッチを開ける', en: 'Open the Switch' },
        waterAmountType: null,
      },
      {
        timeSec: 210,
        actionType: 'none',
        name: { ja: '完成', en: 'Finish' },
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
    animChoices: document.getElementById('anim-choices'),
    debugChoices: document.getElementById('debug-choices'),
    labelTimeline: document.getElementById('label-timeline'),
    labelSettings: document.getElementById('label-settings'),
    labelLanguage: document.getElementById('label-language'),
    labelNotify: document.getElementById('label-notify'),
    labelNotifyHint: document.getElementById('label-notify-hint'),
    labelAnimation: document.getElementById('label-animation'),
    labelDebug: document.getElementById('label-debug'),
    labelDebugHint: document.getElementById('label-debug-hint'),
    saveSettings: document.getElementById('save-settings'),
    closeSettingsBtn: document.getElementById('close-settings'),
    summaryCard: document.getElementById('summary-card'),
    currentStepCard: document.getElementById('current-step-card'),
    timelineCard: document.getElementById('timeline-card'),
    controlsCard: document.getElementById('controls-card'),
  };

  const audio = {
    next: new Audio('./assets/audio/next-step.wav'),
    finish: new Audio('./assets/audio/finish.wav'),
  };

  const lottieMap = {
    switch_open: './assets/lottie/switch_open.json',
    switch_close: './assets/lottie/switch_close.json',
    pour: './assets/lottie/pour.json',
    cool: './assets/lottie/cool.json',
  };

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
    if (
      step.actionType === 'switch_open_pour' ||
      step.actionType === 'pour_cool' ||
      step.actionType === 'switch_open'
    ) {
      return withParenNote(t.openDown, t.down);
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
      return state.lang === 'ja' ? '開ける' : 'Open';
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
      return state.lang === texts[state.lang].waitLabel;
    }
    if (step.actionType === 'none') {
      return state.lang === texts[state.lang].enjoyCoffee;
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
    }
  };

  const triggerNotification = (isFinish) => {
    if (state.notifyMode === 'vibrate' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150]);
    }
    if (state.notifyMode === 'sound') {
      const audioEl = isFinish ? audio.finish : audio.next;
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
      state.intervalId = setInterval(tick, 1000);
    };

    if (state.currentTime === 0 && state.animation) {
      showOverlayForStep(computedSteps[0], 0);
      setTimeout(() => {
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
    updateMainCard();
    updateTimeline();
    updateCompleteScreen();
  };

  const applySettingsUI = () => {
    const setActive = (container, value) => {
      Array.from(container.querySelectorAll('.choice')).forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.value === value);
      });
    };
    setActive(elements.langChoices, state.lang);
    setActive(elements.notifyChoices, state.notifyMode);
    setActive(elements.animChoices, state.animation ? 'on' : 'off');
    setActive(elements.debugChoices, state.debugSpeed === 5 ? 'x5' : 'off');
  };

  const applyLanguage = () => {
    const t = texts[state.lang];
    document.documentElement.lang = state.lang;
    elements.labelTimeline.textContent = t.timeline;
    elements.labelSettings.textContent = t.settings;
    elements.labelLanguage.textContent =
      state.lang === 'ja' ? '言語' : 'Language';
    elements.labelNotify.textContent =
      state.lang === 'ja' ? '通知' : 'Notification';
    elements.labelNotifyHint.textContent = t.notifyHint;
    elements.labelAnimation.textContent =
      state.lang === 'ja' ? 'アニメーション' : 'Animation';
    elements.labelDebug.textContent = t.debugTitle;
    elements.labelDebugHint.textContent = t.debugHint;
    elements.playBtn.textContent = state.running ? t.pause : t.play;
    elements.resetBtn.textContent = t.reset;
    elements.labelNextStep.textContent = t.nextStep;
    elements.saveSettings.textContent = t.save;
    elements.closeSettingsBtn.textContent = t.close;

    const notifyButtons = elements.notifyChoices.querySelectorAll('.choice');
    notifyButtons.forEach((btn) => {
      if (btn.dataset.value === 'sound') btn.textContent = t.notifySound;
      if (btn.dataset.value === 'vibrate') btn.textContent = t.notifyVibrate;
      if (btn.dataset.value === 'none') btn.textContent = t.notifyNone;
    });

    const animButtons = elements.animChoices.querySelectorAll('.choice');
    animButtons.forEach((btn) => {
      if (btn.dataset.value === 'on') btn.textContent = t.animOn;
      if (btn.dataset.value === 'off') btn.textContent = t.animOff;
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
        lang: state.lang,
        notifyMode: state.notifyMode,
        animation: state.animation,
        debugSpeed: state.debugSpeed,
      }),
    );
  };

  const loadSettings = () => {
    const raw = localStorage.getItem('coco-timer-settings');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.lang) state.lang = parsed.lang;
      if (parsed.notifyMode) state.notifyMode = parsed.notifyMode;
      if (typeof parsed.animation === 'boolean')
        state.animation = parsed.animation;
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
    bindChoiceButtons(elements.animChoices, (value) => {
      state.animation = value === 'on';
      applySettingsUI();
    });

    bindChoiceButtons(elements.debugChoices, (value) => {
      state.debugSpeed = value === 'x5' ? 5 : 1;
      applySettingsUI();
    });

    if (window.location.protocol === 'file:') {
      state.animation = false;
      Array.from(elements.animChoices.querySelectorAll('.choice')).forEach(
        (btn) => {
          btn.disabled = true;
        },
      );
      applySettingsUI();
    }

    window.addEventListener('beforeunload', saveSettings);
  };

  init();
})();
