/* =========================================
   MANA MOVEMENT TRAINING v9.72.1
   WORKOUT POLISH / STABILITY

   FIXES
   - 1–10 SESSION EFFORT ON PHONE + LAPTOP
   - STOPS MOBILE WEIGHT / REP INPUT AUTO-ZOOM
   - STABILISES CAROUSEL WIDTH
   - CENTRES START / RESUME WORKOUT BUTTONS
   - PRESERVES EXISTING v9.22 FEEDBACK SAVING
   - DOES NOT ALTER v9.71 SWIPE LOGIC
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97210";

  const STYLE_ID =
    "mana-v972-mobile-polish-style";

  const PHONE_QUERY =
    "(max-width:700px)";


  /* =========================================
     HELPERS
     ========================================= */

  function isPhone() {

    return window
      .matchMedia(
        PHONE_QUERY
      )
      .matches;
  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         START / RESUME WORKOUT
         ALL DEVICES
         ===================================== */

      .mana-v85-start{

        display:block !important;

        width:
          calc(
            100% - 36px
          ) !important;

        max-width:
          520px !important;

        margin:
          0
          auto
          18px !important;

        text-align:
          center !important;

        box-sizing:
          border-box !important;
      }


      /* =====================================
         FEEDBACK SCALE
         PHONE + LAPTOP
         ===================================== */

      #manaV922Feedback
      .mana-v922-effort{

        display:grid !important;

        grid-template-columns:
          repeat(
            5,
            minmax(
              0,
              1fr
            )
          ) !important;

        gap:
          7px !important;

        margin-top:
          8px !important;
      }


      #manaV922Feedback
      .mana-v922-effort
      button{

        width:
          100% !important;

        min-width:
          0 !important;

        min-height:
          42px !important;

        padding:
          6px
          4px !important;

        border-radius:
          11px !important;

        font-size:
          14px !important;

        font-weight:
          950 !important;

        cursor:
          pointer;
      }


      #manaV922Feedback
      .mana-v922-effort
      button.active{

        border-color:
          #f3d875 !important;

        background:
          #f3d875 !important;

        color:
          #090909 !important;
      }


      .mana-v972-scale-guide{

        display:flex;

        justify-content:
          space-between;

        align-items:
          center;

        gap:
          12px;

        margin-top:
          7px;

        color:
          #777;

        font-size:
          9px;

        font-weight:
          850;

        letter-spacing:
          .04em;

        text-transform:
          uppercase;
      }


      /* =====================================
         MOBILE ONLY
         ===================================== */

      @media(max-width:700px){

        /*
          IMPORTANT:
          iPhone / Safari commonly zooms
          form controls when text is under
          16px.

          Keep every workout form control
          at 16px even though the surrounding
          UI is intentionally compact.
        */

        #manaStrengthV64Workout
        input,

        #manaStrengthV64Workout
        textarea,

        #manaStrengthV64Workout
        select{

          font-size:
            16px !important;

          -webkit-text-size-adjust:
            100% !important;

          box-sizing:
            border-box !important;
        }


        #manaStrengthV64Workout
        .mana-v64-set
        input{

          width:
            100% !important;

          min-width:
            0 !important;

          max-width:
            100% !important;

          min-height:
            38px !important;

          height:
            38px !important;

          padding:
            6px
            4px !important;

          font-size:
            16px !important;

          line-height:
            1 !important;

          text-align:
            center !important;
        }


        /*
          Prevent automatic browser text
          resizing from changing the workout
          geometry.
        */

        #manaStrengthV64Workout{

          width:
            100% !important;

          max-width:
            100vw !important;

          overflow-x:
            hidden !important;

          -webkit-text-size-adjust:
            100% !important;

          text-size-adjust:
            100% !important;
        }


        #manaStrengthV64Workout
        .mana-v64-shell{

          width:
            100% !important;

          max-width:
            100% !important;

          min-width:
            0 !important;

          box-sizing:
            border-box !important;
        }


        /* ===================================
           HORIZONTAL WORKOUT STABILITY
           =================================== */

        #manaV64Exercises{

          width:
            100% !important;

          min-width:
            0 !important;

          max-width:
            100% !important;

          box-sizing:
            border-box !important;

          overflow-x:
            auto !important;

          overflow-y:
            hidden !important;

          -webkit-overflow-scrolling:
            touch;
        }


        #manaV64Exercises
        .mana-v64-card,

        #manaV64Exercises
        #manaV922Feedback{

          flex:
            0
            0
            100% !important;

          width:
            100% !important;

          min-width:
            100% !important;

          max-width:
            100% !important;

          box-sizing:
            border-box !important;
        }


        /*
          Grid children must be allowed to
          shrink instead of forcing the card
          wider when inputs receive focus.
        */

        #manaV64Exercises
        .mana-v64-table-head,

        #manaV64Exercises
        .mana-v64-set{

          width:
            100% !important;

          min-width:
            0 !important;

          max-width:
            100% !important;

          box-sizing:
            border-box !important;
        }


        #manaV64Exercises
        .mana-v64-set > *,

        #manaV64Exercises
        .mana-v64-table-head > *{

          min-width:
            0 !important;
        }


        /* ===================================
           START / RESUME BUTTON
           =================================== */

        .mana-v85-start{

          display:block !important;

          width:
            calc(
              100% - 28px
            ) !important;

          max-width:
            none !important;

          min-height:
            48px !important;

          margin:
            0
            auto
            14px !important;

          text-align:
            center !important;
        }


        /* ===================================
           FEEDBACK SCALE ON PHONE
           =================================== */

        #manaV922Feedback
        .mana-v922-effort{

          grid-template-columns:
            repeat(
              5,
              minmax(
                0,
                1fr
              )
            ) !important;

          gap:
            5px !important;
        }


        #manaV922Feedback
        .mana-v922-effort
        button{

          min-height:
            38px !important;

          padding:
            4px
            2px !important;

          font-size:
            13px !important;
        }


        #manaV922Feedback
        .mana-v922-note{

          min-height:
            82px !important;

          font-size:
            16px !important;

          line-height:
            1.35 !important;
        }


        .mana-v972-scale-guide{

          margin-top:
            5px;

          font-size:
            8px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     1–10 FEEDBACK

     IMPORTANT:
     THIS NOW RUNS ON ALL SCREEN SIZES
     ========================================= */

  function upgradeFeedbackScale() {

    const wrap =
      document
        .getElementById(
          "manaV922Feedback"
        );


    const effort =
      document
        .getElementById(
          "manaV922Effort"
        );


    if (
      !wrap ||
      !effort
    ) {

      return;
    }


    /*
      Already converted.
    */

    if (
      effort.dataset
        .v972Build ===
      BUILD
    ) {

      return;
    }


    /*
      Capture an existing selection if this
      function happens to rerun.
    */

    const selected =
      effort
        .querySelector(
          "[data-v922-effort].active"
        )
        ?.dataset
        ?.v922Effort ||
      "";


    effort.innerHTML =
      Array
        .from(
          {
            length:10
          },
          (
            _,
            index
          ) => {

            const value =
              String(
                index + 1
              );


            return `

              <button
                type="button"
                data-v922-effort="${value}"
                aria-label="
                  Session effort
                  ${value}
                  out of 10
                "
              >
                ${value}
              </button>

            `;

          }
        )
        .join("");


    /*
      v9.22 reads the active button and its
      data-v922-effort value when the native
      Complete Workout button is triggered.

      Therefore we keep exactly that format.
    */

    effort
      .querySelectorAll(
        "[data-v922-effort]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              effort
                .querySelectorAll(
                  "[data-v922-effort]"
                )
                .forEach(
                  item => {

                    item.classList
                      .remove(
                        "active"
                      );

                  }
                );


              button.classList
                .add(
                  "active"
                );

            }
          );


          if (
            button.dataset
              .v922Effort ===
            selected
          ) {

            button.classList
              .add(
                "active"
              );
          }

        }
      );


    /*
      Add simple explanation.
    */

    let guide =
      wrap.querySelector(
        ".mana-v972-scale-guide"
      );


    if (!guide) {

      guide =
        document.createElement(
          "div"
        );


      guide.className =
        "mana-v972-scale-guide";


      guide.innerHTML = `

        <span>
          1 • VERY EASY
        </span>

        <span>
          10 • MAX EFFORT
        </span>

      `;


      effort
        .insertAdjacentElement(
          "afterend",
          guide
        );
    }


    /*
      Update the existing label.
    */

    [
      ...wrap
        .querySelectorAll(
          ".mana-v922-label"
        )
    ]
      .forEach(
        label => {

          const text =
            label
              .textContent
              ?.trim()
              ?.toLowerCase() ||
            "";


          if (
            text.includes(
              "session effort"
            )
          ) {

            label.textContent =
              "Session effort • 1–10";

          }

        }
      );


    effort.dataset
      .v972Build =
      BUILD;
  }


  /* =========================================
     CENTRE PROGRAM START BUTTONS
     ========================================= */

  function centreStartButtons() {

    document
      .querySelectorAll(
        ".mana-v85-start"
      )
      .forEach(
        button => {

          button.style
            .setProperty(
              "display",
              "block",
              "important"
            );


          button.style
            .setProperty(
              "margin-left",
              "auto",
              "important"
            );


          button.style
            .setProperty(
              "margin-right",
              "auto",
              "important"
            );


          button.style
            .setProperty(
              "text-align",
              "center",
              "important"
            );

        }
      );
  }


  /* =========================================
     MOBILE INPUT STABILITY
     ========================================= */

  function stabiliseMobileInputs() {

    if (
      !isPhone()
    ) {

      return;
    }


    document
      .querySelectorAll(
        "#manaStrengthV64Workout " +
        "input, " +
        "#manaStrengthV64Workout " +
        "textarea, " +
        "#manaStrengthV64Workout " +
        "select"
      )
      .forEach(
        field => {

          /*
            Inline important rule gives us
            another layer of protection from
            older workout styles.
          */

          field.style
            .setProperty(
              "font-size",
              "16px",
              "important"
            );


          field.style
            .setProperty(
              "box-sizing",
              "border-box",
              "important"
            );

        }
      );
  }


  /* =========================================
     CAROUSEL WIDTH STABILITY
     ========================================= */

  function stabiliseCarousel() {

    if (
      !isPhone()
    ) {

      return;
    }


    const holder =
      document
        .getElementById(
          "manaV64Exercises"
        );


    if (!holder) {

      return;
    }


    holder.style
      .setProperty(
        "width",
        "100%",
        "important"
      );


    holder.style
      .setProperty(
        "max-width",
        "100%",
        "important"
      );


    /*
      Keep every horizontal page exactly
      one holder-width wide.
    */

    [
      ...holder
        .querySelectorAll(
          ".mana-v64-card, " +
          "#manaV922Feedback"
        )
    ]
      .forEach(
        page => {

          page.style
            .setProperty(
              "flex",
              "0 0 100%",
              "important"
            );


          page.style
            .setProperty(
              "width",
              "100%",
              "important"
            );


          page.style
            .setProperty(
              "min-width",
              "100%",
              "important"
            );


          page.style
            .setProperty(
              "max-width",
              "100%",
              "important"
            );

        }
      );
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    centreStartButtons();

    upgradeFeedbackScale();

    stabiliseMobileInputs();

    stabiliseCarousel();
  }


  function scheduleRefresh() {

    [
      0,
      80,
      220,
      500,
      900,
      1500
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );
  }


  /* =========================================
     WATCH DYNAMIC CONTENT
     ========================================= */

  function watchClicks() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              ".mana-v85-start",
              "[data-v85-day]",
              "#manaV971Next",
              "#manaV971Previous",
              "[data-v971-index]",
              ".mana-v970-action"
            ].join(",")
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );
  }


  function watchFocus() {

    /*
      Apply the 16px rule BEFORE focus
      reaches a workout input wherever
      possible.
    */

    document.addEventListener(
      "pointerdown",
      event => {

        if (
          !isPhone()
        ) {

          return;
        }


        const field =
          event.target.closest(
            "#manaStrengthV64Workout " +
            "input, " +
            "#manaStrengthV64Workout " +
            "textarea, " +
            "#manaStrengthV64Workout " +
            "select"
          );


        if (!field) {

          return;
        }


        field.style
          .setProperty(
            "font-size",
            "16px",
            "important"
          );

      },
      true
    );


    document.addEventListener(
      "touchstart",
      event => {

        if (
          !isPhone()
        ) {

          return;
        }


        const field =
          event.target.closest(
            "#manaStrengthV64Workout " +
            "input, " +
            "#manaStrengthV64Workout " +
            "textarea, " +
            "#manaStrengthV64Workout " +
            "select"
          );


        if (!field) {

          return;
        }


        field.style
          .setProperty(
            "font-size",
            "16px",
            "important"
          );

      },
      {
        capture:true,
        passive:true
      }
    );


    document.addEventListener(
      "focusin",
      event => {

        if (
          !isPhone()
        ) {

          return;
        }


        const field =
          event.target;


        if (
          !field.matches(
            "#manaStrengthV64Workout " +
            "input, " +
            "#manaStrengthV64Workout " +
            "textarea, " +
            "#manaStrengthV64Workout " +
            "select"
          )
        ) {

          return;
        }


        field.style
          .setProperty(
            "font-size",
            "16px",
            "important"
          );


        /*
          Reassert carousel geometry after
          the mobile keyboard starts opening.
        */

        setTimeout(
          stabiliseCarousel,
          50
        );


        setTimeout(
          stabiliseCarousel,
          250
        );

      },
      true
    );
  }


  /* =========================================
     VISUAL VIEWPORT

     Keyboard opening changes the visual
     viewport on mobile. Reassert widths
     without resetting carousel position.
     ========================================= */

  function watchVisualViewport() {

    if (
      !window.visualViewport
    ) {

      return;
    }


    window
      .visualViewport
      .addEventListener(
        "resize",
        () => {

          if (
            isPhone()
          ) {

            stabiliseMobileInputs();

            stabiliseCarousel();
          }

        }
      );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    watchClicks();

    watchFocus();

    watchVisualViewport();


    [
      "mana:workout-progress-change",
      "mana:workout-feedback-saved",
      "mana:program-tab-change",
      "mana:strength-synced"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            scheduleRefresh
          );

        }
      );


    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );


    window.addEventListener(
      "resize",
      scheduleRefresh
    );


    window.addEventListener(
      "orientationchange",
      scheduleRefresh
    );


    /*
      v9.22 creates feedback dynamically,
      so repeat a few times on initial load.
    */

    scheduleRefresh();


    window
      .MANA_MOBILE_POLISH_BUILD =
      BUILD;


    window
      .refreshManaMobilePolish =
      scheduleRefresh;


    console.log(
      "[Mana v9.72.1] workout polish ready"
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
