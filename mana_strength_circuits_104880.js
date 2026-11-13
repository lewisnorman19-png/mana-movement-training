
/* MANA MOVEMENT — STRENGTH CIRCUITS 104880
   Complete NEW file:
   mana_strength_circuits_104880.js

   Uses the existing Strength Learn tab slot
   for Circuits.

   Original Learning remains accessible
   from a new Overview card.

   No writes to Supabase or workout history.
*/

(() => {
  "use strict";

  if (window.MANA_STRENGTH_CIRCUITS_104880) return;
  window.MANA_STRENGTH_CIRCUITS_104880 = true;

  const SHELL = "manaV83ProgramShell";
  const TABS = "manaV83Tabs";
  const CONTENT = "manaV83Content";
  const STYLE = "manaStrengthCircuitsStyle104880";

  let mode = "circuits";
  let type = "emom";
  let interval = null;
  let running = false;
  let remaining = 900;
  let finishAt = 0;
  let total = 900;
  let strengthMinutes = 15;
  let openingLearn = false;

  const plans = {
    emom: {
      label: "EMOM",
      subtitle: "Every Minute on the Minute",
      description:
        "Begin each exercise at the start of its minute. " +
        "Finish your reps with control, then rest until " +
        "the next minute.",
      movements: [
        "Minute 1 · Goblet squat — 10 reps",
        "Minute 2 · Push-ups — 8–12 reps",
        "Minute 3 · Bent-over dumbbell row — 10 reps each side",
        "Minute 4 · Reverse lunges — 8 reps each leg",
        "Minute 5 · Plank — 35 seconds"
      ]
    },

    tabata: {
      label: "Tabata",
      subtitle: "20 seconds work · 10 seconds recovery",
      description:
        "Alternate hard, controlled effort with short rests. " +
        "One 4-minute Tabata block contains eight rounds.",
      movements: [
        "Block 1 · Squat to press",
        "Block 2 · Mountain climbers",
        "Block 3 · Kettlebell deadlift",
        "Block 4 · High knees or marching"
      ]
    },

    strength: {
      label: "Strength Circuit",
      subtitle: "45-minute session",
      description:
        "A complete full-body circuit. Prioritise movement " +
        "quality, technique and appropriate loads.",
      movements: [
        "Warm-up · 5 min — mobility and easy cardio",
        "Block A · 15 min — Goblet squat / DB bench press / Cable row · 3 rounds",
        "Block B · 15 min — Romanian deadlift / Reverse lunge / Shoulder press · 3 rounds",
        "Finisher · 5 min — Carry / dead bug / step-ups",
        "Cool-down · 5 min — relaxed walking and mobility"
      ]
    }
  };

  const $ = id => document.getElementById(id);

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

  function format(seconds) {
    return (
      String(Math.floor(seconds / 60)).padStart(2, "0") +
      ":" +
      String(seconds % 60).padStart(2, "0")
    );
  }

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  /* =====================================
     PREMIUM STYLING
     ===================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${CONTENT} .msc-root {
        color: #FFFFFF;
        display: grid;
        gap: 14px;
        padding: 5px 0 22px;
      }

      #${CONTENT} .msc-kicker {
        font-size: 10px;
        color: #FF7927;
        font-weight: 900;
        letter-spacing: .14em;
      }

      #${CONTENT} .msc-root h2 {
        color: #FFFFFF;
        font-size: clamp(23px, 5vw, 31px);
        margin: 5px 0;
      }

      #${CONTENT} .msc-muted {
        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.55;
      }

      #${CONTENT} .msc-choices {
        display: grid;
        grid-template-columns: repeat(3,minmax(0,1fr));
        gap: 9px;
      }

      #${CONTENT} .msc-choice {
        min-width: 0;
        padding: 15px 12px;

        background: #17191D;
        border: 1px solid #59616C;
        border-radius: 15px;

        color: #FFFFFF;
        text-align: left;
        cursor: pointer;
      }

      #${CONTENT} .msc-choice.active {
        border-color: #FF7927;
        background: #291910;
      }

      #${CONTENT} .msc-choice strong {
        display: block;
        font-size: 15px;
        font-weight: 900;
        color: #FFFFFF;
      }

      #${CONTENT} .msc-choice small {
        display: block;
        margin-top: 7px;
        color: #C1C6CE;
        font-size: 10px;
        line-height: 1.4;
      }

      #${CONTENT} .msc-panel {
        min-width: 0;
        padding: 17px;

        background: #15171A;
        border: 1px solid #535C68;
        border-radius: 18px;
      }

      #${CONTENT} .msc-panel h3 {
        margin: 3px 0 8px;
        color: #FFFFFF;
        font-size: 18px;
      }

      #${CONTENT} .msc-label {
        color: #FF7927;
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
        line-height: 1.45;
      }

      #${CONTENT} .msc-settings {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 12px 0;
      }

      #${CONTENT} .msc-setting {
        padding: 9px 12px;

        background: #111317;
        border: 1px solid #58616B;
        border-radius: 11px;

        color: #FFFFFF;
        font-weight: 800;
        cursor: pointer;
      }

      #${CONTENT}
      .msc-setting[aria-pressed="true"] {
        border-color: #FF7927;
        color: #FF7927;
      }

      #${CONTENT} .msc-timer {
        padding: 18px 12px;

        background: #0C0E11;
        border: 1px solid #454C56;
        border-radius: 17px;

        text-align: center;
      }

      #${CONTENT} .msc-clock {
        color: #FFFFFF;
        font-size: clamp(44px, 11vw, 64px);
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
      }

      #${CONTENT} .msc-step {
        color: #FF7927;
        font-size: 12px;
        font-weight: 900;
        min-height: 18px;
      }

      #${CONTENT} .msc-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 9px;
        margin-top: 14px;
      }

      #${CONTENT} .msc-btn {
        padding: 11px 17px;

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

      #${CONTENT} .msc-learn {
        width: 100%;
        padding: 16px;

        background: #15171A;
        border: 1px solid #535C68;
        border-radius: 14px;

        text-align: left;
        cursor: pointer;
      }

      #${CONTENT} .msc-learn strong {
        display: block;
        color: #FFFFFF;
        font-size: 14px;
      }

      #${CONTENT} .msc-learn span {
        display: block;
        margin-top: 5px;
        color: #C1C6CE;
        font-size: 11px;
      }

      #${CONTENT} .msc-overview-learn {
        width: 100%;
        margin: 14px 0;
        padding: 16px;

        background: #15171A;
        border: 1px solid #535C68;
        border-radius: 17px;

        color: #FFFFFF;
        text-align: left;
        cursor: pointer;
      }

      #${CONTENT} .msc-overview-learn strong {
        display: block;
        color: #FFFFFF;
        font-size: 16px;
      }

      #${CONTENT} .msc-overview-learn small {
        display: block;
        margin-top: 6px;
        color: #C1C6CE;
      }

      @media (max-width:540px) {
        #${CONTENT} .msc-choices {
          gap: 5px;
        }

        #${CONTENT} .msc-choice {
          padding: 11px 8px;
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

  /* =====================================
     NAVIGATION
     ===================================== */

  function updateTab() {
    if (!strengthOpen()) return;

    const tab = learnTab();
    if (!tab) return;

    tab.textContent = "Circuits";
    tab.setAttribute("aria-label", "Circuits");
  }

  function addLearningCard() {
    if (!strengthOpen() || learnSelected()) return;

    const overview = $(TABS)?.querySelector(
      '[data-v83-tab="overview"].active'
    );

    const holder = $(CONTENT);

    if (
      !overview ||
      !holder ||
      holder.querySelector(".msc-overview-learn")
    ) return;

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
        Strength technique, progressive overload,
        recovery and nutrition.
      </small>
    `;

    holder.appendChild(card);
  }

  /* =====================================
     TIMER CONFIGURATION
     ===================================== */

  function timerConfig() {
    if (type === "emom") {
      return {
        seconds: strengthMinutes * 60
      };
    }

    if (type === "tabata") {
      return {
        seconds: strengthMinutes * 240
      };
    }

    return {
      seconds: 2700
    };
  }

  function stopTimer() {
    if (interval !== null) {
      clearInterval(interval);
    }

    interval = null;
    running = false;
  }

  function resetTimer() {
    stopTimer();

    total = timerConfig().seconds;
    remaining = total;

    updateClock();
  }

  function tick() {
    if (!running) return;

    remaining = Math.max(
      0,
      Math.ceil((finishAt - Date.now()) / 1000)
    );

    if (remaining === 0) {
      stopTimer();
    }

    updateClock();
  }

  function updateClock() {
    const root = $(CONTENT)?.querySelector(".msc-root");
    if (!root) return;

    const clock = root.querySelector(".msc-clock");
    const step = root.querySelector(".msc-step");

    const start = root.querySelector(
      '[data-msc-action="start"]'
    );

    if (!clock || !step || !start) return;

    clock.textContent = format(remaining);

    start.textContent = running
      ? "Pause timer"
      : remaining === total
        ? "Start timer"
        : remaining === 0
          ? "Start again"
          : "Resume timer";

    const elapsed = Math.max(
      0,
      total - remaining
    );

    if (remaining === 0) {
      step.textContent = "Session complete";
      return;
    }

    if (type === "emom") {
      const minute = Math.floor(elapsed / 60);

      step.textContent =
        "Minute " + (minute + 1) + " · " +
        plans.emom.movements[
          minute % plans.emom.movements.length
        ].split(" · ")[1];

    } else if (type === "tabata") {
      const block = Math.floor(elapsed / 240);
      const seconds = elapsed % 30;

      const round =
        Math.floor((elapsed % 240) / 30) + 1;

      step.textContent =
        "Block " + (block + 1) +
        " · Round " + round + "/8 · " +
        (seconds < 20 ? "WORK" : "REST");

    } else {
      step.textContent =
        elapsed < 300 ? "Warm-up" :
        elapsed < 1200 ? "Block A · Strength" :
        elapsed < 2100 ? "Block B · Strength" :
        elapsed < 2400 ? "Finisher" :
        "Cool-down";
    }
  }

  /* =====================================
     CIRCUIT SELECTION
     ===================================== */

  function selectCircuit(nextType) {
    if (!plans[nextType]) return;

    type = nextType;

    strengthMinutes =
      type === "tabata" ? 1 :
      type === "emom" ? 15 : 45;

    resetTimer();
    renderCircuits(true);
  }

  /* =====================================
     RENDER CIRCUITS
     ===================================== */

  function renderCircuits(force = false) {
    if (!learnSelected() || mode !== "circuits") {
      return;
    }

    const holder = $(CONTENT);
    if (!holder) return;

    const existing = holder.querySelector(".msc-root");

    if (
      !force &&
      existing?.dataset.type === type
    ) {
      updateClock();
      return;
    }

    const plan = plans[type];

    const settings =
      type === "emom" ? [10, 15, 20] :
      type === "tabata" ? [1, 2, 3] :
      [];

    const settingsLabel =
      type === "emom"
        ? "DURATION"
        : "4-MINUTE BLOCKS";

    holder.innerHTML = `
      <div class="msc-root" data-type="${type}">

        <header>
          <div class="msc-kicker">
            MANA STRENGTH · PREMIUM CIRCUITS
          </div>

          <h2>Circuits</h2>

          <div class="msc-muted">
            Three focused training formats.
            Choose your session and start when ready.
          </div>
        </header>

        <div class="msc-choices">
          ${Object.entries(plans).map(([id, item]) => `
            <button
              class="msc-choice ${id === type ? "active" : ""}"
              type="button"
              data-msc-type="${id}"
              aria-pressed="${id === type}"
            >
              <strong>${item.label}</strong>
              <small>${item.subtitle}</small>
            </button>
          `).join("")}
        </div>

        <section class="msc-panel">
          <div class="msc-label">
            ${plan.subtitle.toUpperCase()}
          </div>

          <h3>${plan.label}</h3>

          <p class="msc-muted">
            ${plan.description}
          </p>

          ${settings.length ? `
            <div class="msc-label">
              ${settingsLabel}
            </div>

            <div class="msc-settings">
              ${settings.map(value => `
                <button
                  class="msc-setting"
                  type="button"
                  data-msc-duration="${value}"
                  aria-pressed="${value === strengthMinutes}"
                >
                  ${
                    type === "tabata"
                      ? value + " × 4 min"
                      : value + " min"
                  }
                </button>
              `).join("")}
            </div>
          ` : ""}

          <ul class="msc-list">
            ${plan.movements.map(item => `
              <li>${escapeHTML(item)}</li>
            `).join("")}
          </ul>

        </section>

        <section
          class="msc-timer"
          aria-label="Circuit timer"
        >
          <div class="msc-label">
            SESSION TIMER
          </div>

          <div class="msc-clock" role="timer">
            ${format(remaining)}
          </div>

          <div
            class="msc-step"
            aria-live="off"
          ></div>

          <div class="msc-actions">
            <button
              class="msc-btn"
              type="button"
              data-msc-action="start"
            >
              Start timer
            </button>

            <button
              class="msc-btn alt"
              type="button"
              data-msc-action="reset"
            >
              Reset
            </button>
          </div>

          <p class="msc-muted">
            Choose suitable loads and adapt intensity
            to your ability. The timer runs while
            this app page remains open.
          </p>
        </section>

        <button
          class="msc-learn"
          type="button"
          data-msc-action="learning"
        >
          <strong>
            Learning &amp; Training Guides →
          </strong>

          <span>
            Strength technique, progression,
            recovery and fuel.
          </span>
        </button>

      </div>
    `;

    updateClock();
  }

  /* =====================================
     ORIGINAL LEARNING
     ===================================== */

  function showLearning() {
    if (!strengthOpen()) return;

    stopTimer();
    mode = "learning";

    const tab = learnTab();

    if (tab && !tab.classList.contains("active")) {
      openingLearn = true;
      tab.click();
      openingLearn = false;
    } else {
      window.dispatchEvent(
        new CustomEvent("mana:program-tab-change")
      );
    }
  }

  /* =====================================
     TAB CHANGE HANDLING

     Original Strength modules render
     their own content asynchronously.
     Reapply Circuits only to its slot.
     ===================================== */

  function onNavigation() {
    if (!strengthOpen()) {
      stopTimer();
      return;
    }

    updateTab();

    if (learnSelected()) {
      if (mode === "circuits") {
        [0, 120, 330, 500].forEach(delay => {
          setTimeout(() => {
            if (
              learnSelected() &&
              mode === "circuits"
            ) {
              renderCircuits();
            }
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

  /* =====================================
     BUTTON ACTIONS
     ===================================== */

  function onClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (
      target.closest(
        '#manaV83Tabs [data-v83-tab="learn"]'
      )
    ) {
      if (!openingLearn) {
        mode = "circuits";
        resetTimer();
      }

      return;
    }

    const button = target.closest(
      "[data-msc-type]," +
      "[data-msc-duration]," +
      "[data-msc-action]"
    );

    if (!button || !strengthOpen()) return;

    if (button.dataset.mscType) {
      selectCircuit(button.dataset.mscType);
      return;
    }

    if (button.dataset.mscDuration) {
      strengthMinutes = Number(
        button.dataset.mscDuration
      );

      resetTimer();
      renderCircuits(true);
      return;
    }

    switch (button.dataset.mscAction) {

      case "learning":
        showLearning();
        return;

      case "start":
        if (running) {
          tick();
          stopTimer();
          updateClock();
          return;
        }

        if (remaining <= 0) {
          resetTimer();
        }

        finishAt = Date.now() + remaining * 1000;
        running = true;

        interval = setInterval(tick, 250);
        updateClock();
        return;

      case "reset":
        resetTimer();
        return;
    }
  }

  /* =====================================
     INITIALISE
     ===================================== */

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
    "[Mana Strength] Circuits 104880"
  );

})();
