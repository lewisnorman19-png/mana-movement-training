
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — QUICK START PROGRAM LIBRARY
   BUILD 105007

   COMPLETE NEW JAVASCRIPT FILE

   WORKS WITH:
   v10_01_coach_program_builder_100110.js

   PRESETS
   - Chest & Triceps / Back & Biceps /
     Legs & Shoulders — 3 day split
   - Chest Day
   - Back Day
   - Arms Day
   - Leg Day

   FEATURES
   - Uses existing Mana exercise library
   - Automatically fills four training weeks
   - Includes sets, reps and rest periods
   - All workouts stay editable
   - Existing Save and Save + Assign remain
   - Full custom exercise builder stays available
   - No new database tables
   - No change to existing client assignments

   IMPORTANT
   Presets should be loaded into a newly opened
   builder. This script uses the builder's existing
   buttons and input handlers, not private state.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105007";
  const FLAG = "MANA_QUICKSTART_105007";
  const STYLE = "manaQuickstartStyle105007";
  const MODAL = "manaV1001ProgramBuilder";
  const PANEL = "manaQuickstart105007";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  let working = false;
  let observer = null;
  let contentObserver = null;
  let framePending = false;
  let modalWasOpen = false;
  let usedThisSession = false;

  /* =====================================================
     PRESET WORKOUT DATA

     Names correspond to the existing
     Mana exercise library.
     ===================================================== */

  const EXERCISES = {

    chest: [
      ["Bench Press", 4, "6-10", 120],
      ["Incline Dumbbell Press", 3, "8-12", 90],
      ["Machine Chest Press", 3, "10-12", 75],
      ["Push Up", 3, "10-15", 60],
      ["Cable Triceps Pressdown", 3, "10-15", 60],
      ["Overhead Triceps Extension", 3, "10-15", 60]
    ],

    back: [
      ["Lat Pulldown", 4, "8-12", 90],
      ["Seated Cable Row", 4, "8-12", 90],
      ["Chest Supported Row", 3, "10-12", 75],
      ["Face Pull", 3, "12-15", 60],
      ["Barbell Curl", 3, "8-12", 60],
      ["Hammer Curl", 3, "10-12", 60]
    ],

    legsShoulders: [
      ["Leg Press", 4, "8-12", 120],
      ["Romanian Deadlift", 3, "8-10", 120],
      ["Bulgarian Split Squat", 3, "10 each", 90],
      ["Lying Hamstring Curl", 3, "10-15", 60],
      ["Dumbbell Shoulder Press", 3, "8-12", 90],
      ["Lateral Raise", 3, "12-15", 60]
    ],

    chestOnly: [
      ["Bench Press", 4, "6-10", 120],
      ["Incline Dumbbell Press", 4, "8-12", 90],
      ["Machine Chest Press", 3, "10-12", 75],
      ["Dumbbell Bench Press", 3, "10-12", 75],
      ["Push Up", 3, "10-15", 60]
    ],

    backOnly: [
      ["Lat Pulldown", 4, "8-12", 90],
      ["Barbell Row", 4, "6-10", 120],
      ["Seated Cable Row", 3, "10-12", 75],
      ["One Arm Dumbbell Row", 3, "10 each", 75],
      ["Face Pull", 3, "12-15", 60]
    ],

    armsOnly: [
      ["Barbell Curl", 3, "8-12", 60],
      ["Cable Triceps Pressdown", 3, "10-12", 60],
      ["Dumbbell Curl", 3, "10-12", 60],
      ["Overhead Triceps Extension", 3, "10-15", 60],
      ["Hammer Curl", 3, "10-12", 60],
      ["Bench Dip", 3, "10-15", 60]
    ],

    legsOnly: [
      ["Back Squat", 4, "6-10", 120],
      ["Leg Press", 3, "10-12", 90],
      ["Romanian Deadlift", 3, "8-12", 120],
      ["Bulgarian Split Squat", 3, "10 each", 90],
      ["Seated Hamstring Curl", 3, "10-15", 60],
      ["Seated Calf Raise", 3, "12-20", 60]
    ]
  };

  const PRESETS = [
    {
      id: "split3",
      title: "3-Day Training Split",
      subtitle:
        "Chest & Triceps / Back & Biceps / " +
        "Legs & Shoulders",
      goal: "Strength and muscle development",
      days: [
        ["Chest & Triceps", "chest"],
        ["Back & Biceps", "back"],
        ["Legs & Shoulders", "legsShoulders"]
      ]
    },
    {
      id: "chest",
      title: "Chest Day",
      subtitle: "Chest-focused gym workout",
      goal: "Chest muscle development",
      days: [
        ["Chest Day", "chestOnly"]
      ]
    },
    {
      id: "back",
      title: "Back Day",
      subtitle: "Back-focused gym workout",
      goal: "Back muscle development",
      days: [
        ["Back Day", "backOnly"]
      ]
    },
    {
      id: "arms",
      title: "Arms Day",
      subtitle: "Biceps and triceps workout",
      goal: "Arm muscle development",
      days: [
        ["Arms Day", "armsOnly"]
      ]
    },
    {
      id: "legs",
      title: "Leg Day",
      subtitle: "Lower-body gym workout",
      goal: "Lower-body strength",
      days: [
        ["Leg Day", "legsOnly"]
      ]
    }
  ];

  /* =====================================================
     PREMIUM STYLES
     ===================================================== */

  function styles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${MODAL} #${PANEL} {
        width: 100%;
        margin: 16px 0;
        padding: 18px;

        background: #15171B;
        border: 1px solid #505862;
        border-radius: 17px;

        color: #FFFFFF;
        box-sizing: border-box;
      }

      #${PANEL} * {
        box-sizing: border-box;
      }

      #${PANEL} .mqs-kicker {
        color: #FF7927;
        font: 900 10px/1.4
          system-ui, sans-serif;
        letter-spacing: .12em;
        margin-bottom: 6px;
      }

      #${PANEL} .mqs-title {
        font: 900 23px/1.2
          system-ui, sans-serif;
        color: #FFFFFF;
        margin: 0 0 7px;
      }

      #${PANEL} .mqs-help {
        font: 12px/1.6
          system-ui, sans-serif;
        color: #B7C0CB;
        margin: 0 0 15px;
      }

      #${PANEL} .mqs-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      #${PANEL} .mqs-preset {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        gap: 7px;
        width: 100%;
        min-width: 0;
        min-height: 98px;

        padding: 15px;

        background: #101215;
        border: 1px solid #4C5560;
        border-radius: 13px;

        text-align: left;
        color: #FFFFFF;
        cursor: pointer;

        transition:
          border-color .15s ease,
          background .15s ease;
      }

      #${PANEL} .mqs-preset:first-child {
        grid-column: 1 / -1;
        border-color: #FF7927;
        background: #241810;
      }

      #${PANEL} .mqs-preset:hover {
        border-color: #FF7927;
        background: #291B13;
      }

      #${PANEL} .mqs-preset strong {
        color: #FFFFFF;
        font-size: 14px;
        font-weight: 900;
      }

      #${PANEL} .mqs-preset span {
        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.45;
      }

      #${PANEL} .mqs-footer {
        margin-top: 13px;
        padding-top: 12px;
        border-top: 1px solid #383F49;

        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.55;
      }

      #${PANEL} .mqs-status {
        margin-top: 12px;
        color: #FF7927;
        font-size: 12px;
        font-weight: 750;
        line-height: 1.5;
      }

      #${PANEL} button:disabled {
        opacity: .5;
        cursor: not-allowed;
      }

      /* Existing builder's premium colours */

      #${MODAL} .m1001-brand,
      #${MODAL} .m1001-client {
        color: #FF7927 !important;
      }

      #${MODAL} .m1001-card {
        background: #15171B !important;
        border-color: #4C5560 !important;
        box-shadow: none !important;
      }

      #${MODAL} .m1001-chip.active {
        color: #FF7927 !important;
        border-color: #FF7927 !important;
        background: #291910 !important;
      }

      #${MODAL} .m1001-add,
      #${MODAL} .m1001-save,
      #${MODAL} .m1001-assign {
        border-color: #FF7927 !important;
        color: #FF7927 !important;
        background: #241810 !important;
      }

      #${MODAL} .m1001-add:hover,
      #${MODAL} .m1001-save:hover,
      #${MODAL} .m1001-assign:hover {
        background: #352114 !important;
      }

      @media (max-width: 600px) {
        #${MODAL} #${PANEL} {
          padding: 13px;
        }

        #${PANEL} .mqs-grid {
          grid-template-columns: 1fr;
          gap: 8px;
        }

        #${PANEL} .mqs-preset:first-child {
          grid-column: auto;
        }

        #${PANEL} .mqs-preset {
          min-height: 80px;
          padding: 13px;
        }

        #${PANEL} .mqs-title {
          font-size: 20px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     EXISTING BUILDER HELPERS
     ===================================================== */

  function modalOpen() {
    return !!$(MODAL)?.classList.contains("open");
  }

  function ready() {
    return Boolean(
      modalOpen() &&
      $("m1001ProgramName") &&
      $("m1001Search") &&
      $("m1001BuiltList")
    );
  }

  function inputValue(id, value) {
    const node = $(id);
    if (!node) return;

    node.value = String(value);

    node.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  function selectButton(attribute, value) {
    const buttons = Array.from(
      $(MODAL)?.querySelectorAll(
        "[" + attribute + "]"
      ) || []
    );

    const button = buttons.find(
      item =>
        item.getAttribute(attribute) ===
        String(value)
    );

    if (!button) {
      throw new Error(
        "Builder control unavailable: " +
        attribute + "=" + value
      );
    }

    button.click();
  }

  function clearCurrentDay() {
    const box = $("m1001BuiltList");
    if (!box) return;

    /*
     Use the builder's existing REMOVE
     event so private draft state stays
     synchronized.
    */

    let safety = 0;

    while (
      box.querySelector("[data-remove]") &&
      safety < 30
    ) {
      box.querySelector(
        "[data-remove]"
      ).click();

      safety++;
    }
  }

  function setExerciseField(
    index,
    key,
    value
  ) {
    const box = $("m1001BuiltList");

    const field = Array.from(
      box?.querySelectorAll(
        '[data-field="' + key + '"]'
      ) || []
    ).find(node =>
      Number(node.dataset.index) === index
    );

    if (!field) return;

    field.value = String(value);

    field.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  /* =====================================================
     ADD AN EXERCISE VIA ORIGINAL LIBRARY

     Matches exact exercise names from the
     existing Supabase-loaded library.

     This invokes the builder's own
     addExercise() through its button.
     ===================================================== */

  function addFromLibrary(row) {
    const [name, sets, reps, rest] = row;

    inputValue("m1001Search", name);

    const library = $("m1001Library");
    if (!library) return false;

    const match = Array.from(
      library.querySelectorAll(".m1001-ex")
    ).find(element =>
      element.querySelector("strong")
        ?.textContent.trim().toLowerCase() ===
      name.toLowerCase()
    );

    const button =
      match?.querySelector("[data-add-ex]");

    if (!button) return false;

    button.click();

    const count =
      $("m1001BuiltList")
        ?.querySelectorAll(".m1001-built")
        .length || 0;

    if (!count) return false;

    const index = count - 1;

    setExerciseField(index, "sets", sets);
    setExerciseField(index, "reps", reps);
    setExerciseField(index, "rest", rest);

    return true;
  }

  /* =====================================================
     APPLY A DAY
     ===================================================== */

  function applyDay(dayNumber, definition) {
    const [title, exerciseKey] = definition;

    selectButton("data-day", dayNumber);

    clearCurrentDay();

    inputValue("m1001DayTitle", title);
    inputValue("m1001Minutes", 55);

    const notFound = [];

    for (const exercise of EXERCISES[exerciseKey]) {
      if (!addFromLibrary(exercise)) {
        notFound.push(exercise[0]);
      }
    }

    inputValue("m1001Search", "");

    return notFound;
  }

  /* =====================================================
     APPLY COMPLETE PRESET

     Populate all 4 weeks, then return
     to Week 1 / Day 1.

     No Save or Assign action is triggered.
     ===================================================== */

  async function applyPreset(preset) {
    if (working || !ready()) return;

    if (usedThisSession) {
      window.alert(
        "For a different preset, close and " +
        "reopen Program Builder to start " +
        "with a fresh program."
      );
      return;
    }

    const approved = window.confirm(
      "Load " + preset.title + "?\n\n" +
      "This fills four weeks using the " +
      "existing Mana exercise library.\n\n" +
      "Any exercises in the selected " +
      "workout days will be replaced.\n\n" +
      "Use this on a newly opened builder " +
      "for a clean program."
    );

    if (!approved) return;

    working = true;

    const status = $(
      "manaQuickstartStatus105007"
    );

    const buttons = Array.from(
      $(PANEL).querySelectorAll(
        ".mqs-preset"
      )
    );

    buttons.forEach(button => {
      button.disabled = true;
    });

    const missing = new Set();

    try {
      inputValue(
        "m1001ProgramName",
        "Mana " + preset.title
      );

      inputValue("m1001Goal", preset.goal);

      inputValue(
        "m1001Description",
        "Four-week Mana Movement preset. " +
        "Personalise exercise selection, " +
        "sets, repetitions and rest periods " +
        "for the client's needs and ability."
      );

      /*
       Existing builder defaults to four
       weeks; explicitly set it to four.
      */

      inputValue("m1001Weeks", 4);

      $("m1001Weeks").dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      /*
       Reset the library category to ALL.
      */

      const all = Array.from(
        $("m1001Categories")
          ?.querySelectorAll("[data-cat]") || []
      ).find(
        node =>
          node.dataset.cat.toLowerCase() ===
          "all"
      );

      all?.click();

      for (let week = 1; week <= 4; week++) {
        if (!modalOpen()) {
          throw new Error(
            "Program Builder was closed."
          );
        }

        selectButton("data-week", week);

        for (
          let day = 1;
          day <= preset.days.length;
          day++
        ) {
          if (status) {
            status.textContent =
              "Loading Week " + week +
              " · Day " + day +
              " of " + preset.days.length +
              "…";
          }

          const omitted = applyDay(
            day,
            preset.days[day - 1]
          );

          omitted.forEach(name => {
            missing.add(name);
          });
        }

        /*
         Yield between weeks to avoid
         blocking the interface.
        */

        await new Promise(resolve => {
          requestAnimationFrame(resolve);
        });
      }

      selectButton("data-week", 1);
      selectButton("data-day", 1);

      usedThisSession = true;

      if (status) {
        status.textContent = missing.size
          ? (
            "Preset loaded. These exercises " +
            "could not be matched: " +
            [...missing].join(", ") +
            ". Add alternatives manually."
          )
          : (
            "Preset loaded ✓ " +
            preset.days.length +
            " workout day(s) per week " +
            "for four weeks. " +
            "Review, customise, then " +
            "Save or Save + Assign."
          );
      }

    } catch (error) {
      if (status) {
        status.textContent =
          "Could not finish preset: " +
          (error.message || String(error));
      }

      /*
       Never autosave an incomplete preset.
       The existing builder remains open
       for review or manual editing.
      */

      console.warn(
        "[Mana Quick Start]",
        error
      );

      usedThisSession = true;

    } finally {
      working = false;

      buttons.forEach(button => {
        button.disabled = false;
      });
    }
  }

  /* =====================================================
     MOUNT QUICK START CONTROLS

     Insert outside m1001Content so the
     original builder can re-render days
     without destroying the preset library.
     ===================================================== */

  function mount() {
    const modal = $(MODAL);
    if (!modal) return;

    const shell =
      modal.querySelector(".m1001-shell");

    const content = $("m1001Content");

    if (!shell || !content) return;

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;

      panel.innerHTML = `
        <div class="mqs-kicker">
          MANA MOVEMENT · COACH TOOLS
        </div>

        <h2 class="mqs-title">
          Quick Start Programs
        </h2>

        <p class="mqs-help">
          Choose a ready-made workout.
          Exercises, sets, reps and rest
          are prefilled. Customise anything
          before saving or assigning.
        </p>

        <div class="mqs-grid"></div>

        <div class="mqs-footer">
          Need something different?
          Continue using the full Exercise
          Library and Custom Program Builder
          below. Presets are starting points,
          not fixed client prescriptions.
        </div>

        <div
          class="mqs-status"
          id="manaQuickstartStatus105007"
          role="status"
        ></div>
      `;

      content.insertAdjacentElement(
        "beforebegin",
        panel
      );

      const grid = panel.querySelector(
        ".mqs-grid"
      );

      PRESETS.forEach(preset => {
        const button =
          document.createElement("button");

        button.type = "button";
        button.className = "mqs-preset";

        const title =
          document.createElement("strong");

        title.textContent = preset.title;

        const description =
          document.createElement("span");

        description.textContent =
          preset.subtitle;

        button.append(title, description);

        button.addEventListener(
          "click",
          () => {
            void applyPreset(preset);
          }
        );

        grid.appendChild(button);
      });
    }

    /*
     Hide choices while the exercise
     library is still loading.
    */

    panel.style.display =
      ready() ? "" : "none";
  }

  /* =====================================================
     WATCH EXISTING BUILDER

     Observe only its modal and content.
     No page-wide observers or intervals.
     ===================================================== */

  function scheduleMount() {
    if (framePending) return;

    framePending = true;

    requestAnimationFrame(() => {
      framePending = false;
      mount();

      const opened = modalOpen();

      if (opened && !modalWasOpen) {
        usedThisSession = false;

        const status = $(
          "manaQuickstartStatus105007"
        );

        if (status) status.textContent = "";
      }

      modalWasOpen = opened;
    });
  }

  function init() {
    styles();

    const modal = $(MODAL);

    if (!modal) {
      console.warn(
        "[Mana Quick Start] " +
        "Original Program Builder not found."
      );
      return;
    }

    observer = new MutationObserver(
      scheduleMount
    );

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ["class"]
    });

    const content = $("m1001Content");

    if (content) {
      contentObserver = new MutationObserver(
        scheduleMount
      );

      contentObserver.observe(content, {
        childList: true,
        subtree: false
      });
    }

    mount();

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
