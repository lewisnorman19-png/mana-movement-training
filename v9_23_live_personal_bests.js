/* =========================================
   MANA MOVEMENT TRAINING v9.23.0
   LIVE PERSONAL BESTS

   - SHOWS BEST PREVIOUS LOAD
   - DETECTS A NEW PB LIVE
   - WORKS WITH EXISTING WORKOUT LOGGER
   - DOES NOT TOUCH TIMER / PAUSE /
     OVERVIEW / NAVIGATION
   ========================================= */

(() => {
  "use strict";


  const LOG_KEY =
    "mana-strength-v64-logs";

  const STYLE_ID =
    "mana-v923-pb-style";


  let observerTimer =
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


  function loadLogs() {

    const logs =
      safeJson(
        localStorage.getItem(
          LOG_KEY
        ) || "[]",
        []
      );


    return Array.isArray(
      logs
    )
      ? logs
      : [];

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
     HISTORIC PERSONAL BEST
     ========================================= */

  function bestWeightForExercise(
    exerciseName
  ) {

    let best =
      0;


    loadLogs()
      .forEach(
        log => {

          (
            log?.exercises ||
            []
          )
            .forEach(
              exercise => {

                if (
                  exercise?.name !==
                  exerciseName
                ) {
                  return;
                }


                (
                  exercise?.sets ||
                  []
                )
                  .forEach(
                    set => {

                      /*
                        Only count completed
                        historic sets.
                      */

                      if (
                        set?.done ===
                          false
                      ) {
                        return;
                      }


                      best =
                        Math.max(
                          best,
                          Number(
                            set?.weight ||
                            0
                          )
                        );

                    }
                  );

              }
            );

        }
      );


    return best;

  }


  /* =========================================
     CURRENT WORKOUT BEST
     ========================================= */

  function currentWeightForCard(
    card
  ) {

    const weights =
      [
        ...card.querySelectorAll(
          "[data-v64-weight]"
        )
      ]
        .map(
          input =>
            Number(
              input.value ||
              0
            )
        )
        .filter(
          value =>
            Number.isFinite(
              value
            ) &&
            value > 0
        );


    if (!weights.length) {
      return 0;
    }


    return Math.max(
      ...weights
    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {

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

      .mana-v923-pb{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;

        margin-top:9px;
        padding:9px 11px;

        border:
          1px solid
          #2f2f2f;

        border-radius:12px;

        background:#0a0a0a;
      }


      .mana-v923-pb-label{
        color:#777;

        font-size:9px;

        font-weight:900;

        letter-spacing:.07em;

        text-transform:uppercase;
      }


      .mana-v923-pb-value{
        color:#aaa;

        font-size:11px;

        font-weight:900;
      }


      .mana-v923-pb.new-pb{
        border-color:#6d5920;

        background:
          linear-gradient(
            145deg,
            #1a1607,
            #0a0a0a
          );
      }


      .mana-v923-pb.new-pb
      .mana-v923-pb-label{
        color:#f3d875;
      }


      .mana-v923-pb.new-pb
      .mana-v923-pb-value{
        color:#f3d875;
      }


      .mana-v923-new{
        display:inline-flex;
        align-items:center;

        margin-left:6px;
        padding:3px 6px;

        border-radius:999px;

        background:#f3d875;

        color:#111;

        font-size:8px;

        font-weight:900;

        letter-spacing:.05em;
      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     BUILD PB DISPLAY
     ========================================= */

  function ensurePBDisplay(
    card
  ) {

    if (
      card.querySelector(
        ".mana-v923-pb"
      )
    ) {
      return;
    }


    const suggestion =
      card.querySelector(
        ".mana-v64-suggestion"
      );


    if (!suggestion) {
      return;
    }


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "mana-v923-pb";


    row.innerHTML = `

      <span
        class="mana-v923-pb-label"
      >
        PERSONAL BEST
      </span>


      <span
        class="mana-v923-pb-value"
      >
        —
      </span>

    `;


    suggestion
      .insertAdjacentElement(
        "afterend",
        row
      );

  }


  /* =========================================
     UPDATE ONE EXERCISE
     ========================================= */

  function updateCard(
    card
  ) {

    ensurePBDisplay(
      card
    );


    const row =
      card.querySelector(
        ".mana-v923-pb"
      );


    const value =
      row?.querySelector(
        ".mana-v923-pb-value"
      );


    if (
      !row ||
      !value
    ) {
      return;
    }


    const exerciseName =
      String(
        card.dataset
          .exerciseName ||
        ""
      ).trim();


    if (!exerciseName) {
      return;
    }


    const historicBest =
      bestWeightForExercise(
        exerciseName
      );


    const currentBest =
      currentWeightForCard(
        card
      );


    const newPB =
      historicBest > 0 &&
      currentBest >
        historicBest;


    row.classList.toggle(
      "new-pb",
      newPB
    );


    if (
      newPB
    ) {

      value.innerHTML = `

        ${currentBest} kg

        <span
          class="mana-v923-new"
        >
          NEW PB
        </span>

      `;


      return;
    }


    if (
      historicBest > 0
    ) {

      value.textContent =
        `${historicBest} kg`;

      return;
    }


    value.textContent =
      "First logged load";

  }


  /* =========================================
     UPDATE ALL
     ========================================= */

  function refreshPBs() {

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

          updateCard(
            card
          );

        }
      );

  }


  /* =========================================
     LIVE INPUT
     ========================================= */

  function watchWeightInput() {

    document.addEventListener(
      "input",
      event => {

        const input =
          event.target.closest(
            "#manaV64Exercises [data-v64-weight]"
          );


        if (!input) {
          return;
        }


        const card =
          input.closest(
            ".mana-v64-card"
          );


        if (!card) {
          return;
        }


        updateCard(
          card
        );

      }
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function watchEvents() {

    [
      "mana:workout-progress-change",
      "mana:strength-synced"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            setTimeout(
              refreshPBs,
              100
            );


            setTimeout(
              refreshPBs,
              350
            );

          }
        );

      }
    );

  }


  /* =========================================
     DOM WATCH
     ========================================= */

  function watchDOM() {

    const observer =
      new MutationObserver(
        () => {

          if (
            !workoutOpen()
          ) {
            return;
          }


          clearTimeout(
            observerTimer
          );


          observerTimer =
            setTimeout(
              refreshPBs,
              100
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    watchWeightInput();

    watchEvents();

    watchDOM();


    [
      300,
      700,
      1200
    ].forEach(
      delay => {

        setTimeout(
          refreshPBs,
          delay
        );

      }
    );

  }


  window.refreshManaPersonalBests =
    refreshPBs;


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
