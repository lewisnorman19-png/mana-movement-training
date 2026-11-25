
/*
  MANA MOVEMENT — COACH PROGRAMS
  BUILD 100212

  COMPLETE FILE REPLACEMENT
  v10_02_client_custom_programs_100200.js

  - Original Mana Strength carousel styling
  - Orange/white Coach Programs navigation
  - Orange muscle-target illustrations
  - Exercise demos
  - Repeat weights, editable reps, Tick All Sets
  - Optional Cardio and Core with Finish & Save
  - Tick All Workout
  - Workout rating and comments
  - Original-style Workout Complete summary
  - Progress: My Workouts / Coach Programs
  - Existing Mana Strength Progress styling
  - Separate authenticated coach workout records
*/

(() => {
  "use strict";

  const BUILD = "100212";
  const $ = id => document.getElementById(id);

  const IDS = {
    style: "manaCoach100212Style",
    switcher: "manaV1002WorkoutSwitch",
    panel: "manaV1002CoachPanel",
    legacy: "manaV1002AssignedPrograms",
    modal: "manaV1002CustomProgramModal",
    progressSwitch: "manaCoachProgressSwitch",
    progress: "manaCoachProgressResults",
    progressRoot: "manaV993StrengthProgress"
  };

  const esc = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const num = value => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const format = value =>
    Math.round(num(value) * 10) / 10;

  const clockText = seconds => {
    seconds = Math.max(0, Math.floor(num(seconds)));
    return String(Math.floor(seconds / 60))
      .padStart(2, "0") + ":" +
      String(seconds % 60).padStart(2, "0");
  };

  const dateText = value => {
    const d = new Date(value || Date.now());
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-AU");
  };

  let workoutMode = "generated";
  let progressMode = "generated";
  let progressPeriod = "weekly";
  let progressDetail = "workouts";
  let progressExercise = "";

  let userId = "";
  let assignments = [];
  let assignmentsLoading = false;
  let assignmentsLoadedAt = 0;

  let program = null;
  let assignment = null;
  let week = 1;
  let session = null;
  let openToken = 0;

  let currentSlide = 0;
  let finishers = {};
  let rating = 0;
  let comment = "";

  let cardioEquipment = "Bike";
  let cardioMinutes = 10;
  let coreRound = 0;
  let coreTicks = [[], [], []];

  let startedAt = 0;
  let elapsedBase = 0;

  let saveTimer = null;
  let saveQueue = Promise.resolve();
  let scrollTimer = null;
  let refreshTimer = null;
  let resizeObserver = null;

  let coachLogs = [];
  let progressUser = "";
  let progressLoading = false;
  let progressError = "";
  let progressLoadedAt = 0;
  let progressRequest = 0;
  let renderVersion = 0;

  const CORE = [
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
      throw new Error("Mana cloud is unavailable");
    }
    return window.supabaseClient();
  }

  async function signedInUser() {
    const client = await db();
    const result = await client.auth.getUser();

    if (result.error) throw result.error;

    return result.data?.user?.id || "";
  }

  function elapsed() {
    return elapsedBase + (
      startedAt
        ? Math.floor((Date.now() - startedAt) / 1000)
        : 0
    );
  }

  function stopClock() {
    if (startedAt) {
      elapsedBase = elapsed();
      startedAt = 0;
    }
  }

  function workoutTabOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()?.toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="program"].active'
      )
    );
  }

  function progressTabOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()?.toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) &&
      $(IDS.progressRoot)
    );
  }

  function legacyOpen() {
    return !!(
      $("clientProgramsView") &&
      !$("clientProgramsView").classList.contains("hide")
    );
  }

  function installStyles() {
    if ($(IDS.style)) return;

    const style = document.createElement("style");
    style.id = IDS.style;

    style.textContent = `
      #${IDS.switcher},
      #${IDS.progressSwitch} {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
        padding:6px;
        margin:10px 0 15px;
        border-radius:15px;
        background:#101113;
        border:1px solid #34383e;
      }

      #${IDS.switcher} button,
      #${IDS.progressSwitch} button {
        min-width:0;
        min-height:44px;
        padding:9px 5px;
        border:1px solid transparent;
        border-radius:10px;
        background:#191b1f;
        color:#f5f5f5!important;
        -webkit-text-fill-color:#f5f5f5!important;
        font:800 12px inherit;
        cursor:pointer;
      }

      #${IDS.switcher} button.active,
      #${IDS.progressSwitch} button.active {
        background:#271c15!important;
        color:#ff8126!important;
        -webkit-text-fill-color:#ff8126!important;
        border-color:#ff8126!important;
      }

      #manaV83Content.m100212-coach
      >:not(#${IDS.switcher}):not(#${IDS.panel}) {
        display:none!important;
      }

      #${IDS.panel} {
        display:none;
      }

      #manaV83Content.m100212-coach
      >#${IDS.panel} {
        display:block!important;
      }

      #${IDS.panel} .mc-shell {
        background:#101113;
        border:1px solid #34383e;
        border-radius:16px;
        overflow:hidden;
      }

      #${IDS.panel} .mc-head {
        padding:17px;
        background:#121315;
        border-bottom:1px solid #30343a;
      }

      #${IDS.panel} .mc-head h3,
      #${IDS.panel} .mc-program strong {
        color:#fff!important;
        -webkit-text-fill-color:#fff!important;
      }

      #${IDS.panel} .mc-head h3 {
        font-size:20px;
        margin:5px 0;
      }

      #${IDS.panel} .mc-body {
        padding:13px;
      }

      .mc-kicker {
        color:#ff8126!important;
        font-size:10px;
        font-weight:900;
        letter-spacing:.09em;
      }

      .mc-muted {
        color:#b5bbc4;
        font-size:12px;
        line-height:1.55;
      }

      .mc-program {
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:15px;
        margin-bottom:9px;
        background:#17191c;
        color:#fff!important;
        border:1px solid #3b4047;
        border-radius:13px;
        text-align:left;
        font-family:inherit;
      }

      .mc-program strong {
        display:block;
        font-size:15px;
      }

      .mc-program small {
        display:block;
        color:#b5bbc4;
        font-size:12px;
        margin-top:5px;
      }

      .mc-pill {
        color:#ff8126;
        border:1px solid #774524;
        padding:6px 8px;
        border-radius:20px;
        font-size:10px;
        font-weight:900;
      }

      #${IDS.modal} {
        position:fixed;
        inset:0;
        z-index:61000;
        display:none;
        overflow-y:auto;
        overscroll-behavior:contain;
        background:#050505;
        color:#fff;
        padding:
          calc(12px + env(safe-area-inset-top))
          12px
          calc(30px + env(safe-area-inset-bottom));
      }

      #${IDS.modal}.open {
        display:block;
      }

      #${IDS.modal} .mc-inner {
        max-width:680px;
        margin:auto;
      }

      #${IDS.modal} button {
        font-family:inherit;
        cursor:pointer;
      }

      #${IDS.modal} .mc-top {
        position:sticky;
        top:-12px;
        z-index:10;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:11px 0;
        background:#050505;
      }

      #${IDS.modal} .mc-back,
      #${IDS.modal} .mc-secondary {
        padding:10px 12px;
        min-height:40px;
        border:1px solid #454a50;
        border-radius:10px;
        background:#191b1e;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }

      #${IDS.modal} .mc-hero,
      #${IDS.modal} .mc-day {
        border:1px solid #34383e;
        border-radius:16px;
        background:#121314;
        padding:16px;
        margin:0 0 12px;
      }

      #${IDS.modal} .mc-hero h2 {
        color:#fff;
        margin:6px 0;
        font-size:21px;
      }

      #${IDS.modal} .mc-day h3 {
        color:#fff;
        margin:7px 0;
        font-size:18px;
      }

      #${IDS.modal} .mc-primary {
        display:block;
        width:100%;
        padding:12px;
        min-height:45px;
        border:0;
        border-radius:11px;
        background:#ff8126!important;
        color:#151515!important;
        font-size:13px;
        font-weight:900;
        margin-top:12px;
      }

      #${IDS.modal} .mc-primary:disabled {
        opacity:.5;
      }

      #${IDS.modal} .mc-weeks {
        display:flex;
        gap:8px;
        overflow-x:auto;
        margin-bottom:13px;
      }

      #${IDS.modal} .mc-weeks button {
        flex:0 0 auto;
        padding:10px 13px;
        background:#191b1e;
        border:1px solid #444;
        border-radius:10px;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }

      #${IDS.modal} .mc-weeks button.active {
        background:#271c15;
        color:#ff8126;
        border-color:#ff8126;
      }

      #${IDS.modal} .mc-position {
        display:flex;
        justify-content:space-between;
        gap:9px;
        margin:5px 0 8px;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }

      #${IDS.modal} .mc-position small {
        color:#aeb6c0;
        font-size:11px;
      }

      #${IDS.modal} .mc-dots {
        display:flex;
        justify-content:center;
        flex-wrap:wrap;
        gap:7px;
        margin:9px 0;
      }

      #${IDS.modal} .mc-dot {
        width:9px;
        height:9px;
        padding:0;
        border:0;
        border-radius:50%;
        background:#565b62;
      }

      #${IDS.modal} .mc-dot.active {
        width:23px;
        border-radius:8px;
        background:#ff8126;
      }

      #${IDS.modal} .mc-dot.done {
        background:#ff8126;
        opacity:.65;
      }

      #${IDS.modal} .mc-carousel {
        display:flex;
        align-items:flex-start;
        width:100%;
        overflow-x:auto;
        overflow-y:hidden;
        scroll-snap-type:x mandatory;
        scroll-behavior:smooth;
        scrollbar-width:none;
        -webkit-overflow-scrolling:touch;
        transition:height .15s;
      }

      #${IDS.modal} .mc-carousel::-webkit-scrollbar {
        display:none;
      }

      #${IDS.modal} .mc-slide {
        flex:0 0 100%;
        min-width:0;
        box-sizing:border-box;
        scroll-snap-align:start;
        scroll-snap-stop:always;
        padding:1px;
      }

      #${IDS.modal} .mana-v64-card {
        padding:15px;
        margin:0;
        background:#121314!important;
        border:1px solid #34383e!important;
        border-radius:16px;
        color:#fff;
        box-shadow:none;
      }

      #${IDS.modal} .mana-v64-name {
        color:#fff!important;
        font-size:18px;
        font-weight:900;
        margin-bottom:6px;
      }

      #${IDS.modal} .mana-v64-target {
        color:#ff8126!important;
        font-size:12px;
      }

      #${IDS.modal} .mc-muscle {
        display:flex;
        align-items:center;
        gap:11px;
        margin:12px 0;
        padding:10px;
        background:#0b0c0d;
        border:1px solid #34383e;
        border-radius:12px;
      }

      #${IDS.modal} .mc-muscle-frame {
        flex:0 0 105px;
        width:105px;
        height:124px;
        display:grid;
        place-items:center;
        border-radius:10px;
        overflow:hidden;
        background:#151618;
      }

      #${IDS.modal} .mc-muscle-frame img {
        width:100%;
        height:100%;
        object-fit:contain;
      }

      #${IDS.modal} .mc-muscle-copy {
        min-width:0;
        flex:1;
      }

      #${IDS.modal} .mc-muscle-copy strong {
        display:block;
        color:#fff;
        font-size:13px;
      }

      #${IDS.modal} .mc-demo {
        display:block;
        margin-top:10px;
        padding:10px;
        color:#ff8126;
        background:#241b16;
        border:1px solid #714324;
        border-radius:10px;
        font-size:11px;
        font-weight:900;
      }

      #${IDS.modal} .mana-v64-table-head,
      #${IDS.modal} .mana-v64-set {
        display:grid;
        grid-template-columns:
          30px minmax(0,1fr)
          minmax(0,1fr) 44px;
        gap:7px;
        align-items:center;
        margin:8px 0;
      }

      #${IDS.modal} .mana-v64-table-head {
        color:#afb5bd;
        font-size:11px;
        font-weight:800;
        text-align:center;
      }

      #${IDS.modal} .mana-v64-set-number {
        font-size:12px;
        text-align:center;
        color:#fff;
      }

      #${IDS.modal} .mana-v64-set input {
        width:100%;
        min-width:0;
        min-height:42px;
        background:#1b1d20;
        border:1px solid #454a50;
        border-radius:9px;
        padding:7px;
        color:#fff;
        text-align:center;
        font-size:16px;
      }

      #${IDS.modal} .mana-v64-check {
        width:42px;
        height:42px;
        border:1px solid #545960;
        border-radius:9px;
        background:#23252a;
        color:#aaa;
        font-weight:900;
      }

      #${IDS.modal} .mana-v64-check.done {
        background:#ff8126;
        color:#111;
        border-color:#ff8126;
      }

      #${IDS.modal} .mc-tick-all {
        width:100%;
        min-height:42px;
        margin-top:13px;
        border:1px solid #ff8126;
        border-radius:10px;
        background:#261d16;
        color:#ff8126;
        font-size:12px;
        font-weight:900;
      }

      #${IDS.modal} .mc-tick-all.done {
        background:#ff8126;
        color:#111;
      }

      #${IDS.modal} .mc-nav {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin:6px 0;
      }

      #${IDS.modal} .mc-nav button {
        min-height:43px;
        background:#191b1e;
        border:1px solid #444;
        border-radius:10px;
        color:#fff;
        font-size:12px;
        font-weight:900;
      }

      #${IDS.modal} .mc-nav button.next {
        color:#ff8126;
        background:#241b15;
        border-color:#ff8126;
      }

      #${IDS.modal} .mc-nav button:disabled {
        opacity:.38;
      }

      #${IDS.modal} .mc-final {
        padding:15px;
        border:1px solid #34383e;
        border-radius:16px;
        background:#121314;
      }

      #${IDS.modal} .mc-final h3 {
        color:#fff;
        font-size:19px;
        margin:6px 0;
      }

      #${IDS.modal} .mc-finisher-options {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
        margin:13px 0;
      }

      #${IDS.modal} .mc-finisher-options button {
        min-height:68px;
        background:#191b1f;
        color:#fff;
        border:1px solid #4a4d53;
        border-radius:12px;
        font-size:13px;
        font-weight:900;
      }

      #${IDS.modal} .mc-finisher-options button.done {
        border-color:#ff8126;
        color:#ff8126;
      }

      #${IDS.modal} .mc-finisher-options small {
        display:block;
        font-size:11px;
        font-weight:500;
        margin-top:5px;
        color:#b1b7c0;
      }

      #${IDS.modal} .mc-finisher-card,
      #${IDS.modal} .mc-feedback {
        padding:12px;
        border:1px solid #383d44;
        border-radius:12px;
        background:#17191c;
        margin-top:12px;
      }

      #${IDS.modal} .mc-options {
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        margin:11px 0;
      }

      #${IDS.modal} .mc-options button {
        padding:9px 11px;
        border:1px solid #44484e;
        border-radius:9px;
        background:#25272a;
        color:#ccc;
        font-size:11px;
        font-weight:800;
      }

      #${IDS.modal} .mc-options button.active {
        border-color:#ff8126;
        color:#ff8126;
        background:#2a201a;
      }

      #${IDS.modal} .mc-core-item {
        display:flex;
        gap:10px;
        align-items:center;
        padding:10px 0;
        border-bottom:1px solid #333;
        color:#fff;
        font-size:12px;
      }

      #${IDS.modal} .mc-core-item input {
        width:20px;
        height:20px;
        accent-color:#ff8126;
      }

      #${IDS.modal} .mc-core-item small {
        display:block;
        color:#b5bdc6;
        margin-top:4px;
      }

      #${IDS.modal} .mc-rating {
        display:grid;
        grid-template-columns:repeat(5,1fr);
        gap:7px;
        margin:10px 0;
      }

      #${IDS.modal} .mc-rating button {
        padding:11px 0;
        border:1px solid #444;
        border-radius:9px;
        background:#242629;
        color:#fff;
        font-size:16px;
      }

      #${IDS.modal} .mc-rating button.active {
        border-color:#ff8126;
        color:#ff8126;
        background:#2a201a;
      }

      #${IDS.modal} .mc-feedback label {
        display:block;
        color:#fff;
        margin-top:12px;
        font-size:12px;
        font-weight:800;
      }

      #${IDS.modal} .mc-feedback textarea {
        display:block;
        width:100%;
        min-height:88px;
        padding:12px;
        margin-top:8px;
        border:1px solid #4a4e54;
        border-radius:10px;
        background:#202226;
        color:#fff;
        font:14px inherit;
        resize:vertical;
      }

      #${IDS.modal} .mc-status {
        color:#b9c0c8;
        font-size:12px;
        line-height:1.6;
        margin:7px 0;
      }

      #${IDS.modal} .mc-status:empty {
        display:none;
      }

      #${IDS.modal} .mc-summary {
        padding:12px 0;
        text-align:center;
      }

      #${IDS.modal} .mc-summary-check {
        display:grid;
        place-items:center;
        margin:4px auto 13px;
        width:66px;
        height:66px;
        border:2px solid #ff8126;
        border-radius:50%;
        background:#251b15;
        color:#ff8126;
        font-size:30px;
      }

      #${IDS.modal} .mc-summary h1 {
        color:#fff;
        font-size:26px;
        margin:7px 0;
      }

      #${IDS.modal} .mc-summary-grid {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
        margin:18px 0;
        text-align:left;
      }

      #${IDS.modal} .mc-summary-stat {
        padding:14px;
        background:#141517;
        border:1px solid #373c43;
        border-radius:13px;
      }

      #${IDS.modal} .mc-summary-stat small {
        color:#a8b0ba;
        font-size:11px;
      }

      #${IDS.modal} .mc-summary-stat strong {
        display:block;
        margin:6px 0;
        color:#fff;
        font-size:23px;
      }

      #${IDS.modal} .mc-summary-note {
        text-align:left;
        padding:14px;
        margin:11px 0;
        border:1px solid #34383e;
        border-radius:12px;
        background:#111214;
        color:#c2c7ce;
        font-size:12px;
        line-height:1.7;
      }

      #${IDS.progressRoot}.mc-coach-progress
      >:not(#${IDS.progressSwitch}):not(#${IDS.progress}) {
        display:none!important;
      }

      #${IDS.progressSwitch} {
        margin:10px 0 14px;
      }

      #${IDS.progress} {
        display:none;
        margin:0;
        padding:0;
        background:transparent;
        border:0;
      }

      #${IDS.progressRoot}.mc-coach-progress
      >#${IDS.progress} {
        display:block!important;
      }

      #${IDS.progress} .mana-v993-head h2,
      #${IDS.progress} .mana-v993-panel h3,
      #${IDS.progress} .mana-v993-row-title {
        color:#fff!important;
      }

      #${IDS.progress} .mana-v993-metric-value {
        color:#ff8126!important;
      }

      #${IDS.progress} .mana-v993-period.active,
      #${IDS.progress} .mana-v993-detail-btn.active {
        color:#ff8126!important;
        border-color:#ff8126!important;
      }

      #${IDS.progress} .mc-history {
        display:block;
        padding:12px;
        margin:8px 0;
        background:#191b1e;
        border:1px solid #383c42;
        border-radius:11px;
        color:#fff;
      }

      #${IDS.progress} .mc-history summary {
        color:#fff;
        font-size:13px;
        font-weight:800;
        cursor:pointer;
      }

      #${IDS.progress} .mc-history small {
        display:block;
        color:#b5bcc5;
        margin:6px 0;
        font-size:11px;
      }

      #${IDS.progress} .mc-history-exercise {
        padding:9px 0;
        border-top:1px solid #373c42;
        font-size:12px;
        line-height:1.6;
      }

      #${IDS.progress} .mc-history-exercise strong {
        color:#fff;
      }

      #${IDS.progress} select {
        width:100%;
        padding:11px;
        margin:10px 0;
        background:#191b1e;
        border:1px solid #454a50;
        border-radius:10px;
        color:#fff;
      }

      @media(max-width:420px) {
        #${IDS.modal} .mana-v64-card {
          padding:12px;
        }

        #${IDS.modal} .mc-muscle {
          gap:9px;
          padding:9px;
        }

        #${IDS.modal} .mc-muscle-frame {
          width:95px;
          flex-basis:95px;
          height:115px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = $(IDS.modal);
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = IDS.modal;

    modal.innerHTML = `
      <div class="mc-inner">
        <div class="mc-top">
          <span class="mc-kicker">
            MANA STRENGTH • COACH PROGRAM
          </span>
          <button type="button"
            class="mc-back"
            data-mc-back>
            ← BACK
          </button>
        </div>
        <div id="mcContent"></div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function showModal(html) {
    ensureModal().classList.add("open");
    $("mcContent").innerHTML = html;
    $(IDS.modal).scrollTop = 0;
  }

  function ensureWorkoutRoots() {
    if (!workoutTabOpen()) return;

    const holder = $("manaV83Content");
    if (!holder) return;

    let switcher = $(IDS.switcher);

    if (!switcher) {
      switcher = document.createElement("div");
      switcher.id = IDS.switcher;
      switcher.innerHTML = `
        <button type="button"
          data-mc-mode="generated">
          My Workouts
        </button>
        <button type="button"
          data-mc-mode="coach">
          Coach Programs
        </button>
      `;
    }

    if (switcher.parentElement !== holder) {
      holder.prepend(switcher);
    }

    let panel = $(IDS.panel);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = IDS.panel;
    }

    if (panel.parentElement !== holder) {
      switcher.after(panel);
    }

    holder.classList.toggle(
      "m100212-coach",
      workoutMode === "coach"
    );

    switcher.querySelectorAll("button").forEach(button => {
      const active =
        button.dataset.mcMode === workoutMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setWorkoutMode(value) {
    if (!["generated", "coach"].includes(value)) return;

    workoutMode = value;

    try {
      sessionStorage.setItem(
        "mana-strength-workout-view-100205",
        workoutMode
      );
    } catch (_) {}

    ensureWorkoutRoots();

    if (value === "coach") {
      renderAssignments();
      void loadAssignments(true);
    }
  }

  function programCard(item) {
    const p = item.custom_programs;

    return `
      <button type="button"
        class="mc-program"
        data-mc-program="${esc(p.id)}">
        <span>
          <strong>${esc(p.name)}</strong>
          <small>
            ${esc(p.goal || p.description ||
              "Personalised training program")}
          </small>
        </span>
        <span class="mc-pill">
          ${item.is_primary
            ? "PRIMARY"
            : esc(item.status.toUpperCase())}
        </span>
      </button>
    `;
  }

  function renderAssignments() {
    const panel = $(IDS.panel);
    if (!panel) return;

    const rows = assignments.filter(
      a => a.custom_programs
    );

    panel.innerHTML = `
      <section class="mc-shell">
        <div class="mc-head">
          <span class="mc-kicker">MANA STRENGTH</span>
          <h3>Coach Programs</h3>
          <p class="mc-muted">
            Personalised training built and
            assigned by your coach.
          </p>
        </div>

        <div class="mc-body">
          ${rows.length
            ? rows.map(programCard).join("")
            : `
              <div class="mc-day">
                <h3 style="color:#fff">
                  No Coach Programs Yet
                </h3>
                <p class="mc-muted">
                  ${assignmentsLoading
                    ? "Checking assigned programs…"
                    : "Your assigned programs will appear here."}
                </p>
              </div>
            `}
        </div>
      </section>
    `;

    const legacy = $("clientProgramsView");

    if (legacy) {
      let root = $(IDS.legacy);

      if (!root) {
        root = document.createElement("section");
        root.id = IDS.legacy;
      }

      if (!legacy.contains(root)) legacy.prepend(root);

      root.innerHTML = rows.length
        ? rows.map(programCard).join("")
        : "";
    }
  }

  async function loadAssignments(force = false) {
    if (assignmentsLoading) return;

    if (
      !force &&
      Date.now() - assignmentsLoadedAt < 20000
    ) return;

    assignmentsLoading = true;
    renderAssignments();

    try {
      const client = await db();
      const current = await signedInUser();

      if (current !== userId) {
        userId = current;
        assignments = [];
      }

      if (!current) return;

      const result = await client
        .from("client_program_assignments")
        .select(`
          id,
          status,
          is_primary,
          assigned_at,
          custom_programs(
            id,name,description,goal,
            duration_weeks,status
          )
        `)
        .eq("client_id", current)
        .in("status", ["active", "paused", "completed"])
        .order("is_primary", { ascending: false })
        .order("assigned_at", { ascending: false });

      if (result.error) throw result.error;

      assignments = (result.data || []).filter(
        a => a.custom_programs
      );

      assignmentsLoadedAt = Date.now();

    } catch (error) {
      console.warn("[Mana Coach Programs]", error);
    } finally {
      assignmentsLoading = false;
      renderAssignments();
    }
  }

  function closeModal() {
    ++openToken;

    if (session) {
      backup();
      void saveSession();
    }

    stopClock();
    resizeObserver?.disconnect();

    session = null;
    program = null;
    assignment = null;

    $(IDS.modal)?.classList.remove("open");
  }

  async function openProgram(id) {
    const selected = assignments.find(
      a => a.custom_programs?.id === id
    );

    if (!selected) return;

    const token = ++openToken;

    assignment = selected;
    session = null;

    showModal(`
      <p class="mc-status">
        Loading your coach program…
      </p>
    `);

    try {
      const client = await db();

      if (await signedInUser() !== userId) {
        throw Error("Sign in to open your program");
      }

      const link = await client
        .from("client_program_assignments")
        .select("id")
        .eq("client_id", userId)
        .eq("program_id", id)
        .in("status", ["active", "paused", "completed"])
        .maybeSingle();

      if (link.error) throw link.error;

      if (!link.data) {
        throw Error("This program is not assigned");
      }

      const [p, d] = await Promise.all([
        client.from("custom_programs")
          .select("*").eq("id", id).single(),

        client.from("custom_program_days")
          .select("*").eq("program_id", id)
          .order("week_number")
          .order("day_number")
      ]);

      if (p.error || d.error) throw p.error || d.error;

      const days = d.data || [];
      let exercises = [];

      if (days.length) {
        const result = await client
          .from("custom_program_exercises")
          .select("*")
          .in("program_day_id", days.map(x => x.id))
          .order("sort_order");

        if (result.error) throw result.error;
        exercises = result.data || [];
      }

      if (token !== openToken) return;

      program = {
        program: p.data,
        days,
        exercises
      };

      week = days.length
        ? Math.min(...days.map(
            d => Number(d.week_number) || 1
          ))
        : 1;

      renderProgram();

    } catch (error) {
      if (token === openToken) {
        showModal(`
          <p class="mc-status">
            Could not load program:
            ${esc(error.message)}
          </p>
        `);
      }
    }
  }

  function renderProgram() {
    if (!program) return;

    session = null;
    stopClock();

    const weeks = [...new Set(
      program.days.map(d => Number(d.week_number) || 1)
    )].sort((a, b) => a - b);

    showModal(`
      <div class="mc-hero">
        <span class="mc-kicker">
          COACH-ASSIGNED PROGRAM
        </span>
        <h2>${esc(program.program.name)}</h2>
        <p class="mc-muted">
          ${esc(program.program.description ||
            program.program.goal || "")}
        </p>
      </div>

      <div class="mc-weeks">
        ${weeks.map(n => `
          <button type="button"
            data-mc-week="${n}"
            class="${n === week ? "active" : ""}">
            WEEK ${n}
          </button>
        `).join("")}
      </div>

      ${program.days
        .filter(d => Number(d.week_number) === week)
        .map(day => {
          const count = program.exercises.filter(
            e => e.program_day_id === day.id
          ).length;

          return `
            <div class="mc-day">
              <span class="mc-kicker">
                WEEK ${week} • DAY ${esc(day.day_number)}
              </span>
              <h3>${esc(day.title || "Workout")}</h3>
              <p class="mc-muted">
                ${esc(day.workout_type || "Strength")}
                • ${count} exercises
                ${day.estimated_minutes
                  ? " • " + esc(day.estimated_minutes) + " min"
                  : ""}
              </p>
              ${day.notes
                ? `<p class="mc-muted">${esc(day.notes)}</p>`
                : ""}
              <button type="button"
                class="mc-primary"
                data-mc-start="${esc(day.id)}">
                START WORKOUT
              </button>
            </div>
          `;
        }).join("") ||
        '<p class="mc-status">No workouts this week.</p>'}
    `);
  }

  function visual(name) {
    const api = window.MANA_EXERCISE_VISUALS;
    const info = api?.resolve?.(name) || {};

    return {
      target: info.target || "Full Body",
      image: api?.muscleAssets?.[
        info.muscle || "fullbody"
      ] || ""
    };
  }

  function muscleHTML(name) {
    const v = visual(name);

    return `
      <div class="mc-muscle">
        <div class="mc-muscle-frame">
          ${v.image
            ? `<img src="${esc(v.image)}"
                alt="${esc(v.target)} target muscles"
                loading="lazy">`
            : `<span class="mc-kicker">
                ${esc(v.target)}
              </span>`}
        </div>

        <div class="mc-muscle-copy">
          <span class="mc-kicker">PRIMARY TARGET</span>
          <strong>${esc(v.target)}</strong>

          <button type="button"
            class="mc-demo"
            data-mc-demo="${esc(name)}">
            ▶ PLAY DEMO
          </button>
        </div>
      </div>
    `;
  }

  function defaultReps(value) {
    const match = String(value || "").match(/\d+/);
    return match ? Math.min(100, Number(match[0])) : 10;
  }

  function setHTML(index, set) {
    return `
      <div class="mana-v64-set" data-mc-set>
        <span class="mana-v64-set-number">
          ${index + 1}
        </span>

        <input type="number"
          min="0" step=".5" inputmode="decimal"
          placeholder="kg"
          data-mc-weight
          aria-label="Set ${index + 1} weight"
          value="${esc(set.weight ?? "")}">

        <input type="number"
          min="0" step="1" inputmode="numeric"
          data-mc-reps
          aria-label="Set ${index + 1} reps"
          value="${esc(set.reps ?? "")}">

        <button type="button"
          class="mana-v64-check ${set.done ? "done" : ""}"
          data-mc-tick
          aria-pressed="${!!set.done}">
          ✓
        </button>
      </div>
    `;
  }

  function exerciseHTML(exercise, previous, fromCompleted) {
    const old = (previous || []).find(
      e => e.id === exercise.id ||
        e.name === exercise.exercise_name
    );

    const n = Math.max(
      1, Math.min(20, num(exercise.sets) || 3)
    );

    const sets = Array.from({ length: n }, (_, i) => ({
      weight: old?.sets?.[i]?.weight ?? "",
      reps: old?.sets?.[i]?.reps ??
        defaultReps(exercise.reps),
      done: !fromCompleted && !!old?.sets?.[i]?.done
    }));

    return `
      <div class="mana-v64-card"
        data-mc-ex="${esc(exercise.id)}">

        <div class="mana-v64-name">
          ${esc(exercise.exercise_name)}
        </div>

        <div class="mana-v64-target">
          ${n} sets • ${esc(exercise.reps || "8–12")} reps
          ${exercise.rest_seconds == null
            ? ""
            : " • " + esc(exercise.rest_seconds) + "s rest"}
        </div>

        ${muscleHTML(exercise.exercise_name)}

        ${exercise.rpe_target
          ? `<p class="mc-muted">
              Target RPE ${esc(exercise.rpe_target)}
            </p>`
          : ""}

        ${exercise.notes
          ? `<p class="mc-muted">
              Coach: ${esc(exercise.notes)}
            </p>`
          : ""}

        <div class="mana-v64-table-head">
          <span>Set</span>
          <span>Weight</span>
          <span>Reps</span>
          <span>Done</span>
        </div>

        ${sets.map(setHTML).join("")}

        <p class="mc-muted">
          Weight repeats across this exercise.
          Reps remain editable per set.
        </p>

        <button type="button"
          class="mc-tick-all"
          data-mc-tick-exercise>
          TICK ALL SETS ✓
        </button>
      </div>
    `;
  }

  function coreRoutine() {
    const day = num(session?.day?.day_number) || 1;
    return CORE[(day - 1) % CORE.length];
  }

  function finalHTML() {
    return `
      <div class="mc-final">
        <span class="mc-kicker">
          OPTIONAL FINISHERS
        </span>

        <h3>Cardio & Core</h3>

        <p class="mc-muted">
          Add either finisher or both.
          Each finisher has its own Save action.
        </p>

        <div class="mc-finisher-options">
          <button type="button"
            data-mc-finisher="cardio"
            class="${finishers.cardio?.completed
              ? "done" : ""}">
            ♥ CARDIO
            <small>
              ${finishers.cardio?.completed
                ? "COMPLETED ✓"
                : "10–20 minutes"}
            </small>
          </button>

          <button type="button"
            data-mc-finisher="core"
            class="${finishers.core?.completed
              ? "done" : ""}">
            ◎ CORE
            <small>
              ${finishers.core?.completed
                ? "COMPLETED ✓"
                : "3 rounds"}
            </small>
          </button>
        </div>

        <div id="mcFinisherDetails"></div>
        <p class="mc-status" id="mcFinisherStatus"></p>

        <button type="button"
          class="mc-tick-all"
          data-mc-tick-workout>
          TICK ALL WORKOUT ✓
        </button>

        <p class="mc-muted">
          Tick All Workout marks the prescribed
          strength sets complete without changing
          their recorded weights or reps.
        </p>

        <div class="mc-feedback">
          <span class="mc-kicker">
            SESSION FEEDBACK
          </span>

          <h3>How was your workout?</h3>

          <label>Workout rating (1–5)</label>

          <div class="mc-rating">
            ${[1, 2, 3, 4, 5].map(n => `
              <button type="button"
                data-mc-rating="${n}"
                class="${rating === n ? "active" : ""}">
                ${n}
              </button>
            `).join("")}
          </div>

          <label for="mcWorkoutComment">
            Comments (optional)
          </label>

          <textarea
            id="mcWorkoutComment"
            maxlength="500"
            placeholder="How did you feel? Anything to remember for next time?">${esc(comment)}</textarea>
        </div>

        <button type="button"
          class="mc-primary"
          data-mc-complete>
          COMPLETE WORKOUT ✓
        </button>

        <p class="mc-status" id="mcCompleteStatus"></p>
      </div>
    `;
  }

  function cardioHTML() {
    return `
      <div class="mc-finisher-card">
        <h3>Cardio Finisher</h3>

        <p class="mc-muted">
          Select the session you've completed.
        </p>

        <div class="mc-options">
          ${["Bike", "Rower", "Treadmill", "Bodyweight"]
            .map(name => `
              <button type="button"
                data-mc-equipment="${esc(name)}"
                class="${cardioEquipment === name
                  ? "active" : ""}">
                ${esc(name)}
              </button>
            `).join("")}
        </div>

        <div class="mc-options">
          ${[10, 15, 20].map(minutes => `
            <button type="button"
              data-mc-minutes="${minutes}"
              class="${cardioMinutes === minutes
                ? "active" : ""}">
              ${minutes} MIN
            </button>
          `).join("")}
        </div>

        <p class="mc-muted">
          Include an appropriate warm-up
          and cool-down.
        </p>

        <button type="button"
          class="mc-primary"
          data-mc-cardio-save>
          FINISH & SAVE CARDIO ✓
        </button>

        <button type="button"
          class="mc-secondary"
          style="width:100%;margin-top:8px"
          data-mc-finisher-close>
          CLOSE
        </button>
      </div>
    `;
  }

  function coreHTML() {
    const routine = coreRoutine();
    const current = coreTicks[coreRound];

    const allDone = coreTicks.every(
      row => row.length === routine.length
    );

    return `
      <div class="mc-finisher-card">
        <h3>Core Finisher</h3>

        <p class="mc-muted">
          Round ${coreRound + 1} of 3
        </p>

        <div class="mc-options">
          ${[0, 1, 2].map(n => `
            <button type="button"
              data-mc-core-round="${n}"
              class="${coreRound === n ? "active" : ""}">
              ROUND ${n + 1}
              ${coreTicks[n].length === routine.length
                ? " ✓" : ""}
            </button>
          `).join("")}
        </div>

        ${routine.map(([name, reps], i) => `
          <label class="mc-core-item">
            <input type="checkbox"
              data-mc-core-check="${i}"
              ${current.includes(i) ? "checked" : ""}>
            <span>
              <strong>${esc(name)}</strong>
              <small>${esc(reps)}</small>
            </span>
          </label>
        `).join("")}

        <div class="mc-options">
          <button type="button"
            data-mc-core-tick-round>
            TICK ALL ROUND
          </button>

          <button type="button"
            data-mc-core-tick-all>
            TICK ALL 3 ROUNDS
          </button>
        </div>

        ${!allDone && coreRound < 2
          ? `
            <button type="button"
              class="mc-secondary"
              style="width:100%;margin-top:9px"
              data-mc-core-next>
              NEXT ROUND →
            </button>
          `
          : ""}

        <button type="button"
          class="mc-primary"
          data-mc-core-save
          ${allDone ? "" : "disabled"}>
          FINISH & SAVE CORE ✓
        </button>

        <p class="mc-muted">
          Complete all three rounds to enable saving.
        </p>

        <button type="button"
          class="mc-secondary"
          style="width:100%;margin-top:8px"
          data-mc-finisher-close>
          CLOSE
        </button>
      </div>
    `;
  }

  function showFinisher(kind) {
    const node = $("mcFinisherDetails");
    if (!node) return;

    node.innerHTML = kind === "cardio"
      ? cardioHTML()
      : coreHTML();

    fitCarousel();
  }

  function refreshFinal() {
    const slide = $("mcCarousel")
      ?.querySelector(".mc-slide:last-child");

    if (!slide) return;

    const scroll = $(IDS.modal)?.scrollTop || 0;

    slide.innerHTML = finalHTML();

    if (finishers.cardio?.completed ||
        finishers.core?.completed) {
      $("mcFinisherStatus").textContent = [
        finishers.cardio?.completed
          ? "Cardio saved ✓" : "",
        finishers.core?.completed
          ? "Core saved ✓" : ""
      ].filter(Boolean).join(" • ");
    }

    if ($(IDS.modal)) $(IDS.modal).scrollTop = scroll;

    syncTicks();
    fitCarousel();
  }

  async function saveFinisher(kind) {
    if (!session) return;

    if (kind === "cardio") {
      finishers.cardio = {
        completed: true,
        equipment: cardioEquipment,
        durationMinutes: cardioMinutes,
        actualMinutes: cardioMinutes,
        completedAt: new Date().toISOString()
      };
    } else {
      const routine = coreRoutine();

      if (!coreTicks.every(
        row => row.length === routine.length
      )) return;

      finishers.core = {
        completed: true,
        rounds: 3,
        exercises: routine.map(([name, reps]) => ({
          name,
          target: reps,
          roundsCompleted: 3
        })),
        completedAt: new Date().toISOString()
      };
    }

    backup();
    clearTimeout(saveTimer);

    const details = $("mcFinisherDetails");

    if (details) {
      details.innerHTML = `
        <p class="mc-status">
          Saving ${kind} to Mana cloud…
        </p>
      `;
    }

    const saved = await saveSession();

    if (saved) {
      refreshFinal();
    } else if (details) {
      details.innerHTML = `
        <p class="mc-status">
          Cloud save failed. Your local backup
          is retained. Retry saving this finisher.
        </p>
        <button type="button"
          class="mc-primary"
          data-mc-retry-finisher="${kind}">
          RETRY SAVE
        </button>
      `;
    }
  }

  function slides() {
    return [
      ...($("mcCarousel")
        ?.querySelectorAll(".mc-slide") || [])
    ];
  }

  function fitCarousel() {
    requestAnimationFrame(() => {
      const carousel = $("mcCarousel");
      const active = slides()[currentSlide];

      if (carousel && active) {
        const height = Math.ceil(active.scrollHeight);
        if (height > 0) {
          carousel.style.height = height + "px";
        }
      }
    });
  }

  function navigate(index, smooth = true) {
    const carousel = $("mcCarousel");
    const pages = slides();

    if (!carousel || !pages.length) return;

    currentSlide = Math.max(
      0, Math.min(index, pages.length - 1)
    );

    carousel.scrollTo({
      left: carousel.clientWidth * currentSlide,
      behavior: smooth ? "smooth" : "auto"
    });

    updateNavigation();
    fitCarousel();
  }

  function updateNavigation() {
    const total = slides().length;

    if (!total) return;

    if ($("mcPosition")) {
      $("mcPosition").textContent =
        currentSlide === total - 1
          ? "Cardio, Core & Feedback"
          : `Exercise ${currentSlide + 1} of ${total - 1}`;
    }

    if ($("mcDots")) {
      $("mcDots").innerHTML = slides().map((page, i) => {
        const ticks = [
          ...page.querySelectorAll("[data-mc-tick]")
        ];

        const done = ticks.length &&
          ticks.every(t => t.classList.contains("done"));

        return `
          <button type="button"
            class="mc-dot
              ${i === currentSlide ? "active" : ""}
              ${done ? "done" : ""}"
            data-mc-slide="${i}"
            aria-label="Page ${i + 1}">
          </button>
        `;
      }).join("");
    }

    if ($("mcPrevious")) {
      $("mcPrevious").disabled = currentSlide === 0;
    }

    if ($("mcNext")) {
      $("mcNext").disabled = currentSlide === total - 1;

      $("mcNext").textContent =
        currentSlide === total - 2
          ? "FINISHERS ›"
          : "NEXT ›";
    }

    syncTicks();
  }

  function syncTicks() {
    slides().forEach(page => {
      const button = page.querySelector(
        "[data-mc-tick-exercise]"
      );

      if (!button) return;

      const ticks = [
        ...page.querySelectorAll("[data-mc-tick]")
      ];

      const done = ticks.length &&
        ticks.every(t => t.classList.contains("done"));

      button.classList.toggle("done", !!done);

      button.textContent = done
        ? "ALL SETS COMPLETE ✓"
        : "TICK ALL SETS ✓";
    });

    const button = $("mcCarousel")?.querySelector(
      "[data-mc-tick-workout]"
    );

    if (button) {
      const ticks = [
        ...$("mcCarousel").querySelectorAll(
          "[data-mc-tick]"
        )
      ];

      const done = ticks.length &&
        ticks.every(t => t.classList.contains("done"));

      button.classList.toggle("done", !!done);

      button.textContent = done
        ? "ALL WORKOUT SETS COMPLETE ✓"
        : "TICK ALL WORKOUT ✓";
    }
  }

  function readSets() {
    if (!session) return [];

    return [
      ...($("mcCarousel")
        ?.querySelectorAll("[data-mc-ex]") || [])
    ].map(card => ({
      id: card.dataset.mcEx,

      name: session.exercises.find(
        e => e.id === card.dataset.mcEx
      )?.exercise_name || "",

      sets: [
        ...card.querySelectorAll("[data-mc-set]")
      ].map((row, i) => ({
        set: i + 1,
        weight: row.querySelector(
          "[data-mc-weight]"
        )?.value || "",
        reps: num(row.querySelector(
          "[data-mc-reps]"
        )?.value),
        done: !!row.querySelector(
          "[data-mc-tick]"
        )?.classList.contains("done")
      }))
    }));
  }

  function totals(data = readSets()) {
    let all = 0;
    let done = 0;
    let volume = 0;

    data.forEach(exercise => {
      (exercise.sets || []).forEach(set => {
        all++;

        if (set.done) {
          done++;
          volume += num(set.weight) * num(set.reps);
        }
      });
    });

    return {
      all,
      done,
      volume: format(volume),
      percent: all
        ? Math.round(done / all * 100)
        : 0
    };
  }

  function backupKey() {
    return session && userId
      ? `mana-coach-draft-v1:${userId}:${session.programId}:${session.day.id}`
      : "";
  }

  function backup() {
    if (!session) return;

    try {
      localStorage.setItem(backupKey(), JSON.stringify({
        updatedAt: Date.now(),
        elapsed: elapsed(),
        exercises: readSets(),
        finishers,
        rating,
        comment
      }));
    } catch (_) {}
  }

  function readBackup() {
    try {
      return JSON.parse(
        localStorage.getItem(backupKey()) || "null"
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

    syncTicks();
    updateNavigation();
    backup();

    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      saveTimer = null;
      void saveSession();
    }, 1000);
  }

  function saveSession(completed = false) {
    if (!session) return Promise.resolve(false);

    const active = session;
    const exerciseData = readSets();
    const result = totals(exerciseData);

    if (!active.logId) {
      active.logId = crypto.randomUUID();
    }

    const seconds = elapsed();

    const snapshot = {
      id: active.logId,
      user_id: userId,
      program_id: active.programId,
      program_day_id: active.day.id,
      week_number: num(active.day.week_number),
      day_number: num(active.day.day_number),
      session_name: active.day.title || "Workout",
      status: completed ? "completed" : "in_progress",
      started_at: new Date(
        Date.now() - seconds * 1000
      ).toISOString(),
      completed_at: completed
        ? new Date().toISOString()
        : null,
      duration_seconds: seconds,
      exercises: exerciseData,
      finishers: JSON.parse(JSON.stringify(finishers)),
      workout_rating: rating || null,
      workout_comment: comment.trim() || null,
      completed_sets: result.done,
      total_sets: result.all,
      total_volume: result.volume,
      updated_at: new Date().toISOString()
    };

    const operation = saveQueue
      .catch(() => false)
      .then(async () => {
        const client = await db();

        if (await signedInUser() !== userId) {
          throw Error("Sign-in changed");
        }

        const response = await client
          .from("coach_workout_logs")
          .upsert(snapshot, { onConflict: "id" });

        if (response.error) throw response.error;

        if (completed) clearBackup();

        return true;
      })
      .catch(error => {
        console.warn("[Mana Coach Save]", error);

        const status =
          $("mcCompleteStatus") || $("mcFinisherStatus");

        if (status) {
          status.textContent =
            "Cloud save failed: " +
            (error.message || error);
        }

        return false;
      });

    saveQueue = operation;
    return operation;
  }

  async function openDay(id) {
    const day = program?.days.find(d => d.id === id);
    if (!day || !userId || !assignment) return;

    const token = ++openToken;

    stopClock();

    session = {
      day,
      programId: program.program.id,
      exercises: program.exercises.filter(
        e => e.program_day_id === id
      ),
      logId: null
    };

    elapsedBase = 0;
    startedAt = Date.now();
    currentSlide = 0;
    finishers = {};
    rating = 0;
    comment = "";
    coreTicks = [[], [], []];
    coreRound = 0;

    showModal(`
      <div class="mc-position">
        <span id="mcPosition">Exercise 1</span>
        <small>Swipe left / right</small>
      </div>

      <div id="mcDots" class="mc-dots"></div>

      <div id="mcCarousel" class="mc-carousel">
        <div class="mc-slide">
          <p class="mc-status">
            Loading your previous sets…
          </p>
        </div>
      </div>

      <div class="mc-nav">
        <button type="button"
          id="mcPrevious" data-mc-previous>
          ‹ PREVIOUS
        </button>
        <button type="button"
          class="next" id="mcNext" data-mc-next>
          NEXT ›
        </button>
      </div>
    `);

    let previous = [];
    let fromCompleted = false;

    try {
      const client = await db();

      const result = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("program_id", session.programId)
        .eq("program_day_id", id)
        .order("updated_at", { ascending: false })
        .limit(12);

      if (result.error) throw result.error;
      if (token !== openToken) return;

      const active = (result.data || []).find(
        x => x.status === "in_progress"
      );

      const completed = (result.data || []).find(
        x => x.status === "completed"
      );

      const local = readBackup();

      if (active) {
        session.logId = active.id;
        elapsedBase = num(active.duration_seconds);
      }

      previous =
        active?.exercises ||
        completed?.exercises ||
        [];

      fromCompleted = !active && !!completed;

      finishers = active?.finishers || {};
      rating = num(active?.workout_rating);
      comment = active?.workout_comment || "";

      if (
        local?.exercises &&
        (!active ||
          num(local.updatedAt) >
          Date.parse(active.updated_at))
      ) {
        previous = local.exercises;
        finishers = local.finishers || {};
        rating = num(local.rating);
        comment = local.comment || "";
        elapsedBase = num(local.elapsed);
        fromCompleted = false;
      }

      if (finishers.core?.completed) {
        const indices = coreRoutine().map((_, i) => i);
        coreTicks = [
          [...indices],
          [...indices],
          [...indices]
        ];
      }

    } catch (error) {
      console.warn("[Mana Coach Restore]", error);
    }

    if (token !== openToken || !session) return;

    $("mcCarousel").innerHTML =
      session.exercises.map(exercise => `
        <div class="mc-slide">
          ${exerciseHTML(
            exercise,
            previous,
            fromCompleted
          )}
        </div>
      `).join("") +
      `
        <div class="mc-slide">
          ${finalHTML()}
        </div>
      `;

    document.querySelectorAll(
      `#${IDS.modal} .mc-muscle-frame img`
    ).forEach(image => {
      image.addEventListener("error", () => {
        const fallback = document.createElement("span");
        fallback.className = "mc-kicker";
        fallback.textContent = image.alt;
        image.replaceWith(fallback);
      }, { once: true });
    });

    const carousel = $("mcCarousel");

    carousel.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        if (!carousel.clientWidth) return;

        currentSlide = Math.max(
          0,
          Math.min(
            slides().length - 1,
            Math.round(
              carousel.scrollLeft / carousel.clientWidth
            )
          )
        );

        updateNavigation();
        fitCarousel();
      }, 75);
    }, { passive: true });

    resizeObserver?.disconnect();

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(fitCarousel);

      slides().forEach(page =>
        resizeObserver.observe(page)
      );
    }

    if (finishers.cardio?.completed ||
        finishers.core?.completed) {
      refreshFinal();
    }

    navigate(0, false);
  }

  function summaryHTML(record) {
    const sets = totals(record.exercises);
    const metric = (label, value, sub) => `
      <div class="mc-summary-stat">
        <small>${label}</small>
        <strong>${value}</strong>
        <small>${sub}</small>
      </div>
    `;

    const notes = [];

    if (record.finishers?.cardio?.completed) {
      notes.push(
        "✓ Cardio: " +
        esc(record.finishers.cardio.equipment) +
        " • " +
        num(record.finishers.cardio.durationMinutes) +
        " minutes"
      );
    }

    if (record.finishers?.core?.completed) {
      notes.push("✓ Core: 3 rounds completed");
    }

    if (record.workout_rating) {
      notes.push(
        "Workout rating: " +
        record.workout_rating + "/5"
      );
    }

    if (record.workout_comment) {
      notes.push(
        "Comment: " + esc(record.workout_comment)
      );
    }

    return `
      <div class="mc-summary">
        <div class="mc-summary-check">✓</div>

        <span class="mc-kicker">
          MANA STRENGTH
        </span>

        <h1>Workout Complete</h1>

        <p class="mc-muted">
          ${esc(record.session_name)}
        </p>

        <div class="mc-summary-grid">
          ${metric(
            "Sets",
            `${sets.done}/${sets.all}`,
            "Completed"
          )}

          ${metric(
            "Completion",
            `${sets.percent}%`,
            "Session"
          )}

          ${metric(
            "Volume",
            `${sets.volume} kg`,
            "Total lifted"
          )}

          ${metric(
            "Time",
            clockText(record.duration_seconds),
            "Workout duration"
          )}
        </div>

        <div class="mc-summary-note">
          <strong>Session complete.</strong>
          <div>
            Strong work. Recover well and keep building.
          </div>

          ${notes.map(line => `
            <div>${line}</div>
          `).join("")}
        </div>

        <button type="button"
          class="mc-primary"
          data-mc-view-progress>
          VIEW PROGRESS →
        </button>

        <button type="button"
          class="mc-secondary"
          style="width:100%;margin-top:9px"
          data-mc-program-back>
          BACK TO COACH PROGRAM
        </button>
      </div>
    `;
  }

  async function completeWorkout() {
    if (!session) return;

    const result = totals();

    if (!result.done) {
      const status = $("mcCompleteStatus");

      if (status) {
        status.textContent =
          "Complete at least one set, or use " +
          "Tick All Workout.";
      }

      return;
    }

    clearTimeout(saveTimer);
    backup();

    const button = document.querySelector(
      `[data-mc-complete]`
    );

    if (button) button.disabled = true;

    const record = {
      session_name: session.day.title || "Workout",
      duration_seconds: elapsed(),
      exercises: readSets(),
      finishers: JSON.parse(JSON.stringify(finishers)),
      workout_rating: rating,
      workout_comment: comment
    };

    const saved = await saveSession(true);

    if (!saved) {
      if (button) button.disabled = false;
      return;
    }

    stopClock();
    session = null;

    showModal(summaryHTML(record));

    progressLoadedAt = 0;
    renderVersion++;

    window.dispatchEvent(
      new CustomEvent("mana:coach-workout-saved", {
        detail: {
          programId: program?.program?.id
        }
      })
    );
  }

  function backToProgram() {
    ++openToken;

    if (session) {
      backup();
      void saveSession();
    }

    stopClock();
    resizeObserver?.disconnect();
    session = null;

    renderProgram();
  }

  function tickAll(root) {
    const buttons = [
      ...(root?.querySelectorAll("[data-mc-tick]") || [])
    ];

    buttons.forEach(button => {
      button.classList.add("done");
      button.setAttribute("aria-pressed", "true");
    });

    if (buttons.length) localEdit();
  }

  /*
    PROGRESS — SAME MANA STRENGTH
    LAYOUT, COACH WORKOUT DATA
  */

  function rangeLogs(logs) {
    const now = new Date();
    const start = new Date(now);

    if (progressPeriod === "daily") {
      start.setHours(0, 0, 0, 0);
    } else if (progressPeriod === "weekly") {
      const day = (now.getDay() + 6) % 7;
      start.setDate(now.getDate() - day);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }

    return logs.filter(log =>
      new Date(
        log.completed_at || log.updated_at
      ) >= start
    );
  }

  function exerciseMap(logs) {
    const map = new Map();

    logs.slice().reverse().forEach(log => {
      (log.exercises || []).forEach(exercise => {
        const name = exercise.name || "Exercise";

        if (!map.has(name)) map.set(name, []);

        const completed = (exercise.sets || [])
          .filter(set => set.done);

        if (!completed.length) return;

        const best = Math.max(
          0,
          ...completed.map(set => num(set.weight))
        );

        const maxSet = completed.find(
          set => num(set.weight) === best
        );

        const volume = completed.reduce(
          (sum, set) =>
            sum + num(set.weight) * num(set.reps),
          0
        );

        map.get(name).push({
          date: log.completed_at || log.updated_at,
          weight: best,
          reps: num(maxSet?.reps),
          volume: format(volume),
          e1rm: format(
            best * (1 + num(maxSet?.reps) / 30)
          )
        });
      });
    });

    return map;
  }

  function coachMetric(label, percent, sub) {
    percent = Math.max(
      0,
      Math.min(100, Math.round(num(percent)))
    );

    return `
      <div class="mana-v993-metric">
        <div class="mana-v993-metric-label">
          ${esc(label)}
        </div>

        <div class="mana-v993-metric-value">
          ${percent}%
        </div>

        <div class="mana-v993-metric-sub">
          ${esc(sub)}
        </div>

        <div class="mana-v993-track">
          <div class="mana-v993-fill"
            style="width:${percent}%"></div>
        </div>
      </div>
    `;
  }

  function coachRow(title, description, value) {
    return `
      <div class="mana-v993-row">
        <div>
          <div class="mana-v993-row-title">
            ${esc(title)}
          </div>
          <div class="mana-v993-row-sub">
            ${esc(description)}
          </div>
        </div>

        <div class="mana-v993-row-value">
          ${esc(value)}
        </div>
      </div>
    `;
  }

  function progressDetailHTML(logs) {
    const map = exerciseMap(logs);

    const panel = (kicker, title, body) => `
      <section class="mana-v993-panel">
        <div class="mana-v993-panel-head">
          <div>
            <div class="mana-v993-panel-kicker">
              ${esc(kicker)}
            </div>
            <h3>${esc(title)}</h3>
          </div>
        </div>
        ${body}
      </section>
    `;

    if (progressDetail === "workouts") {
      const volume = logs.reduce(
        (sum, log) => sum + num(log.total_volume),
        0
      );

      const totalsHTML = `
        <div class="mana-v993-summary-grid">
          ${[
            ["WORKOUTS", logs.length],
            ["VOLUME", format(volume) + " kg"],
            ["EXERCISES", map.size]
          ].map(([label, value]) => `
            <div class="mana-v993-summary">
              <span>${esc(label)}</span>
              <strong>${esc(value)}</strong>
            </div>
          `).join("")}
        </div>
      `;

      const rows = logs.map(log => `
        <details class="mc-history">
          <summary>
            ${esc(log.session_name || "Workout")}
          </summary>

          <small>
            ${dateText(log.completed_at)}
            • Week ${esc(log.week_number)}
            • Day ${esc(log.day_number)}
          </small>

          <small>
            ${num(log.completed_sets)}/${num(log.total_sets)}
            sets • ${format(log.total_volume)} kg
            • ${clockText(log.duration_seconds)}
          </small>

          ${(log.exercises || []).map(exercise => `
            <div class="mc-history-exercise">
              <strong>${esc(exercise.name)}</strong>
              <div>
                ${(exercise.sets || []).map(set => `
                  Set ${num(set.set)}:
                  ${format(set.weight)} kg ×
                  ${num(set.reps)} reps
                  ${set.done ? "✓" : ""}
                `).join(" • ")}
              </div>
            </div>
          `).join("")}

          ${log.finishers?.cardio?.completed
            ? `<small>
                Cardio: ${esc(log.finishers.cardio.equipment)}
                • ${num(log.finishers.cardio.durationMinutes)}
                minutes ✓
              </small>`
            : ""}

          ${log.finishers?.core?.completed
            ? `<small>Core: 3 rounds ✓</small>`
            : ""}

          ${log.workout_rating
            ? `<small>
                Rating: ${num(log.workout_rating)}/5
              </small>`
            : ""}

          ${log.workout_comment
            ? `<p class="mc-muted">
                ${esc(log.workout_comment)}
              </p>`
            : ""}
        </details>
      `).join("");

      return panel(
        "TRAINING HISTORY",
        "Workouts Complete",
        totalsHTML + (rows ||
          '<div class="mana-v993-empty">No completed workouts in this period.</div>')
      );
    }

    if (progressDetail === "pbs") {
      const bests = [...map.entries()].map(
        ([name, entries]) => ({
          name,
          best: entries.reduce(
            (a, b) => !a || b.e1rm > a.e1rm ? b : a,
            null
          )
        })
      ).sort((a, b) => b.best.e1rm - a.best.e1rm);

      return panel(
        "STRENGTH",
        "Personal Bests",
        bests.map(item => coachRow(
          item.name,
          `${item.best.weight} kg × ${item.best.reps} reps`,
          `${item.best.e1rm} kg E1RM`
        )).join("") ||
        '<div class="mana-v993-empty">No recorded lifts yet.</div>'
      );
    }

    if (progressDetail === "exercise") {
      const names = [...map.keys()].sort();

      if (!names.length) {
        return panel(
          "EXERCISES",
          "By Exercise",
          '<div class="mana-v993-empty">Exercise history will appear here.</div>'
        );
      }

      if (!map.has(progressExercise)) {
        progressExercise = names[0];
      }

      const options = `
        <select id="mcProgressExercise"
          aria-label="Select exercise">
          ${names.map(name => `
            <option value="${esc(name)}"
              ${name === progressExercise
                ? "selected" : ""}>
              ${esc(name)}
            </option>
          `).join("")}
        </select>
      `;

      const rows = (map.get(progressExercise) || [])
        .slice().reverse().map(entry => coachRow(
          dateText(entry.date),
          `${entry.weight} kg × ${entry.reps} reps • ${entry.volume} kg volume`,
          `${entry.e1rm} kg E1RM`
        )).join("");

      return panel("EXERCISES", "By Exercise",
        options + rows);
    }

    const entries = [...map.entries()].flatMap(
      ([name, values]) => values.map(
        entry => ({ name, ...entry })
      )
    ).sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    return panel(
      "STRENGTH",
      "Weight Progression",
      entries.map(entry => coachRow(
        entry.name,
        `${dateText(entry.date)} • ${entry.reps} reps`,
        `${entry.weight} kg`
      )).join("") ||
      '<div class="mana-v993-empty">Weight history will appear here.</div>'
    );
  }

  function coachProgressHTML() {
    const logs = rangeLogs(coachLogs);

    const sets = logs.reduce(
      (sum, log) => sum + num(log.total_sets), 0
    );

    const completedSets = logs.reduce(
      (sum, log) => sum + num(log.completed_sets), 0
    );

    const cardioCount = logs.filter(
      log => log.finishers?.cardio?.completed
    ).length;

    const coreCount = logs.filter(
      log => log.finishers?.core?.completed
    ).length;

    const ratings = logs.filter(
      log => num(log.workout_rating) > 0
    );

    const average = ratings.length
      ? ratings.reduce(
          (sum, log) => sum + num(log.workout_rating),
          0
        ) / ratings.length
      : 0;

    const count = logs.length || 1;

    return `
      <div class="mana-v993-head">
        <div class="mana-v993-kicker">
          MANA STRENGTH • COACH PROGRAMS
        </div>

        <h2>Your Progress</h2>

        <p>
          Your coach-assigned workouts,
          using the Mana Strength progress layout.
        </p>
      </div>

      <div class="mana-v993-periods">
        ${[
          ["daily", "DAILY"],
          ["weekly", "WEEKLY"],
          ["monthly", "MONTHLY"]
        ].map(([key, label]) => `
          <button type="button"
            class="mana-v993-period
              ${progressPeriod === key ? "active" : ""}"
            data-mc-period="${key}">
            ${label}
          </button>
        `).join("")}
      </div>

      <div class="mana-v993-metrics">
        ${coachMetric(
          "WORKOUTS",
          sets ? completedSets / sets * 100 : 0,
          `${logs.length} completed sessions`
        )}

        ${coachMetric(
          "CARDIO",
          cardioCount / count * 100,
          `${cardioCount} sessions with cardio`
        )}

        ${coachMetric(
          "CORE",
          coreCount / count * 100,
          `${coreCount} sessions with core`
        )}

        ${coachMetric(
          "RATING",
          average / 5 * 100,
          ratings.length
            ? `${average.toFixed(1)}/5 average`
            : "No ratings yet"
        )}
      </div>

      <div class="mana-v993-detail-nav">
        ${[
          ["weight", "WEIGHT PROGRESSION"],
          ["pbs", "PERSONAL BESTS"],
          ["exercise", "BY EXERCISE"],
          ["workouts", "WORKOUTS COMPLETE"]
        ].map(([key, label]) => `
          <button type="button"
            class="mana-v993-detail-btn
              ${progressDetail === key ? "active" : ""}"
            data-mc-detail="${key}">
            ${label}
          </button>
        `).join("")}
      </div>

      <div id="mcProgressDetails">
        ${progressDetailHTML(logs)}
      </div>

      ${progressError
        ? `<p class="mc-muted">
            ${esc(progressError)}
          </p>`
        : ""}
    `;
  }

  function mountProgress() {
    if (!progressTabOpen()) return;

    const root = $(IDS.progressRoot);
    if (!root) return;

    let switcher = $(IDS.progressSwitch);
    let panel = $(IDS.progress);

    if (!switcher) {
      switcher = document.createElement("div");
      switcher.id = IDS.progressSwitch;

      switcher.innerHTML = `
        <button type="button"
          data-mc-progress-mode="generated">
          My Workouts
        </button>

        <button type="button"
          data-mc-progress-mode="coach">
          Coach Programs
        </button>
      `;
    }

    if (!panel) {
      panel = document.createElement("section");
      panel.id = IDS.progress;
    }

    if (switcher.parentElement !== root) {
      root.prepend(switcher);
    }

    if (panel.parentElement !== root) {
      switcher.after(panel);
    }

    root.classList.toggle(
      "mc-coach-progress",
      progressMode === "coach"
    );

    switcher.querySelectorAll("button").forEach(b => {
      const active =
        b.dataset.mcProgressMode === progressMode;

      b.classList.toggle("active", active);
    });

    if (progressMode === "coach") {
      const signature = [
        progressUser,
        progressLoadedAt,
        progressPeriod,
        progressDetail,
        progressExercise,
        progressLoading,
        progressError,
        renderVersion
      ].join("|");

      if (panel.dataset.signature !== signature) {
        panel.innerHTML = progressLoading
          ? '<p class="mc-muted">Loading coach workouts…</p>'
          : coachProgressHTML();

        panel.dataset.signature = signature;
      }
    }
  }

  async function loadProgress(force = false) {
    if (!progressTabOpen()) return;
    if (progressLoading) return;

    if (
      !force &&
      Date.now() - progressLoadedAt < 15000 &&
      progressUser
    ) {
      mountProgress();
      return;
    }

    progressLoading = true;
    progressError = "";
    mountProgress();

    const token = ++progressRequest;

    try {
      const client = await db();
      const current = await signedInUser();

      if (!current) {
        coachLogs = [];
        progressUser = "";
        progressError = "Sign in to see workout history.";
        return;
      }

      const result = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", current)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(500);

      if (result.error) throw result.error;
      if (token !== progressRequest) return;

      progressUser = current;
      coachLogs = result.data || [];
      progressLoadedAt = Date.now();

    } catch (error) {
      console.warn("[Mana Coach Progress]", error);
      progressError =
        "Unable to load coach workout results: " +
        (error.message || error);
    } finally {
      progressLoading = false;
      renderVersion++;
      mountProgress();
    }
  }

  function goToProgress() {
    closeModal();
    progressMode = "coach";

    const button = document.querySelector(
      '#manaV83Tabs [data-v83-tab="progress"]'
    );

    button?.click();

    setTimeout(() => {
      mountProgress();
      void loadProgress(true);
    }, 250);
  }

  /*
    INTERACTIONS
  */

  function handleClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    let button;

    if ((button = target.closest("[data-mc-mode]"))) {
      setWorkoutMode(button.dataset.mcMode);
      return;
    }

    if ((button = target.closest(
      "[data-mc-progress-mode]"
    ))) {
      progressMode = button.dataset.mcProgressMode;
      mountProgress();

      if (progressMode === "coach") {
        void loadProgress();
      }

      return;
    }

    if ((button = target.closest("[data-mc-period]"))) {
      progressPeriod = button.dataset.mcPeriod;
      renderVersion++;
      mountProgress();
      return;
    }

    if ((button = target.closest("[data-mc-detail]"))) {
      progressDetail = button.dataset.mcDetail;
      renderVersion++;
      mountProgress();
      return;
    }

    if (target.closest("[data-mc-back]")) {
      if (session) backToProgram();
      else closeModal();
      return;
    }

    if (target.closest("[data-mc-program-back]")) {
      backToProgram();
      return;
    }

    if (target.closest("[data-mc-view-progress]")) {
      goToProgress();
      return;
    }

    if ((button = target.closest("[data-mc-program]"))) {
      void openProgram(button.dataset.mcProgram);
      return;
    }

    if ((button = target.closest("[data-mc-week]"))) {
      week = num(button.dataset.mcWeek);
      renderProgram();
      return;
    }

    if ((button = target.closest("[data-mc-start]"))) {
      void openDay(button.dataset.mcStart);
      return;
    }

    if ((button = target.closest("[data-mc-demo]"))) {
      const name = button.dataset.mcDemo;
      const fn = window.MANA_EXERCISE_VISUALS?.openDemo;

      if (typeof fn === "function") {
        void fn(name);
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

    if (target.closest("[data-mc-previous]")) {
      navigate(currentSlide - 1);
      return;
    }

    if (target.closest("[data-mc-next]")) {
      navigate(currentSlide + 1);
      return;
    }

    if ((button = target.closest("[data-mc-slide]"))) {
      navigate(num(button.dataset.mcSlide));
      return;
    }

    if ((button = target.closest("[data-mc-tick]"))) {
      button.classList.toggle("done");
      button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("done"))
      );
      localEdit();
      return;
    }

    if ((button = target.closest(
      "[data-mc-tick-exercise]"
    ))) {
      tickAll(button.closest("[data-mc-ex]"));
      return;
    }

    if (target.closest("[data-mc-tick-workout]")) {
      tickAll($("mcCarousel"));
      return;
    }

    if ((button = target.closest("[data-mc-rating]"))) {
      rating = num(button.dataset.mcRating);

      document.querySelectorAll(
        `[data-mc-rating]`
      ).forEach(b => {
        b.classList.toggle(
          "active",
          num(b.dataset.mcRating) === rating
        );
      });

      localEdit();
      return;
    }

    if ((button = target.closest(
      "[data-mc-finisher]"
    ))) {
      showFinisher(button.dataset.mcFinisher);
      return;
    }

    if ((button = target.closest("[data-mc-equipment]"))) {
      cardioEquipment = button.dataset.mcEquipment;
      showFinisher("cardio");
      return;
    }

    if ((button = target.closest("[data-mc-minutes]"))) {
      cardioMinutes = num(button.dataset.mcMinutes);
      showFinisher("cardio");
      return;
    }

    if (target.closest("[data-mc-cardio-save]")) {
      void saveFinisher("cardio");
      return;
    }

    if ((button = target.closest(
      "[data-mc-retry-finisher]"
    ))) {
      void saveFinisher(button.dataset.mcRetryFinisher);
      return;
    }

    if ((button = target.closest(
      "[data-mc-core-round]"
    ))) {
      coreRound = num(button.dataset.mcCoreRound);
      showFinisher("core");
      return;
    }

    if (target.closest("[data-mc-core-tick-round]")) {
      coreTicks[coreRound] =
        coreRoutine().map((_, i) => i);

      showFinisher("core");
      return;
    }

    if (target.closest("[data-mc-core-tick-all]")) {
      const indices = coreRoutine().map((_, i) => i);

      coreTicks = [
        [...indices],
        [...indices],
        [...indices]
      ];

      showFinisher("core");
      return;
    }

    if (target.closest("[data-mc-core-next]")) {
      coreRound = Math.min(2, coreRound + 1);
      showFinisher("core");
      return;
    }

    if (target.closest("[data-mc-core-save]")) {
      void saveFinisher("core");
      return;
    }

    if (target.closest("[data-mc-finisher-close]")) {
      $("mcFinisherDetails").innerHTML = "";
      fitCarousel();
      return;
    }

    if (target.closest("[data-mc-complete]")) {
      void completeWorkout();
    }
  }

  function handleInput(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.id === "mcProgressExercise") {
      progressExercise = target.value;
      renderVersion++;
      mountProgress();
      return;
    }

    if (!target.closest("#" + IDS.modal)) return;

    if (target.matches("[data-mc-weight]")) {
      const card = target.closest("[data-mc-ex]");

      card?.querySelectorAll("[data-mc-weight]")
        .forEach(input => {
          if (input !== target) {
            input.value = target.value;
          }
        });

      localEdit();
      return;
    }

    if (target.matches("[data-mc-reps]")) {
      localEdit();
      return;
    }

    if (target.id === "mcWorkoutComment") {
      comment = target.value.slice(0, 500);
      localEdit();
      return;
    }

    if (target.matches("[data-mc-core-check]")) {
      const index = num(target.dataset.mcCoreCheck);
      const current = new Set(coreTicks[coreRound]);

      if (target.checked) current.add(index);
      else current.delete(index);

      coreTicks[coreRound] = [
        ...current
      ].sort((a, b) => a - b);

      showFinisher("core");
    }
  }

  function refresh() {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
      if (workoutTabOpen()) {
        ensureWorkoutRoots();
        renderAssignments();

        if (workoutMode === "coach") {
          void loadAssignments();
        }
      }

      if (legacyOpen()) {
        void loadAssignments();
      }

      if (progressTabOpen()) {
        mountProgress();

        if (progressMode === "coach") {
          void loadProgress();
        }
      }
    }, 170);
  }

  function init() {
    installStyles();
    ensureModal();

    try {
      workoutMode =
        sessionStorage.getItem(
          "mana-strength-workout-view-100205"
        ) === "coach"
          ? "coach"
          : "generated";
    } catch (_) {}

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);

    document.addEventListener("change", event => {
      if (event.target?.matches?.(
        "[data-mc-core-check],#mcProgressExercise"
      )) {
        handleInput(event);
      }
    });

    [
      "mana:program-tab-change",
      "mana:profile-synced",
      "pageshow",
      "mana:coach-workout-saved"
    ].forEach(name => {
      window.addEventListener(name, refresh);
    });

    document.addEventListener("click", event => {
      if (event.target.closest(
        '#manaV83Tabs [data-v83-tab]'
      )) {
        setTimeout(refresh, 120);
      }
    }, true);

    const holder = $("manaV83Content");

    if (holder) {
      new MutationObserver(() => {
        if (
          workoutTabOpen() &&
          (!$(IDS.switcher) || !$(IDS.panel))
        ) {
          refresh();
        }

        if (
          progressTabOpen() &&
          (!$(IDS.progressSwitch) ||
           !$(IDS.progress))
        ) {
          refresh();
        }
      }).observe(holder, { childList: true });
    }

    window.addEventListener("resize", fitCarousel);

    window.addEventListener("mana:logout", () => {
      userId = "";
      assignments = [];
      assignmentsLoadedAt = 0;
      coachLogs = [];
      progressUser = "";
      progressLoadedAt = 0;
      ++progressRequest;

      closeModal();
      refresh();
    });

    window.refreshManaAssignedPrograms =
      () => loadAssignments(true);

    window.refreshManaCoachProgress =
      () => loadProgress(true);

    window.MANA_CLIENT_CUSTOM_PROGRAM_BUILD = BUILD;

    refresh();

    console.log(
      "[Mana Movement] Coach Programs Build " + BUILD
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
