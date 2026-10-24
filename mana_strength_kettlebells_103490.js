
/* ===================================================
   MANA MOVEMENT TRAINING
   KETTLEBELL EQUIPMENT UPGRADE
   BUILD 103490

   Full JavaScript file:
   mana_strength_kettlebells_103490.js

   - Kettlebells in Profile
   - Kettlebells in Strength builder
   - Program-wide kettlebell exercise selection
   - Save equipment preference
   - Update newly built program and preview
   - Preserve existing Strength history
   - No global HTML interception
   - No repeating render timers
   =================================================== */

(() => {
  "use strict";

  const BUILD = "103490";

  if (window.MANA_KETTLEBELLS_103490) return;
  window.MANA_KETTLEBELLS_103490 = true;

  const PROFILE_KEY = "mana-profile-v67";
  const PROGRAM_KEY = "mana-strength-v62-program";

  const EQUIPMENT = "Kettlebells";

  const $ = id => document.getElementById(id);

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(
        localStorage.getItem(key) || "null"
      );

      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }

  /* =========================================
     EXERCISE LIBRARY
     ========================================= */

  const KETTLEBELL = {
    squat: [
      "Kettlebell Goblet Squat",
      "Double Kettlebell Front Squat"
    ],

    hinge: [
      "Kettlebell Deadlift",
      "Kettlebell Romanian Deadlift"
    ],

    push: [
      "Kettlebell Floor Press",
      "Single Arm Kettlebell Floor Press"
    ],

    shoulder: [
      "Single Arm Kettlebell Press",
      "Double Kettlebell Shoulder Press"
    ],

    pull: [
      "Single Arm Kettlebell Row",
      "Kettlebell Bent Over Row"
    ],

    verticalPull: [
      "Kettlebell Pullover",
      "Kettlebell High Pull"
    ],

    singleLeg: [
      "Kettlebell Reverse Lunge",
      "Kettlebell Split Squat"
    ],

    glutes: [
      "Kettlebell Glute Bridge",
      "Kettlebell Sumo Deadlift"
    ],

    calf: [
      "Kettlebell Standing Calf Raise"
    ],

    arms: [
      "Kettlebell Hammer Curl",
      "Kettlebell Overhead Triceps Extension"
    ],

    accessory: [
      "Kettlebell Halo",
      "Kettlebell Farmer Carry"
    ],

    core: [
      "Kettlebell Suitcase Carry",
      "Kettlebell Front Rack Carry"
    ]
  };

  /* =========================================
     EXERCISE CLASSIFICATION
     ========================================= */

  function category(name) {
    const n = String(name || "").toLowerCase();

    if (/calf/.test(n)) return "calf";

    if (
      /plank|crunch|core|abdom|sit.up|carry/.test(n)
    ) return "core";

    if (
      /biceps|triceps|curl|pressdown|extension/.test(n)
    ) return "arms";

    if (
      /lateral raise|rear delt|fly|face pull/.test(n)
    ) return "accessory";

    if (
      /lat pulldown|pull.up|chin.up|pullover/.test(n)
    ) return "verticalPull";

    if (
      /row|horizontal pull/.test(n)
    ) return "pull";

    if (
      /shoulder press|overhead press|military press/.test(n)
    ) return "shoulder";

    if (
      /bench press|chest press|floor press|push.up|incline press|incline db/.test(n)
    ) return "push";

    if (
      /lunge|split squat|step.up|single leg/.test(n)
    ) return "singleLeg";

    if (
      /leg curl|hamstring|romanian|deadlift|hinge/.test(n)
    ) return "hinge";

    if (
      /hip thrust|glute|bridge/.test(n)
    ) return "glutes";

    if (
      /squat|leg press|leg extension|quad/.test(n)
    ) return "squat";

    return "accessory";
  }

  function exerciseName(original, index, day) {
    const group = category(original);

    const choices =
      KETTLEBELL[group] ||
      KETTLEBELL.accessory;

    return choices[
      (index + day) % choices.length
    ];
  }

  /* =========================================
     PROFILE EQUIPMENT
     ========================================= */

  function addProfileOption() {
    const select = $("manaProfileEquipment");

    if (!select) return;

    if (!select.querySelector(
      'option[value="Kettlebells"]'
    )) {
      const option = document.createElement(
        "option"
      );

      option.value = EQUIPMENT;
      option.textContent = EQUIPMENT;

      const bodyweight = select.querySelector(
        'option[value="Bodyweight"]'
      );

      if (bodyweight) {
        bodyweight.before(option);
      } else {
        select.appendChild(option);
      }
    }

    const profile = readJSON(
      PROFILE_KEY,
      {}
    );

    if (
      profile.equipment === EQUIPMENT &&
      select.value !== EQUIPMENT
    ) {
      select.value = EQUIPMENT;
    }
  }

  /* =========================================
     STRENGTH BUILDER EQUIPMENT
     ========================================= */

  function addBuilderOption() {
    const group = document.querySelector(
      '[data-strength-group="equipment"]'
    );

    if (!group) return;

    if (!group.querySelector(
      '[data-value="Kettlebells"]'
    )) {
      const button = document.createElement(
        "button"
      );

      button.type = "button";
      button.className = "mana-strength-option";
      button.dataset.value = EQUIPMENT;
      button.textContent = EQUIPMENT;

      const bodyweight = group.querySelector(
        '[data-value="Bodyweight"]'
      );

      if (bodyweight) {
        bodyweight.before(button);
      } else {
        group.appendChild(button);
      }
    }

    const profile = readJSON(
      PROFILE_KEY,
      {}
    );

    if (profile.equipment === EQUIPMENT) {
      selectKettlebells(group);
    }
  }

  function selectKettlebells(group) {
    if (!group) return;

    group.querySelectorAll(
      ".mana-strength-option"
    ).forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.value === EQUIPMENT
      );
    });
  }

  /* =========================================
     CONVERT PROGRAM EXERCISES
     ========================================= */

  function convertProgram(program) {
    if (
      !program ||
      !Array.isArray(program.sessions)
    ) {
      return null;
    }

    const updated = JSON.parse(
      JSON.stringify(program)
    );

    const replacements = new Map();

    updated.equipment = EQUIPMENT;

    updated.sessions = updated.sessions.map(
      (session, day) => {
        if (
          !Array.isArray(session) ||
          !Array.isArray(session[1])
        ) {
          return session;
        }

        let index = 0;

        const exercises = session[1].map(
          item => {
            if (
              !Array.isArray(item) ||
              typeof item[0] !== "string"
            ) {
              return item;
            }

            const oldName = item[0];

            const newName = exerciseName(
              oldName,
              index,
              day
            );

            index++;

            replacements.set(
              oldName,
              newName
            );

            return [
              newName,
              ...item.slice(1)
            ];
          }
        );

        return [
          session[0],
          exercises,
          ...session.slice(2)
        ];
      }
    );

    return {
      program: updated,
      replacements
    };
  }

  /* =========================================
     UPDATE VISIBLE BUILDER PREVIEW
     ========================================= */

  function updatePreview(replacements) {
    const preview = $("manaStrengthProgram");

    if (!preview) return;

    const walker = document.createTreeWalker(
      preview,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(node => {
      const value = node.nodeValue;
      const trimmed = value.trim();

      if (replacements.has(trimmed)) {
        node.nodeValue = value.replace(
          trimmed,
          replacements.get(trimmed)
        );
      }
    });

    const summary = preview.querySelector(
      ".mana-strength-summary"
    );

    if (summary) {
      summary.textContent =
        summary.textContent.replace(
          /Full gym|Dumbbells|Home basics|Bodyweight/gi,
          EQUIPMENT
        );
    }
  }

  /* =========================================
     HANDLE NEW PROGRAM BUILD
     ========================================= */

  function handleProgramBuilt(event) {
    const program = event.detail;

    if (!program) return;

    if (program.equipment !== EQUIPMENT) {
      return;
    }

    const result = convertProgram(program);

    if (!result) return;

    saveJSON(
      PROGRAM_KEY,
      result.program
    );

    updatePreview(
      result.replacements
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:kettlebell-program-ready",
        {
          detail: {
            equipment: EQUIPMENT,
            program: result.program
          }
        }
      )
    );

    console.log(
      "Mana Strength kettlebell program ready"
    );
  }

  /* =========================================
     EQUIPMENT SELECTION EVENTS
     ========================================= */

  function handleClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const option = event.target.closest(
      '[data-strength-group="equipment"] ' +
      '[data-value="Kettlebells"]'
    );

    if (option) {
      const group = option.closest(
        '[data-strength-group="equipment"]'
      );

      // Run after the builder's normal
      // equipment-selection click handler.
      queueMicrotask(() => {
        selectKettlebells(group);
      });

      return;
    }

    // The original app creates some screens
    // when they are opened, so install choices
    // after normal navigation has completed.

    if (
      event.target.closest(
        "#manaV83Tabs, " +
        "#manaProfileScreen, " +
        "#manaStrengthModal, " +
        '[data-v83-tab="program"]'
      )
    ) {
      requestAnimationFrame(() => {
        addProfileOption();
        addBuilderOption();
      });
    }
  }

  /* =========================================
     PROFILE SAVE FEEDBACK
     ========================================= */

  function handleProfileSaved() {
    const profile = readJSON(
      PROFILE_KEY,
      {}
    );

    if (profile.equipment !== EQUIPMENT) {
      return;
    }

    const group = document.querySelector(
      '[data-strength-group="equipment"]'
    );

    selectKettlebells(group);

    const status = $("manaProfileStatus");

    if (status) {
      status.textContent =
        "Kettlebells saved ✓ " +
        "Rebuild your Strength program " +
        "to use kettlebell exercises.";
    }
  }

  /* =========================================
     INIT
     ========================================= */

  function init() {
    addProfileOption();
    addBuilderOption();

    document.addEventListener(
      "click",
      handleClick
    );

    // Use capture so the program is converted
    // before other listeners react to the
    // newly created Strength program.

    window.addEventListener(
      "mana:strength-program-built",
      handleProgramBuilt,
      true
    );

    const saveButton = $("manaProfileSave");

    if (saveButton) {
      saveButton.addEventListener(
        "click",
        () => {
          queueMicrotask(handleProfileSaved);
        }
      );
    }

    window.addEventListener(
      "pageshow",
      () => {
        addProfileOption();
        addBuilderOption();
      }
    );

    console.log(
      "Mana Strength Kettlebells",
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
