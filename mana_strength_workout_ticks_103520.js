
/* =====================================================
   MANA MOVEMENT TRAINING
   STRENGTH WORKOUT CARDS — BUILD 103550

   COMPLETE FILE REPLACEMENT
   mana_strength_workout_ticks_103520.js

   - Premium yellow workout card borders
   - Correct weekly completion ticks
   - Yellow tick and completion label
   - Old completion badge hidden
   - No exercise grid or row borders
   - Yellow exercise number pills
   - White exercise text
   - Improved exercise spacing and alignment
   - Subtle hover, no animation loops
   - No changes to saved workout data
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103550";
  const STYLE_ID = "mana-strength-card-style-103550";
  const LOG_KEY = "mana-strength-v64-logs";

  if (window.MANA_STRENGTH_CARDS_103550) return;
  window.MANA_STRENGTH_CARDS_103550 = true;

  const GOLD = "#F3D875";
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

  function readLogs() {
    try {
      const logs = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );
      return Array.isArray(logs) ? logs : [];
    } catch {
      return [];
    }
  }

  function currentWeek() {
    const now = new Date();
    const day = (now.getDay() + 6) % 7;

    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - day
    );

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return { start, end };
  }

  function cleanName(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function completedThisWeek(index, name) {
    const { start, end } = currentWeek();
    const targetName = cleanName(name);

    return readLogs().some(log => {
      if (!log?.date) return false;

      const date = new Date(log.date);

      if (
        !Number.isFinite(date.getTime()) ||
        date < start ||
        date >= end
      ) return false;

      if (Number(log.dayIndex) !== index) {
        return false;
      }

      if (
        cleanName(log.sessionName) !== targetName
      ) return false;

      return Number(
        log.completionPercent ?? 0
      ) >= 100;
    });
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =====================================
         MAIN WORKOUT CARDS
         ===================================== */

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

      /* =====================================
         REMOVE OLD COMPLETION INDICATOR
         ===================================== */

      #manaV83Content .mf550-old-badge {
        display: none !important;
      }

      /* =====================================
         TOP-RIGHT YELLOW COMPLETION TICK
         ===================================== */

      #manaV83Content .mf550-complete {
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

      #manaV83Content .mf550-complete svg {
        width: 37px;
        height: 37px;
        fill: none !important;
        stroke: ${GOLD} !important;
        stroke-width: 2.4;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #manaV83Content .mf550-complete-label {
        color: ${GOLD} !important;
        font-size: 10px !important;
        line-height: 1.3 !important;
        font-weight: 950 !important;
        letter-spacing: .35px !important;
      }

      #manaV83Content
      .mana-v85-day.mf550-done
      .mana-v85-top {
        padding-right: 121px !important;
        box-sizing: border-box;
      }

      #manaV83Content
      .mana-v85-day.mf550-done
      .mana-v85-count {
        display: none !important;
      }

      /* =====================================
         EXPANDED EXERCISE LIST
         REMOVE OUTER BOX
         ===================================== */

      #manaV83Content
      .mana-v85-day.mana-v964-expanded
      .mana-v85-exercises {
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
        padding: 6px 18px 20px !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }

      /* =====================================
         EXERCISE ROWS — NO GRID LINES
         ===================================== */

      #manaV83Content
      .mana-v85-day.mana-v964-expanded
      .mana-v85-exercise {
        display: flex !important;
        align-items: center !important;
        gap: 14px !important;
        min-height: 43px !important;
        margin: 0 !important;
        padding: 10px 12px !important;
        border: none !important;
        border-top: none !important;
        border-bottom: none !important;
        border-radius: 10px !important;
        background: transparent !important;
        box-shadow: none !important;
        color: #fff !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        box-sizing: border-box !important;
      }

      #manaV83Content
      .mana-v85-day.mana-v964-expanded
      .mana-v85-exercise > span:last-child {
        color: #fff !important;
        flex: 1;
        min-width: 0;
        overflow-wrap: anywhere;
      }

      /* =====================================
         YELLOW NUMBER PILLS
         ===================================== */

      #manaV83Content
      .mana-v85-day.mana-v964-expanded
      .mana-v85-num {
        display: grid !important;
        place-items: center !important;
        flex: 0 0 29px !important;
        width: 29px !important;
        height: 29px !important;
        border: 1.5px solid ${GOLD} !important;
        border-radius: 10px !important;
        background:
          rgba(243,216,117,.06) !important;
        color: ${GOLD} !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        box-shadow: none !important;
      }

      /* =====================================
         DESKTOP HOVER — SUBTLE
         ===================================== */

      @media (hover:hover) and (pointer:fine) {
        #manaV83Content
        .mana-v85-day.mana-v964-expanded
        .mana-v85-exercise:hover {
          background:
            rgba(243,216,117,.055) !important;
        }
      }

      /* =====================================
         MOBILE SPACING
         ===================================== */

      @media (max-width:480px) {

        #manaV83Content .mf550-complete {
          top: 13px;
          right: 12px;
          width: 90px;
          gap: 5px;
        }

        #manaV83Content .mf550-complete svg {
          width: 31px;
          height: 31px;
        }

        #manaV83Content .mf550-complete-label {
          font-size: 9px !important;
          letter-spacing: .1px !important;
        }

        #manaV83Content
        .mana-v85-day.mf550-done
        .mana-v85-top {
          padding-right: 96px !important;
        }

        #manaV83Content
        .mana-v85-day.mana-v964-expanded
        .mana-v85-exercises {
          padding: 5px 10px 17px !important;
        }

        #manaV83Content
        .mana-v85-day.mana-v964-expanded
        .mana-v85-exercise {
          gap: 11px !important;
          padding: 10px 8px !important;
          min-height: 43px !important;
        }
      }

      @media (prefers-reduced-motion:reduce) {
        #manaV83Content .mana-v85-exercise {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function hideOldBadge(card) {
    card.querySelectorAll(
      "span,small,strong,div"
    ).forEach(node => {
      if (node.closest(".mf550-complete")) return;

      const text = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      if (
        /^(?:✓|✔|☑)?\s*COMPLETED THIS WEEK$/i
          .test(text)
      ) {
        node.classList.add("mf550-old-badge");
      }
    });
  }

  function makeTick() {
    const mark = document.createElement("div");
    mark.className = "mf550-complete";

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
        <path d="M10.5 18.5 L15.5 23.5 L25.5 12.5"/>
      </svg>

      <span class="mf550-complete-label">
        WORKOUT COMPLETE<br>
        THIS WEEK
      </span>
    `;

    return mark;
  }

  function decorateCard(card, index) {
    if (!(card instanceof HTMLElement)) return;

    hideOldBadge(card);

    // Retire any marks from earlier builds.
    card.querySelectorAll(
      ".mf520-complete, .mf530-complete, " +
      ".mf540-complete, .mf510-right"
    ).forEach(node => node.remove());

    const name = (
      card.querySelector(
        ".mana-v85-title"
      )?.textContent || ""
    ).trim();

    const done = completedThisWeek(index, name);

    const existing = card.querySelector(
      ".mf550-complete"
    );

    card.classList.toggle(
      "mf550-done",
      done
    );

    if (done && !existing) {
      card.appendChild(makeTick());
    } else if (!done && existing) {
      existing.remove();
    }
  }

  function decorateCards() {
    if (!strengthOpen() || !workoutsOpen()) {
      return;
    }

    document.querySelectorAll(
      "#manaV83Content .mana-v85-day"
    ).forEach((card,index) => {
      decorateCard(card,index);
    });
  }

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
        { childList: true }
      );
    }

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(
        "#manaV83Tabs, .mana-v85-day"
      )) {
        refresh();
      }
    });

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
      "Mana Strength Workout Card Polish",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once:true }
    );
  } else {
    init();
  }

})();
