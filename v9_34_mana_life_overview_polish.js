/* =========================================
   MANA MOVEMENT TRAINING v9.34.4
   MANA LIFE — OVERVIEW POLISH

   PURPOSE:
   - Tighten Overview spacing
   - Improve phone + laptop margins
   - Remove yellow line from affirmation
   - Keep yellow line on whakataukī
   - Align hero, affirmation and whakataukī text
   - Keep readable text sizes
   - Does NOT affect Routine / Reclaim /
     Progress / Learn
   - Does NOT affect Mana Strength / Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93440";

  const STYLE_ID =
    "mana-v934-life-overview-style";

  const OVERVIEW_CLASS =
    "mana-v934-life-overview";


  function lifeOverviewOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    const activeTab =
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab;


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA LIFE" &&

      (
        !activeTab ||
        activeTab ===
          "overview"
      )

    );
  }


  function injectStyles() {
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

      /*
        OVERVIEW ONLY
      */

      #manaV83ProgramShell
      .${OVERVIEW_CLASS}{
        padding-top:0;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-hero{
        margin:
          4px
          0
          9px;

        padding:
          22px
          20px;
      }


      /*
        AFFIRMATION

        No yellow line.
        No extra left padding.
        Text therefore starts on the same
        line as the hero text.
      */

      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-affirmation{
        margin-top:13px;

        border-left:none;

        padding:
          15px
          0;
      }


      /*
        WHAKATAUKĪ

        Keep the 4px yellow line.

        4px border + 16px left padding
        = 20px total.

        That matches the hero text
        and affirmation text line.
      */

      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-whakatauki{
        margin:
          9px
          0;

        padding:
          15px
          0
          15px
          16px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-card{
        margin:
          9px
          0;

        padding:
          17px
          18px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-grid{
        margin:
          9px
          0;

        gap:9px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-stat{
        padding:
          14px
          16px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-progress-row{
        margin:
          12px
          0
          7px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-primary,

      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-secondary{
        margin-top:11px;
      }


      /*
        LAPTOP / LARGER SCREEN
      */

      @media(
        min-width:700px
      ){

        #manaV83ProgramShell
        .mana-v83-shell:has(
          .${OVERVIEW_CLASS}
        ){
          width:
            min(
              620px,
              100%
            );
        }

      }


      /*
        PHONE
      */

      @media(
        max-width:560px
      ){

        #manaV83ProgramShell:has(
          .${OVERVIEW_CLASS}
        ){
          padding-left:12px;
          padding-right:12px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-hero{
          margin-top:0;

          padding:
            19px
            16px;

          border-radius:
            20px;
        }


        /*
          Affirmation follows the same
          16px text line as the hero.
        */

        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-affirmation{
          margin-top:12px;

          border-left:none;

          padding:
            14px
            0;
        }


        /*
          4px yellow border + 12px padding
          = same 16px text line.
        */

        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-whakatauki{
          margin:
            8px
            0;

          padding:
            14px
            0
            14px
            12px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-card{
          margin:
            8px
            0;

          padding:
            16px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-grid{
          margin:
            8px
            0;
        }

      }


      /*
        VERY NARROW PHONE
      */

      @media(
        max-width:390px
      ){

        #manaV83ProgramShell:has(
          .${OVERVIEW_CLASS}
        ){
          padding-left:10px;
          padding-right:10px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-hero{
          padding:
            18px
            15px;
        }


        /*
          Hero text begins 15px in.

          4px yellow border +
          11px padding = 15px.
        */

        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-whakatauki{
          padding-left:11px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-card{
          padding:
            15px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-grid{
          gap:8px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function applyOverviewClass() {
    const root =
      document.getElementById(
        "manaV933Life"
      );


    if (!root) {
      return;
    }


    root.classList.remove(
      OVERVIEW_CLASS
    );


    if (
      lifeOverviewOpen()
    ) {

      root.classList.add(
        OVERVIEW_CLASS
      );

    }
  }


  function refresh(
    delay = 30
  ) {
    setTimeout(
      applyOverviewClass,
      delay
    );
  }


  function init() {
    injectStyles();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        refresh(
          30
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        refresh(
          40
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Life"
          )
        ) {

          refresh(
            120
          );

        }

      },
      true
    );


    refresh(
      100
    );
  }


  window.MANA_LIFE_OVERVIEW_POLISH_BUILD =
    BUILD;


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
