(() => {
  const state = {
    beans: 20,
    flavor: "neutral",
    waterRatio: 15,
  };

  const elements = {
    beansValue: document.getElementById("beans-value"),
    beansMinus: document.getElementById("beans-minus"),
    beansPlus: document.getElementById("beans-plus"),
    flavorChoices: document.getElementById("flavor-choices"),
    totalWater: document.getElementById("total-water"),
    stepList: document.getElementById("step-list"),
    startBtn: document.getElementById("start-btn"),
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
    const labels = ["閉じて蒸らし", "開けて1湯目", "2湯目", "閉じて低温の3湯目"];
    const steps = increments.map((inc, idx) => {
      cumulative += inc;
      return { label: labels[idx], cumulative };
    });
    return { total, steps };
  };

  const render = () => {
    elements.beansValue.textContent = `${state.beans}g`;

    Array.from(elements.flavorChoices.querySelectorAll(".choice")).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === state.flavor);
    });

    const { total, steps } = computeSteps();
    elements.totalWater.textContent = `合計: ${total}g`;
    elements.stepList.innerHTML = steps
      .map(
        (step, idx) =>
          `<div class="step-item"><span>Step ${idx + 1}: ${step.label}</span><span>${step.cumulative}g</span></div>`
      )
      .join("");
  };

  const init = () => {
    render();

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
  };

  init();
})();
