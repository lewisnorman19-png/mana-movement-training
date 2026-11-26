
/*
 MANA MOVEMENT — COACH WORKOUTS
 BUILD 100214
 COMPLETE REPLACEMENT
 v10_02_client_custom_programs_100200.js
*/

(() => {
  "use strict";

  const BUILD = "100214";
  const SW = "manaV1002WorkoutSwitch";
  const PANEL = "manaV1002CoachPanel";
  const LEGACY = "manaV1002AssignedPrograms";
  const MODAL = "manaV1002CustomProgramModal";
  const STYLE = "mana-v1002-client-custom-style";
  const MODE_KEY = "mana-strength-workout-view-100205";
  const ROOT = "manaV993StrengthProgress";
  const PROGRESS = "m1002CoachProgress";
  const PSW = "m1002ProgressSwitch";

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
  let scrollTimer = null;
  let refreshTimer = null;
  let resizeObserver = null;

  let finishers = {};
  let cardioEquipment = "Bike";
  let cardioMinutes = 10;
  let coreRound = 0;
  let coreTicks = [[], [], []];
  let rating = 0;
  let comment = "";

  let progressMode = "generated";
  let progressPeriod = "all";
  let progressDetail = "workouts";
  let progressLogs = [];
  let progressUser = "";
  let progressLoading = false;
  let progressError = "";
  let progressLoadAt = 0;
  let progressToken = 0;

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
      throw new Error("Mana cloud unavailable");
    }
    return window.supabaseClient();
  }

  function clockSeconds() {
    return elapsedBase + (
      startedAt
        ? Math.floor((Date.now() - startedAt) / 1000)
        : 0
    );
  }

  function formatTime(seconds) {
    const n = Math.max(0, Math.floor(Number(seconds) || 0));
    return String(Math.floor(n / 60)).padStart(2, "0") +
      ":" + String(n % 60).padStart(2, "0");
  }

  function stopClock() {
    if (startedAt) {
      elapsedBase = clockSeconds();
      startedAt = 0;
    }
  }

  function workoutOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim()?.toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="program"].active'
      )
    );
  }

  function progressOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) &&
      $(ROOT)
    );
  }

  function legacyOpen() {
    return !!(
      $("clientProgramsView") &&
      !$("clientProgramsView").classList.contains("hide")
    );
  }

  function installStyle() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${SW},#${PSW}{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:7px;
        padding:6px;
        margin:12px 0 15px;
        background:#101113;
        border:1px solid #30343a;
        border-radius:15px;
      }
      #${SW} button,#${PSW} button{
        width:100%;
        min-width:0;
        min-height:46px;
        padding:10px 7px;
        background:#191b1f;
        color:#fff!important;
        -webkit-text-fill-color:#fff!important;
        border:1px solid transparent;
        border-radius:11px;
        font-family:inherit;
        font-size:12px;
        font-weight:800;
        cursor:pointer;
      }
      #${SW} button.active,#${PSW} button.active{
        background:#251b15;
        color:#fff!important;
        -webkit-text-fill-color:#fff!important;
        border-color:#41454b!important;
      }
      #manaV83Content.m1002-coach-mode
      >:not(#${SW}):not(#${PANEL}){
        display:none!important;
      }
      #${PANEL}{display:none;margin-bottom:16px}
      #manaV83Content.m1002-coach-mode>#${PANEL}{
        display:block!important;
      }
      #${PANEL} .m1002-shell{
        background:#101113!important;
        border:1px solid #34383e!important;
        border-radius:17px;
        overflow:hidden;
        color:#fff;
      }
      #${PANEL} .m1002-panel-head{
        padding:18px;
        background:#121315;
        border-bottom:1px solid #292d32;
      }
      #${PANEL} .m1002-panel-head h3{
        color:#fff!important;
        -webkit-text-fill-color:#fff!important;
        font-size:20px;
        margin:5px 0;
      }
      .m1002-kicker{
        color:#ff8126!important;
        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
      }
      .m1002-muted{
        color:#b1b8c1;
        font-size:12px;
        line-height:1.55;
        margin:7px 0;
      }
      .m1002-program{
        display:flex;
        justify-content:space-between;
        align-items:center;
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
      }
      .m1002-program strong{
        display:block;
        color:#fff!important;
        -webkit-text-fill-color:#fff!important;
        font-size:15px;
      }
      .m1002-program small{
        display:block;
        color:#b4bac2;
        margin-top:5px;
        font-size:12px;
      }
      .m1002-pill{
        color:#ff8126;
        border:1px solid #794521;
        border-radius:20px;
        padding:6px 9px;
        font-size:10px;
        font-weight:900;
      }
      .m1002-empty{
        padding:22px;
        border:1px solid #353940;
        border-radius:15px;
        background:#17191c;
        color:#fff;
        text-align:center;
      }
      #${LEGACY}{margin:12px 0}
      #${MODAL}{
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
      #${MODAL}.open{display:block}
      #${MODAL} .m1002-inner{
        max-width:680px;
        margin:auto;
      }
      #${MODAL} button{
        font-family:inherit;
        cursor:pointer;
      }
      #${MODAL} .m1002-top{
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
      #${MODAL} .m1002-back,
      #${MODAL} .m1002-secondary{
        min-height:40px;
        padding:10px 12px;
        border:1px solid #42464d;
        border-radius:11px;
        background:#191b1e;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }
      #${MODAL} .m1002-hero,
      #${MODAL} .mana-v85-day{
        padding:16px;
        margin-bottom:12px;
        background:#121314!important;
        border:1px solid #34383e!important;
        border-radius:16px;
      }
      #${MODAL} .m1002-hero h2,
      #${MODAL} .mana-v85-day h3{
        color:#fff!important;
        margin:6px 0;
      }
      #${MODAL} .m1002-weeks{
        display:flex;
        gap:8px;
        overflow-x:auto;
        margin-bottom:13px;
      }
      #${MODAL} .m1002-weeks button{
        padding:11px 13px;
        background:#191b1e;
        border:1px solid #444;
        border-radius:10px;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }
      #${MODAL} .m1002-weeks button.active{
        border-color:#ff8126;
        color:#ff8126;
        background:#261c16;
      }
      #${MODAL} .m1002-primary,
      #${MODAL} .m1002-finisher-save{
        display:block;
        width:100%;
        min-height:46px;
        padding:12px;
        margin-top:11px;
        background:#ff8126!important;
        border:0;
        border-radius:11px;
        color:#141414!important;
        font-size:13px;
        font-weight:900;
      }
      #${MODAL} button:disabled{opacity:.5}
      #${MODAL} .m1002-position{
        display:flex;
        justify-content:space-between;
        gap:8px;
        margin:5px 0 8px;
        color:#fff;
        font-size:12px;
        font-weight:800;
      }
      #${MODAL} .m1002-dots{
        display:flex;
        justify-content:center;
        flex-wrap:wrap;
        gap:8px;
        margin:9px 0 12px;
      }
      #${MODAL} .m1002-dot{
        width:9px;
        height:9px;
        padding:0;
        border:0;
        border-radius:50%;
        background:#545960;
      }
      #${MODAL} .m1002-dot.active{
        width:24px;
        border-radius:8px;
        background:#ff8126;
      }
      #${MODAL} .m1002-carousel{
        display:flex;
        align-items:flex-start;
        overflow-x:auto;
        overflow-y:hidden;
        width:100%;
        scroll-snap-type:x mandatory;
        scroll-behavior:smooth;
        -webkit-overflow-scrolling:touch;
        scrollbar-width:none;
      }
      #${MODAL} .m1002-carousel::-webkit-scrollbar{
        display:none;
      }
      #${MODAL} .m1002-slide{
        flex:0 0 100%;
        min-width:0;
        box-sizing:border-box;
        scroll-snap-align:start;
      }
      #${MODAL} .m1002-slide-inner{padding:1px}
      #${MODAL} .mana-v64-card{
        padding:16px;
        margin:0;
        background:#121314!important;
        border:1px solid #34383e!important;
        border-radius:16px;
        color:#fff;
        box-shadow:none;
      }
      #${MODAL} .mana-v64-name{
        color:#fff!important;
        font-size:18px;
        font-weight:900;
        margin-bottom:6px;
      }
      #${MODAL} .mana-v64-target{
        color:#ff8126!important;
        font-size:12px;
      }
      #${MODAL} .m1002-muscle{
        display:flex;
        align-items:center;
        gap:12px;
        padding:11px;
        margin:12px 0;
        border:1px solid #34383e;
        border-radius:13px;
        background:#0b0c0d;
      }
      #${MODAL} .m1002-muscle-frame{
        flex:0 0 105px;
        width:105px;
        height:125px;
        display:grid;
        place-items:center;
        overflow:hidden;
        border-radius:10px;
        background:#151618;
      }
      #${MODAL} .m1002-muscle-frame img{
        width:100%;
        height:100%;
        object-fit:contain;
      }
      #${MODAL} .m1002-muscle-copy{
        flex:1;
        min-width:0;
      }
      #${MODAL} .m1002-muscle-copy strong{
        display:block;
        color:#fff;
        font-size:13px;
      }
      #${MODAL} .m1002-demo{
        display:block;
        margin-top:10px;
        padding:9px 11px;
        background:#241b16;
        border:1px solid #714324;
        border-radius:10px;
        color:#ff8126;
        font-size:11px;
        font-weight:900;
      }
      #${MODAL} .mana-v64-table-head,
      #${MODAL} .mana-v64-set{
        display:grid;
        grid-template-columns:
          32px minmax(0,1fr)
          minmax(0,1fr) 45px;
        gap:7px;
        align-items:center;
        margin:8px 0;
      }
      #${MODAL} .mana-v64-table-head{
        color:#afb5bc;
        font-size:11px;
        text-align:center;
      }
      #${MODAL} .mana-v64-set input{
        width:100%;
        min-width:0;
        min-height:42px;
        padding:7px;
        background:#1b1d20;
        border:1px solid #454a50;
        border-radius:9px;
        color:#fff;
        font-size:16px;
        text-align:center;
      }
      #${MODAL} .mana-v64-check{
        width:43px;
        height:42px;
        border:1px solid #545960;
        border-radius:9px;
        background:#23252a;
        color:#aaa;
        font-weight:900;
      }
      #${MODAL} .mana-v64-check.done{
        background:#ff8126;
        border-color:#ff8126;
        color:#111;
      }
      #${MODAL} .m1002-tick-all{
        width:100%;
        padding:11px;
        margin-top:13px;
        background:#261d16;
        border:1px solid #ff8126;
        border-radius:11px;
        color:#ff8126;
        font-size:12px;
        font-weight:900;
      }
      #${MODAL} .m1002-tick-all.done{
        background:#ff8126;
        color:#111;
      }
      #${MODAL} .m1002-nav{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin:6px 0;
      }
      #${MODAL} .m1002-nav button{
        min-height:43px;
        background:#191b1e;
        border:1px solid #444;
        border-radius:11px;
        color:#fff;
        font-size:12px;
        font-weight:900;
      }
      #${MODAL} .m1002-nav button.next{
        background:#241b15;
        border-color:#ff8126;
        color:#ff8126;
      }
      #${MODAL} .m1002-status{
        color:#b3bac4;
        font-size:12px;
        line-height:1.6;
      }
      #${MODAL} .m1002-status:empty{display:none}
      #${MODAL} .m1002-finishers{
        padding:16px;
        border:1px solid #34383e;
        border-radius:16px;
        background:#121314;
      }
      #${MODAL} .m1002-finishers h3,
      #${MODAL} .m1002-feedback h3{
        color:#fff!important;
        margin:5px 0 8px;
        font-size:19px;
      }
      #${MODAL} .m1002-finisher-pair{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
        margin:14px 0;
      }
      #${MODAL} .m1002-finisher-option{
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
        font-size:13px;
        font-weight:900;
      }
      #${MODAL} .m1002-finisher-option.done{
        border-color:#ff8126!important;
        color:#ff8126!important;
      }
      #${MODAL} .m1002-finisher-panel,
      #${MODAL} .m1002-feedback{
        padding:13px;
        margin-top:12px;
        background:#17191c;
        border:1px solid #383d44;
        border-radius:13px;
      }
      #${MODAL} .m1002-options{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        margin:11px 0;
      }
      #${MODAL} .m1002-options button,
      #${MODAL} .m1002-rating button{
        padding:9px 11px;
        background:#25272a;
        border:1px solid #44484e;
        border-radius:9px;
        color:#c8ccd2;
        font-size:12px;
        font-weight:800;
      }
      #${MODAL} .m1002-options button.active,
      #${MODAL} .m1002-rating button.active{
        border-color:#ff8126;
        color:#ff8126;
        background:#2a201a;
      }
      #${MODAL} .m1002-rating{
        display:flex;
        gap:7px;
        margin:11px 0;
      }
      #${MODAL} .m1002-rating button{
        flex:1;
        min-width:34px;
      }
      #${MODAL} .m1002-feedback label{
        display:block;
        color:#fff;
        font-size:12px;
        margin-top:12px;
      }
      #${MODAL} .m1002-feedback textarea{
        display:block;
        width:100%;
        min-height:85px;
        padding:12px;
        margin-top:8px;
        background:#202226;
        border:1px solid #4a4e54;
        border-radius:10px;
        color:#fff;
        font-size:14px;
      }
      #${MODAL} .m1002-core-item{
        display:flex;
        align-items:center;
        gap:11px;
        padding:11px 0;
        border-bottom:1px solid #34383e;
        color:#fff;
        font-size:12px;
      }
      #${MODAL} .m1002-core-item input{
        width:20px;
        height:20px;
        accent-color:#ff8126;
      }
      #${MODAL} .m1002-saved{
        color:#ff8126;
        font-size:12px;
        font-weight:800;
        margin:10px 0;
      }
      #${MODAL} .m1002-summary{
        text-align:center;
        padding:12px 0;
      }
      #${MODAL} .m1002-summary-check{
        display:grid;
        place-items:center;
        width:68px;
        height:68px;
        margin:4px auto 12px;
        border:2px solid #ff8126;
        border-radius:50%;
        background:#251b15;
        color:#ff8126;
        font-size:32px;
      }
      #${MODAL} .m1002-summary-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin:15px 0;
        text-align:left;
      }
      #${MODAL} .m1002-summary-stat{
        padding:15px;
        background:#141517;
        border:1px solid #373c43;
        border-radius:14px;
      }
      #${MODAL} .m1002-summary-stat small{
        display:block;
        color:#a8b0ba;
        font-size:11px;
      }
      #${MODAL} .m1002-summary-stat strong{
        display:block;
        color:#fff;
        font-size:23px;
        margin:6px 0;
      }
      #${MODAL} .m1002-summary-note{
        padding:14px;
        margin:12px 0;
        text-align:left;
        background:#111214;
        border:1px solid #34383e;
        border-radius:12px;
        color:#c2c7ce;
        font-size:12px;
        line-height:1.7;
      }
      #${ROOT}.m1002-show-coach
      >:not(#${PSW}):not(#${PROGRESS}){
        display:none!important;
      }
      #${PROGRESS}{display:none}
      #${ROOT}.m1002-show-coach>#${PROGRESS}{
        display:block!important;
      }
      #${PROGRESS} .mana-v993-head h2,
      #${PROGRESS} .mana-v993-panel h3{
        color:#fff!important;
      }
      #${PROGRESS} .m1002-history{
        padding:12px;
        margin:9px 0;
        border:1px solid #383c42;
        border-radius:12px;
        background:#17191c;
        color:#fff;
      }
      #${PROGRESS} .m1002-history summary{
        color:#fff;
        font-size:13px;
        font-weight:900;
        cursor:pointer;
      }
      #${PROGRESS} .m1002-history-exercise{
        padding:9px 0;
        border-top:1px solid #34383e;
        color:#ccc;
        font-size:12px;
      }
      @media(max-width:420px){
        #${MODAL} .mana-v64-card{padding:13px}
        #${MODAL} .m1002-muscle{gap:9px;padding:9px}
        #${MODAL} .m1002-muscle-frame{
          flex-basis:95px;
          width:95px;
          height:116px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureModal() {
    if ($(MODAL)) return;

    const m = document.createElement("div");
    m.id = MODAL;

    m.innerHTML = `
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

    document.body.appendChild(m);
  }

  function showModal(html) {
    ensureModal();
    $(MODAL).classList.add("open");
    $("m1002Content").innerHTML = html;
    $(MODAL).scrollTop = 0;
  }

  function ensureRoots() {
    if (!workoutOpen()) return null;

    const holder = $("manaV83Content");
    if (!holder) return null;

    let sw = $(SW);

    if (!sw) {
      sw = document.createElement("div");
      sw.id = SW;
      sw.innerHTML = `
        <button type="button" data-m1002-mode="generated">
          My Workouts
        </button>
        <button type="button" data-m1002-mode="coach">
          Coach Programs
        </button>
      `;
    }

    if (sw.parentElement !== holder) holder.prepend(sw);

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;
    }

    if (panel.parentElement !== holder) sw.after(panel);

    return holder;
  }

  function ensureLegacy() {
    const view = $("clientProgramsView");
    if (!view) return null;

    let el = $(LEGACY);

    if (!el) {
      el = document.createElement("section");
      el.id = LEGACY;
    }

    if (!view.contains(el)) view.prepend(el);
    return el;
  }

  function applyMode() {
    const holder = ensureRoots();
    if (!holder) return;

    holder.classList.toggle(
      "m1002-coach-mode",
      mode === "coach"
    );

    $(SW)?.querySelectorAll("[data-m1002-mode]")
      .forEach(button => {
        const active = button.dataset.m1002Mode === mode;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });

    if (mode === "coach") renderPanel();
  }

  function changeMode(value) {
    if (!["generated", "coach"].includes(value)) return;

    mode = value;

    try {
      sessionStorage.setItem(MODE_KEY, mode);
    } catch (_) {}

    applyMode();

    if (mode === "coach") void loadAssignments(true);
  }

  function programCard(item) {
    const p = item.custom_programs;

    return `
      <button type="button"
        class="m1002-program"
        data-m1002-program="${esc(p.id)}">
        <span>
          <strong>${esc(p.name)}</strong>
          <small>
            ${esc(p.goal || p.description ||
              "Personalised training program")}
          </small>
        </span>
        <span class="m1002-pill">
          ${item.is_primary
            ? "PRIMARY"
            : esc(item.status.toUpperCase())}
        </span>
      </button>
    `;
  }

  function renderPanel() {
    const holder = $(PANEL);
    if (!holder) return;

    const rows = assignments.filter(
      a => a.custom_programs
    );

    holder.innerHTML = `
      <div class="m1002-shell">
        <div class="m1002-panel-head">
          <span class="m1002-kicker">MANA STRENGTH</span>
          <h3>Coach Programs</h3>
          <p class="m1002-muted">
            Personalised training built and
            assigned by your coach.
          </p>
        </div>
        <div style="padding:14px">
          ${rows.length
            ? rows.map(programCard).join("")
            : `
              <div class="m1002-empty">
                <h4>No Coach Programs Yet</h4>
                <p class="m1002-muted">
                  ${loading
                    ? "Checking assigned programs…"
                    : "Your coach-built programs will appear here once assigned."}
                </p>
              </div>
            `}
        </div>
      </div>
    `;
  }

  function renderLegacy() {
    const root = ensureLegacy();
    if (!root) return;

    root.innerHTML = assignments.length
      ? assignments.map(programCard).join("")
      : "";
  }

  async function loadAssignments(force = false) {
    if (
      loading ||
      (!force && Date.now() - loadedAt < 20000)
    ) return;

    loading = true;
    renderPanel();

    const token = ++loadingSerial;

    try {
      const c = await db();
      const auth = await c.auth.getUser();

      if (auth.error) throw auth.error;

      const id = auth.data?.user?.id || "";

      if (account !== id) {
        account = id;
        assignments = [];
      }

      if (!id) return;

      const result = await c
        .from("client_program_assignments")
        .select(`
          id,status,is_primary,assigned_at,
          custom_programs(
            id,name,description,goal,
            duration_weeks,status
          )
        `)
        .eq("client_id", id)
        .in("status", ["active", "paused", "completed"])
        .order("is_primary", { ascending: false })
        .order("assigned_at", { ascending: false });

      if (result.error) throw result.error;

      if (token !== loadingSerial) return;

      assignments = (result.data || []).filter(
        a => a.custom_programs
      );

      loadedAt = Date.now();

    } catch (error) {
      console.warn("[Mana Coach Programs]", error);
    } finally {
      loading = false;
      renderPanel();
      renderLegacy();
    }
  }

  function closeModal() {
    ++serial;
    stopClock();

    if (session) {
      backup();
      void queueSave();
    }

    session = null;
    selected = null;
    programData = null;

    $(MODAL)?.classList.remove("open");
  }

  function programHeader() {
    const p = programData?.program;

    return `
      <div class="m1002-hero">
        <span class="m1002-kicker">
          COACH-ASSIGNED PROGRAM
        </span>
        <h2>${esc(p?.name || "Coach Program")}</h2>
        <p class="m1002-muted">
          ${esc(p?.description || p?.goal || "")}
        </p>
      </div>
    `;
  }

  async function openProgram(id) {
    const row = assignments.find(
      a => a.custom_programs?.id === id
    );

    if (!row) return;

    const token = ++serial;
    stopClock();

    session = null;
    selected = row;

    showModal(`
      <p class="m1002-status">
        Loading your coach program…
      </p>
    `);

    try {
      const c = await db();
      const auth = await c.auth.getUser();

      if (auth.data?.user?.id !== account) {
        throw Error("Sign in to view your program");
      }

      const link = await c
        .from("client_program_assignments")
        .select("id")
        .eq("client_id", account)
        .eq("program_id", id)
        .in("status", ["active", "paused", "completed"])
        .maybeSingle();

      if (link.error || !link.data) {
        throw link.error || Error("Program not assigned");
      }

      const [p, d] = await Promise.all([
        c.from("custom_programs")
          .select("*").eq("id", id).single(),

        c.from("custom_program_days")
          .select("*").eq("program_id", id)
          .order("week_number")
          .order("day_number")
      ]);

      if (p.error || d.error) throw p.error || d.error;

      const days = d.data || [];
      let exercises = [];

      if (days.length) {
        const e = await c
          .from("custom_program_exercises")
          .select("*")
          .in("program_day_id", days.map(x => x.id))
          .order("sort_order");

        if (e.error) throw e.error;
        exercises = e.data || [];
      }

      if (token !== serial) return;

      programData = {
        program: p.data,
        days,
        exercises
      };

      week = days.length
        ? Math.min(...days.map(
            x => Number(x.week_number) || 1
          ))
        : 1;

      renderProgram();

    } catch (error) {
      if (token === serial) {
        showModal(`
          <p class="m1002-status">
            Could not load program: ${esc(error.message)}
          </p>
        `);
      }
    }
  }

  function renderProgram() {
    if (!programData) return;

    session = null;
    stopClock();

    const weeks = [...new Set(
      programData.days.map(
        d => Number(d.week_number) || 1
      )
    )].sort((a, b) => a - b);

    const cards = programData.days
      .filter(d => Number(d.week_number) === week)
      .map(d => {
        const n = programData.exercises.filter(
          e => e.program_day_id === d.id
        ).length;

        return `
          <section class="mana-v85-day">
            <span class="m1002-kicker">
              WEEK ${week} • DAY ${esc(d.day_number)}
            </span>
            <h3>${esc(d.title || "Workout")}</h3>
            <p class="m1002-muted">
              ${n} exercises
              ${d.estimated_minutes
                ? " • " + esc(d.estimated_minutes) + " min"
                : ""}
            </p>
            <button type="button"
              class="m1002-primary"
              data-m1002-start="${esc(d.id)}">
              START WORKOUT
            </button>
          </section>
        `;
      }).join("");

    showModal(
      programHeader() +
      `<div class="m1002-weeks">
        ${weeks.map(n => `
          <button type="button"
            data-m1002-week="${n}"
            class="${n === week ? "active" : ""}">
            WEEK ${n}
          </button>
        `).join("")}
      </div>` +
      (cards || `<p>No workouts this week.</p>`)
    );
  }

  function visualInfo(name) {
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
    const v = visualInfo(name);

    return `
      <div class="m1002-muscle">
        <div class="m1002-muscle-frame">
          ${v.image
            ? `<img
                src="${esc(v.image)}"
                alt="Target muscles for ${esc(name)}"
                loading="lazy">`
            : `<span class="m1002-kicker">
                ${esc(v.target)}
              </span>`}
        </div>

        <div class="m1002-muscle-copy">
          <small class="m1002-kicker">PRIMARY TARGET</small>
          <strong>${esc(v.target)}</strong>
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

  function setHTML(n, set) {
    return `
      <div class="mana-v64-set" data-m1002-set>
        <span class="mana-v64-set-number">${n}</span>

        <input type="number"
          min="0" max="1000" step=".5"
          inputmode="decimal"
          placeholder="kg"
          aria-label="Set ${n} weight"
          data-m1002-weight
          value="${esc(set.weight ?? "")}">

        <input type="number"
          min="0" max="500" step="1"
          inputmode="numeric"
          aria-label="Set ${n} reps"
          data-m1002-reps
          value="${esc(set.reps ?? "")}">

        <button type="button"
          class="mana-v64-check${set.done ? " done" : ""}"
          data-m1002-tick>
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
        weight: previous?.sets?.[index]?.weight ?? "",
        reps:
          Number(previous?.sets?.[index]?.reps) > 0
            ? Number(previous.sets[index].reps)
            : defaultReps(exercise.reps),
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
          ${exercise.rest_seconds == null
            ? ""
            : " • " + esc(exercise.rest_seconds) + "s rest"}
        </div>

        ${muscleHTML(exercise.exercise_name)}

        ${exercise.notes
          ? `<p class="m1002-muted">
              Coach: ${esc(exercise.notes)}
            </p>`
          : ""}

        <div class="mana-v64-table-head">
          <span>Set</span>
          <span>Weight</span>
          <span>Reps</span>
          <span>Done</span>
        </div>

        ${sets.map((set, i) =>
          setHTML(i + 1, set)
        ).join("")}

        <p class="m1002-muted">
          Entering a weight repeats it across
          this exercise. Reps can be edited individually.
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

    return CORE[(day - 1) % CORE.length];
  }

  function finisherHTML() {
    return `
      <div class="m1002-finishers">
        <span class="m1002-kicker">
          OPTIONAL FINISHERS
        </span>
        <h3>Cardio & Core</h3>
        <p class="m1002-muted">
          Choose Cardio, Core or both.
          Finish and save each separately.
        </p>

        <div class="m1002-finisher-pair">
          <button type="button"
            class="m1002-finisher-option
              ${finishers.cardio?.completed ? "done" : ""}"
            data-m1002-finisher="cardio">
            ♥ CARDIO
            <small>
              ${finishers.cardio?.completed
                ? "SAVED ✓"
                : "10–20 minutes"}
            </small>
          </button>

          <button type="button"
            class="m1002-finisher-option
              ${finishers.core?.completed ? "done" : ""}"
            data-m1002-finisher="core">
            ◎ CORE
            <small>
              ${finishers.core?.completed
                ? "SAVED ✓"
                : "3 rounds"}
            </small>
          </button>
        </div>

        <div id="m1002FinisherPanel"></div>
        <p id="m1002FinisherSaved"
          class="m1002-saved"></p>

        <button type="button"
          class="m1002-tick-all"
          data-m1002-tick-workout>
          TICK ALL WORKOUT ✓
        </button>

        <div class="m1002-feedback">
          <h3>How was your workout?</h3>
          <div class="m1002-rating">
            ${[1, 2, 3, 4, 5].map(n => `
              <button type="button"
                data-m1002-rating="${n}"
                class="${rating === n ? "active" : ""}">
                ${n}
              </button>
            `).join("")}
          </div>

          <label for="m1002WorkoutComment">
            Comments (optional)
          </label>

          <textarea
            id="m1002WorkoutComment"
            maxlength="500"
            placeholder="How did you feel?">${esc(comment)}</textarea>
        </div>

        <button type="button"
          class="m1002-primary"
          data-m1002-complete>
          COMPLETE WORKOUT ✓
        </button>

        <p class="m1002-status"
          id="m1002FinishStatus"></p>
      </div>
    `;
  }

  function showFinisherStatus() {
    const messages = [];

    if (finishers.cardio?.completed) {
      messages.push(
        "Cardio: " +
        finishers.cardio.equipment +
        " • " +
        finishers.cardio.durationMinutes +
        " minutes"
      );
    }

    if (finishers.core?.completed) {
      messages.push("Core: 3 rounds");
    }

    const status = $("m1002FinisherSaved");

    if (status) {
      status.textContent = messages.length
        ? "✓ Saved: " + messages.join(" · ")
        : "";
    }

    document.querySelectorAll(
      `#${MODAL} [data-m1002-finisher]`
    ).forEach(button => {
      button.classList.toggle(
        "done",
        !!finishers[button.dataset.m1002Finisher]?.completed
      );
    });

    refreshRatings();
    fitSlide();
  }

  function refreshRatings() {
    document.querySelectorAll(
      `#${MODAL} [data-m1002-rating]`
    ).forEach(button => {
      button.classList.toggle(
        "active",
        Number(button.dataset.m1002Rating) === rating
      );
    });
  }

  function cardioHTML() {
    return `
      <div class="m1002-finisher-panel">
        <h4>Cardio Finisher</h4>
        <p class="m1002-muted">
          Select your equipment and duration.
        </p>

        <div class="m1002-options">
          ${["Bike", "Rower", "Treadmill", "Bodyweight"]
            .map(name => `
              <button type="button"
                data-m1002-cardio-equipment="${esc(name)}"
                class="${name === cardioEquipment
                  ? "active" : ""}">
                ${esc(name)}
              </button>
            `).join("")}
        </div>

        <div class="m1002-options">
          ${[10, 15, 20].map(n => `
            <button type="button"
              data-m1002-cardio-minutes="${n}"
              class="${n === cardioMinutes
                ? "active" : ""}">
              ${n} MIN
            </button>
          `).join("")}
        </div>

        <button type="button"
          class="m1002-finisher-save"
          data-m1002-cardio-complete>
          FINISH & SAVE CARDIO ✓
        </button>

        <button type="button"
          class="m1002-secondary"
          style="width:100%;margin-top:8px"
          data-m1002-finisher-close>
          CLOSE
        </button>
      </div>
    `;
  }

  function coreHTML() {
    const routine = coreRoutine();
    const current = coreTicks[coreRound] || [];
    const allDone = coreTicks.every(
      row => row.length === routine.length
    );

    return `
      <div class="m1002-finisher-panel">
        <h4>Core Finisher</h4>
        <p class="m1002-muted">
          Round ${coreRound + 1} of 3
        </p>

        <div class="m1002-options">
          ${[0, 1, 2].map(n => `
            <button type="button"
              data-m1002-core-round="${n}"
              class="${coreRound === n ? "active" : ""}">
              ROUND ${n + 1}
              ${coreTicks[n].length === routine.length
                ? " ✓" : ""}
            </button>
          `).join("")}
        </div>

        ${routine.map(([name, reps], i) => `
          <label class="m1002-core-item">
            <input type="checkbox"
              data-m1002-core-check="${i}"
              ${current.includes(i) ? "checked" : ""}>
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

        ${!allDone && coreRound < 2
          ? `<button type="button"
              class="m1002-secondary"
              style="width:100%"
              data-m1002-core-next>
              NEXT ROUND →
            </button>`
          : ""}

        <button type="button"
          class="m1002-finisher-save"
          data-m1002-core-save
          ${allDone ? "" : "disabled"}>
          FINISH & SAVE CORE ✓
        </button>

        <button type="button"
          class="m1002-secondary"
          style="width:100%;margin-top:8px"
          data-m1002-finisher-close>
          CLOSE
        </button>
      </div>
    `;
  }

  function showFinisher(kind) {
    const panel = $("m1002FinisherPanel");
    if (!panel) return;

    panel.innerHTML =
      kind === "cardio" ? cardioHTML() : coreHTML();

    fitSlide();
  }

  async function persistFinisher(kind) {
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
        exercises: routine.map(([name, target]) => ({
          name,
          target,
          roundsCompleted: 3
        })),
        completedAt: new Date().toISOString()
      };
    }

    backup();
    clearTimeout(saveTimer);

    const panel = $("m1002FinisherPanel");

    if (panel) {
      panel.innerHTML = `
        <p class="m1002-status">
          Saving ${esc(kind)} to Mana cloud…
        </p>
      `;
    }

    const saved = await queueSave(false);

    if (saved) {
      if (panel) panel.innerHTML = "";
      showFinisherStatus();
    } else if (panel) {
      panel.innerHTML = `
        <p class="m1002-status">
          Save failed. Local backup retained.
        </p>
        <button type="button"
          class="m1002-finisher-save"
          data-m1002-retry="${kind}">
          RETRY SAVE
        </button>
      `;
    }

    fitSlide();
  }

  function slides() {
    return [
      ...($("m1002Carousel")
        ?.querySelectorAll(".m1002-slide") || [])
    ];
  }

  function fitSlide() {
    requestAnimationFrame(() => {
      const carousel = $("m1002Carousel");
      const active = slides()[slide];

      if (carousel && active) {
        const h = Math.ceil(active.scrollHeight);
        if (h > 0) carousel.style.height = h + "px";
      }
    });
  }

  function navigate(index, smooth = true) {
    const carousel = $("m1002Carousel");
    const pages = slides();

    if (!carousel || !pages.length) return;

    slide = Math.max(
      0, Math.min(index, pages.length - 1)
    );

    carousel.scrollTo({
      left: carousel.clientWidth * slide,
      behavior: smooth ? "smooth" : "auto"
    });

    renderNavigation();
    fitSlide();
  }

  function syncTickAll() {
    slides().forEach(page => {
      const button = page.querySelector(
        "[data-m1002-tick-exercise]"
      );

      if (!button) return;

      const ticks = [
        ...page.querySelectorAll("[data-m1002-tick]")
      ];

      const done = ticks.length &&
        ticks.every(t => t.classList.contains("done"));

      button.classList.toggle("done", !!done);
      button.textContent = done
        ? "ALL SETS COMPLETE ✓"
        : "TICK ALL SETS ✓";
    });

    const button = $("m1002Carousel")?.querySelector(
      "[data-m1002-tick-workout]"
    );

    if (button) {
      const ticks = [
        ...$("m1002Carousel").querySelectorAll(
          "[data-m1002-tick]"
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

  function renderNavigation() {
    const total = slides().length;

    if ($("m1002Position")) {
      $("m1002Position").textContent =
        slide === total - 1
          ? "Cardio, Core & Feedback"
          : `Exercise ${slide + 1} of ${total - 1}`;
    }

    if ($("m1002Dots")) {
      $("m1002Dots").innerHTML = slides().map(
        (page, i) => {
          const ticks = [
            ...page.querySelectorAll("[data-m1002-tick]")
          ];
          const done = ticks.length &&
            ticks.every(t => t.classList.contains("done"));

          return `
            <button type="button"
              data-m1002-slide="${i}"
              class="m1002-dot
                ${i === slide ? "active" : ""}
                ${done ? "done" : ""}">
            </button>
          `;
        }
      ).join("");
    }

    if ($("m1002Previous")) {
      $("m1002Previous").disabled = slide === 0;
    }

    if ($("m1002Next")) {
      $("m1002Next").disabled = slide === total - 1;
      $("m1002Next").textContent =
        slide === total - 2 ? "FINISHERS ›" : "NEXT ›";
    }

    syncTickAll();
    fitSlide();
  }

  function readSets() {
    if (!session) return [];

    return [
      ...($("m1002Carousel")
        ?.querySelectorAll("[data-m1002-ex]") || [])
    ].map(card => ({
      id: card.dataset.m1002Ex,
      name: session.exercises.find(
        e => e.id === card.dataset.m1002Ex
      )?.exercise_name || "",
      sets: [
        ...card.querySelectorAll("[data-m1002-set]")
      ].map((row, i) => ({
        set: i + 1,
        weight: row.querySelector(
          "[data-m1002-weight]"
        )?.value || "",
        reps: Number(row.querySelector(
          "[data-m1002-reps]"
        )?.value || 0),
        done: !!row.querySelector(
          "[data-m1002-tick]"
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
          volume +=
            Number(set.weight || 0) *
            Number(set.reps || 0);
        }
      });
    });

    return {
      all,
      done,
      volume: Math.round(volume * 10) / 10,
      percent: all ? Math.round(done / all * 100) : 0
    };
  }

  function backupKey() {
    if (!session || !account) return "";

    return [
      "mana-coach-draft-v1",
      account,
      session.programId,
      session.day.id
    ].join(":");
  }

  function backup() {
    if (!session) return;

    try {
      localStorage.setItem(backupKey(), JSON.stringify({
        updatedAt: Date.now(),
        elapsed: clockSeconds(),
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

    renderNavigation();
    backup();

    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      saveTimer = null;
      void queueSave();
    }, 1000);
  }

  function queueSave(completed = false) {
    if (!session) return Promise.resolve(false);

    const data = readSets();
    const result = totals(data);

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
      status: completed ? "completed" : "in_progress",
      started_at: new Date(
        Date.now() - clockSeconds() * 1000
      ).toISOString(),
      completed_at: completed
        ? new Date().toISOString()
        : null,
      duration_seconds: clockSeconds(),
      exercises: data,
      finishers: JSON.parse(JSON.stringify(finishers)),
      workout_rating: rating || null,
      workout_comment: comment.trim() || null,
      completed_sets: result.done,
      total_sets: result.all,
      total_volume: result.volume,
      updated_at: new Date().toISOString()
    };

    const operation = saveChain
      .catch(() => false)
      .then(async () => {
        const c = await db();

        const response = await c
          .from("coach_workout_logs")
          .upsert(snapshot, { onConflict: "id" });

        if (response.error) throw response.error;

        if (completed) clearBackup();

        return true;
      })
      .catch(error => {
        console.warn("[Mana Coach Save]", error);

        const status =
          $("m1002FinishStatus") ||
          $("m1002SaveStatus");

        if (status) {
          status.textContent =
            "Cloud save failed: " +
            (error.message || error);
        }

        return false;
      });

    saveChain = operation;
    return operation;
  }

  async function openDay(dayId) {
    const day = programData?.days.find(
      d => d.id === dayId
    );

    if (!day || !account || !selected) return;

    const token = ++serial;
    stopClock();

    const exercises = programData.exercises.filter(
      e => e.program_day_id === dayId
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

    showModal(`
      <div class="m1002-position">
        <span id="m1002Position">Exercise 1</span>
        <small>Swipe left / right</small>
      </div>

      <div id="m1002Dots" class="m1002-dots"></div>

      <div id="m1002Carousel"
        class="m1002-carousel">
        <div class="m1002-slide">
          Loading previous sets…
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

      <p id="m1002SaveStatus"
        class="m1002-status"></p>
    `);

    let prior = [];
    let fromCompleted = false;

    try {
      const c = await db();

      const response = await c
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", account)
        .eq("program_id", session.programId)
        .eq("program_day_id", dayId)
        .order("updated_at", { ascending: false })
        .limit(12);

      if (response.error) throw response.error;
      if (token !== serial) return;

      const active = (response.data || []).find(
        r => r.status === "in_progress"
      );

      const completed = (response.data || []).find(
        r => r.status === "completed"
      );

      const local = readBackup();

      if (active) {
        session.logId = active.id;
        elapsedBase = Number(
          active.duration_seconds
        ) || 0;
      }

      prior =
        active?.exercises ||
        completed?.exercises ||
        [];

      fromCompleted = !active && !!completed;
      finishers = active?.finishers || {};
      rating = Number(active?.workout_rating) || 0;
      comment = active?.workout_comment || "";

      if (
        local?.exercises &&
        (!active ||
          Number(local.updatedAt) >
          Date.parse(active.updated_at))
      ) {
        prior = local.exercises;
        finishers = local.finishers || {};
        rating = Number(local.rating) || 0;
        comment = local.comment || "";
        elapsedBase = Number(local.elapsed) || 0;
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

    if (token !== serial || !session) return;

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
                carousel.scrollLeft / carousel.clientWidth
              )
            )
          );

          renderNavigation();
        }, 70);
      },
      { passive: true }
    );

    resizeObserver?.disconnect();

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(fitSlide);

      slides().forEach(page =>
        resizeObserver.observe(page)
      );
    }

    showFinisherStatus();
    navigate(0, false);
  }

  function summaryHTML(record) {
    const t = totals(record.exercises);

    const stat = (label, value, sub) => `
      <div class="m1002-summary-stat">
        <small>${esc(label)}</small>
        <strong>${esc(value)}</strong>
        <small>${esc(sub)}</small>
      </div>
    `;

    return `
      <div class="m1002-summary">
        <div class="m1002-summary-check">✓</div>

        <span class="m1002-kicker">
          MANA STRENGTH • COACH PROGRAM
        </span>

        <h1>Workout Complete</h1>
        <p class="m1002-muted">
          ${esc(record.session_name)}
        </p>

        <div class="m1002-summary-grid">
          ${stat("Sets", `${t.done}/${t.all}`, "Completed")}
          ${stat("Completion", `${t.percent}%`, "Session")}
          ${stat("Volume", `${t.volume} kg`, "Total lifted")}
          ${stat(
            "Time",
            formatTime(record.duration_seconds),
            "Workout duration"
          )}
        </div>

        <div class="m1002-summary-note">
          <strong>Session complete.</strong>
          <div>
            Strong work. Recover well and keep building.
          </div>

          ${record.finishers?.cardio?.completed
            ? `<div>
                ✓ Cardio:
                ${esc(record.finishers.cardio.equipment)}
                • ${Number(
                  record.finishers.cardio.durationMinutes || 0
                )} minutes
              </div>`
            : ""}

          ${record.finishers?.core?.completed
            ? `<div>
                ✓ Core:
                ${Number(record.finishers.core.rounds || 3)}
                rounds completed
              </div>`
            : ""}

          ${record.workout_rating
            ? `<div>
                Rating ${record.workout_rating}/5
              </div>`
            : ""}

          ${record.workout_comment
            ? `<div>
                Comments: ${esc(record.workout_comment)}
              </div>`
            : ""}
        </div>

        <button type="button"
          class="m1002-primary"
          data-m1002-progress-go>
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

    const t = totals();

    if (!t.done) {
      const status = $("m1002FinishStatus");

      if (status) {
        status.textContent =
          "Complete at least one set first.";
      }

      return;
    }

    clearTimeout(saveTimer);
    backup();

    const button = document.querySelector(
      `#${MODAL} [data-m1002-complete]`
    );

    if (button) button.disabled = true;

    const record = {
      session_name: session.day.title || "Workout",
      duration_seconds: clockSeconds(),
      exercises: readSets(),
      finishers: JSON.parse(JSON.stringify(finishers)),
      workout_rating: rating,
      workout_comment: comment
    };

    const saved = await queueSave(true);

    if (!saved) {
      if (button) button.disabled = false;
      return;
    }

    stopClock();
    session = null;

    showModal(summaryHTML(record));

    progressLoadAt = 0;

    window.dispatchEvent(
      new CustomEvent("mana:coach-workout-saved", {
        detail: {
          programId: programData?.program?.id
        }
      })
    );
  }

  function backToProgram() {
    ++serial;
    stopClock();

    if (session) {
      backup();
      void queueSave();
    }

    session = null;
    renderProgram();
  }

  function tickAll(root) {
    const buttons = [
      ...(root?.querySelectorAll("[data-m1002-tick]") || [])
    ];

    buttons.forEach(button => {
      button.classList.add("done");
      button.setAttribute("aria-pressed", "true");
    });

    if (buttons.length) localEdit();
  }

  function progressRows(logs) {
    return logs.map(r => `
      <details class="m1002-history">
        <summary>
          ${esc(r.session_name || "Workout")}
          • ${new Date(
            r.completed_at || r.updated_at
          ).toLocaleDateString("en-AU")}
        </summary>

        <p class="m1002-muted">
          ${Number(r.completed_sets || 0)}
          /${Number(r.total_sets || 0)} sets
          • ${Number(r.total_volume || 0)} kg
          • ${formatTime(r.duration_seconds)}
        </p>

        ${(r.exercises || []).map(e => `
          <div class="m1002-history-exercise">
            <strong>${esc(e.name)}</strong>
            <div>
              ${(e.sets || []).map(s => `
                Set ${s.set}:
                ${esc(s.weight || 0)} kg ×
                ${esc(s.reps || 0)} reps
                ${s.done ? "✓" : ""}
              `).join(" • ")}
            </div>
          </div>
        `).join("")}

        ${r.finishers?.cardio?.completed
          ? `<p class="m1002-muted">
              ✓ Cardio:
              ${esc(r.finishers.cardio.equipment)}
              • ${r.finishers.cardio.durationMinutes} min
            </p>`
          : ""}

        ${r.finishers?.core?.completed
          ? `<p class="m1002-muted">
              ✓ Core: 3 rounds
            </p>`
          : ""}

        ${r.workout_rating
          ? `<p class="m1002-muted">
              Rating: ${r.workout_rating}/5
            </p>`
          : ""}

        ${r.workout_comment
          ? `<p class="m1002-muted">
              ${esc(r.workout_comment)}
            </p>`
          : ""}
      </details>
    `).join("");
  }

  function renderProgress() {
    const now = new Date();
    const start = new Date(now);

    if (progressPeriod === "daily") {
      start.setHours(0, 0, 0, 0);
    } else if (progressPeriod === "weekly") {
      start.setDate(
        now.getDate() - (now.getDay() + 6) % 7
      );
      start.setHours(0, 0, 0, 0);
    } else if (progressPeriod === "monthly") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }

    const logs = progressPeriod === "all"
      ? progressLogs
      : progressLogs.filter(r =>
          new Date(r.completed_at || r.updated_at) >= start
        );

    const completedSets = logs.reduce(
      (n, r) => n + Number(r.completed_sets || 0),
      0
    );

    const totalSets = logs.reduce(
      (n, r) => n + Number(r.total_sets || 0),
      0
    );

    const cardio = logs.filter(
      r => r.finishers?.cardio?.completed
    ).length;

    const core = logs.filter(
      r => r.finishers?.core?.completed
    ).length;

    const pct = (a, b) =>
      b ? Math.round(a / b * 100) : 0;

    const metric = (label, value, sub) => `
      <div class="mana-v993-metric">
        <div class="mana-v993-metric-label">
          ${esc(label)}
        </div>
        <div class="mana-v993-metric-value">
          ${value}%
        </div>
        <div class="mana-v993-metric-sub">
          ${esc(sub)}
        </div>
        <div class="mana-v993-track">
          <div class="mana-v993-fill"
            style="width:${Math.min(100, value)}%">
          </div>
        </div>
      </div>
    `;

    const panel = (kicker, title, body) => `
      <div class="mana-v993-panel">
        <div class="mana-v993-panel-head">
          <div>
            <div class="mana-v993-panel-kicker">
              ${esc(kicker)}
            </div>
            <h3>${esc(title)}</h3>
          </div>
        </div>
        ${body}
      </div>
    `;

    const exerciseMap = new Map();

    logs.slice().reverse().forEach(r => {
      (r.exercises || []).forEach(e => {
        if (!exerciseMap.has(e.name)) {
          exerciseMap.set(e.name, []);
        }

        const done = (e.sets || []).filter(
          set => set.done
        );

        if (!done.length) return;

        const best = Math.max(
          ...done.map(set => Number(set.weight) || 0)
        );

        exerciseMap.get(e.name).push({
          date: r.completed_at || r.updated_at,
          weight: best
        });
      });
    });

    let details = "";

    if (progressDetail === "workouts") {
      details = panel(
        "TRAINING HISTORY",
        "Workouts Complete",
        progressRows(logs) ||
          `<p class="m1002-muted">
            No completed coach workouts in this period.
          </p>`
      );
    } else {
      const rows = [...exerciseMap].map(
        ([name, values]) => {
          const best = Math.max(
            ...values.map(v => v.weight)
          );

          return `
            <div class="mana-v993-row">
              <div>
                <div class="mana-v993-row-title">
                  ${esc(name)}
                </div>
              </div>
              <div class="mana-v993-row-value">
                ${best} kg
              </div>
            </div>
          `;
        }
      ).join("");

      const titles = {
        weight: "Weight Progression",
        pbs: "Personal Bests",
        exercise: "By Exercise"
      };

      details = panel(
        "STRENGTH",
        titles[progressDetail] || "By Exercise",
        rows || `<p class="m1002-muted">
          Exercise history will appear here.
        </p>`
      );
    }

    const periods = [
      ["daily", "DAILY"],
      ["weekly", "WEEKLY"],
      ["monthly", "MONTHLY"],
      ["all", "ALL TIME"]
    ];

    const detailTabs = [
      ["weight", "WEIGHT PROGRESSION"],
      ["pbs", "PERSONAL BESTS"],
      ["exercise", "BY EXERCISE"],
      ["workouts", "WORKOUTS COMPLETE"]
    ];

    return `
      <div class="mana-v993-head">
        <div class="mana-v993-kicker">
          MANA STRENGTH • COACH PROGRAMS
        </div>
        <h2>Your Progress</h2>
        <p>
          Coach-assigned training results.
        </p>
      </div>

      <div class="mana-v993-periods">
        ${periods.map(([key, label]) => `
          <button type="button"
            data-m1002-period="${key}"
            class="mana-v993-period
              ${progressPeriod === key ? "active" : ""}">
            ${label}
          </button>
        `).join("")}
      </div>

      <div class="mana-v993-metrics">
        ${metric(
          "WORKOUTS",
          pct(completedSets, totalSets),
          `${logs.length} completed`
        )}
        ${metric(
          "CARDIO",
          pct(cardio, logs.length),
          `${cardio} sessions`
        )}
        ${metric(
          "CORE",
          pct(core, logs.length),
          `${core} sessions`
        )}
        ${metric(
          "STRENGTH",
          pct(completedSets, totalSets),
          `${completedSets} sets complete`
        )}
      </div>

      <div class="mana-v993-detail-nav">
        ${detailTabs.map(([key, label]) => `
          <button type="button"
            data-m1002-detail="${key}"
            class="mana-v993-detail-btn
              ${progressDetail === key ? "active" : ""}">
            ${label}
          </button>
        `).join("")}
      </div>

      ${details}

      ${progressError
        ? `<p class="m1002-muted">
            ${esc(progressError)}
          </p>`
        : ""}
    `;
  }

  function mountProgress() {
    if (!progressOpen()) return;

    const root = $(ROOT);
    if (!root) return;

    let switcher = $(PSW);
    let panel = $(PROGRESS);

    if (!switcher) {
      switcher = document.createElement("div");
      switcher.id = PSW;
      switcher.innerHTML = `
        <button type="button"
          data-m1002-progress-mode="generated">
          My Workouts
        </button>
        <button type="button"
          data-m1002-progress-mode="coach">
          Coach Programs
        </button>
      `;
    }

    if (switcher.parentElement !== root) {
      root.prepend(switcher);
    }

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PROGRESS;
    }

    if (panel.parentElement !== root) {
      switcher.after(panel);
    }

    root.classList.toggle(
      "m1002-show-coach",
      progressMode === "coach"
    );

    switcher.querySelectorAll("button").forEach(b => {
      b.classList.toggle(
        "active",
        b.dataset.m1002ProgressMode === progressMode
      );
    });

    if (progressMode === "coach") {
      const signature = [
        progressLoadAt,
        progressPeriod,
        progressDetail,
        progressLogs.length,
        progressError
      ].join("|");

      if (panel.dataset.render !== signature) {
        panel.innerHTML = renderProgress();
        panel.dataset.render = signature;
      }
    }
  }

  async function loadProgress(force = false) {
    if (!progressOpen() || progressLoading) return;

    if (
      !force &&
      progressLoadAt &&
      Date.now() - progressLoadAt < 15000
    ) {
      mountProgress();
      return;
    }

    progressLoading = true;
    progressError = "";

    const token = ++progressToken;

    try {
      const c = await db();
      const auth = await c.auth.getUser();
      const id = auth.data?.user?.id;

      if (!id) {
        progressLogs = [];
        progressUser = "";
        progressError = "Sign in to view coach workouts.";
        return;
      }

      const response = await c
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(500);

      if (response.error) throw response.error;
      if (token !== progressToken) return;

      progressUser = id;
      progressLogs = response.data || [];
      progressLoadAt = Date.now();

    } catch (error) {
      progressError = error.message || String(error);
      console.warn("[Mana Coach Progress]", error);
    } finally {
      progressLoading = false;

      if ($(PROGRESS)) {
        $(PROGRESS).dataset.render = "";
      }

      mountProgress();
    }
  }

  function goProgress() {
    ++serial;
    stopClock();

    session = null;
    selected = null;
    programData = null;

    $(MODAL)?.classList.remove("open");

    progressMode = "coach";

    document.querySelector(
      '#manaV83Tabs [data-v83-tab="progress"]'
    )?.click();

    setTimeout(() => {
      mountProgress();
      void loadProgress(true);
    }, 300);
  }

  function handleClick(event) {
    const el = event.target;
    if (!(el instanceof Element)) return;

    let button;

    if ((button = el.closest(
      "[data-m1002-progress-mode]"
    ))) {
      progressMode = button.dataset.m1002ProgressMode;
      mountProgress();

      if (progressMode === "coach") {
        void loadProgress();
      }
      return;
    }

    if ((button = el.closest(
      "[data-m1002-period]"
    ))) {
      progressPeriod = button.dataset.m1002Period;
      if ($(PROGRESS)) $(PROGRESS).dataset.render = "";
      mountProgress();
      return;
    }

    if ((button = el.closest(
      "[data-m1002-detail]"
    ))) {
      progressDetail = button.dataset.m1002Detail;
      if ($(PROGRESS)) $(PROGRESS).dataset.render = "";
      mountProgress();
      return;
    }

    if (el.closest("[data-m1002-progress-go]")) {
      goProgress();
      return;
    }

    if ((button = el.closest("[data-m1002-mode]"))) {
      changeMode(button.dataset.m1002Mode);
      return;
    }

    if (el.closest("[data-m1002-back]")) {
      if (session) backToProgram();
      else closeModal();
      return;
    }

    if (el.closest("[data-m1002-program-back]")) {
      backToProgram();
      return;
    }

    if ((button = el.closest(
      "[data-m1002-program]"
    ))) {
      void openProgram(button.dataset.m1002Program);
      return;
    }

    if ((button = el.closest("[data-m1002-week]"))) {
      week = Number(button.dataset.m1002Week);
      renderProgram();
      return;
    }

    if ((button = el.closest("[data-m1002-start]"))) {
      void openDay(button.dataset.m1002Start);
      return;
    }

    if ((button = el.closest("[data-m1002-demo]"))) {
      const name = button.dataset.m1002Demo;
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

    if (el.closest("[data-m1002-previous]")) {
      navigate(slide - 1);
      return;
    }

    if (el.closest("[data-m1002-next]")) {
      navigate(slide + 1);
      return;
    }

    if ((button = el.closest("[data-m1002-slide]"))) {
      navigate(Number(button.dataset.m1002Slide));
      return;
    }

    if ((button = el.closest("[data-m1002-tick]"))) {
      button.classList.toggle("done");
      localEdit();
      return;
    }

    if ((button = el.closest(
      "[data-m1002-tick-exercise]"
    ))) {
      tickAll(button.closest("[data-m1002-ex]"));
      return;
    }

    if (el.closest("[data-m1002-tick-workout]")) {
      tickAll($("m1002Carousel"));
      return;
    }

    if ((button = el.closest("[data-m1002-rating]"))) {
      rating = Number(button.dataset.m1002Rating);
      refreshRatings();
      localEdit();
      return;
    }

    if ((button = el.closest(
      "[data-m1002-finisher]"
    ))) {
      showFinisher(button.dataset.m1002Finisher);
      return;
    }

    if ((button = el.closest(
      "[data-m1002-cardio-equipment]"
    ))) {
      cardioEquipment =
        button.dataset.m1002CardioEquipment;
      showFinisher("cardio");
      return;
    }

    if ((button = el.closest(
      "[data-m1002-cardio-minutes]"
    ))) {
      cardioMinutes = Number(
        button.dataset.m1002CardioMinutes
      );
      showFinisher("cardio");
      return;
    }

    if (el.closest("[data-m1002-cardio-complete]")) {
      void persistFinisher("cardio");
      return;
    }

    if ((button = el.closest(
      "[data-m1002-retry]"
    ))) {
      void persistFinisher(button.dataset.m1002Retry);
      return;
    }

    if ((button = el.closest(
      "[data-m1002-core-round]"
    ))) {
      coreRound = Number(button.dataset.m1002CoreRound);
      showFinisher("core");
      return;
    }

    if (el.closest("[data-m1002-core-tick-round]")) {
      coreTicks[coreRound] =
        coreRoutine().map((_, i) => i);
      showFinisher("core");
      return;
    }

    if (el.closest("[data-m1002-core-tick-all]")) {
      const indices = coreRoutine().map((_, i) => i);
      coreTicks = [
        [...indices],
        [...indices],
        [...indices]
      ];
      showFinisher("core");
      return;
    }

    if (el.closest("[data-m1002-core-next]")) {
      coreRound = Math.min(2, coreRound + 1);
      showFinisher("core");
      return;
    }

    if (el.closest("[data-m1002-core-save]")) {
      void persistFinisher("core");
      return;
    }

    if (el.closest("[data-m1002-finisher-close]")) {
      if ($("m1002FinisherPanel")) {
        $("m1002FinisherPanel").innerHTML = "";
      }
      fitSlide();
      return;
    }

    if (el.closest("[data-m1002-complete]")) {
      void completeWorkout();
    }
  }

  function handleInput(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (!target.closest("#" + MODAL)) return;

    if (target.matches("[data-m1002-weight]")) {
      const card = target.closest("[data-m1002-ex]");

      card?.querySelectorAll(
        "[data-m1002-weight]"
      ).forEach(input => {
        if (input !== target) input.value = target.value;
      });

      localEdit();
      return;
    }

    if (target.matches("[data-m1002-reps]")) {
      localEdit();
      return;
    }

    if (target.id === "m1002WorkoutComment") {
      comment = target.value.slice(0, 500);
      localEdit();
      return;
    }

    if (target.matches("[data-m1002-core-check]")) {
      const n = Number(
        target.dataset.m1002CoreCheck
      );

      const values = new Set(coreTicks[coreRound]);

      if (target.checked) values.add(n);
      else values.delete(n);

      coreTicks[coreRound] = [
        ...values
      ].sort((a, b) => a - b);

      showFinisher("core");
    }
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
      if (workoutOpen()) {
        applyMode();

        if (mode === "coach") {
          void loadAssignments();
        }
      } else if (legacyOpen()) {
        renderLegacy();
        void loadAssignments();
      }

      if (progressOpen()) {
        mountProgress();

        if (progressMode === "coach") {
          void loadProgress();
        }
      }
    }, 160);
  }

  function init() {
    try {
      mode = sessionStorage.getItem(MODE_KEY) === "coach"
        ? "coach"
        : "generated";
    } catch (_) {}

    installStyle();
    ensureModal();
    ensureLegacy();

    const holder = $("manaV83Content");

    if (holder) {
      new MutationObserver(() => {
        if (
          workoutOpen() &&
          (!$(SW) || !$(PANEL))
        ) {
          applyMode();
        }

        if (
          progressOpen() &&
          (!$(PSW) || !$(PROGRESS))
        ) {
          scheduleRefresh();
        }
      }).observe(holder, {
        childList: true
      });
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);

    document.addEventListener("change", event => {
      if (event.target?.matches?.(
        "[data-m1002-core-check]"
      )) {
        handleInput(event);
      }
    });

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

    window.addEventListener(
      "mana:coach-workout-saved",
      () => {
        progressLoadAt = 0;
        scheduleRefresh();
      }
    );

    document.addEventListener(
      "click",
      event => {
        if (event.target.closest(
          '#manaV83Tabs [data-v83-tab="progress"]'
        )) {
          setTimeout(scheduleRefresh, 150);
        }
      },
      true
    );

    window.addEventListener("resize", fitSlide);

    window.addEventListener("mana:logout", () => {
      ++loadingSerial;
      ++progressToken;

      account = "";
      assignments = [];
      loadedAt = 0;

      progressUser = "";
      progressLogs = [];
      progressLoadAt = 0;

      closeModal();
    });

    window.refreshManaAssignedPrograms =
      () => loadAssignments(true);

    window.refreshManaCoachProgress =
      () => loadProgress(true);

    window.MANA_CLIENT_CUSTOM_PROGRAM_BUILD = BUILD;

    scheduleRefresh();

    console.log(
      "[Mana Movement] Coach Workouts " + BUILD
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
