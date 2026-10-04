/* =========================================
   MANA MOVEMENT TRAINING v9.79.1
   FORCE MOBILE MANA 28 WORKOUT LAYOUT

   PHONE ONLY
   - DOES NOT ALTER LAPTOP
   - DIRECT INLINE !IMPORTANT OVERRIDES
   - REAPPLIES AFTER PROGRAM RENDER
   - NATURAL VERTICAL PAGE HEIGHT
   - HORIZONTAL DAY SWIPE
   - NO INNER EXERCISE SCROLL
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97910";

  let applyTimer = null;


  function isPhone() {

    return (
      window.innerWidth <= 700 ||
      window.matchMedia(
        "(max-width:700px)"
      ).matches
    );
  }


  function important(
    element,
    property,
    value
  ) {

    if (!element) {
      return;
    }

    element.style.setProperty(
      property,
      value,
      "important"
    );
  }


  function isManaWorkoutOpen() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );

    const programTitle =
      (
        title?.textContent || ""
      )
        .trim()
        .toUpperCase();

    return Boolean(

      shell
        ?.classList
        .contains("open")

      &&

      (
        programTitle === "MANA 28" ||
        programTitle === "MANA LYFE" ||
        programTitle === "MANA LIFE"
      )

      &&

      (
        tab?.dataset?.v83Tab === "program" ||
        tab?.dataset?.v83Tab === "routine"
      )

    );
  }


  function forceMobileLayout() {

    if (
      !isPhone() ||
      !isManaWorkoutOpen()
    ) {

      return;
    }


    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const inner =
      shell?.querySelector(
        ".mana-v83-shell"
      );

    const head =
      shell?.querySelector(
        ".mana-v83-head"
      );

    const content =
      document.getElementById(
        "manaV83Content"
      );

    const programHead =
      document.querySelector(
        ".mana-v978-program-head"
      );

    const days =
      document.getElementById(
        "manaV978Days"
      );


    /* =====================================
       OUTER SHELL
       ===================================== */

    important(
      shell,
      "display",
      "block"
    );

    important(
      shell,
      "height",
      "auto"
    );

    important(
      shell,
      "min-height",
      "100dvh"
    );

    important(
      shell,
      "max-height",
      "none"
    );

    important(
      shell,
      "overflow-x",
      "hidden"
    );

    important(
      shell,
      "overflow-y",
      "auto"
    );

    important(
      shell,
      "padding-top",
      "calc(env(safe-area-inset-top) + 8px)"
    );

    important(
      shell,
      "padding-left",
      "10px"
    );

    important(
      shell,
      "padding-right",
      "10px"
    );

    important(
      shell,
      "padding-bottom",
      "calc(96px + env(safe-area-inset-bottom))"
    );


    /* =====================================
       INNER SHELL
       ===================================== */

    important(
      inner,
      "width",
      "100%"
    );

    important(
      inner,
      "height",
      "auto"
    );

    important(
      inner,
      "min-height",
      "0"
    );

    important(
      inner,
      "max-height",
      "none"
    );

    important(
      inner,
      "display",
      "block"
    );

    important(
      inner,
      "overflow",
      "visible"
    );


    /* =====================================
       HEADER
       ===================================== */

    important(
      head,
      "margin-bottom",
      "6px"
    );


    /* =====================================
       CONTENT
       ===================================== */

    important(
      content,
      "display",
      "block"
    );

    important(
      content,
      "height",
      "auto"
    );

    important(
      content,
      "min-height",
      "0"
    );

    important(
      content,
      "max-height",
      "none"
    );

    important(
      content,
      "overflow",
      "visible"
    );


    /* =====================================
       PROGRAM HEADER
       ===================================== */

    if (programHead) {

      important(
        programHead,
        "margin",
        "0 0 6px"
      );

      const kicker =
        programHead.querySelector(
          ".mana-v978-kicker"
        );

      const h2 =
        programHead.querySelector(
          "h2"
        );

      const p =
        programHead.querySelector(
          "p"
        );

      important(
        kicker,
        "font-size",
        "11px"
      );

      important(
        h2,
        "font-size",
        "21px"
      );

      important(
        h2,
        "margin",
        "2px 0"
      );

      important(
        p,
        "display",
        "none"
      );
    }


    /* =====================================
       DAY CAROUSEL
       ===================================== */

    important(
      days,
      "display",
      "flex"
    );

    important(
      days,
      "width",
      "100%"
    );

    important(
      days,
      "height",
      "auto"
    );

    important(
      days,
      "min-height",
      "0"
    );

    important(
      days,
      "max-height",
      "none"
    );

    important(
      days,
      "align-items",
      "flex-start"
    );

    important(
      days,
      "overflow-x",
      "auto"
    );

    important(
      days,
      "overflow-y",
      "visible"
    );

    important(
      days,
      "scroll-snap-type",
      "x mandatory"
    );


    /* =====================================
       EACH DAY CARD
       ===================================== */

    document
      .querySelectorAll(
        ".mana-v978-day"
      )
      .forEach(
        card => {

          important(
            card,
            "flex",
            "0 0 100%"
          );

          important(
            card,
            "width",
            "100%"
          );

          important(
            card,
            "min-width",
            "100%"
          );

          important(
            card,
            "max-width",
            "100%"
          );

          important(
            card,
            "height",
            "auto"
          );

          important(
            card,
            "min-height",
            "0"
          );

          important(
            card,
            "max-height",
            "none"
          );

          important(
            card,
            "align-self",
            "flex-start"
          );

          important(
            card,
            "overflow",
            "visible"
          );

          important(
            card,
            "padding",
            "13px 14px 12px"
          );

          important(
            card,
            "border-radius",
            "18px"
          );


          const dayNumber =
            card.querySelector(
              ".mana-v978-day-number"
            );

          const title =
            card.querySelector(
              "h3"
            );

          const type =
            card.querySelector(
              ".mana-v978-type"
            );

          const preview =
            card.querySelector(
              ".mana-v978-preview"
            );

          const complete =
            card.querySelector(
              ".mana-v978-complete"
            );


          important(
            dayNumber,
            "font-size",
            "11px"
          );

          important(
            dayNumber,
            "line-height",
            "1.2"
          );


          important(
            title,
            "font-size",
            "27px"
          );

          important(
            title,
            "line-height",
            "1.03"
          );

          important(
            title,
            "margin",
            "5px 0 2px"
          );


          important(
            type,
            "font-size",
            "13px"
          );

          important(
            type,
            "line-height",
            "1.2"
          );


          /* =================================
             EXERCISE AREA
             ================================= */

          important(
            preview,
            "height",
            "auto"
          );

          important(
            preview,
            "min-height",
            "0"
          );

          important(
            preview,
            "max-height",
            "none"
          );

          important(
            preview,
            "flex",
            "none"
          );

          important(
            preview,
            "overflow",
            "visible"
          );

          important(
            preview,
            "margin",
            "8px 0 10px"
          );


          /* =================================
             EXERCISE ROWS
             ================================= */

          card
            .querySelectorAll(
              ".mana-v978-row"
            )
            .forEach(
              row => {

                important(
                  row,
                  "height",
                  "auto"
                );

                important(
                  row,
                  "min-height",
                  "0"
                );

                important(
                  row,
                  "flex",
                  "none"
                );

                important(
                  row,
                  "display",
                  "grid"
                );

                important(
                  row,
                  "grid-template-columns",
                  "minmax(0,1fr) minmax(92px,auto)"
                );

                important(
                  row,
                  "align-items",
                  "center"
                );

                important(
                  row,
                  "gap",
                  "8px"
                );

                important(
                  row,
                  "padding",
                  "10px 1px"
                );

                important(
                  row,
                  "font-size",
                  "16px"
                );

                important(
                  row,
                  "line-height",
                  "1.2"
                );


                const left =
                  row.children[0];

                const right =
                  row.children[1];


                important(
                  left,
                  "font-size",
                  "16px"
                );

                important(
                  left,
                  "line-height",
                  "1.2"
                );


                important(
                  right,
                  "font-size",
                  "15px"
                );

                important(
                  right,
                  "line-height",
                  "1.15"
                );

                important(
                  right,
                  "white-space",
                  "normal"
                );

                important(
                  right,
                  "text-align",
                  "right"
                );

              }
            );


          /* =================================
             COMPLETE DAY
             ================================= */

          important(
            complete,
            "height",
            "auto"
          );

          important(
            complete,
            "min-height",
            "48px"
          );

          important(
            complete,
            "flex",
            "none"
          );

          important(
            complete,
            "margin",
            "0"
          );

          important(
            complete,
            "font-size",
            "13px"
          );

        }
      );


    /* =====================================
       HIDE DESKTOP DAY NAV
       ===================================== */

    document
      .querySelectorAll(
        ".mana-v978-daynav"
      )
      .forEach(
        nav => {

          important(
            nav,
            "display",
            "none"
          );

        }
      );


    document.documentElement
      .dataset
      .manaMobileWorkout =
      BUILD;
  }


  function scheduleApply() {

    clearTimeout(
      applyTimer
    );


    [
      0,
      60,
      180,
      400
    ]
      .forEach(
        delay => {

          setTimeout(
            forceMobileLayout,
            delay
          );

        }
      );
  }


  function init() {

    scheduleApply();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleApply
    );


    window.addEventListener(
      "resize",
      scheduleApply
    );


    window.addEventListener(
      "orientationchange",
      scheduleApply
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Mana28," +
            "#manaV80Life," +
            "#manaV83Tabs"
          )
        ) {

          scheduleApply();

        }

      },
      true
    );


    window.MANA_MOBILE_WORKOUT_BUILD =
      BUILD;


    console.log(
      "[Mana v9.79.1] forced mobile workout layout ready"
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
