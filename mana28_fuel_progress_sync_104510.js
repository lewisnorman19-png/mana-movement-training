
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA28 FUEL + PROGRESS SYNC
   BUILD 104510

   COMPLETE JAVASCRIPT FILE

   FIXES:
   - Progress reads actual Fuel meals
   - Use same calorie, protein and water targets as Fuel
   - Read recovery from the current Fuel recovery score
   - Preserve daily / weekly / monthly / to-date views
   - Orange progress bars throughout Mana28
   - Restore branded Fuel heading with approved runner
   - Keep existing workout records and all saved data

   LOAD AFTER BUILD 104500
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104510";

  if (window.MANA28_FUEL_PROGRESS_SYNC_BUILD === BUILD) {
    return;
  }

  window.MANA28_FUEL_PROGRESS_SYNC_BUILD = BUILD;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const TITLE = "manaV83Title";
  const TABS = "manaV83Tabs";

  const STYLE_ID = "m28FuelProgressSync104510Style";
  const CLASS = "m28-fuel-progress-sync-104510";

  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";
  const PROGRAM_KEY = "mana-v973-mana28-state";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";

  const $ = id => document.getElementById(id);

  function safeJSON(key) {
    try {
      const value = JSON.parse(
        localStorage.getItem(key) || "{}"
      );

      return value && typeof value === "object"
        ? value
        : {};
    } catch (_) {
      return {};
    }
  }

  function clamp(value, min = 0, max = 100) {
    return Math.max(
      min,
      Math.min(max, Number(value) || 0)
    );
  }

  function root() {
    return $(SHELL);
  }

  function isMana28() {
    const s = root();
    const title = $(TITLE);

    if (!s || !title) return false;
    if (!s.classList.contains("open")) return false;

    const name = String(title.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return name === "MANA 28";
  }

  function activeTab() {
    return document.querySelector(
      "#" + TABS + " .mana-v83-tab.active"
    )?.dataset?.v83Tab || "";
  }

  /* ============================================================
     FUEL TARGETS — MATCH EXISTING FUEL ENGINE
     ============================================================ */

  function getTargets() {
    const data = safeJSON(TARGET_KEY);

    return {
      calories: Math.max(
        0,
        Number(data.calories) || 2050
      ),
      protein: Math.max(
        0,
        Number(data.protein) || 120
      ),
      water: Math.max(
        0,
        Number(data.water) || 2300
      )
    };
  }

  /* ============================================================
     DATE HELPERS
     ============================================================ */

  function startOfDay(input) {
    const d = new Date(input);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(date, amount) {
    const d = startOfDay(date);
    d.setDate(d.getDate() + amount);
    return d;
  }

  function daysBetween(a, b) {
    const first = Date.UTC(
      a.getFullYear(),
      a.getMonth(),
      a.getDate()
    );

    const second = Date.UTC(
      b.getFullYear(),
      b.getMonth(),
      b.getDate()
    );

    return Math.round(
      (second - first) / 86400000
    );
  }

  function dateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function getProgramStart() {
    const state = safeJSON(PROGRAM_KEY);

    if (state.startedAt) {
      const d = new Date(state.startedAt);

      if (!Number.isNaN(d.getTime())) {
        return startOfDay(d);
      }
    }

    const inferred = [];

    (Array.isArray(state.completed)
      ? state.completed
      : []
    ).forEach(raw => {
      const day = Number(raw);

      if (!Number.isInteger(day)) return;
      if (day < 1 || day > 28) return;

      const record = state["day" + day] || {};

      const rawDate =
        record.completedAt ||
        record.date;

      if (!rawDate) return;

      const d = new Date(rawDate);

      if (!Number.isNaN(d.getTime())) {
        inferred.push(addDays(d, -(day - 1)));
      }
    });

    if (inferred.length) {
      inferred.sort((a, b) => a - b);
      return inferred[0];
    }

    return startOfDay(new Date());
  }

  /* ============================================================
     PERIOD RANGE
     Match the existing Mana28 progress selections.
     ============================================================ */

  function getDateRange() {
    const today = startOfDay(new Date());
    const start = getProgramStart();
    const finish = addDays(start, 27);

    const selected = document.querySelector(
      "#manaV83Content .mana-v981-period.active"
    )?.dataset?.v981Period || "daily";

    if (selected === "daily") {
      return {start: today, end: today};
    }

    if (selected === "weekly") {
      const programDay = clamp(
        daysBetween(start, today) + 1,
        1,
        28
      );

      const week = Math.floor(
        (programDay - 1) / 7
      );

      const weekStart = addDays(
        start,
        week * 7
      );

      const weekEnd = addDays(
        weekStart,
        6
      );

      return {
        start: weekStart,
        end: today < weekEnd ? today : weekEnd
      };
    }

    if (selected === "monthly") {
      const monthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const monthEnd = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      return {
        start: monthStart > start ? monthStart : start,
        end: monthEnd < finish
          ? (today < monthEnd ? today : monthEnd)
          : (today < finish ? today : finish)
      };
    }

    return {
      start,
      end: today < finish ? today : finish
    };
  }

  /* ============================================================
     NUTRITION TOTALS
     Read the same saved meals used by Fuel.
     ============================================================ */

  function getDayTotals(day) {
    const result = {
      calories: 0,
      protein: 0,
      water: Math.max(0, Number(day?.water) || 0)
    };

    const meals = day?.meals || {};

    Object.values(meals).forEach(items => {
      if (!Array.isArray(items)) return;

      items.forEach(item => {
        result.calories += Math.max(
          0,
          Number(item?.calories) || 0
        );

        result.protein += Math.max(
          0,
          Number(item?.protein) || 0
        );
      });
    });

    return result;
  }

  /* ============================================================
     RECOVERY — READ CURRENT FUEL SCORE
     ============================================================ */

  function getRecoveryScore(record) {
    const numeric = Number(record?.recoveryScore);

    if (
      record?.recoveryScore !== undefined &&
      record?.recoveryScore !== null &&
      record?.recoveryScore !== "" &&
      Number.isFinite(numeric)
    ) {
      return clamp(numeric, 0, 10);
    }

    const level = String(
      record?.recoveryLevel || ""
    ).toLowerCase();

    if (level === "good") return 8;
    if (level === "moderate") return 5;

    if (
      level === "low" ||
      level === "needs-attention"
    ) {
      return 3;
    }

    return record?.recovery === true ? 8 : 0;
  }

  /* ============================================================
     CALCULATE NUTRITION AND RECOVERY PROGRESS
     ============================================================ */

  function calculateMetrics() {
    const targets = getTargets();
    const fuel = safeJSON(FUEL_KEY);
    const daily = safeJSON(DAILY_KEY);
    const range = getDateRange();

    const scores = {
      water: 0,
      calories: 0,
      protein: 0,
      recovery: 0
    };

    let days = 0;

    if (range.start > range.end) {
      return scores;
    }

    let cursor = startOfDay(range.start);

    while (
      cursor <= range.end &&
      days < 31
    ) {
      const key = dateKey(cursor);
      const totals = getDayTotals(fuel[key] || {});

      scores.water += clamp(
        totals.water / targets.water * 100
      );

      scores.protein += clamp(
        totals.protein / targets.protein * 100
      );

      // Calories use accuracy toward the daily
      // calorie target, matching Mana28 Progress.
      scores.calories += clamp(
        100 -
        Math.abs(
          totals.calories - targets.calories
        ) / targets.calories * 100
      );

      const recovery = getRecoveryScore(
        daily[key] || {}
      );

      scores.recovery += clamp(
        recovery / 10 * 100
      );

      cursor = addDays(cursor, 1);
      days++;
    }

    const result = {};

    Object.keys(scores).forEach(key => {
      result[key] = days > 0
        ? Math.round(scores[key] / days)
        : 0;
    });

    result.days = days;
    result.targets = targets;

    return result;
  }

  /* ============================================================
     UPDATE EXISTING PROGRESS CARDS
     Do not rebuild the Progress page.
     The existing filters and click handlers stay intact.
     ============================================================ */

  function setText(element, value) {
    if (!element) return;

    if (element.textContent !== value) {
      element.textContent = value;
    }
  }

  function updateProgressCards() {
    if (!isMana28()) return;
    if (activeTab() !== "progress") return;

    const holder = $(CONTENT);
    if (!holder?.querySelector(".mana-v981-root")) return;

    const metrics = calculateMetrics();

    holder.querySelectorAll(
      ".mana-v981-card"
    ).forEach(card => {
      const label = (
        card.querySelector(".mana-v981-label")
          ?.textContent || ""
      ).trim().toUpperCase();

      let key = "";

      if (label === "WATER") key = "water";
      if (label === "CALORIES") key = "calories";
      if (label === "PROTEIN") key = "protein";
      if (label === "RECOVERY") key = "recovery";

      if (!key) return;

      const percentage = metrics[key];

      setText(
        card.querySelector(".mana-v981-value"),
        percentage + "%"
      );

      const descriptions = {
        water: "Average water target completed",
        calories: "Average calorie target accuracy",
        protein: "Average protein target completed",
        recovery: "Average recovery score"
      };

      const description =
        descriptions[key] +
        " across " +
        metrics.days +
        (metrics.days === 1 ? " day" : " days");

      setText(
        card.querySelector(".mana-v981-sub"),
        description
      );

      const fill = card.querySelector(
        ".mana-v981-bar span"
      );

      if (fill && fill.style.width !== percentage + "%") {
        fill.style.width = percentage + "%";
      }
    });
  }

  /* ============================================================
     FUEL — APPROVED BRAND HEADER
     ============================================================ */

  function ensureFuelBrand() {
    if (!isMana28()) return;
    if (activeTab() !== "fuel") return;

    const fuel = $(CONTENT)?.querySelector(
      "#manaV1015Fuel"
    );

    if (!fuel) return;

    if (fuel.querySelector(".m28-fuel-brand-104510")) {
      return;
    }

    const brand = document.createElement("div");
    brand.className = "m28-fuel-brand-104510";

    brand.innerHTML = `
      <img
        src="ui/mana-runner-logo.png"
        alt=""
        aria-hidden="true"
      >
      <div class="m28-fuel-brand-copy">
        <span class="m28-fuel-brand-kicker">
          MANA MOVEMENT
        </span>
        <div class="m28-fuel-brand-title">
          <span>MANA </span><strong>28</strong>
        </div>
        <div class="m28-fuel-brand-sub">
          28 Days. Build Momentum.
        </div>
      </div>
    `;

    const hero = fuel.querySelector(".m1022-hero");

    if (hero) {
      hero.insertAdjacentElement("beforebegin", brand);
    } else {
      fuel.prepend(brand);
    }
  }

  /* ============================================================
     CSS — FORCE ORANGE PROGRESS INDICATORS
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* Progress bars: all Mana28 indicators orange. */

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-overall-bar > span,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-bar > span {
        background: ${ORANGE} !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-overall-bar,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-bar {
        background: #353A40 !important;
        background-image: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-card,
      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-overall {
        border-color: #656D77 !important;
        box-shadow: none !important;
      }

      html body #${SHELL}.${CLASS}
      #${CONTENT} .mana-v981-overall::before {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      /* Fuel uses the same black/orange/white/silver
         branding as the other Mana28 screens. */

      html body #${SHELL}.${CLASS}
      #manaV1015Fuel .m28-fuel-brand-104510 {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        margin: 0 0 22px !important;
        padding: 10px 0 14px !important;
        border-bottom: 1px solid #454B54 !important;
        color: ${WHITE} !important;
        background: transparent !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-104510 img {
        display: block !important;
        width: 67px !important;
        height: 48px !important;
        object-fit: contain !important;
        flex: 0 0 67px !important;
        filter: none !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-copy {
        min-width: 0 !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-kicker {
        display: block !important;
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        letter-spacing: .12em !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-title {
        font-size: clamp(23px,4vw,30px) !important;
        font-weight: 900 !important;
        line-height: 1.15 !important;
        white-space: nowrap !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-title span {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-title strong {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      .m28-fuel-brand-sub {
        margin-top: 4px !important;
        color: ${SILVER} !important;
        font-size: 12px !important;
      }

      html body #${SHELL}.${CLASS}
      #manaV1015Fuel .m1022-kicker {
        color: ${ORANGE} !important;
        -webkit-text-fill-color: ${ORANGE} !important;
      }

      html body #${SHELL}.${CLASS}
      #manaV1015Fuel .m1022-hero h2 {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      @media (max-width:600px) {
        html body #${SHELL}.${CLASS}
        .m28-fuel-brand-104510 img {
          width: 55px !important;
          height: 42px !important;
          flex-basis: 55px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     VIEW UPDATE
     ============================================================ */

  function apply() {
    const s = root();
    if (!s) return;

    const active = isMana28();

    s.classList.toggle(CLASS, active);

    if (!active) return;

    const tab = activeTab();

    if (tab === "fuel") {
      ensureFuelBrand();
    }

    if (tab === "progress") {
      updateProgressCards();
    }
  }

  /* ============================================================
     SCHEDULE REFRESH
     ============================================================ */

  let queued = false;

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();
    apply();

    const s = root();

    if (s && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(s, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            "#manaV83Tabs, #manaV83ProgramShell, #manaV80Mana28"
          )
        ) {
          schedule();
        }
      },
      true
    );

    [
      "mana:program-tab-change",
      "mana:fuel-updated",
      "mana:recovery-updated",
      "pageshow",
      "focus"
    ].forEach(name => {
      window.addEventListener(name, schedule);
    });

    window.addEventListener("storage", event => {
      if ([
        FUEL_KEY,
        TARGET_KEY,
        DAILY_KEY,
        PROGRAM_KEY
      ].includes(event.key)) {
        schedule();
      }
    });

    console.log(
      "[Mana28] Fuel / Progress sync ready — " + BUILD
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
