
/* ============================================================
   MANA MOVEMENT TRAINING
   QUICK START — PUSH & PULL PRESETS
   BUILD 105009

   COMPLETE JAVASCRIPT FILE

   ADDS:
   - Push Day: Chest / Shoulders / Triceps
   - Pull Day: Back / Biceps
   - Approximately 45–50 minutes
   - Four-week schedule
   - Editable sets, reps, rest and exercises

   USES:
   - Existing v10.08 Program Builder
   - Existing Supabase exercise library
   - Existing Save / Save + Assign

   PROTECTS:
   - Five existing Quick Start presets
   - Current premium layout and colour scheme
   - Client assignments
   - Program Builder save logic
   - Coach Hub and client data

   NO DATABASE CHANGES
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105009";
  const FLAG = "MANA_PUSH_PULL_105009";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const MODAL = "manaV1008ProgramBuilder";
  const PANEL = "manaQuickStart105008";
  const GRID = ".mqs-options";

  const $ = id => document.getElementById(id);

  let building = false;
  let completed = false;
  let observedModal = null;
  let observer = null;
  let scheduled = false;

  /* =====================================================
     WORKOUT PRESETS
     ===================================================== */

  const PRESETS = [
    {
      id: "push",
      title: "Push Day",
      description:
        "Chest · Shoulders · Triceps · 45–50 min",
      goal:
        "Push strength and muscle development",
      workout: {
        title: "Push Day",
        minutes: 50,
        exercises: [
          ["Bench Press", 3, "6-10", 90],
          ["Incline Dumbbell Press", 3, "8-12", 75],
          ["Dumbbell Shoulder Press", 3, "8-12", 75],
          ["Lateral Raise", 3, "12-15", 45],
          ["Cable Triceps Pressdown", 3, "10-15", 60],
          ["Overhead Triceps Extension", 2, "10-15", 60]
        ]
      }
    },
    {
      id: "pull",
      title: "Pull Day",
      description:
        "Back · Biceps · 45–50 min",
      goal:
        "Pull strength and muscle development",
      workout: {
        title: "Pull Day",
        minutes: 50,
        exercises: [
          ["Lat Pulldown", 3, "8-12", 75],
          ["Seated Cable Row", 3, "8-12", 75],
          ["Chest Supported Row", 3, "8-12", 75],
          ["Face Pull", 3, "12-15", 45],
          ["Barbell Curl", 3, "8-12", 60],
          ["Hammer Curl", 2, "10-15", 60]
        ]
      }
    }
  ];

  /* =====================================================
     BUILDER HELPERS
     ===================================================== */

  function modalOpen() {
    return Boolean(
      $(MODAL)?.classList.contains("open")
    );
  }

  function builderReady() {
    return Boolean(
      modalOpen() &&
      $(PANEL) &&
      $("m104ProgramName") &&
      $("m104BuiltList") &&
      $("m104Library") &&
      $("m104CopyWeek")
    );
  }

  function setInput(id, value) {
    const input = $(id);

    if (!input) {
      throw new Error(
        "Missing builder field: " + id
      );
    }

    input.value = String(value);

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  function findButton(attribute, value) {
    return Array.from(
      $(MODAL)?.querySelectorAll(
        "[" + attribute + "]"
      ) || []
    ).find(button =>
      button.getAttribute(attribute) ===
      String(value)
    );
  }

  function selectButton(attribute, value) {
    const button = findButton(
      attribute,
      value
    );

    if (!button) {
      throw new Error(
        "Missing " + attribute +
        " control: " + value
      );
    }

    button.click();
  }

  function setExerciseField(
    index,
    field,
    value
  ) {
    const input = Array.from(
      $("m104BuiltList")
        ?.querySelectorAll(
          '[data-field="' + field + '"]'
        ) || []
    ).find(node =>
      Number(node.dataset.index) === index
    );

    if (!input) {
      throw new Error(
        "Could not set exercise " +
        field + " at position " + index
      );
    }

    input.value = String(value);

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  /* =====================================================
     ADD FROM EXISTING MANA LIBRARY
     ===================================================== */

  function addExercise(definition) {
    const [name, sets, reps, rest] =
      definition;

    setInput("m104Search", name);

    const rows = Array.from(
      $("m104Library")
        ?.querySelectorAll(".m104-ex") || []
    );

    const row = rows.find(item =>
      item.querySelector("strong")
        ?.textContent.trim().toLowerCase() ===
      name.toLowerCase()
    );

    const add =
      row?.querySelector("[data-add-ex]");

    if (!add) {
      return false;
    }

    const before = $("m104BuiltList")
      .querySelectorAll(".m104-built").length;

    add.click();

    const after = $("m104BuiltList")
      .querySelectorAll(".m104-built").length;

    if (after !== before + 1) {
      return false;
    }

    const index = after - 1;

    setExerciseField(index, "sets", sets);
    setExerciseField(index, "reps", reps);
    setExerciseField(index, "rest", rest);

    return true;
  }

  /* =====================================================
     PROTECT EXISTING WORK
     ===================================================== */

  function hasExistingWork() {
    const summary = $(MODAL)?.querySelector(
      ".m104-workout-summary"
    );

    if (summary) {
      const match =
        summary.textContent.match(
          /(\d+)\s+workouts?\s+built/i
        );

      if (match && Number(match[1]) > 0) {
        return true;
      }
    }

    return Boolean(
      $("m104BuiltList")
        ?.querySelector(".m104-built")
    );
  }

  function status(message) {
    const node = $("mqsStatus105008");

    if (node) {
      node.textContent = message;
    }
  }

  function nextFrame() {
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }

  /* =====================================================
     BUILD FOUR-WEEK PROGRAM

     All changes use the original builder
     controls and private draft state.

     Does not save or assign automatically.
     ===================================================== */

  async function loadPreset(preset) {
    if (building || !builderReady()) return;

    if (completed || hasExistingWork()) {
      window.alert(
        "This builder already has a program " +
        "in progress.\n\n" +
        "Save your current work if needed, " +
        "then close and reopen Program Builder " +
        "before loading another preset."
      );
      return;
    }

    const approved = window.confirm(
      "Load " + preset.title + "?\n\n" +
      "Duration: 45–50 minutes per session.\n" +
      "Four training weeks will be created.\n\n" +
      "You can customise the exercises, " +
      "sets, reps and rest before saving."
    );

    if (!approved) return;

    building = true;

    const buttons = Array.from(
      $(PANEL)?.querySelectorAll(
        ".mqs-choice"
      ) || []
    );

    buttons.forEach(button => {
      button.disabled = true;
    });

    const missing = [];

    try {
      setInput(
        "m104ProgramName",
        "Mana " + preset.title
      );

      setInput(
        "m104Goal",
        preset.goal
      );

      setInput("m104Weeks", 4);

      $("m104Weeks").dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      /*
       Return library filter to ALL.
      */

      const all = Array.from(
        $("m104Categories")
          ?.querySelectorAll("[data-cat]") || []
      ).find(node =>
        String(
          node.dataset.cat
        ).toLowerCase() === "all"
      );

      all?.click();

      selectButton("data-week", 1);
      selectButton("data-day", 1);

      setInput(
        "m104DayTitle",
        preset.workout.title
      );

      setInput(
        "m104Minutes",
        preset.workout.minutes
      );

      for (const exercise of
        preset.workout.exercises) {

        if (!modalOpen()) {
          throw new Error(
            "Program Builder was closed."
          );
        }

        status(
          "Adding " + exercise[0] + "…"
        );

        if (!addExercise(exercise)) {
          missing.push(exercise[0]);
        }
      }

      setInput("m104Search", "");

      /*
       The existing Copy Week button
       duplicates Week 1 to Week 2,
       then Week 2 to Week 3, and so on.
      */

      selectButton("data-day", 1);

      for (let week = 2; week <= 4; week++) {
        if (!modalOpen()) {
          throw new Error(
            "Program Builder was closed."
          );
        }

        status(
          "Creating Week " + week +
          " of 4…"
        );

        const copy = $("m104CopyWeek");

        if (!copy) {
          throw new Error(
            "Copy Week control missing."
          );
        }

        copy.click();

        await nextFrame();
      }

      selectButton("data-week", 1);
      selectButton("data-day", 1);

      completed = true;

      status(
        missing.length
          ? (
            "Preset created with some " +
            "unmatched exercises: " +
            missing.join(", ") +
            ". Review before saving."
          )
          : (
            preset.title +
            " loaded ✓ Four weeks ready. " +
            "Review, edit, then Save or Assign."
          )
      );

      $(MODAL).classList.remove(
        "mqs-library-open",
        "mqs-map-open"
      );

      $(MODAL).scrollTop = 0;

    } catch (error) {
      completed = true;

      status(
        "Preset needs review: " +
        (error?.message || String(error)) +
        ". Nothing was saved automatically."
      );

      console.warn(
        "[Mana Push/Pull]",
        error
      );

    } finally {
      building = false;

      buttons.forEach(button => {
        button.disabled = false;
      });
    }
  }

  /* =====================================================
     MOUNT PUSH / PULL BUTTONS
     ===================================================== */

  function mount() {
    const panel = $(PANEL);
    const grid = panel?.querySelector(GRID);

    if (!grid) return;

    PRESETS.forEach(preset => {
      const id =
        "manaPreset105009-" + preset.id;

      if ($(id)) return;

      const button =
        document.createElement("button");

      button.id = id;
      button.type = "button";
      button.className = "mqs-choice";

      const title =
        document.createElement("strong");

      title.textContent = preset.title;

      const description =
        document.createElement("span");

      description.textContent =
        preset.description;

      button.append(
        title,
        description
      );

      button.addEventListener(
        "click",
        () => {
          void loadPreset(preset);
        }
      );

      grid.appendChild(button);
    });
  }

  /* =====================================================
     STARTUP

     Wait for the actual Program Builder
     and Quick Start panel.

     This also handles the screen being
     created after page load.
     ===================================================== */

  function scheduleMount() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;

      const nowOpen = modalOpen();

      if (nowOpen && !observedModal) {
        observedModal = $(MODAL);
      }

      mount();
    });
  }

  function init() {
    /*
     Existing builder and Quick Start
     modules load earlier in index.html.
    */

    const modal = $(MODAL);

    if (!modal) {
      console.warn(
        "[Mana Push/Pull] " +
        "V10.08 Program Builder unavailable."
      );
      return;
    }

    observer = new MutationObserver(
      scheduleMount
    );

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: true
    });

    modal.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#m104Close"
          )
        ) {
          completed = false;
        }
      }
    );

    scheduleMount();

    window.MANA_PUSH_PULL_BUILD = BUILD;

    console.log(
      "[Mana Movement] Push/Pull Presets " +
      BUILD + " active"
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
