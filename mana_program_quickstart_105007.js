
/* ============================================================
   MANA MOVEMENT TRAINING
   QUICK START PROGRAM BUILDER
   BUILD 105008

   COMPLETE REPLACEMENT FOR:
   mana_program_quickstart_105007.js

   TARGETS THE ACTUAL V10.08 PROGRAM BUILDER

   FEATURES
   - Simple premium one-column desktop layout
   - Quick Start presets at the top
   - Three-day training split
   - Chest, Back, Arms and Legs workouts
   - Four-week program creation
   - Exercise Library hidden until requested
   - Program Map hidden until requested
   - Orange / black / white / silver styling
   - Existing Save and Save + Assign retained
   - Existing exercise editing retained

   NO DATABASE CHANGES
   NO CLIENT DATA CHANGES
   NO REPLACEMENT SAVE LOGIC
   ============================================================ */

(() => {
  "use strict";

  const FLAG = "MANA_QUICKSTART_105008";
  const BUILD = "105008";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const MODAL = "manaV1008ProgramBuilder";
  const CONTENT = "m104Content";
  const PANEL = "manaQuickStart105008";
  const STYLE = "manaQuickStartStyle105008";

  const $ = id => document.getElementById(id);

  let busy = false;
  let opened = false;
  let presetLoaded = false;
  let frameQueued = false;
  let contentObserver = null;

  /* =====================================================
     PRESET WORKOUTS

     Exercise names match the existing
     Mana Movement Supabase library.
     ===================================================== */

  const WORKOUTS = {
    chestTris: {
      title: "Chest & Triceps",
      exercises: [
        ["Bench Press", 4, "6-10", 120],
        ["Incline Dumbbell Press", 3, "8-12", 90],
        ["Machine Chest Press", 3, "10-12", 75],
        ["Push Up", 3, "10-15", 60],
        ["Cable Triceps Pressdown", 3, "10-15", 60],
        ["Overhead Triceps Extension", 3, "10-15", 60]
      ]
    },

    backBis: {
      title: "Back & Biceps",
      exercises: [
        ["Lat Pulldown", 4, "8-12", 90],
        ["Seated Cable Row", 4, "8-12", 90],
        ["Chest Supported Row", 3, "8-12", 75],
        ["Face Pull", 3, "12-15", 60],
        ["Barbell Curl", 3, "8-12", 60],
        ["Hammer Curl", 3, "10-15", 60]
      ]
    },

    legsShoulders: {
      title: "Legs & Shoulders",
      exercises: [
        ["Leg Press", 4, "8-12", 120],
        ["Romanian Deadlift", 3, "8-12", 120],
        ["Bulgarian Split Squat", 3, "8-12 each", 90],
        ["Lying Hamstring Curl", 3, "10-15", 60],
        ["Dumbbell Shoulder Press", 3, "8-12", 90],
        ["Lateral Raise", 3, "12-20", 60]
      ]
    },

    chest: {
      title: "Chest Day",
      exercises: [
        ["Bench Press", 4, "6-10", 120],
        ["Incline Dumbbell Press", 4, "8-12", 90],
        ["Machine Chest Press", 3, "10-12", 75],
        ["Dumbbell Bench Press", 3, "10-12", 75],
        ["Push Up", 3, "10-20", 60]
      ]
    },

    back: {
      title: "Back Day",
      exercises: [
        ["Lat Pulldown", 4, "8-12", 90],
        ["Barbell Row", 4, "6-10", 120],
        ["Seated Cable Row", 3, "10-12", 75],
        ["One Arm Dumbbell Row", 3, "10 each", 75],
        ["Face Pull", 3, "12-15", 60]
      ]
    },

    arms: {
      title: "Arms Day",
      exercises: [
        ["Barbell Curl", 3, "8-12", 60],
        ["Cable Triceps Pressdown", 3, "10-12", 60],
        ["Dumbbell Curl", 3, "10-12", 60],
        ["Overhead Triceps Extension", 3, "10-15", 60],
        ["Hammer Curl", 3, "10-12", 60],
        ["Bench Dip", 3, "10-15", 60]
      ]
    },

    legs: {
      title: "Leg Day",
      exercises: [
        ["Back Squat", 4, "6-10", 120],
        ["Leg Press", 3, "10-12", 90],
        ["Romanian Deadlift", 3, "8-12", 120],
        ["Bulgarian Split Squat", 3, "10 each", 90],
        ["Seated Hamstring Curl", 3, "10-15", 60],
        ["Seated Calf Raise", 3, "12-20", 60]
      ]
    }
  };

  const PRESETS = [
    {
      id: "three",
      title: "3-Day Training Split",
      description:
        "Chest & Triceps / Back & Biceps / Legs & Shoulders",
      goal: "Strength and muscle development",
      workouts: [
        WORKOUTS.chestTris,
        WORKOUTS.backBis,
        WORKOUTS.legsShoulders
      ]
    },
    {
      id: "chest",
      title: "Chest Day",
      description: "Chest-focused workout",
      goal: "Chest muscle development",
      workouts: [WORKOUTS.chest]
    },
    {
      id: "back",
      title: "Back Day",
      description: "Rows and pulldowns",
      goal: "Back muscle development",
      workouts: [WORKOUTS.back]
    },
    {
      id: "arms",
      title: "Arms Day",
      description: "Biceps and triceps",
      goal: "Arm muscle development",
      workouts: [WORKOUTS.arms]
    },
    {
      id: "legs",
      title: "Leg Day",
      description: "Lower-body workout",
      goal: "Lower-body strength",
      workouts: [WORKOUTS.legs]
    }
  ];

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `

      /* =====================================
         MAIN BUILDER WIDTH
         ===================================== */

      #${MODAL} .m104-shell {
        width: 100% !important;
        max-width: 1000px !important;
        margin: 0 auto !important;
      }

      #${MODAL} .m104-grid {
        display: grid !important;
        grid-template-columns: minmax(0,1fr) !important;
        gap: 15px !important;
        width: 100% !important;
        padding-top: 10px !important;
      }

      #${MODAL} .m105-builder-grid {
        display: grid !important;
        grid-template-columns: minmax(0,1fr) !important;
        gap: 14px !important;
      }

      #${MODAL} #m105WorkoutPanel {
        display: block !important;
        width: 100% !important;
        min-width: 0 !important;
      }

      /* =====================================
         COLLAPSED OPTIONAL PANELS
         ===================================== */

      #${MODAL} #m105LibraryPanel {
        display: none !important;
      }

      #${MODAL}.mqs-library-open
      #m105LibraryPanel {
        display: block !important;
      }

      #${MODAL} #m105ProgramMap {
        display: none !important;
      }

      #${MODAL}.mqs-map-open
      #m105ProgramMap {
        display: block !important;
        position: static !important;
        max-height: 520px !important;
        overflow: auto !important;
      }

      #${MODAL} #m105ProgramPanel {
        display: none !important;
      }

      #${MODAL} #m105MobileTabs {
        display: none !important;
      }

      /* =====================================
         MANA ORANGE COLOUR SYSTEM
         ===================================== */

      #${MODAL} .m104-brand,
      #${MODAL} .m108-client-kicker,
      #${MODAL} .m106-section-kicker,
      #${MODAL} .m104-section-title,
      #${MODAL} .m105-map-week-label {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${MODAL} .m104-sub,
      #${MODAL} .m108-client-status,
      #${MODAL} .m104-label,
      #${MODAL} .m104-count {
        color: #B7C0CB !important;
        -webkit-text-fill-color: #B7C0CB !important;
      }

      #${MODAL} .m104-card,
      #${MODAL} .m106-editor-block {
        background: #15171B !important;
        background-image: none !important;
        border-color: #454D57 !important;
        box-shadow: none !important;
      }

      #${MODAL} .m108-client-context {
        background: #15171B !important;
        background-image: none !important;
        border-color: #454D57 !important;
      }

      #${MODAL} .m104-input,
      #${MODAL} .m104-select,
      #${MODAL} .m104-textarea,
      #${MODAL} .m104-mini input {
        background: #101215 !important;
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        border: 1px solid #505862 !important;
        border-radius: 10px !important;
      }

      #${MODAL} .m104-input:focus,
      #${MODAL} .m104-select:focus,
      #${MODAL} .m104-textarea:focus {
        outline: 2px solid #FF7927 !important;
        outline-offset: 1px !important;
      }

      #${MODAL} .m104-chip,
      #${MODAL} .m104-tool,
      #${MODAL} .m104-soft,
      #${MODAL} .m104-add,
      #${MODAL} .m104-gold,
      #${MODAL} .m104-btn,
      #${MODAL} .m105-mobile-tab {
        background: #1B1D21 !important;
        background-image: none !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 10px !important;
        box-shadow: none !important;
      }

      #${MODAL} .m104-chip.active,
      #${MODAL} .m104-gold,
      #${MODAL} #m104Assign {
        background: #FF7927 !important;
        background-image: none !important;
        color: #101114 !important;
        -webkit-text-fill-color: #101114 !important;
        border-color: #FF7927 !important;
        font-weight: 900 !important;
      }

      #${MODAL} .m104-ex,
      #${MODAL} .m104-built,
      #${MODAL} .m105-program-map {
        background: #101215 !important;
        background-image: none !important;
        border-color: #414954 !important;
      }

      #${MODAL} .m104-ex strong,
      #${MODAL} .m104-built-name,
      #${MODAL} .m104-program-head h3,
      #${MODAL} .m105-program-map h4 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${MODAL} .m104-ex small {
        color: #B7C0CB !important;
        -webkit-text-fill-color: #B7C0CB !important;
      }

      /* =====================================
         QUICK START HEADER
         ===================================== */

      #${MODAL} #${PANEL} {
        background: #15171B;
        border: 1px solid #505862;
        border-radius: 18px;
        padding: 20px;
        margin: 15px 0 5px;
        color: #FFFFFF;
        box-sizing: border-box;
      }

      #${PANEL} * {
        box-sizing: border-box;
      }

      #${PANEL} .mqs-eyebrow {
        font: 900 10px/1.4 system-ui,sans-serif;
        letter-spacing: .13em;
        color: #FF7927;
        margin-bottom: 7px;
      }

      #${PANEL} h2 {
        color: #FFFFFF;
        font-size: 24px;
        font-weight: 900;
        margin: 0 0 7px;
      }

      #${PANEL} .mqs-description {
        color: #B7C0CB;
        font-size: 12px;
        line-height: 1.6;
        margin: 0 0 16px;
      }

      #${PANEL} .mqs-options {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 10px;
      }

      #${PANEL} .mqs-choice {
        width: 100%;
        min-width: 0;
        min-height: 90px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 6px;

        background: #101215;
        border: 1px solid #454D57;
        border-radius: 13px;
        color: #FFFFFF;
        text-align: left;
        cursor: pointer;
      }

      #${PANEL} .mqs-choice:first-child {
        grid-column: 1 / -1;
        background: #25180F;
        border-color: #FF7927;
      }

      #${PANEL} .mqs-choice:hover,
      #${PANEL} .mqs-choice:focus-visible {
        border-color: #FF7927;
        outline-color: #FF7927;
      }

      #${PANEL} .mqs-choice strong {
        font-size: 14px;
        font-weight: 900;
        color: #FFFFFF;
      }

      #${PANEL} .mqs-choice span {
        font-size: 11px;
        line-height: 1.5;
        color: #B7C0CB;
      }

      #${PANEL} .mqs-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid #383F49;
      }

      #${PANEL} .mqs-tool {
        min-height: 42px;
        padding: 10px 15px;
        border: 1px solid #FF7927;
        border-radius: 11px;
        background: #1B1D21;
        color: #FF7927;
        font-size: 12px;
        font-weight: 850;
        cursor: pointer;
      }

      #${PANEL} .mqs-tool.selected {
        background: #FF7927;
        color: #101114;
      }

      #${PANEL} .mqs-status {
        margin-top: 12px;
        font-size: 12px;
        line-height: 1.55;
        color: #FF7927;
      }

      #${PANEL} .mqs-choice:disabled {
        opacity: .5;
        cursor: not-allowed;
      }

      @media (max-width: 700px) {
        #${MODAL} {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }

        #${MODAL} #${PANEL} {
          padding: 13px;
        }

        #${PANEL} h2 {
          font-size: 20px;
        }

        #${PANEL} .mqs-options {
          grid-template-columns: 1fr;
          gap: 8px;
        }

        #${PANEL} .mqs-choice:first-child {
          grid-column: auto;
        }

        #${PANEL} .mqs-choice {
          min-height: 76px;
          padding: 12px;
        }
      }

    `;

    document.head.appendChild(sheet);
  }

  /* =====================================================
     EXISTING BUILDER CONTROLS
     ===================================================== */

  function isOpen() {
    return !!$(MODAL)?.classList.contains("open");
  }

  function ready() {
    return Boolean(
      isOpen() &&
      $("m104ProgramName") &&
      $("m104BuiltList") &&
      $("m104Library")
    );
  }

  function setValue(id, value) {
    const input = $(id);
    if (!input) return;

    input.value = String(value);

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  function findControl(attribute, value) {
    return Array.from(
      $(MODAL)?.querySelectorAll(
        "[" + attribute + "]"
      ) || []
    ).find(button =>
      button.getAttribute(attribute) ===
      String(value)
    );
  }

  function selectControl(attribute, value) {
    const button = findControl(
      attribute,
      value
    );

    if (!button) {
      throw new Error(
        "Could not find " +
        attribute + " " + value
      );
    }

    button.click();
  }

  function changeField(index, field, value) {
    const input = Array.from(
      $("m104BuiltList")
        ?.querySelectorAll(
          '[data-field="' + field + '"]'
        ) || []
    ).find(node =>
      Number(node.dataset.index) === index
    );

    if (!input) return;

    input.value = String(value);
    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  /* =====================================================
     ADD EXERCISE THROUGH LIVE LIBRARY
     ===================================================== */

  function addExercise(definition) {
    const [name, sets, reps, rest] =
      definition;

    setValue("m104Search", name);

    const row = Array.from(
      $("m104Library")
        ?.querySelectorAll(".m104-ex") || []
    ).find(item =>
      item.querySelector("strong")
        ?.textContent.trim().toLowerCase() ===
      name.toLowerCase()
    );

    const add =
      row?.querySelector("[data-add-ex]");

    if (!add) return false;

    add.click();

    const count =
      $("m104BuiltList")
        ?.querySelectorAll(".m104-built")
        .length || 0;

    if (!count) return false;

    const index = count - 1;

    changeField(index, "sets", sets);
    changeField(index, "reps", reps);
    changeField(index, "rest", rest);

    return true;
  }

  /* =====================================================
     BUILD WEEK 1
     ===================================================== */

  function buildWorkout(dayNumber, workout) {
    selectControl("data-day", dayNumber);

    setValue(
      "m104DayTitle",
      workout.title
    );

    setValue("m104Minutes", 55);

    const missing = [];

    for (const exercise of workout.exercises) {
      if (!addExercise(exercise)) {
        missing.push(exercise[0]);
      }
    }

    setValue("m104Search", "");

    return missing;
  }

  /* =====================================================
     APPLY PRESET

     Build Week 1, then use existing
     Copy Week function for Weeks 2-4.

     This preserves builder's private
     draft state and save format.
     ===================================================== */

  async function applyPreset(preset) {
    if (busy || !ready()) return;

    if (presetLoaded) {
      alert(
        "A preset is already loaded. " +
        "Close and reopen the Program Builder " +
        "to start another fresh program."
      );
      return;
    }

    const hasExercises =
      $("m104BuiltList")
        ?.querySelector(".m104-built");

    if (hasExercises) {
      alert(
        "This workout already contains exercises. " +
        "Open a new builder before loading a preset " +
        "so your current work is preserved."
      );
      return;
    }

    const proceed = confirm(
      "Load " + preset.title + "?\n\n" +
      "Mana will build four weeks using the " +
      "existing exercise library.\n\n" +
      "You can customise everything before saving."
    );

    if (!proceed) return;

    busy = true;

    const status = $("mqsStatus105008");

    const buttons = Array.from(
      $(PANEL).querySelectorAll(
        ".mqs-choice"
      )
    );

    buttons.forEach(button => {
      button.disabled = true;
    });

    const missing = new Set();

    try {
      setValue(
        "m104ProgramName",
        "Mana " + preset.title
      );

      setValue(
        "m104Goal",
        preset.goal
      );

      setValue("m104Weeks", 4);

      $("m104Weeks").dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      const all = Array.from(
        $("m104Categories")
          ?.querySelectorAll("[data-cat]") || []
      ).find(button =>
        button.dataset.cat?.toLowerCase() ===
        "all"
      );

      all?.click();

      selectControl("data-week", 1);

      for (
        let day = 1;
        day <= preset.workouts.length;
        day++
      ) {
        if (status) {
          status.textContent =
            "Building Day " + day +
            " of " + preset.workouts.length + "…";
        }

        const omitted = buildWorkout(
          day,
          preset.workouts[day - 1]
        );

        omitted.forEach(name =>
          missing.add(name)
        );

        await new Promise(resolve =>
          requestAnimationFrame(resolve)
        );
      }

      /*
       Restore Day 1 before copying.
       The existing copy function preserves
       all built days in the current week.
      */

      selectControl("data-day", 1);

      for (let week = 2; week <= 4; week++) {
        const copy = $("m104CopyWeek");

        if (!copy) {
          throw new Error(
            "Copy Week button unavailable."
          );
        }

        copy.click();

        if (status) {
          status.textContent =
            "Creating Week " + week + " of 4…";
        }

        await new Promise(resolve =>
          requestAnimationFrame(resolve)
        );
      }

      selectControl("data-week", 1);
      selectControl("data-day", 1);

      presetLoaded = true;

      if (status) {
        status.textContent =
          missing.size
            ? (
              "Preset loaded with unmatched exercises: " +
              [...missing].join(", ") +
              ". Review and add alternatives."
            )
            : (
              "Program ready ✓ Four weeks loaded. " +
              "Review and customise, then use " +
              "Save Program or Save + Assign."
            );
      }

      $(MODAL)?.classList.remove(
        "mqs-library-open",
        "mqs-map-open"
      );

      $(MODAL).scrollTop = 0;

      refreshTools();

    } catch (error) {
      presetLoaded = true;

      if (status) {
        status.textContent =
          "Preset needs review: " +
          (error.message || String(error)) +
          ". Nothing has been saved automatically.";
      }

      console.warn(
        "[Mana Quick Start]",
        error
      );

    } finally {
      busy = false;

      buttons.forEach(button => {
        button.disabled = false;
      });
    }
  }

  /* =====================================================
     OPTIONAL LIBRARY AND PROGRAM MAP
     ===================================================== */

  function togglePanel(name) {
    const modal = $(MODAL);
    if (!modal) return;

    const classname =
      name === "library"
        ? "mqs-library-open"
        : "mqs-map-open";

    const wasOpen =
      modal.classList.contains(classname);

    modal.classList.remove(
      "mqs-library-open",
      "mqs-map-open"
    );

    if (!wasOpen) {
      modal.classList.add(classname);
    }

    refreshTools();
  }

  function refreshTools() {
    const modal = $(MODAL);
    if (!modal) return;

    const library = $("mqsLibrary105008");
    const map = $("mqsMap105008");

    library?.classList.toggle(
      "selected",
      modal.classList.contains(
        "mqs-library-open"
      )
    );

    map?.classList.toggle(
      "selected",
      modal.classList.contains(
        "mqs-map-open"
      )
    );

    if (library) {
      library.textContent =
        modal.classList.contains(
          "mqs-library-open"
        )
          ? "Hide Exercise Library"
          : "Open Exercise Library";
    }

    if (map) {
      map.textContent =
        modal.classList.contains(
          "mqs-map-open"
        )
          ? "Hide Program Map"
          : "View Program Map";
    }
  }

  /* =====================================================
     MOUNT QUICK START PANEL

     Insert before the original content.
     The builder can re-render freely.
     ===================================================== */

  function mount() {
    const modal = $(MODAL);
    const content = $(CONTENT);

    if (!modal || !content) return;

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;

      panel.innerHTML = `
        <div class="mqs-eyebrow">
          MANA MOVEMENT · COACH TOOLS
        </div>

        <h2>Quick Start Programs</h2>

        <p class="mqs-description">
          Choose a ready-made program and
          customise it for your client.
          No need to build every workout
          from scratch.
        </p>

        <div class="mqs-options"></div>

        <div class="mqs-tools">
          <button
            type="button"
            class="mqs-tool"
            id="mqsLibrary105008"
          >
            Open Exercise Library
          </button>

          <button
            type="button"
            class="mqs-tool"
            id="mqsMap105008"
          >
            View Program Map
          </button>
        </div>

        <div
          id="mqsStatus105008"
          class="mqs-status"
          role="status"
          aria-live="polite"
        ></div>
      `;

      content.insertAdjacentElement(
        "beforebegin",
        panel
      );

      const grid = panel.querySelector(
        ".mqs-options"
      );

      PRESETS.forEach(preset => {
        const button =
          document.createElement("button");

        button.type = "button";
        button.className = "mqs-choice";

        const title =
          document.createElement("strong");

        title.textContent = preset.title;

        const description =
          document.createElement("span");

        description.textContent =
          preset.description;

        button.append(title, description);

        button.addEventListener(
          "click",
          () => void applyPreset(preset)
        );

        grid.appendChild(button);
      });

      $("mqsLibrary105008")
        .addEventListener(
          "click",
          () => togglePanel("library")
        );

      $("mqsMap105008")
        .addEventListener(
          "click",
          () => togglePanel("map")
        );
    }

    panel.style.display =
      ready() ? "" : "none";

    refreshTools();
  }

  /* =====================================================
     BUILDER REFRESH CONTROL

     Watch only the existing content's
     direct children and modal visibility.

     No document-wide mutation observer.
     ===================================================== */

  function scheduleMount() {
    if (frameQueued) return;

    frameQueued = true;

    requestAnimationFrame(() => {
      frameQueued = false;

      const nowOpen = isOpen();

      if (nowOpen && !opened) {
        presetLoaded = false;

        $(MODAL)?.classList.remove(
          "mqs-library-open",
          "mqs-map-open"
        );

        const status = $("mqsStatus105008");

        if (status) status.textContent = "";
      }

      opened = nowOpen;
      mount();
    });
  }

  function init() {
    installStyles();

    const modal = $(MODAL);
    const content = $(CONTENT);

    if (!modal || !content) {
      console.warn(
        "[Mana Quick Start] " +
        "V10.08 builder unavailable."
      );
      return;
    }

    const modalObserver =
      new MutationObserver(scheduleMount);

    modalObserver.observe(modal, {
      attributes: true,
      attributeFilter: ["class"]
    });

    contentObserver =
      new MutationObserver(scheduleMount);

    contentObserver.observe(content, {
      childList: true,
      subtree: false
    });

    scheduleMount();

    window.MANA_QUICKSTART_BUILD = BUILD;

    console.log(
      "[Mana Movement] Quick Start " +
      BUILD +
      " active"
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
