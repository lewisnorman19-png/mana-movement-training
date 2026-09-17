/* =========================================
   MANA MOVEMENT TRAINING v6.6
   WORKOUT SUMMARY LAYOUT
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-strength-v66-style";

  const SCREEN_ID =
    "manaStrengthV64Workout";


  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      #${SCREEN_ID}
      .mana-v64-summary{
        display:grid !important;

        grid-template-columns:
          repeat(
            4,
            minmax(0,1fr)
          )
          !important;

        gap:10px !important;

        margin:
          14px
          0
          !important;
      }


      #${SCREEN_ID}
      .mana-v64-stat{
        min-width:0;
        padding:14px;
      }


      #${SCREEN_ID}
      .mana-v64-stat span{
        font-size:10px;
        line-height:1.25;
      }


      #${SCREEN_ID}
      .mana-v64-stat strong{
        font-size:21px;
      }


      .mana-v66-sub{
        display:block;

        margin-top:4px;

        color:#777;

        font-size:10px;

        line-height:1.25;
      }


      @media(
        max-width:700px
      ){
        #${SCREEN_ID}
        .mana-v64-summary{
          grid-template-columns:
            1fr
            1fr
            !important;
        }
      }


      @media(
        max-width:360px
      ){
        #${SCREEN_ID}
        .mana-v64-stat{
          padding:12px;
        }

        #${SCREEN_ID}
        .mana-v64-stat strong{
          font-size:19px;
        }
      }

    `;

    document.head.appendChild(
      style
    );
  }


  function rebuildSummary() {
    const summary =
      document.querySelector(
        `#${SCREEN_ID} ` +
        ".mana-v64-summary"
      );

    if (!summary) return;


    /*
      Use the v6.4 IDs directly.
      v6.4 continues controlling all
      timer / progress / volume logic.
    */

    summary.innerHTML = `

      <div class="mana-v64-stat">

        <span>
          Workout complete
        </span>

        <strong
          id="manaV64Percent"
        >
          0%
        </strong>

        <small
          class="mana-v66-sub"
        >
          Overall progress
        </small>

      </div>


      <div class="mana-v64-stat">

        <span>
          Elapsed time
        </span>

        <strong
          id="manaV64Timer"
        >
          00:00
        </strong>

        <small
          class="mana-v66-sub"
        >
          Target 45–60 min
        </small>

      </div>


      <div class="mana-v64-stat">

        <span>
          Sets complete
        </span>

        <strong
          id="manaV64Sets"
        >
          0 / 0
        </strong>

        <small
          class="mana-v66-sub"
        >
          Completed / total
        </small>

      </div>


      <div class="mana-v64-stat">

        <span>
          Total volume
        </span>

        <strong
          id="manaV64Volume"
        >
          0 kg
        </strong>

        <small
          class="mana-v66-sub"
        >
          Completed sets only
        </small>

      </div>

    `;
  }


  function workoutIsOpen() {
    return Boolean(
      document
        .getElementById(
          SCREEN_ID
        )
        ?.classList
        .contains(
          "open"
        )
    );
  }


  function handleWorkoutOpen() {
    const screen =
      document.getElementById(
        SCREEN_ID
      );

    if (!screen) return;

    let wasOpen =
      screen.classList
        .contains(
          "open"
        );


    const observer =
      new MutationObserver(
        () => {

          const isOpen =
            screen.classList
              .contains(
                "open"
              );


          if (
            isOpen &&
            !wasOpen
          ) {
            rebuildSummary();

            /*
              Ask the main logger to refresh
              immediately after rebuilding
              the summary elements.
            */

            setTimeout(
              () => {

                /*
                  Triggering an input event
                  makes v6.4 refresh if any
                  inputs exist.
                */

                const input =
                  screen.querySelector(
                    "[data-v64-weight]"
                  );

                input?.dispatchEvent(
                  new Event(
                    "input",
                    {
                      bubbles:true
                    }
                  )
                );

              },
              20
            );
          }


          wasOpen =
            isOpen;

        }
      );


    observer.observe(
      screen,
      {
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }


  function init() {
    injectStyles();

    rebuildSummary();

    handleWorkoutOpen();


    if (
      workoutIsOpen()
    ) {
      rebuildSummary();
    }
  }


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
