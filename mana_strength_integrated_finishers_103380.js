
/* =====================================================
   MANA MOVEMENT TRAINING
   INTEGRATED CARDIO + CORE
   BUILD 103400

   COMPLETE FILE REPLACEMENT

   Replaces:
   mana_strength_integrated_finishers_103380.js

   Cardio Blue: #368FD4
   Core Gold:   #D6A437

   FEATURES
   - Active Strength workout finishers
   - Four cardio equipment choices
   - 10 / 15 / 20 minute cardio
   - Workout-specific cardio rotations
   - Workout-specific core rotations
   - Three rounds of core
   - Mobile carousel placement
   - Workout history integration
   - Weekly Progress bars
   - Back to Workouts label

   Keeps existing Fuel, Learning and
   Mana Lyfe functionality untouched.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103400";

  if (window.MANA_FINISHERS_BUILD_103400) return;
  window.MANA_FINISHERS_BUILD_103400 = true;

  const BLUE = "#368FD4";
  const GOLD = "#D6A437";

  const STYLE_ID = "mana-finishers-103400-style";
  const LOG_KEY = "mana-strength-v64-logs";
  const PENDING_KEY = "mana-finishers-pending-103400";

  const $ = id => document.getElementById(id);

  const EXERCISES = {
    A: [
      ["Dead bugs", "10 per side"],
      ["Standard plank", "30 seconds"],
      ["Crunches", "15 reps"]
    ],
    B: [
      ["Russian twists", "20 total"],
      ["Side plank", "25 seconds per side"],
      ["Hanging knee raises", "10 reps"]
    ],
    C: [
      ["Mountain climbers", "30 seconds"],
      ["Reverse crunches", "15 reps"],
      ["Plank shoulder taps", "20 total"]
    ],
    D: [
      ["Plate sit-ups", "12 reps"],
      ["Bicycle crunches", "20 total"],
      ["Side plank", "30 seconds per side"]
    ]
  };

  const CARDIO_MODES = [
    "Bike",
    "Rower",
    "Treadmill",
    "Bodyweight"
  ];

  let equipment = "Bike";
  let duration = 15;
  let currentType = null;
  let coreRound = 1;
  let checked = new Set();
  let completed = {};
  let lastWorkoutId = null;
  let placementQueued = false;
  let progressQueued = false;
  let progressObserver = null;

  function readJson(key, fallback) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "null"
      ) ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function isMobile() {
    return window.matchMedia(
      "(max-width:700px)"
    ).matches;
  }

  function getSessionName() {
    return (
      $("manaV64Title")?.textContent ||
      "Strength A"
    ).trim();
  }

  function getWorkoutLetter(name = getSessionName()) {
    const match = name.match(
      /\b(?:strength|workout|session)\s*([ABCD])\b/i
    );

    return match
      ? match[1].toUpperCase()
      : "A";
  }

  function getWeekNumber() {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      0,
      1
    );

    const days = Math.floor(
      (now - start) / 86400000
    );

    return Math.floor(days / 7) % 4 + 1;
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      .mf400-section {
        margin: 18px 0;
        padding: 16px;
        border: 1px solid #353d46;
        border-radius: 15px;
        background: #10151b;
        color: #fff;
        box-sizing: border-box;
      }

      .mf400-title {
        font-size: 15px;
        font-weight: 900;
        letter-spacing: .6px;
      }

      .mf400-description {
        color: #b6bec8;
        font-size: 12px;
        line-height: 1.55;
        margin: 7px 0 15px;
      }

      .mf400-buttons {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 10px;
      }

      .mf400-button {
        min-width: 0;
        width: 100%;
        min-height: 92px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 7px;
        padding: 12px 7px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: .5px;
        cursor: pointer;
        box-sizing: border-box;
      }

      .mf400-button small {
        color: #c7d0d9;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0;
      }

      .mf400-blue {
        color: ${BLUE};
        border: 1.5px solid ${BLUE};
        background: rgba(54,143,212,.10);
      }

      .mf400-gold {
        color: ${GOLD};
        border: 1.5px solid ${GOLD};
        background: rgba(214,164,55,.10);
      }

      .mf400-icon {
        font-size: 25px;
        line-height: 1;
      }

      .mf400-panel {
        margin-top: 15px;
        border-radius: 12px;
        border: 1px solid var(--mf-accent);
        padding: 15px;
        background: #0b1118;
        box-sizing: border-box;
      }

      .mf400-panel h3 {
        color: var(--mf-accent);
        margin: 0 0 10px;
        font-size: 17px;
      }

      .mf400-choices {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 8px;
        margin: 12px 0;
      }

      .mf400-choice {
        min-width: 0;
        min-height: 42px;
        border-radius: 8px;
        border: 1px solid #465361;
        color: #dce5ed;
        background: #17202a;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .mf400-choice.selected {
        border-color: ${BLUE};
        color: ${BLUE};
        background: rgba(54,143,212,.12);
      }

      .mf400-duration {
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: 8px;
        margin: 12px 0;
      }

      .mf400-prescription {
        margin: 14px 0;
        padding: 13px;
        border-radius: 9px;
        background: #17212b;
        color: #d6e0e8;
        font-size: 12px;
        line-height: 1.7;
      }

      .mf400-prescription strong {
        color: var(--mf-accent);
      }

      .mf400-exercise {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 7px 0;
        padding: 12px;
        border: 1px solid #36424e;
        border-radius: 9px;
        font-size: 13px;
        cursor: pointer;
      }

      .mf400-exercise input {
        width: 19px;
        height: 19px;
        flex-shrink: 0;
        accent-color: ${GOLD};
      }

      .mf400-exercise small {
        display: block;
        margin-top: 3px;
        color: #acb6c1;
      }

      .mf400-actions {
        display: grid;
        grid-template-columns: repeat(2,1fr);
        gap: 9px;
        margin-top: 15px;
      }

      .mf400-action {
        min-height: 45px;
        padding: 10px;
        border-radius: 9px;
        border: 1px solid #465360;
        background: #202b36;
        color: white;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .mf400-action.primary {
        border-color: var(--mf-accent);
        background: var(--mf-accent);
        color: #09131b;
      }

      .mf400-action:disabled {
        opacity: .4;
        cursor: not-allowed;
      }

      .mf400-success {
        margin-top: 12px;
        color: #73dda3;
        font-size: 12px;
        font-weight: 700;
      }

      .mf400-progress {
        margin: 18px 0;
        padding: 16px;
        border: 1px solid #343d48;
        border-radius: 13px;
        background: #11171e;
      }

      .mf400-progress h3 {
        margin: 0 0 17px;
        color: #fff;
        font-size: 16px;
      }

      .mf400-progress-row {
        margin: 15px 0;
      }

      .mf400-progress-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 750;
      }

      .mf400-progress-track {
        width: 100%;
        height: 10px;
        border-radius: 20px;
        overflow: hidden;
        background: #303944;
      }

      .mf400-progress-fill {
        height: 100%;
        border-radius: inherit;
        transition: width 250ms ease;
      }

      @media(max-width:700px) {
        #manaV922Feedback > .mf400-section {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 0 18px !important;
        }

        #manaV922Feedback
        .mf400-buttons {
          grid-template-columns:
            repeat(2,minmax(0,1fr));
        }
      }

      @media(prefers-reduced-motion:reduce) {
        .mf400-progress-fill {
          transition: none;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function sectionHtml() {
    return `
      <div class="mf400-title">
        OPTIONAL FINISHERS
      </div>

      <p class="mf400-description">
        Add Cardio, Core or both to today's
        Strength workout.
      </p>

      <div class="mf400-buttons">

        <button type="button"
          class="mf400-button mf400-blue"
          data-mf400-open="cardio">
          <span class="mf400-icon">♥</span>
          CARDIO
          <small>10–20 minutes</small>
        </button>

        <button type="button"
          class="mf400-button mf400-gold"
          data-mf400-open="core">
          <span class="mf400-icon">◎</span>
          CORE
          <small>3 rounds</small>
        </button>

      </div>

      <div id="mf400Panel"></div>
      <div id="mf400Saved"
        class="mf400-success"></div>
    `;
  }

  function ensureSection() {
    const complete = $("manaV64Complete");

    if (!complete) return;

    let section = $("mf400Section");

    if (!section) {
      section = document.createElement("section");
      section.id = "mf400Section";
      section.className = "mf400-section";
      section.innerHTML = sectionHtml();
      complete.before(section);
    }

    const old = $("mf380Section");
    if (old) old.remove();

    positionSection();
  }

  function positionSection() {
    const section = $("mf400Section");
    const complete = $("manaV64Complete");
    const feedback = $("manaV922Feedback");

    if (!section || !complete) return;

    if (isMobile()) {
      if (!feedback) return;

      if (
        section.parentElement !== feedback ||
        feedback.firstElementChild !== section
      ) {
        feedback.prepend(section);
      }
    } else {
      if (
        feedback &&
        feedback.parentElement === complete.parentElement
      ) {
        if (section.nextElementSibling !== feedback) {
          feedback.before(section);
        }
      } else if (
        section.nextElementSibling !== complete
      ) {
        complete.before(section);
      }
    }
  }

  function schedulePosition() {
    if (placementQueued) return;
    placementQueued = true;

    requestAnimationFrame(() => {
      placementQueued = false;
      ensureSection();
    });
  }

  function cardioPrescription() {
    const letter = getWorkoutLetter();
    const week = getWeekNumber();
    const warmup = duration === 10 ? 2 : 3;
    const cooldown = duration === 10 ? 2 : 3;
    const working = duration - warmup - cooldown;

    const patterns = {
      A: ["Steady aerobic effort", "Comfortable moderate pace"],
      B: ["Interval effort", "Alternate brisk and easy pace"],
      C: ["Tempo effort", "Build intensity gradually"],
      D: ["Recovery conditioning", "Smooth and controlled effort"]
    };

    const pattern = patterns[letter] || patterns.A;

    const variants = [
      "Maintain comfortable, controlled breathing.",
      "Increase your pace slightly during the middle section.",
      "Focus on smooth technique and consistent effort.",
      "Aim for even pacing throughout the main set."
    ];

    const guidance = {
      Bike: "Adjust resistance while keeping a smooth cadence.",
      Rower: "Drive through the legs and maintain controlled strokes.",
      Treadmill: "Adjust walking pace or incline to suit your ability.",
      Bodyweight: "Rotate marching, step jacks and controlled shadow boxing."
    };

    return {
      letter,
      week,
      warmup,
      working,
      cooldown,
      pattern: pattern[0],
      description: pattern[1],
      variation: variants[(week - 1) % 4],
      equipmentNote: guidance[equipment]
    };
  }

  function renderCardio() {
    const panel = $("mf400Panel");
    if (!panel) return;

    const p = cardioPrescription();

    panel.innerHTML = `
      <div class="mf400-panel"
        style="--mf-accent:${BLUE}">

        <h3>Cardio Finisher</h3>

        <div class="mf400-description">
          Choose your equipment and duration.
        </div>

        <div class="mf400-choices">
          ${CARDIO_MODES.map(mode => `
            <button type="button"
              class="mf400-choice
                ${equipment === mode ? "selected" : ""}"
              data-mf400-equipment="${mode}">
              ${mode}
            </button>
          `).join("")}
        </div>

        <div class="mf400-duration">
          ${[10,15,20].map(mins => `
            <button type="button"
              class="mf400-choice
                ${duration === mins ? "selected" : ""}"
              data-mf400-duration="${mins}">
              ${mins} MIN
            </button>
          `).join("")}
        </div>

        <div class="mf400-prescription">
          <strong>
            Strength ${p.letter} · Week ${p.week}
          </strong>

          <div>${p.pattern}</div>
          <div>${p.description}</div>
          <div>${p.variation}</div>
          <div>${p.equipmentNote}</div>

          <div style="margin-top:10px">
            Warm-up: ${p.warmup} min
          </div>

          <div>
            Main set: ${p.working} min
          </div>

          <div>
            Cooldown: ${p.cooldown} min
          </div>
        </div>

        <div class="mf400-actions">
          <button type="button"
            class="mf400-action"
            data-mf400-close>
            CLOSE
          </button>

          <button type="button"
            class="mf400-action primary"
            data-mf400-cardio-done>
            LOG COMPLETION
          </button>
        </div>

      </div>
    `;
  }

  function coreExercises() {
    const letter = getWorkoutLetter();
    const week = getWeekNumber();

    const order = ["A","B","C","D"];
    const index = (
      order.indexOf(letter) + week - 1
    ) % order.length;

    return EXERCISES[order[index]];
  }

  function renderCore() {
    const panel = $("mf400Panel");
    if (!panel) return;

    const exercises = coreExercises();
    const ready = checked.size === exercises.length;

    panel.innerHTML = `
      <div class="mf400-panel"
        style="--mf-accent:${GOLD}">

        <h3>Core Finisher</h3>

        <div class="mf400-description">
          Strength ${getWorkoutLetter()}
          · Week ${getWeekNumber()}
          · Round ${coreRound} of 3
        </div>

        ${exercises.map(([name,target],i) => `
          <label class="mf400-exercise">
            <input type="checkbox"
              data-mf400-core-check="${i}"
              ${checked.has(i) ? "checked" : ""}>

            <span>
              <strong>${name}</strong>
              <small>${target}</small>
            </span>
          </label>
        `).join("")}

        <div class="mf400-actions">

          <button type="button"
            class="mf400-action"
            data-mf400-close>
            CLOSE
          </button>

          <button type="button"
            class="mf400-action primary"
            data-mf400-core-next
            ${ready ? "" : "disabled"}>
            ${coreRound === 3
              ? "FINISH CORE"
              : "NEXT ROUND"}
          </button>

        </div>
      </div>
    `;
  }

  function openFinisher(type) {
    currentType = type;
    coreRound = 1;
    checked.clear();

    if (type === "cardio") renderCardio();
    if (type === "core") renderCore();
  }

  function closeFinisher() {
    currentType = null;
    checked.clear();

    const panel = $("mf400Panel");
    if (panel) panel.replaceChildren();
  }

  function updateSaved() {
    const holder = $("mf400Saved");
    if (!holder) return;

    const parts = [];

    if (completed.cardio?.completed) {
      parts.push(
        "Cardio — " +
        completed.cardio.equipment +
        ", " +
        completed.cardio.durationMinutes +
        " min"
      );
    }

    if (completed.core?.completed) {
      parts.push("Core — 3 rounds");
    }

    holder.textContent = parts.length
      ? "✓ " + parts.join(" · ")
      : "";
  }

  function finishCardio() {
    const p = cardioPrescription();

    completed.cardio = {
      completed: true,
      equipment,
      durationMinutes: duration,
      prescribedMinutes: duration,
      actualMinutes: duration,
      workout: p.letter,
      week: p.week,
      pattern: p.pattern,
      completedAt: new Date().toISOString()
    };

    updateSaved();
    closeFinisher();
  }

  function finishCoreRound() {
    const exercises = coreExercises();

    if (checked.size !== exercises.length) return;

    if (coreRound < 3) {
      coreRound++;
      checked.clear();
      renderCore();
      return;
    }

    completed.core = {
      completed: true,
      rounds: 3,
      workout: getWorkoutLetter(),
      week: getWeekNumber(),
      exercises: exercises.map(
        ([name,target]) => ({
          name,
          target,
          roundsCompleted: 3
        })
      ),
      completedAt: new Date().toISOString()
    };

    updateSaved();
    closeFinisher();
  }

  function handleClick(event) {
    if (!(event.target instanceof Element)) return;

    const t = event.target;

    const open = t.closest("[data-mf400-open]");
    if (open) {
      openFinisher(open.dataset.mf400Open);
      return;
    }

    const mode = t.closest(
      "[data-mf400-equipment]"
    );

    if (mode) {
      equipment = mode.dataset.mf400Equipment;
      renderCardio();
      return;
    }

    const mins = t.closest(
      "[data-mf400-duration]"
    );

    if (mins) {
      duration = Number(
        mins.dataset.mf400Duration
      );
      renderCardio();
      return;
    }

    if (t.closest("[data-mf400-cardio-done]")) {
      finishCardio();
      return;
    }

    if (t.closest("[data-mf400-core-next]")) {
      finishCoreRound();
      return;
    }

    if (t.closest("[data-mf400-close]")) {
      closeFinisher();
    }
  }

  function handleChange(event) {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    if (!input.matches(
      "[data-mf400-core-check]"
    )) return;

    const index = Number(
      input.dataset.mf400CoreCheck
    );

    if (input.checked) checked.add(index);
    else checked.delete(index);

    const next = document.querySelector(
      "[data-mf400-core-next]"
    );

    if (next) {
      next.disabled =
        checked.size !== coreExercises().length;
    }
  }

  function saveWithWorkout() {
    if (!Object.keys(completed).length) return;

    const logs = readJson(LOG_KEY, []);

    if (!Array.isArray(logs) || !logs.length) {
      return;
    }

    const latest = logs[logs.length - 1];

    if (!latest?.id || !latest?.date) return;

    const age = Date.now() -
      new Date(latest.date).getTime();

    if (age < 0 || age > 20000) return;

    latest.finishers = JSON.parse(
      JSON.stringify(completed)
    );

    localStorage.setItem(
      LOG_KEY,
      JSON.stringify(logs)
    );

    lastWorkoutId = latest.id;

    window.dispatchEvent(
      new CustomEvent(
        "mana:finishers-saved",
        {
          detail: {
            workoutId: latest.id,
            finishers: latest.finishers
          }
        }
      )
    );

    completed = {};
  }

  function weeklyTotals() {
    const logs = readJson(LOG_KEY, []);

    const result = {
      minutes: 0,
      coreSessions: 0
    };

    if (!Array.isArray(logs)) return result;

    const now = new Date();
    const day = (now.getDay() + 6) % 7;

    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - day
    );

    for (const log of logs) {
      const date = new Date(log.date);

      if (
        Number.isNaN(date.getTime()) ||
        date < monday ||
        date > now
      ) continue;

      const finishers = log.finishers || {};

      if (finishers.cardio?.completed) {
        result.minutes += Number(
          finishers.cardio.actualMinutes ||
          finishers.cardio.durationMinutes ||
          0
        );
      }

      if (finishers.core?.completed) {
        result.coreSessions++;
      }
    }

    return result;
  }

  function progressOpen() {
    const shell = $("manaV83ProgramShell");
    const title = $("manaV83Title");
    const tab = document.querySelector(
      '#manaV83Tabs .mana-v83-tab.active' +
      '[data-v83-tab="progress"]'
    );

    return Boolean(
      shell?.classList.contains("open") &&
      title?.textContent?.trim().toUpperCase()
        === "MANA STRENGTH" &&
      tab
    );
  }

  function progressHtml(totals) {
    const cardioTarget = 45;
    const coreTarget = 3;

    const cardioPercent = Math.min(
      100,
      Math.max(0,
        totals.minutes / cardioTarget * 100
      )
    );

    const corePercent = Math.min(
      100,
      Math.max(0,
        totals.coreSessions / coreTarget * 100
      )
    );

    return `
      <h3>Cardio &amp; Core — This Week</h3>

      <div class="mf400-progress-row">

        <div class="mf400-progress-heading">
          <span style="color:${BLUE}">
            ♥ Cardio
          </span>

          <span>
            ${totals.minutes} / ${cardioTarget} min
          </span>
        </div>

        <div class="mf400-progress-track">
          <div class="mf400-progress-fill"
            style="
              width:${cardioPercent}%;
              background:${BLUE};
            "></div>
        </div>

      </div>

      <div class="mf400-progress-row">

        <div class="mf400-progress-heading">
          <span style="color:${GOLD}">
            ◎ Core
          </span>

          <span>
            ${totals.coreSessions} / ${coreTarget}
            sessions
          </span>
        </div>

        <div class="mf400-progress-track">
          <div class="mf400-progress-fill"
            style="
              width:${corePercent}%;
              background:${GOLD};
            "></div>
        </div>

      </div>
    `;
  }

  function updateProgress() {
    if (!progressOpen()) return;

    const root = $("manaV993StrengthProgress");

    if (!root) return;

    let section = $("mf400Progress");

    if (!section) {
      section = document.createElement("section");
      section.id = "mf400Progress";
      section.className = "mf400-progress";

      const head = root.querySelector(
        ".mana-v993-head"
      );

      if (head) head.after(section);
      else root.prepend(section);
    }

    const html = progressHtml(weeklyTotals());

    if (section.innerHTML !== html) {
      section.innerHTML = html;
    }
  }

  function scheduleProgress() {
    if (progressQueued) return;
    progressQueued = true;

    requestAnimationFrame(() => {
      progressQueued = false;
      updateProgress();
    });
  }

  function updateBackLabels() {
    const screen = $("manaStrengthV64Workout");
    const summary = $("manaV915Complete");

    [screen,summary].filter(Boolean).forEach(root => {
      root.querySelectorAll("button,a").forEach(el => {
        const label = el.textContent.trim();

        if (
          /^back to program\s*[→➜]?$/i.test(label) ||
          /^back to overview\s*[→➜]?$/i.test(label)
        ) {
          el.textContent = "BACK TO WORKOUTS →";
        }
      });
    });
  }

  function checkSessionStart() {
    const screen = $("manaStrengthV64Workout");

    if (!screen) return;

    if (
      screen.classList.contains("open") &&
      !$("mf400Section")
    ) {
      completed = {};
      ensureSection();
    }
  }

  function initObservers() {
    // Watch only the active workout screen
    // for its initial construction.
    const screen = $("manaStrengthV64Workout");

    if (screen) {
      const observer = new MutationObserver(() => {
        checkSessionStart();
        schedulePosition();
      });

      observer.observe(screen, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    const exercises = $("manaV64Exercises");

    if (exercises) {
      const observer = new MutationObserver(
        schedulePosition
      );

      observer.observe(exercises, {
        childList: true
      });
    }

    // Strength Progress is rendered separately.
    // Only observe its immediate content changes.
    const content = $("manaV83Content");

    if (content) {
      progressObserver = new MutationObserver(
        scheduleProgress
      );

      progressObserver.observe(content, {
        childList: true
      });
    }
  }

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      handleClick
    );

    document.addEventListener(
      "change",
      handleChange
    );

    window.addEventListener(
      "mana:strength-synced",
      () => {
        saveWithWorkout();
        scheduleProgress();
      }
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleProgress
    );

    document.addEventListener(
      "mana:program-tab-change",
      scheduleProgress
    );

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) return;

        if (event.target.closest(
          '#manaV83Tabs [data-v83-tab="progress"]'
        )) {
          scheduleProgress();
        }
      }
    );

    window.matchMedia(
      "(max-width:700px)"
    ).addEventListener?.(
      "change",
      schedulePosition
    );

    window.addEventListener(
      "pageshow",
      () => {
        schedulePosition();
        scheduleProgress();
      }
    );

    initObservers();
    ensureSection();
    updateBackLabels();
    scheduleProgress();

    console.log(
      "Mana Cardio Core Progress",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
