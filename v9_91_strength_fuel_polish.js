/* =========================================
   MANA MOVEMENT TRAINING v9.91.0
   STRENGTH + FUEL POLISH

   STRENGTH
   - SET 4 REPS MATCH SETS 1–3
   - KEEP MANUAL REP CHANGES
   - PREVIOUS / NEXT BECOME PURE ARROWS
   - TICK ALL TURNS GOLD WHEN COMPLETE
   - USE EXISTING SAVED TICK-ALL SYSTEM

   FUEL
   - CLEANER DAILY PROGRESS
   - WATER GETS ITS OWN CARD
   - QUICK ADD WATER DIRECTLY UNDER WATER
   - RECOVERY REMAINS ITS OWN CARD
   - REMOVE REDUNDANT BALANCE BANNER
   - NO TARGET / PROFILE DUPLICATION

   STABILITY
   - NO MUTATION OBSERVER
   - NO DATA RESET
   - NO TIMER CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99100";


  const STYLE_ID =
    "mana-v991-strength-fuel-polish-style";


  let refreshTimer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

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


  function shellOpen() {

    return Boolean(
      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains(
          "open"
        )
    );

  }


  function fuelOpen() {

    return Boolean(

      shellOpen()

      &&

      (
        programTitle() ===
          "MANA STRENGTH"

        ||

        programTitle() ===
          "MANA 28"
      )

      &&

      activeTab() ===
        "fuel"

    );

  }


  function workoutOpen() {

    return Boolean(
      document
        .getElementById(
          "manaStrengthV64Workout"
        )
        ?.classList
        .contains(
          "open"
        )
    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         PURE WORKOUT ARROWS
         ===================================== */

      @media(max-width:700px){

        #manaV971BottomNav
        .mana-v971-nav-btn{

          position:
            relative !important;

          display:
            grid !important;

          place-items:
            center !important;

          min-height:
            62px !important;

          padding:
            0 !important;

          overflow:
            hidden !important;

          font-size:
            0 !important;

          line-height:
            1 !important;

          text-indent:
            0 !important;

          color:
            transparent !important;

        }


        #manaV971Previous::before{

          content:
            "←";

          color:
            #f3d875;

          font-size:
            37px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971Next::before{

          content:
            "→";

          color:
            #f3d875;

          font-size:
            37px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn:disabled::before{

          color:
            #555;

        }

      }


      /* =====================================
         TICK ALL
         ===================================== */

      #manaV990TickAllFeedback,
      .mana-v920-tick-all{

        transition:
          background .15s ease,
          color .15s ease,
          border-color .15s ease;

      }


      #manaV990TickAllFeedback.done,
      .mana-v920-tick-all.done{

        background:
          #f3d875 !important;

        border-color:
          #f3d875 !important;

        color:
          #111 !important;

      }


      #manaV990TickAllFeedback.done::before,
      .mana-v920-tick-all.done::before{

        content:
          "✓ ";

      }


      /* =====================================
         FUEL — CLEANER MAIN CARD
         ===================================== */

      #manaV83Content
      .mana-v897-progress{

        padding:
          16px !important;

        margin-bottom:
          10px !important;

      }


      #manaV83Content
      .mana-v897-progress
      .mana-v897-head{

        margin-bottom:
          9px !important;

      }


      #manaV83Content
      .mana-v897-progress
      .mana-v897-head h3{

        font-size:
          18px !important;

      }


      #manaV83Content
      .mana-v897-goal{

        margin-bottom:
          11px !important;

      }


      /* =====================================
         CALORIES + PROTEIN ONLY
         ===================================== */

      #manaV83Content
      .mana-v897-progress
      .mana-v897-grid{

        grid-template-columns:
          1fr
          1fr !important;

        gap:
          8px !important;

      }


      #manaV83Content
      .mana-v897-progress
      .mana-v897-stat{

        padding:
          13px !important;

      }


      /* =====================================
         NEW WATER CARD
         ===================================== */

      #manaV83Content
      .mana-v991-water-card{

        margin:
          10px 0 !important;

        padding:
          16px !important;

        border:
          1px solid
          #34301f;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #14130d,
            #090909
          );

      }


      .mana-v991-water-head{

        display:
          flex;

        align-items:
          flex-start;

        justify-content:
          space-between;

        gap:
          12px;

      }


      .mana-v991-water-kicker{

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .10em;

      }


      .mana-v991-water-title{

        margin-top:
          4px;

        color:
          #fff;

        font-size:
          17px;

        font-weight:
          950;

      }


      .mana-v991-water-value{

        color:
          #f3d875;

        font-size:
          17px;

        font-weight:
          950;

        white-space:
          nowrap;

      }


      .mana-v991-water-card
      .mana-v897-track{

        margin-top:
          13px;

      }


      /* =====================================
         WATER QUICK ADD
         ===================================== */

      #manaV83Content
      .mana-v991-water-card
      .mana-v897-water{

        width:
          100% !important;

        margin:
          13px 0 0 !important;

        padding:
          13px 0 0 !important;

        border-top:
          1px solid
          #292929 !important;

      }


      #manaV83Content
      .mana-v991-water-card
      .mana-v897-water-title{

        margin-bottom:
          8px !important;

        color:
          #888 !important;

        font-size:
          10px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .05em;

        text-transform:
          uppercase;

      }


      #manaV83Content
      .mana-v991-water-card
      .mana-v897-water-btn{

        min-height:
          43px !important;

        background:
          #0d0d0d !important;

      }


      /* =====================================
         REMOVE EXTRA FUEL BANNERS
         ===================================== */

      #manaV83Content
      .mana-v991-balance-hidden{

        display:
          none !important;

      }


      #manaV83Content
      #manaV89BuildTargets,

      #manaV83Content
      #manaV89EditTargets,

      #manaV83Content
      .mana-v989-profile-note{

        display:
          none !important;

      }


      /* =====================================
         RECOVERY A LITTLE TIGHTER
         ===================================== */

      #manaV83Content
      .mana-v989-recovery{

        margin-top:
          10px !important;

        padding:
          16px !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:430px){

        #manaV83Content
        .mana-v897-progress
        .mana-v897-grid{

          grid-template-columns:
            1fr
            1fr !important;

        }


        #manaV83Content
        .mana-v897-progress
        .mana-v897-value{

          font-size:
            17px !important;

        }


        .mana-v991-water-value{

          font-size:
            15px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     SET 4 REP FIX
     ========================================= */

  function setRows(
    card
  ) {

    return [
      ...card.querySelectorAll(
        ".mana-v64-set"
      )
    ];

  }


  function markManualRepEdit(
    input,
    event
  ) {

    if (
      !event?.isTrusted
    ) {

      return;

    }


    const row =
      input.closest(
        ".mana-v64-set"
      );


    const card =
      input.closest(
        ".mana-v64-card"
      );


    if (
      !row ||
      !card
    ) {

      return;

    }


    const rows =
      setRows(
        card
      );


    const index =
      rows.indexOf(
        row
      );


    /*
      Set 1 drives the automatic value.
      Sets 2–4 can still be manually changed.
    */

    if (
      index > 0
    ) {

      input.dataset
        .v991ManualRep =
        "1";

    }

  }


  function syncCardReps(
    card,
    forceFourth = false
  ) {

    if (!card) {

      return;

    }


    const rows =
      setRows(
        card
      );


    if (
      rows.length < 2
    ) {

      return;

    }


    const first =
      rows[0]
        ?.querySelector(
          "[data-v64-reps]"
        );


    if (!first) {

      return;

    }


    const firstValue =
      String(
        first.value || ""
      );


    if (!firstValue) {

      return;

    }


    rows
      .slice(
        1
      )
      .forEach(
        (
          row,
          childIndex
        ) => {

          const input =
            row.querySelector(
              "[data-v64-reps]"
            );


          if (!input) {

            return;

          }


          const actualIndex =
            childIndex + 1;


          const manuallyEdited =
            input.dataset
              .v991ManualRep ===
            "1";


          if (
            manuallyEdited
          ) {

            return;

          }


          /*
            Force Set 4 into line on initial
            workout render because this is the
            row currently failing to inherit
            the automatic rep prescription.
          */

          const shouldForce =
            forceFourth &&
            actualIndex === 3;


          const previousAuto =
            input.dataset
              .v991AutoRep || "";


          const canAutoUpdate =
            shouldForce
            ||
            input.value === ""
            ||
            input.value ===
              previousAuto;


          if (
            !canAutoUpdate
          ) {

            return;

          }


          input.value =
            firstValue;


          input.dataset
            .v991AutoRep =
            firstValue;


          input.dispatchEvent(
            new Event(
              "input",
              {
                bubbles:true
              }
            )
          );

        }
      );

  }


  function syncAllWorkoutReps(
    forceFourth = false
  ) {

    if (
      !workoutOpen()
    ) {

      return;

    }


    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        card => {

          syncCardReps(
            card,
            forceFourth
          );

        }
      );

  }


  /* =========================================
     PURE ARROWS
     ========================================= */

  function labelWorkoutArrows() {

    const previous =
      document.getElementById(
        "manaV971Previous"
      );


    const next =
      document.getElementById(
        "manaV971Next"
      );


    /*
      CSS removes whatever text v9.71
      redraws and displays only the arrows.
      These labels are for accessibility.
    */

    previous?.setAttribute(
      "aria-label",
      "Previous exercise"
    );


    next?.setAttribute(
      "aria-label",
      "Next exercise"
    );

  }


  /* =========================================
     TICK ALL STATE
     ========================================= */

  function everyWorkoutSetDone() {

    const checks =
      [
        ...document.querySelectorAll(
          "#manaV64Exercises [data-v64-check]"
        )
      ];


    return Boolean(
      checks.length &&
      checks.every(
        check =>
          check.classList
            .contains(
              "done"
            )
      )
    );

  }


  function syncTickAllAppearance() {

    const complete =
      everyWorkoutSetDone();


    document
      .querySelectorAll(
        "#manaV990TickAllFeedback, " +
        ".mana-v920-tick-all"
      )
      .forEach(
        button => {

          button.classList.toggle(
            "done",
            complete
          );


          if (
            button.id ===
            "manaV990TickAllFeedback"
          ) {

            button.textContent =
              complete
                ? "ALL SETS TICKED"
                : "TICK ALL SETS";

          }

        }
      );

  }


  function activateTickAll() {

    /*
      v9.20 already contains the reliable
      Tick All + saveTicks behaviour.

      Use it instead of creating another
      competing persistence system.
    */

    const native =
      document.getElementById(
        "manaV920TickWorkout"
      );


    if (native) {

      native.click();

    } else {

      document
        .querySelectorAll(
          "#manaV64Exercises [data-v64-check]"
        )
        .forEach(
          check => {

            check.classList.add(
              "done"
            );

          }
        );


      document
        .querySelector(
          "#manaV64Exercises input"
        )
        ?.dispatchEvent(
          new Event(
            "input",
            {
              bubbles:true
            }
          )
        );

    }


    setTimeout(
      syncTickAllAppearance,
      70
    );

  }


  function wireFeedbackTickAll() {

    const button =
      document.getElementById(
        "manaV990TickAllFeedback"
      );


    if (
      !button ||
      button.dataset
        .v991TickReady ===
        "1"
    ) {

      syncTickAllAppearance();

      return;

    }


    /*
      v9.90 already attached a click
      handler, so replace the node with
      a clean copy and let v9.91 own it.
    */

    const clean =
      button.cloneNode(
        true
      );


    button.replaceWith(
      clean
    );


    clean.dataset
      .v991TickReady =
      "1";


    clean.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        activateTickAll();

      }
    );


    syncTickAllAppearance();

  }


  /* =========================================
     FUEL CLEANUP
     ========================================= */

  function fuelProgressCard() {

    return document.querySelector(
      "#manaV83Content .mana-v897-progress"
    );

  }


  function findWaterStat() {

    const progress =
      fuelProgressCard();


    if (!progress) {

      return null;

    }


    return [
      ...progress.querySelectorAll(
        ".mana-v897-stat"
      )
    ]
      .find(
        stat => {

          return (
            stat
              .querySelector(
                ".mana-v897-label"
              )
              ?.textContent
              ?.trim()
              ?.toLowerCase()
            ===
            "water"
          );

        }
      )
      ||
      null;

  }


  function hideBalanceCard() {

    const root =
      document.querySelector(
        "#manaV83Content .mana-v897-root"
      );


    if (!root) {

      return;

    }


    [
      ...root.querySelectorAll(
        ".mana-v897-card"
      )
    ]
      .forEach(
        card => {

          const heading =
            card.querySelector(
              ".mana-v897-head h3"
            )
              ?.textContent
              ?.trim()
              ?.toLowerCase()
            ||
            card.querySelector(
              "h3"
            )
              ?.textContent
              ?.trim()
              ?.toLowerCase()
            ||
            "";


          card.classList.toggle(
            "mana-v991-balance-hidden",
            heading ===
              "balance left today"
          );

        }
      );

  }


  function buildWaterCard() {

    if (
      !fuelOpen()
    ) {

      return;

    }


    const progress =
      fuelProgressCard();


    const waterStat =
      findWaterStat();


    const quickWater =
      progress
        ?.querySelector(
          ".mana-v897-water"
        )
      ||
      document.querySelector(
        "#manaV83Content .mana-v897-water"
      );


    if (
      !progress ||
      !waterStat ||
      !quickWater
    ) {

      return;

    }


    const value =
      waterStat
        .querySelector(
          ".mana-v897-value"
        )
        ?.textContent
        ?.trim()
      ||
      "—";


    const fillWidth =
      waterStat
        .querySelector(
          ".mana-v897-fill"
        )
        ?.style
        ?.width
      ||
      "0%";


    let waterCard =
      document.getElementById(
        "manaV991WaterCard"
      );


    if (!waterCard) {

      waterCard =
        document.createElement(
          "div"
        );


      waterCard.id =
        "manaV991WaterCard";


      waterCard.className =
        "mana-v991-water-card";


      progress
        .insertAdjacentElement(
          "afterend",
          waterCard
        );

    }


    waterCard.innerHTML = `

      <div
        class="mana-v991-water-head"
      >

        <div>

          <div
            class="mana-v991-water-kicker"
          >
            WATER
          </div>

          <div
            class="mana-v991-water-title"
          >
            Daily Hydration
          </div>

        </div>


        <div
          class="mana-v991-water-value"
        >
          ${value}
        </div>

      </div>


      <div
        class="mana-v897-track"
      >

        <div
          class="mana-v897-fill"
          style="width:${fillWidth}"
        ></div>

      </div>

    `;


    /*
      Move the REAL quick-add controls,
      including their existing delegated
      behaviour, into the new Water card.
    */

    waterCard.appendChild(
      quickWater
    );


    /*
      Water no longer needs to remain as
      a third large statistic inside
      Daily Progress.
    */

    waterStat.remove();


    hideBalanceCard();

  }


  function tidyFuel() {

    if (
      !fuelOpen()
    ) {

      return;

    }


    buildWaterCard();

    hideBalanceCard();

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    syncAllWorkoutReps(
      true
    );

    labelWorkoutArrows();

    wireFeedbackTickAll();

    syncTickAllAppearance();

    tidyFuel();

  }


  function scheduleRefresh(
    delay = 80
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        delay
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    /*
      User rep changes.
    */

    document.addEventListener(
      "input",
      event => {

        const input =
          event.target.closest(
            "#manaV64Exercises [data-v64-reps]"
          );


        if (!input) {

          return;

        }


        markManualRepEdit(
          input,
          event
        );


        const card =
          input.closest(
            ".mana-v64-card"
          );


        const rows =
          card
            ? setRows(
                card
              )
            : [];


        const row =
          input.closest(
            ".mana-v64-set"
          );


        if (
          card &&
          row &&
          rows.indexOf(
            row
          ) === 0
        ) {

          syncCardReps(
            card,
            false
          );

        }

      },
      true
    );


    document.addEventListener(
      "click",
      event => {

        /*
          Any individual tick can change
          Tick All visual state.
        */

        if (
          event.target.closest(
            "#manaV64Exercises [data-v64-check]"
          )
        ) {

          setTimeout(
            syncTickAllAppearance,
            80
          );

        }


        /*
          The shared Fuel renderer completely
          redraws the page after adding water.
          Re-apply our clean layout afterwards.
        */

        if (
          event.target.closest(
            "[data-mana-water]"
          )
        ) {

          setTimeout(
            tidyFuel,
            50
          );


          setTimeout(
            tidyFuel,
            140
          );

        }


        /*
          Workout navigation is rebuilt by
          v9.71, so refresh accessibility
          state after navigation.
        */

        if (
          event.target.closest(
            "#manaV971BottomNav"
          )
        ) {

          setTimeout(
            () => {

              labelWorkoutArrows();

              syncTickAllAppearance();

            },
            80
          );

        }


        /*
          Opening program tabs / workouts.
        */

        if (
          event.target.closest(
            "#manaV83Tabs .mana-v83-tab, " +
            ".mana-v85-start, " +
            "[data-v85-day]"
          )
        ) {

          scheduleRefresh(
            120
          );


          setTimeout(
            () => {

              syncAllWorkoutReps(
                true
              );

              wireFeedbackTickAll();

              labelWorkoutArrows();

            },
            300
          );

        }

      },
      true
    );


    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:workout-feedback-saved",
      "mana:fuel-updated"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            () => {

              scheduleRefresh(
                100
              );

            }
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    wireEvents();


    scheduleRefresh(
      250
    );


    window.MANA_STRENGTH_FUEL_POLISH_BUILD =
      BUILD;


    window.refreshManaStrengthFuelPolish =
      scheduleRefresh;


    console.log(
      "[Mana v9.91.0] " +
      "Strength + Fuel polish ready"
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
