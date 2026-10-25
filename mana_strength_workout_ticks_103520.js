
/* =====================================================
   MANA MOVEMENT TRAINING
   STRENGTH WORKOUT CARDS
   BUILD 103590

   COMPLETE FILE REPLACEMENT:
   mana_strength_workout_ticks_103520.js

   FIX:
   Completed workouts accumulate through the week.

   Workout 1 completed = tick 1
   Workout 2 completed = ticks 1 + 2
   Workout 3 completed = ticks 1 + 2 + 3

   PRESERVES:
   - Premium yellow workout card borders
   - Yellow completion ticks
   - Clean, always-visible exercise lists
   - White exercise text
   - Yellow exercise number pills
   - Start Workout buttons
   - Existing workout history
   - Existing weekly program selection

   No new image assets.
   No polling timers.
   No workout history modifications.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103590";
  const STYLE_ID = "mana-strength-cards-103590";
  const LOG_KEY = "mana-strength-v64-logs";
  const GOLD = "#F3D875";

  if (window.MANA_STRENGTH_CARDS_103590) return;
  window.MANA_STRENGTH_CARDS_103590 = true;

  const $ = id => document.getElementById(id);

  function strengthOpen() {
    return (
      $("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      $("manaV83ProgramShell")
        ?.classList.contains("open")
    );
  }

  function workoutsOpen() {
    return document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab === "program";
  }

  /* =========================================
     READ ORIGINAL WORKOUT HISTORY
     ========================================= */

  function readLogs() {
    try {
      const logs = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      return Array.isArray(logs) ? logs : [];

    } catch (_) {
      return [];
    }
  }

  function cleanName(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /* =========================================
     CURRENT MONDAY–SUNDAY WEEK
     ========================================= */

  function currentWeek() {
    const now = new Date();

    const weekday =
      (now.getDay() + 6) % 7;

    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - weekday
    );

    const end = new Date(start);

    end.setDate(
      end.getDate() + 7
    );

    return {start,end};
  }

  /* =========================================
     CHECK A COMPLETED LOG
     ========================================= */

  function logCompleted(log) {
    if (!log || !log.date) return false;

    const percent = Number(
      log.completionPercent
    );

    if (
      Number.isFinite(percent) &&
      percent >= 100
    ) {
      return true;
    }

    const sets = Number(log.completedSets);
    const total = Number(log.totalSets);

    if (
      Number.isFinite(sets) &&
      Number.isFinite(total) &&
      total > 0 &&
      sets >= total
    ) {
      return true;
    }

    return log.completed === true &&
      (!Number.isFinite(percent) || percent >= 100);
  }

  /* =========================================
     BUILD A CUMULATIVE WEEKLY RECORD
     ========================================= */

  function weeklyCompletions() {
    const {start,end} = currentWeek();

    const byIndex = new Set();
    const byName = new Set();

    readLogs().forEach(log => {
      const date = new Date(log?.date || "");

      if (
        !Number.isFinite(date.getTime()) ||
        date < start ||
        date >= end ||
        !logCompleted(log)
      ) {
        return;
      }

      const index = Number(log.dayIndex);

      if (
        log.dayIndex !== null &&
        log.dayIndex !== undefined &&
        log.dayIndex !== "" &&
        Number.isInteger(index) &&
        index >= 0
      ) {
        byIndex.add(index);
      } else {
        const name = cleanName(
          log.sessionName
        );

        if (name) byName.add(name);
      }
    });

    return {byIndex,byName};
  }

  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* PREMIUM YELLOW WORKOUT CARDS */

      #manaV83Content .mana-v85-day,
      #manaV83Content .mana-v85-day.in-progress,
      #manaV83Content .mana-v85-day.mana-v964-expanded {
        position: relative !important;
        border: 2px solid ${GOLD} !important;
        border-color: ${GOLD} !important;
        border-radius: 20px !important;
        background:
          linear-gradient(145deg,#15130d,#090909)
          !important;
        box-shadow: none !important;
        outline: none !important;
        box-sizing: border-box !important;
      }

      #manaV83Content .mana-v85-day::before,
      #manaV83Content .mana-v85-day::after {
        content: none !important;
        display: none !important;
      }

      /* HIDE ORIGINAL COMPLETION BADGE */

      #manaV83Content .mf590-old-badge {
        display: none !important;
      }

      /* TOP-RIGHT YELLOW COMPLETION TICK */

      #manaV83Content .mf590-complete {
        position: absolute;
        top: 15px;
        right: 16px;
        width: 118px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        text-align: center;
        pointer-events: none;
        z-index: 3;
      }

      #manaV83Content .mf590-complete svg {
        width: 37px !important;
        height: 37px !important;
        fill: none !important;
        stroke: ${GOLD} !important;
        stroke-width: 2.5 !important;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #manaV83Content .mf590-complete svg * {
        stroke: ${GOLD} !important;
        fill: none !important;
      }

      #manaV83Content .mf590-complete-label {
        color: ${GOLD} !important;
        font-size: 10px !important;
        line-height: 1.3 !important;
        font-weight: 950 !important;
        letter-spacing: .35px !important;
      }

      #manaV83Content
      .mana-v85-day.mf590-done .mana-v85-top {
        padding-right: 121px !important;
        box-sizing: border-box;
      }

      #manaV83Content
      .mana-v85-day.mf590-done .mana-v85-count {
        display: none !important;
      }

      /* PRESERVE CLEAN EXPANDED EXERCISES */

      #manaV83Content .mana-v85-day
      .mana-v85-exercises {
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
      }

      #manaV83Content .mana-v85-day
      .mana-v85-exercise {
        border: 0 !important;
        background: transparent !important;
        color: #fff !important;
        box-shadow: none !important;
      }

      #manaV83Content .mana-v85-day
      .mana-v85-num {
        color: ${GOLD} !important;
        border: 1.5px solid ${GOLD} !important;
        border-radius: 10px !important;
        background:
          rgba(243,216,117,.06) !important;
      }

      /* MOBILE */

      @media(max-width:480px) {

        #manaV83Content .mf590-complete {
          top: 13px;
          right: 12px;
          width: 90px;
          gap: 5px;
        }

        #manaV83Content .mf590-complete svg {
          width: 31px !important;
          height: 31px !important;
        }

        #manaV83Content .mf590-complete-label {
          font-size: 9px !important;
          letter-spacing: .1px !important;
        }

        #manaV83Content
        .mana-v85-day.mf590-done .mana-v85-top {
          padding-right: 96px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     REMOVE OLD COMPLETION LABEL
     ========================================= */

  function hideOldBadge(card) {
    card.querySelectorAll(
      "span,small,strong,div"
    ).forEach(node => {
      if (node.closest(".mf590-complete")) {
        return;
      }

      const text = (
        node.textContent || ""
      ).replace(/\s+/g," ").trim();

      if (
        /^(?:✓|✔|☑)?\s*COMPLETED THIS WEEK$/i
          .test(text)
      ) {
        node.classList.add(
          "mf590-old-badge"
        );
      }
    });
  }

  /* =========================================
     CREATE COMPLETION MARK
     ========================================= */

  function makeTick() {
    const mark = document.createElement("div");

    mark.className = "mf590-complete";

    mark.setAttribute(
      "role",
      "img"
    );

    mark.setAttribute(
      "aria-label",
      "Workout complete this week"
    );

    mark.innerHTML = `
      <svg viewBox="0 0 36 36"
        aria-hidden="true">
        <circle cx="18" cy="18" r="15"/>
        <path
          d="M10.5 18.5 L15.5 23.5 L25.5 12.5"
        />
      </svg>

      <span class="mf590-complete-label">
        WORKOUT COMPLETE<br>
        THIS WEEK
      </span>
    `;

    return mark;
  }

  /* =========================================
     UPDATE EXISTING WORKOUT CARDS
     ========================================= */

  function decorateCards() {
    if (!strengthOpen() || !workoutsOpen()) {
      return;
    }

    const completed = weeklyCompletions();

    document.querySelectorAll(
      "#manaV83Content .mana-v85-day"
    ).forEach((card,index) => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      hideOldBadge(card);

      // Remove outdated tick designs.
      card.querySelectorAll(
        ".mf510-right, .mf520-complete, " +
        ".mf530-complete, .mf540-complete, " +
        ".mf550-complete"
      ).forEach(node => node.remove());

      const name = cleanName(
        card.querySelector(
          ".mana-v85-title"
        )?.textContent
      );

      // Prefer the precise saved day index.
      // Fall back to the name only when
      // a historical log has no day index.
      const done =
        completed.byIndex.has(index) ||
        completed.byName.has(name);

      const current = card.querySelector(
        ".mf590-complete"
      );

      card.classList.toggle(
        "mf590-done",
        done
      );

      if (done && !current) {
        card.appendChild(makeTick());

      } else if (!done && current) {
        current.remove();
      }
    });
  }

  /* =========================================
     LIGHTWEIGHT UPDATE SCHEDULING
     ========================================= */

  let queued = false;

  function refresh() {
    if (queued) return;
    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      decorateCards();
    });
  }

  function init() {
    installStyles();

    const content = $("manaV83Content");

    if (content) {
      new MutationObserver(refresh).observe(
        content,
        {
          childList: true
        }
      );
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs, .mana-v85-day"
        )) {
          refresh();
        }
      }
    );

    window.addEventListener(
      "mana:strength-synced",
      refresh
    );

    window.addEventListener(
      "mana:workout-timing-saved",
      refresh
    );

    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    refresh();

    console.log(
      "Mana Strength Cumulative Weekly Ticks",
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
