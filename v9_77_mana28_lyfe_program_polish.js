/* =========================================
   MANA MOVEMENT TRAINING v9.77.0
   MANA 28 + MANA LYFE PROGRAM POLISH

   - BIGGER PROGRAM TEXT
   - BETTER MOBILE READABILITY
   - TOP RIGHT = OVERVIEW
   - OVERVIEW RETURNS TO PROGRAM OVERVIEW
   - HOME ONLY FROM OVERVIEW
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97700";

  const STYLE_ID =
    "mana-v977-program-polish-style";


  function currentProgram() {

    const title =
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
      "";


    if (
      title === "MANA 28"
    ) {

      return "mana28";

    }


    if (
      title === "MANA LIFE" ||
      title === "MANA LYFE"
    ) {

      return "lyfe";

    }


    return "";
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


  function programTab() {

    const program =
      currentProgram();


    return (
      program === "mana28"
        ? "program"
        : program === "lyfe"
          ? "routine"
          : ""
    );
  }


  function openOverview() {

    document
      .querySelector(
        '#manaV83Tabs [data-v83-tab="overview"]'
      )
      ?.click();
  }


  /* =========================================
     TEXT SIZE
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

      /* PROGRAM HEADING */

      #manaV83ProgramShell
      .mana-v973-program-head
      .mana-v973-kicker{

        font-size:
          13px !important;

        line-height:
          1.4 !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head h2{

        font-size:
          30px !important;

        line-height:
          1.08 !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head p{

        font-size:
          15px !important;

        line-height:
          1.5 !important;
      }


      /* DAY HEADER */

      #manaV83ProgramShell
      .mana-v973-day-number{

        font-size:
          13px !important;

        line-height:
          1.4 !important;
      }


      #manaV83ProgramShell
      .mana-v973-day h3{

        font-size:
          32px !important;

        line-height:
          1.08 !important;
      }


      #manaV83ProgramShell
      .mana-v973-type{

        font-size:
          14px !important;

        line-height:
          1.4 !important;
      }


      /* EXERCISES */

      #manaV83ProgramShell
      .mana-v973-preview-row{

        font-size:
          17px !important;

        line-height:
          1.35 !important;

        padding:
          10px 3px !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:first-child{

        font-weight:
          850 !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:last-child{

        font-size:
          15px !important;

        font-weight:
          950 !important;
      }


      /* COMPLETE */

      .mana-v975-complete{

        font-size:
          14px !important;
      }


      /* TOP RIGHT */

      #manaV83Back{

        min-width:
          96px !important;

        font-size:
          13px !important;

        cursor:
          pointer !important;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:700px){

        #manaV83ProgramShell
        .mana-v973-program-head
        .mana-v973-kicker{

          font-size:
            11px !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head h2{

          font-size:
            24px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day-number{

          font-size:
            11px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day h3{

          font-size:
            27px !important;
        }


        #manaV83ProgramShell
        .mana-v973-type{

          font-size:
            12px !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview-row{

          font-size:
            15px !important;

          padding:
            7px 2px !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview-row
        span:last-child{

          font-size:
            14px !important;
        }


        .mana-v975-complete{

          font-size:
            12px !important;
        }


        #manaV83Back{

          min-width:
            88px !important;

          min-height:
            40px !important;

          padding:
            0 11px !important;

          font-size:
            11px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     BACK / OVERVIEW BUTTON
     ========================================= */

  function updateTopButton() {

    const program =
      currentProgram();


    const button =
      document.getElementById(
        "manaV83Back"
      );


    if (
      !program ||
      !button
    ) {

      return;

    }


    const tab =
      activeTab();


    if (
      tab !== "overview"
    ) {

      button.textContent =
        "← Overview";

      button.dataset
        .v977Mode =
        "overview";

    } else {

      button.textContent =
        "← Home";

      button.dataset
        .v977Mode =
        "home";

    }
  }


  function installNavigationRepair() {

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "#manaV83Back"
          );


        if (!button) {

          return;

        }


        const program =
          currentProgram();


        if (!program) {

          return;

        }


        if (
          activeTab() ===
          "overview"
        ) {

          /*
            Let core v8.3 handle
            Overview -> Home.
          */

          return;

        }


        /*
          Stop v8.3 from closing
          the whole program.
        */

        event.preventDefault();

        event.stopImmediatePropagation();


        openOverview();


        setTimeout(
          updateTopButton,
          50
        );

      },
      true
    );
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    installStyles();

    updateTopButton();
  }


  function scheduleRefresh() {

    [
      20,
      100,
      220
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
     INIT
     ========================================= */

  function init() {

    installStyles();

    installNavigationRepair();

    scheduleRefresh();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV80Mana28",
              "#manaV80Life",
              "#manaV83Tabs"
            ].join(",")
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );


    window
      .MANA_28_LYFE_PROGRAM_POLISH_BUILD =
      BUILD;


    console.log(
      "[Mana v9.77.0] program typography + overview nav ready"
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
