/* =========================================
   MANA MOVEMENT TRAINING v9.72.0
   MOBILE WORKOUT POLISH

   - PREVENTS PHONE INPUT AUTO-ZOOM
   - KEEPS CAROUSEL DIMENSIONS STABLE
   - CENTRES START / RESUME WORKOUT BUTTON
   - SESSION EFFORT CHANGES TO 1–10
   - USES EXISTING v9.22 FEEDBACK STORAGE
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "97200";

  const STYLE_ID =
    "mana-v972-mobile-polish-style";

  const PHONE_QUERY =
    "(max-width:700px)";


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

         Centre this regardless of previous
         card styling.
         ===================================== */

      .mana-v85-start{

        display:block !important;

        width:
          calc(
            100% - 36px
          ) !important;

        max-width:
          520px;

        margin:
          0
          auto
          18px !important;

        text-align:
          center !important;
      }


      @media(max-width:700px){

        /* ===================================
           STOP iPHONE / MOBILE INPUT ZOOM

           Browsers such as Safari can zoom
           automatically when form controls
           are below 16px.
           =================================== */

        #manaStrengthV64Workout
        input,

        #manaStrengthV64Workout
        textarea,

        #manaStrengthV64Workout
        select{

          font-size:
            16px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-set input{

          font-size:
            16px !important;

          line-height:
            1 !important;

          min-height:
            38px !important;
        }


        /*
          Keep browser text resizing from
          changing our workout dimensions.
        */

        #manaStrengthV64Workout{

          -webkit-text-size-adjust:
            100%;

          text-size-adjust:
            100%;
        }


        #manaV64Exercises{

          max-width:
            100% !important;
        }


        #manaV64Exercises
        .mana-v64-card,

        #manaV64Exercises
        #manaV922Feedback{

          box-sizing:
            border-box !important;

          min-width:
            calc(
              100% - 1px
            ) !important;

          max-width:
            calc(
              100% - 1px
            ) !important;
        }


        /* ===================================
           CENTRE START BUTTON ON PHONE
           =================================== */

        .mana-v85-start{

          width:
            calc(
              100% - 28px
            ) !important;

          margin:
            0
            auto
            14px !important;

          min-height:
            48px !important;

          text-align:
            center !important;
        }


        /* ===================================
           1–10 SESSION EFFORT
           =================================== */

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
            6px !important;

          margin-top:
            7px !important;
        }


        #manaV922Feedback
        .mana-v922-effort
        button{

          width:
            100% !important;

          min-width:
            0 !important;

          min-height:
            38px !important;

          padding:
            4px !important;

          border-radius:
            10px !important;

          font-size:
            13px !important;

          font-weight:
            950 !important;
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
            10px;

          margin-top:
            6px;

          color:
            #777;

          font-size:
            9px;

          font-weight:
            800;

          letter-spacing:
            .04em;

          text-transform:
            uppercase;
        }


        /* textarea stays readable without
           browser zoom but remains compact */

        #manaV922Feedback
        .mana-v922-note{

          font-size:
            16px !important;

          min-height:
            84px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     1–10 FEEDBACK SCALE
     ========================================= */

  function upgradeFeedbackScale() {

    if (
      !isPhone()
    ) {

      return;
    }


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


    if (
      effort.dataset
        .v972Ready ===
      "1"
    ) {

      return;
    }


    /*
      Replace Easy / Solid / Hard / Max
      with actual 1–10 effort values.

      v9.22 reads:
      [data-v922-effort].active

      so we're preserving that same data
      structure and the same saved field.
    */

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
              index + 1;


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


    effort
      .querySelectorAll(
        "[data-v922-effort]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
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

        }
      );


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
          1 • EASY
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
      Update label wording slightly.
    */

    const labels =
      [
        ...wrap
          .querySelectorAll(
            ".mana-v922-label"
          )
      ];


    labels.forEach(
      label => {

        if (
          label.textContent
            ?.toLowerCase()
            .includes(
              "session effort"
            )
        ) {

          label.textContent =
            "Session effort • 1–10";

        }

      }
    );


    effort.dataset
      .v972Ready =
      "1";
  }


  /* =========================================
     CENTRE START BUTTONS
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

        }
      );
  }


  /* =========================================
     KEEP WORKOUT WIDTH STABLE
     ========================================= */

  function stabiliseWorkout() {

    if (
      !isPhone()
    ) {

      return;
    }


    const workout =
      document
        .getElementById(
          "manaStrengthV64Workout"
        );


    if (!workout) {

      return;
    }


    /*
      If the browser has zoomed because of
      an older focused 14px input, blur when
      moving between workout pages.

      We do NOT blur while the user is
      actively typing.
    */

    const active =
      document.activeElement;


    if (
      active &&
      active.matches(
        "#manaStrengthV64Workout input"
      )
    ) {

      return;
    }


    const holder =
      document
        .getElementById(
          "manaV64Exercises"
        );


    if (holder) {

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
    }
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    centreStartButtons();

    upgradeFeedbackScale();

    stabiliseWorkout();
  }


  function scheduleRefresh() {

    [
      50,
      180,
      400,
      850,
      1400
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
     EVENTS
     ========================================= */

  function watchClicks() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".mana-v85-start, " +
            "[data-v85-day], " +
            "#manaV971Next, " +
            "#manaV971Previous"
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );
  }


  function watchFocus() {

    document.addEventListener(
      "focusin",
      event => {

        if (
          !event.target.closest(
            "#manaStrengthV64Workout"
          )
        ) {

          return;
        }


        /*
          Font-size 16px is the important
          anti-auto-zoom fix.
        */

        if (
          event.target.matches(
            "input, textarea, select"
          )
        ) {

          event.target.style
            .setProperty(
              "font-size",
              "16px",
              "important"
            );

        }

      },
      true
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    watchClicks();

    watchFocus();


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


    scheduleRefresh();


    window
      .MANA_MOBILE_POLISH_BUILD =
      BUILD;


    window
      .refreshManaMobilePolish =
      scheduleRefresh;


    console.log(
      "[Mana v9.72.0] mobile workout polish ready"
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
