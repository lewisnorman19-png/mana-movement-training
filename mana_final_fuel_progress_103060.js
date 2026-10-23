
/* ============================================
   MANA MOVEMENT TRAINING
   FUEL + PROGRESS FINAL REFINEMENT
   BUILD 103060

   HOME:
   - Larger program headings

   PROGRESS:
   - Recovery linked to Fuel
   - Water progress blue
   - Recovery progress purple
   - Green workout/protein/calorie bars

   FUEL:
   - Preserve existing logging
   - Reduce visual transitions
   - Avoid unnecessary DOM updates

   PRESERVE:
   - Overview layouts
   - Bottom navigation
   - Thin premium gold borders
   - Workout illustrations
   - History line graph
   - Coach Hub
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103060";
  const STYLE_ID = "mana-final-fuel-progress-103060";

  if (window.MANA_FINAL_FUEL_PROGRESS === BUILD) {
    return;
  }

  const CSS = `

    :root {
      --mana-premium-yellow: #e6bd48;
      --mana-progress-green: #45c783;
      --mana-progress-blue: #42b8ff;
      --mana-progress-purple: #a77bff;
    }

    /* =====================================
       HOME - LARGER HEADINGS
       ===================================== */

    html body #manaV80Home
    .mana-v8013-program h2 {
      font-size: 34px !important;
      font-weight: 950 !important;
      line-height: 1.08 !important;
      letter-spacing: -.035em !important;
      overflow-wrap: normal;
    }

    /* Maintain the yellow premium borders */

    html body #manaV80Home
    .mana-v8013-program,
    html body #manaV80Home
    .mana-v8013-program.current {
      border: 2px solid
        var(--mana-premium-yellow) !important;
    }

    /* =====================================
       PROGRESS - GREEN BARS
       ===================================== */

    #manaV993StrengthProgress
    .mana-v993-metric:not(.mp-recovery-card)
    .mana-v993-fill {
      background: linear-gradient(
        90deg,
        #278b57,
        #45c783
      ) !important;
    }

    /* =====================================
       WATER - BLUE
       ===================================== */

    #manaV993StrengthProgress
    .mp-water-fill,
    #manaV993StrengthProgress
    .mp-water-metric .mp-water-fill {
      background: linear-gradient(
        90deg,
        #1677bb,
        #42b8ff
      ) !important;
    }

    /* Fuel water matches Progress */

    .m1022-target.water
    .m1022-bar span {
      background: linear-gradient(
        90deg,
        #1677bb,
        #42b8ff
      ) !important;
    }

    /* =====================================
       RECOVERY - PURPLE BAR ONLY
       ===================================== */

    #manaV993StrengthProgress
    .mp-recovery-card
    .mana-v993-fill {
      background: linear-gradient(
        90deg,
        #6f49bb,
        #a77bff
      ) !important;
    }

    .m1022-target.recovery
    .m1022-bar span {
      background: linear-gradient(
        90deg,
        #6f49bb,
        #a77bff
      ) !important;
    }

    /* Recovery retains a gold outline */

    #manaV993StrengthProgress
    .mp-recovery-card {
      border: 1px solid
        rgba(230,189,72,.65) !important;
    }

    #manaV993StrengthProgress
    .mp-recovery-card
    .mana-v993-metric-label,
    #manaV993StrengthProgress
    .mp-recovery-card
    .mana-v993-metric-value {
      color: #f3d875 !important;
    }

    /* =====================================
       FUEL - REDUCE VISUAL FLICKER
       ===================================== */

    #manaV1015Fuel .m1022-target,
    #manaV1015Fuel .m1022-bar,
    #manaV1015Fuel .m1022-bar span,
    #manaV980SharedFuel .m1022-target {
      animation: none !important;
      transition: none !important;
    }

    /* Keep card dimensions stable */

    .m1022-target {
      contain: layout;
      min-width: 0;
    }

    .m1022-target-value {
      font-variant-numeric: tabular-nums;
    }

    /* =====================================
       PHONE HEADING SIZE
       ===================================== */

    @media(max-width:600px) {

      html body #manaV80Home
      .mana-v8013-program h2 {
        font-size: 32px !important;
        line-height: 1.08 !important;
      }

    }

    @media(max-width:380px) {

      html body #manaV80Home
      .mana-v8013-program h2 {
        font-size: 28px !important;
      }

    }

  `;

  /* ==========================================
     INSTALL STYLES ONCE
     ========================================== */

  function installStyles() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  /* ==========================================
     DATE HELPERS
     ========================================== */

  function dateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function readJSON(key, fallback = {}) {
    try {
      const value = JSON.parse(
        localStorage.getItem(key) || "null"
      );

      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  /* ==========================================
     READ SAME RECOVERY DATA AS FUEL

     Stored in:
     mana-strength-v866-daily

     Recovery scale: 0 to 10
     ========================================== */

  function recoveryScore(day) {
    if (!day || typeof day !== "object") {
      return null;
    }

    const score = day.recoveryScore;

    if (
      score !== null &&
      score !== undefined &&
      score !== "" &&
      Number.isFinite(Number(score))
    ) {
      return Math.max(
        0,
        Math.min(10, Number(score))
      );
    }

    const level = String(
      day.recoveryLevel ||
      day.recovery ||
      ""
    ).toLowerCase();

    if (level === "good" || level === "true") {
      return 8;
    }

    if (level === "moderate") {
      return 5;
    }

    if (
      level === "needs-attention" ||
      level === "low"
    ) {
      return 3;
    }

    return null;
  }

  /* ==========================================
     SELECT DAILY / WEEKLY / MONTHLY PERIOD
     ========================================== */

  function selectedPeriod(root) {
    return root.querySelector(
      ".mana-v993-period.active"
    )?.dataset.v993Period || "daily";
  }

  function periodDays(period) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start = new Date(today);

    if (period === "weekly") {
      const offset = (today.getDay() + 6) % 7;
      start.setDate(today.getDate() - offset);
    }

    if (period === "monthly") {
      start.setDate(1);
    }

    const days = [];

    for (
      let d = new Date(start);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(dateKey(d));
    }

    return days;
  }

  /* ==========================================
     RECOVERY AUTOMATICALLY FROM FUEL
     ========================================== */

  function linkedRecovery(period) {
    const daily = readJSON(
      "mana-strength-v866-daily",
      {}
    );

    const scores = periodDays(period)
      .map(key => recoveryScore(daily[key]))
      .filter(score => score !== null);

    if (!scores.length) {
      return null;
    }

    const total = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    return {
      score: total / scores.length,
      count: scores.length
    };
  }

  /* ==========================================
     UPDATE RECOVERY CARD

     Modify the existing metric.
     Do not rebuild the Progress page.
     ========================================== */

  function syncRecovery() {
    const root = document.getElementById(
      "manaV993StrengthProgress"
    );

    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll(
        ".mana-v993-metric"
      )
    );

    const card = cards.find(node => {
      const label = node.querySelector(
        ".mana-v993-metric-label"
      );

      return /^(REST|RECOVERY)$/i.test(
        label?.textContent?.trim() || ""
      );
    });

    if (!card) return;

    card.classList.add("mp-recovery-card");

    const label = card.querySelector(
      ".mana-v993-metric-label"
    );

    const value = card.querySelector(
      ".mana-v993-metric-value"
    );

    const sub = card.querySelector(
      ".mana-v993-metric-sub"
    );

    const fill = card.querySelector(
      ".mana-v993-fill"
    );

    if (label && label.textContent !== "RECOVERY") {
      label.textContent = "RECOVERY";
    }

    const period = selectedPeriod(root);
    const recovery = linkedRecovery(period);

    const percentage = recovery
      ? Math.round(recovery.score * 10)
      : 0;

    const display = recovery
      ? percentage + "%"
      : "—";

    const description = recovery
      ? recovery.score.toFixed(1) +
        "/10 from Fuel" +
        (period === "daily"
          ? ""
          : " • " + recovery.count + " days")
      : "Log recovery in Fuel";

    if (value && value.textContent.trim() !== display) {
      value.textContent = display;
    }

    if (sub && sub.textContent.trim() !== description) {
      sub.textContent = description;
    }

    if (fill) {
      const width = percentage + "%";

      if (fill.style.width !== width) {
        fill.style.width = width;
      }
    }
  }

  /* ==========================================
     CONTROLLED REFRESH

     No continuous DOM observer.
     No card rebuilding.
     No repeated stylesheet removal.
     ========================================== */

  let pending = false;

  function scheduleSync() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      syncRecovery();
    });
  }

  function refreshAfterNavigation() {
    scheduleSync();

    /* Existing Progress may render just after
       the tab click. One additional check. */

    setTimeout(scheduleSync, 180);
  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {
    installStyles();
    scheduleSync();

    [
      "mana:recovery-updated",
      "mana:fuel-updated",
      "mana:program-tab-change",
      "mana:program-change"
    ].forEach(name => {
      window.addEventListener(
        name,
        refreshAfterNavigation
      );

      document.addEventListener(
        name,
        refreshAfterNavigation
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          [
            "[data-v83-tab]",
            "[data-v993-period]",
            "[data-m1022-recovery]"
          ].join(",")
        )) {
          refreshAfterNavigation();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      refreshAfterNavigation
    );

    window.MANA_FINAL_FUEL_PROGRESS = BUILD;

    console.log(
      "MANA FUEL + PROGRESS LINK",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
