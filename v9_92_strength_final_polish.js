/* =========================================
   MANA MOVEMENT TRAINING v9.92.0
   STRENGTH FINAL POLISH

   - SET 1 WEIGHT AUTO-COPIES TO
     SETS 2, 3 AND 4
   - MANUAL WEIGHT CHANGES ARE RESPECTED
   - SMALLER / CLEANER WORKOUT ARROWS
   - NO WORKOUT DATA RESET
   - NO TIMER CHANGES
   - NO FUEL CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99200";


  const STYLE_ID =
    "mana-v992-strength-final-style";


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
         SMALLER WORKOUT NAVIGATION
         ===================================== */

      @media(max-width:700px){

        #manaV971BottomNav{

          gap:
            8px !important;

          margin-top:
            8px !important;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn{

          min-height:
            46px !important;

          border-radius:
            13px !important;

          border-color:
            #39331e !important;

          background:
            #0d0d0d !important;

          box-shadow:
            none !important;

        }


        #manaV971Previous::before,
        #manaV971Next::before{

          font-size:
            24px !important;

          font-weight:
            700 !important;

        }

      }


      /* =====================================
         COPY NOTE
         ===================================== */

      .mana-v941-copy-note{

        font-size:
          10px !important;

        color:
          #777 !important;

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     SET HELPERS
     ========================================= */

  function rowsForCard(
    card
  ) {

    return [
      ...card.querySelectorAll(
        "[data-v64-set]"
      )
    ];

  }


  function rowNumber(
    row
  ) {

    const card =
      row?.closest(
        ".mana-v64-card"
      );


    if (!card) {

      return 0;

    }


    return (
      rowsForCard(
        card
      )
        .indexOf(
          row
        )
      +
      1
    );

  }


  /* =========================================
     COPY SET 1 WEIGHT TO 2 / 3 / 4
     ========================================= */

  function syncSetOneWeight(
    input
  ) {

    const row =
      input.closest(
        "[data-v64-set]"
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


    if (
      rowNumber(
        row
      ) !== 1
    ) {

      return;

    }


    const value =
      input.value;


    const rows =
      rowsForCard(
        card
      );


    /*
      Sets 2, 3 and 4.

      Only update an untouched field or
      one previously filled automatically.
      Manual client changes remain intact.
    */

    rows
      .slice(
        1,
        4
      )
      .forEach(
        targetRow => {

          const target =
            targetRow.querySelector(
              "[data-v64-weight]"
            );


          if (!target) {

            return;

          }


          const previousAuto =
            target.dataset
              .v992AutoWeight
            ??
            target.dataset
              .v941AutoWeight
            ??
            "";


          const canUpdate =
            target.value ===
              ""
            ||
            target.value ===
              previousAuto;


          if (
            !canUpdate
          ) {

            return;

          }


          target.value =
            value;


          target.dataset
            .v992AutoWeight =
            value;


          /*
            Keep old v9.41 tracking in sync
            as well so the two layers agree.
          */

          target.dataset
            .v941AutoWeight =
            value;


          target.dispatchEvent(
            new Event(
              "input",
              {
                bubbles:true
              }
            )
          );

        }
      );


    updateCopyNote(
      card
    );

  }


  /* =========================================
     NOTE
     ========================================= */

  function updateCopyNote(
    card
  ) {

    const note =
      card.querySelector(
        ".mana-v941-copy-note"
      );


    if (note) {

      note.textContent =
        "Set 1 weight carries into Sets 2, 3 and 4.";

    }

  }


  function updateAllNotes() {

    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        updateCopyNote
      );

  }


  /* =========================================
     INITIAL SET 4 REPAIR
     ========================================= */

  function initialiseFourthSet() {

    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        card => {

          const rows =
            rowsForCard(
              card
            );


          if (
            rows.length < 4
          ) {

            return;

          }


          const set1 =
            rows[0]
              ?.querySelector(
                "[data-v64-weight]"
              );


          const set4 =
            rows[3]
              ?.querySelector(
                "[data-v64-weight]"
              );


          if (
            !set1 ||
            !set4
          ) {

            return;

          }


          /*
            If Set 4 is empty when the workout
            opens, make it match Set 1.
          */

          if (
            set1.value &&
            !set4.value
          ) {

            set4.value =
              set1.value;


            set4.dataset
              .v992AutoWeight =
              set1.value;


            set4.dataset
              .v941AutoWeight =
              set1.value;


            set4.dispatchEvent(
              new Event(
                "input",
                {
                  bubbles:true
                }
              )
            );

          }


          updateCopyNote(
            card
          );

        }
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

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


        syncSetOneWeight(
          input
        );

      },
      true
    );


    document.addEventListener(
      "click",
      event => {

        /*
          Workout open / add-set paths can
          create Set 4 after this file has
          initially loaded.
        */

        if (
          event.target.closest(
            ".mana-v85-start, " +
            "[data-v64-add], " +
            ".mana-v971-nav-btn"
          )
        ) {

          setTimeout(
            initialiseFourthSet,
            80
          );


          setTimeout(
            updateAllNotes,
            120
          );

        }

      },
      true
    );


    [
      "mana:workout-progress-change",
      "mana:strength-synced"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            () => {

              setTimeout(
                initialiseFourthSet,
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


    setTimeout(
      () => {

        initialiseFourthSet();

        updateAllNotes();

      },
      250
    );


    window.MANA_STRENGTH_FINAL_POLISH_BUILD =
      BUILD;


    console.log(
      "[Mana v9.92.0] " +
      "Set 4 weight + smaller arrows ready"
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
