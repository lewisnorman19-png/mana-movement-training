
/* ======================================================
   MANA MOVEMENT TRAINING
   STRENGTH PROGRESS + COMPLETION POLISH
   BUILD 103450

   Full replacement:
   mana_strength_completion_polish_103410.js

   - Cardio blue bars and borders
   - Core gold bars and borders
   - Responsive matching metric cards
   - Daily / Weekly / Monthly finisher totals
   - Preserve existing Strength / Fuel metrics
   - Workout Complete finisher summary
   - Back to Workouts
   ====================================================== */

(() => {
  "use strict";

  if (window.MANA_POLISH_103450) return;
  window.MANA_POLISH_103450 = true;

  const BLUE = "#368FD4";
  const GOLD = "#D6A437";
  const LOG_KEY = "mana-strength-v64-logs";

  const $ = id => document.getElementById(id);

  function safe(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c]
    );
  }

  function getLogs() {
    try {
      const data = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  }

  function installStyles() {
    if ($("mf450Style")) return;

    const style = document.createElement("style");
    style.id = "mf450Style";

    style.textContent = `

      /* =========================================
         RETIRE OLD CARDIO / CORE PANEL
         ========================================= */

      #mf400Progress,
      #mf430Progress {
        display: none !important;
      }

      /* =========================================
         PREMIUM METRIC GRID
         ========================================= */

      #manaV993StrengthProgress
      .mana-v993-metrics {
        display: grid !important;
        grid-template-columns:
          repeat(4,minmax(0,1fr)) !important;
        gap: 10px !important;
        margin-top: 14px !important;
        align-items: stretch !important;
      }

      #manaV993StrengthProgress
      .mana-v993-metric {
        min-width: 0 !important;
        min-height: 128px !important;
        padding: 16px 10px 14px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        box-sizing: border-box !important;
      }

      #manaV993StrengthProgress
      .mana-v993-metric-label {
        font-size: 10px !important;
        font-weight: 900 !important;
        letter-spacing: .45px !important;
      }

      #manaV993StrengthProgress
      .mana-v993-metric-value {
        font-size: 25px !important;
        line-height: 1.2 !important;
        margin-top: 8px !important;
      }

      #manaV993StrengthProgress
      .mana-v993-metric-sub {
        font-size: 10px !important;
        line-height: 1.45 !important;
        min-height: 28px !important;
        margin-top: 5px !important;
        overflow-wrap: anywhere;
      }

      #manaV993StrengthProgress
      .mana-v993-track {
        width: 100% !important;
        height: 5px !important;
        margin-top: auto !important;
        background: #303944 !important;
        border-radius: 20px !important;
        overflow: hidden !important;
      }

      #manaV993StrengthProgress
      .mana-v993-fill {
        height: 100% !important;
        border-radius: 20px !important;
      }

      /* =========================================
         CARDIO — ELECTRIC BLUE
         ========================================= */

      #manaV993StrengthProgress
      .mana-v993-metric.mf450-cardio {
        border: 1.5px solid ${BLUE} !important;
        background:
          rgba(54,143,212,.09) !important;
      }

      #manaV993StrengthProgress
      .mf450-cardio
      .mana-v993-metric-label,

      #manaV993StrengthProgress
      .mf450-cardio
      .mana-v993-metric-value {
        color: ${BLUE} !important;
      }

      #manaV993StrengthProgress
      .mf450-cardio
      .mana-v993-fill {
        background: ${BLUE} !important;
        background-color: ${BLUE} !important;
      }

      /* =========================================
         CORE — PREMIUM GOLD
         ========================================= */

      #manaV993StrengthProgress
      .mana-v993-metric.mf450-core {
        border: 1.5px solid ${GOLD} !important;
        background:
          rgba(214,164,55,.09) !important;
      }

      #manaV993StrengthProgress
      .mf450-core
      .mana-v993-metric-label,

      #manaV993StrengthProgress
      .mf450-core
      .mana-v993-metric-value {
        color: ${GOLD} !important;
      }

      #manaV993StrengthProgress
      .mf450-core
      .mana-v993-fill {
        background: ${GOLD} !important;
        background-color: ${GOLD} !important;
      }

      /* =========================================
         COMPLETION SCREEN
         ========================================= */

      #manaV915Complete
      #manaV915Back {
        font-size: 0 !important;
        width: 100% !important;
      }

      #manaV915Complete
      #manaV915Back::after {
        content: "BACK TO WORKOUTS →" !important;
        display: inline-block !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        letter-spacing: .4px !important;
      }

      #manaV915Complete
      .mf450-summary {
        margin: 18px 0 28px;
        padding: 18px;
        background: #101113;
        border: 1px solid #373e46;
        border-radius: 16px;
        color: white;
      }

      #manaV915Complete
      .mf450-summary-title {
        margin: 0 0 15px;
        font-size: 14px;
        font-weight: 900;
      }

      #manaV915Complete
      .mf450-summary-grid {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 12px;
      }

      #manaV915Complete
      .mf450-summary-card {
        min-width: 0;
        padding: 15px 12px;
        border: 1.5px solid var(--accent);
        border-radius: 12px;
        background: var(--tint);
        box-sizing: border-box;
      }

      #manaV915Complete
      .mf450-summary-label {
        color: var(--accent);
        font-size: 13px;
        font-weight: 900;
      }

      #manaV915Complete
      .mf450-summary-value {
        margin-top: 12px;
        color: #fff;
        font-size: 16px;
        font-weight: 900;
        overflow-wrap: anywhere;
      }

      #manaV915Complete
      .mf450-summary-detail {
        margin-top: 5px;
        color: #b3bdc7;
        font-size: 11px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      #manaV915Complete
      .mf450-summary-done {
        margin-top: 10px;
        color: #79e3a6;
        font-size: 11px;
        font-weight: 900;
      }

      /* =========================================
         RESPONSIVE
         ========================================= */

      @media (max-width:700px) {

        #manaV993StrengthProgress
        .mana-v993-metrics {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
          gap: 9px !important;
        }

        #manaV993StrengthProgress
        .mana-v993-metric {
          min-height: 126px !important;
        }

      }

      @media (max-width:420px) {

        #manaV915Complete
        .mf450-summary-grid {
          gap: 9px;
        }

        #manaV915Complete
        .mf450-summary-card {
          padding: 12px 10px;
        }

        #manaV915Complete
        .mf450-summary-value {
          font-size: 14px;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     PERIOD CALCULATIONS
     ========================================= */

  function selectedPeriod() {
    const active = document.querySelector(
      "#manaV993StrengthProgress " +
      ".mana-v993-period.active"
    );

    const value = (
      active?.dataset.v993Period || "daily"
    ).toLowerCase();

    if (value.includes("month")) return "monthly";
    if (value.includes("week")) return "weekly";

    return "daily";
  }

  function periodData() {
    const now = new Date();
    const period = selectedPeriod();

    let start;
    let cardioTarget;
    let coreTarget;

    if (period === "monthly") {
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      cardioTarget = 180;
      coreTarget = 12;

    } else if (period === "weekly") {
      const monday = (now.getDay() + 6) % 7;

      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - monday
      );

      cardioTarget = 45;
      coreTarget = 3;

    } else {
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      cardioTarget = 15;
      coreTarget = 1;
    }

    return {
      now,
      start,
      cardioTarget,
      coreTarget
    };
  }

  function totals() {
    const period = periodData();

    let cardio = 0;
    let core = 0;

    for (const log of getLogs()) {
      const date = new Date(log.date);

      if (
        !Number.isFinite(date.getTime()) ||
        date < period.start ||
        date > period.now
      ) {
        continue;
      }

      if (log.finishers?.cardio?.completed) {
        const result = log.finishers.cardio;

        const value = Number(
          result.actualMinutes ??
          result.durationMinutes ??
          0
        );

        if (Number.isFinite(value) && value > 0) {
          cardio += value;
        }
      }

      if (log.finishers?.core?.completed) {
        core++;
      }
    }

    return {
      cardio,
      core,
      ...period
    };
  }

  /* =========================================
     PROGRESS TILES
     ========================================= */

  function tileHtml(type, amount, target) {
    const cardio = type === "cardio";
    const color = cardio ? BLUE : GOLD;

    const percent = Math.min(
      100,
      Math.max(
        0,
        Math.round(amount / target * 100)
      )
    );

    const description = cardio
      ? `${amount} / ${target} min`
      : `${amount} / ${target} sessions`;

    return `
      <div
        class="mana-v993-metric mf450-${type}"
        data-mf450="${type}"
      >

        <div class="mana-v993-metric-label">
          ${cardio ? "♥ CARDIO" : "◎ CORE"}
        </div>

        <div class="mana-v993-metric-value">
          ${percent}%
        </div>

        <div class="mana-v993-metric-sub">
          ${description}
        </div>

        <div class="mana-v993-track">
          <div
            class="mana-v993-fill"
            style="
              width:${percent}%;
              background-color:${color} !important;
            "
          ></div>
        </div>

      </div>
    `;
  }

  function updateTile(grid, type, amount, target) {
    let tile = grid.querySelector(
      `[data-mf450="${type}"]`
    );

    const html = tileHtml(type, amount, target);

    const template = document.createElement("template");
    template.innerHTML = html.trim();

    const fresh = template.content.firstElementChild;

    if (!fresh) return;

    if (!tile) {
      // Retire the older 103440 card.
      grid.querySelector(
        `[data-mf440="${type}"]`
      )?.remove();

      const workout = [...grid.children].find(
        item =>
          item.querySelector(
            ".mana-v993-metric-label"
          )?.textContent.trim().toUpperCase()
          === "WORKOUTS"
      );

      if (!workout) return;

      const previous = type === "cardio"
        ? workout
        : grid.querySelector(
            '[data-mf450="cardio"]'
          ) || workout;

      previous.after(fresh);
      return;
    }

    // Update only changed fields.
    // Don't rebuild the entire Progress page.
    const newValue = fresh.querySelector(
      ".mana-v993-metric-value"
    )?.textContent;

    const oldValue = tile.querySelector(
      ".mana-v993-metric-value"
    );

    if (oldValue && oldValue.textContent !== newValue) {
      oldValue.textContent = newValue;
    }

    const newSub = fresh.querySelector(
      ".mana-v993-metric-sub"
    )?.textContent;

    const oldSub = tile.querySelector(
      ".mana-v993-metric-sub"
    );

    if (oldSub && oldSub.textContent !== newSub) {
      oldSub.textContent = newSub;
    }

    const width = fresh.querySelector(
      ".mana-v993-fill"
    )?.style.width;

    const fill = tile.querySelector(
      ".mana-v993-fill"
    );

    if (fill && fill.style.width !== width) {
      fill.style.width = width;
    }
  }

  function updateProgress() {
    const root = $("manaV993StrengthProgress");

    if (!root) return;

    const program = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    if (program !== "MANA STRENGTH") return;

    const grid = root.querySelector(
      ".mana-v993-metrics"
    );

    if (!grid) return;

    const data = totals();

    updateTile(
      grid,
      "cardio",
      data.cardio,
      data.cardioTarget
    );

    updateTile(
      grid,
      "core",
      data.core,
      data.coreTarget
    );

    // Remove any obsolete cards from the
    // previous Progress build.
    grid.querySelectorAll(
      '[data-mf440]'
    ).forEach(node => node.remove());
  }

  /* =========================================
     WORKOUT COMPLETE SUMMARY
     ========================================= */

  function summaryCard(type, result) {
    const cardio = type === "cardio";

    const color = cardio ? BLUE : GOLD;
    const tint = cardio
      ? "rgba(54,143,212,.09)"
      : "rgba(214,164,55,.09)";

    let value = "Not added";
    let detail = "Optional finisher";

    if (result?.completed) {
      if (cardio) {
        const mins = Number(
          result.actualMinutes ??
          result.durationMinutes ??
          0
        );

        value = mins > 0
          ? `${mins} minutes logged`
          : "Completed";

        detail = safe(result.equipment || "Cardio");

      } else {
        value = `${Number(result.rounds || 3)} rounds`;

        const list = Array.isArray(result.exercises)
          ? result.exercises
          : [];

        detail = list.length
          ? list.map(item => safe(item.name)).join(", ")
          : "Core completed";
      }
    }

    return `
      <div
        class="mf450-summary-card"
        style="
          --accent:${color};
          --tint:${tint};
        "
      >
        <div class="mf450-summary-label">
          ${cardio ? "♥ CARDIO" : "◎ CORE"}
        </div>

        <div class="mf450-summary-value">
          ${value}
        </div>

        <div class="mf450-summary-detail">
          ${detail}
        </div>

        ${
          result?.completed
            ? '<div class="mf450-summary-done">✓ COMPLETED</div>'
            : ""
        }
      </div>
    `;
  }

  function updateCompletion() {
    const screen = $("manaV915Complete");
    const content = $("manaV915Content");
    const back = $("manaV915Back");

    if (
      !screen?.classList.contains("open") ||
      !content ||
      !back ||
      !content.contains(back)
    ) {
      return;
    }

    back.setAttribute(
      "aria-label",
      "Back to Workouts"
    );

    const latest = getLogs().at(-1);

    if (!latest) return;

    let summary = $("mf450Summary");

    if (!summary) {
      summary = document.createElement("section");
      summary.id = "mf450Summary";
      summary.className = "mf450-summary";

      back.before(summary);
    }

    const html = `
      <h3 class="mf450-summary-title">
        FINISHER SUMMARY
      </h3>

      <div class="mf450-summary-grid">
        ${summaryCard(
          "cardio",
          latest.finishers?.cardio
        )}

        ${summaryCard(
          "core",
          latest.finishers?.core
        )}
      </div>
    `;

    if (summary.innerHTML !== html) {
      summary.innerHTML = html;
    }

    // Retire older completion layouts.
    ["mf410Summary", "mf420Summary", "mf440Summary"]
      .forEach(id => $(id)?.remove());
  }

  /* =========================================
     LIGHTWEIGHT SCREEN UPDATES
     ========================================= */

  let queued = false;

  function refresh() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;

      updateProgress();
      updateCompletion();
    });
  }

  function init() {
    installStyles();

    const progressContent = $("manaV83Content");

    if (progressContent) {
      new MutationObserver(refresh).observe(
        progressContent,
        {
          childList: true,
          subtree: false
        }
      );
    }

    const completion = $("manaV915Complete");

    if (completion) {
      new MutationObserver(refresh).observe(
        completion,
        {
          attributes: true,
          attributeFilter: ["class"]
        }
      );
    }

    const completionContent = $("manaV915Content");

    if (completionContent) {
      new MutationObserver(refresh).observe(
        completionContent,
        {
          childList: true
        }
      );
    }

    window.addEventListener(
      "mana:strength-synced",
      refresh
    );

    window.addEventListener(
      "mana:finishers-saved",
      refresh
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target instanceof Element &&
          event.target.closest(
            "[data-v993-period], #manaV83Tabs"
          )
        ) {
          requestAnimationFrame(refresh);
        }
      }
    );

    refresh();

    console.log(
      "Mana Strength Premium Progress 103450 ready"
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
