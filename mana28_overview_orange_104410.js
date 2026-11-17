
/* ============================================================
   MANA MOVEMENT — MANA28 OVERVIEW
   BUILD 104411

   COMPLETE REPLACEMENT:
   mana28_overview_orange_104410.js

   ADDED
   - Full-width Coach Chat card
   - Same teal styling as Mana Strength
   - Opens existing shared client conversation
   - Reuses existing Supabase chat functionality

   PRESERVED
   - Four Mana28 Overview tiles
   - Original navigation handlers
   - 28-day completion and progress bar
   - Mobile two-column layout
   - Fuel, Workouts and Progress
   - Mana Strength and ManaLyfe screens
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104411";

  const STYLE_ID =
    "mana28-overview-orange-104411-style";

  const BAR_ID =
    "mana28-overview-orange-104410-progress";

  const CHAT_ID =
    "mana28OverviewCoachChat104411";

  const PROGRAM_KEY =
    "mana-v973-mana28-state";

  const TOTAL_DAYS = 28;

  if (
    window.MANA28_OVERVIEW_ORANGE_BUILD === BUILD
  ) {
    return;
  }

  window.MANA28_OVERVIEW_ORANGE_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function isMana28Overview() {
    const shell = $("manaV83ProgramShell");

    const title = String(
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    const selected =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )?.dataset?.v83Tab;

    return Boolean(
      shell?.classList.contains("open") &&
      /^MANA\s*28\b/.test(title) &&
      selected === "overview"
    );
  }

  /* ========================================
     REAL MANA28 COMPLETION DATA
     ======================================== */

  function progressData() {
    let state = {};

    try {
      state = JSON.parse(
        localStorage.getItem(PROGRAM_KEY) || "{}"
      ) || {};
    } catch (_) {
      state = {};
    }

    const raw = Array.isArray(state.completed)
      ? state.completed
      : [];

    const completedDays = [
      ...new Set(
        raw
          .map(Number)
          .filter(
            day =>
              Number.isInteger(day) &&
              day >= 1 &&
              day <= TOTAL_DAYS
          )
      )
    ];

    const count = completedDays.length;

    const percentage = Math.round(
      count / TOTAL_DAYS * 100
    );

    const day = count === 0
      ? 1
      : Math.max(...completedDays);

    return {
      count,
      percentage,
      day
    };
  }

  /* ========================================
     STYLES — MANA28 OVERVIEW ONLY
     ======================================== */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* Existing Mana28 Overview tile grid */

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-grid {
        display:grid!important;
        grid-template-columns:
          repeat(2,minmax(0,1fr))!important;
        gap:12px!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-launch {
        min-width:0!important;
        min-height:150px!important;
        padding:15px 12px!important;

        display:flex!important;
        flex-direction:column!important;
        align-items:flex-start!important;
        gap:9px!important;

        background:#15171A!important;
        background-image:none!important;

        border:1px solid #4C5157!important;
        border-radius:17px!important;

        box-shadow:none!important;
        color:#FFFFFF!important;
        text-align:left!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-launch::before {
        background:linear-gradient(
          90deg,
          transparent,
          #FF7927,
          transparent
        )!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-icon {
        width:43px!important;
        height:43px!important;
        flex:0 0 43px!important;

        border-radius:12px!important;
        border:1px solid #FF7927!important;

        background:rgba(
          255,121,39,.12
        )!important;

        color:#FF9A58!important;
        -webkit-text-fill-color:#FF9A58!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-copy {
        width:100%!important;
        min-width:0!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:10px!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-title {
        margin-top:5px!important;

        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;

        font-size:clamp(
          16px,4vw,21px
        )!important;

        line-height:1.16!important;
        overflow-wrap:anywhere;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-text {
        display:none!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-arrow {
        margin-top:8px!important;

        color:#FF9A58!important;
        -webkit-text-fill-color:#FF9A58!important;

        font-size:10px!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-intro {
        border-color:#343A42!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-intro::after {
        background:#FF7927!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-kicker {
        color:#FF9A58!important;
        -webkit-text-fill-color:#FF9A58!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-intro h2 {
        color:#FFFFFF!important;
      }

      #manaV83Content
      .mana28-orange-overview
      .mana-v978-intro p {
        color:#BFC5CD!important;
      }

      /* ===================================
         COACH CHAT
         Same premium teal design
         as Mana Strength Overview
         =================================== */

      #manaV83Content
      .mana28-orange-overview
      #${CHAT_ID} {
        display:flex!important;
        flex-direction:row!important;
        align-items:center!important;

        gap:16px!important;

        width:100%!important;
        min-width:0!important;
        min-height:110px!important;

        margin:14px 0 0!important;
        padding:17px 20px!important;

        border:1px solid #20CDD4!important;
        border-radius:20px!important;

        background:#102024!important;
        background-image:none!important;
        box-shadow:none!important;

        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;

        text-align:left!important;
        cursor:pointer!important;
        box-sizing:border-box!important;
      }

      #${CHAT_ID} .mana28-chat-icon {
        display:grid!important;
        place-items:center!important;

        width:54px!important;
        height:54px!important;
        flex:0 0 54px!important;

        border:1px solid #20CDD4!important;
        border-radius:15px!important;

        color:#20CDD4!important;
        font:900 26px/1 system-ui,sans-serif!important;
      }

      #${CHAT_ID} .mana28-chat-copy {
        display:flex!important;
        flex-direction:column!important;

        flex:1!important;
        min-width:0!important;
        gap:4px!important;
      }

      #${CHAT_ID} .mana28-chat-label {
        color:#20CDD4!important;
        font:900 11px/1.2
          system-ui,sans-serif!important;

        letter-spacing:.13em!important;
      }

      #${CHAT_ID} .mana28-chat-title {
        color:#FFFFFF!important;
        font:900 22px/1.15
          system-ui,sans-serif!important;
      }

      #${CHAT_ID} .mana28-chat-description {
        color:#C1C6CE!important;
        font:500 13px/1.45
          system-ui,sans-serif!important;
      }

      #${CHAT_ID} .mana28-chat-arrow {
        margin-left:auto!important;

        color:#20CDD4!important;
        font:900 25px/1
          system-ui,sans-serif!important;
      }

      #${CHAT_ID}:focus-visible {
        outline:2px solid #20CDD4!important;
        outline-offset:3px!important;
      }

      /* ===================================
         EXISTING 28-DAY PROGRESS CARD
         =================================== */

      #${BAR_ID} {
        box-sizing:border-box;
        width:100%;

        margin:16px 0 8px;
        padding:17px 18px;

        border-radius:18px;
        background:#15171A;
        border:1px solid #4C5157;

        box-shadow:0 10px 24px
          rgba(0,0,0,.15);

        color:#FFFFFF;
      }

      #${BAR_ID} .mana28-progress-top {
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:14px;
      }

      #${BAR_ID} .mana28-progress-eyebrow {
        display:block;

        font-size:11px;
        font-weight:850;
        letter-spacing:.11em;

        color:#C1C6CE;
      }

      #${BAR_ID} .mana28-progress-day {
        display:block;
        margin-top:5px;

        font-size:19px;
        line-height:1.2;
        font-weight:850;
      }

      #${BAR_ID} .mana28-progress-percent {
        color:#FF892F;

        font-size:26px;
        font-weight:900;
        line-height:1;

        font-variant-numeric:tabular-nums;
      }

      #${BAR_ID} .mana28-progress-track {
        height:10px;
        width:100%;

        margin-top:16px;

        border-radius:999px;
        background:#383C42;

        overflow:hidden;
      }

      #${BAR_ID} .mana28-progress-fill {
        height:100%;
        width:0%;

        border-radius:inherit;

        background:linear-gradient(
          90deg,
          #F46A20,
          #FF9A45
        );

        transition:width .24s ease-out;
      }

      #${BAR_ID} .mana28-progress-foot {
        display:flex;
        justify-content:space-between;
        flex-wrap:wrap;

        gap:8px;
        margin-top:10px;

        font-size:11px;
        color:#C1C6CE;
      }

      /* ===================================
         MOBILE
         =================================== */

      @media(max-width:430px) {
        #manaV83Content
        .mana28-orange-overview
        .mana-v978-grid {
          gap:9px!important;
        }

        #manaV83Content
        .mana28-orange-overview
        .mana-v978-launch {
          min-height:131px!important;
          padding:12px 10px!important;
        }

        #manaV83Content
        .mana28-orange-overview
        .mana-v978-icon {
          width:38px!important;
          height:38px!important;
          flex-basis:38px!important;
        }

        #manaV83Content
        .mana28-orange-overview
        #${CHAT_ID} {
          padding:14px!important;
          gap:11px!important;
          min-height:100px!important;
        }

        #${CHAT_ID} .mana28-chat-icon {
          width:43px!important;
          height:43px!important;
          flex-basis:43px!important;
          font-size:23px!important;
        }

        #${CHAT_ID} .mana28-chat-title {
          font-size:19px!important;
        }

        #${CHAT_ID} .mana28-chat-description {
          font-size:11px!important;
        }

        #${BAR_ID} {
          padding:15px;
        }

        #${BAR_ID} .mana28-progress-day {
          font-size:17px;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        #${BAR_ID} .mana28-progress-fill {
          transition:none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ========================================
     PROGRESS CARD
     ======================================== */

  function createProgressCard() {
    const section = document.createElement(
      "section"
    );

    section.id = BAR_ID;

    section.setAttribute(
      "aria-label",
      "Mana28 challenge completion"
    );

    section.innerHTML = `
      <div class="mana28-progress-top">
        <div>
          <span class="mana28-progress-eyebrow">
            YOUR 28-DAY PROGRESS
          </span>

          <strong
            class="mana28-progress-day"
            data-m28-day
          >
            Day 1 of 28
          </strong>
        </div>

        <strong
          class="mana28-progress-percent"
          data-m28-pct
        >
          0%
        </strong>
      </div>

      <div
        class="mana28-progress-track"
        role="progressbar"
        aria-label="Completed Mana28 program days"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <div
          class="mana28-progress-fill"
          data-m28-fill
        ></div>
      </div>

      <div class="mana28-progress-foot">
        <span data-m28-count>
          0 of 28 days completed
        </span>

        <span>
          MOVE WITH PURPOSE
        </span>
      </div>
    `;

    return section;
  }

  function updateProgress(card) {
    const {
      count,
      percentage,
      day
    } = progressData();

    const setText = (selector, value) => {
      const element = card.querySelector(selector);

      if (
        element &&
        element.textContent !== value
      ) {
        element.textContent = value;
      }
    };

    setText(
      "[data-m28-day]",
      `Day ${day} of 28`
    );

    setText(
      "[data-m28-pct]",
      `${percentage}%`
    );

    setText(
      "[data-m28-count]",
      `${count} of 28 days completed`
    );

    const bar = card.querySelector(
      '[role="progressbar"]'
    );

    if (
      bar &&
      bar.getAttribute("aria-valuenow") !==
        String(percentage)
    ) {
      bar.setAttribute(
        "aria-valuenow",
        String(percentage)
      );
    }

    const fill = card.querySelector(
      "[data-m28-fill]"
    );

    if (
      fill &&
      fill.style.width !==
        `${percentage}%`
    ) {
      fill.style.width = `${percentage}%`;
    }
  }

  /* ========================================
     COACH CHAT
     ======================================== */

  function createChatCard() {
    const button = document.createElement(
      "button"
    );

    button.id = CHAT_ID;
    button.type = "button";

    button.setAttribute(
      "aria-label",
      "Open Coach Chat"
    );

    button.innerHTML = `
      <span
        class="mana28-chat-icon"
        aria-hidden="true"
      >☏</span>

      <span class="mana28-chat-copy">
        <span class="mana28-chat-label">
          COACHING
        </span>

        <span class="mana28-chat-title">
          Chat
        </span>

        <span class="mana28-chat-description">
          Message your coach, ask questions
          and get ongoing support.
        </span>
      </span>

      <span
        class="mana28-chat-arrow"
        aria-hidden="true"
      >›</span>
    `;

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        if (
          typeof window.openManaStrengthClientChat ===
          "function"
        ) {
          window.openManaStrengthClientChat();
        } else {
          console.warn(
            "[Mana28] Coach Chat unavailable."
          );

          window.alert(
            "Coach Chat is not available. Please reload and try again."
          );
        }
      }
    );

    return button;
  }

  /* ========================================
     OVERVIEW REFRESH

     Four tiles remain unchanged.
     Chat and Progress sit below grid.
     ======================================== */

  function refresh() {
    if (!isMana28Overview()) return;

    const holder = $("manaV83Content");

    const launchpad = holder?.querySelector(
      ".mana-v978-launchpad"
    );

    const grid = launchpad?.querySelector(
      ".mana-v978-grid"
    );

    if (!launchpad || !grid) return;

    launchpad.classList.add(
      "mana28-orange-overview"
    );

    let chat = launchpad.querySelector(
      `#${CHAT_ID}`
    );

    if (!chat) {
      chat = createChatCard();

      grid.insertAdjacentElement(
        "afterend",
        chat
      );
    }

    let progress = launchpad.querySelector(
      `#${BAR_ID}`
    );

    if (!progress) {
      progress = createProgressCard();
    }

    /* Keep one of each card and place the
       28-day progress directly below Chat. */

    if (
      progress.previousElementSibling !== chat
    ) {
      chat.insertAdjacentElement(
        "afterend",
        progress
      );
    }

    updateProgress(progress);
  }

  /* ========================================
     INITIALISE
     ======================================== */

  let refreshTimer = null;

  function refreshSoon() {
    if (refreshTimer !== null) return;

    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      refresh();
    }, 90);
  }

  function init() {
    installStyles();
    refreshSoon();

    const holder = $("manaV83Content");

    if (
      holder &&
      window.MutationObserver
    ) {
      const observer =
        new MutationObserver(refreshSoon);

      /* Existing Mana28 rendering hook.
         Does not observe text/style mutations. */

      observer.observe(holder, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (
          event.target.closest(
            "#manaV83Tabs," +
            "#manaV80Mana28," +
            "#manaV83Content"
          )
        ) {
          refreshSoon();
        }
      },
      true
    );

    window.addEventListener(
      "storage",
      event => {
        if (event.key === PROGRAM_KEY) {
          refreshSoon();
        }
      }
    );

    window.addEventListener(
      "mana:program-tab-change",
      refreshSoon
    );

    window.MANA28_OVERVIEW_ORANGE_BUILD = BUILD;

    console.log(
      "[Mana28 Overview] Coach Chat + Progress " +
      BUILD
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
