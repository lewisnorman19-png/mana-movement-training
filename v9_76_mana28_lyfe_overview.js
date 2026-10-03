/* =========================================
   MANA MOVEMENT TRAINING v9.76.1

   MANA 28 + MANA LYFE
   STRENGTH OVERVIEW OWNER

   FIX
   - WAITS FOR v9.73 TO FINISH RENDERING
   - THEN PAINTS THE FINAL OVERVIEW
   - EXACT MANA STRENGTH COMPONENT CLASSES
   - NO OBSERVER
   - NO CONTINUOUS LOOP
   - DOES NOT TOUCH PROGRAM / WORKOUT
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97610";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";

  let timers = [];


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {

    try {

      return JSON.parse(raw);

    } catch (_) {

      return fallback;

    }
  }


  function loadState(
    key
  ) {

    const state =
      safeJson(
        localStorage.getItem(key) || "{}",
        {}
      );


    if (
      !Array.isArray(
        state.completed
      )
    ) {

      state.completed = [];

    }


    return state;
  }


  function title() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
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
        ?.v83Tab ||
      ""
    );
  }


  function currentProgram() {

    const value =
      title();


    if (
      value === "MANA 28"
    ) {

      return "mana28";

    }


    if (
      value === "MANA LIFE" ||
      value === "MANA LYFE"
    ) {

      return "lyfe";

    }


    return "";
  }


  function isOverview() {

    return (
      Boolean(
        currentProgram()
      ) &&
      activeTab() ===
        "overview"
    );
  }


  function openTab(
    tabName
  ) {

    document
      .querySelector(
        "#manaV83Tabs " +
        `[data-v83-tab="${tabName}"]`
      )
      ?.click();
  }


  /* =========================================
     CARD
     ========================================= */

  function card({
    tab,
    icon,
    label,
    title,
    text,
    arrow
  }) {

    return `

      <button
        type="button"
        class="mana-v964-launch"
        data-v976-tab="${tab}"
      >

        <div
          class="mana-v964-icon"
        >
          ${icon}
        </div>


        <div
          class="mana-v964-copy"
        >

          <div
            class="mana-v964-label"
          >
            ${label}
          </div>


          <div
            class="mana-v964-title"
          >
            ${title}
          </div>


          <div
            class="mana-v964-text"
          >
            ${text}
          </div>


          <div
            class="mana-v964-arrow"
          >
            ${arrow}
          </div>

        </div>

      </button>

    `;
  }


  /* =========================================
     MANA 28
     ========================================= */

  function mana28Markup() {

    const state =
      loadState(
        M28_KEY
      );


    const completed =
      state.completed.length;


    return `

      <div
        class="mana-v964-launchpad"
        id="manaV976Mana28"
      >

        <div
          class="mana-v964-intro"
        >

          <div
            class="mana-v964-kicker"
          >
            MANA 28
          </div>


          <h2>
            Your Mana 28 Hub
          </h2>


          <p>
            Everything important in one place.
            Choose where you want to go next.
          </p>

        </div>


        <div
          class="mana-v964-grid"
        >

          ${card({
            tab:"program",
            icon:"28",
            label:"PROGRAM",
            title:"Your 28 Days",
            text:
              "Strength, cardio, mobility and recovery across your complete 28-day program.",
            arrow:"VIEW PROGRAM →"
          })}


          ${card({
            tab:"fuel",
            icon:"F",
            label:"FUEL",
            title:"Nutrition",
            text:
              "Track calories, protein, meals, water and your daily nutrition targets.",
            arrow:"OPEN FUEL →"
          })}


          ${card({
            tab:"progress",
            icon:"↗",
            label:"PROGRESS",
            title:"Your Results",
            text:
              `${completed} of 28 days complete. Review your consistency and progress.`,
            arrow:"VIEW PROGRESS →"
          })}


          ${card({
            tab:"learn",
            icon:"i",
            label:"LEARN",
            title:"Build Better Habits",
            text:
              "Understand the training, recovery and lifestyle principles behind Mana 28.",
            arrow:"LEARN MORE →"
          })}

        </div>

      </div>

    `;
  }


  /* =========================================
     MANA LYFE
     ========================================= */

  function lyfeMarkup() {

    const state =
      loadState(
        LYFE_KEY
      );


    const completed =
      state.completed.length;


    return `

      <div
        class="mana-v964-launchpad"
        id="manaV976Lyfe"
      >

        <div
          class="mana-v964-intro"
        >

          <div
            class="mana-v964-kicker"
          >
            MANA LYFE
          </div>


          <h2>
            Your Mana Lyfe Hub
          </h2>


          <p>
            Everything important in one place.
            Choose where you want to go next.
          </p>

        </div>


        <div
          class="mana-v964-grid"
        >

          ${card({
            tab:"routine",
            icon:"28",
            label:"PROGRAM",
            title:"Your 28 Days",
            text:
              "Movement, cardio, simple strength and daily mindset work across 28 days.",
            arrow:"VIEW PROGRAM →"
          })}


          ${card({
            tab:"reclaim",
            icon:"✦",
            label:"JOURNAL",
            title:"Reclaim",
            text:
              "Reflect, reset and work through the things that matter to you each day.",
            arrow:"OPEN JOURNAL →"
          })}


          ${card({
            tab:"progress",
            icon:"↗",
            label:"PROGRESS",
            title:"Your Journey",
            text:
              `${completed} of 28 days complete. Follow your consistency and momentum.`,
            arrow:"VIEW PROGRESS →"
          })}


          ${card({
            tab:"learn",
            icon:"i",
            label:"LEARN",
            title:"Tools for Lyfe",
            text:
              "Practical tools for mindset, routine, consistency and moving forward.",
            arrow:"LEARN MORE →"
          })}

        </div>

      </div>

    `;
  }


  /* =========================================
     BIND
     ========================================= */

  function bindCards(
    holder
  ) {

    holder
      .querySelectorAll(
        "[data-v976-tab]"
      )
      .forEach(
        button => {

          button.onclick =
            event => {

              event.preventDefault();

              event.stopPropagation();


              openTab(
                button.dataset
                  .v976Tab
              );

            };

        }
      );
  }


  /* =========================================
     FINAL RENDER
     ========================================= */

  function renderFinalOverview() {

    if (
      !isOverview()
    ) {

      return;

    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {

      return;

    }


    const program =
      currentProgram();


    /*
      If our correct screen is already
      present, leave it alone.
    */

    if (
      program === "mana28" &&
      holder.querySelector(
        "#manaV976Mana28"
      )
    ) {

      return;

    }


    if (
      program === "lyfe" &&
      holder.querySelector(
        "#manaV976Lyfe"
      )
    ) {

      return;

    }


    holder.innerHTML =
      program === "mana28"
        ? mana28Markup()
        : lyfeMarkup();


    bindCards(
      holder
    );
  }


  /* =========================================
     TIMING

     v9.73 performs delayed redraws.
     Our final pass deliberately happens
     AFTER those redraws have finished.
     ========================================= */

  function scheduleFinalRender() {

    timers.forEach(
      clearTimeout
    );


    timers = [];


    [
      40,
      180,
      420,
      600,
      850
    ].forEach(
      delay => {

        timers.push(

          setTimeout(
            renderFinalOverview,
            delay
          )

        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    scheduleFinalRender();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleFinalRender
    );


    window.addEventListener(
      "mana:v973-updated",
      scheduleFinalRender
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV80Mana28",
              "#manaV80Life",
              "#manaV83Back",
              "#manaV83Tabs"
            ].join(",")
          )
        ) {

          scheduleFinalRender();

        }

      },
      true
    );


    window
      .MANA_28_LYFE_OVERVIEW_BUILD =
      BUILD;


    window
      .refreshMana28LyfeOverview =
      scheduleFinalRender;


    console.log(
      "[Mana v9.76.1] final overview owner ready"
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
