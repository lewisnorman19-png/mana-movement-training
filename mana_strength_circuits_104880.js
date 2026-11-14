
/* =========================================================
   MANA MOVEMENT TRAINING
   CIRCUITS — DURATION & ALIGNMENT UPDATE
   BUILD 104887

   COMPLETE REPLACEMENT:
   mana_strength_circuits_104880.js

   - EMOM: 10 / 15 / 20 minutes
   - Tabata: 1 / 2 / 3 x 4-minute blocks
   - Strength: 15 / 30 / 45 minutes
   - Different schedules for each Strength duration
   - Top-align all three circuit cards
   - Centre Home button
   - Preserve original Learning access
   - Preserve existing Circuit navigation
   - No database changes
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "104887";
  const FLAG = "MANA_STRENGTH_CIRCUITS_104887";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const SHELL = "manaV83ProgramShell";
  const TABS = "manaV83Tabs";
  const CONTENT = "manaV83Content";
  const STYLE = "manaCircuitsStyle104887";

  const $ = id => document.getElementById(id);

  let mode = "circuits";
  let type = "emom";

  let duration = 15;
  let total = 900;
  let remaining = 900;

  let interval = null;
  let running = false;
  let finishAt = 0;
  let openingLearning = false;

  const plans = {
    emom: {
      name: "EMOM",
      subtitle: "Every Minute on the Minute",
      description:
        "Start the next exercise at the beginning " +
        "of each minute. Complete your repetitions " +
        "with control, then recover until the next minute.",
      movements: [
        "Goblet squat — 10 reps",
        "Push-ups — 8–12 reps",
        "Dumbbell row — 10 reps each side",
        "Reverse lunge — 8 reps each leg",
        "Plank — 35 seconds"
      ]
    },

    tabata: {
      name: "Tabata",
      subtitle: "20 seconds work · 10 seconds rest",
      description:
        "Eight rounds make one four-minute block. " +
        "Alternate 20 seconds of exercise with " +
        "10 seconds of recovery.",
      movements: [
        "Block 1 — Squat to press",
        "Block 2 — Mountain climbers",
        "Block 3 — Kettlebell deadlift"
      ]
    },

    strength: {
      name: "Strength Circuit",
      subtitle: "Full-body strength and conditioning",
      description:
        "Choose a 15-, 30- or 45-minute circuit. " +
        "Each session includes a warm-up, two " +
        "strength blocks, a finisher and a cool-down."
    }
  };

  const strengthSchedules = {
    15: [
      { name: "Warm-up", minutes: 3,
        detail: "Mobility and light cardio" },
      { name: "Block A", minutes: 4,
        detail: "Goblet squat / Push-up / Row — controlled rounds" },
      { name: "Block B", minutes: 4,
        detail: "Romanian deadlift / Lunge / Shoulder press — controlled rounds" },
      { name: "Finisher", minutes: 2,
        detail: "Farmer carry / Step-ups" },
      { name: "Cool-down", minutes: 2,
        detail: "Easy walking and mobility" }
    ],

    30: [
      { name: "Warm-up", minutes: 5,
        detail: "Mobility, activation and easy cardio" },
      { name: "Block A", minutes: 9,
        detail: "Goblet squat / Dumbbell bench press / Cable row — 3 rounds" },
      { name: "Block B", minutes: 9,
        detail: "Romanian deadlift / Reverse lunge / Shoulder press — 3 rounds" },
      { name: "Finisher", minutes: 4,
        detail: "Carry / Dead bug / Step-ups" },
      { name: "Cool-down", minutes: 3,
        detail: "Walking, stretching and mobility" }
    ],

    45: [
      { name: "Warm-up", minutes: 5,
        detail: "Mobility, activation and easy cardio" },
      { name: "Block A", minutes: 15,
        detail: "Goblet squat / Dumbbell bench press / Cable row — 3 rounds" },
      { name: "Block B", minutes: 15,
        detail: "Romanian deadlift / Reverse lunge / Shoulder press — 3 rounds" },
      { name: "Finisher", minutes: 5,
        detail: "Carry / Dead bug / Step-ups" },
      { name: "Cool-down", minutes: 5,
        detail: "Walking, stretching and mobility" }
    ]
  };

  /* =====================================================
     PROGRAM DETECTION
     ===================================================== */

  function strengthOpen() {
    return Boolean(
      $(SHELL)?.classList.contains("open") &&
      /strength/i.test(
        $("manaV83Title")?.textContent || ""
      )
    );
  }

  function learnTab() {
    return $(TABS)?.querySelector(
      '[data-v83-tab="learn"]'
    );
  }

  function learnSelected() {
    return Boolean(
      strengthOpen() &&
      learnTab()?.classList.contains("active")
    );
  }

  function circuitVisible() {
    return learnSelected() && mode === "circuits";
  }

  function clockText(seconds) {
    seconds = Math.max(0, Math.floor(seconds));

    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return (
      String(min).padStart(2, "0") +
      ":" +
      String(sec).padStart(2, "0")
    );
  }

  function safeText(value) {
    return String(value).replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* Home — centre its contents */

      #${SHELL} #manaV83Back {
        display: inline-flex !important;
        flex-direction: row !important;
        justify-content: center !important;
        align-items: center !important;

        text-align: center !important;

        line-height: 1.2 !important;
        vertical-align: middle !important;

        min-height: 42px !important;
        padding: 0 15px !important;

        white-space: nowrap !important;
      }

      #${CONTENT} .msc-root {
        display: grid;
        gap: 14px;
        color: #FFFFFF;
        padding: 5px 0 22px;
      }

      #${CONTENT} .msc-kicker {
        color: #FF7927 !important;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .12em;
      }

      #${CONTENT} .msc-root h2 {
        font-size: clamp(24px,5vw,31px);
        color: #FFFFFF !important;
        margin: 5px 0;
      }

      #${CONTENT} .msc-muted {
        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.55;
      }

      /* All 3 formats aligned */

      #${CONTENT} .msc-choices {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        align-items: stretch;
        gap: 9px;
      }

      #${CONTENT} .msc-choice {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;

        min-width: 0;
        min-height: 92px;
        height: 100%;

        padding: 17px 12px;

        background: #17191D;
        border: 1px solid #59616C;
        border-radius: 15px;

        color: #FFFFFF;
        text-align: left;
        box-sizing: border-box;
        cursor: pointer;
      }

      #${CONTENT} .msc-choice.active {
        border-color: #FF7927;
        background: #291910;
      }

      #${CONTENT} .msc-choice strong {
        display: block;
        width: 100%;

        color: #FFFFFF !important;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.3;

        margin: 0 0 7px;
      }

      #${CONTENT} .msc-choice small {
        display: block;

        color: #C1C6CE;
        font-size: 10px;
        line-height: 1.45;

        margin: 0;
      }

      #${CONTENT} .msc-panel {
        padding: 17px;

        background: #15171A;
        border: 1px solid #535C68;
        border-radius: 18px;
      }

      #${CONTENT} .msc-panel h3 {
        color: #FFFFFF !important;
        font-size: 19px;
        margin: 5px 0 9px;
      }

      #${CONTENT} .msc-label {
        color: #FF7927 !important;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .08em;
      }

      #${CONTENT} .msc-list {
        display: grid;
        gap: 8px;

        padding: 0;
        margin: 14px 0 0;
        list-style: none;
      }

      #${CONTENT} .msc-list li {
        padding: 12px;

        background: #0B0D10;
        border: 1px solid #373E48;
        border-radius: 10px;

        color: #FFFFFF;
        font-size: 12px;
        line-height: 1.5;
      }

      #${CONTENT} .msc-settings {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 13px 0;
      }

      #${CONTENT} .msc-setting {
        padding: 10px 13px;

        background: #111317;
        border: 1px solid #58616B;
        border-radius: 11px;

        color: #FFFFFF;
        font-size: 13px;
        font-weight: 800;

        cursor: pointer;
      }

      #${CONTENT}
      .msc-setting[aria-pressed="true"] {
        color: #FF7927;
        border-color: #FF7927;
      }

      #${CONTENT} .msc-timer {
        padding: 19px 13px;

        background: #0C0E11 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 17px;

        text-align: center;
      }

      #${CONTENT} .msc-clock {
        color: #FFFFFF !important;
        font-size: clamp(44px,11vw,64px);
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
      }

      #${CONTENT} .msc-step {
        min-height: 20px;
        color: #FF7927 !important;
        font-size: 12px;
        font-weight: 900;
      }

      #${CONTENT} .msc-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 9px;
        margin-top: 14px;
      }

      #${CONTENT} .msc-btn {
        padding: 12px 18px;

        background: #FF7927;
        border: 1px solid #FF7927;
        border-radius: 11px;

        color: #090B0E;
        font-weight: 900;
        cursor: pointer;
      }

      #${CONTENT} .msc-btn.alt {
        background: #15171A;
        border-color: #646E79;
        color: #FFFFFF;
      }

      /* Learning banner on Overview */

      #${CONTENT} .msc-overview-learn {
        width: 100%;
        margin: 16px 0;
        padding: 18px;

        background: #15171A;
        border: 1px solid #FF7927;
        border-radius: 18px;

        text-align: left;
        cursor: pointer;
      }

      #${CONTENT} .msc-overview-learn strong {
        display: block;
        color: #FFFFFF;
        font-size: 17px;
        font-weight: 900;
        margin-top: 5px;
      }

      #${CONTENT} .msc-overview-learn small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 5px;
      }

      @media(max-width:540px) {
        #${CONTENT} .msc-choices {
          gap: 6px;
        }

        #${CONTENT} .msc-choice {
          min-height: 101px;
          padding: 12px 8px;
        }

        #${CONTENT} .msc-choice strong {
          font-size: 12px;
        }

        #${CONTENT} .msc-choice small {
          font-size: 9px;
        }

        #${CONTENT} .msc-panel {
          padding: 13px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     SESSION CONFIGURATION
     ===================================================== */

  function sessionSeconds() {
    if (type === "tabata") {
      return duration * 240;
    }

    return duration * 60;
  }

  function strengthStages() {
    return strengthSchedules[duration] ||
      strengthSchedules[45];
  }

  function currentStrengthStage(elapsed) {
    let cursor = 0;

    for (const stage of strengthStages()) {
      cursor += stage.minutes * 60;

      if (elapsed < cursor) return stage.name;
    }

    return "Cool-down";
  }

  function workoutList() {
    if (type === "strength") {
      return strengthStages().map(stage => (
        stage.name + " · " +
        stage.minutes + " min — " +
        stage.detail
      ));
    }

    if (type === "emom") {
      return plans.emom.movements.map(
        (movement, i) =>
          "Minute " + (i + 1) + " · " + movement
      );
    }

    return plans.tabata.movements;
  }

  function stopTimer() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }

    running = false;
  }

  function resetTimer() {
    stopTimer();

    total = sessionSeconds();
    remaining = total;

    updateClock();
  }

  function tick() {
    if (!running) return;

    remaining = Math.max(
      0,
      Math.ceil((finishAt - Date.now()) / 1000)
    );

    if (remaining <= 0) {
      stopTimer();
    }

    updateClock();
  }

  function updateClock() {
    const root = $(CONTENT)?.querySelector(
      ".msc-root"
    );

    if (!root) return;

    const clock = root.querySelector(".msc-clock");
    const phase = root.querySelector(".msc-step");
    const start = root.querySelector(
      '[data-msc-action="start"]'
    );

    if (!clock || !phase || !start) return;

    clock.textContent = clockText(remaining);

    start.textContent =
      running ? "Pause timer" :
      remaining === 0 ? "Start again" :
      remaining === total ? "Start timer" :
      "Resume timer";

    const elapsed = Math.max(
      0,
      total - remaining
    );

    if (remaining === 0) {
      phase.textContent = "Session complete";
      return;
    }

    if (type === "emom") {
      const minute = Math.floor(elapsed / 60);

      const exercise = plans.emom.movements[
        minute % plans.emom.movements.length
      ];

      phase.textContent =
        "Minute " + (minute + 1) +
        " · " + exercise;

    } else if (type === "tabata") {
      const block = Math.floor(elapsed / 240);
      const round =
        Math.floor((elapsed % 240) / 30) + 1;

      const work = elapsed % 30 < 20;

      phase.textContent =
        "Block " + (block + 1) +
        " · Round " + round + "/8 · " +
        (work ? "WORK" : "REST");

    } else {
      phase.textContent =
        currentStrengthStage(elapsed);
    }
  }

  /* =====================================================
     RENDER
     ===================================================== */

  function render(force = false) {
    if (!circuitVisible()) return;

    const holder = $(CONTENT);
    if (!holder) return;

    const existing =
      holder.querySelector(".msc-root");

    if (
      !force &&
      existing &&
      existing.dataset.type === type
    ) {
      updateClock();
      return;
    }

    const plan = plans[type];

    const durations =
      type === "emom" ? [10, 15, 20] :
      type === "tabata" ? [1, 2, 3] :
      [15, 30, 45];

    const durationLabel =
      type === "tabata"
        ? "4-MINUTE BLOCKS"
        : "CHOOSE YOUR DURATION";

    holder.innerHTML = `
      <div class="msc-root" data-type="${type}">

        <header>
          <div class="msc-kicker">
            MANA STRENGTH · INCLUDED WITH MEMBERSHIP
          </div>

          <h2>Circuits</h2>

          <div class="msc-muted">
            Choose your training format and duration.
          </div>
        </header>

        <div class="msc-choices">
          ${Object.entries(plans).map(
            ([id, item]) => `
              <button
                type="button"
                class="msc-choice ${
                  id === type ? "active" : ""
                }"
                data-msc-type="${id}"
                aria-pressed="${id === type}"
              >
                <strong>${item.name}</strong>
                <small>${item.subtitle}</small>
              </button>
            `
          ).join("")}
        </div>

        <section class="msc-panel">

          <div class="msc-label">
            ${plan.subtitle.toUpperCase()}
          </div>

          <h3>${plan.name}</h3>

          <p class="msc-muted">
            ${plan.description}
          </p>

          <div class="msc-label">
            ${durationLabel}
          </div>

          <div class="msc-settings">
            ${durations.map(value => `
              <button
                type="button"
                class="msc-setting"
                data-msc-duration="${value}"
                aria-pressed="${duration === value}"
              >
                ${
                  type === "tabata"
                    ? value + " × 4 min"
                    : value + " min"
                }
              </button>
            `).join("")}
          </div>

          <ul class="msc-list">
            ${workoutList().map(item => `
              <li>${safeText(item)}</li>
            `).join("")}
          </ul>
        </section>

        <section
          class="msc-timer"
          aria-label="Circuit session timer"
        >
          <div class="msc-label">
            SESSION TIMER
          </div>

          <div class="msc-clock" role="timer">
            ${clockText(remaining)}
          </div>

          <div
            class="msc-step"
            aria-live="off"
          ></div>

          <div class="msc-actions">

            <button
              type="button"
              class="msc-btn"
              data-msc-action="start"
            >
              Start timer
            </button>

            <button
              type="button"
              class="msc-btn alt"
              data-msc-action="reset"
            >
              Reset
            </button>

          </div>

          <p class="msc-muted">
            Prioritise technique and suitable loads.
            The timer runs while this page remains open.
          </p>
        </section>
      </div>
    `;

    updateClock();
  }

  /* =====================================================
     FORMAT / DURATION SELECTION
     ===================================================== */

  function chooseType(nextType) {
    if (!plans[nextType]) return;

    type = nextType;

    duration =
      nextType === "emom" ? 15 :
      nextType === "tabata" ? 1 :
      45;

    resetTimer();
    render(true);
  }

  function chooseDuration(value) {
    const allowed =
      type === "emom" ? [10, 15, 20] :
      type === "tabata" ? [1, 2, 3] :
      [15, 30, 45];

    if (!allowed.includes(value)) return;

    duration = value;

    resetTimer();
    render(true);
  }

  /* =====================================================
     LEARNING — OVERVIEW ACCESS
     ===================================================== */

  function addLearningCard() {
    if (!strengthOpen() || learnSelected()) {
      return;
    }

    const overview = $(TABS)?.querySelector(
      '[data-v83-tab="overview"].active'
    );

    const holder = $(CONTENT);

    if (
      !overview ||
      !holder ||
      holder.querySelector(".msc-overview-learn")
    ) {
      return;
    }

    const card = document.createElement("button");

    card.type = "button";
    card.className = "msc-overview-learn";
    card.dataset.mscAction = "learning";

    card.innerHTML = `
      <div class="msc-kicker">
        MANA STRENGTH · EDUCATION
      </div>

      <strong>
        Learning &amp; Training Guides →
      </strong>

      <small>
        Technique, strength progression,
        recovery and nutrition.
      </small>
    `;

    holder.appendChild(card);
  }

  function openLearning() {
    if (!strengthOpen()) return;

    stopTimer();

    mode = "learning";

    const tab = learnTab();

    if (
      tab &&
      !tab.classList.contains("active")
    ) {
      openingLearning = true;
      tab.click();
      openingLearning = false;

    } else {
      window.dispatchEvent(
        new CustomEvent(
          "mana:program-tab-change"
        )
      );
    }
  }

  /* =====================================================
     NAVIGATION
     ===================================================== */

  function updateTabLabel() {
    if (!strengthOpen()) return;

    const tab = learnTab();

    if (tab) {
      tab.setAttribute(
        "aria-label",
        "Circuits"
      );
    }
  }

  function onNavigation() {
    if (!strengthOpen()) {
      stopTimer();
      return;
    }

    updateTabLabel();

    if (learnSelected()) {
      if (mode === "circuits") {
        [0, 120, 330, 500].forEach(delay => {
          setTimeout(() => {
            if (circuitVisible()) render();
          }, delay);
        });
      }

    } else {
      stopTimer();
      mode = "circuits";

      [0, 120, 340].forEach(delay => {
        setTimeout(addLearningCard, delay);
      });
    }
  }

  /* =====================================================
     BUTTON ACTIONS
     ===================================================== */

  function onClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab="learn"]'
      )
    ) {
      if (!openingLearning) {
        mode = "circuits";
        resetTimer();
      }

      return;
    }

    if (!strengthOpen()) return;

    const button = target.closest(
      "[data-msc-type]," +
      "[data-msc-duration]," +
      "[data-msc-action]"
    );

    if (!button) return;

    if (button.dataset.mscType) {
      chooseType(button.dataset.mscType);
      return;
    }

    if (button.dataset.mscDuration) {
      chooseDuration(
        Number(button.dataset.mscDuration)
      );
      return;
    }

    switch (button.dataset.mscAction) {
      case "learning":
        openLearning();
        break;

      case "start":
        if (running) {
          tick();
          stopTimer();
          updateClock();
          break;
        }

        if (remaining <= 0) {
          resetTimer();
        }

        finishAt =
          Date.now() + remaining * 1000;

        running = true;

        interval = setInterval(tick, 250);
        updateClock();
        break;

      case "reset":
        resetTimer();
        break;
    }
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  installStyles();

  document.addEventListener(
    "click",
    onClick
  );

  window.addEventListener(
    "mana:program-tab-change",
    onNavigation
  );

  window.addEventListener(
    "pageshow",
    onNavigation
  );

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      onNavigation,
      { once: true }
    );

  } else {
    onNavigation();
  }

  console.log(
    "[Mana Strength] Circuits " + BUILD
  );

})();
