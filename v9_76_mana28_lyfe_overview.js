/* =========================================
   MANA MOVEMENT TRAINING v9.76.0

   MANA 28 + MANA LYFE
   EXACT STRENGTH OVERVIEW SYSTEM

   - USES SAME MARKUP AS MANA STRENGTH
   - SAME ICON BLOCKS
   - SAME CARD POLISH
   - SAME TYPOGRAPHY
   - SAME MOBILE STACK
   - SAME ARROWS / SPACING
   - DIRECT TAP HANDLERS
   - DOES NOT TOUCH PROGRAM / WORKOUT LOGIC
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97600";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";


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
     MANA 28 OVERVIEW
     ========================================= */

  function renderMana28() {

    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {

      return;

    }


    const state =
      loadState(
        M28_KEY
      );


    const completed =
      state.completed.length;


    holder.innerHTML = `

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
            Everything important for your
            28-day reset in one place.
            Choose where you want to go next.
          </p>

        </div>


        <div
          class="mana-v964-grid"
        >

          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="program"
          >

            <div
              class="mana-v964-icon"
            >
              28
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROGRAM
              </div>

              <div
                class="mana-v964-title"
              >
                Your 28 Days
              </div>

              <div
                class="mana-v964-text"
              >
                Strength, cardio, mobility
                and recovery across a simple
                28-day training plan.
              </div>

              <div
                class="mana-v964-arrow"
              >
                VIEW PROGRAM →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="fuel"
          >

            <div
              class="mana-v964-icon"
            >
              F
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                FUEL
              </div>

              <div
                class="mana-v964-title"
              >
                Nutrition
              </div>

              <div
                class="mana-v964-text"
              >
                Manage your calories,
                protein, meals, water
                and daily targets.
              </div>

              <div
                class="mana-v964-arrow"
              >
                OPEN FUEL →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="progress"
          >

            <div
              class="mana-v964-icon"
            >
              ↗
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROGRESS
              </div>

              <div
                class="mana-v964-title"
              >
                Your Results
              </div>

              <div
                class="mana-v964-text"
              >
                ${completed} of 28 days complete.
                Track consistency and see
                how far you have come.
              </div>

              <div
                class="mana-v964-arrow"
              >
                VIEW PROGRESS →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="learn"
          >

            <div
              class="mana-v964-icon"
            >
              i
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                LEARN
              </div>

              <div
                class="mana-v964-title"
              >
                Build Better Habits
              </div>

              <div
                class="mana-v964-text"
              >
                Understand the simple
                training and lifestyle
                principles behind Mana 28.
              </div>

              <div
                class="mana-v964-arrow"
              >
                LEARN MORE →
              </div>

            </div>

          </button>

        </div>

      </div>

    `;


    bindCards(
      holder
    );
  }


  /* =========================================
     MANA LYFE OVERVIEW
     ========================================= */

  function renderLyfe() {

    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {

      return;

    }


    const state =
      loadState(
        LYFE_KEY
      );


    const completed =
      state.completed.length;


    holder.innerHTML = `

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
            Movement, mindset and daily action
            in one place. Choose what you need next.
          </p>

        </div>


        <div
          class="mana-v964-grid"
        >

          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="routine"
          >

            <div
              class="mana-v964-icon"
            >
              28
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROGRAM
              </div>

              <div
                class="mana-v964-title"
              >
                Your 28 Days
              </div>

              <div
                class="mana-v964-text"
              >
                Simple strength, cardio,
                walking and recovery combined
                with daily mindset work.
              </div>

              <div
                class="mana-v964-arrow"
              >
                VIEW PROGRAM →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="reclaim"
          >

            <div
              class="mana-v964-icon"
            >
              ✦
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                JOURNAL
              </div>

              <div
                class="mana-v964-title"
              >
                Reclaim
              </div>

              <div
                class="mana-v964-text"
              >
                Reflect, reset and work
                through the things that
                matter each day.
              </div>

              <div
                class="mana-v964-arrow"
              >
                OPEN JOURNAL →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="progress"
          >

            <div
              class="mana-v964-icon"
            >
              ↗
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROGRESS
              </div>

              <div
                class="mana-v964-title"
              >
                Your Journey
              </div>

              <div
                class="mana-v964-text"
              >
                ${completed} of 28 days complete.
                Track consistency, movement
                and daily momentum.
              </div>

              <div
                class="mana-v964-arrow"
              >
                VIEW PROGRESS →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v976-tab="learn"
          >

            <div
              class="mana-v964-icon"
            >
              i
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                LEARN
              </div>

              <div
                class="mana-v964-title"
              >
                Tools for Lyfe
              </div>

              <div
                class="mana-v964-text"
              >
                Learn practical tools for
                mindset, routine, consistency
                and moving forward.
              </div>

              <div
                class="mana-v964-arrow"
              >
                LEARN MORE →
              </div>

            </div>

          </button>

        </div>

      </div>

    `;


    bindCards(
      holder
    );
  }


  /* =========================================
     CARD ACTIONS
     ========================================= */

  function bindCards(
    holder
  ) {

    holder
      .querySelectorAll(
        "[data-v976-tab]"
      )
      .forEach(
        card => {

          card.onclick =
            event => {

              event.preventDefault();

              event.stopPropagation();


              openTab(
                card.dataset
                  .v976Tab
              );

            };

        }
      );
  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {

    const program =
      currentProgram();


    if (
      !program ||
      activeTab() !==
        "overview"
    ) {

      return;

    }


    if (
      program ===
      "mana28"
    ) {

      renderMana28();

      return;

    }


    renderLyfe();
  }


  function refresh() {

    [
      20,
      100,
      220
    ].forEach(
      delay => {

        setTimeout(
          render,
          delay
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    refresh();


    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );


    window.addEventListener(
      "mana:v973-updated",
      refresh
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV80Mana28",
              "#manaV80Life",
              "#manaV83Back"
            ].join(",")
          )
        ) {

          refresh();

        }

      },
      true
    );


    window
      .MANA_28_LYFE_OVERVIEW_BUILD =
      BUILD;


    window
      .refreshMana28LyfeOverview =
      refresh;


    console.log(
      "[Mana v9.76.0] exact Strength-style overview ready"
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
