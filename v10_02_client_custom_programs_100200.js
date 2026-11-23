
/*
 MANA MOVEMENT
 COACH WORKOUTS — BUILD 100207

 COMPLETE REPLACEMENT:
 v10_02_client_custom_programs_100200.js

 - Same Mana Strength exercise-card styling
 - Same demonstration library
 - Weight / rep inputs and set completion
 - Workout timer, progress, volume
 - Autosave and completed workout cloud logs
 - Separate coach-program identifiers
 - Original generated workouts untouched
*/

(() => {
  "use strict";

  const BUILD = "100207";
  const STYLE = "mana-v1002-client-custom-style";
  const SWITCH = "manaV1002WorkoutSwitch";
  const PANEL = "manaV1002CoachPanel";
  const LEGACY = "manaV1002AssignedPrograms";
  const MODAL = "manaV1002CustomProgramModal";
  const MODE_KEY = "mana-strength-workout-view-100205";

  const $ = id => document.getElementById(id);

  const esc = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  let mode = "generated";
  let assignments = [];
  let account = "";
  let loading = false;
  let loadSerial = 0;
  let selected = null;
  let programData = null;
  let week = 1;
  let session = null;
  let saveTimer = null;
  let saveChain = Promise.resolve();
  let opening = 0;
  let refreshTimer = null;
  let contentObserver = null;
  let elapsedTimer = null;
  let startedAt = 0;
  let elapsedBase = 0;

  async function db() {
    if (typeof window.supabaseClient !== "function") {
      throw Error("Cloud connection unavailable");
    }
    return await window.supabaseClient();
  }

  function isStrengthWorkouts() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent?.trim()?.toUpperCase() ===
        "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab].active'
      )?.dataset.v83Tab === "program"
    );
  }

  function legacyVisible() {
    return !!(
      $("clientProgramsView") &&
      !$("clientProgramsView").classList.contains("hide")
    );
  }

  function rememberedMode() {
    try {
      return sessionStorage.getItem(MODE_KEY) === "coach"
        ? "coach"
        : "generated";
    } catch (_) {
      return "generated";
    }
  }

  function rememberMode() {
    try {
      sessionStorage.setItem(MODE_KEY, mode);
    } catch (_) {}
  }

  function backupKey() {
    return session && account
      ? `mana-coach-draft-v1:${account}:${session.programId}:${session.day.id}`
      : "";
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

  function backup() {
    if (!session) return;

    try {
      localStorage.setItem(
        backupKey(),
        JSON.stringify({
          updatedAt: Date.now(),
          startedAt,
          elapsedBase,
          exercises: readSets()
        })
      );
    } catch (_) {}
  }

  function clearBackup() {
    try {
      localStorage.removeItem(backupKey());
    } catch (_) {}
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));

    return String(Math.floor(s / 60)).padStart(2, "0") +
      ":" + String(s % 60).padStart(2, "0");
  }

  function elapsed() {
    return elapsedBase +
      (startedAt
        ? Math.floor((Date.now() - startedAt) / 1000)
        : 0);
  }

  function tickClock() {
    const node = $("m1002Time");

    if (node) {
      node.textContent = formatTime(elapsed());
    }
  }

  function stopClock() {
    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      elapsedTimer = null;
    }

    if (startedAt) {
      elapsedBase = elapsed();
      startedAt = 0;
    }
  }

  function startClock() {
    if (!startedAt) startedAt = Date.now();

    if (elapsedTimer) clearInterval(elapsedTimer);

    elapsedTimer = setInterval(tickClock, 1000);
    tickClock();
  }

  function css() {
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
        min-width:0;
        min-height:46px;
        background:#191b1f;
        color:#d3d6db;
        border:1px solid transparent;
        border-radius:11px;
        font-family:inherit;
        font-size:12px;
        font-weight:800;
      }

      #${SWITCH} button.active {
        background:#251b15;
        color:#ff8126;
        border-color:#ff8126;
      }

      #manaV83Content.m1002-coach-mode
      > :not(#${SWITCH}):not(#${PANEL}) {
        display:none!important;
      }

      #manaV83Content.m1002-coach-mode
      > #${SWITCH} {
        display:grid!important;
      }

      #${PANEL} {
        display:none;
        margin:0 0 16px;
      }

      #manaV83Content.m1002-coach-mode
      > #${PANEL} {
        display:block!important;
      }

      #${PANEL} .m1002-shell {
        border:1px solid #34383e;
        border-radius:17px;
        overflow:hidden;
        background:#101113;
        color:#fff;
      }

      #${PANEL} .m1002-header {
        padding:18px;
        border-bottom:1px solid #292d32;
        background:#121315;
      }

      #${PANEL} .m1002-header small {
        color:#ff8126;
        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
      }

      #${PANEL} .m1002-header h3 {
        color:#fff!important;
        font-size:20px;
        margin:5px 0;
      }

      #${PANEL} .m1002-header p {
        margin:0;
        color:#aeb4bc;
        font-size:12px;
        line-height:1.5;
      }

      #${PANEL} .m1002-body {
        padding:14px;
      }

      .m1002-program {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        width:100%;
        margin:0 0 10px;
        padding:16px;
        border:1px solid #3b4047!important;
        border-radius:14px;
        background:#17191c!important;
        color:#fff!important;
        font-family:inherit;
        text-align:left;
      }

      .m1002-program strong {
        display:block;
        color:#fff!important;
        font-size:15px;
      }

      .m1002-program small {
        display:block;
        color:#b4bac2!important;
        font-size:12px;
        margin-top:5px;
        line-height:1.5;
      }

      .m1002-pill {
        flex-shrink:0;
        color:#ff8126;
        border:1px solid #794521;
        border-radius:20px;
        padding:6px 9px;
        font-size:10px;
        font-weight:900;
      }

      .m1002-empty-card {
        text-align:center;
        padding:22px 15px;
        border:1px solid #353940;
        border-radius:15px;
        background:#17191c;
      }

      .m1002-empty-icon {
        margin:0 auto 12px;
        width:50px;
        height:50px;
        border:1px solid #704223;
        border-radius:50%;
        background:#261c16;
        display:grid;
        place-items:center;
        color:#ff8126;
      }

      .m1002-empty-card h4 {
        margin:0 0 8px;
        color:#fff!important;
        font-size:18px;
      }

      .m1002-empty-card p {
        margin:0 auto;
        color:#b8bec6;
        font-size:12px;
        line-height:1.6;
        max-width:380px;
      }

      .m1002-empty-card .m1002-foot {
        margin-top:12px;
        color:#ff8126;
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
          calc(15px + env(safe-area-inset-top))
          14px
          calc(40px + env(safe-area-inset-bottom));
      }

      #${MODAL}.open {
        display:block;
      }

      #${MODAL} .m1002-inner {
        max-width:620px;
        margin:auto;
      }

      #${MODAL} .m1002-top {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        position:sticky;
        top:-15px;
        z-index:10;
        background:#050505;
        padding:12px 0;
      }

      #${MODAL} .m1002-kicker {
        color:#ff8126;
        font-size:11px;
        font-weight:900;
        letter-spacing:.08em;
      }

      #${MODAL} button {
        font-family:inherit;
      }

      #${MODAL} .m1002-back {
        padding:10px 13px;
        background:#191a1d;
        color:#fff;
        border:1px solid #444;
        border-radius:12px;
        font-size:12px;
        font-weight:800;
      }

      #${MODAL} .m1002-hero {
        border:1px solid #34383e;
        border-radius:17px;
        background:#111214;
        padding:17px;
        margin-bottom:12px;
      }

      #${MODAL} .m1002-hero h2 {
        color:#fff;
        margin:6px 0;
        font-size:22px;
      }

      #${MODAL} .m1002-hero p {
        margin:0;
        color:#adb4bd;
        font-size:12px;
        line-height:1.5;
      }

      #${MODAL} .m1002-weeks {
        display:flex;
        overflow-x:auto;
        gap:8px;
        margin:0 0 14px;
      }

      #${MODAL} .m1002-weeks button {
        flex:0 0 auto;
        background:#18191b;
        border:1px solid #444;
        border-radius:10px;
        color:#ccc;
        font-size:12px;
        font-weight:800;
        padding:11px 13px;
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
        margin:0 0 12px;
        color:#fff;
        box-shadow:none;
      }

      #${MODAL} .m1002-day-heading {
        font-size:11px;
        font-weight:900;
        letter-spacing:.06em;
        color:#ff8126;
      }

      #${MODAL} .mana-v85-day h3 {
        margin:7px 0;
        color:#fff;
        font-size:18px;
      }

      #${MODAL} .m1002-day-notes {
        color:#b7bdc5;
        font-size:12px;
        line-height:1.5;
        margin:0 0 12px;
      }

      #${MODAL} .m1002-primary {
        width:100%;
        min-height:45px;
        color:#151515;
        background:#ff8126;
        border:0;
        border-radius:12px;
        font-size:13px;
        font-weight:900;
        padding:12px 14px;
        margin:8px 0 0;
      }

      #${MODAL} .m1002-secondary {
        min-height:38px;
        padding:8px 12px;
        border:1px solid #41454b;
        border-radius:10px;
        background:#17191c;
        color:#fff;
        font-weight:800;
        font-size:12px;
      }

      #${MODAL} .m1002-actions {
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        align-items:center;
        margin:12px 0;
      }

      #${MODAL} .m1002-stats {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:9px;
        margin:12px 0;
      }

      #${MODAL} .m1002-stat {
        background:#111214;
        border:1px solid #353940;
        border-radius:12px;
        padding:12px;
      }

      #${MODAL} .m1002-stat small {
        display:block;
        color:#aaa;
        font-size:11px;
        margin-bottom:5px;
      }

      #${MODAL} .m1002-stat strong {
        display:block;
        color:#fff;
        font-size:18px;
      }

      #${MODAL} .m1002-progress {
        height:6px;
        border-radius:9px;
        background:#333;
        overflow:hidden;
        margin:12px 0;
      }

      #${MODAL} .m1002-progress > div {
        background:#ff8126;
        width:0;
        height:100%;
        transition:width .2s;
      }

      /*
       Match existing Mana Strength
       workout exercise cards and set rows.
      */

      #${MODAL} .mana-v64-card {
        padding:16px;
        margin:12px 0;
        border:1px solid #34383e!important;
        border-radius:16px;
        background:#121314!important;
        box-shadow:none;
        color:#fff;
      }

      #${MODAL} .mana-v64-name {
        font-size:17px;
        font-weight:900;
        color:#fff!important;
        margin-bottom:4px;
      }

      #${MODAL} .mana-v64-target {
        font-size:12px;
        color:#ff8126!important;
        margin-bottom:8px;
      }

      #${MODAL} .m1002-note {
        font-size:12px;
        color:#b4bbc4;
        line-height:1.6;
        margin:8px 0;
      }

      #${MODAL} .m1002-visual {
        display:flex;
        gap:10px;
        align-items:center;
        margin:8px 0 12px;
      }

      #${MODAL} .m1002-thumb {
        width:90px;
        height:76px;
        object-fit:contain;
        border:1px solid #36393e;
        background:#0b0c0d;
        border-radius:12px;
      }

      #${MODAL} .m1002-demo {
        background:#191b1e;
        color:#ff8126;
        border:1px solid #5b3b26;
        border-radius:10px;
        padding:10px 12px;
        font-size:12px;
        font-weight:900;
      }

      #${MODAL} .mana-v64-table-head,
      #${MODAL} .mana-v64-set {
        display:grid;
        grid-template-columns:
          34px minmax(0,1fr)
          minmax(0,1fr) 46px;
        gap:7px;
        align-items:center;
        margin:7px 0;
      }

      #${MODAL} .mana-v64-table-head {
        color:#aaa;
        font-size:11px;
        font-weight:800;
        text-align:center;
      }

      #${MODAL} .mana-v64-set-number {
        text-align:center;
        color:#fff;
        font-size:12px;
      }

      #${MODAL} .mana-v64-set input {
        width:100%;
        min-width:0;
        min-height:40px;
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
        height:40px;
        border:1px solid #545960;
        border-radius:9px;
        color:#aaa;
        background:#23252a;
        font-weight:900;
      }

      #${MODAL} .mana-v64-check.done {
        border-color:#ff8126;
        background:#ff8126;
        color:#111;
      }

      #${MODAL} .m1002-caption {
        color:#aeb5be;
        font-size:11px;
        line-height:1.5;
        margin-top:9px;
      }

      #${MODAL} .m1002-status {
        color:#b7bec7;
        font-size:12px;
        margin-top:12px;
        line-height:1.5;
      }

      #${MODAL} .m1002-error {
        color:#ff9d77;
      }

      @media(max-width:390px) {
        #${PANEL} .m1002-header {
          padding:15px;
        }

        #${PANEL} .m1002-body {
          padding:11px;
        }

        #${MODAL} .mana-v64-card {
          padding:12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function dumbbell() {
    return `
      <svg width="26" height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff8126"
        stroke-width="2"
        stroke-linecap="round">
        <path d="M3 9v6M6 6v12M9 10v4M15 10v4M18 6v12M21 9v6M9 12h6"/>
      </svg>
    `;
  }

  function ensureModal() {
    let modal = $(MODAL);
    if (modal) return modal;

    modal = document.createElement("div");
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
    return modal;
  }

  function ensureRoots() {
    if (!isStrengthWorkouts()) return null;

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
      selector.insertAdjacentElement(
        "afterend",
        panel
      );
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

  function changeMode(next) {
    if (
      next !== "coach" &&
      next !== "generated"
    ) return;

    mode = next;
    rememberMode();
    applyMode();

    if (next === "coach") {
      void loadAssignments(true);
    }
  }

  function card(assignment) {
    const program = assignment.custom_programs;

    return `
      <button type="button"
        class="m1002-program"
        data-m1002-program="${esc(program.id)}">
        <span>
          <strong>
            ${esc(program.name || "Coach Program")}
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
          ${
            assignment.is_primary
              ? "PRIMARY"
              : esc(
                  String(
                    assignment.status
                  ).toUpperCase()
                )
          }
        </span>
      </button>
    `;
  }

  function renderPanel() {
    const panel = $(PANEL);
    if (!panel) return;

    const rows = assignments
      .filter(a =>
        a.custom_programs &&
        ["active", "paused", "completed"].includes(
          a.status
        )
      )
      .sort((a, b) =>
        Number(!!b.is_primary) -
        Number(!!a.is_primary)
      );

    panel.innerHTML = `
      <div class="m1002-shell">
        <div class="m1002-header">
          <small>MANA STRENGTH</small>
          <h3>Coach Programs</h3>
          <p>
            Personalised training built and assigned
            by your coach.
          </p>
        </div>

        <div class="m1002-body">
          ${
            rows.length
              ? rows.map(card).join("")
              : `
                <div class="m1002-empty-card">
                  <div class="m1002-empty-icon">
                    ${dumbbell()}
                  </div>
                  <h4>No Coach Programs Yet</h4>
                  <p>
                    ${
                      loading
                        ? "Checking for your assigned programs…"
                        : "Your coach-built training programs will appear here once assigned."
                    }
                  </p>
                  <p class="m1002-foot">
                    Your regular workouts remain available
                    under My Workouts.
                  </p>
                </div>
              `
          }
        </div>
      </div>
    `;
  }

  function renderLegacy() {
    const root = ensureLegacy();
    if (!root) return;

    root.innerHTML = assignments.length
      ? `
        <h3 style="color:#fff">
          Coach Assigned
        </h3>
        ${
          assignments
            .filter(a => a.custom_programs)
            .map(card)
            .join("")
        }
      `
      : "";
  }

  async function loadAssignments() {
    if (loading) return;

    loading = true;
    renderPanel();

    const token = ++loadSerial;

    try {
      const client = await db();

      const {
        data: auth,
        error: authError
      } = await client.auth.getUser();

      if (authError) throw authError;

      const id = auth?.user?.id || "";

      if (account !== id) {
        account = id;
        assignments = [];
      }

      if (!id) return;

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
        .eq("client_id", id)
        .in("status", [
          "active",
          "paused",
          "completed"
        ])
        .order("is_primary", {
          ascending: false
        })
        .order("assigned_at", {
          ascending: false
        });

      if (error) throw error;

      const current = await client.auth.getUser();

      if (
        token !== loadSerial ||
        current.data?.user?.id !== id
      ) return;

      assignments = (data || []).filter(
        item => item.custom_programs
      );

    } catch (error) {
      console.warn(
        "[Mana Coach Programs]",
        error
      );
    } finally {
      loading = false;
      renderPanel();
      renderLegacy();
    }
  }

  function showModal(html) {
    ensureModal();
    $(MODAL).classList.add("open");
    $("m1002Content").innerHTML = html;
  }

  function closeModal() {
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

  async function openProgram(id) {
    const row = assignments.find(
      item => item.custom_programs?.id === id
    );

    if (!row) return;

    const token = ++opening;

    stopClock();
    session = null;
    selected = row;

    showModal(`
      <p class="m1002-status">
        Loading your coach program…
      </p>
    `);

    try {
      const client = await db();

      const {
        data: auth
      } = await client.auth.getUser();

      if (
        !auth?.user ||
        auth.user.id !== account
      ) {
        throw Error("Sign in to view your program");
      }

      const {
        data: link,
        error: linkError
      } = await client
        .from("client_program_assignments")
        .select("id,status")
        .eq("client_id", account)
        .eq("program_id", id)
        .in("status", [
          "active",
          "paused",
          "completed"
        ])
        .maybeSingle();

      if (linkError) throw linkError;

      if (!link) {
        throw Error(
          "This program is no longer assigned"
        );
      }

      const [
        { data: program, error: programError },
        { data: days, error: daysError }
      ] = await Promise.all([
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

      if (programError || daysError) {
        throw programError || daysError;
      }

      const ids = (days || []).map(day => day.id);

      let exercises = [];

      if (ids.length) {
        const result = await client
          .from("custom_program_exercises")
          .select("*")
          .in("program_day_id", ids)
          .order("sort_order");

        if (result.error) throw result.error;

        exercises = result.data || [];
      }

      if (
        token !== opening ||
        !$(MODAL)?.classList.contains("open")
      ) return;

      programData = {
        program,
        days: days || [],
        exercises
      };

      week = Math.min(
        ...(days || [{ week_number: 1 }])
          .map(day =>
            Number(day.week_number) || 1
          )
      );

      renderProgram();

    } catch (error) {
      if (token === opening) {
        showModal(`
          <p class="m1002-error">
            Could not load program:
            ${esc(error.message)}
          </p>
        `);
      }
    }
  }

  function programHeader() {
    const program = programData.program;

    return `
      <section class="m1002-hero">
        <div class="m1002-kicker">
          COACH-ASSIGNED PROGRAM
        </div>
        <h2>${esc(program.name)}</h2>
        <p>
          ${esc(
            program.description ||
            program.goal ||
            "Your personalised training program"
          )}
        </p>
      </section>
    `;
  }

  function renderProgram() {
    if (!programData) return;

    session = null;
    stopClock();

    const days = programData.days;

    const weeks = [
      ...new Set(
        days.map(day =>
          Number(day.week_number) || 1
        )
      )
    ].sort((a, b) => a - b);

    showModal(
      programHeader() +
      `
        <div class="m1002-weeks">
          ${
            weeks.map(number => `
              <button type="button"
                data-m1002-week="${number}"
                class="${
                  number === week ? "active" : ""
                }">
                WEEK ${number}
              </button>
            `).join("")
          }
        </div>

        <div id="m1002Days">
          ${
            days
              .filter(day =>
                Number(day.week_number) === week
              )
              .map(day => {
                const exercises =
                  programData.exercises.filter(
                    exercise =>
                      exercise.program_day_id === day.id
                  );

                return `
                  <article class="mana-v85-day">
                    <div class="m1002-day-heading">
                      WEEK ${week} • DAY ${esc(
                        day.day_number
                      )}
                    </div>

                    <h3>
                      ${esc(day.title || "Workout")}
                    </h3>

                    <p class="m1002-day-notes">
                      ${esc(
                        day.workout_type || "Strength"
                      )}

                      ${
                        day.estimated_minutes
                          ? " • " +
                            esc(day.estimated_minutes) +
                            " min"
                          : ""
                      }

                      ${
                        exercises.length
                          ? " • " +
                            exercises.length +
                            " exercises"
                          : ""
                      }
                    </p>

                    ${
                      day.notes
                        ? `
                          <p class="m1002-day-notes">
                            ${esc(day.notes)}
                          </p>
                        `
                        : ""
                    }

                    <button
                      class="m1002-primary"
                      type="button"
                      data-m1002-start="${esc(day.id)}">
                      START WORKOUT
                    </button>
                  </article>
                `;
              })
              .join("") ||
            `
              <p class="m1002-status">
                No workouts in this week yet.
              </p>
            `
          }
        </div>
      `
    );
  }

  function defaultReps(value) {
    const match = String(value || "")
      .match(/\d+/);

    return match
      ? Math.max(
          1,
          Math.min(100, Number(match[0]))
        )
      : 10;
  }

  function demoInfo(name) {
    try {
      return window.MANA_EXERCISE_VISUALS
        ?.resolve?.(name) || null;
    } catch (_) {
      return null;
    }
  }

  function setHTML(number, set) {
    return `
      <div class="mana-v64-set"
        data-m1002-set>
        <span class="mana-v64-set-number">
          ${number}
        </span>

        <input type="number"
          min="0"
          max="1000"
          step="0.5"
          inputmode="decimal"
          placeholder="kg"
          aria-label="Set ${number} weight"
          data-m1002-weight
          value="${
            set.weight == null
              ? ""
              : esc(set.weight)
          }">

        <input type="number"
          min="0"
          max="500"
          step="1"
          inputmode="numeric"
          aria-label="Set ${number} repetitions"
          data-m1002-reps
          value="${
            set.reps == null
              ? ""
              : esc(set.reps)
          }">

        <button
          type="button"
          class="mana-v64-check${
            set.done ? " done" : ""
          }"
          aria-pressed="${
            set.done ? "true" : "false"
          }"
          data-m1002-tick>
          ✓
        </button>
      </div>
    `;
  }

  function exerciseHTML(exercise, index, prior) {
    const count = Math.max(
      1,
      Math.min(
        20,
        Number(exercise.sets) || 3
      )
    );

    const previous = prior?.find(
      item =>
        item.id === exercise.id ||
        item.name === exercise.exercise_name
    );

    const visual = demoInfo(
      exercise.exercise_name
    );

    const reps = defaultReps(exercise.reps);

    const sets = Array.from(
      { length: count },
      (_, i) =>
        previous?.sets?.[i] || {
          weight: "",
          reps,
          done: false
        }
    );

    return `
      <section class="mana-v64-card"
        data-m1002-ex="${esc(exercise.id)}">

        <div class="mana-v64-name">
          ${esc(
            exercise.exercise_name || "Exercise"
          )}
        </div>

        <div class="mana-v64-target">
          ${esc(count)} sets
          • ${esc(exercise.reps || "8–12")} reps

          ${
            exercise.rest_seconds != null
              ? " • " +
                esc(exercise.rest_seconds) +
                "s rest"
              : ""
          }
        </div>

        ${
          exercise.rpe_target
            ? `
              <p class="m1002-note">
                Target RPE:
                ${esc(exercise.rpe_target)}
              </p>
            `
            : ""
        }

        ${
          exercise.notes
            ? `
              <p class="m1002-note">
                Coach: ${esc(exercise.notes)}
              </p>
            `
            : ""
        }

        <div class="m1002-visual">
          ${
            visual?.demo
              ? `
                <img class="m1002-thumb"
                  alt="${esc(
                    exercise.exercise_name
                  )} demonstration"
                  src="${esc(visual.demo)}"
                  loading="lazy">
              `
              : ""
          }

          <button type="button"
            class="m1002-demo"
            data-m1002-demo="${esc(
              exercise.exercise_name
            )}">
            ▶ VISUAL DEMO / HOW TO PERFORM
          </button>
        </div>

        <div class="mana-v64-table-head">
          <span>Set</span>
          <span>Weight</span>
          <span>Reps</span>
          <span>Done</span>
        </div>

        <div data-m1002-sets>
          ${
            sets.map(
              (set, i) => setHTML(i + 1, set)
            ).join("")
          }
        </div>

        <p class="m1002-caption">
          Enter your actual weight and reps,
          then tick each completed set.
        </p>
      </section>
    `;
  }

  function readSets() {
    if (!session) return [];

    const holder = $("m1002WorkoutBody");

    return [
      ...(holder?.querySelectorAll(
        "[data-m1002-ex]"
      ) || [])
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
      ].map((row, i) => ({
        set: i + 1,

        weight: row.querySelector(
          "[data-m1002-weight]"
        )?.value || "",

        reps: Number(
          row.querySelector(
            "[data-m1002-reps]"
          )?.value || 0
        ),

        done:
          row.querySelector(
            "[data-m1002-tick]"
          )?.classList.contains("done") ||
          false
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
        ? Math.round(100 * done / all)
        : 0
    };
  }

  function updateStats() {
    const result = totals();

    if ($("m1002Sets")) {
      $("m1002Sets").textContent =
        `${result.done} / ${result.all}`;
    }

    if ($("m1002Volume")) {
      $("m1002Volume").textContent =
        result.volume + " kg";
    }

    if ($("m1002Percent")) {
      $("m1002Percent").textContent =
        result.percent + "%";
    }

    if ($("m1002Progress")) {
      $("m1002Progress").style.width =
        result.percent + "%";
    }

    tickClock();
  }

  async function openDay(dayId) {
    const day = programData?.days.find(
      item => item.id === dayId
    );

    if (!day || !account || !selected) {
      return;
    }

    const serial = ++opening;

    stopClock();

    const exercises = programData.exercises
      .filter(exercise =>
        exercise.program_day_id === dayId
      );

    session = {
      day,
      exercises,
      programId: programData.program.id,
      logId: null
    };

    elapsedBase = 0;
    startedAt = Date.now();

    showModal(
      programHeader() +
      `
        <section class="m1002-hero">
          <div class="m1002-kicker">
            WEEK ${esc(day.week_number)}
            • DAY ${esc(day.day_number)}
          </div>
          <h2>${esc(day.title || "Workout")}</h2>
          <p>
            ${esc(
              day.notes ||
              day.workout_type ||
              "Strength"
            )}
          </p>
        </section>

        <div class="m1002-stats">
          <div class="m1002-stat">
            <small>Workout time</small>
            <strong id="m1002Time">00:00</strong>
          </div>
          <div class="m1002-stat">
            <small>Sets complete</small>
            <strong id="m1002Sets">0 / 0</strong>
          </div>
          <div class="m1002-stat">
            <small>Total volume</small>
            <strong id="m1002Volume">0 kg</strong>
          </div>
          <div class="m1002-stat">
            <small>Workout complete</small>
            <strong id="m1002Percent">0%</strong>
          </div>
        </div>

        <div class="m1002-progress">
          <div id="m1002Progress"></div>
        </div>

        <div id="m1002WorkoutBody">
          <p class="m1002-status">
            Loading your previous sets…
          </p>
        </div>

        <div class="m1002-actions">
          <button class="m1002-secondary"
            type="button"
            data-m1002-save>
            SAVE PROGRESS
          </button>

          <button class="m1002-secondary"
            type="button"
            data-m1002-program-back>
            BACK TO PROGRAM
          </button>
        </div>

        <button type="button"
          class="m1002-primary"
          data-m1002-complete>
          COMPLETE WORKOUT
        </button>

        <div class="m1002-status"
          id="m1002SaveStatus"></div>
      `
    );

    try {
      const client = await db();

      const { data, error } = await client
        .from("coach_workout_logs")
        .select("*")
        .eq("user_id", account)
        .eq("program_id", programData.program.id)
        .eq("program_day_id", dayId)
        .order("updated_at", {
          ascending: false
        })
        .limit(12);

      if (error) throw error;

      const old = (data || []).find(
        item => item.status === "in_progress"
      ) || null;

      const latest = (data || []).find(
        item => item.status === "completed"
      ) || null;

      const local = readBackup();

      if (
        serial !== opening ||
        !session ||
        session.day.id !== dayId
      ) return;

      if (old) {
        session.logId = old.id;

        elapsedBase =
          Number(old.duration_seconds) || 0;

        startedAt = Date.now();
      }

      const cloud =
        old?.exercises ||
        latest?.exercises ||
        [];

      const useLocal =
        local?.exercises &&
        (
          !old ||
          Number(local.updatedAt) >
          Date.parse(old.updated_at)
        );

      const prior = useLocal
        ? local.exercises
        : cloud;

      if (useLocal) {
        elapsedBase =
          Number(local.elapsedBase) || 0;

        startedAt = Date.now();
      }

      $("m1002WorkoutBody").innerHTML =
        exercises.map(
          (exercise, i) =>
            exerciseHTML(exercise, i, prior)
        ).join("") ||
        `
          <p class="m1002-status">
            No exercises assigned.
          </p>
        `;

      $("m1002WorkoutBody")
        .querySelectorAll("img.m1002-thumb")
        .forEach(img =>
          img.addEventListener(
            "error",
            () => img.remove(),
            { once: true }
          )
        );

      updateStats();
      startClock();

    } catch (error) {
      if (serial !== opening) return;

      $("m1002WorkoutBody").innerHTML =
        exercises.map(
          (item, i) =>
            exerciseHTML(item, i, [])
        ).join("");

      $("m1002SaveStatus").textContent =
        "Cloud restore unavailable: " +
        (error.message || error) +
        ". Local saving remains enabled.";

      updateStats();
      startClock();
    }
  }

  function localEdit() {
    if (!session) return;

    updateStats();
    backup();
    scheduleSave();
  }

  function scheduleSave() {
    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      saveTimer = null;
      queueSave();
    }, 1000);
  }

  function queueSave(completed = false) {
    if (!session) return saveChain;

    const exercises = readSets();
    const results = totals(exercises);

    const snapshot = {
      user_id: account,
      program_id: session.programId,
      program_day_id: session.day.id,

      week_number: Number(
        session.day.week_number
      ),

      day_number: Number(
        session.day.day_number
      ),

      session_name:
        session.day.title || "Workout",

      status: completed
        ? "completed"
        : "in_progress",

      started_at: new Date(
        Date.now() - elapsed() * 1000
      ).toISOString(),

      completed_at: completed
        ? new Date().toISOString()
        : null,

      duration_seconds: elapsed(),

      exercises,
      completed_sets: results.done,
      total_sets: results.all,
      total_volume: results.volume,
      updated_at: new Date().toISOString()
    };

    let id = session.logId;

    if (!id) {
      id =
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(16).slice(2)}`;

      session.logId = id;
    }

    snapshot.id = id;

    const status = $("m1002SaveStatus");

    if (status) {
      status.textContent = completed
        ? "Saving completed workout…"
        : "Saving…";
    }

    saveChain = saveChain
      .catch(() => {})
      .then(async () => {
        const client = await db();

        const { error } = await client
          .from("coach_workout_logs")
          .upsert(snapshot, {
            onConflict: "id"
          });

        if (error) throw error;
      })
      .then(() => {
        if (completed) clearBackup();

        if ($("m1002SaveStatus")) {
          $("m1002SaveStatus").textContent =
            completed
              ? "Workout saved to Mana cloud ✓"
              : "Saved ✓";
        }

        return true;
      })
      .catch(error => {
        if ($("m1002SaveStatus")) {
          $("m1002SaveStatus").textContent =
            "Cloud save failed — local backup retained. " +
            (error.message || error);
        }

        return false;
      });

    return saveChain;
  }

  async function completeWorkout() {
    if (!session) return;

    const data = readSets();
    const result = totals(data);

    if (!result.done) {
      $("m1002SaveStatus").textContent =
        "Complete at least one set first.";
      return;
    }

    clearTimeout(saveTimer);
    backup();

    const button = document.querySelector(
      "[data-m1002-complete]"
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
      <div class="m1002-hero">
        <div class="m1002-kicker">
          WORKOUT COMPLETE
        </div>

        <h2>Awesome work ✓</h2>

        <p>
          ${result.done} of ${result.all} sets
          • ${result.volume} kg total volume
        </p>
      </div>

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
            programId:
              programData.program.id
          }
        }
      )
    );
  }

  function backToProgram() {
    stopClock();

    if (session) {
      backup();
      queueSave();
    }

    session = null;
    renderProgram();
  }

  function handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const choice = target.closest(
      "[data-m1002-mode]"
    );

    if (choice) {
      event.preventDefault();

      changeMode(
        choice.dataset.m1002Mode
      );

      return;
    }

    if (
      target.closest("[data-m1002-back]")
    ) {
      event.preventDefault();

      if (session) {
        backToProgram();
      } else {
        closeModal();
      }

      return;
    }

    if (
      target.closest(
        "[data-m1002-program-back]"
      )
    ) {
      event.preventDefault();
      backToProgram();
      return;
    }

    const program = target.closest(
      "[data-m1002-program]"
    );

    if (program) {
      event.preventDefault();

      void openProgram(
        program.dataset.m1002Program
      );

      return;
    }

    const weekButton = target.closest(
      "[data-m1002-week]"
    );

    if (weekButton) {
      week = Number(
        weekButton.dataset.m1002Week
      );

      renderProgram();
      return;
    }

    const dayButton = target.closest(
      "[data-m1002-start]"
    );

    if (dayButton) {
      void openDay(
        dayButton.dataset.m1002Start
      );
      return;
    }

    const demo = target.closest(
      "[data-m1002-demo]"
    );

    if (demo) {
      const fn = window
        .MANA_EXERCISE_VISUALS
        ?.openDemo;

      if (typeof fn === "function") {
        void fn(
          demo.dataset.m1002Demo
        );
      } else {
        window.open(
          "https://www.youtube.com/results?search_query=" +
          encodeURIComponent(
            demo.dataset.m1002Demo +
            " technique"
          ),
          "_blank",
          "noopener,noreferrer"
        );
      }

      return;
    }

    const tick = target.closest(
      "[data-m1002-tick]"
    );

    if (tick) {
      tick.classList.toggle("done");

      tick.setAttribute(
        "aria-pressed",
        String(
          tick.classList.contains("done")
        )
      );

      localEdit();
      return;
    }

    if (
      target.closest("[data-m1002-save]")
    ) {
      backup();
      queueSave();
      return;
    }

    if (
      target.closest(
        "[data-m1002-complete]"
      )
    ) {
      void completeWorkout();
    }
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
      if (isStrengthWorkouts()) {
        applyMode();

        if (mode === "coach") {
          void loadAssignments();
        }
      } else if (legacyVisible()) {
        renderLegacy();
        void loadAssignments();
      }
    }, 160);
  }

  function observe() {
    const holder = $("manaV83Content");
    if (!holder) return;

    contentObserver = new MutationObserver(() => {
      if (
        isStrengthWorkouts() &&
        (!$(SWITCH) || !$(PANEL))
      ) {
        applyMode();
      }
    });

    contentObserver.observe(holder, {
      childList: true
    });
  }

  function init() {
    mode = rememberedMode();

    css();
    ensureModal();
    ensureLegacy();
    observe();

    document.addEventListener(
      "click",
      handleClick
    );

    document.addEventListener(
      "input",
      event => {
        if (
          event.target?.matches?.(
            `#${MODAL} [data-m1002-weight],` +
            `#${MODAL} [data-m1002-reps]`
          )
        ) {
          localEdit();
        }
      }
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
        loadSerial++;
        account = "";
        assignments = [];

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
