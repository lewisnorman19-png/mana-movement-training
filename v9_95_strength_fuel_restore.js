/* =========================================
   MANA MOVEMENT TRAINING v9.95.3
   STRENGTH FUEL STABILITY

   FIX
   - Quick Add Water no longer rebuilds Fuel
   - No screen flick on water add
   - Recovery remains in place
   - Coach Chat remains in place
   - Meal redraw still restores Recovery/polish

   DATA
   - Uses existing mana-fuel-v571 store
   - Same daily water value
   - Same targets

   NO
   - data reset
   - workout changes
   - timers
   - MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99530";


  const FUEL_KEY =
    "mana-fuel-v571";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  let restoreTimer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {

    try {

      return JSON.parse(
        raw
      );

    } catch (_) {

      return fallback;

    }

  }


  function todayKey() {

    const date =
      new Date();


    return [
      date.getFullYear(),
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )
    ].join(
      "-"
    );

  }


  function loadFuelStore() {

    return safeJson(
      localStorage.getItem(
        FUEL_KEY
      ) || "{}",
      {}
    );

  }


  function loadTargets() {

    return safeJson(
      localStorage.getItem(
        TARGET_KEY
      ) || "{}",
      {}
    );

  }


  function programTitle() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      ||
      ""
    );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      ||
      ""
    );

  }


  function strengthFuelOpen() {

    return Boolean(

      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains(
          "open"
        )

      &&

      programTitle() ===
        "MANA STRENGTH"

      &&

      activeTab() ===
        "fuel"

    );

  }


  function pct(
    current,
    target
  ) {

    if (
      !Number(
        target
      )
    ) {

      return 0;

    }


    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          Number(
            current || 0
          )
          /
          Number(
            target
          )
          *
          100
        )
      )
    );

  }


  /* =========================================
     WATER — SAVE WITHOUT FULL RENDER
     ========================================= */

  function addWaterWithoutRender(
    amount
  ) {

    const store =
      loadFuelStore();


    const key =
      todayKey();


    const day =
      store[key] || {
        meals:{
          Breakfast:[],
          Lunch:[],
          Dinner:[],
          Snacks:[]
        },
        water:0
      };


    day.water =
      Number(
        day.water || 0
      )
      +
      Number(
        amount || 0
      );


    store[key] =
      day;


    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(
        store
      )
    );


    updateWaterDisplay(
      day.water
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated",
        {
          detail:{
            source:
              "water",
            water:
              day.water
          }
        }
      )
    );

  }


  /* =========================================
     UPDATE ONLY WATER UI
     ========================================= */

  function updateWaterDisplay(
    water
  ) {

    const root =
      document.querySelector(
        "#manaV83Content .mana-v897-root"
      );


    if (!root) {

      return;

    }


    const targets =
      loadTargets();


    const target =
      Number(
        targets.water || 0
      );


    const stats =
      [
        ...root.querySelectorAll(
          ".mana-v897-stat"
        )
      ];


    const waterStat =
      stats.find(
        stat =>
          stat
            .querySelector(
              ".mana-v897-label"
            )
            ?.textContent
            ?.trim()
            ?.toLowerCase() ===
          "water"
      );


    if (!waterStat) {

      return;

    }


    const value =
      waterStat.querySelector(
        ".mana-v897-value"
      );


    if (value) {

      value.textContent =
        `${Math.round(
          Number(
            water || 0
          )
        )} / ${target}ml`;

    }


    const fill =
      waterStat.querySelector(
        ".mana-v897-fill"
      );


    if (fill) {

      fill.style.width =
        `${pct(
          water,
          target
        )}%`;

    }

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function restoreRecovery() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    if (
      !document.getElementById(
        "manaV989Recovery"
      )
    ) {

      if (
        typeof
          window
            .ManaProfileRecovery
            ?.refresh ===
        "function"
      ) {

        window
          .ManaProfileRecovery
          .refresh();

      }

    }

  }


  /* =========================================
     EXISTING FUEL POLISH
     ========================================= */

  function restoreFuelPolish() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    if (
      typeof
        window
          .refreshManaStrengthFuelPolish ===
      "function"
    ) {

      window
        .refreshManaStrengthFuelPolish(
          20
        );

    }

  }


  /* =========================================
     POST MEAL RESTORE
     ========================================= */

  function restoreFuelExtras() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    restoreRecovery();


    setTimeout(
      () => {

        restoreFuelPolish();

        restoreRecovery();

      },
      40
    );


    setTimeout(
      () => {

        restoreFuelPolish();

        restoreRecovery();

      },
      150
    );

  }


  function scheduleRestore(
    delay = 50
  ) {

    clearTimeout(
      restoreTimer
    );


    restoreTimer =
      setTimeout(
        restoreFuelExtras,
        delay
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    /*
      CAPTURE PHASE.

      We catch Water before the old v8.9
      button handler can call renderFuel().
    */

    document.addEventListener(
      "click",
      event => {

        const waterButton =
          event.target.closest(
            "[data-mana-water]"
          );


        if (
          waterButton &&
          strengthFuelOpen()
        ) {

          event.preventDefault();

          event.stopPropagation();

          event.stopImmediatePropagation();


          addWaterWithoutRender(
            Number(
              waterButton
                .dataset
                .manaWater || 0
            )
          );


          return;

        }


        const mealSelected =
          event.target.closest(
            "[data-v932-meal]"
          );


        const mealRemoved =
          event.target.closest(
            "[data-mana-remove-meal]"
          );


        const customMeal =
          event.target.closest(
            "#manaV941CustomSave"
          );


        if (
          mealSelected ||
          mealRemoved ||
          customMeal
        ) {

          /*
            Meal system still performs a full
            Fuel render.

            Restore only the extra Fuel layers
            afterwards.
          */

          setTimeout(
            restoreFuelExtras,
            50
          );


          setTimeout(
            restoreFuelExtras,
            180
          );


          return;

        }


        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRestore(
            100
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            100
          );

        }

      }
    );


    window.addEventListener(
      "mana:recovery-updated",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            50
          );

        }

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    wireEvents();


    if (
      strengthFuelOpen()
    ) {

      scheduleRestore(
        180
      );

    }


    window.MANA_STRENGTH_FUEL_RESTORE_BUILD =
      BUILD;


    console.log(
      "[Mana v9.95.3] " +
      "Strength Fuel stable water ready"
    );

  }


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
