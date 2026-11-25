
/*
 MANA MOVEMENT — COACH WORKOUTS
 COMPLETE BUILD 100211

 Full replacement:
 v10_02_client_custom_programs_100200.js

 - Coach workout carousel
 - Navigation arrows immediately below active card
 - Original muscle illustrations and demos
 - Repeat weight, individual reps and Tick All
 - Cardio and Core finishers
 - Rating and comments
 - Original-style Workout Complete summary
 - Coach workout data linked to Progress tab
 - Separate Supabase coach workout history
*/

(() => {
  "use strict";

  const BUILD = "100211";
  const SW = "manaV1002WorkoutSwitch";
  const PANEL = "manaV1002CoachPanel";
  const LEGACY = "manaV1002AssignedPrograms";
  const MODAL = "manaV1002CustomProgramModal";
  const STYLE = "mana-v1002-client-custom-style";
  const MODE_KEY = "mana-strength-workout-view-100205";
  const PROGRESS = "m1002CoachProgress";
  const ROOT = "manaV993StrengthProgress";

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
  let loadSeq = 0;

  let program = null;
  let assignment = null;
  let week = 1;
  let session = null;
  let openSeq = 0;
  let slide = 0;

  let saveTimer = 0;
  let saveChain = Promise.resolve();
  let elapsedBase = 0;
  let startedAt = 0;
  let clockTimer = 0;
  let scrollTimer = 0;

  let finishers = {};
  let cardioEquipment = "Bike";
  let cardioMinutes = 10;
  let coreRound = 0;
  let coreTicks = [[], [], []];

  let rating = 0;
  let comment = "";

  let progressLogs = [];
  let progressUser = "";
  let progressLoading = false;
  let progressLoaded = 0;
  let progressSequence = 0;

  let refreshTimer = 0;
  let resizeObserver = null;

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
      throw Error("Cloud connection unavailable");
    }

    return await window.supabaseClient();
  }

  function clock() {
    return elapsedBase + (
      startedAt
        ? Math.floor((Date.now() - startedAt) / 1000)
        : 0
    );
  }

  function time(seconds) {
    const value = Math.max(0, Number(seconds) || 0);

    return (
      String(Math.floor(value / 60)).padStart(2, "0") +
      ":" +
      String(Math.floor(value % 60)).padStart(2, "0")
    );
  }

  function stopClock() {
    if (clockTimer) clearInterval(clockTimer);

    clockTimer = 0;

    if (startedAt) {
      elapsedBase = clock();
      startedAt = 0;
    }
  }

  function startClock() {
    if (!startedAt) startedAt = Date.now();

    if (clockTimer) clearInterval(clockTimer);

    clockTimer = setInterval(() => {}, 1000);
  }

  function workoutTab() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()?.toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab].active'
      )?.dataset.v83Tab === "program"
    );
  }

  function progressTab() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()?.toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab].active'
      )?.dataset.v83Tab === "progress" &&
      $(ROOT)
    );
  }

  function legacyTab() {
    return !!(
      $("clientProgramsView") &&
      !$("clientProgramsView").classList.contains("hide")
    );
  }

  function icon() {
    return `
      <svg viewBox="0 0 24 24"
        width="25" height="25"
        fill="none"
        stroke="#ff8126"
        stroke-width="2">
        <path d="M3 9v6M6 6v12M9 10v4M15 10v4M18 6v12M21 9v6M9 12h6"/>
      </svg>
    `;
  }

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${SW} {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
        padding:6px;
        margin:12px 0 15px;
        background:#101113;
        border:1px solid #30343a;
        border-radius:15px;
      }

      #${SW} button {
        min-width:0;
        min-height:46px;
        border:1px solid transparent;
        border-radius:11px;
        background:#191b1f;
        color:#d3d6db;
        font-size:12px;
        font-weight:800;
        font-family:inherit;
        cursor:pointer;
      }

      #${SW} button.active {
        color:#ff8126;
        background:#251b15;
        border-color:#ff8126;
      }

      #manaV83Content.m1002-coach-mode
      >:not(#${SW}):not(#${PANEL}) {
        display:none!important;
      }

      #manaV83Content.m1002-coach-mode>#${SW} {
        display:grid!important;
      }

      #${PANEL} {
        display:none;
        margin-bottom:16px;
      }

      #manaV83Content.m1002-coach-mode>#${PANEL} {
        display:block!important;
      }

      #${PANEL} .m1002-shell {
        background:#101113;
        border:1px solid #34383e;
        border-radius:17px;
        overflow:hidden;
        color:#fff;
      }

      #${PANEL} .m1002-head {
        background:#121315;
        padding:18px;
        border-bottom:1px solid #292d32;
      }

      #${PANEL} .m1002-head h3 {
        color:#fff;
        font-size:20px;
        margin:5px 0;
      }

      #${PANEL} .m1002-head p {
        font-size:12px;
        line-height:1.5;
        color:#adb4bd;
        margin:0;
      }

      #${PANEL} .m1002-body {
        padding:14px;
      }

      .m1002-kicker {
        color:#ff8126!important;
        font-size:10px;
        font-weight:900;
        letter-spacing:.09em;
      }

      .m1002-program {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        width:100%;
        padding:16px;
        margin:0 0 10px;
        text-align:left;
        color:#fff;
        background:#17191c;
        border:1px solid #3b4047;
        border-radius:14px;
        font-family:inherit;
        cursor:pointer;
      }

      .m1002-program strong {
        color:#fff;
        display:block;
        font-size:15px;
      }

      .m1002-program small {
        display:block;
        margin-top:5px;
        color:#b4bac2;
        font-size:12px;
      }

      .m1002-pill {
        flex-shrink:0;
        border:1px solid #794521;
        border-radius:20px;
        color:#ff8126;
        padding:6px 9px;
        font-size:10px;
        font-weight:900;
      }

      .m1002-empty {
        text-align:center;
        background:#17191c;
        padding:22px 15px;
        border:1px solid #353940;
        border-radius:15px;
      }

      .m1002-empty h4 {
        color:#fff;
        margin:8px 0;
        font-size:18px;
      }

      .m1002-empty p {
        color:#b8bec6;
        margin:0;
        font-size:12px;
        line-height:1.6;
      }

      .m1002-empty p:last-child {
        color:#ff8126;
        margin-top:12px;
      }

      .m1002-empty-icon {
        display:grid;
        place-items:center;
        margin:auto;
        width:48px;
        height:48px;
        border-radius:50%;
        border:1px solid #704223;
        background:#261c16;
      }

      #${LEGACY} {
        margin:12px 0;
      }

      #${MODAL} {
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
        gap:8px;
        padding:11px 0;
        background:#050505;
      }

      #${MODAL} .m1002-back,
      #${MODAL} .m1002-secondary {
        min-height:38px;
        padding:9px 12px;
        background:#191b1e;
        border:1px solid #42464d;
        border-radius:10px;
        color:#fff;
        font-weight:800;
        font-size:12px;
      }

      #${MODAL} .m1002-hero {
        background:#111214;
        border:1px solid #34383e;
        border-radius:17px;
        padding:16px;
        margin-bottom:12px;
      }

      #${MODAL} .m1002-hero h2 {
        color:#fff;
        margin:5px 0;
        font-size:22px;
      }

      #${MODAL} .m1002-hero p,
      #${MODAL} .m1002-muted {
        color:#b1b8c1;
        margin:6px 0;
        font-size:12px;
        line-height:1.5;
      }

      #${MODAL} .m1002-weeks {
        display:flex;
        gap:8px;
        overflow-x:auto;
        margin-bottom:13px;
      }

      #${MODAL} .m1002-weeks button {
        flex:0 0 auto;
        padding:11px 13px;
        border:1px solid #444;
        border-radius:10px;
        background:#191b1e;
        color:#ccc;
        font-size:12px;
        font-weight:800;
      }

      #${MODAL} .m1002-weeks button.active {
        border-color:#ff8126;
        background:#261c16;
        color:#ff8126;
      }

      #${MODAL} .mana-v85-day {
        background:#121314;
        border:1px solid #34383e;
        border-radius:16px;
        padding:16px;
        margin-bottom:12px;
        color:#fff;
      }

      #${MODAL} .mana-v85-day h3 {
        color:#fff;
        font-size:18px;
        margin:7px 0;
      }

      #${MODAL} .m1002-primary {
        display:block;
        width:100%;
        min-height:45px;
        background:#ff8126;
        border:0;
        border-radius:12px;
        padding:12px;
        color:#141414;
        font-weight:900;
        font-size:13px;
        margin-top:10px;
      }

      #${MODAL} .m1002-primary:disabled {
        opacity:.5;
      }

      #${MODAL} .m1002-position {
        display:flex;
        justify-content:space-between;
        gap:8px;
        align-items:center;
        margin:3px 0 7px;
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
        margin:8px 0 10px;
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

      /*
       ACTIVE SLIDE HEIGHT FIX:
       The carousel no longer inherits
       the height of its tallest slide.
      */

      #${MODAL} .m1002-carousel {
        display:flex;
        align-items:flex-start;
        overflow-x:auto;
        overflow-y:hidden;
        width:100%;
        scroll-snap-type:x mandatory;
        scroll-behavior:smooth;
        overscroll-behavior-inline:contain;
        -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
        transition:height .15s ease;
      }

      #${MODAL} .m1002-carousel::-webkit-scrollbar {
        display:none;
      }

      #${MODAL} .m1002-slide {
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
        padding:16px;
        margin:0;
        background:#121314!important;
        border:1px solid #34383e!important;
        border-radius:16px;
        color:#fff;
        box-shadow:none;
      }

      #${MODAL} .mana-v64-name {
        color:#fff;
        font-size:18px;
        font-weight:900;
        margin-bottom:6px;
      }

      #${MODAL} .mana-v64-target {
        color:#ff8126;
        font-size:12px;
        line-height:1.5;
      }

      #${MODAL} .m1002-muscle {
        display:flex;
        align-items:center;
        gap:12px;
        padding:11px;
        margin:12px 0;
        border:1px solid #34383e;
        border-radius:13px;
        background:#0b0c0d;
      }

      #${MODAL} .m1002-muscle-frame {
        display:grid;
        place-items:center;
        flex:0 0 105px;
        width:105px;
        height:125px;
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
        color:#ff8126;
        font-size:11px;
        font-weight:900;
        text-align:center;
        padding:8px;
      }

      #${MODAL} .m1002-muscle-copy {
        flex:1;
        min-width:0;
      }

      #${MODAL} .m1002-muscle-copy small {
        display:block;
        color:#ff8126;
        font-size:10px;
        font-weight:900;
        margin-bottom:5px;
      }

      #${MODAL} .m1002-muscle-copy strong {
        display:block;
        color:#fff;
        font-size:13px;
        line-height:1.5;
      }

      #${MODAL} .m1002-demo {
        margin-top:10px;
        padding:9px 11px;
        background:#241b16;
        border:1px solid #714324;
        border-radius:10px;
        color:#ff8126;
        font-size:11px;
        font-weight:900;
      }

      #${MODAL} .m1002-note {
        font-size:12px;
        color:#b9c0c9;
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
        padding:7px;
        background:#1b1d20;
        border:1px solid #454a50;
        border-radius:9px;
        color:#fff;
        text-align:center;
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
       NAVIGATION SITS DIRECTLY
       UNDER THE ACTIVE EXERCISE.
      */

      #${MODAL} .m1002-nav {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin:6px 0 0;
        padding:0;
      }

      #${MODAL} .m1002-nav button {
        min-height:43px;
        background:#191b1e;
        border:1px solid #444;
        border-radius:11px;
        color:#fff;
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
        background:#121314;
        border:1px solid #34383e;
        border-radius:16px;
        padding:16px;
      }

      #${MODAL} .m1002-finishers h3,
      #${MODAL} .m1002-feedback h3 {
        color:#fff;
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
        min-height:70px;
        background:#191b1f;
        border:1px solid #4a4d53;
        border-radius:13px;
        color:#fff;
        font-size:13px;
        font-weight:900;
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
        background:#25272a;
        border:1px solid #44484e;
        border-radius:9px;
        color:#c8ccd2;
        font-size:12px;
        font-weight:800;
      }

      #${MODAL} .m1002-options button.active,
      #${MODAL} .m1002-rating button.active {
        background:#2a201a;
        border-color:#ff8126;
        color:#ff8126;
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
        min-height:85px;
        padding:12px;
        margin-top:8px;
        background:#202226;
        border:1px solid #4a4e54;
        border-radius:10px;
        color:#fff;
        font-family:inherit;
        font-size:14px;
        resize:vertical;
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

      #${MODAL} .m1002-core-item strong,
      #${MODAL} .m1002-core-item small {
        display:block;
      }

      #${MODAL} .m1002-core-item small {
        color:#b5bdc6;
        margin-top:4px;
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
        margin:12px 0 0;
        padding:11px;
        background:#261d16;
        border:1px solid #ff8126;
        border-radius:11px;
        color:#ff8126;
        font-size:12px;
        font-weight:900;
      }

      #${MODAL} .m1002-tick-all.done {
        background:#ff8126;
        color:#111;
      }

      #${MODAL} .m1002-final-complete {
        margin-top:14px;
      }

      /*
       ORIGINAL-STYLE WORKOUT SUMMARY
      */

      #${MODAL} .m1002-summary {
        text-align:center;
        padding:10px 0;
      }

      #${MODAL} .m1002-summary-check {
        display:grid;
        place-items:center;
        width:68px;
        height:68px;
        margin:3px auto 12px;
        border:2px solid #ff8126;
        border-radius:50%;
        background:#251b15;
        color:#ff8126;
        font-size:32px;
        font-weight:900;
      }

      #${MODAL} .m1002-summary h1 {
        color:#fff;
        font-size:26px;
        margin:6px 0;
      }

      #${MODAL} .m1002-summary-name {
        color:#bdc3cb;
        font-size:13px;
        margin:6px 0 18px;
      }

      #${MODAL} .m1002-summary-grid {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin:15px 0;
        text-align:left;
      }

      #${MODAL} .m1002-summary-stat {
        background:#141517;
        border:1px solid #373c43;
        border-radius:14px;
        padding:15px;
      }

      #${MODAL} .m1002-summary-stat small {
        display:block;
        color:#a8b0ba;
        font-size:11px;
      }

      #${MODAL} .m1002-summary-stat strong {
        display:block;
        color:#fff;
        font-size:23px;
        margin:6px 0;
      }

      #${MODAL} .m1002-summary-stat span {
        color:#a8b0ba;
        font-size:10px;
      }

      #${MODAL} .m1002-summary-note {
        background:#111214;
        border:1px solid #34383e;
        border-radius:12px;
        padding:14px;
        text-align:left;
        margin:12px 0;
        color:#c2c7ce;
        font-size:12px;
        line-height:1.7;
      }

      /*
       COACH TRAINING IN PROGRESS TAB
      */

      #${PROGRESS} {
        margin:18px 0 14px;
        padding:15px;
        border:1px solid #353940;
        border-radius:16px;
        background:#111315;
        color:#fff;
      }

      #${PROGRESS} h3 {
        margin:5px 0 7px;
        color:#fff;
        font-size:19px;
      }

      #${PROGRESS} p {
        color:#b0b7c0;
        font-size:12px;
        line-height:1.5;
      }

      #${PROGRESS} .m1002-progress-stats {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
        margin:14px 0;
      }

      #${PROGRESS} .m1002-progress-stat {
        padding:12px;
        background:#1a1c1f;
        border:1px solid #353940;
        border-radius:12px;
      }

      #${PROGRESS} .m1002-progress-stat small {
        display:block;
        font-size:10px;
        color:#aaa;
        margin-bottom:5px;
      }

      #${PROGRESS} .m1002-progress-stat strong {
        font-size:19px;
        color:#fff;
      }

      #${PROGRESS} .m1002-history {
        margin-top:10px;
        padding:12px;
        background:#191b1e;
        border:1px solid #383c42;
        border-radius:11px;
      }

      #${PROGRESS} .m1002-history summary {
        color:#fff;
        cursor:pointer;
        font-size:13px;
        font-weight:800;
        line-height:1.6;
      }

      #${PROGRESS} .m1002-history small {
        display:block;
        color:#aaa;
        font-size:11px;
        margin:3px 0;
      }

      #${PROGRESS} .m1002-history-exercise {
        border-top:1px solid #383c42;
        padding:8px 0;
        color:#c2c8d0;
        font-size:12px;
      }

      #${PROGRESS} .m1002-history-exercise strong {
        color:#fff;
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

        #${PANEL} .m1002-body {
          padding:11px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function modal() {
    let element = $(MODAL);

    if (element) return element;

    element = document.createElement("div");
    element.id = MODAL;

    element.setAttribute("role", "dialog");
    element.setAttribute("aria-modal", "true");

    element.innerHTML = `
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

    document.body.appendChild(element);

    return element;
  }

  function show(html) {
    modal().classList.add("open");
    $("m1002Content").innerHTML = html;
  }

  function ensureRoots() {
    if (!workoutTab()) return null;

    const holder = $("manaV83Content");
    if (!holder) return null;

    let selector = $(SW);

    if (!selector) {
      selector = document.createElement("div");
      selector.id = SW;

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

    $(SW)?.querySelectorAll(
      "[data-m1002-mode]"
    ).forEach(button => {
      const active = button.dataset.m1002Mode === mode;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (mode === "coach") renderPanel();
  }

  function setMode(value) {
    if (!["generated", "coach"].includes(value)) return;

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
    const item = assignment.custom_programs;

    return `
      <button type="button"
        class="m1002-program"
        data-m1002-program="${esc(item.id)}">

        <span>
          <strong>${esc(item.name)}</strong>

          <small>
            ${esc(
              item.goal ||
              item.description ||
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

    const rows = assignments.filter(
      item =>
        item.custom_programs &&
        ["active", "paused", "completed"].includes(
          item.status
        )
    );

    holder.innerHTML = `
      <div class="m1002-shell">
        <div class="m1002-head">
          <small class="m1002-kicker">
            MANA STRENGTH
          </small>

          <h3>Coach Programs</h3>

          <p>
            Personalised training built and
            assigned by your coach.
          </p>
        </div>

        <div class="m1002-body">
          ${rows.length
            ? rows.map(programCard).join("")
            : `
              <div class="m1002-empty">
                <div class="m1002-empty-icon">
                  ${icon()}
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

    const rows = assignments.filter(
      item => item.custom_programs
    );

    holder.innerHTML = rows.length
      ? `
        <h3 style="color:#fff">
          Coach Assigned
        </h3>
        ${rows.map(programCard).join("")}
      `
      : "";
  }

  async function loadAssignments(force = false) {
    if (
      loading ||
      (!force && Date.now() - loadedAt < 20000)
    ) return;

    loading = true;
    renderPanel();

    const token = ++loadSeq;

    try {
      const client = await db();

      const auth = await client.auth.getUser();

      if (auth.error) throw auth.error;

      const userId = auth.data?.user?.id || "";

      if (account !== userId) {
        account = userId;
        assignments = [];
        progressUser = "";
        progressLogs = [];
      }

      if (!userId) return;

      const result = await client
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

      if (result.error) throw result.error;

      const current = await client.auth.getUser();

      if (
        token !== loadSeq ||
        current.data?.user?.id !== userId
      ) return;

      assignments = (result.data || []).filter(
        item => item.custom_programs
      );

      loadedAt = Date.now();

    } catch (error) {
      console.warn(
        "[Mana Coach Programs]",
        error.message || error
      );
    } finally {
      loading = false;
      renderPanel();
      renderLegacy();
    }
  }

  function closeModal() {
    ++openSeq;
    stopClock();

    if (session) {
      backup();
      queueSave();
    }

    session = null;
    assignment = null;
    program = null;

    $(MODAL)?.classList.remove("open");
  }

  function programHeader() {
    const item = program?.program;

    return `
      <section class="m1002-hero">
        <span class="m1002-kicker">
          COACH-ASSIGNED PROGRAM
        </span>

        <h2>
          ${esc(item?.name || "Coach Program")}
        </h2>

        <p>
          ${esc(
            item?.description ||
            item?.goal ||
            "Your personalised training program"
          )}
        </p>
      </section>
    `;
  }

  async function openProgram(id) {
    const selected = assignments.find(
      item => item.custom_programs?.id === id
    );

    if (!selected) return;

    const token = ++openSeq;

    stopClock();
    session = null;
    assignment = selected;

    show(`
      <p class="m1002-status">
        Loading your coach program…
      </p>
    `);

    try {
      const client = await db();
      const auth = await client.auth.getUser();

      if (auth.data?.user?.id !== account) {
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

      const [programResult, dayResult] =
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

      if (programResult.error || dayResult.error) {
        throw programResult.error || dayResult.error;
      }

      const days = dayResult.data || [];
      let exercises = [];

      if (days.length) {
        const result = await client
          .from("custom_program_exercises")
          .select("*")
          .in(
            "program_day_id",
            days.map(day => day.id)
          )
          .order("sort_order");

        if (result.error) throw result.error;

        exercises = result.data || [];
      }

      if (
        token !== openSeq ||
        !$(MODAL)?.classList.contains("open")
      ) return;

      program = {
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
      if (token === openSeq) {
        show(`
          <p class="m1002-status">
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

    const weeks = [
      ...new Set(
        program.days.map(
          day => Number(day.week_number) || 1
        )
      )
    ].sort((a, b) => a - b);

    const cards = program.days
      .filter(
        day => Number(day.week_number) === week
      )
      .map(day => {
        const exerciseCount = program.exercises.filter(
          exercise =>
            exercise.program_day_id === day.id
        ).length;

        return `
          <section class="mana-v85-day">
            <span class="m1002-kicker">
              WEEK ${week}
              • DAY ${esc(day.day_number)}
            </span>

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
      })
      .join("");

    show(
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

        ${cards || `
          <p class="m1002-status">
            No workouts in this week.
          </p>
        `}
      `
    );
  }

  function visual(name) {
    const api = window.MANA_EXERCISE_VISUALS;
    const info = api?.resolve?.(name) || {};

    return {
      target: info.target || "Full Body",
      image:
        api?.muscleAssets?.[
          info.muscle || "fullbody"
        ] || ""
    };
  }

  function muscleHTML(name) {
    const info = visual(name);

    return `
      <div class="m1002-muscle">
        <div class="m1002-muscle-frame">
          ${info.image
            ? `
              <img
                src="${esc(info.image)}"
                alt="Target muscles for ${esc(name)}"
                loading="lazy">

              <span class="m1002-muscle-fallback" hidden>
                ${esc(info.target)}
              </span>
            `
            : `
              <span class="m1002-muscle-fallback">
                ${esc(info.target)}
              </span>
            `}
        </div>

        <div class="m1002-muscle-copy">
          <small>PRIMARY TARGET</small>

          <strong>
            ${esc(info.target)}
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
      ? Math.max(
          1,
          Math.min(100, Number(match[0]))
        )
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

    return CORE[
      (day - 1) % CORE.length
    ];
  }

  function finalHTML() {
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
          Use Tick All if you followed
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
          Your completed sets, finishers
          and feedback will be saved together.
        </p>
      </div>
    `;
  }

  function ratings() {
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

  function finisherStatus() {
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

    ratings();
    fitSlide();
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
          complete the main effort
          and cool down.
        </p>

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
    `;

    fitSlide();
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
              ${current.includes(index) ? "checked" : ""}>

            <span>
              <strong>${esc(name)}</strong>
              <small>${esc(reps)}</small>
            </span>
          </label>
        `).join("")}

        <div class="m1002-options">
          <button type="button"
            data-m1002-core-tick-round>
            TICK ALL ROUND
          </button>

          <button type="button"
            data-m1002-core-tick-all>
            TICK ALL 3 ROUNDS
          </button>
        </div>

        <div class="m1002-options">
          <button type="button"
            data-m1002-finisher-close>
            CLOSE
          </button>

          <button type="button"
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

    fitSlide();
  }

  function slides() {
    return [
      ...($("m1002Carousel")
        ?.querySelectorAll(".m1002-slide") || [])
    ];
  }

  function count() {
    return session?.exercises?.length || 0;
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

  /*
   NEW: Active-card height.
   This prevents the last, taller
   finisher slide from pushing the
   Previous/Next arrows downward.
  */

  function fitSlide() {
    requestAnimationFrame(() => {
      const carousel = $("m1002Carousel");
      const page = slides()[slide];

      if (!carousel || !page) return;

      const height = Math.ceil(page.scrollHeight);

      if (height > 0) {
        carousel.style.height = height + "px";
      }
    });
  }

  function navigate(index, smooth = true) {
    const carousel = $("m1002Carousel");
    const allSlides = slides();

    if (!carousel || !allSlides.length) return;

    slide = Math.max(
      0,
      Math.min(index, allSlides.length - 1)
    );

    fitSlide();

    carousel.scrollTo({
      left: carousel.clientWidth * slide,
      behavior: smooth ? "smooth" : "auto"
    });

    renderNavigation();
  }

  function renderNavigation() {
    const total = count() + 1;

    if ($("m1002Position")) {
      $("m1002Position").textContent =
        slide === count()
          ? "Optional Finishers + Feedback"
          : "Exercise " +
            (slide + 1) +
            " of " +
            count();
    }

    if ($("m1002Dots")) {
      $("m1002Dots").innerHTML =
        Array.from(
          { length: total },
          (_, index) => `
            <button type="button"
              class="m1002-dot
                ${index === slide ? "active" : ""}
                ${index < count() &&
                  completeCard(index)
                    ? "done"
                    : ""}"
              data-m1002-slide="${index}"
              aria-label="${index === count()
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
        slide === count() - 1
          ? "FINISHERS ›"
          : "NEXT ›";
    }

    syncTicks();
    fitSlide();
  }

  function syncTicks() {
    slides().forEach(page => {
      const button = page.querySelector(
        "[data-m1002-tick-exercise]"
      );

      if (!button) return;

      const checks = [
        ...page.querySelectorAll(
          "[data-m1002-tick]"
        )
      ];

      const done =
        !!checks.length &&
        checks.every(
          check => check.classList.contains("done")
        );

      button.classList.toggle("done", done);

      button.textContent = done
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

    const done =
      !!checks.length &&
      checks.every(
        check => check.classList.contains("done")
      );

    button.classList.toggle("done", done);

    button.textContent = done
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
        ...card.querySelectorAll(
          "[data-m1002-set]"
        )
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

  function totals(data = readSets()) {
    let all = 0;
    let done = 0;
    let volume = 0;

    for (const exercise of data) {
      for (const set of exercise.sets) {
        all++;

        if (set.done) {
          done++;

          volume +=
            (Number(set.weight) || 0) *
            (Number(set.reps) || 0);
        }
      }
    }

    return {
      all,
      done,
      volume: Math.round(volume * 10) / 10,

      percent: all
        ? Math.round(done / all * 100)
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
          elapsed: clock(),
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

    renderNavigation();
    backup();

    clearTimeout(saveTimer);

    saveTimer = setTimeout(
      () => queueSave(),
      1000
    );
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
        Date.now() - clock() * 1000
      ).toISOString(),

      completed_at: completed
        ? new Date().toISOString()
        : null,

      duration_seconds: clock(),
      exercises,

      finishers:
        JSON.parse(JSON.stringify(finishers)),

      workout_rating: rating || null,
      workout_comment: comment.trim() || null,
      completed_sets: result.done,
      total_sets: result.all,
      total_volume: result.volume,
      updated_at: new Date().toISOString()
    };

    if (completed && $("m1002SaveStatus")) {
      $("m1002SaveStatus").textContent =
        "Saving completed workout…";
    }

    saveChain = saveChain
      .catch(() => false)
      .then(async () => {
        const client = await db();

        const result = await client
          .from("coach_workout_logs")
          .upsert(snapshot, {
            onConflict: "id"
          });

        if (result.error) throw result.error;

        if (completed) clearBackup();

        return true;
      })
      .catch(error => {
        console.warn("[Mana Coach Save]", error);

        if ($("m1002SaveStatus")) {
          $("m1002SaveStatus").textContent =
            "Cloud save failed — local backup kept. " +
            (error.message || error);
        }

        return false;
      });

    return saveChain;
  }

  async function openDay(id) {
    const day = program?.days.find(
      item => item.id === id
    );

    if (!day || !account || !assignment) return;

    const token = ++openSeq;

    stopClock();

    const exercises = program.exercises.filter(
      exercise =>
        exercise.program_day_id === id
    );

    session = {
      day,
      exercises,
      programId: program.program.id,
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

    show(`
      <div class="m1002-position">
        <span id="m1002Position">
          Exercise 1
        </span>

        <small>Swipe left / right</small>
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

      <p class="m1002-status"
        id="m1002SaveStatus"></p>
    `);

    let prior = [];
    let fromCompleted = false;

    try {
      const client = await db();

      const result = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", account)
        .eq("program_id", session.programId)
        .eq("program_day_id", id)
        .order("updated_at", {
          ascending: false
        })
        .limit(12);

      if (result.error) throw result.error;

      if (
        token !== openSeq ||
        session?.day.id !== id
      ) return;

      const active = (result.data || []).find(
        item => item.status === "in_progress"
      );

      const completed = (result.data || []).find(
        item => item.status === "completed"
      );

      const local = readBackup();

      if (active) {
        session.logId = active.id;

        elapsedBase =
          Number(active.duration_seconds) || 0;
      }

      fromCompleted = !active && !!completed;

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
      if (token !== openSeq) return;

      if ($("m1002SaveStatus")) {
        $("m1002SaveStatus").textContent =
          "Cloud restore unavailable: " +
          (error.message || error);
      }
    }

    if (
      token !== openSeq ||
      session?.day.id !== id
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
            ${finalHTML()}
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

          slide = Math.max(
            0,
            Math.min(
              slides().length - 1,
              Math.round(
                carousel.scrollLeft /
                carousel.clientWidth
              )
            )
          );

          renderNavigation();
        }, 75);
      },
      { passive: true }
    );

    resizeObserver?.disconnect();

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(
        () => fitSlide()
      );

      slides().forEach(element => {
        resizeObserver.observe(
          element.firstElementChild || element
        );
      });
    }

    finisherStatus();
    navigate(0, false);
    startClock();
  }

  /*
   ORIGINAL-STYLE COMPLETION SUMMARY
  */

  function summaryHTML(result, seconds) {
    const stat = (label, value, description) => `
      <div class="m1002-summary-stat">
        <small>${label}</small>
        <strong>${value}</strong>
        <span>${description}</span>
      </div>
    `;

    return `
      <div class="m1002-summary">
        <div class="m1002-summary-check">
          ✓
        </div>

        <span class="m1002-kicker">
          MANA STRENGTH • COACH PROGRAM
        </span>

        <h1>Workout Complete</h1>

        <div class="m1002-summary-name">
          ${esc(session?.day?.title || "Strength Session")}
        </div>

        <div class="m1002-summary-grid">
          ${stat(
            "Sets",
            result.done + " / " + result.all,
            "Completed"
          )}

          ${stat(
            "Completion",
            result.percent + "%",
            "Session"
          )}

          ${stat(
            "Volume",
            result.volume + " kg",
            "Total lifted"
          )}

          ${stat(
            "Time",
            time(seconds),
            "Workout duration"
          )}
        </div>

        <div class="m1002-summary-note">
          <strong>Session complete.</strong>

          <div>
            Strong work. Recover well and keep building.
          </div>

          ${rating
            ? `<div>Rating: ${rating}/5</div>`
            : ""}

          ${comment
            ? `
              <div>
                Comment: ${esc(comment)}
              </div>
            `
            : ""}

          ${finishers.cardio?.completed
            ? `
              <div>
                ✓ Cardio:
                ${esc(finishers.cardio.equipment)}
                ${finishers.cardio.durationMinutes} min
              </div>
            `
            : ""}

          ${finishers.core?.completed
            ? `
              <div>
                ✓ Core: 3 rounds
              </div>
            `
            : ""}
        </div>

        <button type="button"
          class="m1002-primary"
          data-m1002-summary-progress>
          VIEW PROGRESS →
        </button>

        <button type="button"
          class="m1002-secondary"
          style="width:100%;margin-top:9px"
          data-m1002-program-back>
          BACK TO COACH PROGRAM
        </button>
      </div>
    `;
  }

  async function completeWorkout() {
    if (!session) return;

    const result = totals();

    if (!result.done) {
      if ($("m1002SaveStatus")) {
        $("m1002SaveStatus").textContent =
          "Complete a set first, or use Tick All Workout.";
      }

      return;
    }

    clearTimeout(saveTimer);
    backup();

    const button = document.querySelector(
      `#${MODAL} [data-m1002-complete]`
    );

    if (button) button.disabled = true;

    const seconds = clock();
    const workoutName = session.day.title;

    const success = await queueSave(true);

    if (!success) {
      if (button) button.disabled = false;
      return;
    }

    stopClock();

    show(
      summaryHTML(result, seconds).replace(
        "Strength Session",
        esc(workoutName || "Strength Session")
      )
    );

    session = null;
    progressLoaded = 0;

    window.dispatchEvent(
      new CustomEvent("mana:coach-workout-saved", {
        detail: {
          programId: program?.program?.id
        }
      })
    );
  }

  function backToProgram() {
    ++openSeq;
    stopClock();

    resizeObserver?.disconnect();

    if (session) {
      backup();
      queueSave();
    }

    session = null;
    renderProgram();
  }

  function tickAll(root) {
    const ticks = [
      ...(root?.querySelectorAll(
        "[data-m1002-tick]"
      ) || [])
    ];

    ticks.forEach(button => {
      button.classList.add("done");

      button.setAttribute(
        "aria-pressed",
        "true"
      );
    });

    if (ticks.length) localEdit();
  }

  /*
   CLOUD DATA TO PROGRESS TAB
   Completed coach workouts remain separate
   from the generated-program history.
  */

  function progressHTML(logs) {
    const completed = logs.filter(
      item => item.status === "completed"
    );

    const allSets = completed.reduce(
      (sum, item) =>
        sum + (Number(item.completed_sets) || 0),
      0
    );

    const volume = completed.reduce(
      (sum, item) =>
        sum + (Number(item.total_volume) || 0),
      0
    );

    const seconds = completed.reduce(
      (sum, item) =>
        sum + (Number(item.duration_seconds) || 0),
      0
    );

    const cardio = completed.reduce(
      (sum, item) =>
        sum + (
          item.finishers?.cardio?.completed
            ? Number(
                item.finishers.cardio.actualMinutes ||
                item.finishers.cardio.durationMinutes ||
                0
              )
            : 0
        ),
      0
    );

    const core = completed.filter(
      item => item.finishers?.core?.completed
    ).length;

    const ratings = completed.filter(
      item => Number(item.workout_rating) > 0
    );

    const average = ratings.length
      ? (
          ratings.reduce(
            (sum, item) =>
              sum + Number(item.workout_rating),
            0
          ) / ratings.length
        ).toFixed(1)
      : "—";

    const exerciseNames = new Set(
      completed.flatMap(
        item =>
          (item.exercises || []).map(
            exercise => exercise.name
          )
      )
    );

    const stat = (title, value) => `
      <div class="m1002-progress-stat">
        <small>${title}</small>
        <strong>${value}</strong>
      </div>
    `;

    return `
      <span class="m1002-kicker">
        MANA STRENGTH • COACH PROGRAMS
      </span>

      <h3>Coach Workout Progress</h3>

      <p>
        Completed coach-assigned sessions,
        saved independently from My Workouts.
      </p>

      <div class="m1002-progress-stats">
        ${stat("WORKOUTS", completed.length)}
        ${stat("SETS COMPLETE", allSets)}
        ${stat("TOTAL VOLUME", Math.round(volume) + " kg")}
        ${stat("WORKOUT TIME", Math.round(seconds / 60) + " min")}
        ${stat("CARDIO", cardio + " min")}
        ${stat("CORE", core + " sessions")}
        ${stat("AVERAGE RATING", average + "/5")}
        ${stat("EXERCISES", exerciseNames.size)}
      </div>

      <h3>Coach Training History</h3>

      ${!completed.length
        ? `
          <p>
            No completed Coach Programs workouts yet.
          </p>
        `
        : completed.map(item => `
          <details class="m1002-history">
            <summary>
              ${esc(item.session_name || "Workout")}
              •
              ${new Date(
                item.completed_at || item.updated_at
              ).toLocaleDateString("en-AU")}
            </summary>

            <small>
              Week ${esc(item.week_number)}
              • Day ${esc(item.day_number)}
              • ${esc(item.completed_sets)}
              / ${esc(item.total_sets)} sets
              • ${Math.round(Number(item.total_volume) || 0)} kg
              • ${time(Number(item.duration_seconds) || 0)}
            </small>

            ${(item.exercises || []).map(exercise => `
              <div class="m1002-history-exercise">
                <strong>${esc(exercise.name)}</strong>

                <div>
                  ${(exercise.sets || []).map(set => `
                    Set ${esc(set.set)}:
                    ${esc(set.weight || 0)} kg
                    × ${esc(set.reps || 0)} reps
                    ${set.done ? "✓" : ""}
                  `).join(" · ")}
                </div>
              </div>
            `).join("")}

            ${item.finishers?.cardio?.completed
              ? `
                <small>
                  Cardio:
                  ${esc(item.finishers.cardio.equipment)}
                  • ${esc(item.finishers.cardio.durationMinutes)} min
                </small>
              `
              : ""}

            ${item.finishers?.core?.completed
              ? `
                <small>
                  Core: 3 rounds
                </small>
              `
              : ""}

            ${item.workout_rating
              ? `
                <small>
                  Rating ${esc(item.workout_rating)}/5
                </small>
              `
              : ""}

            ${item.workout_comment
              ? `
                <p>
                  ${esc(item.workout_comment)}
                </p>
              `
              : ""}
          </details>
        `).join("")}
    `;
  }

  function progressMount() {
    if (!progressTab()) return;

    const root = $(ROOT);
    if (!root) return;

    let panel = $(PROGRESS);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PROGRESS;
      root.appendChild(panel);
    }

    if (
      panel.dataset.m1002User !== progressUser ||
      panel.dataset.m1002Count !==
        String(progressLogs.length)
    ) {
      panel.innerHTML = progressLoading
        ? `
          <p>
            Loading coach workout history…
          </p>
        `
        : progressHTML(progressLogs);

      panel.dataset.m1002User = progressUser;
      panel.dataset.m1002Count =
        String(progressLogs.length);
    }
  }

  async function loadProgress(force = false) {
    if (!progressTab()) return;

    progressMount();

    if (
      progressLoading ||
      (!force && Date.now() - progressLoaded < 25000)
    ) return;

    progressLoading = true;

    const token = ++progressSequence;

    try {
      const client = await db();
      const auth = await client.auth.getUser();

      const userId = auth.data?.user?.id;

      if (!userId) {
        progressUser = "";
        progressLogs = [];
        return;
      }

      const result = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("completed_at", {
          ascending: false
        })
        .limit(500);

      if (result.error) throw result.error;

      if (token !== progressSequence) return;

      progressUser = userId;
      progressLogs = result.data || [];
      progressLoaded = Date.now();

    } catch (error) {
      console.warn(
        "[Mana Coach Progress]",
        error.message || error
      );
    } finally {
      progressLoading = false;

      if ($(PROGRESS)) {
        $(PROGRESS).dataset.m1002Count = "";
      }

      progressMount();
    }
  }

  function viewProgress() {
    ++openSeq;
    stopClock();

    session = null;
    assignment = null;
    program = null;

    $(MODAL)?.classList.remove("open");

    const progressButton = document.querySelector(
      '#manaV83Tabs [data-v83-tab="progress"]'
    );

    if (progressButton) {
      progressButton.click();

      setTimeout(
        () => void loadProgress(true),
        350
      );

    } else {
      if (
        typeof window.openManaProgram === "function"
      ) {
        window.openManaProgram("strength");
      }

      setTimeout(() => {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="progress"]'
        )?.click();
      }, 300);

      setTimeout(
        () => void loadProgress(true),
        650
      );
    }
  }

  function onClick(event) {
    const element = event.target;

    if (!(element instanceof Element)) return;

    let button;

    if ((button = element.closest(
      "[data-m1002-mode]"
    ))) {
      setMode(button.dataset.m1002Mode);
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
      "[data-m1002-summary-progress]"
    )) {
      viewProgress();
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
      week = Number(button.dataset.m1002Week);
      renderProgram();
      return;
    }

    if ((button = element.closest(
      "[data-m1002-start]"
    ))) {
      void openDay(button.dataset.m1002Start);
      return;
    }

    if ((button = element.closest(
      "[data-m1002-demo]"
    ))) {
      const name = button.dataset.m1002Demo;

      const openDemo =
        window.MANA_EXERCISE_VISUALS?.openDemo;

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
      tickAll(
        button.closest("[data-m1002-ex]")
      );

      return;
    }

    if (element.closest(
      "[data-m1002-tick-workout]"
    )) {
      tickAll($("m1002Carousel"));
      return;
    }

    if ((button = element.closest(
      "[data-m1002-rating]"
    ))) {
      rating = Number(
        button.dataset.m1002Rating
      );

      ratings();
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

      finisherStatus();
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
        () => coreRoutine().map(
          (_, index) => index
        )
      );

      openCore();
      return;
    }

    if (element.closest(
      "[data-m1002-core-next]"
    )) {
      const total = coreRoutine().length;

      if (
        coreTicks[coreRound].length !== total
      ) return;

      if (coreRound < 2) {
        coreRound++;
        openCore();
        return;
      }

      if (!coreTicks.every(
        items => items.length === total
      )) {
        coreRound = coreTicks.findIndex(
          items => items.length !== total
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

      finisherStatus();
      localEdit();
      return;
    }

    if (element.closest(
      "[data-m1002-finisher-close]"
    )) {
      $("m1002FinisherPanel").innerHTML = "";
      fitSlide();
      return;
    }

    if (element.closest(
      "[data-m1002-complete]"
    )) {
      void completeWorkout();
    }
  }

  function onInput(event) {
    const target = event.target;

    if (
      !(target instanceof Element) ||
      !target.closest("#" + MODAL)
    ) return;

    if (target.matches(
      "[data-m1002-weight]"
    )) {
      const card = target.closest(
        "[data-m1002-ex]"
      );

      card?.querySelectorAll(
        "[data-m1002-weight]"
      ).forEach(input => {
        if (input !== target) {
          input.value = target.value;
        }
      });

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

      const checked = new Set(
        coreTicks[coreRound]
      );

      if (target.checked) {
        checked.add(index);
      } else {
        checked.delete(index);
      }

      coreTicks[coreRound] = [
        ...checked
      ].sort((a, b) => a - b);

      openCore();
    }
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
      if (workoutTab()) {
        applyMode();

        if (mode === "coach") {
          void loadAssignments();
        }
      }

      if (legacyTab()) {
        renderLegacy();
        void loadAssignments();
      }

      if (progressTab()) {
        progressMount();
        void loadProgress();
      }
    }, 160);
  }

  function init() {
    try {
      mode = sessionStorage.getItem(MODE_KEY) === "coach"
        ? "coach"
        : "generated";
    } catch (_) {}

    installStyles();
    modal();
    ensureLegacy();

    const holder = $("manaV83Content");

    if (holder) {
      new MutationObserver(() => {
        if (
          workoutTab() &&
          (!$(SW) || !$(PANEL))
        ) {
          applyMode();
        }

        if (
          progressTab() &&
          !$(PROGRESS)
        ) {
          scheduleRefresh();
        }
      }).observe(holder, {
        childList: true
      });
    }

    document.addEventListener(
      "click",
      onClick
    );

    document.addEventListener(
      "input",
      onInput
    );

    document.addEventListener(
      "change",
      onInput
    );

    [
      "mana:program-tab-change",
      "pageshow",
      "mana:profile-synced",
      "mana:coach-workout-saved"
    ].forEach(eventName => {
      window.addEventListener(
        eventName,
        scheduleRefresh
      );
    });

    document.querySelector(
      '#bottomNav [data-page="programs"]'
    )?.addEventListener(
      "click",
      scheduleRefresh
    );

    document.querySelector(
      '#manaV83Tabs [data-v83-tab="progress"]'
    )?.addEventListener(
      "click",
      () => {
        setTimeout(
          () => void loadProgress(),
          200
        );
      }
    );

    window.addEventListener(
      "resize",
      fitSlide
    );

    window.addEventListener(
      "mana:logout",
      () => {
        ++loadSeq;
        ++progressSequence;

        account = "";
        assignments = [];
        loadedAt = 0;

        progressUser = "";
        progressLogs = [];
        progressLoaded = 0;

        closeModal();
        renderPanel();
        renderLegacy();
      }
    );

    window.refreshManaAssignedPrograms =
      () => loadAssignments(true);

    window.refreshManaCoachProgress =
      () => loadProgress(true);

    window.MANA_CLIENT_CUSTOM_PROGRAM_BUILD =
      BUILD;

    scheduleRefresh();

    console.log(
      "[Mana Movement] Coach workouts " + BUILD
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
