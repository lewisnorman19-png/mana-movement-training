
/*
 MANA MOVEMENT — COACH WORKOUTS
 BUILD 100210

 COMPLETE FILE REPLACEMENT
 v10_02_client_custom_programs_100200.js

 - One exercise per carousel page
 - No extra workout heading above exercise cards
 - Previous / Next navigation only beneath carousel
 - Complete Workout inside final carousel page
 - Automatic cloud saving retained
 - Repeat weight across exercise sets
 - Tick All Sets and Tick All Workout
 - Cardio / Core finishers
 - Workout rating 1–5 and comments
 - Original muscle images and demonstrations
 - Generated workouts remain separate
*/

(() => {
  "use strict";

  const BUILD = "100210";
  const SWITCH = "manaV1002WorkoutSwitch";
  const PANEL = "manaV1002CoachPanel";
  const LEGACY = "manaV1002AssignedPrograms";
  const MODAL = "manaV1002CustomProgramModal";
  const STYLE = "mana-v1002-client-custom-style";
  const MODE_KEY = "mana-strength-workout-view-100205";

  const $ = id => document.getElementById(id);

  const esc = value => String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character])
  );

  let mode = "generated";
  let assignments = [];
  let account = "";
  let loadedAt = 0;
  let loading = false;
  let loadingSerial = 0;

  let programData = null;
  let selected = null;
  let week = 1;
  let session = null;
  let serial = 0;
  let slide = 0;

  let saveTimer = null;
  let saveChain = Promise.resolve();
  let elapsedBase = 0;
  let startedAt = 0;
  let clockTimer = null;
  let scrollTimer = null;
  let navTimer = null;

  let finishers = {};
  let cardioEquipment = "Bike";
  let cardioMinutes = 10;
  let coreRound = 0;
  let coreTicks = [[], [], []];
  let rating = 0;
  let comment = "";

  const CORE_ROUTINES = [
    [
      ["Dead Bug", "10 per side"],
      ["Plank", "30 seconds"],
      ["Crunch", "15 reps"]
    ],
    [
      ["Bird Dog", "10 per side"],
      ["Side Plank", "30 seconds per side"],
      ["Russian Twist", "20 total"]
    ],
    [
      ["Reverse Crunch", "15 reps"],
      ["Plank Shoulder Tap", "20 total"],
      ["Mountain Climber", "30 seconds"]
    ],
    [
      ["Bicycle Crunch", "20 total"],
      ["Dead Bug", "10 per side"],
      ["Hollow Hold", "20 seconds"]
    ]
  ];

  async function db() {
    if (typeof window.supabaseClient !== "function") {
      throw Error("Cloud connection unavailable");
    }

    return await window.supabaseClient();
  }

  function workoutTabOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()?.toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab].active'
      )?.dataset.v83Tab === "program"
    );
  }

  function legacyOpen() {
    const view = $("clientProgramsView");

    return !!(
      view &&
      !view.classList.contains("hide")
    );
  }

  function clockSeconds() {
    return elapsedBase + (
      startedAt
        ? Math.floor((Date.now() - startedAt) / 1000)
        : 0
    );
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));

    return String(Math.floor(value / 60)).padStart(2, "0") +
      ":" +
      String(value % 60).padStart(2, "0");
  }

  function stopClock() {
    if (clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }

    if (startedAt) {
      elapsedBase = clockSeconds();
      startedAt = 0;
    }
  }

  function startClock() {
    if (!startedAt) startedAt = Date.now();

    if (clockTimer) clearInterval(clockTimer);

    clockTimer = setInterval(() => {
      const timer = $("m1002Time");

      if (timer) {
        timer.textContent = formatTime(clockSeconds());
      }
    }, 1000);
  }

  function dumbbellIcon() {
    return `
      <svg viewBox="0 0 24 24"
        width="26" height="26"
        fill="none" stroke="#ff8126"
        stroke-width="2"
        stroke-linecap="round">
        <path d="M3 9v6M6 6v12M9 10v4M15 10v4M18 6v12M21 9v6M9 12h6"/>
      </svg>
    `;
  }

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${SWITCH} {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:7px;
        padding:6px;
        margin:12px 0 15px;
        background:#101113;
        border:1px solid #30343a;
        border-radius:15px;
      }

      #${SWITCH} button {
        width:100%;
        min-width:0;
        min-height:46px;
        padding:10px 7px;
        background:#191b1f;
        color:#d3d6db;
        border:1px solid transparent;
        border-radius:11px;
        font-family:inherit;
        font-size:12px;
        font-weight:800;
        cursor:pointer;
      }

      #${SWITCH} button.active {
        background:#251b15;
        color:#ff8126;
        border-color:#ff8126;
      }

      #manaV83Content.m1002-coach-mode
      >:not(#${SWITCH}):not(#${PANEL}) {
        display:none!important;
      }

      #manaV83Content.m1002-coach-mode
      >#${SWITCH} {
        display:grid!important;
      }

      #${PANEL} {
        display:none;
        margin-bottom:16px;
      }

      #manaV83Content.m1002-coach-mode
      >#${PANEL} {
        display:block!important;
      }

      #${PANEL} .m1002-shell {
        background:#101113!important;
        border:1px solid #34383e!important;
        border-radius:17px;
        overflow:hidden;
        color:#fff;
      }

      #${PANEL} .m1002-panel-head {
        padding:18px;
        background:#121315;
        border-bottom:1px solid #292d32;
      }

      #${PANEL} .m1002-panel-head small,
      #${MODAL} .m1002-kicker {
        color:#ff8126!important;
        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
      }

      #${PANEL} .m1002-panel-head h3 {
        color:#fff!important;
        font-size:20px;
        margin:5px 0;
      }

      #${PANEL} .m1002-panel-head p {
        margin:0;
        color:#adb4bd;
        font-size:12px;
        line-height:1.5;
      }

      #${PANEL} .m1002-panel-body {
        padding:14px;
      }

      .m1002-program {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        width:100%;
        padding:16px;
        margin-bottom:10px;
        border:1px solid #3b4047!important;
        border-radius:14px;
        background:#17191c!important;
        color:#fff!important;
        text-align:left;
        font-family:inherit;
        cursor:pointer;
      }

      .m1002-program strong {
        display:block;
        color:#fff!important;
        font-size:15px;
      }

      .m1002-program small {
        display:block;
        margin-top:5px;
        color:#b4bac2!important;
        font-size:12px;
        line-height:1.5;
      }

      .m1002-pill {
        flex:0 0 auto;
        color:#ff8126;
        border:1px solid #794521;
        padding:6px 9px;
        border-radius:20px;
        font-size:10px;
        font-weight:900;
      }

      .m1002-empty {
        text-align:center;
        border:1px solid #353940;
        background:#17191c;
        border-radius:15px;
        padding:22px 15px;
        color:#b8bec6;
      }

      .m1002-empty-icon {
        display:grid;
        place-items:center;
        margin:0 auto 12px;
        width:50px;
        height:50px;
        border-radius:50%;
        background:#261c16;
        border:1px solid #704223;
      }

      .m1002-empty h4 {
        color:#fff!important;
        font-size:18px;
        margin:0 0 9px;
      }

      .m1002-empty p {
        color:#b8bec6;
        font-size:12px;
        line-height:1.6;
        margin:0;
      }

      .m1002-empty p:last-child {
        color:#ff8126;
        margin-top:12px;
      }

      #${LEGACY} {
        margin:12px 0;
      }

      #${MODAL} {
        position:fixed;
        inset:0;
        display:none;
        overflow-y:auto;
        overscroll-behavior:contain;
        z-index:61000;
        background:#050505;
        color:#fff;
        padding:
          calc(12px + env(safe-area-inset-top))
          12px
          calc(36px + env(safe-area-inset-bottom));
      }

      #${MODAL}.open {
        display:block;
      }

      #${MODAL} .m1002-inner {
        width:min(680px,100%);
        margin:auto;
      }

      #${MODAL} button {
        font-family:inherit;
        cursor:pointer;
      }

      #${MODAL} .m1002-top {
        position:sticky;
        top:-12px;
        z-index:10;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:11px 0;
        background:#050505;
      }

      #${MODAL} .m1002-back,
      #${MODAL} .m1002-secondary {
        min-height:40px;
        padding:10px 12px;
        background:#191b1e;
        border:1px solid #42464d;
        border-radius:11px;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }

      #${MODAL} .m1002-hero {
        background:#111214!important;
        border:1px solid #34383e!important;
        border-radius:17px;
        padding:16px;
        margin-bottom:12px;
      }

      #${MODAL} .m1002-hero h2 {
        color:#fff!important;
        font-size:21px;
        margin:6px 0;
      }

      #${MODAL} .m1002-hero p,
      #${MODAL} .m1002-muted {
        color:#b1b8c1;
        font-size:12px;
        line-height:1.5;
        margin:6px 0;
      }

      #${MODAL} .m1002-weeks {
        display:flex;
        gap:8px;
        overflow-x:auto;
        margin-bottom:13px;
      }

      #${MODAL} .m1002-weeks button {
        flex:0 0 auto;
        background:#191b1e;
        border:1px solid #444;
        border-radius:10px;
        padding:11px 13px;
        color:#ccc;
        font-weight:800;
        font-size:12px;
      }

      #${MODAL} .m1002-weeks button.active {
        color:#ff8126;
        border-color:#ff8126;
        background:#261c16;
      }

      #${MODAL} .mana-v85-day {
        background:#121314!important;
        border:1px solid #34383e!important;
        border-radius:16px;
        padding:16px;
        margin-bottom:12px;
        color:#fff;
      }

      #${MODAL} .mana-v85-day h3 {
        color:#fff!important;
        font-size:18px;
        margin:7px 0;
      }

      #${MODAL} .m1002-day-label {
        color:#ff8126;
        font-size:11px;
        font-weight:900;
      }

      #${MODAL} .m1002-primary {
        display:block;
        width:100%;
        min-height:45px;
        background:#ff8126;
        color:#141414;
        border:0;
        border-radius:12px;
        padding:12px;
        margin-top:10px;
        font-weight:900;
        font-size:13px;
      }

      /*
       Exercise carousel
       No extra workout banner.
      */

      #${MODAL} .m1002-position {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:8px;
        margin:5px 0 8px;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }

      #${MODAL} .m1002-position small {
        color:#aab0b8;
        font-size:11px;
        font-weight:500;
      }

      #${MODAL} .m1002-dots {
        display:flex;
        justify-content:center;
        flex-wrap:wrap;
        gap:8px;
        margin:10px 0 14px;
      }

      #${MODAL} .m1002-dot {
        width:9px;
        height:9px;
        padding:0;
        border:0;
        border-radius:50%;
        background:#545960;
      }

      #${MODAL} .m1002-dot.active {
        width:24px;
        border-radius:8px;
        background:#ff8126;
      }

      #${MODAL} .m1002-dot.done {
        background:#ff8126;
        opacity:.65;
      }

      #${MODAL} .m1002-carousel {
        display:flex;
        align-items:stretch;
        overflow-x:auto;
        gap:0;
        width:100%;
        scroll-snap-type:x mandatory;
        scroll-behavior:smooth;
        overscroll-behavior-inline:contain;
        -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
      }

      #${MODAL} .m1002-carousel::-webkit-scrollbar {
        display:none;
      }

      #${MODAL} .m1002-slide {
        display:block;
        flex:0 0 100%;
        min-width:0;
        box-sizing:border-box;
        scroll-snap-align:start;
        scroll-snap-stop:always;
      }

      #${MODAL} .m1002-slide-inner {
        padding:1px;
      }

      #${MODAL} .mana-v64-card {
        padding:17px;
        margin:0;
        background:#121314!important;
        border:1px solid #34383e!important;
        border-radius:16px;
        color:#fff;
        box-shadow:none;
        min-height:350px;
      }

      #${MODAL} .mana-v64-name {
        color:#fff!important;
        font-size:18px;
        font-weight:900;
        margin-bottom:6px;
      }

      #${MODAL} .mana-v64-target {
        color:#ff8126!important;
        font-size:12px;
        line-height:1.5;
      }

      #${MODAL} .m1002-muscle {
        display:flex;
        align-items:center;
        gap:14px;
        padding:12px;
        margin:13px 0;
        border-radius:13px;
        border:1px solid #34383e;
        background:#0b0c0d;
      }

      #${MODAL} .m1002-muscle-frame {
        display:grid;
        place-items:center;
        flex:0 0 112px;
        width:112px;
        height:130px;
        background:#151618;
        border-radius:10px;
        overflow:hidden;
      }

      #${MODAL} .m1002-muscle-frame img {
        width:100%;
        height:100%;
        object-fit:contain;
      }

      #${MODAL} .m1002-muscle-fallback {
        padding:10px;
        text-align:center;
        color:#ff8126;
        font-size:11px;
        font-weight:900;
        line-height:1.4;
      }

      #${MODAL} .m1002-muscle-copy {
        flex:1;
        min-width:0;
      }

      #${MODAL} .m1002-muscle-copy small {
        color:#ff8126;
        display:block;
        font-size:10px;
        font-weight:900;
        margin-bottom:6px;
      }

      #${MODAL} .m1002-muscle-copy strong {
        color:#fff;
        font-size:13px;
        line-height:1.5;
        display:block;
      }

      #${MODAL} .m1002-demo {
        margin-top:10px;
        padding:9px 11px;
        color:#ff8126;
        background:#241b16;
        border:1px solid #714324;
        border-radius:10px;
        font-size:11px;
        font-weight:900;
      }

      #${MODAL} .m1002-note {
        color:#b9c0c9;
        font-size:12px;
        line-height:1.6;
        margin:8px 0;
      }

      #${MODAL} .mana-v64-table-head,
      #${MODAL} .mana-v64-set {
        display:grid;
        grid-template-columns:
          32px minmax(0,1fr)
          minmax(0,1fr) 45px;
        gap:7px;
        align-items:center;
        margin:8px 0;
      }

      #${MODAL} .mana-v64-table-head {
        color:#afb5bc;
        text-align:center;
        font-size:11px;
        font-weight:800;
      }

      #${MODAL} .mana-v64-set-number {
        color:#fff;
        font-size:12px;
        text-align:center;
      }

      #${MODAL} .mana-v64-set input {
        display:block;
        min-width:0;
        width:100%;
        min-height:42px;
        border:1px solid #454a50;
        border-radius:9px;
        background:#1b1d20;
        color:#fff;
        text-align:center;
        padding:7px;
        font-size:16px;
      }

      #${MODAL} .mana-v64-check {
        width:43px;
        height:42px;
        background:#23252a;
        border:1px solid #545960;
        border-radius:9px;
        color:#aaa;
        font-weight:900;
      }

      #${MODAL} .mana-v64-check.done {
        background:#ff8126;
        border-color:#ff8126;
        color:#111;
      }

      /*
       Only navigation beneath carousel
      */

      #${MODAL} .m1002-nav {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin:13px 0;
      }

      #${MODAL} .m1002-nav button {
        min-height:45px;
        background:#191b1e;
        color:#fff;
        border:1px solid #444;
        border-radius:11px;
        font-size:12px;
        font-weight:900;
      }

      #${MODAL} .m1002-nav button.next {
        background:#241b15;
        color:#ff8126;
        border-color:#ff8126;
      }

      #${MODAL} .m1002-nav button:disabled {
        opacity:.38;
        cursor:default;
      }

      #${MODAL} .m1002-actions {
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin:12px 0;
      }

      #${MODAL} .m1002-status {
        color:#b3bac4;
        font-size:12px;
        line-height:1.5;
        margin:8px 0;
      }

      #${MODAL} .m1002-status:empty {
        display:none;
      }

      #${MODAL} .m1002-finishers {
        padding:17px;
        border:1px solid #34383e;
        border-radius:16px;
        background:#121314;
      }

      #${MODAL} .m1002-finishers h3,
      #${MODAL} .m1002-feedback h3 {
        color:#fff!important;
        font-size:19px;
        margin:5px 0 8px;
      }

      #${MODAL} .m1002-finisher-pair {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
        margin:14px 0;
      }

      #${MODAL} .m1002-finisher-option {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        gap:5px;
        min-height:74px;
        padding:12px;
        border:1px solid #4a4d53;
        border-radius:13px;
        background:#191b1f;
        color:#fff;
        font-weight:900;
        font-size:13px;
      }

      #${MODAL} .m1002-finisher-option small {
        color:#aeb6bf;
        font-size:11px;
        font-weight:500;
      }

      #${MODAL} .m1002-finisher-panel,
      #${MODAL} .m1002-feedback {
        padding:13px;
        background:#17191c;
        border:1px solid #383d44;
        border-radius:13px;
        margin-top:12px;
      }

      #${MODAL} .m1002-finisher-panel h4 {
        color:#fff;
        margin:0 0 10px;
        font-size:15px;
      }

      #${MODAL} .m1002-options,
      #${MODAL} .m1002-rating {
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        margin:11px 0;
      }

      #${MODAL} .m1002-options button,
      #${MODAL} .m1002-rating button {
        padding:9px 11px;
        color:#c8ccd2;
        background:#25272a;
        border:1px solid #44484e;
        border-radius:9px;
        font-size:12px;
        font-weight:800;
      }

      #${MODAL} .m1002-options button.active,
      #${MODAL} .m1002-rating button.active {
        color:#ff8126;
        border-color:#ff8126;
        background:#2a201a;
      }

      #${MODAL} .m1002-rating button {
        flex:1;
        min-width:38px;
        font-size:16px;
      }

      #${MODAL} .m1002-feedback label {
        display:block;
        color:#fff;
        font-size:12px;
        font-weight:800;
        margin-top:12px;
      }

      #${MODAL} .m1002-feedback textarea {
        width:100%;
        min-height:90px;
        resize:vertical;
        padding:12px;
        margin-top:8px;
        color:#fff;
        background:#202226;
        border:1px solid #4a4e54;
        border-radius:10px;
        font:inherit;
        font-size:14px;
      }

      #${MODAL} .m1002-core-item {
        display:flex;
        align-items:center;
        gap:11px;
        padding:11px 0;
        border-bottom:1px solid #34383e;
        color:#fff;
        font-size:12px;
      }

      #${MODAL} .m1002-core-item input {
        width:20px;
        height:20px;
        accent-color:#ff8126;
      }

      #${MODAL} .m1002-core-item strong {
        display:block;
      }

      #${MODAL} .m1002-core-item small {
        display:block;
        margin-top:4px;
        color:#b5bdc6;
      }

      #${MODAL} .m1002-saved {
        color:#ff8126;
        font-size:12px;
        font-weight:800;
        line-height:1.6;
        margin:10px 0;
      }

      #${MODAL} .m1002-tick-all {
        display:block;
        width:100%;
        margin:14px 0 0;
        padding:11px;
        background:#261d16;
        border:1px solid #ff8126;
        border-radius:11px;
        color:#ff8126;
        font-size:12px;
        font-weight:900;
      }

      #${MODAL} .m1002-tick-all.done {
        color:#111;
        background:#ff8126;
      }

      /*
       Completion action belongs on
       final carousel page only.
      */

      #${MODAL} .m1002-final-complete {
        margin-top:17px;
      }

      #${MODAL} .m1002-final-complete:disabled {
        opacity:.55;
        cursor:default;
      }

      @media(max-width:420px) {
        #${MODAL} .mana-v64-card {
          padding:13px;
        }

        #${MODAL} .m1002-muscle {
          gap:10px;
          padding:9px;
        }

        #${MODAL} .m1002-muscle-frame {
          width:95px;
          flex-basis:95px;
          height:116px;
        }

        #${MODAL} .m1002-muscle-copy strong {
          font-size:12px;
        }

        #${PANEL} .m1002-panel-body {
          padding:11px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureModal() {
    if ($(MODAL)) return;

    const modal = document.createElement("div");
    modal.id = MODAL;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="m1002-inner">
        <div class="m1002-top">
          <span class="m1002-kicker">
            MANA STRENGTH • COACH PROGRAM
          </span>

          <button type="button"
            class="m1002-back"
            data-m1002-back>
            ← BACK
          </button>
        </div>

        <div id="m1002Content"></div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function showModal(html) {
    ensureModal();

    $(MODAL).classList.add("open");
    $("m1002Content").innerHTML = html;
  }

  function ensureRoots() {
    if (!workoutTabOpen()) return null;

    const holder = $("manaV83Content");
    if (!holder) return null;

    let selector = $(SWITCH);

    if (!selector) {
      selector = document.createElement("div");
      selector.id = SWITCH;

      selector.innerHTML = `
        <button type="button"
          data-m1002-mode="generated">
          My Workouts
        </button>

        <button type="button"
          data-m1002-mode="coach">
          Coach Programs
        </button>
      `;
    }

    if (selector.parentElement !== holder) {
      holder.prepend(selector);
    }

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;
    }

    if (panel.parentElement !== holder) {
      selector.insertAdjacentElement("afterend", panel);
    }

    return holder;
  }

  function ensureLegacy() {
    const view = $("clientProgramsView");
    if (!view) return null;

    let element = $(LEGACY);

    if (!element) {
      element = document.createElement("section");
      element.id = LEGACY;
    }

    if (!view.contains(element)) {
      view.prepend(element);
    }

    return element;
  }

  function applyMode() {
    const holder = ensureRoots();
    if (!holder) return;

    holder.classList.toggle(
      "m1002-coach-mode",
      mode === "coach"
    );

    $(SWITCH)
      ?.querySelectorAll("[data-m1002-mode]")
      .forEach(button => {
        const active =
          button.dataset.m1002Mode === mode;

        button.classList.toggle("active", active);

        button.setAttribute(
          "aria-pressed",
          String(active)
        );
      });

    if (mode === "coach") renderPanel();
  }

  function changeMode(value) {
    if (
      value !== "generated" &&
      value !== "coach"
    ) return;

    mode = value;

    try {
      sessionStorage.setItem(MODE_KEY, mode);
    } catch (_) {}

    applyMode();

    if (mode === "coach") {
      void loadAssignments(true);
    }
  }

  function programCard(assignment) {
    const program = assignment.custom_programs;

    return `
      <button type="button"
        class="m1002-program"
        data-m1002-program="${esc(program.id)}">

        <span>
          <strong>
            ${esc(program.name)}
          </strong>

          <small>
            ${esc(
              program.goal ||
              program.description ||
              "Personalised training program"
            )}
          </small>
        </span>

        <span class="m1002-pill">
          ${assignment.is_primary
            ? "PRIMARY"
            : esc(assignment.status.toUpperCase())}
        </span>
      </button>
    `;
  }

  function renderPanel() {
    const holder = $(PANEL);
    if (!holder) return;

    const list = assignments.filter(
      assignment =>
        assignment.custom_programs &&
        ["active", "paused", "completed"].includes(
          assignment.status
        )
    );

    holder.innerHTML = `
      <div class="m1002-shell">
        <div class="m1002-panel-head">
          <small>MANA STRENGTH</small>
          <h3>Coach Programs</h3>

          <p>
            Personalised training built and
            assigned by your coach.
          </p>
        </div>

        <div class="m1002-panel-body">
          ${list.length
            ? list.map(programCard).join("")
            : `
              <div class="m1002-empty">
                <div class="m1002-empty-icon">
                  ${dumbbellIcon()}
                </div>

                <h4>No Coach Programs Yet</h4>

                <p>
                  ${loading
                    ? "Checking assigned programs…"
                    : "Your coach-built programs will appear here once assigned."}
                </p>

                <p>
                  Your regular workouts remain
                  available under My Workouts.
                </p>
              </div>
            `}
        </div>
      </div>
    `;
  }

  function renderLegacy() {
    const holder = ensureLegacy();
    if (!holder) return;

    const list = assignments.filter(
      assignment => assignment.custom_programs
    );

    holder.innerHTML = list.length
      ? `
        <h3 style="color:#fff">
          Coach Assigned
        </h3>

        ${list.map(programCard).join("")}
      `
      : "";
  }

  async function loadAssignments(force = false) {
    if (loading) return;

    if (
      !force &&
      Date.now() - loadedAt < 20000
    ) return;

    loading = true;
    renderPanel();

    const token = ++loadingSerial;

    try {
      const client = await db();

      const {
        data: auth,
        error: authError
      } = await client.auth.getUser();

      if (authError) throw authError;

      const userId = auth?.user?.id || "";

      if (account !== userId) {
        account = userId;
        assignments = [];
      }

      if (!userId) return;

      const { data, error } = await client
        .from("client_program_assignments")
        .select(`
          id,
          status,
          is_primary,
          assigned_at,
          custom_programs(
            id,
            name,
            description,
            goal,
            duration_weeks,
            status
          )
        `)
        .eq("client_id", userId)
        .in("status", [
          "active",
          "paused",
          "completed"
        ])
        .order("is_primary", { ascending: false })
        .order("assigned_at", { ascending: false });

      if (error) throw error;

      const current = await client.auth.getUser();

      if (
        token !== loadingSerial ||
        current.data?.user?.id !== userId
      ) return;

      assignments = (data || []).filter(
        assignment => assignment.custom_programs
      );

      loadedAt = Date.now();

    } catch (error) {
      console.warn(
        "[Mana Coach Programs]",
        error?.message || error
      );
    } finally {
      loading = false;
      renderPanel();
      renderLegacy();
    }
  }

  function closeModal() {
    serial++;
    stopClock();

    if (session) {
      backup();
      queueSave();
    }

    session = null;
    selected = null;
    programData = null;

    $(MODAL)?.classList.remove("open");
  }

  function programHeader() {
    const program = programData?.program;

    return `
      <section class="m1002-hero">
        <span class="m1002-kicker">
          COACH-ASSIGNED PROGRAM
        </span>

        <h2>
          ${esc(program?.name || "Coach Program")}
        </h2>

        <p>
          ${esc(
            program?.description ||
            program?.goal ||
            "Your personalised training program"
          )}
        </p>
      </section>
    `;
  }

  async function openProgram(id) {
    const assignment = assignments.find(
      item => item.custom_programs?.id === id
    );

    if (!assignment) return;

    const token = ++serial;

    stopClock();
    session = null;
    selected = assignment;

    showModal(`
      <p class="m1002-status">
        Loading your coach program…
      </p>
    `);

    try {
      const client = await db();

      const { data: auth } =
        await client.auth.getUser();

      if (auth?.user?.id !== account) {
        throw Error("Sign in to view your program");
      }

      const link = await client
        .from("client_program_assignments")
        .select("id")
        .eq("client_id", account)
        .eq("program_id", id)
        .in("status", [
          "active",
          "paused",
          "completed"
        ])
        .maybeSingle();

      if (link.error) throw link.error;

      if (!link.data) {
        throw Error("Program is no longer assigned");
      }

      const [programResult, daysResult] =
        await Promise.all([
          client
            .from("custom_programs")
            .select("*")
            .eq("id", id)
            .single(),

          client
            .from("custom_program_days")
            .select("*")
            .eq("program_id", id)
            .order("week_number")
            .order("day_number")
        ]);

      if (programResult.error || daysResult.error) {
        throw programResult.error || daysResult.error;
      }

      const days = daysResult.data || [];
      let exercises = [];

      if (days.length) {
        const exerciseResult = await client
          .from("custom_program_exercises")
          .select("*")
          .in(
            "program_day_id",
            days.map(day => day.id)
          )
          .order("sort_order");

        if (exerciseResult.error) {
          throw exerciseResult.error;
        }

        exercises = exerciseResult.data || [];
      }

      if (
        token !== serial ||
        !$(MODAL)?.classList.contains("open")
      ) return;

      programData = {
        program: programResult.data,
        days,
        exercises
      };

      week = days.length
        ? Math.min(
            ...days.map(
              day => Number(day.week_number) || 1
            )
          )
        : 1;

      renderProgram();

    } catch (error) {
      if (token === serial) {
        showModal(`
          <p class="m1002-status">
            Could not load program:
            ${esc(error.message)}
          </p>
        `);
      }
    }
  }

  function renderProgram() {
    if (!programData) return;

    session = null;
    stopClock();

    const weeks = [
      ...new Set(
        programData.days.map(
          day => Number(day.week_number) || 1
        )
      )
    ].sort((a, b) => a - b);

    showModal(
      programHeader() +
      `
        <div class="m1002-weeks">
          ${weeks.map(number => `
            <button type="button"
              data-m1002-week="${number}"
              class="${number === week ? "active" : ""}">
              WEEK ${number}
            </button>
          `).join("")}
        </div>

        ${programData.days
          .filter(
            day => Number(day.week_number) === week
          )
          .map(day => {
            const exerciseCount =
              programData.exercises.filter(
                exercise =>
                  exercise.program_day_id === day.id
              ).length;

            return `
              <section class="mana-v85-day">
                <div class="m1002-day-label">
                  WEEK ${week}
                  • DAY ${esc(day.day_number)}
                </div>

                <h3>
                  ${esc(day.title || "Workout")}
                </h3>

                <p class="m1002-muted">
                  ${esc(day.workout_type || "Strength")}
                  • ${exerciseCount} exercises

                  ${day.estimated_minutes
                    ? " • " +
                      esc(day.estimated_minutes) +
                      " min"
                    : ""}
                </p>

                ${day.notes
                  ? `
                    <p class="m1002-muted">
                      ${esc(day.notes)}
                    </p>
                  `
                  : ""}

                <button type="button"
                  class="m1002-primary"
                  data-m1002-start="${esc(day.id)}">
                  START WORKOUT
                </button>
              </section>
            `;
          }).join("") ||
          `
            <p class="m1002-status">
              No workouts in this week.
            </p>
          `}
      `
    );
  }

  function visualInfo(name) {
    const api = window.MANA_EXERCISE_VISUALS;
    const info = api?.resolve?.(name) || {};
    const images = api?.muscleAssets || {};

    return {
      target: info.target || "Full Body",
      image: images[info.muscle || "fullbody"] || ""
    };
  }

  function muscleHTML(name) {
    const visual = visualInfo(name);

    return `
      <div class="m1002-muscle">
        <div class="m1002-muscle-frame">
          ${visual.image
            ? `
              <img
                src="${esc(visual.image)}"
                alt="Target muscles for ${esc(name)}"
                loading="lazy">

              <span
                class="m1002-muscle-fallback"
                hidden>
                ${esc(visual.target)}
              </span>
            `
            : `
              <span class="m1002-muscle-fallback">
                ${esc(visual.target)}
              </span>
            `}
        </div>

        <div class="m1002-muscle-copy">
          <small>PRIMARY TARGET</small>

          <strong>
            ${esc(visual.target)}
          </strong>

          <button type="button"
            class="m1002-demo"
            data-m1002-demo="${esc(name)}">
            ▶ PLAY DEMO
          </button>
        </div>
      </div>
    `;
  }

  function defaultReps(value) {
    const match = String(value || "").match(/\d+/);

    return match
      ? Math.max(1, Math.min(100, Number(match[0])))
      : 10;
  }

  function setHTML(number, set) {
    return `
      <div class="mana-v64-set" data-m1002-set>
        <span class="mana-v64-set-number">
          ${number}
        </span>

        <input
          type="number"
          min="0"
          max="1000"
          step="0.5"
          inputmode="decimal"
          placeholder="kg"
          aria-label="Set ${number} weight"
          data-m1002-weight
          value="${set.weight == null
            ? ""
            : esc(set.weight)}">

        <input
          type="number"
          min="0"
          max="500"
          step="1"
          inputmode="numeric"
          aria-label="Set ${number} reps"
          data-m1002-reps
          value="${set.reps == null
            ? ""
            : esc(set.reps)}">

        <button type="button"
          class="mana-v64-check${set.done ? " done" : ""}"
          data-m1002-tick
          aria-pressed="${!!set.done}">
          ✓
        </button>
      </div>
    `;
  }

  function exerciseHTML(exercise, prior, completed) {
    const count = Math.max(
      1,
      Math.min(20, Number(exercise.sets) || 3)
    );

    const previous = (prior || []).find(
      item =>
        item.id === exercise.id ||
        item.name === exercise.exercise_name
    );

    const sets = Array.from(
      { length: count },
      (_, index) => ({
        weight:
          previous?.sets?.[index]?.weight ?? "",

        reps:
          previous?.sets?.[index]?.reps ??
          defaultReps(exercise.reps),

        done: completed
          ? false
          : !!previous?.sets?.[index]?.done
      })
    );

    return `
      <section class="mana-v64-card"
        data-m1002-ex="${esc(exercise.id)}">

        <div class="mana-v64-name">
          ${esc(exercise.exercise_name)}
        </div>

        <div class="mana-v64-target">
          ${count} sets
          • ${esc(exercise.reps || "8–12")} reps

          ${exercise.rest_seconds != null
            ? " • " +
              esc(exercise.rest_seconds) +
              "s rest"
            : ""}
        </div>

        ${muscleHTML(exercise.exercise_name)}

        ${exercise.rpe_target
          ? `
            <p class="m1002-note">
              Target RPE:
              ${esc(exercise.rpe_target)}
            </p>
          `
          : ""}

        ${exercise.notes
          ? `
            <p class="m1002-note">
              Coach:
              ${esc(exercise.notes)}
            </p>
          `
          : ""}

        <div class="mana-v64-table-head">
          <span>Set</span>
          <span>Weight</span>
          <span>Reps</span>
          <span>Done</span>
        </div>

        <div data-m1002-sets>
          ${sets.map(
            (set, index) =>
              setHTML(index + 1, set)
          ).join("")}
        </div>

        <p class="m1002-muted">
          Entering a weight repeats it across
          this exercise. Reps can be changed
          individually.
        </p>

        <button type="button"
          class="m1002-tick-all"
          data-m1002-tick-exercise>
          TICK ALL SETS ✓
        </button>
      </section>
    `;
  }

  function coreRoutine() {
    const day = Number(
      session?.day?.day_number
    ) || 1;

    return CORE_ROUTINES[
      (day - 1) % CORE_ROUTINES.length
    ];
  }

  function finisherHTML() {
    return `
      <div class="m1002-finishers">
        <span class="m1002-kicker">
          OPTIONAL FINISHERS
        </span>

        <h3>Cardio & Core</h3>

        <p class="m1002-muted">
          Add Cardio, Core or both at the
          end of your Strength workout.
        </p>

        <div class="m1002-finisher-pair">
          <button type="button"
            class="m1002-finisher-option"
            data-m1002-finisher="cardio">
            ♥ CARDIO
            <small>10–20 minutes</small>
          </button>

          <button type="button"
            class="m1002-finisher-option"
            data-m1002-finisher="core">
            ◎ CORE
            <small>3 rounds</small>
          </button>
        </div>

        <div id="m1002FinisherPanel"></div>

        <div id="m1002FinisherSaved"
          class="m1002-saved"></div>

        <button type="button"
          class="m1002-tick-all"
          data-m1002-tick-workout>
          TICK ALL WORKOUT ✓
        </button>

        <p class="m1002-muted">
          Use Tick All when you followed
          the prescribed sets and reps.
          Cardio and Core are optional.
        </p>

        <div class="m1002-feedback">
          <span class="m1002-kicker">
            SESSION FEEDBACK
          </span>

          <h3>How was your workout?</h3>

          <label>Workout rating (1–5)</label>

          <div class="m1002-rating">
            ${[1, 2, 3, 4, 5].map(number => `
              <button type="button"
                data-m1002-rating="${number}"
                aria-pressed="${rating === number}">
                ${number}
              </button>
            `).join("")}
          </div>

          <label for="m1002WorkoutComment">
            Comments (optional)
          </label>

          <textarea
            id="m1002WorkoutComment"
            maxlength="500"
            placeholder="How did you feel? Anything to remember for next time?">${esc(comment)}</textarea>
        </div>

        <button type="button"
          class="m1002-primary m1002-final-complete"
          data-m1002-complete>
          COMPLETE WORKOUT ✓
        </button>

        <p class="m1002-muted">
          Your sets, finishers and feedback
          will be saved together.
        </p>
      </div>
    `;
  }

  function showFinisherStatus() {
    const messages = [];

    if (finishers.cardio?.completed) {
      messages.push(
        "Cardio: " +
        finishers.cardio.equipment +
        ", " +
        finishers.cardio.durationMinutes +
        " min"
      );
    }

    if (finishers.core?.completed) {
      messages.push("Core: 3 rounds");
    }

    if ($("m1002FinisherSaved")) {
      $("m1002FinisherSaved").textContent =
        messages.length
          ? "✓ Added: " + messages.join(" · ")
          : "";
    }

    refreshRatings();
  }

  function refreshRatings() {
    document.querySelectorAll(
      `#${MODAL} [data-m1002-rating]`
    ).forEach(button => {
      const active =
        Number(button.dataset.m1002Rating) === rating;

      button.classList.toggle("active", active);

      button.setAttribute(
        "aria-pressed",
        String(active)
      );
    });
  }

  function openCardio() {
    const panel = $("m1002FinisherPanel");
    if (!panel) return;

    panel.innerHTML = `
      <div class="m1002-finisher-panel">
        <h4>Cardio Finisher</h4>

        <p class="m1002-muted">
          Choose equipment and a
          10–20 minute session.
        </p>

        <div class="m1002-options">
          ${[
            "Bike",
            "Rower",
            "Treadmill",
            "Bodyweight"
          ].map(name => `
            <button type="button"
              class="${name === cardioEquipment
                ? "active"
                : ""}"
              data-m1002-cardio-equipment="${esc(name)}">
              ${esc(name)}
            </button>
          `).join("")}
        </div>

        <div class="m1002-options">
          ${[10, 15, 20].map(minutes => `
            <button type="button"
              class="${minutes === cardioMinutes
                ? "active"
                : ""}"
              data-m1002-cardio-minutes="${minutes}">
              ${minutes} MIN
            </button>
          `).join("")}
        </div>

        <p class="m1002-muted">
          Warm up for 2–3 minutes,
          complete your main effort,
          then cool down.
        </p>

        <div class="m1002-actions">
          <button type="button"
            class="m1002-secondary"
            data-m1002-finisher-close>
            CLOSE
          </button>

          <button type="button"
            class="m1002-secondary"
            data-m1002-cardio-complete>
            LOG COMPLETION ✓
          </button>
        </div>
      </div>
    `;
  }

  function openCore() {
    const panel = $("m1002FinisherPanel");
    if (!panel) return;

    const routine = coreRoutine();
    const current = coreTicks[coreRound] || [];

    panel.innerHTML = `
      <div class="m1002-finisher-panel">
        <h4>Core Finisher</h4>

        <p class="m1002-muted">
          Round ${coreRound + 1} of 3
        </p>

        <div class="m1002-options">
          ${[0, 1, 2].map(number => `
            <button type="button"
              data-m1002-core-round="${number}"
              class="${number === coreRound
                ? "active"
                : ""}">
              ROUND ${number + 1}

              ${coreTicks[number]?.length === routine.length
                ? " ✓"
                : ""}
            </button>
          `).join("")}
        </div>

        ${routine.map(([name, reps], index) => `
          <label class="m1002-core-item">
            <input type="checkbox"
              data-m1002-core-check="${index}"
              ${current.includes(index)
                ? "checked"
                : ""}>

            <span>
              <strong>${esc(name)}</strong>
              <small>${esc(reps)}</small>
            </span>
          </label>
        `).join("")}

        <div class="m1002-actions">
          <button type="button"
            class="m1002-secondary"
            data-m1002-core-tick-round>
            TICK ALL ROUND
          </button>

          <button type="button"
            class="m1002-secondary"
            data-m1002-core-tick-all>
            TICK ALL 3 ROUNDS
          </button>
        </div>

        <div class="m1002-actions">
          <button type="button"
            class="m1002-secondary"
            data-m1002-finisher-close>
            CLOSE
          </button>

          <button type="button"
            class="m1002-secondary"
            data-m1002-core-next
            ${current.length !== routine.length
              ? "disabled"
              : ""}>
            ${coreRound === 2
              ? "FINISH CORE"
              : "NEXT ROUND"}
          </button>
        </div>
      </div>
    `;
  }

  function slides() {
    return [
      ...($("m1002Carousel")
        ?.querySelectorAll(".m1002-slide") || [])
    ];
  }

  function exerciseCount() {
    return session?.exercises.length || 0;
  }

  function completeCard(index) {
    const ticks = [
      ...(slides()[index]
        ?.querySelectorAll("[data-m1002-tick]") || [])
    ];

    return !!ticks.length &&
      ticks.every(
        tick => tick.classList.contains("done")
      );
  }

  function navigate(index, smooth = true) {
    const carousel = $("m1002Carousel");
    const allSlides = slides();

    if (!carousel || !allSlides.length) return;

    slide = Math.max(
      0,
      Math.min(index, allSlides.length - 1)
    );

    carousel.scrollTo({
      left: carousel.clientWidth * slide,
      behavior: smooth ? "smooth" : "auto"
    });

    renderNavigation();
  }

  function renderNavigation() {
    const total = exerciseCount() + 1;
    const onFinal = slide === exerciseCount();

    if ($("m1002Position")) {
      $("m1002Position").textContent =
        onFinal
          ? "Optional Finishers + Feedback"
          : "Exercise " +
            (slide + 1) +
            " of " +
            exerciseCount();
    }

    if ($("m1002Dots")) {
      $("m1002Dots").innerHTML =
        Array.from(
          { length: total },
          (_, index) => `
            <button type="button"
              class="m1002-dot
                ${index === slide ? "active" : ""}
                ${index < exerciseCount() &&
                  completeCard(index)
                    ? "done"
                    : ""}"
              data-m1002-slide="${index}"
              aria-label="${index === exerciseCount()
                ? "Finishers and feedback"
                : "Exercise " + (index + 1)}">
            </button>
          `
        ).join("");
    }

    if ($("m1002Previous")) {
      $("m1002Previous").disabled =
        slide === 0;
    }

    if ($("m1002Next")) {
      $("m1002Next").disabled =
        slide === total - 1;

      $("m1002Next").textContent =
        slide === exerciseCount() - 1
          ? "FINISHERS ›"
          : "NEXT ›";
    }

    syncTickAll();
  }

  function syncTickAll() {
    slides().forEach(page => {
      const button = page.querySelector(
        "[data-m1002-tick-exercise]"
      );

      if (!button) return;

      const checks = [
        ...page.querySelectorAll("[data-m1002-tick]")
      ];

      const complete =
        !!checks.length &&
        checks.every(
          check => check.classList.contains("done")
        );

      button.classList.toggle("done", complete);

      button.textContent = complete
        ? "ALL SETS COMPLETE ✓"
        : "TICK ALL SETS ✓";
    });

    const carousel = $("m1002Carousel");

    const button = carousel?.querySelector(
      "[data-m1002-tick-workout]"
    );

    if (!button) return;

    const checks = [
      ...carousel.querySelectorAll(
        "[data-m1002-tick]"
      )
    ];

    const complete =
      !!checks.length &&
      checks.every(
        check => check.classList.contains("done")
      );

    button.classList.toggle("done", complete);

    button.textContent = complete
      ? "ALL WORKOUT SETS COMPLETE ✓"
      : "TICK ALL WORKOUT ✓";
  }

  function readSets() {
    if (!session) return [];

    return [
      ...($("m1002Carousel")
        ?.querySelectorAll("[data-m1002-ex]") || [])
    ].map(card => ({
      id: card.dataset.m1002Ex,

      name: session.exercises.find(
        exercise =>
          exercise.id === card.dataset.m1002Ex
      )?.exercise_name || "",

      sets: [
        ...card.querySelectorAll("[data-m1002-set]")
      ].map((row, index) => ({
        set: index + 1,

        weight:
          row.querySelector("[data-m1002-weight]")
            ?.value || "",

        reps: Number(
          row.querySelector("[data-m1002-reps]")
            ?.value || 0
        ),

        done: !!row
          .querySelector("[data-m1002-tick]")
          ?.classList.contains("done")
      }))
    }));
  }

  function totals(exercises = readSets()) {
    let totalSets = 0;
    let doneSets = 0;
    let volume = 0;

    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        totalSets++;

        if (set.done) {
          doneSets++;

          volume +=
            (Number(set.weight) || 0) *
            (Number(set.reps) || 0);
        }
      }
    }

    return {
      all: totalSets,
      done: doneSets,

      volume:
        Math.round(volume * 10) / 10,

      percent: totalSets
        ? Math.round(
            doneSets / totalSets * 100
          )
        : 0
    };
  }

  function backupKey() {
    return session && account
      ? "mana-coach-draft-v1:" +
        account + ":" +
        session.programId + ":" +
        session.day.id
      : "";
  }

  function backup() {
    if (!session) return;

    try {
      localStorage.setItem(
        backupKey(),
        JSON.stringify({
          updatedAt: Date.now(),
          elapsed: clockSeconds(),
          exercises: readSets(),
          finishers,
          rating,
          comment
        })
      );
    } catch (_) {}
  }

  function readBackup() {
    try {
      return JSON.parse(
        localStorage.getItem(backupKey()) ||
        "null"
      );
    } catch (_) {
      return null;
    }
  }

  function clearBackup() {
    try {
      localStorage.removeItem(backupKey());
    } catch (_) {}
  }

  function localEdit() {
    if (!session) return;

    renderNavigation();
    backup();
    scheduleSave();
  }

  function scheduleSave() {
    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      saveTimer = null;
      queueSave(false);
    }, 1000);
  }

  function queueSave(completed = false) {
    if (!session) return saveChain;

    const exercises = readSets();
    const result = totals(exercises);

    if (!session.logId) {
      session.logId = crypto.randomUUID();
    }

    const snapshot = {
      id: session.logId,
      user_id: account,
      program_id: session.programId,
      program_day_id: session.day.id,
      week_number: Number(session.day.week_number),
      day_number: Number(session.day.day_number),
      session_name: session.day.title || "Workout",

      status: completed
        ? "completed"
        : "in_progress",

      started_at: new Date(
        Date.now() - clockSeconds() * 1000
      ).toISOString(),

      completed_at: completed
        ? new Date().toISOString()
        : null,

      duration_seconds: clockSeconds(),
      exercises,
      finishers: JSON.parse(JSON.stringify(finishers)),
      workout_rating: rating || null,
      workout_comment: comment.trim() || null,
      completed_sets: result.done,
      total_sets: result.all,
      total_volume: result.volume,
      updated_at: new Date().toISOString()
    };

    const status = $("m1002SaveStatus");

    if (status && completed) {
      status.textContent =
        "Saving completed workout…";
    }

    saveChain = saveChain
      .catch(() => false)
      .then(async () => {
        const client = await db();

        const { error } = await client
          .from("coach_workout_logs")
          .upsert(snapshot, {
            onConflict: "id"
          });

        if (error) throw error;

        if (completed) {
          clearBackup();
        }

        if ($("m1002SaveStatus") && completed) {
          $("m1002SaveStatus").textContent =
            "Workout saved to Mana cloud ✓";
        }

        return true;
      })
      .catch(error => {
        if ($("m1002SaveStatus")) {
          $("m1002SaveStatus").textContent =
            "Cloud save failed — local backup kept. " +
            (error.message || error);
        }

        return false;
      });

    return saveChain;
  }

  async function openDay(dayId) {
    const day = programData?.days.find(
      item => item.id === dayId
    );

    if (!day || !account || !selected) return;

    const token = ++serial;

    stopClock();

    const exercises = programData.exercises.filter(
      exercise =>
        exercise.program_day_id === dayId
    );

    session = {
      day,
      exercises,
      programId: programData.program.id,
      logId: null
    };

    slide = 0;
    elapsedBase = 0;
    startedAt = Date.now();
    finishers = {};
    rating = 0;
    comment = "";
    coreTicks = [[], [], []];
    coreRound = 0;

    /*
     No programHeader() here.

     No separate workout title.
     No time/stats banner.

     The workout begins directly
     with carousel navigation.
    */

    showModal(`
      <div class="m1002-position">
        <span id="m1002Position">
          Exercise 1
        </span>

        <small>
          Swipe left / right
        </small>
      </div>

      <div id="m1002Dots"
        class="m1002-dots"></div>

      <div id="m1002Carousel"
        class="m1002-carousel">

        <div class="m1002-slide">
          <p class="m1002-status">
            Loading your previous sets…
          </p>
        </div>
      </div>

      <p class="m1002-status"
        id="m1002SaveStatus"></p>

      <div class="m1002-nav">
        <button type="button"
          id="m1002Previous"
          data-m1002-previous>
          ‹ PREVIOUS
        </button>

        <button type="button"
          class="next"
          id="m1002Next"
          data-m1002-next>
          NEXT ›
        </button>
      </div>
    `);

    let prior = [];
    let fromCompleted = false;

    try {
      const client = await db();

      const { data, error } = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", account)
        .eq("program_id", session.programId)
        .eq("program_day_id", dayId)
        .order("updated_at", {
          ascending: false
        })
        .limit(12);

      if (error) throw error;

      if (
        token !== serial ||
        session?.day.id !== dayId
      ) return;

      const active = (data || []).find(
        item => item.status === "in_progress"
      );

      const completed = (data || []).find(
        item => item.status === "completed"
      );

      const local = readBackup();

      if (active) {
        session.logId = active.id;

        elapsedBase =
          Number(active.duration_seconds) || 0;
      }

      fromCompleted =
        !active && !!completed;

      prior =
        active?.exercises ||
        completed?.exercises ||
        [];

      finishers = active?.finishers || {};
      rating = Number(active?.workout_rating) || 0;
      comment = active?.workout_comment || "";

      if (
        local?.exercises &&
        (
          !active ||
          Number(local.updatedAt) >
            Date.parse(active.updated_at)
        )
      ) {
        prior = local.exercises;
        finishers = local.finishers || {};
        rating = Number(local.rating) || 0;
        comment = local.comment || "";
        elapsedBase = Number(local.elapsed) || 0;
        fromCompleted = false;
      }

    } catch (error) {
      if (token !== serial) return;

      if ($("m1002SaveStatus")) {
        $("m1002SaveStatus").textContent =
          "Cloud restore unavailable. " +
          (error.message || error);
      }
    }

    if (
      token !== serial ||
      session?.day.id !== dayId
    ) return;

    $("m1002Carousel").innerHTML =
      exercises.map(exercise => `
        <div class="m1002-slide">
          <div class="m1002-slide-inner">
            ${exerciseHTML(
              exercise,
              prior,
              fromCompleted
            )}
          </div>
        </div>
      `).join("") +
      `
        <div class="m1002-slide">
          <div class="m1002-slide-inner">
            ${finisherHTML()}
          </div>
        </div>
      `;

    document.querySelectorAll(
      `#${MODAL} .m1002-muscle-frame img`
    ).forEach(image => {
      image.addEventListener(
        "error",
        () => {
          image.hidden = true;

          if (image.nextElementSibling) {
            image.nextElementSibling.hidden = false;
          }
        },
        { once: true }
      );
    });

    $("m1002Carousel").addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
          const carousel = $("m1002Carousel");

          if (!carousel?.clientWidth) return;

          slide = Math.round(
            carousel.scrollLeft /
            carousel.clientWidth
          );

          renderNavigation();
        }, 70);
      },
      { passive: true }
    );

    showFinisherStatus();
    navigate(0, false);
    startClock();
  }

  async function completeWorkout() {
    if (!session) return;

    const result = totals();

    if (!result.done) {
      if ($("m1002SaveStatus")) {
        $("m1002SaveStatus").textContent =
          "Complete at least one set first, " +
          "or use Tick All Workout.";
      }

      return;
    }

    clearTimeout(saveTimer);
    backup();

    const button = document.querySelector(
      `#${MODAL} [data-m1002-complete]`
    );

    if (button) button.disabled = true;

    const success = await queueSave(true);

    if (!success) {
      if (button) button.disabled = false;
      return;
    }

    stopClock();
    session = null;

    showModal(`
      <section class="m1002-hero">
        <span class="m1002-kicker">
          WORKOUT COMPLETE
        </span>

        <h2>
          Awesome work ✓
        </h2>

        <p>
          ${result.done}/${result.all} sets
          • ${result.volume} kg total volume
          • ${formatTime(elapsedBase)}
        </p>

        <p>
          ${rating
            ? "Rating: " + rating + "/5"
            : "No rating added"}

          ${comment
            ? " • Notes saved"
            : ""}
        </p>

        ${finishers.cardio?.completed
          ? `
            <p>
              ✓ Cardio finisher completed
            </p>
          `
          : ""}

        ${finishers.core?.completed
          ? `
            <p>
              ✓ Core finisher completed
            </p>
          `
          : ""}
      </section>

      <button type="button"
        class="m1002-primary"
        data-m1002-program-back>
        BACK TO COACH PROGRAM
      </button>
    `);

    window.dispatchEvent(
      new CustomEvent(
        "mana:coach-workout-saved",
        {
          detail: {
            programId: programData?.program?.id
          }
        }
      )
    );
  }

  function backToProgram() {
    serial++;
    stopClock();

    if (session) {
      backup();
      queueSave();
    }

    session = null;
    renderProgram();
  }

  function tickAllWithin(root) {
    const buttons = [
      ...(root?.querySelectorAll(
        "[data-m1002-tick]"
      ) || [])
    ];

    if (!buttons.length) return;

    buttons.forEach(button => {
      button.classList.add("done");

      button.setAttribute(
        "aria-pressed",
        "true"
      );
    });

    localEdit();
  }

  function handleClick(event) {
    const element = event.target;

    if (!(element instanceof Element)) return;

    let button;

    if ((button = element.closest(
      "[data-m1002-mode]"
    ))) {
      changeMode(button.dataset.m1002Mode);
      return;
    }

    if (element.closest("[data-m1002-back]")) {
      if (session) {
        backToProgram();
      } else {
        closeModal();
      }

      return;
    }

    if (element.closest(
      "[data-m1002-program-back]"
    )) {
      backToProgram();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-program]"
    ))) {
      void openProgram(
        button.dataset.m1002Program
      );
      return;
    }

    if ((button = element.closest(
      "[data-m1002-week]"
    ))) {
      week = Number(
        button.dataset.m1002Week
      );

      renderProgram();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-start]"
    ))) {
      void openDay(
        button.dataset.m1002Start
      );
      return;
    }

    if ((button = element.closest(
      "[data-m1002-demo]"
    ))) {
      const name = button.dataset.m1002Demo;
      const api = window.MANA_EXERCISE_VISUALS;
      const openDemo = api?.openDemo;

      if (typeof openDemo === "function") {
        void openDemo(name);
      } else {
        window.open(
          "https://www.youtube.com/results?search_query=" +
          encodeURIComponent(name + " technique"),
          "_blank",
          "noopener,noreferrer"
        );
      }

      return;
    }

    if (element.closest(
      "[data-m1002-previous]"
    )) {
      navigate(slide - 1);
      return;
    }

    if (element.closest(
      "[data-m1002-next]"
    )) {
      navigate(slide + 1);
      return;
    }

    if ((button = element.closest(
      "[data-m1002-slide]"
    ))) {
      navigate(
        Number(button.dataset.m1002Slide)
      );
      return;
    }

    if ((button = element.closest(
      "[data-m1002-tick]"
    ))) {
      button.classList.toggle("done");

      button.setAttribute(
        "aria-pressed",
        String(
          button.classList.contains("done")
        )
      );

      localEdit();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-tick-exercise]"
    ))) {
      tickAllWithin(
        button.closest("[data-m1002-ex]")
      );
      return;
    }

    if (element.closest(
      "[data-m1002-tick-workout]"
    )) {
      tickAllWithin(
        $("m1002Carousel")
      );
      return;
    }

    if ((button = element.closest(
      "[data-m1002-rating]"
    ))) {
      rating = Number(
        button.dataset.m1002Rating
      );

      refreshRatings();
      localEdit();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-finisher]"
    ))) {
      if (
        button.dataset.m1002Finisher === "cardio"
      ) {
        openCardio();
      } else {
        openCore();
      }

      return;
    }

    if ((button = element.closest(
      "[data-m1002-cardio-equipment]"
    ))) {
      cardioEquipment =
        button.dataset.m1002CardioEquipment;

      openCardio();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-cardio-minutes]"
    ))) {
      cardioMinutes = Number(
        button.dataset.m1002CardioMinutes
      );

      openCardio();
      return;
    }

    if (element.closest(
      "[data-m1002-cardio-complete]"
    )) {
      finishers.cardio = {
        completed: true,
        equipment: cardioEquipment,
        durationMinutes: cardioMinutes,
        actualMinutes: cardioMinutes,
        completedAt: new Date().toISOString()
      };

      $("m1002FinisherPanel").innerHTML = "";

      showFinisherStatus();
      localEdit();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-core-round]"
    ))) {
      coreRound = Number(
        button.dataset.m1002CoreRound
      );

      openCore();
      return;
    }

    if (element.closest(
      "[data-m1002-core-tick-round]"
    )) {
      coreTicks[coreRound] =
        coreRoutine().map(
          (_, index) => index
        );

      openCore();
      return;
    }

    if (element.closest(
      "[data-m1002-core-tick-all]"
    )) {
      coreTicks = [0, 1, 2].map(
        () =>
          coreRoutine().map(
            (_, index) => index
          )
      );

      openCore();
      return;
    }

    if (element.closest(
      "[data-m1002-core-next]"
    )) {
      const count = coreRoutine().length;

      if (
        coreTicks[coreRound].length !== count
      ) return;

      if (coreRound < 2) {
        coreRound++;
        openCore();
        return;
      }

      if (!coreTicks.every(
        items => items.length === count
      )) {
        coreRound = coreTicks.findIndex(
          items => items.length !== count
        );

        openCore();
        return;
      }

      finishers.core = {
        completed: true,
        rounds: 3,

        exercises: coreRoutine().map(
          ([name, target]) => ({
            name,
            target,
            roundsCompleted: 3
          })
        ),

        completedAt: new Date().toISOString()
      };

      $("m1002FinisherPanel").innerHTML = "";

      showFinisherStatus();
      localEdit();
      return;
    }

    if (element.closest(
      "[data-m1002-finisher-close]"
    )) {
      $("m1002FinisherPanel").innerHTML = "";
      return;
    }

    if (element.closest(
      "[data-m1002-complete]"
    )) {
      void completeWorkout();
    }
  }

  function handleInput(event) {
    const target = event.target;

    if (
      !(target instanceof Element) ||
      !target.closest(`#${MODAL}`)
    ) return;

    if (target.matches(
      "[data-m1002-weight]"
    )) {
      const value = target.value;
      const card = target.closest(
        "[data-m1002-ex]"
      );

      if (card) {
        card.querySelectorAll(
          "[data-m1002-weight]"
        ).forEach(input => {
          if (input !== target) {
            input.value = value;
          }
        });
      }

      localEdit();
      return;
    }

    if (target.matches(
      "[data-m1002-reps]"
    )) {
      localEdit();
      return;
    }

    if (target.id === "m1002WorkoutComment") {
      comment = target.value.slice(0, 500);
      localEdit();
      return;
    }

    if (target.matches(
      "[data-m1002-core-check]"
    )) {
      const index = Number(
        target.dataset.m1002CoreCheck
      );

      const ticks = new Set(
        coreTicks[coreRound]
      );

      if (target.checked) {
        ticks.add(index);
      } else {
        ticks.delete(index);
      }

      coreTicks[coreRound] = [
        ...ticks
      ].sort((a, b) => a - b);

      openCore();
    }
  }

  function scheduleRefresh() {
    clearTimeout(navTimer);

    navTimer = setTimeout(() => {
      if (workoutTabOpen()) {
        applyMode();

        if (mode === "coach") {
          void loadAssignments();
        }
      } else if (legacyOpen()) {
        renderLegacy();
        void loadAssignments();
      }
    }, 160);
  }

  function init() {
    try {
      mode = sessionStorage.getItem(MODE_KEY) === "coach"
        ? "coach"
        : "generated";
    } catch (_) {
      mode = "generated";
    }

    installStyles();
    ensureModal();
    ensureLegacy();

    const holder = $("manaV83Content");

    if (holder) {
      new MutationObserver(() => {
        if (
          workoutTabOpen() &&
          (!$(SWITCH) || !$(PANEL))
        ) {
          applyMode();
        }
      }).observe(holder, {
        childList: true
      });
    }

    document.addEventListener(
      "click",
      handleClick
    );

    document.addEventListener(
      "input",
      handleInput
    );

    document.addEventListener(
      "change",
      handleInput
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
    );

    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );

    window.addEventListener(
      "mana:profile-synced",
      scheduleRefresh
    );

    document.querySelector(
      '#bottomNav [data-page="programs"]'
    )?.addEventListener(
      "click",
      scheduleRefresh
    );

    window.addEventListener(
      "mana:logout",
      () => {
        loadingSerial++;
        account = "";
        assignments = [];
        loadedAt = 0;

        closeModal();
        renderPanel();
        renderLegacy();
      }
    );

    window.refreshManaAssignedPrograms =
      () => loadAssignments(true);

    window.MANA_CLIENT_CUSTOM_PROGRAM_BUILD =
      BUILD;

    scheduleRefresh();

    console.log(
      "[Mana Movement] Coach workouts " +
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
