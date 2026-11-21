
/*
 MANA MOVEMENT — CLIENT WORKOUT SELECTOR
 BUILD 100203

 COMPLETE FILE REPLACEMENT:
 v10_02_client_custom_programs_100200.js

 FIX:
 Coach Programs hides the original generated
 workout content correctly.

 PRESERVES:
 - My Workouts
 - Coach Programs
 - Generated workout cards and history
 - Coach-assigned cloud programs
 - Weeks, exercises and coach notes
 - Existing five bottom navigation tabs
*/

(() => {
  "use strict";

  const BUILD = "100203";

  const STYLE_ID =
    "mana-v1002-client-custom-style";

  const SELECTOR_ID =
    "manaV1002WorkoutSwitch";

  const PANEL_ID =
    "manaV1002CoachPanel";

  const LEGACY_ID =
    "manaV1002AssignedPrograms";

  const MODAL_ID =
    "manaV1002CustomProgramModal";

  const STORAGE_KEY =
    "mana-strength-workout-view-100202";

  const $ = id => document.getElementById(id);

  let mode = "generated";
  let assignments = [];
  let userId = "";
  let loading = false;
  let loadedAt = 0;
  let requestId = 0;
  let navigationTimer = null;
  let contentObserver = null;
  let modalOpen = false;
  let currentProgramId = "";

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  async function db() {
    if (
      typeof window.supabaseClient !==
      "function"
    ) {
      throw new Error(
        "Mana cloud connection unavailable."
      );
    }

    return await window.supabaseClient();
  }

  function strengthWorkoutsOpen() {
    const shell = $("manaV83ProgramShell");

    if (!shell?.classList.contains("open")) {
      return false;
    }

    const title = $("manaV83Title")
      ?.textContent?.trim()?.toUpperCase();

    const tab = document.querySelector(
      '#manaV83Tabs [data-v83-tab].active'
    )?.dataset.v83Tab;

    return (
      title === "MANA STRENGTH" &&
      tab === "program"
    );
  }

  function legacyProgramsOpen() {
    const view = $("clientProgramsView");

    return !!(
      view &&
      !view.classList.contains("hide")
    );
  }

  function getPrimary() {
    return assignments.find(
      a => a.is_primary &&
      a.status === "active" &&
      a.custom_programs
    ) || assignments.find(
      a => a.status === "active" &&
      a.custom_programs
    ) || null;
  }

  function readMode() {
    try {
      return sessionStorage.getItem(
        STORAGE_KEY
      ) === "coach" ? "coach" : "generated";
    } catch (_) {
      return "generated";
    }
  }

  function saveMode() {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        mode
      );
    } catch (_) {}
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${SELECTOR_ID} {
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:7px;
        padding:5px;
        margin:0 0 15px;
        background:#141414;
        border:1px solid #333;
        border-radius:15px;
      }

      #${SELECTOR_ID} button {
        width:100%;
        min-width:0;
        min-height:46px;
        padding:9px 5px;
        border:1px solid transparent;
        border-radius:11px;
        background:transparent;
        color:#aaa;
        font:800 12px inherit;
        cursor:pointer;
      }

      #${SELECTOR_ID} button.active {
        color:#ff8a29;
        background:#23201d;
        border:1px solid #ff8a29;
      }

      /*
       CRITICAL FIX 100203

       Both :not() checks apply to the
       SAME direct child element.

       Build 100202 had a space between
       the checks, incorrectly targeting
       descendants instead.

       This hides original workout content
       without removing it from the DOM.
      */

      #manaV83Content.m1002-coach-mode
      > :not(#${SELECTOR_ID}):not(#${PANEL_ID}) {
        display:none !important;
      }

      /*
       Coach panel is visible only in
       Coach Programs mode.
      */

      #${PANEL_ID} {
        display:none;
        margin-bottom:18px;
      }

      #manaV83Content.m1002-coach-mode
      > #${PANEL_ID} {
        display:block !important;
      }

      /*
       Keep both selector buttons visible
       regardless of the selected mode.
      */

      #manaV83Content.m1002-coach-mode
      > #${SELECTOR_ID} {
        display:grid !important;
      }

      #${LEGACY_ID} {
        margin:12px 0;
      }

      .m1002-heading {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        margin:6px 0 12px;
      }

      .m1002-heading h3 {
        margin:0;
        color:#fff;
        font-size:18px;
      }

      .m1002-kicker {
        color:#ff8a29;
        font-size:10px;
        font-weight:900;
        letter-spacing:.08em;
      }

      .m1002-program {
        width:100%;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        padding:16px;
        margin-bottom:10px;
        border:1px solid #914e20;
        border-radius:16px;
        background:#151515;
        color:#fff;
        text-align:left;
        font-family:inherit;
        cursor:pointer;
      }

      .m1002-program strong {
        display:block;
        font-size:15px;
      }

      .m1002-program small {
        display:block;
        margin-top:5px;
        color:#aaa;
        font-size:12px;
        line-height:1.45;
      }

      .m1002-pill {
        flex:0 0 auto;
        padding:5px 8px;
        border:1px solid #914e20;
        border-radius:20px;
        color:#ff8a29;
        font-size:10px;
        font-weight:900;
      }

      .m1002-empty {
        padding:18px 12px;
        border:1px solid #333;
        border-radius:14px;
        background:#141414;
        color:#aaa;
        font-size:13px;
        line-height:1.6;
      }

      #${MODAL_ID} {
        position:fixed;
        inset:0;
        z-index:61000;
        display:none;
        overflow:auto;
        overscroll-behavior:contain;
        background:#070707;
        color:#fff;
        padding:
          calc(16px + env(safe-area-inset-top))
          14px
          calc(36px + env(safe-area-inset-bottom));
      }

      #${MODAL_ID}.open {
        display:block;
      }

      .m1002-modal-inner {
        width:min(720px,100%);
        margin:auto;
      }

      .m1002-modal-header {
        position:sticky;
        top:0;
        z-index:2;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        padding:10px 0 16px;
        background:#070707;
      }

      .m1002-back {
        min-height:43px;
        padding:0 15px;
        border:1px solid #444;
        border-radius:12px;
        background:#181818;
        color:#fff;
        font-weight:800;
      }

      .m1002-hero {
        padding:20px;
        margin-bottom:14px;
        border:1px solid #914e20;
        border-radius:18px;
        background:#151515;
      }

      .m1002-hero h2 {
        margin:7px 0;
        font-size:25px;
      }

      .m1002-hero p {
        margin:0;
        color:#aaa;
        font-size:13px;
        line-height:1.6;
      }

      .m1002-weeks {
        display:flex;
        gap:7px;
        padding-bottom:12px;
        overflow-x:auto;
      }

      .m1002-weeks button {
        flex:0 0 auto;
        padding:10px 13px;
        border:1px solid #444;
        border-radius:11px;
        background:#181818;
        color:#bbb;
        font-weight:800;
      }

      .m1002-weeks button.active {
        color:#ff8a29;
        border-color:#ff8a29;
      }

      .m1002-day {
        margin-bottom:10px;
        overflow:hidden;
        border:1px solid #393939;
        border-radius:14px;
        background:#131313;
      }

      .m1002-day-button {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        width:100%;
        padding:16px;
        border:0;
        background:transparent;
        color:#fff;
        text-align:left;
        font-family:inherit;
      }

      .m1002-day-button strong {
        display:block;
        font-size:14px;
      }

      .m1002-day-button small {
        display:block;
        margin-top:6px;
        color:#aaa;
        font-size:12px;
      }

      .m1002-day-arrow {
        color:#ff8a29;
        font-size:21px;
      }

      .m1002-day-body {
        display:none;
        padding:0 15px 12px;
      }

      .m1002-day.open .m1002-day-body {
        display:block;
      }

      .m1002-exercise {
        padding:12px 0;
        border-top:1px solid #333;
      }

      .m1002-exercise strong {
        display:block;
        font-size:14px;
      }

      .m1002-exercise span {
        display:block;
        margin-top:5px;
        color:#ff8a29;
        font-size:12px;
      }

      .m1002-exercise p,
      .m1002-coach-note {
        color:#aaa;
        font-size:12px;
        line-height:1.6;
      }
    `;

    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = $(MODAL_ID);
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = MODAL_ID;

    modal.setAttribute("role","dialog");
    modal.setAttribute("aria-modal","true");

    modal.innerHTML = `
      <div class="m1002-modal-inner">
        <div class="m1002-modal-header">
          <strong class="m1002-kicker">
            MANA STRENGTH • COACH PROGRAM
          </strong>
          <button
            type="button"
            class="m1002-back"
            data-m1002-close
          >
            ← BACK
          </button>
        </div>
        <div id="m1002Content"></div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function closeModal() {
    $(MODAL_ID)?.classList.remove("open");
    modalOpen = false;
    currentProgramId = "";
  }

  function ensureLegacyRoot() {
    const view = $("clientProgramsView");
    if (!view) return null;

    let root = $(LEGACY_ID);

    if (!root) {
      root = document.createElement("section");
      root.id = LEGACY_ID;
    }

    if (!view.contains(root)) {
      const first = view.querySelector(".card");

      if (first) {
        first.insertAdjacentElement(
          "beforebegin",
          root
        );
      } else {
        view.prepend(root);
      }
    }

    return root;
  }

  function ensureStrengthRoots() {
    if (!strengthWorkoutsOpen()) return null;

    const holder = $("manaV83Content");
    if (!holder) return null;

    let selector = $(SELECTOR_ID);

    if (!selector) {
      selector = document.createElement("div");
      selector.id = SELECTOR_ID;

      selector.setAttribute(
        "role",
        "group"
      );

      selector.setAttribute(
        "aria-label",
        "Choose workout type"
      );

      selector.innerHTML = `
        <button
          type="button"
          data-m1002-mode="generated"
        >
          My Workouts
        </button>
        <button
          type="button"
          data-m1002-mode="coach"
        >
          Coach Programs
        </button>
      `;
    }

    if (selector.parentElement !== holder) {
      holder.prepend(selector);
    }

    let panel = $(PANEL_ID);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL_ID;
    }

    if (panel.parentElement !== holder) {
      selector.insertAdjacentElement(
        "afterend",
        panel
      );
    }

    return holder;
  }

  function applyMode() {
    const holder = ensureStrengthRoots();

    if (!holder) return;

    holder.classList.toggle(
      "m1002-coach-mode",
      mode === "coach"
    );

    $(SELECTOR_ID)
      ?.querySelectorAll("[data-m1002-mode]")
      .forEach(button => {
        const active =
          button.dataset.m1002Mode === mode;

        button.classList.toggle(
          "active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          String(active)
        );
      });

    if (mode === "coach") {
      renderCoachPanel();
    }
  }

  function setMode(next) {
    if (
      next !== "generated" &&
      next !== "coach"
    ) return;

    mode = next;
    saveMode();
    applyMode();

    if (mode === "coach") {
      void loadAssignments(true);
    }
  }

  function programCard(assignment) {
    const program = assignment.custom_programs;
    if (!program) return "";

    const badge = assignment.is_primary
      ? "PRIMARY"
      : String(
          assignment.status || "ACTIVE"
        ).toUpperCase();

    return `
      <button
        type="button"
        class="m1002-program"
        data-m1002-program="${esc(program.id)}"
      >
        <div>
          <strong>
            ${esc(program.name || "Coach Program")}
          </strong>
          <small>
            ${esc(
              program.goal ||
              program.description ||
              "Personalised coach-assigned training"
            )}
          </small>
        </div>
        <span class="m1002-pill">
          ${esc(badge)}
        </span>
      </button>
    `;
  }

  function renderCoachPanel() {
    const panel = $(PANEL_ID);
    if (!panel) return;

    const available = assignments.filter(
      item =>
        item.custom_programs &&
        ["active","paused","completed"].includes(
          item.status
        )
    );

    const primary = getPrimary();

    const ordered = primary
      ? [
          primary,
          ...available.filter(
            item => item.id !== primary.id
          )
        ]
      : available;

    panel.innerHTML = `
      <div class="m1002-heading">
        <h3>Coach Programs</h3>
        <span class="m1002-kicker">
          PERSONALISED
        </span>
      </div>

      ${
        ordered.length
          ? ordered.map(programCard).join("")
          : `
            <div class="m1002-empty">
              ${
                loading
                  ? "Checking your coach programs…"
                  : "No coach-assigned programs yet. Your automatically generated workouts remain available under My Workouts."
              }
            </div>
          `
      }
    `;
  }

  function renderLegacy() {
    const root = ensureLegacyRoot();
    if (!root) return;

    const available = assignments.filter(
      item =>
        item.custom_programs &&
        ["active","paused","completed"].includes(
          item.status
        )
    );

    root.innerHTML = available.length
      ? `
        <div class="m1002-heading">
          <h3>Coach Assigned</h3>
          <span class="m1002-kicker">
            PERSONALISED
          </span>
        </div>
        ${available.map(programCard).join("")}
      `
      : "";
  }

  async function loadAssignments(force = false) {
    if (loading) return;

    if (
      !force &&
      Date.now() - loadedAt < 15000
    ) {
      renderCoachPanel();
      renderLegacy();
      return;
    }

    loading = true;
    const token = ++requestId;
    renderCoachPanel();

    try {
      const client = await db();

      const {
        data: auth,
        error: authError
      } = await client.auth.getUser();

      if (authError) throw authError;

      const account = auth?.user?.id;

      if (!account) {
        userId = "";
        assignments = [];
        loadedAt = 0;
        return;
      }

      if (userId !== account) {
        userId = account;
        assignments = [];
      }

      const {data,error} = await client
        .from("client_program_assignments")
        .select(`
          id,
          status,
          is_primary,
          assigned_at,
          start_date,
          custom_programs(
            id,
            name,
            description,
            goal,
            duration_weeks,
            status,
            source_program
          )
        `)
        .eq("client_id",account)
        .in("status",[
          "active",
          "paused",
          "completed"
        ])
        .order("is_primary",{
          ascending:false
        })
        .order("assigned_at",{
          ascending:false
        });

      if (error) throw error;

      const current =
        await client.auth.getUser();

      if (
        token !== requestId ||
        current.data?.user?.id !== account
      ) return;

      assignments = (data || []).filter(
        item => item.custom_programs
      );

      loadedAt = Date.now();

    } catch (error) {
      console.warn(
        "[Mana Coach Programs]",
        error?.message || error
      );
    } finally {
      loading = false;
      renderCoachPanel();
      renderLegacy();
    }
  }

  function showModalMessage(message) {
    ensureModal();

    modalOpen = true;
    $(MODAL_ID).classList.add("open");

    $("m1002Content").innerHTML = `
      <div class="m1002-empty">
        ${esc(message)}
      </div>
    `;
  }

  async function openProgram(programId) {
    const selected = assignments.find(
      item =>
        item.custom_programs?.id === programId
    );

    if (!selected) return;

    currentProgramId = programId;

    showModalMessage(
      "Loading your coach program…"
    );

    try {
      const client = await db();

      const {
        data: auth,
        error: authError
      } = await client.auth.getUser();

      if (authError) throw authError;

      const account = auth?.user?.id;

      if (!account || account !== userId) {
        throw new Error(
          "Please sign in again."
        );
      }

      const {
        data: assignment,
        error: assignmentError
      } = await client
        .from("client_program_assignments")
        .select("id,status")
        .eq("client_id",account)
        .eq("program_id",programId)
        .in("status",[
          "active",
          "paused",
          "completed"
        ])
        .maybeSingle();

      if (assignmentError) {
        throw assignmentError;
      }

      if (!assignment) {
        throw new Error(
          "This program is no longer assigned."
        );
      }

      const {
        data: program,
        error: programError
      } = await client
        .from("custom_programs")
        .select("*")
        .eq("id",programId)
        .single();

      if (programError) throw programError;

      const {
        data: days,
        error: daysError
      } = await client
        .from("custom_program_days")
        .select("*")
        .eq("program_id",programId)
        .order("week_number")
        .order("day_number");

      if (daysError) throw daysError;

      const dayIds = (days || []).map(
        day => day.id
      );

      let exercises = [];

      if (dayIds.length) {
        const {
          data,
          error
        } = await client
          .from("custom_program_exercises")
          .select("*")
          .in("program_day_id",dayIds)
          .order("sort_order");

        if (error) throw error;

        exercises = data || [];
      }

      if (
        !modalOpen ||
        currentProgramId !== programId
      ) return;

      renderProgram(
        program,
        days || [],
        exercises
      );

    } catch (error) {
      if (
        modalOpen &&
        currentProgramId === programId
      ) {
        showModalMessage(
          "Could not load program: " +
          (error?.message || String(error))
        );
      }
    }
  }

  function renderProgram(program,days,exercises) {
    const weeks = [
      ...new Set(
        days.map(
          day => Number(day.week_number) || 1
        )
      )
    ].sort((a,b) => a-b);

    const initialWeek = weeks[0] || 1;

    $("m1002Content").innerHTML = `
      <section class="m1002-hero">
        <div class="m1002-kicker">
          COACH-ASSIGNED MANA STRENGTH
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

      <div class="m1002-weeks">
        ${
          weeks.map(week => `
            <button
              type="button"
              data-m1002-week="${week}"
              class="${
                week === initialWeek
                  ? "active"
                  : ""
              }"
            >
              WEEK ${week}
            </button>
          `).join("")
        }
      </div>

      <div id="m1002Days"></div>
    `;

    function drawWeek(week) {
      $("m1002Content")
        .querySelectorAll("[data-m1002-week]")
        .forEach(button => {
          button.classList.toggle(
            "active",
            Number(
              button.dataset.m1002Week
            ) === week
          );
        });

      const currentDays = days.filter(
        day =>
          Number(day.week_number) === week
      );

      $("m1002Days").innerHTML =
        currentDays.length
          ? currentDays.map(day => {
              const items = exercises.filter(
                item =>
                  item.program_day_id === day.id
              );

              return `
                <section class="m1002-day">
                  <button
                    type="button"
                    class="m1002-day-button"
                    data-m1002-day
                  >
                    <div>
                      <strong>
                        DAY ${esc(day.day_number)}
                        • ${esc(day.title || "Workout")}
                      </strong>
                      <small>
                        ${esc(
                          day.workout_type ||
                          "Strength"
                        )}
                        ${
                          day.estimated_minutes
                            ? " • " +
                              esc(day.estimated_minutes) +
                              " min"
                            : ""
                        }
                      </small>
                    </div>
                    <span class="m1002-day-arrow">
                      ⌄
                    </span>
                  </button>

                  <div class="m1002-day-body">
                    ${
                      day.notes
                        ? `
                          <p class="m1002-coach-note">
                            ${esc(day.notes)}
                          </p>
                        `
                        : ""
                    }

                    ${
                      items.length
                        ? items.map(item => `
                            <div class="m1002-exercise">
                              <strong>
                                ${esc(
                                  item.exercise_name ||
                                  "Exercise"
                                )}
                              </strong>
                              <span>
                                ${
                                  item.sets != null
                                    ? esc(item.sets) +
                                      " sets"
                                    : ""
                                }
                                ${
                                  item.reps
                                    ? " × " +
                                      esc(item.reps)
                                    : ""
                                }
                                ${
                                  item.rest_seconds != null
                                    ? " • " +
                                      esc(item.rest_seconds) +
                                      "s rest"
                                    : ""
                                }
                                ${
                                  item.rpe_target
                                    ? " • RPE " +
                                      esc(item.rpe_target)
                                    : ""
                                }
                              </span>
                              ${
                                item.notes
                                  ? `
                                    <p>
                                      ${esc(item.notes)}
                                    </p>
                                  `
                                  : ""
                              }
                            </div>
                          `).join("")
                        : `
                          <div class="m1002-empty">
                            No exercises assigned.
                          </div>
                        `
                    }
                  </div>
                </section>
              `;
            }).join("")
          : `
            <div class="m1002-empty">
              No workouts in this week.
            </div>
          `;

      $("m1002Days")
        ?.querySelector(".m1002-day")
        ?.classList.add("open");
    }

    drawWeek(initialWeek);

    $("m1002Content").onclick = event => {
      const week = event.target.closest(
        "[data-m1002-week]"
      );

      if (week) {
        drawWeek(
          Number(week.dataset.m1002Week)
        );
        return;
      }

      const day = event.target.closest(
        "[data-m1002-day]"
      );

      if (day) {
        day.closest(".m1002-day")
          ?.classList.toggle("open");
      }
    };
  }

  function refreshVisibleContent(force = false) {
    if (strengthWorkoutsOpen()) {
      applyMode();

      if (mode === "coach") {
        void loadAssignments(force);
      }
    }

    if (legacyProgramsOpen()) {
      renderLegacy();
      void loadAssignments(force);
    }
  }

  function scheduleRefresh(force = false) {
    if (navigationTimer !== null) {
      clearTimeout(navigationTimer);
    }

    navigationTimer = setTimeout(() => {
      navigationTimer = null;
      refreshVisibleContent(force);
    },120);
  }

  function observeWorkoutContent() {
    const holder = $("manaV83Content");
    if (!holder) return;

    if (contentObserver) {
      contentObserver.disconnect();
    }

    contentObserver = new MutationObserver(() => {
      if (!strengthWorkoutsOpen()) return;

      if (
        !$(SELECTOR_ID) ||
        !$(PANEL_ID)
      ) {
        applyMode();
      }
    });

    contentObserver.observe(holder,{
      childList:true
    });
  }

  function handleDocumentClick(event) {
    const element = event.target;
    if (!(element instanceof Element)) return;

    const choice = element.closest(
      "[data-m1002-mode]"
    );

    if (choice) {
      event.preventDefault();
      setMode(choice.dataset.m1002Mode);
      return;
    }

    const close = element.closest(
      "[data-m1002-close]"
    );

    if (close) {
      event.preventDefault();
      closeModal();
      return;
    }

    const program = element.closest(
      "[data-m1002-program]"
    );

    if (program) {
      event.preventDefault();

      void openProgram(
        program.dataset.m1002Program
      );
    }
  }

  function init() {
    mode = readMode();

    installStyles();
    ensureModal();
    ensureLegacyRoot();
    observeWorkoutContent();

    document.addEventListener(
      "click",
      handleDocumentClick
    );

    window.addEventListener(
      "mana:program-tab-change",
      () => scheduleRefresh(true)
    );

    document.querySelector(
      '#bottomNav [data-page="programs"]'
    )?.addEventListener(
      "click",
      () => scheduleRefresh(true)
    );

    window.addEventListener(
      "pageshow",
      () => scheduleRefresh(true)
    );

    window.addEventListener(
      "mana:profile-synced",
      () => scheduleRefresh(true)
    );

    window.addEventListener(
      "mana:logout",
      () => {
        requestId++;
        userId = "";
        assignments = [];
        loadedAt = 0;
        closeModal();
        renderCoachPanel();
        renderLegacy();
      }
    );

    window.refreshManaAssignedPrograms =
      () => loadAssignments(true);

    window.MANA_CLIENT_CUSTOM_PROGRAM_BUILD =
      BUILD;

    scheduleRefresh(true);

    console.log(
      "[Mana Movement] Workout selector " +
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
