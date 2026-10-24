
/* =====================================================
   MANA MOVEMENT TRAINING
   STRENGTH WORKOUT CARD POLISH
   BUILD 103530

   FULL REPLACEMENT FOR:
   mana_strength_workout_ticks_103520.js

   FIXES
   - Complete only the correct workout
   - Match saved day index and session name
   - Require 100% workout completion
   - Check current calendar week
   - Yellow tick instead of blue
   - Yellow completion text
   - Remove previous small completion badge
   - Uniform thicker premium yellow borders
   - Remove coloured card edge accents

   PRESERVES
   - Existing workout cards and layout
   - Week selection
   - Start Workout action
   - View Workout expansion
   - Workout history
   - All other programs

   No images.
   No background timers.
   No global render interception.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103530";
  const STYLE_ID = "mana-strength-ticks-103530";
  const LOG_KEY = "mana-strength-v64-logs";

  if (window.MANA_STRENGTH_TICKS_103530) {
    return;
  }

  window.MANA_STRENGTH_TICKS_103530 = true;

  const GOLD = "#F3D875";

  const $ = id => document.getElementById(id);

  function strengthOpen() {
    const title = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return (
      title === "MANA STRENGTH" &&
      $("manaV83ProgramShell")
        ?.classList.contains("open")
    );
  }

  function workoutsOpen() {
    return document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab === "program";
  }

  function getLogs() {
    try {
      const logs = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      return Array.isArray(logs)
        ? logs
        : [];

    } catch (error) {
      return [];
    }
  }

  /* =========================================
     CURRENT WEEK
     Monday 00:00 to next Monday 00:00
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

    return {start, end};
  }

  function cleanName(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /* =========================================
     CORRECT WORKOUT MATCHING
     ========================================= */

  function workoutCompleted(
    dayIndex,
    sessionName
  ) {
    const logs = getLogs();
    const week = currentWeek();

    const targetName = cleanName(
      sessionName
    );

    return logs.some(log => {
      if (!log || !log.date) {
        return false;
      }

      const date = new Date(log.date);

      if (
        !Number.isFinite(date.getTime()) ||
        date < week.start ||
        date >= week.end
      ) {
        return false;
      }

      const savedIndex = Number(
        log.dayIndex
      );

      if (
        !Number.isInteger(savedIndex) ||
        savedIndex !== dayIndex
      ) {
        return false;
      }

      const savedName = cleanName(
        log.sessionName
      );

      // Require the saved workout to match
      // this card, not merely another
      // workout completed this week.
      if (
        !savedName ||
        savedName !== targetName
      ) {
        return false;
      }

      const percentage = Number(
        log.completionPercent ?? 0
      );

      return percentage >= 100;
    });
  }

  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement(
      "style"
    );

    style.id = STYLE_ID;

    style.textContent = `

      /* ===================================
         ALL WORKOUT CARDS — YELLOW
         =================================== */

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

        outline: none !important;

        border-radius: 20px !important;

        background:
          linear-gradient(
            145deg,
            #15130d,
            #090909
          ) !important;

        box-shadow: none !important;

        box-sizing: border-box !important;
      }

      /* ===================================
         REMOVE COLOURED SIDE ACCENTS
         =================================== */

      #manaV83Content
      .mana-v85-day::before,

      #manaV83Content
      .mana-v85-day::after {

        content: none !important;

        display: none !important;

        background: none !important;

        border: none !important;

        box-shadow: none !important;
      }

      #manaV83Content
      .mana-v85-day
      .mana-v85-head {

        border-left: none !important;
        border-right: none !important;

        box-shadow: none !important;
      }

      /* ===================================
         REMOVE EXISTING COMPLETION BADGE
         =================================== */

      #manaV83Content
      .mf530-old-complete {

        display: none !important;
      }

      /* ===================================
         YELLOW COMPLETION MARK
         =================================== */

      #manaV83Content
      .mf530-complete {

        position: absolute;

        top: 16px;
        right: 16px;

        width: 116px;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        gap: 8px;

        color: ${GOLD} !important;

        text-align: center;

        pointer-events: none;

        z-index: 3;
      }

      #manaV83Content
      .mf530-complete-icon {

        width: 37px;
        height: 37px;

        display: flex;
        align-items: center;
        justify-content: center;

        color: ${GOLD} !important;
      }

      #manaV83Content
      .mf530-complete-icon svg {

        width: 37px !important;
        height: 37px !important;

        fill: none !important;

        color: ${GOLD} !important;

        stroke: ${GOLD} !important;

        stroke-width: 2.5 !important;

        stroke-linecap: round;
        stroke-linejoin: round;

        filter: none !important;
      }

      #manaV83Content
      .mf530-complete-icon svg circle,

      #manaV83Content
      .mf530-complete-icon svg path {

        fill: none !important;

        stroke: ${GOLD} !important;

        stroke-width: 2.5 !important;
      }

      #manaV83Content
      .mf530-complete-label {

        color: ${GOLD} !important;

        font-size: 10px !important;

        font-weight: 950 !important;

        line-height: 1.35 !important;

        letter-spacing: .4px !important;
      }

      /* ===================================
         PRESERVE READABLE TITLE SPACING
         =================================== */

      #manaV83Content
      .mana-v85-day.mf530-done
      .mana-v85-top {

        padding-right: 121px;

        box-sizing: border-box;
      }

      #manaV83Content
      .mana-v85-day.mf530-done
      .mana-v85-count {

        display: none !important;
      }

      /* ===================================
         MOBILE
         =================================== */

      @media (max-width:480px) {

        #manaV83Content
        .mf530-complete {

          width: 88px;

          top: 14px;
          right: 12px;

          gap: 5px;
        }

        #manaV83Content
        .mf530-complete-icon,

        #manaV83Content
        .mf530-complete-icon svg {

          width: 31px !important;
          height: 31px !important;
        }

        #manaV83Content
        .mf530-complete-label {

          font-size: 9px !important;

          line-height: 1.3 !important;

          letter-spacing: .1px !important;
        }

        #manaV83Content
        .mana-v85-day.mf530-done
        .mana-v85-top {

          padding-right: 94px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     IDENTIFY ORIGINAL BADGE
     ========================================= */

  function hideOldBadge(card) {
    const nodes = card.querySelectorAll(
      "span, small, strong, div"
    );

    nodes.forEach(node => {
      if (
        node.closest(".mf530-complete")
      ) {
        return;
      }

      const text = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      if (
        /^(?:✓|✔|☑)?\s*COMPLETED THIS WEEK$/i
        .test(text)
      ) {
        node.classList.add(
          "mf530-old-complete"
        );
      }
    });
  }

  /* =========================================
     CREATE YELLOW TICK
     ========================================= */

  function makeTick() {
    const mark = document.createElement(
      "div"
    );

    mark.className = "mf530-complete";

    mark.setAttribute(
      "role",
      "img"
    );

    mark.setAttribute(
      "aria-label",
      "Workout complete this week"
    );

    mark.innerHTML = `

      <span class="mf530-complete-icon">

        <svg
          viewBox="0 0 36 36"
          aria-hidden="true"
        >

          <circle
            cx="18"
            cy="18"
            r="15"
          />

          <path
            d="M10.5 18.5 L15.5 23.5 L25.5 12.5"
          />

        </svg>

      </span>

      <span class="mf530-complete-label">
        WORKOUT COMPLETE<br>
        THIS WEEK
      </span>

    `;

    return mark;
  }

  /* =========================================
     DECORATE EXACT WORKOUT
     ========================================= */

  function decorateCard(card, index) {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    // Hide the existing weekly completion
    // badge without using it to determine
    // whether this workout was completed.

    hideOldBadge(card);

    // Remove any mark from previous builds
    // if one exists in this same card.

    card.querySelectorAll(
      ".mf520-complete, .mf510-right"
    ).forEach(node => node.remove());

    const name = (
      card.querySelector(
        ".mana-v85-title"
      )?.textContent || ""
    ).trim();

    const completed = workoutCompleted(
      index,
      name
    );

    let mark = card.querySelector(
      ".mf530-complete"
    );

    if (completed) {
      card.classList.add(
        "mf530-done"
      );

      if (!mark) {
        mark = makeTick();
        card.appendChild(mark);
      }

    } else {
      card.classList.remove(
        "mf530-done"
      );

      mark?.remove();
    }
  }

  function decorateCards() {
    if (
      !strengthOpen() ||
      !workoutsOpen()
    ) {
      return;
    }

    document.querySelectorAll(
      "#manaV83Content .mana-v85-day"
    ).forEach(
      (card, index) => {
        decorateCard(card, index);
      }
    );
  }

  /* =========================================
     LIGHTWEIGHT REFRESH
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

        if (
          event.target.closest(
            "#manaV83Tabs, " +
            ".mana-v85-day"
          )
        ) {
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
      "Mana Strength Workout Cards",
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
