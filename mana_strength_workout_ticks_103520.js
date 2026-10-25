
/* =====================================================
   MANA MOVEMENT TRAINING
   WORKOUT COMPLETION TICKS
   BUILD 103600

   COMPLETE FILE REPLACEMENT:
   mana_strength_workout_ticks_103520.js

   COMPLETION RULES

   Complete Workout:
   - Saves a workout-history record
   - Shows a yellow tick
   - Does not require 100% of sets

   Pause Workout:
   - Preserves unfinished workout state
   - Does not create a completion tick

   Completing another workout:
   - Keeps previous completed workouts ticked

   PRESERVES
   - Premium yellow card borders
   - Yellow tick and completion label
   - Always-visible exercises
   - Yellow exercise number pills
   - Start Workout buttons
   - Existing workout history

   No images.
   No polling.
   No workout data rewriting.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103600";

  if (window.MANA_STRENGTH_TICKS_103600) {
    return;
  }

  window.MANA_STRENGTH_TICKS_103600 = true;

  const STYLE_ID = "mana-strength-ticks-103600";
  const LOG_KEY = "mana-strength-v64-logs";
  const GOLD = "#F3D875";

  const $ = id => document.getElementById(id);

  /* =========================================
     READ COMPLETED SESSION HISTORY
     ========================================= */

  function readLogs() {
    try {
      const value = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      return Array.isArray(value)
        ? value
        : [];
    } catch (_) {
      return [];
    }
  }

  /* =========================================
     CURRENT CALENDAR WEEK
     ========================================= */

  function currentWeek() {
    const now = new Date();

    const day =
      (now.getDay() + 6) % 7;

    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - day
    );

    const end = new Date(start);

    end.setDate(end.getDate() + 7);

    return {start,end};
  }

  function cleanName(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /* =========================================
     SESSION FINALISATION LOGIC

     The v6.4 workout logger creates a
     record in mana-strength-v64-logs
     when Complete Workout is pressed.

     Paused workouts are kept separately
     by the v9.20 in-progress system.

     Therefore a valid v6.4 workout record
     represents a finalised session.

     Actual set completion percentages
     remain available for History.
     ========================================= */

  function isFinalisedSession(log) {
    if (!log || typeof log !== "object") {
      return false;
    }

    if (!log.date || !log.sessionName) {
      return false;
    }

    const dayIndex = Number(log.dayIndex);

    if (!Number.isInteger(dayIndex)) {
      return false;
    }

    if (dayIndex < 0) {
      return false;
    }

    const date = new Date(log.date);

    if (!Number.isFinite(date.getTime())) {
      return false;
    }

    // A record produced by the existing
    // Complete Workout logger qualifies,
    // even when some exercise sets are
    // unfinished.
    //
    // Do not test completionPercent here.

    return true;
  }

  /* =========================================
     ALL WORKOUTS FINALISED THIS WEEK
     ========================================= */

  function completedThisWeek() {
    const {start,end} = currentWeek();

    const entries = new Map();

    for (const log of readLogs()) {
      if (!isFinalisedSession(log)) {
        continue;
      }

      const date = new Date(log.date);

      if (date < start || date >= end) {
        continue;
      }

      const index = Number(log.dayIndex);

      if (!entries.has(index)) {
        entries.set(index,new Set());
      }

      entries.get(index).add(
        cleanName(log.sessionName)
      );
    }

    return entries;
  }

  /* =========================================
     CHECK CURRENT STRENGTH SCREEN
     ========================================= */

  function strengthWorkoutsOpen() {
    const program = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    const tab = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    );

    return (
      program === "MANA STRENGTH" &&
      tab?.dataset.v83Tab === "program"
    );
  }

  /* =========================================
     PREMIUM WORKOUT CARD STYLING
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* MAIN CARD BORDER */

      #manaV83Content
      .mana-v85-day,

      #manaV83Content
      .mana-v85-day.in-progress,

      #manaV83Content
      .mana-v85-day.mana-v964-expanded {

        position: relative !important;

        border: 2px solid ${GOLD} !important;

        border-top-color: ${GOLD} !important;
        border-right-color: ${GOLD} !important;
        border-bottom-color: ${GOLD} !important;
        border-left-color: ${GOLD} !important;

        border-radius: 20px !important;

        background:
          linear-gradient(
            145deg,
            #15130d,
            #090909
          ) !important;

        box-shadow: none !important;
        outline: none !important;

        box-sizing: border-box !important;
      }

      /* REMOVE COLOURED EDGE ACCENTS */

      #manaV83Content
      .mana-v85-day::before,

      #manaV83Content
      .mana-v85-day::after {

        content: none !important;
        display: none !important;
      }

      /* OLD COMPLETION BADGES */

      #manaV83Content
      .mf600-old-badge {
        display: none !important;
      }

      /* NEW YELLOW COMPLETION TICK */

      #manaV83Content
      .mf600-complete {

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

      #manaV83Content
      .mf600-complete svg {

        width: 37px !important;
        height: 37px !important;

        fill: none !important;
        stroke: ${GOLD} !important;

        stroke-width: 2.5 !important;

        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #manaV83Content
      .mf600-complete svg circle,

      #manaV83Content
      .mf600-complete svg path {

        fill: none !important;
        stroke: ${GOLD} !important;
      }

      #manaV83Content
      .mf600-complete-label {

        color: ${GOLD} !important;

        font-size: 10px !important;
        font-weight: 950 !important;

        line-height: 1.3 !important;

        letter-spacing: .35px !important;
      }

      /* SPACE FOR TICK */

      #manaV83Content
      .mana-v85-day.mf600-done
      .mana-v85-top {

        padding-right: 121px !important;

        box-sizing: border-box;
      }

      #manaV83Content
      .mana-v85-day.mf600-done
      .mana-v85-count {

        display: none !important;
      }

      /* CLEAN EXERCISE LIST */

      #manaV83Content
      .mana-v85-day
      .mana-v85-exercises {

        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      #manaV83Content
      .mana-v85-day
      .mana-v85-exercise {

        border: none !important;
        color: #ffffff !important;
        background: transparent !important;
      }

      /* YELLOW EXERCISE NUMBERS */

      #manaV83Content
      .mana-v85-day
      .mana-v85-num {

        color: ${GOLD} !important;

        border: 1.5px solid ${GOLD} !important;

        border-radius: 10px !important;

        background:
          rgba(243,216,117,.06) !important;
      }

      /* MOBILE */

      @media(max-width:480px) {

        #manaV83Content
        .mf600-complete {

          top: 13px;
          right: 12px;

          width: 90px;

          gap: 5px;
        }

        #manaV83Content
        .mf600-complete svg {

          width: 31px !important;
          height: 31px !important;
        }

        #manaV83Content
        .mf600-complete-label {

          font-size: 9px !important;

          letter-spacing: .1px !important;
        }

        #manaV83Content
        .mana-v85-day.mf600-done
        .mana-v85-top {

          padding-right: 96px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     HIDE ORIGINAL SMALL BADGE
     ========================================= */

  function hideOldBadge(card) {
    card.querySelectorAll(
      "span,small,strong,div"
    ).forEach(node => {
      if (node.closest(".mf600-complete")) {
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
          "mf600-old-badge"
        );
      }
    });
  }

  /* =========================================
     CREATE YELLOW TICK
     ========================================= */

  function makeTick() {
    const mark = document.createElement("div");

    mark.className = "mf600-complete";

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

        <circle
          cx="18"
          cy="18"
          r="15"
        />

        <path
          d="M10.5 18.5 L15.5 23.5 L25.5 12.5"
        />

      </svg>

      <span class="mf600-complete-label">
        WORKOUT COMPLETE<br>
        THIS WEEK
      </span>
    `;

    return mark;
  }

  /* =========================================
     UPDATE TICKS ON EXISTING CARDS
     ========================================= */

  function decorateCards() {
    if (!strengthWorkoutsOpen()) {
      return;
    }

    const completed = completedThisWeek();

    const cards = document.querySelectorAll(
      "#manaV83Content .mana-v85-day"
    );

    cards.forEach((card,index) => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      hideOldBadge(card);

      // Retire old tick versions, if present.
      card.querySelectorAll(
        ".mf510-right, " +
        ".mf520-complete, " +
        ".mf530-complete, " +
        ".mf540-complete, " +
        ".mf550-complete, " +
        ".mf590-complete"
      ).forEach(node => node.remove());

      const name = cleanName(
        card.querySelector(
          ".mana-v85-title"
        )?.textContent
      );

      const completedNames = completed.get(index);

      // Match the actual workout day and name.
      // Do not transfer a tick to another day.
      const done = Boolean(
        name &&
        completedNames?.has(name)
      );

      let tick = card.querySelector(
        ".mf600-complete"
      );

      card.classList.toggle(
        "mf600-done",
        done
      );

      if (done && !tick) {
        card.appendChild(makeTick());

      } else if (!done && tick) {
        tick.remove();
      }
    });
  }

  /* =========================================
     LIGHTWEIGHT UPDATE
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
        {childList:true}
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
      "Mana Strength Session Completion Ticks",
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
